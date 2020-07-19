const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  // await async
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ success: true, user: user, token: token });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }

  // Promise
  // user
  //   .save()
  //   .then(() => {
  //     res.status(201).json({ success: true, user: user });
  //   })
  //   .catch((err) => {
  //     res.status(400).json({ success: false, error: err.message });
  //   });
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.status(200).json({ success: true, user: user, token: token });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// auth middleware to validate user token
router.get("/users/me", auth, async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const users = await User.findById(_id);
    if (!users) {
      return res.status(404).json({ success: true, users: "Not Found" });
    }
    res.status(200).json({ success: true, users: users });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }

  // User.findById(req.params.id)
  //   .then((users) => {
  //     if (!users) {
  //       return res.status(404).json({ success: true, users: "Not Found" });
  //     }
  //     res.status(200).json({ success: true, users: users });
  //   })
  //   .catch((err) => {
  //     res.status(400).json({ success: false, error: err.message });
  //   });
});

router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email", "password", "age"];
  const isValidOperation = allowUpdates.every((item) => updates.includes(item));

  if (!isValidOperation) {
    return res.status(400).json({ success: false, error: "Invalid operation" });
  }

  try {
    const user = await User.findById(req.params.id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!user) {
      return res.status(404).json({ success: true, user: "Not Found" });
    }
    res.status(200).json({ success: true, user: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id);

    if (!user) {
      return res.status(404).json({ success: true, user: "Not Found" });
    }
    res.status(200).json({ success: true, user: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
