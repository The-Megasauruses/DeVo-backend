import {Client, expect} from '@loopback/testlab';
import {OrdersController} from '../../controllers/index';
import {OrdersRepository} from '../../repositories/index';
import {globalSetup, globalTeardown} from '../global';

const createdOrder = {
  order: [
    {product: 'Product A', quantity: 2, price: 10.99},
    {product: 'Product B', quantity: 1, price: 5.99},
  ],
  userId: '1',
  status: 'Pending',
};

let client: Client;

describe('OrdersController', () => {
  beforeAll(async () => {
    const setupResult = await globalSetup();
    setupResult.app.bind('repositories.OrdersRepository').toClass(OrdersRepository);
    setupResult.app.controller(OrdersController);

    client = setupResult.client;
  });

  it('should create a new order', async () => {
    const orderData = createdOrder;

    const response = await client.post('/orders').send(orderData).expect(200);

    expect(response.body).to.containEql(orderData);
  });

  it('should retrieve an order by ID', async () => {
    const response = await client.get(`/orders/1`).expect(200);

    expect(response.body).to.containEql(createdOrder);
  });

  it('should update an order', async () => {
    const updatedOrderData = {
      order: [
        {product: 'Product A', quantity: 2, price: 10.99},
        {product: 'Product B', quantity: 1, price: 40.00},
      ],
      userId: '1',
      status: 'complete',
    };

    await client
      .put(`/orders/1`)
      .send(updatedOrderData)
      .expect(204);

    const response = await client.get(`/orders/1`).expect(200);

    expect(response.body).to.containEql(updatedOrderData);
  });

  it('should delete an order', async () => {
    await client.delete(`/orders/1`).expect(204);
    await client.get(`/orders/1`).expect(404);
  });

  afterAll(async () => {
    await globalTeardown(); // Call globalTeardown to properly tear down the application
  });
});
