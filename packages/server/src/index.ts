import "dotenv/config";

import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor Leaky Bucket rodando na porta ${PORT}`);
  console.log(`URL base: http://localhost:${PORT}`);
});
