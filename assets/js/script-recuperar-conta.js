document.addEventListener('DOMContentLoaded', () => {
    const botaoOlho = document.getElementById('botaoOlho1');
    const inputSenha = document.getElementById('senha-nova');
    const iconeOlho = document.getElementById('iconeOlho1')

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

    const botaoOlho1 = document.getElementById('botaoOlho2');
    const inputSenha1 = document.getElementById('confirmar-senha');
    const iconeOlho1 = document.getElementById('iconeOlho2')

    botaoOlho1.addEventListener('click',()=>{
        if(inputSenha1.type === 'password'){
            inputSenha1.type = 'text';
            iconeOlho1.src = '../assets/img/olho-aberto.svg';
                iconeOlho1.alt = 'Ocultar senha';
        }else{
            inputSenha1.type = 'password';
            iconeOlho1.src = '../assets/img/olho-fechado.svg';
            iconeOlho1.alt = 'Mostrar senha';
        }
    })
});