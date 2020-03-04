"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tableController_1 = __importDefault(require("../controllers/tableController"));
class TableRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', tableController_1.default.list);
        this.router.get('/:id', tableController_1.default.getOne);
        this.router.post('/', tableController_1.default.create);
        this.router.put('/:id', tableController_1.default.update);
        this.router.delete('/:id', tableController_1.default.delete);
    }
}
exports.default = new TableRoutes().router;
