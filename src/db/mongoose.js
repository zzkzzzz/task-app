const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  userCreateIndex: true,
});

// const me = new User({
//   name: "ZZZ    ",
//   email: "mikeee@mail.com",
//   password: "1237",
// });

// me.save()
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));

// const task1 = new Task({
//   description: "project1",
//   completed: true,
// });

// task1
//   .save()
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));
