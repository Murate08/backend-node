export default function converHoursToMinutes(time: string){

    //conversao de string para minutos ,,horas

   const [hour, minutes] =  time.split(':').map(Number);
   const timeInMinutes =(hour * 60) + minutes;
   return timeInMinutes;
}