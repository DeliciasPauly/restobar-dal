import { Request, Response } from 'express';


import pool from '../database';

class ProductController {

    public async list(req: Request, res: Response): Promise<void> {
        const table = await pool.query('SELECT * FROM product');
        res.json(table);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const table = await pool.query('SELECT * FROM product WHERE product_name = ?', [id]);
        console.log(table.length);
        if (table.length > 0) {
            return res.json(table[0]);
        }
        res.status(404).json({ text: "The product doesn't exits" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO product set ?', [req.body]);
        res.json({ message: 'product Saved' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldGame = req.body;
        await pool.query('UPDATE product set ? WHERE product_name = ?', [req.body, id]);
        res.json({ message: "The product was Updated" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM product WHERE product_name = ?', [id]);
        res.json({ message: "The product was deleted" });
    }
}

const productController = new ProductController;
export default productController;