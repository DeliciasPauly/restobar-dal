import { Request, Response } from 'express';


import pool from '../database';

class SalesController {

    public async list(req: Request, res: Response): Promise<void> {
        console.log('******list***** ');
        const status = 'PENDING';
        const data = await pool.query('SELECT * FROM sale_order so INNER JOIN sale_order_detail sod ON so.sale_id = sod.sale_id WHERE so.status = ?', [status]);
        
        res.json(data);
    }
    
    public async getOne(req: Request, res: Response): Promise<any> {
        console.log('******getOne***** ');
        
        const id  = req.params['id'] ;
        const status = 'PENDING';
        const data = await pool.query('SELECT * FROM sale_order so INNER JOIN sale_order_detail sod ON so.sale_id = sod.sale_id WHERE so.status = ? AND so.table_name = ?  ', [status, id]);
        if (data.length > 0) {
            return res.json(data);
        }
        res.status(404).json({ text: "The sale_order doesn't exits" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        console.log('******create***** ');
        console.log(JSON.stringify(req.body));  
        
        var saleOrder  = {
            sale_id: 0, 
            table_name: req.body['table_name'], 
            status: 'PENDING', 
            total_sale: 0, 
            tip: 0
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
            const status = 'PENDING';
            const existOrder = await pool.query('SELECT so.sale_id FROM sale_order so WHERE so.status = ? AND so.table_name = ?  ', [status, saleOrder.table_name]);
            if(existOrder.length > 0 ){   
                saleOrder = existOrder[0];                               
            }else{
                const resultInsertSaleOrder = await pool.query('INSERT INTO sale_order set ?', [saleOrder]); 
                saleOrder.sale_id = resultInsertSaleOrder.insertId;
            }
            
            if(saleOrder.sale_id > 0){                                    
                var details: any[] = [];

                saleOrderDetail.forEach( data  => {
                    details.push([data.sale_detail_id, saleOrder.sale_id, data.product_name, data.price, data.quantity]);
                });
                const resultDeleteSaleOrderDetail = await pool.query('DELETE FROM sale_order_detail WHERE sale_id = ?', [saleOrder.sale_id]); 
                console.log('resultDeleteSaleOrderDetail:'+JSON.stringify(resultDeleteSaleOrderDetail));
                const resultInsertSaleOrderDetail = await pool.query('INSERT INTO sale_order_detail VALUES  ?', [details]);
                console.log('resultInsertSaleOrderDetail:'+JSON.stringify(resultInsertSaleOrderDetail));
                if(resultInsertSaleOrderDetail.insertId > 0){
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
        console.log('update......');
        //const { id } = req.params;
        var saleOrder  = {
            sale_id: req.body['sale_id'], 
            status: 'PAID', 
            total_sale: req.body['total_sale'], 
            tip:  req.body['tip']
        };
        let total = 0;
        try {
            const resultDetail = await pool.query('SELECT * FROM sale_order_detail WHERE sale_id = ?', [saleOrder.sale_id]);
            resultDetail.forEach((data: { price: number; }) => {
              total = total + data.price;
            });
            saleOrder.total_sale = total;
            if(saleOrder.tip > 0 ){                
                saleOrder.tip = saleOrder.total_sale * 0.10;
            }
            
            console.log('resultTransaction1: '+ JSON.stringify(resultDetail)); 
            
            const resultTransaction2 = await pool.query('UPDATE sale_order set status=?, total_sale=?, tip=? WHERE sale_id = ?', [saleOrder.status, saleOrder.total_sale, saleOrder.tip, saleOrder.sale_id ]);
            console.log('result Updated: '+ JSON.stringify(resultTransaction2)); 
            if(resultTransaction2.affectedRows == 1){
                res.json({ code: 200, message: 'data updated successfully' });
            }else{
                res.json({ code: 400, message: 'Error updated data' });
            }
        }catch (e) {
            console.log(e);
            res.json({ code: 400, message: 'Error updated data' });
        }    
    }

}

const salesController = new SalesController;
export default salesController;