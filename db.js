const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost', // Seu host do MySQL (geralmente localhost)
    user: 'root', // Seu usuário do MySQL
    password: 'Asc25.23', // Sua senha do MySQL
    database: 'cox' // O nome do seu banco de dados (ex: coxinha_express)
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

module.exports = db; // Exporta a conexão para usar em outros arquivos




