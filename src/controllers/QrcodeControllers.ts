import {Request, Response} from 'express'
import db from '../database/connection';



    
    export default class QrcodeControllers{
     async  create(request: Request, response: Response){
        const {
           name,
           image,
           message,
        }= request.body;

        const trx = await db.transaction();  

        try{
              const inserteIgameQrcodesIds = await trx('qrcodes').insert({
                    image,                  
                 });
    
                 const  qrcode_id = inserteIgameQrcodesIds[0];
                 const insertedDataQrcodeIds = await trx('dataQrcode').insert({
                    name,
                    message,
                    qrcode_id,
                 })
           
                
                 await trx.commit();                 
                 return response.status(201).send();
        }catch(err){
              await trx.rollback(); 
              return response.status(400).json({
                    error:'Unexpected error while creating new qrcode data'
              })
  
    }       
  }
}