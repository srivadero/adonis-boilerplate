import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Crud from 'App/Models/Crud'

const viewPath = 'crud'

class CrudValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    name: schema.string([rules.trim(), rules.maxLength(50), rules.escape()]),
    description: schema.string.nullableAndOptional(),
    value: schema.number.nullableAndOptional(),
    active: schema.boolean.nullableAndOptional()
  })

  public messages = {}
}

export default class CrudController {
  public async index({ view, request }: HttpContextContract) {
    const { search } = request.qs()
    const result = await Crud.query()
      .apply((scopes) => { scopes.searchScope(search) })
      .orderBy('name', 'asc')
    return await view.render(`${viewPath}/index`, { result })
  }

  public async create({ view }: HttpContextContract) {
    return await view.render(`${viewPath}/create`)
  }

  public async store({ session, request, response }: HttpContextContract) {
    const data = await request.validate(CrudValidator)
    await Crud.create(data)
    session.flash('info', 'Oject created')
    return response.redirect().toRoute(`${viewPath}.index`)
  }

  public async show({ view, params }: HttpContextContract) {
    const result = await Crud.findOrFail(params.id)
    return await view.render(`${viewPath}/show`, { result })
  }

  public async edit({ view, params }: HttpContextContract) {
    const result = await Crud.findOrFail(params.id)
    return await view.render(`${viewPath}/edit`, { result })
  }

  public async update({ session, response, request, params }: HttpContextContract) {
    const data = await request.validate(CrudValidator)

    const result = await Crud.findOrFail(params.id)
    result.merge(data)
    await result.save()

    session.flash('info', 'Oject updated')
    return response.redirect().toRoute(`${viewPath}.index`)

  }

  public async destroy({ params, response }: HttpContextContract) {
    const result = await Crud.findOrFail(params.id)
    await result.delete()
    return response.redirect().toRoute(`${viewPath}.index`)
  }
}
