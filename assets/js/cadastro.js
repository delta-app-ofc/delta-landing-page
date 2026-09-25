document.getElementById('form-cadastro').addEventListener('submit', async function(event) {
    event.preventDefault();

    const dadosUsuario = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value
    };

    try {
        const resposta = await fetch('http://localhost:8080/api/usuarios', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosUsuario)
        });

        if (resposta.ok) {
            window.location.href = 'landing-login.html'; 
        } else {
            alert('Erro ao cadastrar. Verifique os dados e tente novamente.');
        }
    } catch (erro) {
        console.error('Erro na conexão com a API:', erro);
        alert('Não foi possível conectar ao servidor.');
    }
});