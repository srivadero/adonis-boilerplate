import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, scope } from '@ioc:Adonis/Lucid/Orm'
import { cuid } from '@ioc:Adonis/Core/Helpers'

export default class Crud extends BaseModel {

  public static searchScope = scope((query, search: string) => {
    if (search) {
      query.andWhere('name', 'LIKE', `%${search}%`)
      query.orWhere('description', 'LIKE', `%${search}%`)
    } 
  })


  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string | null

  @column()
  public description: string | null

  @column()
  public value: number | null

  @column()
  public active: boolean | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(crud: Crud) {
    crud.id = cuid()
  }

}
