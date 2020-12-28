import express, { request, response } from 'express'
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';




const routes = express.Router();

const classesControllers = new ClassesController();
const connectionsControllers = new ConnectionsController();


 //criar uma interface que define o formato de um objevto



routes.get('/classes', classesControllers.index);

routes.post('/classes', classesControllers.create);

routes.get('/connections', connectionsControllers.index)
routes.post('/connections', connectionsControllers.create)


export default routes;