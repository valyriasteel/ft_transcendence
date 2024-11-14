function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return false;
  }

  alert("Registration successful!");
}
