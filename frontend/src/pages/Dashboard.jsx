import React from 'react';
import { useAuth } from '../auth/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Hall Booking Dashboard</h2>

      
      
      <button onClick={logout}>Logout</button>
    </div>
  );
}
