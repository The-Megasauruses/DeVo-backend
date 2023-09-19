import {Entity, model, property} from '@loopback/repository';

@model()
export class Products extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  image?: string;

  @property({
    type: 'string',
  })
  brand?: string;

  @property({
    type: 'string',
  })
  model?: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
  })
  keyword?: string;

  @property({
    type: 'string',
  })
  height?: string;

  @property({
    type: 'string',
  })
  width?: string;

  @property({
    type: 'string',
  })
  weight?: string;

  @property({
    type: 'string',
  })
  sku?: string;

  @property({
    type: 'number',
    required: true,
  })
  stock: number;

  @property({
    type: 'string',
    required: true,
  })
  price: string;

  constructor(data?: Partial<Products>) {
    super(data);
  }
}

export interface ProductsRelations {
  // describe navigational properties here
}

export type ProductsWithRelations = Products & ProductsRelations;
