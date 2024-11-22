import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Doctor from './pages/Doctor';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import MyAppointment from './pages/MyAppointement';
import MyProfile from './pages/MyProfile';
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_P_KEY);

function App() {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/doctors/:speciality" element={<Doctor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Only wrap payment-related routes with Elements */}
        <Route path="/appointment/:docId" element={<Elements stripe={stripePromise}><Appointment /></Elements>} />
        <Route path="/my-appointments" element={<Elements stripe={stripePromise}><MyAppointment /></Elements>} />
        
        <Route path="/my-profile" element={<MyProfile />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
