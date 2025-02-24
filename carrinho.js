document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalElement = document.querySelector('.total');
    const cartIcon = document.getElementById('cart-icon');
    const cartCountElement = cartIcon.querySelector('.cart-count');
    const quantityButtons = document.querySelectorAll('.quantity-button');

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    function atualizarCarrinho() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cartItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('card', 'mb-3'); // Adiciona classes diretamente

            itemDiv.innerHTML = `
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
            `;

            cartItemsContainer.appendChild(itemDiv);
            total += item.preco_unitario * item.quantidade;
        });

        totalElement.textContent = `${total.toFixed(2)}€`;
        cartCountElement.textContent = cartItems.length;

        // Event listeners para botões "Remover" (dentro do loop)
        const botoesRemover = cartItemsContainer.querySelectorAll('.remover-item'); // Seleciona apenas os botões dentro do container
        botoesRemover.forEach(botao => {
            botao.addEventListener('click', removerItem);
        });
    }

    function removerItem(event) {
        const index = event.target.dataset.index;
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        atualizarCarrinho();
    }

    atualizarCarrinho();

    cartIcon.addEventListener('click', () => {
        window.location.href = 'carrinho.html';
    });

    window.addEventListener('storage', (event) => {
        if (event.key === 'cartItems') {
            cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            atualizarCarrinho();
        }
    });
});