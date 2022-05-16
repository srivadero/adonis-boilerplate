import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
    const View = (await import('@ioc:Adonis/Core/View')).default
    // View.global('date', (valor: DateTime) => {
    //   return valor.toFormat('dd/LL/yyyy')
    // })

    // View.global('datetime', (valor: DateTime) => {
    //   return valor.toFormat('dd/LL/yyyy HH:mm')
    // })

    // View.global('now', () => {
    //   const valor = DateTime.local()
    //   return valor.toFormat('dd/LL/yyyy HH:mm')
    // })

    // View.global('range', (start: number, size: number) => {
    //   return [...Array(size).keys()].map(i => i + start)
    // })

    if(View.GLOBALS['csrfField'] == null)
    {
      View.global('csrfField', () => {
        return 'CSRF_FIELD'
      })
    }

  }

  public async ready () {
    
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
