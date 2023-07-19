const fs = require("fs");
const express = require("express");
const app = express();

// Importing products from userDetails.json file
const userDetails = JSON.parse(
  fs.readFileSync(`${__dirname}/data/userDetails.json`)
);

//Middlewares
app.use(express.json());

// PATCH endpoint for updating user details
app.patch("/api/v1/details/:id", (req, res) => {
  const { id } = req.params;
  const { name, mail, number } = req.body;

  // Check if the user id exists in the database
  const userIndex = userDetails.findIndex((user) => user.id === parseInt(id));
  if (userIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: "User not found!",
    });
  }

  // Update the user details
  userDetails[userIndex].name = name;
  userDetails[userIndex].mail = mail;
  userDetails[userIndex].number = number;

  // Write the updated userDetails to the JSON file
  fs.writeFile(
    `${__dirname}/data/userDetails.json`,
    JSON.stringify(userDetails),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "failed",
          message: "Server error while updating user details",
        });
      }

      // Respond with the updated user details
      res.status(200).json({
        status: "success",
        message: `User details updated successfully for id: ${id}`,
        product: userDetails[userIndex],
      });
    }
  );
});

// POST endpoint for registering new user
app.post("/api/v1/details", (req, res) => {
  const newId = userDetails[userDetails.length - 1].id + 1;
  const { name, mail, number } = req.body;
  const newUser = { id: newId, name, mail, number };
  userDetails.push(newUser);
  fs.writeFile(
    `${__dirname}/data/userDetails.json`,
    JSON.stringify(userDetails),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "failed",
          message: "Server error while registering user",
        });
      }

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: {
          userDetails: newUser,
        },
      });
    }
  );
});

// GET endpoint for sending the details of users
app.get("/api/v1/details", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Details of users fetched successfully",
    data: {
      userDetails,
    },
  });
});

// GET endpoint for sending the details of users by id
app.get("/api/v1/details/:id", (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  const details = userDetails.find((user) => user.id === id);
  if (!details) {
    return res.status(404).json({
      status: "failed",
      message: "User not found!",
    });
  } else {
    res.status(200).json({
      status: "success",
      message: "Details of users fetched successfully",
      data: {
        details,
      },
    });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


module.exports = app;
