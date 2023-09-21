
import {RestApplication, RestBindings, RestServer} from '@loopback/rest';
import * as supertest from 'supertest';
import {createTestDataSource} from './test-datasource.config';

let app: RestApplication;
let client: supertest.SuperTest<supertest.Test>;

export const globalSetup = async () => {
  app = new RestApplication();

  const testDataSource = createTestDataSource();
  app.bind('datasources.postgresql').to(testDataSource);

  app.bind(RestBindings.Http.CONTEXT).toDynamicValue(() => {
    return new RestServer(app, {
      openApiSpec: {
        disabled: true,
      },
    });
  });

  // Start your LoopBack application
  await app.start();

  // Create the supertest client
  client = supertest.agent(app.restServer.url);

  // Export the app and client for use in test files
  return {app, client};
};

export const globalTeardown = async () => {
  if (app && app.restServer.listening) {
    await app.stop();
  }
};

export default {globalSetup, globalTeardown};
