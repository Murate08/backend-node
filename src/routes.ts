import express, { request, response } from 'express'
import QrcodeControllers from './controllers/QrcodeControllers';





const routes = express.Router();

const qrcodeControllers = new QrcodeControllers();

routes.post('/qrcode', qrcodeControllers.create);

export default routes;