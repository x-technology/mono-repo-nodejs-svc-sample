import { currencyProvider } from '@common/go-grpc';
import fetch from 'node-fetch';
import { BASE_CURRENCY, TO_CURRENCIES, RATE_URL } from '../consts';

export const getCryptoCompareRates = async (): Promise<{ currency: string, rate: number }[]> => {
  const toCurrencyString = TO_CURRENCIES.join(',');
  const requestUrl = `${RATE_URL}?fsyms=${BASE_CURRENCY}&tsyms=${toCurrencyString}`;

  const response = await fetch(requestUrl);
  const rates = await response.json();

  if (!rates[BASE_CURRENCY]) return [];

  return Object.entries(rates[BASE_CURRENCY]).map(
    ([currency, rate]: [string, number]) => ({ currency, rate }),
  );
};

export default async (
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  _: currencyProvider.GetRatesRequest,
): Promise<currencyProvider.GetRatesResponse> => {
  const rates = (await getCryptoCompareRates())
    .map(({ currency, rate }) => new currencyProvider.GetRatesResponse.ExchangeRate({
      currency, rate,
    }));
  return new currencyProvider.GetRatesResponse({
    rates,
    baseCurrency: BASE_CURRENCY,
  });
};
