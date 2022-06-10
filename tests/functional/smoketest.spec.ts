import { test } from '@japa/runner'
import { JSDOM } from 'jsdom'

test.group('Home', () => {

  test('display welcome page', async ({ client, assert }) => {
    const response = await client.get('/')
    response.assertStatus(200)

    const { window } = new JSDOM(response.text())
    const title = window.document.querySelector('h1')?.textContent || ''
    assert.equal(title, 'HOMEPAGE')
  })

  test('display settings page', async ({ client, assert }) => {
    const response = await client.get('/settings')
    response.assertStatus(200)

    const { window } = new JSDOM(response.text())
    const title = window.document.querySelector('h1')?.textContent || ''
    assert.equal(title, 'Settings')

  })

})
