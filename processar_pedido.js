const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// Configuração da conexão com o MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Asc25.23',
    database: 'salgado'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

app.post('/processar_pedido', (req, res) => { // Correção da sintaxe
    const orderData = req.body;
    console.log("Dados recebidos do frontend:", orderData);

    db.beginTransaction((err) => {
        if (err) {
            console.error("Erro ao iniciar transação:", err);
            return res.status(500).json({ error: "Erro ao iniciar transação" });
        }

        const clienteQuery = `INSERT INTO clientes (nome, morada, numero, complemento, codigo_postal, telemovel) 
                            VALUES (?, ?, ?, ?, ?, ?)`;
        db.execute(clienteQuery, [
            orderData.cliente.name,
            orderData.cliente.address,
            orderData.cliente.number,
            orderData.cliente.complement,
            orderData.cliente.postalCode,
            orderData.cliente.phone
        ], (err, clienteResults) => {
            if (err) {
                console.error('Erro ao inserir cliente:', err);
                return db.rollback(() => res.status(500).json({ error: 'Falha ao salvar os dados do cliente' }));
            }

            const clienteId = clienteResults.insertId;
            console.log("Cliente inserido com ID:", clienteId);

            const pedidoQuery = `INSERT INTO pedidos (cliente_id, total, metodo_pagamento) VALUES (?, ?, ?)`;
            db.execute(pedidoQuery, [clienteId, orderData.total, orderData.paymentMethod], (err, pedidoResults) => { // Valores corrigidos
                if (err) {
                    console.error('Erro ao inserir pedido:', err);
                    return db.rollback(() => res.status(500).json({ error: 'Falha ao salvar os dados do pedido' }));
                }

                const pedidoId = pedidoResults.insertId;
                console.log("Pedido inserido com ID:", pedidoId);

                Promise.all(orderData.itens.map(item => {
                    return new Promise((resolve, reject) => {
                        const findItemQuery = `SELECT id, preco_unitario FROM itens WHERE id = ?`;
                        db.execute(findItemQuery, [item.produto_id], (err, itemResults) => {
                            if (err) {
                                console.error("Erro ao buscar item:", err);
                                return reject(err);
                            }

                            if (itemResults.length === 0) {
                                console.error("Item não encontrado:", item.produto_id);
                                return reject(new Error("Item não encontrado"));
                            }

                            const itemData = itemResults[0];
                            const itemQuery = `INSERT INTO pedido_itens (pedido_id, item_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)`;
                            db.execute(itemQuery, [pedidoId, item.produto_id, item.quantidade, itemData.preco_unitario], (err) => {
                                if (err) {
                                    console.error("Erro ao inserir item:", err);
                                    return reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        });
                    });
                }))
                .then(() => {
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Erro ao finalizar transação:", err);
                                return res.status(500).json({ error: "Erro ao finalizar transação" });
                            });
                        }
                        console.log("Transação finalizada com sucesso!");
                        return res.status(200).json({ status: 'aprovado', referencia: pedidoId });
                    });
                })
                .catch(err => {
                    return db.rollback(() => {
                        console.error("Erro ao inserir itens:", err);
                        return res.status(500).json({ error: 'Falha ao salvar itens do pedido' });
                    });
                });
            });
        });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`);
});