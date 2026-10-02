document.addEventListener('DOMContentLoaded', () => {
    const botaoOlho = document.getElementById('botaoOlho');
    const inputSenha = document.getElementById('senha');
    const iconeOlho = document.getElementById('iconeOlho')

    botaoOlho.addEventListener('click',()=>{
        if(inputSenha.type === 'password'){
            inputSenha.type = 'text';

            iconeOlho.src = '../assets/img/olho-aberto.svg';
            iconeOlho.alt = 'Ocultar senha';
        }else{
            inputSenha.type = 'password';

            iconeOlho.src = '../assets/img/olho-fechado.svg';
            iconeOlho.alt = 'Mostrar senha';
        }
    })
});