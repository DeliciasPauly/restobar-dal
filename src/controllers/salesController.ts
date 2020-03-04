import { Request, Response } from 'express';


import pool from '../database';

class SalesController {

    public async list(req: Request, res: Response): Promise<void> {
        console.log('******sale list***** ');
        const status = 'PENDING';
        const data = await pool.query('SELECT * FROM sale_order so INNER JOIN sale_order_detail sod ON so.sale_id = sod.sale_id WHERE so.status = ?', [status]);
        
        console.log(JSON.stringify(data));  
        res.json(data);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const table = await pool.query('SELECT * FROM sale_order WHERE sale_id = ?', [id]);
        console.log(table.length);
        if (table.length > 0) {
            return res.json(table[0]);
        }
        res.status(404).json({ text: "The sale_order doesn't exits" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        console.log('******create***** ');
        console.log(JSON.stringify(req.body));  
        
        var saleOrder  = {
            sale_id: req.body['sale_id'], 
            table_name: req.body['table_name'], 
            status: req.body['status'], 
            total_sale: req.body['total_sale'], 
            tip: req.body['tip']
        };
        
        var saleOrderDetail: [{ 
            sale_detail_id: number;
            sale_id: number;
            product_name: string;
            price: number;
            quantity: number; 
        }];
        saleOrderDetail = req.body['saleOrderDetail'];   

        try {
            const resultSaleOrder = await pool.query('INSERT INTO sale_order set ?', [saleOrder]);        
        
            if(resultSaleOrder.insertId > 0){                                    
                var details: any[] = [];

                saleOrderDetail.forEach( data  => {
                    details.push([data.sale_detail_id, resultSaleOrder.insertId, data.product_name, data.price, data.quantity]);
                });
                
                const resultSaleOrderDetail = await pool.query('INSERT INTO sale_order_detail VALUES  ?', [details]);
                //console.log('resultSaleOrderDetail: '+ JSON.stringify(resultSaleOrderDetail)); 
                if(resultSaleOrderDetail.insertId > 0){
                    res.json({ code: 200, message: 'data saved successfully' });
                }else{
                    res.json({ code: 400, message: 'Error saving data' });
                }

            }else{
                res.json({ code: 400, message: 'Error saving data' });
            }
        }catch (e) {
            console.log(e);
            res.json({ code: 400, message: 'Error saving data' });
        }    
        
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldGame = req.body;
        await pool.query('UPDATE sale_order set ? WHERE sale_id = ?', [req.body, id]);
        res.json({ message: "The sale_order was Updated" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM sale_order WHERE product_name = ?', [id]);
        res.json({ message: "The sale_order was deleted" });
    }
}

const salesController = new SalesController;
export default salesController;