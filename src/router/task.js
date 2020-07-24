const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

// create new task
router.post("/tasks", auth, async (req, res) => {
  const task = await Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).json({ success: true, task: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
  // task
  //   .save()
  //   .then(() => {
  //     res.status(201).json({ success: true, task: task });
  //   })
  //   .catch((err) => {
  //     res.status(400).json({ success: false, error: err.message });
  //   });
});

// get all tasks of the user
// Filter Data
// GET  /tasks?completed = boolean
// Paginating Data
// GET  /tasks?limit=10&skip=0
// Sorting Data
// GET  /tasks?sortBy=createdAt:asc
// GET  /tasks?sortBy=completed:desc

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    //const tasks = await Task.find({ owner: req.user._id });
    res.status(200).json({ success: true, tasks: req.user.tasks });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// get the task by _id and the user._id
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).json({ success: true, task: "Not Found" });
    }
    res.status(200).json({ success: true, task: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// update task by _id and user._id
router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["description", "completed"];
  const isValidOperation = allowUpdates.every((item) => updates.includes(item));

  if (!isValidOperation) {
    return res.status(400).json({ success: false, error: "Invalid operation" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ success: true, task: "Not Found" });
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    res.status(200).json({ success: true, task: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// delete task by _id and user._id
router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id: _id, owner: req.user._id });

    if (!task) {
      return res.status(404).json({ success: true, task: "Not Found" });
    }
    res.status(200).json({ success: true, task: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
