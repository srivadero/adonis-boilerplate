/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Auth module routes
Route.group(() => {
  Route.get('/logout', 'Auth/LoginController.destroy').as('auth.logout')
  Route.get('/change-password', 'Auth/ChangePasswordController.create').as('auth.change.password.show')
  Route.post('/change-password', 'Auth/ChangePasswordController.store').as('auth.change.password')
}).middleware('auth')

Route.get('/register', 'Auth/RegisterController.create').as('auth.register.show')
Route.post('/register', 'Auth/RegisterController.store').as('auth.register')
Route.get('/login', 'Auth/LoginController.create').as('auth.login.show')
Route.post('/login', 'Auth/LoginController.store').as('auth.login')
Route.get('/forgot-password', 'Auth/ForgotPasswordController.create').as('auth.forgot.password.show')
Route.post('/forgot-password', 'Auth/ForgotPasswordController.store').as('auth.forgot.password')
Route.get('/reset-password', 'Auth/ResetPasswordController.create').as('auth.reset.password.show')
Route.post('/reset-password', 'Auth/ResetPasswordController.store').as('auth.reset.password')

// Settings
Route.get('settings', async ({ view }) => { return view.render('settings') }).as('settings')
Route.post('settings', async ({ request, response, session }) => {
  const theme = request.input('theme', '')
  session.put('theme', theme)
  response.redirect().back()
})

// Crud sample
Route.resource('crud', 'CrudController')

// Home page
Route.get('/', async ({ view }) => {
  return view.render('welcome')
})
