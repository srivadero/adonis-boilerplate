import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Crud from 'App/Models/Crud'
import User from 'App/Models/User'
import { CrudFactory } from 'Database/factories'

export default class MainSeeder extends BaseSeeder {
  public async run () {
    
    await Crud.truncate()
    await CrudFactory.createMany(10)
    
    await User.truncate()
    await User.createMany([
      { username: 'admin', email: 'admin@example.com', password: 'admin'},
      { username: 'user1', email: 'user1@example.com', password: 'user1'},
    ])
  }
}
