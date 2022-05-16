import Factory from '@ioc:Adonis/Lucid/Factory'
import Crud from 'App/Models/Crud'

export const CrudFactory = Factory
    .define(Crud, ({ faker }) => {
        return {
            name: faker.internet.userName(),
            description: faker.lorem.sentence(),
            value: faker.datatype.number(),
            active: faker.datatype.boolean()
        }
    })
    .build()
