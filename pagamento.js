document.addEventListener('DOMContentLoaded', function () {
    const orderItemsContainer = document.getElementById('orderItemsContainer');
    const deliveryInfoContainer = document.getElementById('deliveryInfoContainer');
    const subtotalElement = document.getElementById('subtotal');
    const taxaEntregaElement = document.getElementById('taxaEntrega');
    const totalElement = document.getElementById('total');
    const gerarReferenciaButton = document.getElementById('gerarReferencia');
    const mensagemDiv = document.getElementById('mensagem');
    const referenciaDiv = document.getElementById('referencia');

    const orderData = JSON.parse(localStorage.getItem('orderData'));
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const taxaEntrega = parseFloat(localStorage.getItem('taxaEntrega')) || 0.00;

    function atualizarResumoPedido() {
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
        taxaEntregaElement.textContent = `${taxaEntrega.toFixed(2)}€`;
        const total = subtotal + taxaEntrega;
        totalElement.textContent = `${total.toFixed(2)}€`;
    }

    function exibirInformacoesEntrega() {
        try {
            if (orderData && orderData.deliveryInfo) {
                const deliveryInfo = orderData.deliveryInfo;

                const nome = deliveryInfo.name ? `<p><strong>Nome:</strong> ${deliveryInfo.name}</p>` : "";
                const morada = deliveryInfo.address ? `<p><strong>Morada:</strong> ${deliveryInfo.address}, ${deliveryInfo.number || "N/A"} ${deliveryInfo.complement ? ', ' + deliveryInfo.complement : ''}</p>` : "";
                const codigoPostal = deliveryInfo.postalCode ? `<p><strong>Código Postal:</strong> ${deliveryInfo.postalCode}</p>` : "";
                const telemovel = deliveryInfo.phone ? `<p><strong>Telemóvel:</strong> ${deliveryInfo.phone}</p>` : "";
                const metodoPagamento = deliveryInfo.paymentMethod ? `<p><strong>Método de Pagamento:</strong> ${deliveryInfo.paymentMethod}</p>` : "";

                deliveryInfoContainer.innerHTML = `
                    ${nome}
                    ${morada}
                    ${codigoPostal}
                    ${telemovel}
                    ${metodoPagamento}
                `;
            } else {
                deliveryInfoContainer.innerHTML = "<p>Informações de entrega não encontradas.</p>";
            }
        } catch (error) {
            console.error("Erro ao exibir informações de entrega:", error);
            deliveryInfoContainer.innerHTML = "<p>Ocorreu um erro ao exibir as informações de entrega.</p>";
        }
    }


    atualizarResumoPedido();
    exibirInformacoesEntrega();

    window.addEventListener('storage', function (event) {
        if (event.key === 'cartItems' || event.key === 'orderData' || event.key === 'taxaEntrega') {
            atualizarResumoPedido();
            exibirInformacoesEntrega();
        }
    });

    gerarReferenciaButton.addEventListener('click', (event) => {
        event.preventDefault();

        const total = parseFloat(totalElement.textContent.replace('€', ''));
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const deliveryInfo = orderData.deliveryInfo;

        const dataToSend = {  // Dados consistentes para o backend
            cliente: {
                name: deliveryInfo.name,
                address: deliveryInfo.address,
                number: deliveryInfo.number,
                complement: deliveryInfo.complement,
                postalCode: deliveryInfo.postalCode, // Nome do campo consistente com o localStorage e o banco de dados
                phone: deliveryInfo.phone,
            },
            itens: cartItems.map(item => ({
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario,
            })),
            total: total,
            metodo_pagamento: deliveryInfo.paymentMethod,
        };

        console.log("Dados enviados para o backend:", dataToSend); // Verificação importante

        fetch('http://localhost:3000/processar_pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || `HTTP error! status: ${response.status}`); });
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'aprovado') {
                mensagemDiv.textContent = "Seu pedido foi concluído, te ligaremos para confirmar!";
                referenciaDiv.textContent = data.referencia;
                localStorage.removeItem('cartItems');
                localStorage.removeItem('orderData');
                atualizarResumoPedido();
            } else {
                mensagemDiv.textContent = data.mensagem || "Erro ao processar pagamento.";
                referenciaDiv.textContent = "";
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
            mensagemDiv.textContent = "Erro ao finalizar pedido. Tente novamente mais tarde.";
            referenciaDiv.textContent = "";
        });
    });

    atualizarResumoPedido();
    exibirInformacoesEntrega();

    window.addEventListener('storage', function (event) {
        if (event.key === 'cartItems' || event.key === 'orderData' || event.key === 'taxaEntrega') {
            atualizarResumoPedido();
            exibirInformacoesEntrega();
        }
    });
});