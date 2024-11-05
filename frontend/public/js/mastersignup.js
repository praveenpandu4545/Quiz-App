const MASTER_KEY = '92984';

document.getElementById('signupForm').addEventListener('submit',async function(event) {
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('error-message');
    event.preventDefault(); // Prevent the form from submitting normally

    // Get values from the form
    const name = document.getElementById('names').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const master = document.getElementById('mkey').value;

    // Validate passwords
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Validate master key
    if (master !== MASTER_KEY) {
        alert("Invalid Master Key!");
        return;
    }

    // If validation is successful
    alert("Sign up successful! Welcome, " + name + "!");
    
    // Optionally, you can reset the form after successful sign-up
    document.getElementById('signupForm').reset();


    const userData = {
        name,
        email,
        mobile,
        password,
        master
    };

    try {
        
        const response = await fetch('http://localhost:3000/signinon/mastersignup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            const message = await response.text();
            alert(message); 
            signupForm.reset(); 
            window.location.href='http://localhost:3000/masterlogin.html';
        } else {
            const errorText = await response.text();
            errorMessage.textContent = errorText; 
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = "An unexpected error occurred.";
        errorMessage.style.display = 'block';
    }
});
