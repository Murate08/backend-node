import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('qrcodes', table =>{
        table.increments('id').primary();
        table.string('image').notNullable();
     

    });

}

export async function down(knex: Knex){
    return knex.schema.dropTable('qrcodes');

}