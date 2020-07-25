const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");
const multer = require("multer");
const sharp = require("sharp");

//create new user
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

//user login
router.post("/users/login", async (req, res) => {
  try {
    //bcrypt to verify user password
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    //generate auth token through JWT
    const token = await user.generateAuthToken();

    res.status(200).json({ success: true, user: user, token: token });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

//user logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    //filter out the token currently using
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();

    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

//user logout all the sessions
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    //clear the token array
    req.user.tokens = [];
    await req.user.save();

    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// show user info with validated token
// auth middleware to validate user token
router.get("/users/me", auth, async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

/* User not suppose to find user by id */
// //fund user by _id
// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const users = await User.findById(_id);
//     if (!users) {
//       return res.status(404).json({ success: true, users: "Not Found" });
//     }
//     res.status(200).json({ success: true, users: users });
//   } catch (err) {
//     res.status(400).json({ success: false, error: err.message });
//   }

// });

//update user's info
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email", "password", "age"];
  const isValidOperation = allowUpdates.every((item) => updates.includes(item));

  if (!isValidOperation) {
    return res.status(400).json({ success: false, error: "Invalid operation" });
  }

  try {
    //const user = await User.findById(req.params.id);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!req.user) {
      return res.status(404).json({ success: true, user: "Not Found" });
    }
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

//delete user's own profile
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// upload file
const upload = multer({
  // will save in local memory file "avatars"
  //dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  //valiate file type
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      // pass an error if something goes wrong:
      return cb(new Error("Invalid file type"));
    }

    // To accept the file pass `true`
    cb(null, true);
  },
});

// create avatar
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      // use sharp to crop and format the image
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      req.user.avatar = buffer;
      await req.user.save();
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },
  //handle express erroe
  (error, req, res, next) => {
    res.status(400).json({ success: false, error: error.message });
  }
);

// delete user's avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// fetch user's avatar image
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user.avatar || !user) {
      throw new Error("User or avatar not found");
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

module.exports = router;
