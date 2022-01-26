import { createInsecure, currencyConverter, currencyProvider } from '@common/go-grpc';

const {
  GetRatesRequest,
} = currencyProvider;

// PROVIDER_SERVICES=localhost:50052,localhost:50053
const { PROVIDER_SERVICES = '' } = process.env;

const providerClients = PROVIDER_SERVICES
  .split(',')
  .map((host) => new currencyProvider.CurrencyProviderClient(host, createInsecure()));

export default async (
  grpcRequest: currencyConverter.ConvertRequest,
): Promise<currencyConverter.ConvertResponse> => {
  const { amount, buyCurrency, sellCurrency } = grpcRequest;

  const aggregatedRates = await Promise.all(providerClients
    .map((client) => client.GetRates(new GetRatesRequest())));

  // aggregatedRates
  //
  // /**
  //  73.45 ETH -> ? USD
  //  X USD -> ? EUR
  //  Y EUR -> ? AUD
  //   */
  //
  // let convertion: ({ amount: number, currency: string }) = {};

  console.log('aggregatedRates', aggregatedRates);

  return new currencyConverter.ConvertResponse({
    conversionRate: 1 / amount,
    buyCurrency,
    sellCurrency,
  });
};
