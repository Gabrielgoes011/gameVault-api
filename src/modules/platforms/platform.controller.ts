import type { Request, Response } from 'express';
import type { insertPlatformDTO } from './platform.dto.js';
import { created, handleError } from '../shared/middlewares/responseApi.js';
import { insertPlatform as insertPlatformService } from './platform.repository.js';

//Controller for insert plataform Games
async function insertPlatform(req: Request, res: Response) {
    try {

        //dto (Data Transfer Object) for inserting a new platform game
        const platformData: insertPlatformDTO = req.body;

        //service logic to insert the platform data into the database goes here
        const insertedPlatform = await insertPlatformService(platformData);

        //response using the created middleware
        return created(res, insertedPlatform, 'Platform inserted successfully.');

    } catch (error) {
        //traduz o erro (ex: 23505 -> 409 Conflict) e RESPONDE ao cliente
        return handleError(res, error, 'Error inserting platform.');
    }
}

export { insertPlatform };