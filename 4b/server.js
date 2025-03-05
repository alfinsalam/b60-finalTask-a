const express = require("express");
const hbs = require("hbs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const flash = require("express-flash");
const session = require("express-session");
const multer = require("multer");
const formParser = multer();
const port = 3000;
const methodOverride = require("method-override");

// Import controllers
const {
  indexHero,
  createHero,
  storeHero,
  editHero,
  updateHero,
  getHeroDetail,
  deleteHero,
  authRegister,
  authLogin,
  authLogout,
  upload,
  indexType,
  createType,
  storeType,
  deleteType,
} = require("./controller/controllers");
const controllers = require("./controller/controllers.js");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
// Static Files
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(express.static(path.join(__dirname, "public")));

// Session & Flash Messages
app.use(
  session({
    secret: "sjfeafjbkeana",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);
app.use(flash());

// Setup View Engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views", "partials"));

// Register Handlebars Helpers
hbs.registerHelper("json", function (context) {
  return JSON.stringify(context, null, 2);
});
hbs.registerHelper("eq", (a, b) => a === b);
hbs.registerHelper("equal", (a, b) => a === b);
hbs.registerHelper("contains", (array, value) => {
  return Array.isArray(array) && array.includes(value);
});
hbs.registerHelper("increment", function(value) {
  return value + 1;
});

// Middleware untuk menyimpan user session ke res.locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; 
  next();
});
// Middleware untuk mengecek apakah user sudah login
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
      // Jika user sudah login, lanjut ke halaman 
      return next();
  } else {
      // Jika belum login, arahkan ke halaman login
      return res.redirect("/login");
  }
}
// **Routing**
app.get("/", (req, res) => res.redirect("/login"));
app.get("/register", (req, res) => {
  res.render("authRegister", { 
    error: req.flash("error"), 
    success: req.flash("success") 
  });
});
app.post("/register", authRegister);
app.get("/login", (req, res) => res.render("authLogin"));
app.post("/login", authLogin);
app.get("/logout", authLogout);

app.use(isAuthenticated)
// **Heroes Routes**
app.get("/heroes", indexHero);
app.get("/heroes/create", createHero);
app.post("/heroes/add",upload.single('photo'),storeHero);
app.get("/heroes/:id/edit", editHero);
app.put("/heroes/:id/edit",upload.single('photo'), updateHero);
app.get("/heroes-detail/:id", getHeroDetail);
app.post("/heroes/:id/delete", deleteHero);

// **Type Routes**
app.get("/type", indexType);
app.get("/type/create", createType);
app.post("/type", storeType);
app.post("/type/:id/delete", deleteType);
app.get("/", (req, res) => {
  if (req.session.user) {
      res.redirect("/heroes");
  } else {
      res.redirect("/login");
  }
});

// **Server Listen**
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
