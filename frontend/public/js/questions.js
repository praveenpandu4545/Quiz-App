// Declare userEmail outside the DOMContentLoaded to make it accessible
let userEmail;
let domain;
let userAnswers = []; // To store the user's answers

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    domain = urlParams.get('domain');
    document.getElementById('domain-name').innerText = domain;

    score = 0;
    currentQuestionIndex = 0;

    // Retrieve user email from local storage or any other means
    userEmail = localStorage.getItem('userEmail'); // Ensure you store email during login

    fetchQuestions(domain);
});

// Fetch questions based on the domain
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

function fetchQuestions(domain) {
    fetch(`/api/questions/${domain}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(fetchedQuestions => {
            questions = fetchedQuestions;

            if (questions.length > 0) {
                displayQuestion(currentQuestionIndex); // Display the first question
            } else {
                document.getElementById('questions-container').innerHTML = "<p>No questions available.</p>";
            }
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            document.getElementById('questions-container').innerHTML = "<p>Failed to load questions.</p>";
        });
}

// Display a single question on the page
function displayQuestion(index) {
    const container = document.getElementById('questions-container');
    container.innerHTML = ""; // Clear previous content

    const question = questions[index];
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    const questionText = document.createElement('p');
    questionText.innerText = question.question;

    questionDiv.appendChild(questionText);

    const optionsList = document.createElement('ul');
    optionsList.classList.add('options'); // Add class for styling

    question.options.forEach(option => {
        const optionItem = document.createElement('li');
        optionItem.classList.add('option');
        optionItem.innerHTML = `
            <label>
                <input type="radio" name="question-${question._id}" value="${option}">
                ${option}
            </label>
        `;

        optionItem.querySelector('input').addEventListener('click', () => {
            document.getElementById('next-button').style.display = 'block'; // Show Next button

            const isCorrect = option === question.answer;

            // Check if this question was already answered correctly
            if (!userAnswers[currentQuestionIndex]?.isCorrect) {
                // Store user's answer
                userAnswers[currentQuestionIndex] = {
                    question: question.question,
                    selectedOption: option,
                    correctAnswer: question.answer,
                    isCorrect: isCorrect
                };

                // Update the score if the answer is correct and not previously counted
                if (isCorrect) {
                    score++;
                }
            }
        });

        optionsList.appendChild(optionItem);
    });

    questionDiv.appendChild(optionsList);
    container.appendChild(questionDiv);

    // Show navigation buttons
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    nextButton.style.display = 'none'; // Hide Next button initially
    prevButton.style.display = currentQuestionIndex > 0 ? 'block' : 'none'; // Show Previous button only if not on the first question
}

// Move to the next question
document.getElementById('next-button').addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion(currentQuestionIndex); // Display next question
    } else {
        displayScore(); // If no more questions, display the score and results
    }
});

// Move to the previous question
document.getElementById('prev-button').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex); // Display previous question
    }
});

// Display the score and the result of each question
function displayScore() {
    const scoreContainer = document.getElementById('score-container');
    scoreContainer.innerHTML = `
        <h2>Your score: ${score} out of ${questions.length}</h2>
        <div class="score-summary">
            <p>You answered ${userAnswers.filter(ans => ans.isCorrect).length} questions correctly.</p>
            <p>You got ${questions.length - userAnswers.filter(ans => ans.isCorrect).length} questions wrong.</p>
        </div>
    `;

    const resultList = document.createElement('ul');
    resultList.classList.add('results-list');

    userAnswers.forEach((answer, index) => {
        const resultItem = document.createElement('li');
        resultItem.classList.add('result-item');
        
        // Add the question and selected option
        resultItem.innerHTML = `
            <div class="result-question">
                <strong>Question ${index + 1}:</strong> ${answer.question}
            </div>
            <div class="result-answer">
                <strong>Your answer:</strong> ${answer.selectedOption} 
                ${answer.isCorrect ? '<span class="correct-tag">Correct</span>' : '<span class="wrong-tag">Incorrect</span>'}
            </div>
            <div class="correct-answer">
                <strong>Correct answer:</strong> ${answer.correctAnswer}
            </div>
        `;

        resultList.appendChild(resultItem);
    });

    scoreContainer.appendChild(resultList);

    // Hide questions and navigation buttons, show retry/back
    document.getElementById('questions-container').style.display = 'none';
    document.getElementById('navigation-container').style.display = 'none';
    document.getElementById('retry-button').style.display = 'block';
    document.getElementById('back-button').style.display = 'block';

    // Send the score and domain to the backend
    updateQuizStats(userEmail, domain, score);
}

// Retry the quiz
document.getElementById('retry-button').addEventListener('click', () => {
    score = 0; // Reset score
    currentQuestionIndex = 0; // Reset question index
    userAnswers = []; // Reset user answers
    document.getElementById('score-container').innerHTML = ""; // Clear score display
    document.getElementById('questions-container').style.display = 'block'; // Show questions
    document.getElementById('navigation-container').style.display = 'block'; // Show navigation buttons
    document.getElementById('retry-button').style.display = 'none'; // Hide Retry button
    document.getElementById('back-button').style.display = 'none'; // Hide Back button
    fetchQuestions(new URLSearchParams(window.location.search).get('domain')); // Re-fetch questions
});

// Back to Welcome Page
document.getElementById('back-button').addEventListener('click', () => {
    score = 0;
    window.location.href = 'welcome.html'; // Redirect to welcome.html
});

// Update user quiz statistics in the backend
function updateQuizStats(email, domain, score) {
    fetch(`/signinon/updateStats/${email}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, score }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update statistics');
        }
        return response.json();
    })
    .then(data => {
        console.log('Statistics updated:', data);
    })
    .catch(error => {
        console.error('Error updating statistics:', error);
    });
}

// Style the Retry and Back buttons
function styleButton(button) {
    button.style.padding = '10px 20px';
    button.style.margin = '10px';
    button.style.backgroundColor = '#4CAF50'; // Green background
    button.style.color = 'white'; // White text
    button.style.border = 'none'; // No border
    button.style.borderRadius = '5px'; // Rounded corners
    button.style.cursor = 'pointer'; // Pointer cursor
    button.style.fontSize = '16px'; // Font size
    button.style.transition = 'background-color 0.3s'; // Transition effect

    // Change background color on hover
    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#45a049'; // Darker green
    });

    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#4CAF50'; // Reset to original green
    });
}

// Apply styles to the buttons
styleButton(document.getElementById('retry-button'));
styleButton(document.getElementById('back-button'));
