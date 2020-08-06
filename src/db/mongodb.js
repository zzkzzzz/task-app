

//CURD create read update delete

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manger";

// const id = new ObjectID();w
// console.log(id);
// console.log(id.getTimestamp());

MongoClient.connect(
  connectionURL,
  { useNewUrlParse: true },
  (error, client) => {
    if (error) {
      return console.log("unable to connect to database");
    }

    const db = client.db(databaseName);

    // db.collection("users").insertOne(
    //   {
    //     name: "lok",
    //     age: 19,
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("unable to insert user");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // db.collection("tasks").insertMany(
    //   [
    //     { description: "assignment", completed: false },
    //     { description: "project", completed: false },
    //     { description: "exercise", completed: true },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("unable to insert users");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // db.collection("users").findOne(
    //   { _id: new ObjectID("5f082eef8694cd3263d24c2b") },
    //   (error, user) => {
    //     if (error) {
    //       return console.log("unable to fetch");
    //     }
    //     console.log(user);
    //   }
    // );

    // db.collection("users")
    //   .find({ age: 27 })
    //   .toArray((error, users) => {
    //     console.log(users);
    //   });

    // db.collection("tasks").findOne(
    //   { _id: new ObjectID("5f076de5d66d523061c0fd9b") },
    //   (error, task) => {
    //     if (error) {
    //       return console.log("unabel to fetch");
    //     }
    //     console.log(task);
    //   }
    // );

    // db.collection("tasks")
    //   .find({ completed: false })
    //   .toArray((error, tasks) => {
    //     console.log(tasks);
    //   });

    // db.collection("users")
    //   .updateOne(
    //     {
    //       _id: new ObjectID("5f082eef8694cd3263d24c2b"),
    //     },
    //     {
    //       $set: {
    //         name: "jianluo",
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // db.collection("tasks")
    //   .updateMany(
    //     {
    //       completed: false,
    //     },
    //     {
    //       $set: {
    //         completed: true,
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result.modifiedCount);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    db.collection("users")
      .deleteMany({
        age: 27,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
);
