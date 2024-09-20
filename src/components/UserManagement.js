import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button from react-bootstrap
import './css/UserManagement.css'; 
import getCurrentUser from './getCurrentUser';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // State to track if all checkboxes are selected
    const [showModal, setShowModal] = useState(false); // State for controlling the modal
    const [userToDelete, setUserToDelete] = useState(null); // State to track the user selected for deletion
    const navigate = useNavigate(); // Initialize useNavigate
    const [loginUser, setLoginUser] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: { 'authorization': `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const fetchCurrentUser = async () => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${currentUser.id}`, {
                    headers: { 'authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setLoginUser(response.data);
            } catch (error) {
                console.error('Error fetching current user information:', error);
            }
        } else {
            console.log('No user is currently logged in.');
        }
    };
    
    useEffect(() => {
        fetchCurrentUser();
    }, []);
    

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the JWT token
        navigate('/login'); // Redirect to login page
    };

    const handleSelectUser = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            // If already selected, deselect all
            setSelectedUsers([]);
        } else {
            // Otherwise, select all users
            setSelectedUsers(users.map(user => user.id));
        }
        setSelectAll(!selectAll); // Toggle selectAll state
    };

    const handleBlockUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            for (let userId of selectedUsers) {
                await axios.put(`http://localhost:5000/api/users/block/${userId}`, {}, {
                    headers: { 'authorization': `Bearer ${token}` }
                });
            }
            setUsers(users.map(user => selectedUsers.includes(user.id) ? { ...user, status: 'blocked' } : user));
            setSelectedUsers([]);
        } catch (error) {
            console.error('Error blocking users:', error);
        }
    };

    const handleUnblockUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            for (let userId of selectedUsers) {
                await axios.put(`http://localhost:5000/api/users/unblock/${userId}`, {}, {
                    headers: { 'authorization': `Bearer ${token}` }
                });
            }
            setUsers(users.map(user => selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user));
            setSelectedUsers([]);
        } catch (error) {
            console.error('Error unblocking users:', error);
        }
    };

    const handleShowDeleteModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setUserToDelete(null);
    };

    const handleDeleteUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            for (let userId of selectedUsers) {
                await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                    headers: { 'authorization': `Bearer ${token}` }
                });
            }
            setUsers(users.filter(user => !selectedUsers.includes(user.id)));
            setSelectedUsers([]); // Clear the selection after deletion
            handleCloseModal();
        } catch (error) {
            console.error('Error deleting users:', error);
        }
    };
    

    return (
        <div className="container mt-4">
            <div className="header">
                <p>Hello, {loginUser.name}! <a href="#" onClick={handleLogout} className="logout-link">Logout</a></p> {/* Attach the logout function */}
            </div>
            <div className="toolbar mb-3">
                <button className="btn btn-custom me-2 btn-outline-warning" onClick={handleBlockUsers}>
                    <i className="fas fa-lock"></i> Block
                </button>
                <button className="btn btn-custom me-2 btn-outline-success" onClick={handleUnblockUsers}>
                    <i className="fas fa-unlock"></i> Unblock
                </button>
                <button className="btn btn-custom btn btn-outline-danger" onClick={() => handleShowDeleteModal(selectedUsers[0])}>
                    <i className="fas fa-trash-alt"></i> Delete
                </button>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>
                            <input 
                                type="checkbox" 
                                checked={selectAll} 
                                onChange={handleSelectAll} 
                            /> {/* Select all checkbox */}
                        </th>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Registration time</th>
                        <th>Last login time</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, idx) => (
                        <tr key={user.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleSelectUser(user.id)}
                                />
                            </td>
                            <td>{idx + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.registration_time}</td>
                            <td>{user.last_login_time}</td>
                            <td>{user.status === 'blocked' ? (
                                <span className="text-danger">Blocked</span>
                            ) : (
                                <span className="text-success">Active</span>
                            )}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for confirming delete action */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this user?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUsers}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserManagement;
