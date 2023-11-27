//express 가져오기
const express = require("express");
//cors 가져오기
const cors = require("cors");
//mysql 가져오기
const mysql = require("mysql");
//multer 가져오기
const multer = require("multer");
//env 가져우기
const dotenv = require("dotenv");

const app = express();
const port = process.env.PORT || 8004;

app.use(cors());

app.use(express.json());

dotenv.config();

app.use("/upload", express.static("upload"));

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "upload/projects/");
  },
  filename: (req, file, cd) => {
    const newFilename = file.originalname;
    cd(null, newFilename);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.send({
    imgUrl: req.file.filename,
  });
});

const conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DATABASE,
});

conn.connect();
//개인플 조회
app.get("/projectSole", async (req, res) => {
  conn.query(
    "select * from project where p_party= 'Solo'",
    (err, result, fields) => {
      if (result) {
        console.log(result);
        res.send(result);
      }
      console.log(err);
    }
  );
});
//팀플 조회
app.get("/projectTeam", async (req, res) => {
  conn.query(
    "select * from project where p_party= 'Team'",
    (err, result, fields) => {
      if (result) {
        console.log(result);
        res.send(result);
      }
      console.log(err);
    }
  );
});
//프로젝트 선택
app.get("/selectProject/:isNo", async (req, res) => {
  const { isNo } = req.params;
  conn.query(
    `select * from project where p_no = ${isNo}`,
    (err, result, fields) => {
      if (result) {
        console.log(result);
        res.send(result);
      }
      console.log(err);
    }
  );
});

app.listen(port, () => {
  console.log("서버 작동중");
});
