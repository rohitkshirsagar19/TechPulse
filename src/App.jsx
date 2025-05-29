import Header from './components/Header';
import Footer from './components/Footer';
import PostCard from './components/PostCard';
import { BrowserRouter , Route , Routes } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import NotificationsPage from './pages/NotificationsPage';


function App() {
  return (
    <BrowserRouter>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
          <Route path='/notifications' element={<NotificationsPage/>}/>
        </Routes>
      </main>
      <Footer />
    </div>
    </BrowserRouter>
  );
}
export default App;