import {RestApplication, RestBindings, RestServer} from '@loopback/rest';
import {Client, expect} from '@loopback/testlab';
import * as supertest from 'supertest';
import {OrdersController} from '../../controllers/index'; // Import your OrdersController
import {OrdersRepository} from '../../repositories/index'; // Import your OrdersRepository
import {createTestDataSource} from '../test-datasource.config';


const createdOrder = {
  order: [
    { product: 'Product A', quantity: 2, price: 10.99 },
    { product: 'Product B', quantity: 1, price: 5.99 },
  ],
  userId: '1',
  status: 'Pending',
};
let app: RestApplication;
let client: Client;

describe('OrdersController', () => {

  beforeAll(async () => {
    app = new RestApplication();


    const testDataSource = createTestDataSource();
    app.bind('datasources.postgresql').to(testDataSource);


    app.bind('repositories.OrdersRepository').toClass(OrdersRepository);


    app.controller(OrdersController);


    app.bind(RestBindings.Http.CONTEXT).toDynamicValue(() => {
      return new RestServer(app, {
        openApiSpec: {
          disabled: true,
        },
      });
    });

    await app.start();
    client = supertest.agent(app.restServer.url);
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
        { product: 'Product A', quantity: 2, price: 10.99 },
        { product: 'Product B', quantity: 1, price: 40.00 },
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

    // Attempt to fetch the deleted order and ensure it's not found (404)
    await client.get(`/orders/1`).expect(404);
  });

  afterAll(async () => {
    await app.stop();
  });
});
