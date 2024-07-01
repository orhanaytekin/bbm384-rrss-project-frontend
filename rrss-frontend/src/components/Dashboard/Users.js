import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'USER' });
  const [editUserId, setEditUserId] = useState(null);
  const [editUserDetails, setEditUserDetails] = useState({ username: '', email: '', role: 'USER', password: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const roles = ['USER', 'MERCHANT', 'COMMUNITY_MANAGER', 'ADMIN'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
          const response = await axios.get('http://localhost:8080/api/auth/users');
          // filter users to exclude ADMINs
            response.data = response.data.filter(user => user.role !== 'ADMIN');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/auth/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdateUser = async (id) => {
      try {
         
        await axios.put(`http://localhost:8080/api/auth/users/${id}`, editUserDetails);
        setUsers(users.map(user => user.id === id ? { ...user, ...editUserDetails } : user));
        setEditUserId(null);
        setEditUserDetails({ username: '', email: '', role: 'USER', password: '' });
          
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', newUser);
      setUsers([...users, response.data]);
      setNewUser({ username: '', email: '', password: '', role: 'USER' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditClick = (user) => {
    setEditUserId(user.id);
    setEditUserDetails({ username: user.username, email: user.email, role: user.role });
  };

  return (
    <div className="users">
      <h2>Users Management</h2>
      <button className="add-user-button" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Cancel' : 'Add New User'}
      </button>
      {showAddForm && (
        <div className="add-user-form">
          <h3>Add New User</h3>
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button onClick={handleAddUser}>Add User</button>
        </div>
      )}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {editUserId === user.id ? (
              <div className="edit-user-form">
                <input
                  type="text"
                  placeholder="Username"
                  value={editUserDetails.username}
                  onChange={(e) => setEditUserDetails({ ...editUserDetails, username: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editUserDetails.email}
                  onChange={(e) => setEditUserDetails({ ...editUserDetails, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={editUserDetails.password}
                  onChange={(e) => setEditUserDetails({ ...editUserDetails, password: e.target.value })}
                />
                <select
                  value={editUserDetails.role}
                  onChange={(e) => setEditUserDetails({ ...editUserDetails, role: e.target.value })}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleUpdateUser(user.id)}>Save</button>
                <button onClick={() => setEditUserId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <button onClick={() => handleEditClick(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
