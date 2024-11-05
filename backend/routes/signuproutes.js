const express = require("express");
const bcrypt = require('bcrypt');
const signupModel = require("../model/signup");
const mastersignupModel = require("../model/master");
const router = express.Router();

// Sign up a new user
router.post('/signup', async (req, res) => {
    const { name, email, mobile, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new signupModel({
            name,
            email,
            mobile,
            password: hashedPassword,
            quizzesParticipated: 0, // Initialize quizzesParticipated
            averageMarks: 0, // Initialize averageMarks
            attempts: {} // Initialize attempts for each domain
        });

        await newUser.save();
        res.status(201).json({ message: "User signed up successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error signing up user: " + error.message });
    }
});


// Sign up a master
router.post('/mastersignup', async (req, res) => {
    const { name, email, mobile, password,master } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new mastersignupModel({
            name,
            email,
            mobile,
            password: hashedPassword,
            master
        });

        await newUser.save();
        res.status(201).json({ message: "User signed up successfully!" });
    }   catch (error) {
        res.status(500).json({ message: "Error signing up user: " + error.message });
    }
});


// Login an existing user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await signupModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please sign up." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password." });
        }

        res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        res.status(500).json({ message: "Error during login: " + error.message });
    }
});


// Login an existing master
router.post('/masterlogin', async (req, res) => {
    const { email, password,master } = req.body;

    try {
        const user = await mastersignupModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please sign up." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password." });
        }

        const master = await compare(master,92984)
        if (!user) {
            return res.status(400).json({ message: "wrong master key" });
        }

        res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        res.status(500).json({ message: "Error during login: " + error.message });
    }
});

// Get user dashboard data
router.get('/dashboard/:email', async (req, res) => {
    try {
        const user = await signupModel.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            quizzesParticipated: user.quizzesParticipated,
            averageMarks: user.averageMarks,
            attempts: user.attempts
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data: " + error.message });
    }
});

// Update user quiz statistics
router.post('/updateStats/:email', async (req, res) => {
    const { domain, score } = req.body;

    try {
        const user = await signupModel.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Increment quizzes participated
        user.quizzesParticipated += 1;

        // Update average marks
        user.averageMarks = parseFloat((((user.averageMarks * (user.quizzesParticipated - 1)) + score) / user.quizzesParticipated).toFixed(2));


        // Increment attempts based on domain
        if (user.attempts[domain] !== undefined) {
            user.attempts[domain] += 1;
        } else {
            user.attempts[domain] = 1; // Initialize attempts for new domain
        }

        await user.save();
        res.status(200).json({ message: "User statistics updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error updating user statistics: " + error.message });
    }
});

module.exports = router;
