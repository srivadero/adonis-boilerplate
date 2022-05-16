import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Cruds extends BaseSchema {
  protected tableName = 'cruds'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      // table.increments('id')
      table.string('id').unique()
      table.string('name').notNullable()
      table.string('description').nullable()
      table.integer('value').nullable()
      table.boolean('active').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
