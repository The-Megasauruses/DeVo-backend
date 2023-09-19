import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Orders,
  Users,
} from '../models';
import {OrdersRepository} from '../repositories';

export class OrdersUsersController {
  constructor(
    @repository(OrdersRepository)
    public ordersRepository: OrdersRepository,
  ) { }

  @get('/orders/{id}/users', {
    responses: {
      '200': {
        description: 'Users belonging to Orders',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Users),
          },
        },
      },
    },
  })
  async getUsers(
    @param.path.number('id') id: typeof Orders.prototype.id,
  ): Promise<Users> {
    return this.ordersRepository.user(id);
  }
}
