document.addEventListener('DOMContentLoaded', function () {
    const orderItemsContainer = document.getElementById('orderItemsContainer');
    const deliveryInfoContainer = document.getElementById('deliveryInfoContainer');
    const subtotalElement = document.getElementById('subtotal');
    const taxaEntregaElement = document.getElementById('taxaEntrega');
    const totalElement = document.getElementById('total');
    const gerarReferenciaButton = document.getElementById('gerarReferencia');
    const mensagemDiv = document.getElementById('mensagem');
    const referenciaDiv = document.getElementById('referencia');
    const deliveryInfo = JSON.parse(localStorage.getItem('deliveryInfo')) || {};
    console.log("Dados de entrega recuperados:", deliveryInfo);

    function atualizarResumoPedido() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let subtotal = 0;

        orderItemsContainer.innerHTML = "";

        cartItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">Menu ${item.produto_id}</h5>
                        <p class="card-text">Quantidade: ${item.quantidade}</p>
                        <p class="card-text">Preço: ${(item.preco_unitario * item.quantidade).toFixed(2)}€</p>
                    </div>
                </div>
            `;
            orderItemsContainer.appendChild(itemDiv);
            subtotal += item.preco_unitario * item.quantidade;
        });

        subtotalElement.textContent = `${subtotal.toFixed(2)}€`;

        const taxaEntrega = parseFloat(localStorage.getItem('taxaEntrega')) || 0.00;
        taxaEntregaElement.textContent = `${taxaEntrega.toFixed(2)}€`;

        const total = subtotal + taxaEntrega;
        totalElement.textContent = `${total.toFixed(2)}€`;
    }

    function exibirInformacoesEntrega() {
        if (deliveryInfo && Object.keys(deliveryInfo).length > 0 && deliveryInfo.address !== "N/A") {
            document.getElementById('zone').textContent = deliveryInfo.zone || "N/A";
            document.getElementById('address').textContent = deliveryInfo.address || "N/A";
            document.getElementById('number').textContent = deliveryInfo.number || "N/A";
            document.getElementById('complement').textContent = deliveryInfo.complement || "N/A";
            document.getElementById('postalCode').textContent = deliveryInfo.postalCode || "N/A";
            document.getElementById('phone').textContent = deliveryInfo.phone || "N/A";
        } else {
            deliveryInfoContainer.innerHTML = "<p>Informações de entrega não encontradas.</p>";
        }
    }

    atualizarResumoPedido();
    exibirInformacoesEntrega();

    window.addEventListener('storage', function (event) {
        if (event.key === 'cartItems' || event.key === 'deliveryInfo' || event.key === 'taxaEntrega') {
            atualizarResumoPedido();
            exibirInformacoesEntrega();
        }
    });

    gerarReferenciaButton.addEventListener('click', (event) => {
        event.preventDefault();

        const total = parseFloat(totalElement.textContent.replace('€', ''));
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const deliveryInfo = JSON.parse(localStorage.getItem('deliveryInfo')) || {};

        fetch('http://localhost:3000/processar_pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cliente: deliveryInfo,
                itens: cartItems,
                total: total,
                metodo_pagamento: 'cartao'
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message || `HTTP error! status: ${response.status}`); });
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'aprovado') {
                    mensagemDiv.textContent = "Pedido realizado com sucesso!";
                    referenciaDiv.textContent = data.referencia;
                    localStorage.removeItem('cartItems');
                    // window.location.href = 'confirmacao.html'; // Opcional: Redirecionar para página de confirmação
                } else {
                    mensagemDiv.textContent = data.mensagem || "Erro ao processar pagamento.";
                    referenciaDiv.textContent = ""; // Limpa a referência em caso de erro
                }
            })
            .catch(error => {
                console.error("Erro na requisição:", error);
                mensagemDiv.textContent = "Erro ao finalizar pedido. Tente novamente mais tarde.";
                referenciaDiv.textContent = ""; // Limpa a referência em caso de erro
            });
    });

    atualizarResumoPedido();
    exibirInformacoesEntrega();

    window.addEventListener('storage', function (event) {
        if (event.key === 'cartItems' || event.key === 'deliveryInfo' || event.key === 'taxaEntrega') {
            atualizarResumoPedido();
            exibirInformacoesEntrega();
        }
    });
});




// document.getElementById('(gerarReferencia)').addEventListener('click', () => {
//     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     const deliveryInfo = JSON.parse(localStorage.getItem('deliveryInfo')) || {};
//     const total = parseFloat(document.getElementById('resumo-total').textContent.replace('Total: ', ''));

//     fetch('http://localhost:3000/processar_pedido', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             itens: cartItems,
//             cliente: deliveryInfo,
//             total: total
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.status === 'aprovado') {
//             document.getElementById('mensagem').textContent = 'Pedido realizado com sucesso!';
//             document.getElementById('referencia').textContent = data.referencia;
//             // Limpar carrinho, redirecionar, etc.
//         } else {
//             document.getElementById('mensagem').textContent = data.mensagem || 'Erro ao processar pagamento.';
//         }
//     })
//     .catch(error => {
//         console.error('Erro na requisição:', error);
//         document.getElementById('mensagem').textContent = 'Erro ao processar pagamento. Tente novamente mais tarde.';
//     });
// });
// });