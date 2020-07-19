const express = require("express");
require("./db/mongoose");

const userRouter = require("./router/user");
const taskRouter = require("./router/task");

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {

// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

const jwt = require("jsonwebtoken");

const myFunction = async () => {
  const token = jwt.sign({ _id: "abc123" }, "Thisismycourse", {
    expiresIn: "7 days",
  });

  console.log(token);
  const payload = jwt.verify(token, "Thisismycourse");
  console.log(payload);
};

myFunction();
