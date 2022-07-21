import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Event from '@ioc:Adonis/Core/Event'
import { string } from '@ioc:Adonis/Core/Helpers'
import User from 'App/Models/User'

export default class ForgotPasswordController {
  public async create({ view }: HttpContextContract) {
    return await view.render('auth/forgot-password')
  }

  public async store({ request, response }: HttpContextContract) {
    const forgotSchema = schema.create({
      email: schema.string([
        rules.trim(),
        rules.escape(),
        rules.email(),
        rules.exists({ table: 'users', column: 'email', caseInsensitive: true })
      ]),
    })
    const { email } = await request.validate({ schema: forgotSchema })

    const token = string.generateRandom(6)

    const user = await User.findByOrFail('email', email)
    user.resetToken = token
    await user.save()

    await Event.emit('auth:forgotPassword', { email, token })
    return response.redirect().toRoute('/reset-password')
  }

}
