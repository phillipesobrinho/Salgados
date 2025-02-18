document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos HTML que serão usados
    const cartItemsContainer = document.getElementById('cart-items'); // Div onde os itens do carrinho serão exibidos
    const totalElement = document.querySelector('.total'); // Span onde o preço total será exibido
    const cartIcon = document.getElementById('cart-icon'); // Ícone do carrinho (para evento de clique)
    const cartCountElement = cartIcon.querySelector('.cart-count'); // Span onde o número de itens no carrinho será exibido

    // Recupera os itens do carrinho do localStorage ou inicializa um array vazio
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Função para atualizar a exibição do carrinho
    function atualizarCarrinho() {
        cartItemsContainer.innerHTML = ""; // Limpa o conteúdo do carrinho antes de renderizar os itens

        let total = 0; // Variável para calcular o preço total

        // Itera sobre os itens do carrinho
        cartItems.forEach((item, index) => {
            const itemDiv = document.createElement('div'); // Cria um novo elemento div para cada item

            // Define o HTML do item (usando template literals)
            itemDiv.innerHTML = `
                <div class="card mb-3">  <div class="card-body">
                        <div class="row align-items-center"> <div class="col-md-2">
                                <img src="imgs/2.jpeg" alt="Menu ${item.produto_id}" width="50"> </div>
                            <div class="col-md-5">
                                <h5 class="card-title">Menu ${item.produto_id}</h5> <p class="card-text">Quantidade: ${item.quantidade}</p> </div>
                            <div class="col-md-3 text-end">  <p class="card-text">Preço: ${(item.preco_unitario * item.quantidade).toFixed(2)}€</p> <button class="btn btn-danger btn-sm mt-2 remover-item" data-index="${index}">Remover</button> </div>
                        </div>
                    </div>
                </div>
            `;

            cartItemsContainer.appendChild(itemDiv); // Adiciona o item ao container do carrinho
            total += item.preco_unitario * item.quantidade; // Atualiza o preço total
        });

        totalElement.textContent = `${total.toFixed(2)}€`; // Exibe o preço total formatado
        cartCountElement.textContent = cartItems.length; // Exibe o número de itens no carrinho

        // Adiciona os event listeners aos botões "Remover" *depois* de criar os elementos
        const botoesRemover = document.querySelectorAll('.remover-item');
        botoesRemover.forEach(botao => {
            botao.addEventListener('click', removerItem);
        });
    }

    // Função para remover um item do carrinho
    function removerItem(event) {
        const index = event.target.dataset.index; // Obtém o índice do item a ser removido
        cartItems.splice(index, 1); // Remove o item do array cartItems
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Salva o carrinho atualizado no localStorage
        atualizarCarrinho(); // Atualiza a exibição do carrinho
    }

    atualizarCarrinho(); // Chama a função para exibir os itens do carrinho ao carregar a página

    // Evento de clique no ícone do carrinho (redireciona para a página do carrinho)
    cartIcon.addEventListener('click', () => {
        window.location.href = 'carrinho.html'; // Ou o link para sua página do carrinho
    });

    // Evento de "storage" (executado quando o localStorage é alterado em outra aba/janela)
    window.addEventListener('storage', (event) => {
        if (event.key === 'cartItems') { // Verifica se a chave alterada é 'cartItems'
            cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; // Atualiza o array cartItems
            atualizarCarrinho(); // Atualiza a exibição do carrinho
        }
    });
});