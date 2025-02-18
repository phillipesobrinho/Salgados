document.addEventListener('DOMContentLoaded', function () {
    const quantityButtons = document.querySelectorAll('.quantity-button');
    const cartCount = document.querySelector('.cart-count');
    const cartIcon = document.getElementById('cart-icon');

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    updateCartCount();

    quantityButtons.forEach(button => {
        button.addEventListener('click', function () {
            const menu = this.closest('.menu');
            const quantityNumber = menu.querySelector('.quantity-number');
            let quantity = parseInt(quantityNumber.textContent);
            const productId = menu.closest('.col').querySelector('.menu-background').alt.replace('Menu ', '');
            const precoUnitario = parseFloat(this.dataset.preco);

            if (this.classList.contains('increment')) {
                quantity++;
            } else if (quantity > 0) {
                quantity--;
            }

            quantityNumber.textContent = quantity;
            updateCart(productId, quantity, precoUnitario);
        });
    });

    function updateCart(productId, quantity, precoUnitario) {
        let cartItem = cartItems.find(item => item.produto_id === productId);

        if (quantity > 0) {
            if (!cartItem) {
                cartItems.push({ produto_id: productId, quantidade: quantity, preco_unitario: precoUnitario });
            } else {
                cartItem.quantidade = quantity;
            }
        } else if (cartItem) {
            cartItems = cartItems.filter(item => item.produto_id !== productId);
        }
        

        updateCartCount();
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('subtotal', subtotal.toFixed(2));
        localStorage.setItem('taxaEntrega', deliveryFee.toFixed(2));
        localStorage.setItem('total', total.toFixed(2));
    }

    function updateCartCount() {
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantidade, 0);
        cartCount.textContent = totalQuantity;
    }

    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            window.location.href = 'carrinho.html';
        });
    }
});
const botaoPagamento = document.querySelector('.btn-warning'); // Seletor do botão

if (botaoPagamento) {
    botaoPagamento.addEventListener('click', () => {
        window.location.href = 'pagamento.html';
    });
}
