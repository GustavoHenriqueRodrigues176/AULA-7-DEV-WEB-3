# API de Produtos com SQLite

API REST em Node.js utilizando o banco de dados relacional SQLite para persistência de dados.

## Como rodar o projeto

1. Instale as dependências no terminal:
```bash
npm install
```

2. Inicie o servidor:
```bash
npm start
```

O servidor rodará em `http://localhost:3333` e o arquivo `database.sqlite` será gerado automaticamente na raiz do projeto.

## Rotas Disponíveis

- `GET /produtos`: Lista todos os produtos cadastrados no banco de dados.
- `POST /produtos`: Cadastra um novo produto no banco de dados.
- `PUT /produtos/:id`: Atualiza os dados de um produto existente.
- `DELETE /produtos/:id`: Remove um produto do banco de dados.
