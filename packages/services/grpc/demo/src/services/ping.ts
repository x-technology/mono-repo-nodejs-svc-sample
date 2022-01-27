import { demo } from '@common/go-grpc';

// eslint-disable-next-line import/prefer-default-export
export const ping = async (
  grpcRequest: demo.PingRequest,
): Promise<demo.PingResponse> => {
  const { payload } = grpcRequest;

  return new demo.PingResponse({
    payload: `${payload} - pong`,
  });
};
