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
        this.router.put('/:id', salesController.update);
        this.router.delete('/:id', salesController.delete);
    }

}

export default new SalesRoutes().router;

