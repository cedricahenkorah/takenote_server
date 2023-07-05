const Note = require("../models/note");
const mongoose = require("mongoose");

// GET all notes
const getNotes = async (req, res) => {
  const user_id = req.user._id;

  const notes = await Note.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(notes);
};

// GET a single note
const getNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "not a valid note id" });
  }

  const note = await Note.findById(id);

  if (!note) {
    return res.status(400).json({ error: "could ot find the note" });
  }

  res.status(200).json(note);
};

// create a note
const createNote = async (req, res) => {
  const { title, label, body } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }

  if (!label) {
    emptyFields.push("label");
  }

  if (!body) {
    emptyFields.push("body");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill all the required fields", emptyFields });
  }

  // add the note doc to the db
  try {
    const user_id = req.user._id;

    const note = await Note.create({ title, label, body, user_id });
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a note
const deleteNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: "not a valid note id" });
  }

  const note = await Note.findOneAndDelete({ _id: id });

  if (!note) {
    res.status(400).json({ error: "could not find note to delete" });
  }

  res.status(200).json(note);
};

// update a note
const updateNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "not a valid note id" });
  }

  const note = await Note.findByIdAndUpdate({ _id: id }, { ...req.body });

  if (!note) {
    return res.status(400).json({ error: "could not find a note to delete" });
  }

  res.status(200).json(note);
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  deleteNote,
  updateNote,
};
