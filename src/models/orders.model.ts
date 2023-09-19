import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Users} from './users.model';

@model()
export class Orders extends Entity {
  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id?: number;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  order: object[];
  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @belongsTo(() => Users)
  userId: number;

  constructor(data?: Partial<Orders>) {
    super(data);
  }
}

export interface OrdersRelations {
  // describe navigational properties here
}

export type OrdersWithRelations = Orders & OrdersRelations;
