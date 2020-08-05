import { Request, Response } from 'express';
import db from '../database/connection';

export default class ConnectionController {
    async index(request: Request, response: Response) {
        const { total } = (await db('connections').count('* as total'))[0];

        return response.status(200).json({ total });
    }

    async create(request: Request, response: Response) {
        const { user_id } = request.body;

        const trx = await db.transaction();

        try {
            await trx('connections').insert({
                user_id
            });

            return response.status(201).send()
        } catch (err) {
            trx.rollback();

            return response.status(400).json({
                error: 'Unexpected error while creating new connection'
            });
        }
    }
}