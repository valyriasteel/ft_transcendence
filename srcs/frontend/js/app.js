document.body.addEventListener('click', async (event) => {
    if (event.target.id === "start-button")
    {
        try {
            const tokenResponse = await fetch('/accounts/test/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            await tokenResponse.json();

            if (tokenResponse.ok) {
                route(null, "/game");
            } else {
                const loginpage = `${window.location.protocol}//${window.location.host}/accounts/loginintra42/`;
                const loginResponse = await fetch(loginpage);
                const loginData = await loginResponse.json();   
                const loginWindow = window.open(loginData.url, 'loginWindow', 'width=600,height=800,scrollbars=yes,resizable=yes, left=${myLeft}' );

                const checkLoginStatus = setInterval(async () => {
                    if (loginWindow.closed) {
                        clearInterval(checkLoginStatus);

                        const response = await fetch('../html/verify-2fa.html');
                        if (response.ok) {
                            route(null, "/verify-2fa");
                        }   
                    }
                }, 1000);
            }

        } catch (error) {
            console.error("Error loading game page:", error);
        }
    }

    if (event.target.id === "submit-2fa")
    {
        event.preventDefault();

        const form = document.getElementById("verifyForm");
        const code = document.getElementById("code").value;
        const email = document.getElementById("email").value;

        const existingMessage = document.getElementById("messageDiv");
    
        if (existingMessage) {
            existingMessage.remove();
        }

        try {
            const verifyApi = `${window.location.protocol}//${window.location.host}/accounts/verify-2fa/`;
            const response = await fetch(verifyApi, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, code }),
            });

            const result = await response.json();

            const messageDiv = document.createElement("div");
            messageDiv.id = "messageDiv";

            if (response.ok) {
                messageDiv.innerHTML = `<p style="color: green;">Verification successful! Redirect to the game page...</p>`;
                form.reset();
                setTimeout(() => {
                    route(null, "/game");
                }, 2000);
            } else {
                const errorMessage = result.error || "An unexpected error occurred.";
                messageDiv.innerHTML = `<p style="color: red;">Error: ${errorMessage}</p>`;
            }

            form.parentNode.appendChild(messageDiv);
        } catch (error) {
            console.error("Verification error:", error);
        }
    }
});

document.body.addEventListener('keydown', async (event) => {
    if (event.key === "Enter" && event.target.id == "code") {
        document.getElementById("submit-2fa").click();
    }
});

function checkCallback() {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {});

    if (cookies.callback_complete === 'true') {
        window.close();
    }
}
checkCallback();