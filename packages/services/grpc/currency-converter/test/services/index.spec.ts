import { currencyConverter, currencyProvider, createInsecure } from '@common/go-grpc';
import server from '../../src/server';

const testServerHost = 'localhost:50061';
const client = new currencyConverter.CurrencyConverterClient(
  testServerHost,
  createInsecure(),
);

describe('currencyConverter', () => {
  beforeAll(async () => {
    await server.start(testServerHost);
  });
  afterAll(async () => {
    await server.stop();
  });
  describe('Convert', () => {
    it('should return converted value', async () => {
      currencyProvider.CurrencyProviderClient.prototype.GetRates = jest
        .fn()
        .mockResolvedValueOnce(new currencyProvider.GetRatesResponse({
          baseCurrency: 'EUR',
          rates: [
            new currencyProvider.GetRatesResponse.ExchangeRate({
              currency: 'USD',
              rate: 1.1348,
            }),
            new currencyProvider.GetRatesResponse.ExchangeRate({
              currency: 'AUD',
              rate: 1.5774,
            }),
          ],
        }))
        .mockResolvedValueOnce(new currencyProvider.GetRatesResponse({
          baseCurrency: 'USD',
          rates: [
            new currencyProvider.GetRatesResponse.ExchangeRate({
              currency: 'ETH',
              rate: 0.00046,
            }),
            new currencyProvider.GetRatesResponse.ExchangeRate({
              currency: 'BTC',
              rate: 0.000032,
            }),
          ],
        }));

      const response = await client.Convert(new currencyConverter.ConvertRequest({
        sellAmount: 100,
        sellCurrency: 'USD',
        buyCurrency: 'GBP',
      }));

      expect(response.toObject()).toEqual({
        buyAmount: 74.67,
        buyCurrency: 'GBP',
        sellAmount: 100,
        sellCurrency: 'USD',
        conversionRate: 0.7468,
      });
    });
  });
});
