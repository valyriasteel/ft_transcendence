import React from 'react';

function Register({ showLogin }) {
  return (
    <div>
      <h2>Register</h2>
      <form>
        <label>Email</label>
        <input type="email" required />

        <label>Password</label>
        <input type="password" required />

        <label>Confirm Password</label>
        <input type="password" required />

        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a onClick={showLogin}>Login here</a></p>
    </div>
  );
}

export default Register;