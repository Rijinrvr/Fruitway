var express = require("express");
var router = express.Router();
var { User } = require("../models/user");
var { Fruit } = require("../models/fruits");

const isUser = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/login");
  }
};

//--Home----------------------------------------------

router.get("/", isUser, function (req, res, next) {
  Fruit.find({}).then((fruits) => {
    res.render("user/list", { title: "Fruit", fruits: fruits });
  });
});

//--View----------------------------------------------

router.get("/view/:id", isUser, (req, res) => {
  let id = req.params.id;
  Fruit.findById(id).then((fruit) => {
    console.log(fruit);
    res.render("user/view", { title: "Fruit", fruit: fruit });
  });
});

//--Search-----------------------------------------------

router.post("/search", isUser, (req, res) => {
  let searchQuery = req.body.search;
  Fruit.find({
    $or: [
      { name: { $regex: searchQuery, $options: "i" } },
      { description: { $regex: searchQuery, $options: "i" } },
      { price: { $regex: searchQuery, $options: "i" } },
    ],
  })
    .then((searchResults) => {
      res.render("user/search", { title: "Search Results", searchResults });
      console.log(searchResults);
    })
    .catch((err) => console.log(err));
});

//--Signup---------------------------------------------

router.get("/signup", (req, res) => {
  res.render("user/signup");
});
router.post("/signup", (req, res) => {
  let user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  user
    .save()
    .then((signup) => {})
    .then(() => {
      res.redirect("/login");
    });
});

//--Login--------------------------------------------------

router.get("/login", (req, res) => {
  res.render("user/login");
});
router.post("/login", (req, res) => {
  let query = {
    username: req.body.username,
    password: req.body.password,
  };
  User.findOne(query).then((login) => {
    if (login) {
      req.session.username = login.username;
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  });
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
