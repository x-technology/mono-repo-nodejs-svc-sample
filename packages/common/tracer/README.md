# Tracer

Draft tracer implementation based on https://github.com/open-telemetry/opentelemetry-js/blob/main/examples/grpc-js

## How to use

```shell
yarn build
```

Add `@common/tracer` depedency to your service code

```json
"@common/tracer": "^1.0.0",
```

Re-run lerna build dependencies command

```bash
yarn lerna run build
```

Use tracer in code to create spans with relevant information

```ts
import { trace } from '@common/tracer';
const tracer = trace('demo');

//...
const span = tracer.startSpan('ping begin');
span.end();
```

## Start zipkin server

```bash
docker run -d -p 9411:9411 openzipkin/zipkin
```

Go to http://localhost:9411 to see latest tracing logs

# Links

- https://eng.uber.com/distributed-tracing/
- https://blog.risingstack.com/distributed-tracing-opentracing-node-js/
- https://www.jaegertracing.io/docs/1.26/
- https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/