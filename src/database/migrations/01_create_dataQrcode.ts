import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('dataQrcode', table =>{
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('message').notNullable();

       


        //relacionameto  usuario por aula
        table.integer('qrcode_id')
            .notNullable()
            .references('id')
            .inTable('qrcodes')
            .onUpdate('CASCADE')
            .onDelete('CASCADE'); 
    });

}

export async function down(knex: Knex){
    return knex.schema.dropTable('dataQrcode');

}