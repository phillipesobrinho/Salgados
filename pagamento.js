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

    gerarReferenciaButton.textContent = "Finalizar"; // Alterando o texto do botão

    gerarReferenciaButton.addEventListener('click', (event) => {
        event.preventDefault();

        const total = parseFloat(totalElement.textContent.replace('€', ''));
        const valorPagamento = (total / 2).toFixed(2); // Calcula 50% do total

        localStorage.setItem('valorPagamento', valorPagamento); // Salva o valor para a próxima página

        window.location.href = 'confirmacao.html'; // Redireciona para a página de confirmação
    });
});