import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class ResetPasswordsController {
  public async create({ view }: HttpContextContract) {
    return await view.render('auth/reset-password')
  }

  public async store({ request, response, session, auth }: HttpContextContract) {
    const forgotSchema = schema.create({
      email: schema.string([
        rules.trim(),
        rules.escape(),
        rules.email(),
        rules.exists({ table: 'users', column: 'email', caseInsensitive: true })
      ]),
      code: schema.string([
        rules.trim(),
        rules.escape(),
        rules.required()
      ]),
      password: schema.string([
        rules.trim(),
        rules.escape(),
        rules.minLength(4),
        rules.confirmed()
      ])
    })
    const { email, code, password } = await request.validate({ schema: forgotSchema })

    const user = await User.findByOrFail('email', email)
    console.log(email, code, user.resetToken)
    if (user.resetToken !== code) {
      session.flash('errors', 'Your code is invalid')
      return response.redirect().back()
    }
    user.password = password
    user.resetToken = null
    await user.save()
    await auth.login(user)
    // await auth.attempt(user.email, password)

    return response.redirect('/')
  }

}
