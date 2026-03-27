import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Lazy imports
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ServiceRequest = lazy(() => import('./pages/ServiceRequest'));
const BeHelper = lazy(() => import('./pages/BeHelper'));

function App() {
  return (
    <Router>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/service/:categoryName" element={<ServiceRequest />} />
          <Route path="/be-helper" element={<BeHelper />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;
