import { Request, Response } from 'express';


import pool from '../database';

class TableController {

    public async list(req: Request, res: Response): Promise<void> {
        const table = await pool.query('SELECT * FROM sale_table');
        res.json(table);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const table = await pool.query('SELECT * FROM sale_table WHERE table_name = ?', [id]);
        console.log(table.length);
        if (table.length > 0) {
            return res.json(table[0]);
        }
        res.status(404).json({ text: "The table_sale doesn't exits" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO sale_table set ?', [req.body]);
        res.json({ message: 'Game Saved' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldGame = req.body;
        await pool.query('UPDATE sale_table set ? WHERE table_name = ?', [req.body, id]);
        res.json({ message: "The sale_table was Updated" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM sale_table WHERE table_name = ?', [id]);
        res.json({ message: "The sale_table was deleted" });
    }
}

const tableController = new TableController;
export default tableController;