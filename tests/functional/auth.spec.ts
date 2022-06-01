import { test } from '@japa/runner'

test.group('Auth', () => {
  test('Display login page', async ({ client }) => {
    const response = await client.get('/login')
    response.assertStatus(200)
    response.assertTextIncludes('Username or email')
    response.assertTextIncludes('Password')
  })

  test('Display signup page', async ({ client }) => {
    const response = await client.get('/register')
    response.assertStatus(200)
    response.assertTextIncludes('Username')
    response.assertTextIncludes('Email')
    response.assertTextIncludes('Password')
  })

  test('Login user', async ({ client }) => {
    const response = await client.post('/login').form({ uid: 'admin', password: 'admin' })
    response.assertStatus(200)
    response.assertTextIncludes('HOMEPAGE')
  })

  test('Login user with bad credentials', async ({ client }) => {
    const response = await client.post('/login').header('referrer', '/login').form({ uid: 'admin2', password: 'admin' })
    response.assertStatus(200)
    response.assertTextIncludes('Invalid credentials')
  })

  test('Register user', async ({ client }) => {
    const response = await client.post('/register').header('referrer', '/register').form({ username: 'newuser', email: 'newuser@email.com', password: 'admin' })
    response.assertStatus(200)
    response.assertTextIncludes('HOMEPAGE')
  })

  test('Register user with invalid data', async ({ client }) => {
    const response = await client.post('/register').header('referrer', '/register').form({ username: 'admin', email: 'admin@example.com', password: 'admin' })
    response.assertStatus(200)
    response.assertTextIncludes('unique validation failure')
  })

})
