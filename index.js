const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

app.use(express.urlencoded());

app.use(cookieParser()); // Adding cookieParser() as application-wide middleware
const csrfProtection = csrf({ cookie: true }); // creating csrfProtection middleware to use in specific routes

app.set("view engine", "pug");
const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com",
  },
];

app.get("/", (req, res) => {
  res.render("index", { title: "🤠🌯🧟‍♀️", users: users });
});

app.get("/create", csrfProtection, (req, res) => {
  res.render("form", {
    title: "Create User",
    csrfToken: req.csrfToken(),
    fnVal: "",
    lnVal: "",
    emailVal: "",
  });
});

app.get("/create-interesting", csrfProtection, (req, res) => {
  res.render("create-interesting", {
    title: "Create Interesting User",
    csrfToken: req.csrfToken(),
    fnVal: "",
    lnVal: "",
    emailVal: "",

    // favBeatle:""
  });
});

app.post("/create", csrfProtection, (req, res) => {
  console.log(req.body);
  const [firstName, lastName] = req.body.text;
  const email = req.body.email;
  const [pw, confirmPw] = req.body.password;
  let errors = [];
  if (!firstName) {
    errors.push("Please add your first name.");
  }
  if (!lastName) {
    errors.push("Please add your last name.");
  }
  if (!email) {
    errors.push("Please add your email.");
  }
  if (!pw || !confirmPw || pw !== confirmPw) {
    errors.push("Make sure that your passwords match!");
  }
  if (errors.length > 0) {
    console.log("do something");
    res.render("form", {
      title: "Create User",
      csrfToken: req.csrfToken(),
      errors: errors,
      fnVal: firstName,
      lnVal: lastName,
      emailVal: email,
    });
    // res.redirect("/create");
  } else {
    users.push({
      id: users.length + 1,
      firstName: firstName,
      lastName: lastName,
      email: email,
    });
    res.redirect("/");
  }
});

app.post("/create-interesting", csrfProtection, (req, res) => {
  console.log(req.body);
  const [firstName, lastName] = [req.body.firstName, req.body.lastName];
  const email = req.body.email;
  const [pw, confirmPw] = [req.body.password, req.body.confirmedPassword];
  const age = req.body.age;
  const beatle = req.body.favBeatle;
  const iceCream = req.body.likesIcecream;

  let errors = [];
  if (!firstName) {
    errors.push("Please add your first name.");
  }
  if (!lastName) {
    errors.push("Please add your last name.");
  }
  if (!email) {
    errors.push("Please add your email.");
  }
  if (!pw || !confirmPw || pw !== confirmPw) {
    errors.push("Make sure that your passwords match!");
  }
  if (!beatle) {
    errors.push("Please select a Beatle.");
  }
  if (!iceCream) {
    errors.push("Please select if you like icecream.");
  }

  if (errors.length > 0) {
    console.log("do something");
    const formFilled = {
      title: "Create User",
      csrfToken: req.csrfToken(),
      errors: errors,
      fnVal: firstName,
      lnVal: lastName,
      emailVal: email,
    };
    if (beatle) {
      formFilled[`${beatle}Selected`] = "selected";
    }
    console.log(req.body.text);
    res.render("create-interesting", formFilled);
    // res.redirect("/create");
  } else {
    users.push({
      id: users.length + 1,
      firstName: firstName,
      lastName: lastName,
      email: email,
      age: age,
      favoriteBeatle: beatle,
      likesIceCream: iceCream,
    });
    res.redirect("/");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
