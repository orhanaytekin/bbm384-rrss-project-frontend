import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import '../../styles/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="user-list-container">
        <h2>Users</h2>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <h3>{user.username}</h3>
              <p>{user.email}</p>
              <p>Role: {user.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default UserList;
