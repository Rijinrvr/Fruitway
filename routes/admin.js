var express = require("express");
var router = express.Router();
const { Fruit } = require("../models/fruits");
var { Admin } = require("../models/admin");
const isAdmin = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

/* GET home page. */
router.get("/", isAdmin, function (req, res, next) {
  Fruit.find({}).then((fruits) => {
    // console.log (medicines)
    res.render("admin/list", { title: "Fruits", fruits: fruits });
  });
});

//--------Add-----------------------------------------------------------
router.get("/add", isAdmin, (req, res) => {
  res.render("admin/add");
});

router.post("/add", (req, res) => {
  let fruit = new Fruit({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  });

  console.log(req.body);
  fruit
    .save()
    .then(function (doc) {
      console.log(doc._id);
    })
    .then(() => {
      res.redirect("/admin");
    })
    .catch(function (error) {
      console.log(error);
    });
});

//----Edit-------------------------------------------
router.get("/view/:id", isAdmin, (req, res) => {
  let id = req.params.id;

  Fruit.findById(id).then((fruit) => {
    console.log(fruit);
    res.render("admin/view", { title: "Fruit", fruit: fruit });
  });
});

router.get("/edit/:id", isAdmin, (req, res) => {
  let id = req.params.id;
  Fruit.findById(id).then((fruit) => {
    res.render("admin/edit", { fruit: fruit });
  });
});
router.post("/edit/:id", (req, res) => {
  let fruit = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  };
  let query = {
    _id: req.params.id,
  };
  Fruit.updateOne(query, fruit)
    .then((doc) => {
      console.log(doc);
      res.redirect("/admin");
    })
    .catch((err) => console.log(err));
});

//------------Delete---------------------------------------

router.get("/delete/:id", isAdmin, (req, res) => {
  let query = {
    _id: req.params.id,
  };
  Fruit.deleteOne(query)
    .then(() => {
      console.log("Deleted Successfully");
    })
    .then(() => {
      res.redirect("/admin");
    });
});

//----search---------------------------------------------

router.post("/search", (req, res) => {
  let searchQuery = req.body.search;
  Fruit.find({
    $or: [
      { name: { $regex: searchQuery, $options: "i" } },
      { description: { $regex: searchQuery, $options: "i" } },
      { price: { $regex: searchQuery, $options: "i" } },
    ],
  })
    .then((searchResults) => {
      res.render("admin/search", { title: "Search Results", searchResults });
      console.log(searchResults);
    })
    .catch((err) => console.log(err));
});

//----LOGIN--------------------------------------------------

router.get("/login", function (req, res, next) {
  res.render("admin/login");
});
router.post("/login", (req, res) => {
  let query = {
    username: req.body.username,
    password: req.body.password,
  };
  Admin.findOne(query).then((login) => {
    // console.log(login)
    if (login) {
      req.session.username = login.username;
      res.redirect("/admin");
    } else {
      res.redirect("/admin/login");
    }
  });
});

//--SignUp----------------------------------------------

router.get("/signup", (req, res) => {
  res.render("admin/signup");
});

router.post("/signup", (req, res) => {
  let admin = new Admin({
    username: req.body.username,
    password: req.body.password,
  });
  admin
    .save()
    .then((signup) => {
      // console.log(signup)
    })
    .then(() => {
      res.redirect("/admin/login");
    });
});

router.get("/logout", (req, res) => {
  req.session.username = "";
  res.redirect("/admin/login");
});

module.exports = router;
