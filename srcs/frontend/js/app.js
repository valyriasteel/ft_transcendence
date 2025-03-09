let tempWindow = null;

function createPopupWin(pageURL, pageTitle, popupWinWidth, popupWinHeight)
{
    let left = (screen.width - popupWinWidth) / 2;
    let top = (screen.height - popupWinHeight) / 4;

    let myWindow = window.open(
        pageURL,
        pageTitle,
        'resizable=yes, width=' + popupWinWidth +
        ', height=' + popupWinHeight +
        ', top=' + top +
        ', left=' + left
    );
    return myWindow;
}

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

            const data = await tokenResponse.json();

            if (data.flag) {
                route(null, "/game");
            } else {
                const loginpage = `${window.location.protocol}//${window.location.host}/accounts/loginintra42/`;
                const loginResponse = await fetch(loginpage);
                if (loginResponse.flag === false)
                    return;
                const loginData = await loginResponse.json();   
                tempWindow = createPopupWin(loginData.url, "Login", 800, 600);

                const checkLoginStatus = setInterval(async () => {
                    if (tempWindow.closed) {
                        clearInterval(checkLoginStatus);

                        const response = await fetch('../html/verify-2fa.html');
                        if (response.ok) {
                            route(null, "/verify-2fa");
                        }   
                    }
                }, 1000);
            }
        } catch (error) {
            console.log("Error loading game page:", error);
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

            if (result.flag === true) {
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
            console.log("Verification error:", error);
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
        if (!(tempWindow)) {
            window.close();
        }
    }
}
checkCallback();