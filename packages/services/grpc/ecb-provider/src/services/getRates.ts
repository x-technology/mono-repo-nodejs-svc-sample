import { currencyProvider } from '@common/go-grpc';
import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';
import { BASE_CURRENCY } from '../consts';

const RATE_URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

export const getEcbRates = async (): Promise<{ currency: string, rate: number }[]> => {
  const response = await fetch(RATE_URL);
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });
  const {
    'gesmes:Envelope': {
      Cube: {
        Cube: { Cube },
      },
    },
  } = parser.parse(await response.text());

  return Cube;
};

export default async (
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  _: currencyProvider.GetRatesRequest,
): Promise<currencyProvider.GetRatesResponse> => {
  const rates = (await getEcbRates())
    .map(({ currency, rate }) => new currencyProvider.GetRatesResponse.ExchangeRate({
      currency, rate,
    }));
  return new currencyProvider.GetRatesResponse({
    rates,
    baseCurrency: BASE_CURRENCY,
  });
};
