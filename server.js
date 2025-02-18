const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Configuração da conexão com o MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Asc25.23',
    database: 'cox'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

// Rotas da API

// Obter menus
app.get('/menus', (req, res) => {
    db.execute('SELECT * FROM menus')
        .then(([rows]) => res.json(rows))
        .catch(err => {
            console.error("Erro ao buscar menus:", err);
            res.status(500).json({ error: 'Erro ao buscar menus' });
        });
});

// Buscar todos os itens
app.get('/todos_itens', (req, res) => {
    db.execute('SELECT * FROM itens')
        .then(([rows]) => res.json(rows))
        .catch(err => {
            console.error("Erro ao buscar itens:", err);
            res.status(500).json({ error: 'Erro ao buscar itens' });
        });
});

// Buscar itens por menu_id
app.post('/processar_pedido', (req, res) => {
    const { cliente, itens, total, metodo_pagamento } = req.body;

    db.beginTransaction()
    .then(() => {
        return db.execute('INSERT INTO clientes (nome, endereco, numero, complemento, cep, telefone) VALUES (?, ?, ?, ?, ?, ?)', [cliente.nome, cliente.endereco, cliente.numero, cliente.complemento, cliente.cep, cliente.telefone]);
    })
    .then(([result]) => {
        const cliente_id = result.insertId;
        return db.execute('INSERT INTO pedidos (cliente_id, total, status) VALUES (?, ?, ?)', [cliente_id, total, 'pendente']);
    })
    .then(([result]) => {
        const pedido_id = result.insertId;
        const promises = itens.map(item => {
            return db.execute('INSERT INTO pedido_itens (pedido_id, item_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)', [pedido_id, item.produto_id, item.quantidade, item.preco_unitario]);
        });
        return Promise.all(promises).then(() => pedido_id);
    })
    .then(pedido_id => {
        // Simulação de pagamento (ADAPTE PARA SEU GATEWAY)
        const status_pagamento = 'aprovado'; // Ou 'reprovado'
        const referencia = `REF-${pedido_id}-${Date.now()}`; // Exemplo genérico

        return db.execute('INSERT INTO pagamentos (pedido_id, valor, metodo, status, referencia) VALUES (?, ?, ?, ?, ?)', [pedido_id, total, metodo_pagamento, status_pagamento, referencia])
            .then(() => {
                if (status_pagamento === 'aprovado') {
                    return db.execute('UPDATE pedidos SET status = ? WHERE id = ?', ['processando', pedido_id])
                        .then(() => ({ status: status_pagamento, referencia: referencia, pedido_id: pedido_id })); // Retorna status, referência e pedido_id
                } else {
                    return { status: status_pagamento, mensagem: 'Pagamento não aprovado' };
                }
            });
    })
    .then(data => {
        db.commit();
        console.log("Resposta do servidor:", data);
        res.json(data);
    })
    .catch(err => {
        db.rollback();
        console.error("Erro no backend:", err);
        res.status(500).json({ status: 'erro', mensagem: 'Erro ao processar pedido' });
    });
});


// Atualizar o status da entrega (exemplo)
app.put('/pedidos/:id/status', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    db.execute('UPDATE pedidos SET status = ? WHERE id = ?', [status, id])
        .then(() => res.json({ message: 'Status do pedido atualizado' }))
        .catch(err => {
            console.error("Erro ao atualizar status do pedido:", err);
            res.status(500).json({ error: 'Erro ao atualizar status' });
        });
});


// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});