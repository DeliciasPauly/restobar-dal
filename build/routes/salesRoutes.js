"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salesController_1 = __importDefault(require("../controllers/salesController"));
class SalesRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', salesController_1.default.list);
        this.router.get('/:id', salesController_1.default.getOne);
        this.router.post('/', salesController_1.default.create);
        this.router.put('/', salesController_1.default.update);
    }
}
exports.default = new SalesRoutes().router;
