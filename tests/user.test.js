const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

// run before each test
beforeEach(setupDatabase);

// afterEach(() => {
//   console.log("afterEach");
// });

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "zzk",
      email: "zzk@email.com",
      password: "1234567",
    })
    .expect(201);

  // Assertions that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: "zzk",
    },
  });

  expect(user.email).not.toBe("zzk2@email.com");
});

test("Should login a new user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should login failure", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "wrongEmail",
      password: userOne.password,
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete user account", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // Assertions that the user was removed
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/philly.jpg")
    .expect(200);

  const user = await User.findById(userOneId);

  //check the avatar iamge is the type of Buffer
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user field", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "kzz",
      age: "20",
      email: "kzz@example.com",
      password: "7654321",
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe("kzz");
});

test("Should not update invalid user field", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "kzz",
      age: "20",
      email: "kzz@example.com",
      location: "Japan",
    })
    .expect(400);
});
