    // Fetch user details and quiz statistics for the dashboard
    async function fetchUserDashboard() {
        const email = localStorage.getItem('userEmail'); // Assuming you store email in localStorage after login
        try {
            const response = await fetch(`/signinon/dashboard/${email}`); // Update endpoint to fetch user data
            const data = await response.json();
            
            // Update user details
            document.getElementById('user-name').textContent = data.name;
            document.getElementById('user-email').textContent = data.email;
            document.getElementById('user-mobile').textContent = data.mobile;

            // Update achievements
            document.getElementById('quizzes-participated').textContent = data.quizzesParticipated;
            document.getElementById('average-marks').textContent = `${data.averageMarks}`;
            document.getElementById('sports-attempts').textContent = `${data.attempts.sports || 0} attempts`;
            docgetElementById('coding-attempts').textContent = `${data.attempts.coding || 0} attempts`;
            document.getElementById('history-attempts').textContent = `${data.attempts.history || 0} attempts`;
            document.getElementById('gk-attempts').textContent = `${data.attempts.gk || 0} attempts`;
            document.getElementById('politics-attempts').textContent = `${data.attempts.politics || 0} attempts`;
            document.getElementById('cinemas-attempts').textContent = `${data.attempts.cinemas || 0} attempts`;
        } catch (error) {
            console.error('Error fetching user dashboard:', error);
        }
    }

    // Refresh dashboard on button click
    document.getElementById('refresh-dashboard').addEventListener('click', fetchUserDashboard);

    // Fetch the dashboard on page load
    fetchUserDashboard();
