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
            console.log('******sale list***** ');
            const status = 'PENDING';
            const data = yield database_1.default.query('SELECT * FROM sale_order so INNER JOIN sale_order_detail sod ON so.sale_id = sod.sale_id WHERE so.status = ?', [status]);
            console.log(JSON.stringify(data));
            res.json(data);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const table = yield database_1.default.query('SELECT * FROM sale_order WHERE sale_id = ?', [id]);
            console.log(table.length);
            if (table.length > 0) {
                return res.json(table[0]);
            }
            res.status(404).json({ text: "The sale_order doesn't exits" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('******create***** ');
            console.log(JSON.stringify(req.body));
            var saleOrder = {
                sale_id: req.body['sale_id'],
                table_name: req.body['table_name'],
                status: req.body['status'],
                total_sale: req.body['total_sale'],
                tip: req.body['tip']
            };
            var saleOrderDetail;
            saleOrderDetail = req.body['saleOrderDetail'];
            try {
                const resultSaleOrder = yield database_1.default.query('INSERT INTO sale_order set ?', [saleOrder]);
                if (resultSaleOrder.insertId > 0) {
                    var details = [];
                    saleOrderDetail.forEach(data => {
                        details.push([data.sale_detail_id, resultSaleOrder.insertId, data.product_name, data.price, data.quantity]);
                    });
                    const resultSaleOrderDetail = yield database_1.default.query('INSERT INTO sale_order_detail VALUES  ?', [details]);
                    //console.log('resultSaleOrderDetail: '+ JSON.stringify(resultSaleOrderDetail)); 
                    if (resultSaleOrderDetail.insertId > 0) {
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
            const { id } = req.params;
            const oldGame = req.body;
            yield database_1.default.query('UPDATE sale_order set ? WHERE sale_id = ?', [req.body, id]);
            res.json({ message: "The sale_order was Updated" });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('DELETE FROM sale_order WHERE product_name = ?', [id]);
            res.json({ message: "The sale_order was deleted" });
        });
    }
}
const salesController = new SalesController;
exports.default = salesController;
