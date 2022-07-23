import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async create({ view }: HttpContextContract) {
    return await view.render('auth/change-password')
  }

  public async store({ request, response, session, auth }: HttpContextContract) {
    const forgotSchema = schema.create({
      password: schema.string([
        rules.trim(),
        rules.escape(),
        rules.minLength(4),
        rules.confirmed()
      ])
    })
    const { password } = await request.validate({ schema: forgotSchema })

    const user = auth.user
    if (user) {
      user.password = password
      user.resetToken = null
      await user.save()
      // await auth.logout()
      // await auth.login(user)
      session.flash('info', 'Your password was successfully changed')
    }

    return response.redirect('/')
  }

}
