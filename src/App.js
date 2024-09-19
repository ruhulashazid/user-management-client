import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
    return (
        <Router>
            <div className="App" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                textAlign: 'center' 
            }}>
                <Routes>
                    {/* Welcome message at the root route */}
                    <Route path="/" element={
                        <div>
                            <h1>Welcome to User Management</h1>
                            <p>Please register, log in, or manage users.</p>
                        </div>
                    } />

                    {/* Other routes */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/users" element={<UserManagement />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
