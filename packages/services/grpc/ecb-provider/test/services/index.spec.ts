import { ecbProvider, currencyProvider, createInsecure } from '@common/go-grpc';
import server from '../../src/server';

jest.mock('node-fetch');
const mockedFetch = require('node-fetch');

mockedFetch.mockImplementation(() => {
  return {
    text() {
      return `
                <?xml version="1.0" encoding="UTF-8"?>
                <gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01" xmlns="http://www.ecb.int/vocabulary/2002-08-01/eurofxref">
                <gesmes:subject>Reference rates</gesmes:subject>
                <gesmes:Sender>
                        <gesmes:name>European Central Bank</gesmes:name>
                </gesmes:Sender>
                <Cube>
                <Cube time='2022-01-21'>
                        <Cube currency='USD' rate='1.1348'/>
                        <Cube currency='JPY' rate='129.14'/>
                        <Cube currency='BGN' rate='1.9558'/>
                        <Cube currency='CZK' rate='24.347'/>
                        <Cube currency='DKK' rate='7.4431'/>
                        <Cube currency='GBP' rate='0.83633'/>
                        <Cube currency='HUF' rate='358.19'/>
                        <Cube currency='PLN' rate='4.5318'/>
                        <Cube currency='RON' rate='4.9453'/>
                        <Cube currency='SEK' rate='10.4140'/>
                        <Cube currency='CHF' rate='1.0353'/>
                        <Cube currency='ISK' rate='145.60'/>
                        <Cube currency='NOK' rate='10.0523'/>
                        <Cube currency='HRK' rate='7.5280'/>
                        <Cube currency='RUB' rate='86.8380'/>
                        <Cube currency='TRY' rate='15.2230'/>
                        <Cube currency='AUD' rate='1.5774'/>
                        <Cube currency='BRL' rate='6.2063'/>
                        <Cube currency='CAD' rate='1.4211'/>
                        <Cube currency='CNY' rate='7.1946'/>
                        <Cube currency='HKD' rate='8.8370'/>
                        <Cube currency='IDR' rate='16244.20'/>
                        <Cube currency='ILS' rate='3.5668'/>
                        <Cube currency='INR' rate='84.4190'/>
                        <Cube currency='KRW' rate='1351.89'/>
                        <Cube currency='MXN' rate='23.2229'/>
                        <Cube currency='MYR' rate='4.7508'/>
                        <Cube currency='NZD' rate='1.6884'/>
                        <Cube currency='PHP' rate='58.171'/>
                        <Cube currency='SGD' rate='1.5260'/>
                        <Cube currency='THB' rate='37.358'/>
                        <Cube currency='ZAR' rate='17.1546'/>
                        </Cube>
                </Cube>
            </gesmes:Envelope>
      `;
    }
  };
});

const testServerHost = 'localhost:50061';
const client = new ecbProvider.EcbProviderClient(
  testServerHost,
  createInsecure(),
);

describe('ecbProvider', () => {
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
        baseCurrency: 'EUR',
        rates: [
          { currency: 'USD', rate: 1.1348 },
          { currency: 'JPY', rate: 129.14 },
          { currency: 'BGN', rate: 1.9558 },
          { currency: 'CZK', rate: 24.347 },
          { currency: 'DKK', rate: 7.4431 },
          { currency: 'GBP', rate: 0.83633 },
          { currency: 'HUF', rate: 358.19 },
          { currency: 'PLN', rate: 4.5318 },
          { currency: 'RON', rate: 4.9453 },
          { currency: 'SEK', rate: 10.414 },
          { currency: 'CHF', rate: 1.0353 },
          { currency: 'ISK', rate: 145.6 },
          { currency: 'NOK', rate: 10.0523 },
          { currency: 'HRK', rate: 7.528 },
          { currency: 'RUB', rate: 86.838 },
          { currency: 'TRY', rate: 15.223 },
          { currency: 'AUD', rate: 1.5774 },
          { currency: 'BRL', rate: 6.2063 },
          { currency: 'CAD', rate: 1.4211 },
          { currency: 'CNY', rate: 7.1946 },
          { currency: 'HKD', rate: 8.837 },
          { currency: 'IDR', rate: 16244.2 },
          { currency: 'ILS', rate: 3.5668 },
          { currency: 'INR', rate: 84.419 },
          { currency: 'KRW', rate: 1351.89 },
          { currency: 'MXN', rate: 23.2229 },
          { currency: 'MYR', rate: 4.7508 },
          { currency: 'NZD', rate: 1.6884 },
          { currency: 'PHP', rate: 58.171 },
          { currency: 'SGD', rate: 1.526 },
          { currency: 'THB', rate: 37.358 },
          { currency: 'ZAR', rate: 17.1546 }
        ],
      });
    });
  });
});
