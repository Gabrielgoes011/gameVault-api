import { Router } from 'express';
import { insertPlatform } from './platform.controller.js';

const router = Router();

router.post('/platform', insertPlatform);
//body example:
// {
//     "name": "PlayStation 5"
// }

export default router;