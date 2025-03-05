const path = require("path");
const multer = require("multer");
const fs = require("fs");
const db = require("../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { Type, Hero, User } = require("../models");
const { where } = require("sequelize");

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/uploads'); 
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

// Filter hanya menerima gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
  } else {
      cb(new Error('File harus berupa gambar (JPEG, PNG, GIF).'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//  List Semua Hero
const indexHero = async (req, res) => {
  try {
    const heroes = await Hero.findAll({ include: [{ model: Type, as: "type" }] });
    res.render("heroes", { heroes, user: req.session.user });
  } catch (error) {
    console.error("Error fetching heroes:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data hero.");
  }
};

//  Render Halaman Tambah Hero
const createHero = async (req, res) => {
  try {
    const types = await Type.findAll();
    res.render("heroes-create", { types });
  } catch (error) {
    console.error("Error rendering create hero page:", error);
    res.status(500).send("Terjadi kesalahan saat menampilkan halaman tambah hero.");
  }
};

//  Simpan Hero Baru
const storeHero = async (req, res) => {
  try {
    if (!req.body.name || !req.body.type_id) {
      return res.status(400).send("Hero name and type are required.");
    }

    const photo = req.file ? `/uploads/${req.file.filename}` : "https://picsum.photos/200";

    await Hero.create({
      name: req.body.name,
      type_id: req.body.type_id,
      photo: photo,
      user_id: req.session.user.id,
    });

    res.redirect("/heroes");
  } catch (error) {
    console.error("Error creating hero:", error);
    res.status(500).send("Terjadi kesalahan saat menyimpan hero.");
  }
};


// Render Halaman Edit Hero
const editHero = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) return res.status(404).send("Hero tidak ditemukan");

    const types = await Type.findAll();
    res.render("heroes-edit", { hero, types });
  } catch (error) {
    console.error("Error fetching hero for edit:", error);
    res.status(500).send("Terjadi kesalahan saat menampilkan halaman edit hero.");
  }
};

//  Update Hero
const updateHero = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) return res.status(404).send("Hero tidak ditemukan");

    let newPhoto = hero.photo;
    if (req.file) {
      if (hero.photo && !hero.photo.startsWith("https://")) {
        const oldPhotoPath = path.join(__dirname, "../public", hero.photo);
        if (fs.existsSync(oldPhotoPath)) fs.unlinkSync(oldPhotoPath);
      }
      newPhoto = `/uploads/${req.file.filename}`;
    }

    await hero.update({
      name: req.body.name,
      type_id: req.body.type_id,
      photo: newPhoto,
    });

    res.redirect("/heroes");
  } catch (error) {
    console.error("Error updating hero:", error);
    res.status(500).send("Terjadi kesalahan saat mengupdate hero.");
  }
};

// Detail Hero
const getHeroDetail = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id, { include: [{ model: Type, as: "type" }] });
    if (!hero) return res.status(404).send("Hero tidak ditemukan");

    res.render("heroes-detail", { hero });
  } catch (error) {
    console.error("Error fetching hero details:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil detail hero.");
  }
};

//  Hapus Hero
const deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) return res.status(404).send("Hero tidak ditemukan");

    // Hapus foto hero jika ada
    if (hero.photo) {
      const photoPath = path.join(__dirname, "../public", hero.photo);
      if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
    }

    await hero.destroy();
    res.redirect("/heroes");
  } catch (error) {
    console.error("Error deleting hero:", error);
    res.status(500).send("Terjadi kesalahan saat menghapus hero.");
  }
};

// List semua type
const indexType = async (req, res) => {
  try {
    const types = await Type.findAll(); 
    res.render("type", { types, user: req.session.user });
  } catch (error) {
    console.error("Error fetching types:", error);
    res.status(500).send("Internal Server Error");
  }
};


// Render halaman tambah type
const createType = async (req, res) => {
  try {
    const types = await db.Type.findAll(); 
    res.render("type-create", { types }); 
  } catch (error) {
    console.error("Error fetching types for create page:", error);
    res.status(500).send("Terjadi kesalahan saat menampilkan halaman tambah type.");
  }
};


// Simpan type baru
const storeType = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      req.flash("error", "Type name is required!");
      return res.redirect("/type/create");
    }

    await Type.create({ name });

    req.flash("success", "Type added successfully!");
    const types = await Type.findAll();
    res.render("type-create", { types });
  } catch (error) {
    console.error("Error adding type:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Hapus type
const deleteType = async (req, res) => {
  try {
    const type = await db.Type.findByPk(req.params.id);
    if (!type) return res.status(404).send("Type tidak ditemukan");

    await type.destroy();
    res.redirect("/type/create");
  } catch (error) {
    console.error("Error deleting type:", error);
    res.status(500).send("Terjadi kesalahan saat menghapus type.");
  }
};


// Register user
const authRegister = async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;
    // cek email apakah sudah ada
    const existingEmail = await db.User.findOne({ where: {email} });
    if (existingEmail) {
      req.flash("error", "email is already registered, please use another email");
      return res.redirect("/register");
    }
    // cek kesamaan passwrd
    if (password !== confirmPassword) {
      req.flash("error", "Password and Confirm Password miss match!");
      return res.redirect("/register");
    }
    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    await db.User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });
    req.flash("success", "Success, please login!" )
    res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Terjadi kesalahan saat registrasi.");
  }
};

// Login user
const authLogin = async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { email: req.body.email } });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      req.flash("error", "Email atau password salah!");
      return res.redirect("/login");
    }
      req.session.user = { id: user.id, username: user.username, email: user.email };
      req.session.save(() => {
        res.redirect("/heroes");
      });
  } catch (error) {
    res.status(500).send("terjadi error saat login");
  }
};

// Logout user
const authLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};


module.exports = {
  indexHero, createHero, storeHero, editHero, updateHero, getHeroDetail, deleteHero,
  indexType, createType, storeType, deleteType,
  authRegister, authLogin, authLogout, upload,
};
