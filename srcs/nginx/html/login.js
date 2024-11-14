function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (email === "test@example.com" && password === "password") {
      alert("Login successful!");
  } else {
      alert("Invalid email or password.");
  }
}
