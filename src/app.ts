import Express from "express";
import mainRoutes from "./routes/main.routes.js";

//cria uma instância do express
const app = Express();

//app.use para utilizar o middleware express.json() para interpretar requisições com payload JSON
app.use(Express.json());

//app.use para utilizar as rotas definidas no arquivo main.routes.ts
app.use(mainRoutes);

//padrão de exportação do app para ser utilizado em outros arquivos
export default app;