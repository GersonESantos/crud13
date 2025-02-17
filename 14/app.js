const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gabibi89*",
  database: "projeto"
});

db.connect(err => {
  if (err) throw err;
  console.log("Banco de dados conectado!");
});

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Mantém o nome original do arquivo
  }
});

// const storage = multer.diskStorage({
//   destination: "./uploads",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Adiciona timestamp ao nome do arquivo
//   }
// });

const upload = multer({ storage });

app.post("/clientes", upload.single("imagem"), (req, res) => {
  const { nome, email, telefone, afinidade } = req.body;
  const imagem = req.file ? req.file.filename : null;

  const sql = "INSERT INTO cliente (nome, email, telefone, afinidade, imagem) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [nome, email, telefone, afinidade, imagem], (err, result) => {
    if (err) {
      console.error("Erro ao inserir no banco:", err);
      return res.status(500).send("Erro ao cadastrar cliente.");
    }
    res.send("Cliente cadastrado com sucesso!");
  });
});

app.get("/clientes", (req, res) => {
  db.query("SELECT * FROM cliente", (err, results) => {
    if (err) {
      console.error("Erro ao buscar clientes:", err);
      return res.status(500).send("Erro ao buscar clientes.");
    }
    res.json(results);
  });
});

app.get("/clientes/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM cliente WHERE id = ?";
  db.query(sql, [parseInt(id, 10)], (err, result) => {
    if (err) {
      console.error("Erro ao buscar cliente:", err);
      return res.status(500).send("Erro ao buscar cliente.");
    }
    if (result.length === 0) {
      return res.status(404).send("Cliente não encontrado");
    }
    res.json(result[0]);
  });
});

app.put("/clientes/:id", upload.single("imagem"), (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, afinidade } = req.body;
  const imagem = req.file ? req.file.filename : null;

  const sql = "UPDATE cliente SET nome = ?, email = ?, telefone = ?, afinidade = ?, imagem = ? WHERE id = ?";
  db.query(sql, [nome, email, telefone, afinidade, imagem, parseInt(id, 10)], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar cliente:", err);
      return res.status(500).send("Erro ao atualizar cliente.");
    }
    res.send("Cliente atualizado com sucesso!");
  });
});

app.delete("/clientes/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM cliente WHERE id = ?";
  db.query(sql, [parseInt(id, 10)], (err, result) => {
    if (err) {
      console.error("Erro ao deletar cliente:", err);
      return res.status(500).send("Erro ao deletar cliente.");
    }
    res.send("Cliente deletado com sucesso!");
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(8080, () => {
  console.log("Servidor rodando em http://localhost:8080");
});