document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.querySelector('.subtotal');
    const deliveryElement = document.querySelector('.delivery');
    const totalElement = document.querySelector('.total');
    const form = document.getElementById('formulario-entrega');
    const retirarLocal = document.getElementById('retirar-local');
    const proceedButton = document.querySelector('.proceed-button');
    const deliveryDateInput = document.getElementById('delivery-date');
    const deliveryTimeInput = document.getElementById('delivery-time');
    const addressFields = document.querySelector('.address-fields');
    const entregarMorada = document.getElementById('delivery-address');
    const pickupFields = document.querySelector('.pickup-fields');
    

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let deliveryFee = 5.00;

    // Define a data mínima para amanhã
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().slice(0, 10);
    deliveryDateInput.min = tomorrowFormatted;

    function calcularTotal() {
        let subtotal = 0.00;
        cartItems.forEach(item => {
            subtotal += item.preco_unitario * item.quantidade;
        });

        const taxaEntrega = document.getElementById('retirar-local').checked ? 0.00 : deliveryFee;

        const total = subtotal + taxaEntrega;
        return { subtotal, taxaEntrega, total };
    }


    function atualizarResumo() {
        const { subtotal, taxaEntrega, total } = calcularTotal();

        subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
        deliveryElement.textContent = `${taxaEntrega.toFixed(2)}€`;
        totalElement.textContent = `${total.toFixed(2)}€`;
    }

    if (cartItemsContainer) {
        atualizarCarrinho();
    }

    function atualizarCarrinho() {
        cartItemsContainer.innerHTML = "";
        cartItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-2">
                                <img src="imgs/2.jpeg" alt="Menu ${item.produto_id}" width="50">
                            </div>
                            <div class="col-md-5">
                                <h5 class="card-title">Menu ${item.produto_id}</h5>
                                <p class="card-text">Quantidade: ${item.quantidade}</p>
                            </div>
                            <div class="col-md-3 text-end">
                                <p class="card-text">Preço: ${(item.preco_unitario * item.quantidade).toFixed(2)}€</p>
                                <button class="btn btn-danger btn-sm mt-2 remover-item" data-index="${index}">Remover</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        const removeButtons = document.querySelectorAll('.remover-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', removerItem);
        });

        atualizarResumo();
    }

    function removerItem(event) {
        const index = event.target.dataset.index;
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        atualizarCarrinho();
    }

    retirarLocal.addEventListener('change', function () {
        if (this.checked) {
            addressFields.style.display = 'none';
            pickupFields.style.display = 'block';
            document.getElementById('delivery-date').required = false;  // Use document.getElementById here
            document.getElementById('delivery-time').required = false;  // And here
            document.getElementById('pickup-date').required = true;
            document.getElementById('pickup-time').required = true;

            atualizarResumo();
        }
    });

    entregarMorada.addEventListener('change', function () {
        if (this.checked) {
            addressFields.style.display = 'block';
            pickupFields.style.display = 'none';
            document.getElementById('delivery-date').required = true; // Use document.getElementById here
            document.getElementById('delivery-time').required = true; // And here
            document.getElementById('pickup-date').required = false;
            document.getElementById('pickup-time').required = false;

            atualizarResumo();
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Use document.getElementById INSIDE the event handler
        if (!document.getElementById('delivery-date').value || !document.getElementById('delivery-time').value) {
            alert("Por favor, selecione a data e hora de entrega.");
            return;
        }

        let deliveryInfoForm = {};

        if (retirarLocal.checked) {
            deliveryInfoForm = {
                tipoEntrega: 'levantar-local'
            };
        } else {
            deliveryInfoForm = {
                tipoEntrega: 'entrega-morada',
                zone: document.getElementById('zone').value,
                address: document.getElementById('address').value,
                number: document.getElementById('number').value,
                complement: document.getElementById('complement').value,
                postalCode: document.getElementById('postal-code').value,
                phone: document.getElementById('phone').value,
                deliveryDate: document.getElementById('delivery-date').value, // Use document.getElementById here
                deliveryTime: document.getElementById('delivery-time').value // And here
            };
        }
        const orderData = {
            id: '156543', // Ou gere um ID real para o pedido
            date: new Date().toISOString(),
            deliveryInfo: deliveryInfoForm
        };

        localStorage.setItem('orderData', JSON.stringify(orderData));
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        console.log("Dados do pedido salvos:", JSON.stringify(orderData));

        setTimeout(() => {
            window.location.href = 'pagamento.html';
        }, 100);
    });
});