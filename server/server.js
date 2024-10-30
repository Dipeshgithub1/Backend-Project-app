const express = require('express')
const mongoose = require("mongoose")
const cors = require("cors")

const bodyParser = require("body-parser")

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
//const dbURI = "mongodb://localhost:27017/";
mongoose.connect("mongodb://localhost:27017/");

//mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Note model
const Note = mongoose.model("Note", {
    title: String,
    content: String,
});

// Listen for successful MongoDB connection
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

// Listen for MongoDB connection errors
mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

// Routes
app.get("/", (req, res) => {
    res.send("Hello, this is the root!");
});

app.get("/api/notes", async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Note by ID
// Update Note by ID
app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const noteId = req.params.id;

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, content },
            { new: true }
        );
        res.json(updatedNote);
    } catch (error) {
        res.status(404).json({ message: "Note not found" });
    }
});

// Delete Note by ID
app.delete("/api/notes/:id", async (req, res) => {
    const noteId = req.params.id;

    try {
        await Note.findByIdAndDelete(noteId);
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: "Note not found" });
    }
});

app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;

    const note = new Note({ title, content });

    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});