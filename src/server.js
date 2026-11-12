import http from 'http';
import { manipuladorDeRotas } from './routes.js';
import { json } from './middlewares/json.js';

const server = http.createServer(async (request, response) => {
  await json(request, response);
  await manipuladorDeRotas(request, response);
});

server.listen(3333, () => {
  console.log('🚀 API de Produtos rodando em http://localhost:3333');
});
