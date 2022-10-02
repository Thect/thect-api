import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const getMySpaces: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const fromQueryParameter = Number(event.queryStringParameters?.from);
  const limitQueryParameter = Number(event.queryStringParameters?.limit);
  const from = isNaN(fromQueryParameter) ? 0 : fromQueryParameter;
  const limit = isNaN(limitQueryParameter) ? 10 : limitQueryParameter;

  console.log(`From: ${from}`);
  console.log(`Limit: ${limit}`);

  return formatJSONResponse({
    data: [
      {
        name: 'Space 1',
      },
      {
        name: 'Space 2',
      },
      {
        name: 'Space 3',
      },
    ],
    count: 3,
  });
};

export const main = middyfy(getMySpaces);
