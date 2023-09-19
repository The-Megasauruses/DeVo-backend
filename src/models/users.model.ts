import {Entity, model, property, hasMany} from '@loopback/repository';
import {Orders} from './orders.model';

@model()
export class Users extends Entity {
  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
  })
  birthday?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @hasMany(() => Orders, {keyTo: 'userId'})
  orders: Orders[];

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
