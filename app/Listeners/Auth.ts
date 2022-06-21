import type { EventsList } from '@ioc:Adonis/Core/Event'

export default class Auth {

    public async onForgotPassword(data: EventsList['auth:forgot-password']) {
        console.log('send here an email with the token link to reset password')
        console.log('to: ', data.email)
        console.log('token: ', data.token)

        // const user = await User.findByOrFail('email', email)
        // await PasswordResetToken.query().where('user_id', user.id).delete()
        // const { token } = await PasswordResetToken.create({
        //     userId: user.id,
        //     token: Encryption.encrypt(string.generateRandom(32)),
        // })

    }
}
