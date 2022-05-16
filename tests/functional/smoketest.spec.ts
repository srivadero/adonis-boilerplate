import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Database', () => {

  test('display welcome page', async ({ client }) => {
    const response = await client.get('/')
    // console.log(response.text())
    response.assertStatus(200)
  })

  test('display login page', async ({ client }) => {
    const response = await client.get('/login')
    response.assertStatus(200)
    response.assertTextIncludes('<h1 class="text-3xl my-4">Login</h1>')
  })

  test('display signup page', async ({ client }) => {
    const response = await client.get('/register')
    response.assertStatus(200)
    response.assertTextIncludes('<h1 class="text-3xl my-4">Register</h1>')
  })

  test('display settings page', async ({ client }) => {
    const response = await client.get('/settings')
    response.assertStatus(200)
    response.assertTextIncludes('<h1 class="text-3xl my-4">Settings</h1>')
  })

  test('register user', async ({ assert, client }) => {
    try {
      await client.post('/register').form({ username: 'new_user', email: 'qwerty@example.com', password: 'admin' })
    } catch (_error) {
    }finally{
      let data: any = await Database.from('users').select('*')
      assert.containsSubset(data, [{ username: 'new_user'}])  
    }

  })
  
})
