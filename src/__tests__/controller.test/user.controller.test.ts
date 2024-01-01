import { RestApplication } from '@loopback/rest';
import { Client, expect } from '@loopback/testlab';
import { UserController } from '../../controllers';
import { BcryptHasher, JWTService, MyUserService } from '../../services/index';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
  TokenServiceConstants
} from '../../keys';
import { UserRepository , UserCredentialsRepository} from '../../repositories';
import { globalSetup, globalTeardown } from '../global';

const userData = {
  email: 'testuser@gmail.com',
  password: 'password123',
};

const adminData = {
  email: 'testadmin@gmail.com',
  password: 'password321',
};
let userId:string;
let token: string;
let app: RestApplication;
let client: Client;

describe('UsersController', () => {
  beforeAll(async () => {
    const setupResult = await globalSetup();
    app = setupResult.app;
    app.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE);
    app.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE);
    app.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    app.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    app.bind(PasswordHasherBindings.ROUNDS).to(10)
    app.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    app.bind('repositories.UserRepository').toClass(UserRepository);
    app.bind('repositories.UserCredentialsRepository').toClass(UserCredentialsRepository);
    app.controller(UserController);
    client = setupResult.client;
  });

  it('should create a new user and admin', async () => {
    // Create a new user
    const response1 = await client.post('/users/sign-up').send(userData).expect(200);
    expect(response1.body.role).to.containEql('user');
    expect(response1.body.email).to.containEql(userData.email);

    // Create a new admin
    const response2 = await client.post('/users/sign-up/admin').send(adminData).expect(200);
    userId = response2.body.id;
    expect(response2.body.role).to.containEql('admin');
    expect(response2.body.email).to.containEql(adminData.email);
  });

  it('should be able to login with test user', async () => {
        const signInData = {
          email: adminData.email,
          password: adminData.password,
        };
        const response = await client.post('/users/login').send(signInData).expect(200);
        token = response.body.token
        expect(response.body).to.have.property('token');
  });

  it('should retrieve a user by ID', async () => {
    const response = await client.get(`/users/${userId}`).set('Authorization', `Bearer ${token}`).expect(200);
    console.log(response.body);
  });


  afterAll(async () => {
    await globalTeardown();
  });
});
