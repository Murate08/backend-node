import {Request, Response} from 'express'
import db from '../database/connection';
import converHoursToMinutes from '../utils/convertHoursToMinutes';

interface ScheduleItem{
    week_day: number;
    from:string;
    to:string;
}
    
    export default class ClassesController{

 //listagem
        async index(request:Request, response: Response){
 //filtros
            const filters = request.query;

            const subject = filters.subject as string;
            const week_day = filters.week_day as string;
            const time = filters.time as string;
            
            if(!filters.week_day || !filters.subject || !filters.time ){
                return response.status(400).json({
                    error:'Missing filter to search classes'

                })
            }
//converter para minutos
            const timeInMinutes = converHoursToMinutes(time);
//filtragem por data e hora
            const classes = await db('classes')
            .whereExists(function(){
                this.select('class_schedule.*')
                .from('class_schedule')
                .whereRaw('`class_schedule`.`class_id` = `classes`. `id`')
                .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id' )
            .select(['classes.*', 'users.*']);


           return response.json(classes)


        }       


     async  create(request: Request, response: Response){
        const {
           name,
           avatar,
           whatsapp,
           bio,
           subject,
           cost,
           schedule
  
        }= request.body;
  //criar o usuario
  
  //criar trasicoes
        const trx = await db.transaction();
  
  //tratamento de erros      
        try{
              const insertedUsersIds = await trx('users').insert({
                    name,
                    avatar,
                    whatsapp,
                    bio,
                 });
           //pegar o id do usuario
                 const  user_id = insertedUsersIds[0];
           // criar a class
                 const insertedClassesIds = await trx('classes').insert({
                    subject,
                    cost,
                    user_id,
                 })
           
                 const class_id = insertedClassesIds[0];
                 
           
                 const classSchedule = schedule.map((scheduleItem: ScheduleItem) =>{
                       return {
           
                             class_id,
                             week_day: scheduleItem.week_day,
                             from:converHoursToMinutes(scheduleItem.from),
                             to:converHoursToMinutes(scheduleItem.to),            
           
                       };       
                 })
           
           //inserir na base de dados 
           
                 await trx('class_schedule').insert(classSchedule);
           
                 await trx.commit();
                 
                 return response.status(201).send();
        }catch(err){
              await trx.rollback();
  
  
              return response.status(400).json({
                    error:'Unexpected error while creating new class'
              })
  
    }       
  }
}