import { cryptoCompareProvider, currencyProvider, createInsecure } from '@common/go-grpc';
import server from '../../src/server';

jest.mock('node-fetch');
const mockedFetch = require('node-fetch');

mockedFetch.mockImplementation(() => Promise.resolve({
  json: () => {
    return {
      USD: {
        BTC: 0.0000357,
        ETH: 0.0006606
      }
    };
  },
}));

const testServerHost = 'localhost:50061';
const client = new cryptoCompareProvider.CryptoCompareProviderClient(
  testServerHost,
  createInsecure(),
);

describe('cryptoCompareProvider', () => {
  beforeAll(async () => {
    await server.start(testServerHost);
  });
  afterAll(async () => {
    await server.stop();
  });
  describe('GetRates', () => {
    it('should return currency rates', async () => {
      const response = await client.GetRates(new currencyProvider.GetRatesRequest());

      expect(response.toObject()).toEqual({
        baseCurrency: 'USD',
        rates: [
          { currency: 'BTC', rate: 0.0000357 },
          { currency: 'ETH', rate: 0.0006606 },
        ],
      });
    });
  });
});
