# Frontend Client Wallet Saas

Esse front tem como objetivo ser o app para os clientes do software como todo, ou sejá, adm's, gestores e clientes.

## Pré-requisitos
Antes de iniciar, é necessário ter o Node.js na versão 18.19.11 instalado em sua máquina. Caso não tenha esta versão, recomendamos a utilização do NVM (Node Version Manager) para gerenciar e instalar a versão correta.

## Configuração do Ambiente
Primeiro, clone o repositório e navegue até o diretório do projeto. Antes de iniciar a aplicação, você precisará configurar as variáveis de ambiente:

1. Copie o arquivo `.env.example` para um novo arquivo chamado `.env` e edite as variaveis.

2. Instale as dependências do projeto:

```bash
npm i
```

3. Inicie o projeto
   
```bash
npm run dev
```

Esses comandos irão instalar todas as dependências necessárias e iniciar o servidor de desenvolvimento, permitindo que você visualize e trabalhe na aplicação localmente.


### Realizando o Login

Para acessar o sistema, seu e-mail deve estar previamente cadastrado no banco de dados do ambiente que você está utilizando. Após a confirmação do seu e-mail, você poderá criar uma conta e logar no sistema através da autenticação do ambiente.


## Tecnologias Utilizadas

| Tecnologia     | Descrição                                                  |
|----------------|------------------------------------------------------------|
| React          | Biblioteca JavaScript para construção de interfaces de usuário |
| Tailwind CSS   | Framework CSS para estilização rápida e responsiva         |
| Node.js        | Ambiente de execução JavaScript server-side               |
| NVM            | Gerenciador de versões do Node.js                          |
