document.addEventListener('DOMContentLoaded', function () {
    const orderIdElement = document.getElementById('order-id');
    const orderDateElement = document.getElementById('order-date');
    const orderItemsElement = document.getElementById('order-items');
    const deliveryAddressElement = document.getElementById('delivery-address');
    const orderStatusElement = document.getElementById('order-status');
    const pagarAgoraButton = document.getElementById('pagar-agora');

    // Recupera os dados do pedido do localStorage
    const orderData = JSON.parse(localStorage.getItem('orderData'));
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; // Recupera os itens do carrinho
    const deliveryInfo = JSON.parse(localStorage.getItem('deliveryInfo')) || {}; // Recupera as informações de entrega


    if (orderData) {
        orderIdElement.textContent = orderData.id;
        // Formata a data para um formato legível (ex: DD/MM/AAAA)
        const orderDate = new Date(orderData.date);
        const formattedDate = `${orderDate.getDate()}/${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`;
        orderDateElement.textContent = formattedDate;

        // Exibe os itens do pedido
        cartItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <div class="card mb-2">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-2">
                                <img src="imgs/2.jpeg" alt="Menu ${item.produto_id}" width="50">
                            </div>
                            <div class="col-md-7">
                                <h5 class="card-title">Menu ${item.produto_id}</h5>
                                <p class="card-text">Quantidade: ${item.quantidade}</p>
                            </div>
                            <div class="col-md-3 text-end">
                                <p class="card-text">Preço: ${(item.preco_unitario * item.quantidade).toFixed(2)}€</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            orderItemsElement.appendChild(itemDiv);
        });

        // Exibe as informações de entrega
        if (deliveryInfo) {
            if (deliveryInfo.tipoEntrega === 'levantar-local') {
                deliveryAddressElement.innerHTML = "<p>Retirada no local</p>";
            } else if (deliveryInfo.tipoEntrega === 'entrega-morada') {
                deliveryAddressElement.innerHTML = `
                    <p><strong>Zona:</strong> ${deliveryInfo.zone}</p>
                    <p><strong>Morada:</strong> ${deliveryInfo.address}, ${deliveryInfo.number}</p>
                    <p><strong>Complemento:</strong> ${deliveryInfo.complement || "N/A"}</p>
                    <p><strong>Código Postal:</strong> ${deliveryInfo.postalCode}</p>
                    <p><strong>Telefone:</strong> ${deliveryInfo.phone}</p>
                    <p><strong>Data de Entrega:</strong> ${deliveryInfo.deliveryDate}</p>
                    <p><strong>Hora de Entrega:</strong> ${deliveryInfo.deliveryTime}</p>
                `;
            }
        } else {
            deliveryAddressElement.textContent = "Informações de entrega não encontradas.";
        }


        // Status do pedido (simulado)
        orderStatusElement.textContent = "Em processamento";


        // Lógica para o botão "Pagar Agora"
        pagarAgoraButton.addEventListener('click', function () {
            // Redireciona para a página de pagamento (substitua pelo URL correto)
            window.location.href = 'pagamento.html';
        });

    } else {
        // Se não houver dados do pedido, exibe uma mensagem
        orderIdElement.textContent = "Pedido não encontrado.";
        orderDateElement.textContent = "";
        deliveryAddressElement.textContent = "";
        orderItemsElement.textContent = "";
        orderStatusElement.textContent = "";
        pagarAgoraButton.style.display = 'none'; // Esconde o botão "Pagar Agora"
    }
});