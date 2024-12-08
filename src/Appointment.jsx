// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import PatientList from './components/PatientList';
import AppointmentList from './components/AppointmentList';
import AddAppointmentForm from './components/AppointmentForm';
import AddPatientForm from './components/PatientForm';

const Appointment = () => (
    <Router>
    <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/patients">Patients</Link></li>
            <li><Link to="/appointments">Appointments</Link></li>
            <li><Link to="/add-patient">Add Patient</Link></li>
            <li><Link to="/add-appointment">Schedule Appointment</Link></li>
        </ul>
    </nav>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/appointments" element={<AppointmentList />} />
        <Route path="/add-patient" element={<AddPatientForm />} />
        <Route path="/add-appointment" element={<AddAppointmentForm />} />
    </Routes>
</Router>
);

export default Appointment;
