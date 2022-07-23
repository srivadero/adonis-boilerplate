import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {
  public async create({ view }: HttpContextContract) {
    return await view.render('auth/login')
}

public async store({ request, response, auth, session }: HttpContextContract) {
    const { uid, password } = request.only(['uid', 'password'])
    try {
        await auth.attempt(uid, password)
    } catch (error) {
        session.flash('errors', 'Invalid credentials')
        return response.redirect().back()
    }
    return response.redirect('/')
}

public async destroy({ response, auth }: HttpContextContract) {
    await auth.logout()
    return response.redirect('/')
}

}
