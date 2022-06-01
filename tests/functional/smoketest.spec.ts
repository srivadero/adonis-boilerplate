import { test } from '@japa/runner'

test.group('Home', () => {

  test('display welcome page', async ({ client }) => {
    const response = await client.get('/')
    // console.log(response.text())
    response.assertStatus(200)
  })

  test('display settings page', async ({ client }) => {
    const response = await client.get('/settings')
    response.assertStatus(200)
    response.assertTextIncludes('<h1 class="text-3xl my-4">Settings</h1>')
  })

})
