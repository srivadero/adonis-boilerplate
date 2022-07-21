import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class RegisterController {
  public async create({ view }: HttpContextContract) {
    return await view.render('auth/register')
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const userSchema = schema.create({
      username: schema.string([
        rules.trim(),
        rules.escape(),
        rules.unique({ table: 'users', column: 'username', caseInsensitive: true })
      ]),
      email: schema.string([
        rules.trim(),
        rules.escape(),
        rules.email(),
        rules.unique({ table: 'users', column: 'email', caseInsensitive: true })
      ]),
      password: schema.string([
        rules.trim(),
        rules.escape(),
        rules.minLength(4),
        rules.confirmed()
      ])
    })
    const data = await request.validate({ schema: userSchema })
    const user = await User.create(data)
    await auth.login(user)
    return response.redirect('/')
  }

}
