document.getElementById('verifyForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get the form data
    const email = document.getElementById('email').value;
    const code = document.getElementById('code').value;

    // Clear previous messages
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';

    try {
        // Send POST request to the backend
        const response = await fetch('/accounts/verify-2fa/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });

        const data = await response.json();

        if (response.ok) {
            // Success: Show success message and redirect
            const successMessage = document.createElement('div');
            successMessage.className = 'message success';
            successMessage.textContent = 'Verification successful. Redirecting to homepage...';
            messagesDiv.appendChild(successMessage);

            // Redirect to homepage after 2 seconds
            setTimeout(() => {
                window.location.href = '/html/game.html';
            }, 2000);
        } else {
            // Error: Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'message error';
            errorMessage.textContent = data.error || 'An unknown error occurred.';
            messagesDiv.appendChild(errorMessage);
        }
    } catch (error) {
        // Network or other errors
        const errorMessage = document.createElement('div');
        errorMessage.className = 'message error';
        errorMessage.textContent = 'An error occurred while connecting to the server.';
        messagesDiv.appendChild(errorMessage);
        console.error('Error:', error);
    }
});