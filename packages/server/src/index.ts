import "dotenv/config";
import { createApp } from "./app";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  const app = await createApp();
  app.listen(PORT, () => {
    console.log(`Servidor Leaky Bucket rodando na porta ${PORT}`);
    console.log(`API REST disponível em http://localhost:${PORT}`);
    console.log(`API GraphQL disponível em http://localhost:${PORT}/graphql`);
  });
};

startServer();
