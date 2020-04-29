"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class SalesController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('******list***** ');
            const status = 'PENDING';
            const data = yield database_1.default.query('SELECT * FROM sale_order so INNER JOIN sale_order_detail sod ON so.sale_id = sod.sale_id WHERE so.status = ?', [status]);
            res.json(data);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('******getOne***** ');
            const id = req.params['id'];
            const status = 'PENDING';
            const data = yield database_1.default.query('SELECT * FROM sale_order so INNER JOIN sale_order_detail sod ON so.sale_id = sod.sale_id WHERE so.status = ? AND so.table_name = ?  ', [status, id]);
            if (data.length > 0) {
                return res.json(data);
            }
            res.status(404).json({ text: "The sale_order doesn't exits" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('******create***** ');
            console.log(JSON.stringify(req.body));
            var saleOrder = {
                sale_id: 0,
                table_name: req.body['table_name'],
                status: 'PENDING',
                total_sale: 0,
                tip: 0
            };
            var saleOrderDetail;
            saleOrderDetail = req.body['saleOrderDetail'];
            try {
                const status = 'PENDING';
                const existOrder = yield database_1.default.query('SELECT so.sale_id FROM sale_order so WHERE so.status = ? AND so.table_name = ?  ', [status, saleOrder.table_name]);
                if (existOrder.length > 0) {
                    saleOrder = existOrder[0];
                }
                else {
                    const resultInsertSaleOrder = yield database_1.default.query('INSERT INTO sale_order set ?', [saleOrder]);
                    saleOrder.sale_id = resultInsertSaleOrder.insertId;
                }
                if (saleOrder.sale_id > 0) {
                    var details = [];
                    saleOrderDetail.forEach(data => {
                        details.push([data.sale_detail_id, saleOrder.sale_id, data.product_name, data.price, data.quantity]);
                    });
                    const resultDeleteSaleOrderDetail = yield database_1.default.query('DELETE FROM sale_order_detail WHERE sale_id = ?', [saleOrder.sale_id]);
                    console.log('resultDeleteSaleOrderDetail:' + JSON.stringify(resultDeleteSaleOrderDetail));
                    const resultInsertSaleOrderDetail = yield database_1.default.query('INSERT INTO sale_order_detail VALUES  ?', [details]);
                    console.log('resultInsertSaleOrderDetail:' + JSON.stringify(resultInsertSaleOrderDetail));
                    if (resultInsertSaleOrderDetail.insertId > 0) {
                        res.json({ code: 200, message: 'data saved successfully' });
                    }
                    else {
                        res.json({ code: 400, message: 'Error saving data' });
                    }
                }
                else {
                    res.json({ code: 400, message: 'Error saving data' });
                }
            }
            catch (e) {
                console.log(e);
                res.json({ code: 400, message: 'Error saving data' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('update......');
            //const { id } = req.params;
            var saleOrder = {
                sale_id: req.body['sale_id'],
                status: 'PAID',
                total_sale: req.body['total_sale'],
                tip: req.body['tip']
            };
            let total = 0;
            try {
                const resultDetail = yield database_1.default.query('SELECT * FROM sale_order_detail WHERE sale_id = ?', [saleOrder.sale_id]);
                resultDetail.forEach((data) => {
                    total = total + data.price;
                });
                saleOrder.total_sale = total;
                if (saleOrder.tip > 0) {
                    saleOrder.tip = saleOrder.total_sale * 0.10;
                }
                console.log('resultTransaction1: ' + JSON.stringify(resultDetail));
                const resultTransaction2 = yield database_1.default.query('UPDATE sale_order set status=?, total_sale=?, tip=? WHERE sale_id = ?', [saleOrder.status, saleOrder.total_sale, saleOrder.tip, saleOrder.sale_id]);
                console.log('result Updated: ' + JSON.stringify(resultTransaction2));
                if (resultTransaction2.affectedRows == 1) {
                    res.json({ code: 200, message: 'data updated successfully' });
                }
                else {
                    res.json({ code: 400, message: 'Error updated data' });
                }
            }
            catch (e) {
                console.log(e);
                res.json({ code: 400, message: 'Error updated data' });
            }
        });
    }
}
const salesController = new SalesController;
exports.default = salesController;
