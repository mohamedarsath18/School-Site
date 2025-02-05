const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Submit a contact form
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.status(201).json({ message: "Message sent successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error sending message", error: err });
    }
});

module.exports = router;
