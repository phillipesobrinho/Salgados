document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do DOM
    const cartItemsContainer = document.getElementById('cart-items'); // Container para os itens do carrinho
    const subtotalElement = document.querySelector('.subtotal'); // Elemento para exibir o subtotal
    const deliveryElement = document.querySelector('.delivery'); // Elemento para exibir a taxa de entrega
    const totalElement = document.querySelector('.total'); // Elemento para exibir o total
    const form = document.getElementById('formulario-entrega'); // Formulário de entrega
    const retirarLocal = document.getElementById('retirar-local'); // Radio button para "Retirar no local"
    const entregarMorada = document.getElementById('delivery-address'); // Radio button para "Entregar na morada"
    const addressFields = document.querySelector('.address-fields'); // Campos de endereço
    const pickupFields = document.querySelector('.pickup-fields'); // Campos de local de retirada

    // Recupera os itens do carrinho do localStorage ou inicializa um array vazio
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let deliveryFee = 5.00; // Valor da taxa de entrega para entrega na morada
    let taxaEntrega = 5; // Valor inicial da taxa de entrega

    // Define a data mínima para entrega como amanhã
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().slice(0, 10);
    document.getElementById('delivery-date').min = tomorrowFormatted;

    // Função para calcular o subtotal e o total
    function calcularTotal() {
        let subtotal = 0;
        cartItems.forEach(item => {
            subtotal += item.preco_unitario * item.quantidade;
        });

        const total = subtotal + taxaEntrega;
        return { subtotal, total };
    }

    // Função para atualizar o resumo do pedido
    function atualizarResumo() {
        const { subtotal, total } = calcularTotal();
        subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
        deliveryElement.textContent = `${taxaEntrega.toFixed(2)}€`;
        totalElement.textContent = `${total.toFixed(2)}€`;
    }

    // Função para atualizar a exibição dos itens do carrinho
    function atualizarCarrinho() {
        cartItemsContainer.innerHTML = ""; // Limpa o container de itens
        cartItems.forEach((item, index) => {
            // Cria um novo elemento div para cada item
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
            cartItemsContainer.appendChild(itemDiv); // Adiciona o item ao container
        });

        // Adiciona event listeners aos botões de remover item
        const removeButtons = cartItemsContainer.querySelectorAll('.remover-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', removerItem);
        });

        atualizarResumo(); // Atualiza o resumo do pedido
    }

    // Função para remover um item do carrinho
    function removerItem(event) {
        const index = event.target.dataset.index; // Obtém o índice do item a ser removido
        cartItems.splice(index, 1); // Remove o item do array
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Salva o carrinho atualizado no localStorage
        atualizarCarrinho(); // Atualiza a exibição do carrinho
    }

    // Event listeners para os radio buttons de entrega
    retirarLocal.addEventListener('change', () => {
        addressFields.style.display = 'none'; // Esconde os campos de endereço
        pickupFields.style.display = 'block'; // Exibe os campos de local de retirada
        document.getElementById('delivery-date').required = false; // Define os campos de data e hora de entrega como não obrigatórios
        document.getElementById('delivery-time').required = false;
        document.getElementById('pickup-date').required = true;  // Define os campos de data e hora de retirada como obrigatórios
        document.getElementById('pickup-time').required = true;
        taxaEntrega = 0; // Define a taxa de entrega como 0
        localStorage.setItem('taxaEntrega', taxaEntrega); // Salva a taxa de entrega no localStorage
        atualizarResumo(); // Atualiza o resumo do pedido
    });

    entregarMorada.addEventListener('change', () => {
        addressFields.style.display = 'block'; // Exibe os campos de endereço
        pickupFields.style.display = 'none'; // Esconde os campos de local de retirada
        document.getElementById('delivery-date').required = true; // Define os campos de data e hora de entrega como obrigatórios
        document.getElementById('delivery-time').required = true;
        document.getElementById('pickup-date').required = false; // Define os campos de data e hora de retirada como não obrigatórios
        document.getElementById('pickup-time').required = false;
        taxaEntrega = deliveryFee; // Define a taxa de entrega como o valor padrão
        localStorage.setItem('taxaEntrega', taxaEntrega); // Salva a taxa de entrega no localStorage
        atualizarResumo(); // Atualiza o resumo do pedido
    });

    // Event listener para o envio do formulário
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const deliveryDate = document.getElementById('delivery-date').value;  // Obtem os valores dos campos
        const deliveryTime = document.getElementById('delivery-time').value;

        let deliveryInfoForm = {
            tipoEntrega: retirarLocal.checked ? 'levantar-local' : 'entrega-morada', // Define o tipo de entrega
        };

        if (entregarMorada.checked) { // Se a entrega for na morada
            deliveryInfoForm = {
                tipoEntrega: 'entrega-morada',
                name: document.getElementById('name').value, // Obtem os dados do formulario
                address: document.getElementById('address').value,
                number: document.getElementById('number').value,
                complement: document.getElementById('complement').value,
                postalCode: document.getElementById('postal-code').value,
                phone: document.getElementById('phone').value,
                deliveryDate, // Adiciona data e hora
                deliveryTime,
                paymentMethod: document.getElementById('paymentMethod').value,
            };
        }

        const orderData = {
            deliveryInfo: deliveryInfoForm, // Dados de entrega
            cartItems: cartItems, // Itens do carrinho
            taxaEntrega: taxaEntrega, // Taxa de entrega
        };

        localStorage.setItem('orderData', JSON.stringify(orderData)); // Salva os dados do pedido no localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Salva os itens do carrinho no localStorage

        console.log("Dados do pedido salvos:", JSON.stringify(orderData));

        // Redireciona para a página de pagamento
        setTimeout(() => {
            window.location.href = 'pagamento.html';
        }, 100);
    });

    if (cartItemsContainer) {
        atualizarCarrinho(); // Atualiza a exibição do carrinho ao carregar a página
    }
});