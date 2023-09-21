import {RestApplication} from '@loopback/rest';
import {Client, expect} from '@loopback/testlab';
import {ProductsController} from '../../controllers';
import {ProductsRepository} from '../../repositories';
import {globalSetup, globalTeardown} from '../global';

const createdProduct = {
  name: 'Product A',
  image: 'product-a.jpg',
  brand: 'Brand A',
  description: 'This is Product A',
  keyword: 'Keyword A',
  height: '10cm',
  width: '5cm',
  weight: '0.5kg',
  sku: 'SKU123',
  stock: 100,
  price: '19.99',
}

let app: RestApplication;
let client: Client;

describe('ProductsController', () => {
  beforeAll(async () => {
    const setupResult = await globalSetup();
    app = setupResult.app;

    setupResult.app.bind('repositories.ProductsRepository').toClass(ProductsRepository);
    setupResult.app.controller(ProductsController);

    client = setupResult.client;
  });


  it('should create a new product', async () => {
    const productData = createdProduct;

    const response = await client.post('/products').send(productData).expect(200);

    expect(response.body).to.containEql(productData);
  });

  it('should retrieve a product by ID', async () => {
    const productId = 1;

    const response = await client.get(`/products/${productId}`).expect(200);

    expect(response.body).to.containEql(createdProduct);
  });

  it('should update a product', async () => {
    const productId = 1;

    const updatedProductData = {
      name: 'Product A',
      image: 'product-a.jpg',
      brand: 'Brand A',
      description: 'This is Product A',
      keyword: 'Keyword A',
      height: '10cm',
      width: '5cm',
      weight: '0.5kg',
      sku: 'SKU123',
      stock: 40,
      price: '15.99',
    };

    await client
      .put(`/products/${productId}`)
      .send(updatedProductData)
      .expect(204);

    const response = await client.get(`/products/${productId}`).expect(200);

    expect(response.body).to.containEql(updatedProductData);
  });

  it('should delete a product', async () => {
    const productId = 1;

    await client.delete(`/products/${productId}`).expect(204);


    await client.get(`/products/${productId}`).expect(404);
  });

  afterAll(async () => {
    await globalTeardown();
  });
});
