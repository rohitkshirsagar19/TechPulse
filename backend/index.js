// backend/index.js
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const dbFile = path.join(__dirname, 'db.json');
const SECRET_KEY = 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Helper functions
const readDb = () => JSON.parse(fs.readFileSync(dbFile));
const writeDb = (data) => fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

// Auth middleware
app.use('/api', (req, res, next) => {
  if (req.method === 'GET' || req.originalUrl === '/api/signup' || req.originalUrl === '/api/login') {
    return next();
  }
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Routes
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const db = readDb();
  const userExists = db.users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: db.users.length + 1, username, email, password: hashedPassword };
  db.users.push(newUser);
  writeDb(db);
  const token = jwt.sign({ id: newUser.id, username }, SECRET_KEY, { expiresIn: '1h' });
  res.status(201).json({ token, user: { id: newUser.id, username, email } });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const db = readDb();
  const user = db.users.find((user) => user.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid Password' });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

app.get('/api/posts', (req, res) => {
  const db = readDb();
  //console.log('Response data:', JSON.stringify(db.posts, null, 2));
  res.json(db.posts);
});

app.post('/api/posts', (req, res) => {
  const { id, title, content, likes, author, comments } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ error: 'Title, content, and author are required' });
  }
  const db = readDb();
  const newPost = { id, title, content, likes: likes || 0, author, comments: comments || [] };
  db.posts.push(newPost);
  writeDb(db);
  // console.log('Emitting new_post notification:', {
  //   type: 'new_post',
  //   message: `New post by ${req.user.username}: ${newPost.title}`,
  //   postId: newPost.id,
  //   username: req.user.username,
  // });
  io.emit('notification', {
    type: 'new_post',
    message: `New post by ${req.user.username}: ${newPost.title}`,
    postId: newPost.id,
    username: req.user.username,
  });
  res.status(201).json(newPost);
});

app.put('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const updatedData = req.body;
  console.log('PUT request for postId:', postId, 'User:', req.user, 'Body:', updatedData);
  const db = readDb();
  const postIndex = db.posts.findIndex((p) => p.id === postId);
  if (postIndex === -1) {
    console.log(`Post not found for ID: ${postId}`);
    return res.status(404).json({ error: 'Post not found' });
  }
  const currentPost = db.posts[postIndex];
  console.log('Current post:', JSON.stringify(currentPost, null, 2));
  const updatedPost = { ...currentPost, ...updatedData };
  db.posts[postIndex] = updatedPost;
  writeDb(db);
  console.log('Response data:', JSON.stringify(updatedPost, null, 2));
  // Emit notifications
  console.log('Likes comparison:', updatedPost.likes, currentPost.likes, updatedPost.likes > (currentPost.likes || 0));
  if (updatedPost.likes > (currentPost.likes || 0)) {
    console.log('Emitting like notification:', {
      type: 'like',
      message: `${req.user.username} liked your post: ${currentPost.title}`,
      postId: currentPost.id,
      username: currentPost.author,
    });
    io.emit('notification', {
      type: 'like',
      message: `${req.user.username} liked your post: ${currentPost.title}`,
      postId: currentPost.id,
      username: currentPost.author,
    });
  }
  console.log('Comments comparison:', updatedPost.comments?.length, (currentPost.comments || []).length, updatedPost.comments?.length > (currentPost.comments || []).length);
  if (updatedPost.comments && updatedPost.comments.length > (currentPost.comments || []).length) {
    const newComment = updatedPost.comments[updatedPost.comments.length - 1];
    console.log('Emitting comment notification:', {
      type: 'comment',
      message: `${req.user.username} commented on your post: ${newComment.text}`,
      postId: currentPost.id,
      username: currentPost.author,
    });
    io.emit('notification', {
      type: 'comment',
      message: `${req.user.username} commented on your post: ${newComment.text}`,
      postId: currentPost.id,
      username: currentPost.author,
    });
  }
  res.json(updatedPost);
});

// Start server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});