import { juggler } from '@loopback/repository';

const testConfig = {
  name: 'testdb',
  connector: 'memory',
};


export function createTestDataSource(): juggler.DataSource {
  return new juggler.DataSource(testConfig);
}
