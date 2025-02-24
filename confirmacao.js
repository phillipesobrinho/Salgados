document.addEventListener('DOMContentLoaded', function () {
    const valorPagamentoElement = document.getElementById('valorPagamento');
    const pagamentoConfirmadoButton = document.getElementById('pagamentoConfirmado');
    const mensagemPagamentoDiv = document.getElementById('mensagemPagamento');

    const valorPagamento = localStorage.getItem('valorPagamento');
    valorPagamentoElement.textContent = `${valorPagamento}€`;

    pagamentoConfirmadoButton.addEventListener('click', function () {
        mensagemPagamentoDiv.textContent = "Pagamento confirmado! Seu pedido está sendo processado.";
        pagamentoConfirmadoButton.disabled = true;
    });
});