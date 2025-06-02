const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");

app.use(cors());

app.use(express.json());

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Hajira2020!",
    database: "InsnapDB"
});

conn.connect(function (err) {
    if (err) {
        console.log("Error connecting to MySQL:", err);
    }
    else {
        console.log("CONNECTED TO DATABASE MYSQL SERVER");
    }
});

app.use(express.static("InsnapFront"));
const router = express.Router();

router.post("/index", function (req, res) {
    console.log("Made request to sign in");
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


router.get("/user-uploads/:username", function (req, res){
      console.log("Grabbing Photos for: " + req.params.username);
  const username = req.params.username;
  conn.query(
    "SELECT * FROM Uploads WHERE Poster = ?",
    [username],
    function (err, rows) {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      console.log(rows)
      return res.status(200).json(rows);
    }
  );
});

const logRequest = function (req, res, next) {
    console.log(`Request: ${req.method} for ${req.path}`);
    next();
};

app.use(logRequest);

app.use("/api", router);


app.listen(3001, function () {
    console.log("Listening on port 3001...");
});