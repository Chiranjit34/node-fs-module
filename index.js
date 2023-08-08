const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();

function readNotes() {
  try {
    const data = fs.readFileSync("notes.json");
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
}

function writeNotes(notes) {
  fs.writeFileSync("notes.json", JSON.stringify(notes));
}

app.post("/notes", (req, res) => {
  const notes = readNotes();
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    content: req.body.content,
  };
  notes.push(newNote);
  writeNotes(notes);
  res.json(newNote);
});

app.get("/notes", (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

app.get("/notes/:id", (req, res) => {
  const notes = readNotes();
  const note = notes.find((note) => note.id === req.params.id);
  if (note) {
    res.json(note);
  } else {
    res.json({ message: "Note not found" });
  }
});


app.patch("/notes/:id", (req, res) => {
  const notes = readNotes();
  const noteIndex = notes.findIndex((note) => note.id === req.params.id);
  if (noteIndex !== -1) {
    notes[noteIndex].title = req.body.title;
    notes[noteIndex].content = req.body.content;
    writeNotes(notes);
    res.json(notes[noteIndex]);
  } else {
    res.json({ message: "Note not found" });
  }
});


app.delete("/notes/:id", (req, res) => {
  const notes = readNotes();
  const noteIndex = notes.findIndex((note) => note.id === req.params.id);
  if (noteIndex !== -1) {
    const deletedNote = notes.splice(noteIndex, 1)[0];
    writeNotes(notes);
    res.json({message: "Note Deleted successfully"});
  } else {
    res.json({ message: "Note not found" });
  }
});


app.listen(8080, () => {
  console.log("Server Started");
});
