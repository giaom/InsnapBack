const env = require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const session = require('express-session');


app.use(cors());

app.use(express.json());

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

conn.connect(function (err) {
    if (err) {
        console.log("Error connecting to MySQL:", err);
    }
    else {
        console.log("CONNECTED TO DATABASE MYSQL SERVER");
    }
});

app.use(session({
  secret: 'a very secret key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/InsnapFront/index.html");
});

app.use(express.static("InsnapFront"));
const router = express.Router();

router.get("/user-uploads/:username/:filter", function (req, res){
const username = req.params.username;
const filter = req.params.filter;
console.log("Was called");


let query = "";
let params = [];

if (filter === "all") {
  query = "SELECT * FROM Uploads WHERE Poster = ? AND Access IN ('PUBLIC', 'PRIVATE', 'FRIENDS')";
  params = [username];
} else {
  query = "SELECT * FROM Uploads WHERE Poster = ? AND Access = ?";
  params = [username, filter.toUpperCase()];
}

conn.query(query, params, function (err, rows) {
    if(err){
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      console.log(rows)
      return res.status(200).json(rows);
    }
  );
});

router.get("/home", function (req, res){
const username = req.params.username;

let query = "";
let params = [];

query = "SELECT * FROM Uploads WHERE Poster = ? AND Access IN ('PUBLIC', 'PRIVATE', 'FRIENDS')";
params = [username];

conn.query(query, params, function (err, rows) {
    if(err){
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      console.log(rows)
      return res.status(200).json(rows);
    }
  );
});


router.get("/check-username", function (req, res) {
    const username = req.query.username;
    conn.query("SELECT * FROM Users WHERE Username = ?",
        [username], function (err, rows) {
            if (err) {
                console.log("ERROR:", err);
            } else if (rows.length == 0) {
                console.log("Marked Username true");
                return res.status(200).json({ taken: false });

            } else {
                return res.status(200).json({ taken: true });

            }

        })
});

router.post("/index", function (req, res) {
    console.log("Made request to sign in");
});


router.get("/check-email", function (req, res) {
    const email = req.query.email;
    conn.query("SELECT * FROM Users WHERE Email = ?",
        [email], function (err, rows) {
            if (err) {
                console.log("ERROR:", err);
            } else if (rows.length == 0) {
                console.log("Marked email true");
                return res.status(200).json({ taken: false });
            } else {
                return res.status(200).json({ taken: true });
            }
        });
});

router.post("/signup", function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    
    conn.query("INSERT INTO Users (Username, ProfilePic, Email, Password)VALUES (?, ?, ?, ?)", [username, null,email, password], function (err, result) {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ success: false, message: "Username or email already exists" });
            }
            console.error("Insert Error:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        console.log("Made User");
        res.status(201).json({ success: true, message: "User created" });
    });
});

router.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    conn.query("SELECT * FROM Users WHERE Username = ?",
    [username], function (err, rows) {
            if (err) {
            console.log("ERROR:", err);
            } else if (rows.length == 0) {
                console.log("No username found");
                return res.status(200).json({ Login: false });
            }
            const user = rows[0];
            if (user.Password === password) {
                console.log("Login Worked");
                req.session.username = username;
                return res.status(200).json({ Login: true });
            } else {
                return res.status(200).json({ Login: false });
            }

        })

    
});

router.get("/current-user", (req, res) => {
  if (req.session.username) {
    return res.json({ username: req.session.username });
  } else {
    return res.json({ username: null });
  }
});


router.post("/upload", function (req, res) {
    const address  = req.body.address;
    const username = req.body.username;
    const access   = req.body.access;
    const caption  = req.body.caption;
    console.log(req.body.access);

    conn.query("INSERT INTO Uploads(Address, Poster, Created_at, Access, Caption, Likes) VALUES (?, ?, NOW(), ?, ?, 0)", [address, username, access, caption], function (err, result) {
        if (err) {
            console.log("Insert Error: " + err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        console.log("Uploaded image");
        res.status(201).json({ success: true, message: "Uploaded image" });
    });
});




const logRequest = function (req, res, next) {
    console.log(`Request: ${req.method} for ${req.path}`);
    next();
};

app.use(logRequest);

app.use("/api", router);


app.listen(3001, function () {
    console.log("Server is running at: http://localhost:3001/auth.html");
});