import {
  createInsecure,
  currencyConverter,
  ecbProvider,
  currencyProvider,
} from '@common/go-grpc';

const {
  GetRatesRequest,
} = currencyProvider;

// PROVIDER_SERVICES=localhost:50052,localhost:50053
const { PROVIDER_SERVICES = '' } = process.env;

const providerClients = PROVIDER_SERVICES
  .split(',')
  .map((host) => new ecbProvider.EcbProviderClient(host, createInsecure()));

const getConversionRate = (
  rates: { currency?: string, rate?: number }[], currency: string,
) => {
  const rate = rates.find((r) => r.currency === currency);
  if (!rate) {
    throw new Error(`Currency ${currency} is not supported`);
  }
  return rate.rate;
};

export default async (
  grpcRequest: currencyConverter.ConvertRequest,
): Promise<currencyConverter.ConvertResponse> => {
  const { sellAmount, buyCurrency, sellCurrency } = grpcRequest;

  const aggregatedRates = await Promise.all(providerClients
    .map((client) => client.GetRates(new GetRatesRequest())));

  /**
   TODO: implement an algorithm for calculating cross rate using multiple sources
   You have rates provided by multiple currency providers, which follows the interface
   interface IProviderRates {
       baseCurrency: string,
       rates: {
         currency: string
         rate: number,
       }[],
     }
   Here is a sample of date:
   {
     "baseCurrency": "EUR",
     "rates": [
        {
          "rate": 0.90,
          "currency": "USD"
        },
        {
          "rate": 0.70,
          "currency": "CAD"
        },
     ]
   }
   {
     "baseCurrency": "USD",
     "rates": [
        {
          "rate": 0.000026,
          "currency": "BTC"
        },
        {
          "rate": 0.00039,
          "currency": "ETH"
        },
     ]
   }
   You should be able to make a conversion 0.34 ETH to CAD using both provider's data.
   👇👇👇👇👇👇👇👇
   */

  const provider1 = aggregatedRates[0]; // this is done just for 1 provider
  const rates = [
    ...provider1.toObject().rates,
    {
      rate: 1,
      currency: provider1.baseCurrency,
    },
  ];
  const conversionRate = getConversionRate(rates, buyCurrency)
    / getConversionRate(rates, sellCurrency);

  return new currencyConverter.ConvertResponse({
    conversionRate: Math.ceil(conversionRate * 100000) / 100000,
    buyAmount: Math.floor(sellAmount * conversionRate * 100) / 100,
    sellAmount,
    buyCurrency,
    sellCurrency,
  });
};
