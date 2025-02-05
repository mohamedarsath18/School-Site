const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const mongoose = require('mongoose');

const validateDate = (date) => {
    const eventDate = new Date(date);
    return eventDate >= new Date();
};

// Fetch all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events.map(event => ({
            ...event.toObject(),
            date: event.date.toISOString().split("T")[0] // Convert to YYYY-MM-DD
        })));
    } catch (err) {
        res.status(500).json({ message: "Error fetching events", error: err });
    }
});

// Fetch single event
router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid event ID format." });
    }

    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({
            ...event.toObject(),
            date: event.date.toISOString().split("T")[0] // Convert to YYYY-MM-DD
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching event", error: err });
    }
});

// Add a new event
router.post('/', async (req, res) => {
    const { title, date, description, location } = req.body;
    
    if (!validateDate(date)) {
        return res.status(400).json({ message: "Event date cannot be in the past." });
    }

    try {
        const newEvent = new Event({ title, date: new Date(date), description, location });
        await newEvent.save();
        res.status(201).json({ message: "Event added successfully", event: newEvent });
    } catch (err) {
        res.status(500).json({ message: "Error adding event", error: err });
    }
});

// Update event
router.put('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid event ID format." });
    }

    const { title, date, description, location } = req.body;
    if (!title || !date || !description || !location) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { title, date: new Date(date), description, location }, // Convert date
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (err) {
        res.status(500).json({ message: "Error updating event", error: err });
    }
});

// Delete event
router.delete('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid event ID format." });
    }

    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting event", error: err });
    }
});


module.exports = router;
