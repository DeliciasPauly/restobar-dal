import express, { Router } from 'express';

import tableController from '../controllers/tableController';

class TableRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', tableController.list);
        this.router.get('/:id', tableController.getOne);
        this.router.post('/', tableController.create);
        this.router.put('/:id', tableController.update);
        this.router.delete('/:id', tableController.delete);
    }

}

export default new TableRoutes().router;

