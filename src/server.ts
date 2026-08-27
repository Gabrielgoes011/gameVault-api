//importa o arquivo app
import app from './app.js';
import pool from './modules/shared/database/connection.js';

//define a porta do servidor
const PORT = 3005;

app.listen(PORT, async () => {
    try {
        // Executa uma consulta simples para validar a comunicação com o PostgreSQL
        await pool.query('SELECT 1');

        console.log('✅ - Database connection established successfully.');
        
        console.log(`🎮 - GameVault API running on port ${PORT}`);
    } catch (error) {
        console.error('❌ - Error, database connection failed:', error);
    }
});
