document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.querySelector('.orders-container');

    function displayOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];

        ordersContainer.innerHTML = '';

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>Nenhum pedido encontrado.</p>';
            return;
        }

        orders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('card', 'mb-3');

            let itemsHTML = '';
            order.items.forEach(item => {
                itemsHTML += `<p>${item.nome} x ${item.quantidade} - R$${(item.quantidade * item.preco_unitario).toFixed(2)}</p>`;
            });

            orderDiv.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">Pedido #${order.id}</h5>
                    <p class="card-text">Data: ${order.date}</p>
                    <p class="card-text">Cliente: ${order.cliente.nome}</p>
                    <p class="card-text">Itens: ${itemsHTML}</p>
                    <p class="card-text">Total: R$${order.total.toFixed(2)}</p>
                    <button class="btn btn-primary pagar-button" data-order-id="${order.id}">Pagar</button>
                </div>
            `;
            ordersContainer.appendChild(orderDiv);
        });

        const pagarButtons = document.querySelectorAll('.pagar-button');
        pagarButtons.forEach(button => {
            button.addEventListener('click', () => {
                const orderId = button.dataset.orderId;
                // Redireciona para a página de pagamento, passando o ID do pedido
                window.location.href = `pagamento.html?order_id=${orderId}`;
            });
        });
    }

    displayOrders();

    window.addEventListener('storage', function (event) {
        if (event.key === 'orders') {
            displayOrders();
        }
    });
});