import React from 'react';

function Login({ showRegister }) {
  return (
    <div>
      <h2>Login</h2>
      <form>
        <label>Email</label>
        <input type="email" required />

        <label>Password</label>
        <input type="password" required />

        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a onClick={showRegister}>Register here</a></p>
    </div>
  );
}

export default Login;