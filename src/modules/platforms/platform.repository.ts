import type { Request, Response } from 'express';
import pool from '../shared/database/connection.js';
import pgErrorHandler from '../shared/error/pgErrorHandler.js';

//service logic to interact with the database goes here
async function insertPlatform(platformData: { name: string }) {

    try {

        // Insert the platform data into the database
        const insertPlatform = await pool.query(
            'INSERT INTO platforms (name) VALUES ($1) RETURNING *',
            [platformData.name]
        );

        console.log('Inserted platform:', insertPlatform.rows[0]);
        //chama validação de insert (aqui você pode adicionar lógica para validar se o insert foi bem-sucedido, se necessário)

        // Return the inserted platform data
        return insertPlatform.rows[0];

    } catch (error) {

        // Handle PostgreSQL errors with a friendly message
        pgErrorHandler(error, 'Error inserting platform.');

        // Log the error for debugging purposes
        console.error(error, 'error in insertPlatform Repository');

        // Rethrow the error to be handled by the calling function
        throw error;
    }
}

export { insertPlatform };