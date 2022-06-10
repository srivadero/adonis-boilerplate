import { test } from '@japa/runner'
import { JSDOM } from 'jsdom'

test.group('Auth', () => {
  test('Display login page', async ({ client, assert }) => {
    const response = await client.get('/login')
    response.assertStatus(200)
    response.assertTextIncludes('Username or email')
    response.assertTextIncludes('Password')

    const { window } = new JSDOM(response.text())
    const title = window.document.querySelector('h1')?.textContent || ''
    assert.equal(title, 'Login')

  })

  test('Display signup page', async ({ client, assert }) => {
    const response = await client.get('/register')
    response.assertStatus(200)
    response.assertTextIncludes('Username')
    response.assertTextIncludes('Email')
    response.assertTextIncludes('Password')

    const { window } = new JSDOM(response.text())
    const title = window.document.querySelector('h1')?.textContent || ''
    assert.equal(title, 'Register')
  })

  test('Login user', async ({ client, assert }) => {
    const response = await client.post('/login').form({ uid: 'admin', password: 'admin' })
    response.assertStatus(200)

    const { window } = new JSDOM(response.text())
    const title = window.document.querySelector('h1')?.textContent || ''
    assert.equal(title, 'HOMEPAGE')
  })

  test('Login user with bad credentials', async ({ client, assert }) => {
    const response = await client.post('/login').header('referrer', '/login').form({ uid: 'admin2', password: 'admin' })
    response.assertStatus(200)
    response.assertTextIncludes('Invalid credentials')

    const { window } = new JSDOM(response.text())
    const title = window.document.querySelector('h1')?.textContent || ''
    assert.equal(title, 'Login')
  })

  test('Register user', async ({ client, assert }) => {
    const response = await client.post('/register').header('referrer', '/register').form({ username: 'newuser', email: 'newuser@email.com', password: 'admin' })
    response.assertStatus(200)

    const { window } = new JSDOM(response.text())
    const title = window.document.querySelector('h1')?.textContent || ''
    assert.equal(title, 'HOMEPAGE')
  })

  test('Register user with invalid data', async ({ client, assert }) => {
    const response = await client.post('/register').header('referrer', '/register').form({ username: 'admin', email: 'admin@example.com', password: 'admin' })
    response.assertStatus(200)
    response.assertTextIncludes('unique validation failure')

    const { window } = new JSDOM(response.text())
    const title = window.document.querySelector('h1')?.textContent || ''
    assert.equal(title, 'Register')
  })

})
