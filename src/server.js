

    const express = require("express");
    const server = express();

    // pegar o banco de dados

    const db = require("./database/db.js");

    // configurar pasta pública
    server.use(express.static("public"));

    // Habilitar o uso do req.body na nossa aplicação
    server.use(express.urlencoded({ extended: true }));


    // utilizando template engine
    const nunjucks = require("nunjucks");
    nunjucks.configure("src/views", {
        express: server,
        noCache: true 
    });


    // configurar caminhos da nossa aplicação

    // página inicial
    // req : Requisição
    // res : Resposta
    server.get("/", (req, res) => {
       return res.render("index.html", { title: "Um título" });
    })

    
    server.get("/create-point", (req, res) => {
        
        // req.query: Query Strings da nossa url
        
        
        return res.render("create-point.html");
    })

    
    server.post("/savepoint", (req, res) => {
        
        // req.body : O corpo do nosso formulário 
        //console.log(req.body);

        // Inserir dados no Banco de Dados

        const query = `
        INSERT INTO places (
                image,
                name,
                adress,
                adress2,
                state,
                city,
                items) VALUES (
            ?, ?, ?, ?, ?, ?, ?
        );
        `

        const values = [
            req.body.image,
            req.body.name,
            req.body.adress,
            req.body.adress2,
            req.body.state,
            req.body.city,
            req.body.item
        ];

        function afterInsertData(err) {
            if(err){
                return console.log(err);
            }

            console.log("Cadastrado com sucesso")
            console.log(this)

            return res.render("create-point.html", { saved: true });
        };

        db.run(query, values, afterInsertData);

        
    })




    server.get("/search-results", (req, res) => {

        const search = req.query.search; 

        if (search == "") {
            // pesquisa vazia
            return res.render("search-results.html", { total: 0 });
        }



        // pegar os dados do Banco de dados
        
        db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
            if (err) {
                console.log(err);
                return res.send("Erro no cadastro");
            }

            console.log("Aqui estão seus registros: ");
            console.log(rows);

            const total = rows.length;

            // mostrar a página html com os registros do Banco de Dados
            return res.render("search-results.html", { places: rows, total: total });
        });

        
    })

    //  ligar o servidor
    server.listen(3000);