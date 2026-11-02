# Delta | Landing Page

**Cada gota inteligentemente controlada.**

Interface web do Projeto Delta, desenvolvido por estudantes do Instituto J&F para promover o uso consciente da água por meio da tecnologia, em alinhamento ao ODS 12: Consumo e Produção Responsáveis.

Este repositório reúne a página de apresentação do projeto, os fluxos demonstrativos de conta e as interfaces administrativas.

## Sobre o projeto

O Delta propõe uma solução de gestão hídrica com monitoramento do consumo, identificação de desperdícios e apoio à tomada de decisões. A landing page apresenta o conceito, os objetivos, as funcionalidades propostas, os planos, a equipe e os valores do projeto.

Recursos como integração com dispositivos IoT, inteligência artificial, previsão de consumo e alertas de vazamento fazem parte da proposta apresentada. Sua execução real não está implementada neste repositório, que contém a interface web e simulações locais.

## Recursos presentes

- Landing page com navegação entre seções, carrosséis e animações.
- Telas de cadastro, entrada de usuários e entrada de administradores.
- Fluxos demonstrativos de verificação e recuperação de senha.
- Área com configurações de perfil e preferências de notificações.
- Interfaces de cadastro, consulta, edição e exclusão de usuários, endereços, imóveis, dispositivos, regiões e tarifas regionais.
- Páginas de termos de uso e política de privacidade.

## Tecnologias

| Tecnologia | Aplicação |
| --- | --- |
| HTML5 | Estrutura das páginas e formulários |
| CSS3 | Estilização, layouts e animações |
| JavaScript | Interações, validações e fluxos demonstrativos |
| Web Storage API | Armazenamento local de dados e sessões |
| Lucide | Ícones utilizados nas interfaces administrativas |
| Google Fonts | Carregamento de fontes em páginas do projeto |

O projeto utiliza HTML, CSS e JavaScript sem etapa de compilação ou instalação de pacotes.

## Organização

| Caminho | Conteúdo |
| --- | --- |
| `pages/` | Páginas HTML da aplicação |
| `assets/css/` | Folhas de estilo |
| `assets/js/` | Scripts de interação e simulação local |
| `assets/img/` | Imagens, ícones, logotipos e ilustrações |
| `assets/fontes/` | Arquivos de fontes locais |
| `LICENSE` | Licença do projeto |

### Principais páginas

| Arquivo | Finalidade |
| --- | --- |
| `pages/index.html` | Página inicial de apresentação |
| `pages/criar-conta.html` | Início do cadastro |
| `pages/entrar-conta.html` | Entrada na conta |
| `pages/entrar-adm.html` | Entrada de administradores |
| `pages/landing-login.html` | Página acessada após a entrada do usuário |
| `pages/inicioCRUD.html` | Início da área administrativa |
| `pages/userCRUD.html` | Gestão de usuários |
| `pages/adressCRUD.html` | Gestão de endereços |
| `pages/propertyCRUD.html` | Gestão de imóveis |
| `pages/deviceCRUD.html` | Gestão de dispositivos |
| `pages/regionCRUD.html` | Gestão de regiões |
| `pages/regionrateCRUD.html` | Gestão de tarifas regionais |

## Como acessar a landing page

### 1. Clone o repositório dentro de uma pasta

Com o Git instalado, crie ou escolha uma pasta no computador para guardar o projeto. Abra um terminal nessa pasta e execute:

```bash
git clone https://github.com/delta-app-ofc/delta-landing-page.git
```

O Git criará a subpasta `delta-landing-page` com os arquivos do repositório.

### 2. Abra a pasta do projeto no VS Code

No Visual Studio Code, acesse **Arquivo > Abrir Pasta** e selecione a pasta `delta-landing-page` criada pela clonagem. Abra a pasta completa, que contém `pages` e `assets`.

### 3. Execute a landing page no VS Code

1. Na aba **Extensões** do VS Code, instale a extensão **Live Server**, de **Ritwick Dey**.
2. No explorador de arquivos, abra a pasta `pages` e localize `index.html`.
3. Clique com o botão direito em `index.html` e selecione **Open with Live Server**.
4. A landing page será aberta no navegador por meio de um servidor local iniciado pelo VS Code.

Mantenha o Live Server em execução enquanto navega pelo projeto. Recursos externos, como Google Fonts e Lucide, precisam de conexão com a internet.

## Funcionamento da demonstração

Os arquivos `assets/js/mock-database.js` e `assets/js/mock-app.js` simulam os fluxos de conta no navegador. As interfaces administrativas também utilizam armazenamento local para seus registros.

- Os dados ficam no navegador utilizado e não são sincronizados com outros dispositivos.
- A persistência utiliza `localStorage` e `sessionStorage`, conforme o fluxo.
- Limpar os dados do site remove as informações locais da demonstração.
- A verificação e a recuperação de conta são simulações, sem envio real de e-mail.
- Não é necessário configurar banco de dados ou servidor de aplicação para visualizar esta versão.

Esta versão é um protótipo demonstrativo. As credenciais são tratadas no próprio navegador e não representam autenticação segura para produção. Utilize dados fictícios nos testes.

## Equipe

Desenvolvido pela equipe do **Projeto Delta**, formada por estudantes do **Instituto J&F**.

[Organização do projeto no GitHub](https://github.com/delta-app-ofc)

## Licença

Este repositório está disponibilizado sob a licença [MIT](LICENSE).
