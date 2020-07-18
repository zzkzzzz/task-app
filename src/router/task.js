const express = require("express");
const router = new express.Router();
const Task = require("../models/task");

router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

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

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json({ success: true, tasks: tasks });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
  // Task.find({})
  //   .then((tasks) => {
  //     res.status(200).json({ success: true, tasks: tasks });
  //   })
  //   .catch((err) => {
  //     res.status(400).json({ success: false, error: err.message });
  //   });
});

router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const tasks = await Task.findById(_id);
    if (!tasks) {
      return res.status(404).json({ success: true, tasks: "Not Found" });
    }
    res.status(200).json({ success: true, tasks: tasks });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }

  // Task.findById(req.params.id)
  //   .then((tasks) => {
  //     if (!tasks) {
  //       return res.status(404).json({ success: true, tasks: "Not Found" });
  //     }
  //     res.status(200).json({ success: true, tasks: tasks });
  //   })
  //   .catch((err) => {
  //     res.status(400).json({ success: false, error: err.message });
  //   });
});

router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["description", "completed"];
  const isValidOperation = allowUpdates.every((item) => updates.includes(item));

  if (!isValidOperation) {
    return res.status(400).json({ success: false, error: "Invalid operation" });
  }

  try {
    const task = await Task.findById(req.params.id);
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!task) {
      return res.status(404).json({ success: true, task: "Not Found" });
    }
    res.status(200).json({ success: true, task: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(_id);

    if (!task) {
      return res.status(404).json({ success: true, task: "Not Found" });
    }
    res.status(200).json({ success: true, task: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
