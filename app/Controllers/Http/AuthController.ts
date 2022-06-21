import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Event from '@ioc:Adonis/Core/Event'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class AuthController {
    public async registerShow({ view }: HttpContextContract) {
        return await view.render('auth/register')
    }

    public async register({ request, response, auth }: HttpContextContract) {
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

    public async loginShow({ view }: HttpContextContract) {
        return await view.render('auth/login')
    }

    public async login({ request, response, auth, session }: HttpContextContract) {
        const { uid, password } = request.only(['uid', 'password'])
        try {
            await auth.attempt(uid, password)
        } catch (error) {
            session.flash('errors', 'Invalid credentials')
            return response.redirect().back()
        }
        return response.redirect('/')
    }

    public async logout({ response, auth }: HttpContextContract) {
        await auth.logout()
        return response.redirect('/')
    }

    public async forgotPasswordShow({ view }: HttpContextContract) {
        return await view.render('auth/forgot-password')
    }

    public async forgotPassword({ request, response }: HttpContextContract) {
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

    public async resetPasswordShow({ view }: HttpContextContract) {
        return await view.render('auth/reset-password')
    }

    public async resetPassword({ request, response, session, auth }: HttpContextContract) {
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
        if(user.resetToken !== code )
        {
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

    public async changePasswordShow({ view }: HttpContextContract) {
        return await view.render('auth/change-password')
    }

    public async changePassword({ request, response, session, auth }: HttpContextContract) {
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
        if(user){
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