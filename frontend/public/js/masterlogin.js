document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
  
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault(); 
  
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const master = document.getElementById('pMkey').value;
        const loginData = {
            email,
            password,
            master
        };
  
        try {
            const response = await fetch('http://localhost:3000/signinon/masterlogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
  
            if (response.ok) {
                const message = await response.text();
                alert(message);
                localStorage.setItem('userEmail', email); // Store user email
                window.location.href = 'http://localhost:3000/welcome.html';
            } else {
                const errorText = await response.text();
                alert(errorText);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An unexpected error occurred.");
        }
    });
  });
  