import express, { Router } from 'express';

import salesController from '../controllers/salesController';

class SalesRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', salesController.list);
        this.router.get('/:id', salesController.getOne);
        this.router.post('/', salesController.create);
        this.router.put('/', salesController.update);
    }

}

export default new SalesRoutes().router;

