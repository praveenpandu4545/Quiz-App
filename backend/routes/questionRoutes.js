const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Get random 2 questions by domain
router.get('/:domain', async (req, res) => {
    try {
        const domain = req.params.domain;

        let collectionName;

        if (domain === 'coding') {
            collectionName = 'codingquestions'; // collection for coding questions
        } else if (domain === 'sports') {
            collectionName = 'questions'; // collection for sports questions
        } else if (domain === 'history') {
            collectionName = 'historyquestions'; // collection for history questions
        } else if (domain === 'gk') {
            collectionName = 'gkquestions'; // collection for general knowledge questions
        } else if (domain === 'politics') {
            collectionName = 'politicsquestions'; // collection for politics questions
        } else if (domain === 'cinemas') {
            collectionName = 'cinemaquestions'; // collection for cinema questions
        }

        // Randomly select 2 questions from the specified collection
        const questions = await mongoose.connection.db.collection(collectionName)
            .aggregate([{ $sample: { size: 5 } }]) // MongoDB $sample to get 2 random questions
            .toArray();

        res.json(questions); // Send the 2 random questions to the frontend
    } catch (error) {
        console.error(error); // log the error for debugging
        res.status(500).json({ message: 'Error fetching questions' });
    }
});

module.exports = router;
