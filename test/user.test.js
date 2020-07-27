const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const userOne = {
  name: "test",
  email: "test@email.com",
  password: "1234567",
};

// run before each test
beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

// afterEach(() => {
//   console.log("afterEach");
// });

// create new user
test("Should signupa new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "zzk",
      email: "zzk@email.com",
      password: "1234567",
    })
    .expect(201);
});

// login user
test("Should login a new user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

// login user failure
test("Should login failure", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "wrongEmail",
      password: userOne.password,
    })
    .expect(400);
});
