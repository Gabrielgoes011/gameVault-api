import router from 'express';

//cria uma instância do express.Router
const mainRoutes = router.Router();

//define uma rota para a raiz do servidor
mainRoutes.get('/', (req, res) => {
    res.json({
        name: 'GameVault API 🎮',
        version: '1.0.0',
        status : 'running',
        message: "Welcome to the GameVault API!",
        author: {
            name: 'Gabriel Goes',
        }

  });
});


export default mainRoutes;