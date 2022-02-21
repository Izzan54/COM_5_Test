const express = require("express");
const app = express();
const cors = require("cors")

// middleware
// Cross-Origin Resource Sharing (cors)
// backend can interact with front end

app.use(express.json()); // req.body
app.use(cors())

// ROUTES

// signup and login

app.use("/auth",require("./Routes/jwtAuth"));

// dashboard 

app.use("/dashboard",require("./Routes/dashboard"))

app.listen(5000,() => {
    console.log("Server is running on port 5000");
});