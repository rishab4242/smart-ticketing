import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateEvent from './pages/CreateEvent';
import BuyTicket from './pages/BuyTicket';
import Tickets from './pages/Tickets';
import Scanner from './pages/CheckinScanner';
import MapView from './pages/MapView';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Link to="/" className="font-bold text-xl">Smart Ticketing</Link>
            <nav className="ml-6 flex gap-4">
              <Link to="/" className="text-sm">Home</Link>
              <Link to="/map" className="text-sm">Map</Link>
            </nav>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />

            <Route path="/organizer" element={<ProtectedRoute roles={["organizer"]}><OrganizerDashboard/></ProtectedRoute>} />
            <Route path="/organizer/create" element={<ProtectedRoute roles={["organizer"]}><CreateEvent/></ProtectedRoute>} />

            <Route path="/buy" element={<ProtectedRoute roles={["attendee"]}><BuyTicket/></ProtectedRoute>} />
            <Route path="/tickets" element={<ProtectedRoute roles={["attendee"]}><Tickets/></ProtectedRoute>} />

            <Route path="/scanner" element={<ProtectedRoute roles={["organizer","admin"]}><Scanner/></ProtectedRoute>} />
            <Route path="/map" element={<MapView/>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}