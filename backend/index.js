const express = require('express');
const jsonServer = require('json-server');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');

const app = express();
const jsonServerRouter = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const dbFile = path.join(__dirname, 'db.json');
const SECRET_KEY = 'your-secret-key'; // In production, use env variable

app.use(middlewares);

// --- Custom Auth Routes (use express.json() only here) ---

// Signup route
app.post('/api/signup', express.json(), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = JSON.parse(fs.readFileSync(dbFile));
    const userExists = db.users.find((user) => user.email === email);
    if (userExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: db.users.length + 1,
      username,
      email,
      password: hashedPassword,
    };
    db.users.push(newUser);
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

    const token = jwt.sign({ id: newUser.id, username }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: newUser.id, username, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
app.post('/api/login', express.json(), async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = JSON.parse(fs.readFileSync(dbFile));
    const user = db.users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- JWT Protection Middleware for json-server routes ---
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') {
    return next(); // Allow GET requests without auth
  }
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user to request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// --- Mount json-server router (NO express.json() here!) ---
app.use('/api', jsonServerRouter);

// --- Start the server ---
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
