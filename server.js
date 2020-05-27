// configurando o servidor
const express = require('express')
const server = express()

// configurar o servidor pra apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

// configurar a conexão com banco de dados postgres
// Pool tipo de conexão que mantém ativa
const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  password: '159*',
  host: 'localhost',
  port: 5432,
  database: 'doe'
})

// configurando a  template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
  express: server,
  noCache: true,
})

// lista de doadore: Vetor ou Array
/* const donors = [
  {
    name: "Carlos Décio",
    blood: "B+"
  },
  {
    name: "Carla Janaina",
    blood: "A+"
  },
  {
    name: "Maria Júlia",
    blood: "B+"
  },
  {
    name: "Maria",
    blood: "O-"
  },
] 
*/
// configurar a apresentação da página
server.get("/", function(req, res) {
  
  db.query("SELECT * FROM donors", function(err, result){
    console.log(err)
    if (err) return res.send("Erro de banco de dados.")

    const donors = result.rows
    return res.render("index.html", { donors })
  })

  
})

server.post("/", function(req, res) {
  // pegar dados do formulário
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood

  // colocar valores dentro do array
  /*donors.push({
    name: name,
    blood: blood,
  })*/

  // Se o name igual a vazio
  // OU o email igual a vazio
  // OU o blood igaul a vazio
  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.")
  }
 

  // colocar valores dentro do banco de dados
  const query = `
  INSERT INTO donors ("name", "email", "blood") 
  VALUES ($1, $2, $3)`

  const values = [name, email, blood]

  db.query(query, values, function(err) {
    // fluxo de erro
    console.log(err)
    if (err) return res.send("erro no banco de dados.")

    // fluxo ideal
    return res.redirect("/")
  })
})

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
  console.log("iniciei o servidor")
})
