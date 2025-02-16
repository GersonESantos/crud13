const express = require("express"); // Importa o framework Express
const mysql = require("mysql2"); // Importa o módulo MySQL para Node.js
const cors = require("cors"); // Importa o módulo CORS para permitir requisições de diferentes origens
const bodyParser = require("body-parser"); // Importa o body-parser para parsear o corpo das requisições
const multer = require("multer"); // Importa o multer para upload de arquivos
const path = require("path"); // Importa o path para manipulação de caminhos de arquivos

const app = express(); // Cria uma instância do Express
app.use(cors()); // Habilita o CORS
app.use(bodyParser.json()); // Configura o body-parser para parsear JSON
app.use(express.static("public")); // Serve arquivos estáticos da pasta "public"
app.use("/uploads", express.static("uploads")); // Serve arquivos estáticos da pasta "uploads"

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gabibi89*",
  database: "projeto"
}); // Cria uma conexão com o banco de dados MySQL

db.connect(err => {
  if (err) throw err;
  console.log("Banco de dados conectado!");
}); // Conecta ao banco de dados e exibe uma mensagem no console

// Configuração do upload de imagens
const storage = multer.diskStorage({
  destination: "./uploads", // Define o destino dos arquivos enviados
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Mantém o nome original do arquivo
  }
});

const upload = multer({ storage }); // Cria uma instância do multer com a configuração de armazenamento

// Rota para criar cliente
app.post("/clientes", upload.single("imagem"), (req, res) => {
  const { nome, email, telefone, afinidade } = req.body; // Extrai os dados do corpo da requisição
  const imagem = req.file ? req.file.filename : null; // Obtém o nome do arquivo enviado, se houver

  const sql = "INSERT INTO cliente (nome, email, telefone, afinidade, imagem) VALUES (?, ?, ?, ?, ?)"; // SQL para inserir um novo cliente
  db.query(sql, [nome, email, telefone, afinidade, imagem], (err, result) => {
    if (err) {
      console.error("Erro ao inserir no banco:", err);
      return res.status(500).send("Erro ao cadastrar cliente."); // Retorna erro se a inserção falhar
    }
    res.send("Cliente cadastrado com sucesso!"); // Retorna sucesso se a inserção for bem-sucedida
  });
});

// Rota para listar clientes
app.get("/clientes", (req, res) => {
  db.query("SELECT * FROM cliente", (err, results) => {
    if (err) {
      console.error("Erro ao buscar clientes:", err);
      return res.status(500).send("Erro ao buscar clientes."); // Retorna erro se a consulta falhar
    }
    res.json(results); // Retorna os resultados da consulta em formato JSON
  });
});

// Rota para servir o HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Envia o arquivo index.html como resposta
});

// Inicia o servidor na porta 8080
app.listen(8080, () => {
  console.log("Servidor rodando em http://localhost:8080");
});