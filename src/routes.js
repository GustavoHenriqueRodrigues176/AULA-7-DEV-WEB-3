import { randomUUID } from 'crypto';
import { conectarBanco } from './database.js';

export const manipuladorDeRotas = async (request, response) => {
  const { method, url, body } = request;

  try {
    const db = await conectarBanco();

    if (url === '/produtos' && method === 'GET') {
      const produtos = await db.all('SELECT * FROM produtos');
      response.writeHead(200);
      return response.end(JSON.stringify(produtos));
    }

    if (url === '/produtos' && method === 'POST') {
      const { nome, preco, categoria } = body ?? {};

      if (!nome || preco === undefined || !categoria) {
        response.writeHead(400);
        return response.end(JSON.stringify({
          erro: "Os campos nome, preco e categoria são obrigatórios."
        }));
      }

      const novoProduto = {
        id: randomUUID(),
        nome,
        preco: Number(preco),
        categoria
      };

      await db.run(
        'INSERT INTO produtos (id, nome, preco, categoria) VALUES (?, ?, ?, ?)',
        [novoProduto.id, novoProduto.nome, novoProduto.preco, novoProduto.categoria]
      );

      response.writeHead(201);
      return response.end(JSON.stringify({
        mensagem: "Produto cadastrado com sucesso!",
        produto: novoProduto
      }));
    }

    const isRotaProdutoComId = url.startsWith('/produtos/') && url.split('/').length === 3;

    if (isRotaProdutoComId) {
      const id = url.split('/')[2];
      const produto = await db.get('SELECT * FROM produtos WHERE id = ?', [id]);

      if (!produto) {
        response.writeHead(404);
        return response.end(JSON.stringify({ erro: "Produto não encontrado." }));
      }

      if (method === 'PUT') {
        const { nome, preco, categoria } = body ?? {};

        const produtoAtualizado = {
          id,
          nome: nome ?? produto.nome,
          preco: preco !== undefined ? Number(preco) : produto.preco,
          categoria: categoria ?? produto.categoria
        };

        await db.run(
          'UPDATE produtos SET nome = ?, preco = ?, categoria = ? WHERE id = ?',
          [produtoAtualizado.nome, produtoAtualizado.preco, produtoAtualizado.categoria, id]
        );

        response.writeHead(200);
        return response.end(JSON.stringify({
          mensagem: "Produto atualizado com sucesso!",
          produto: produtoAtualizado
        }));
      }

      if (method === 'DELETE') {
        await db.run('DELETE FROM produtos WHERE id = ?', [id]);
        response.writeHead(204);
        return response.end();
      }
    }

    response.writeHead(404);
    return response.end(JSON.stringify({ erro: "Rota ou método não encontrado." }));
  } catch (error) {
    response.writeHead(500);
    return response.end(JSON.stringify({ erro: "Erro interno no banco de dados." }));
  }
};
