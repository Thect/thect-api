import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '../../../libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { SpacesService } from 'src/services/SpacesService';

const getMySpaces: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const userId = '';
  const from = Number(event.queryStringParameters?.from);
  const limit = Number(event.queryStringParameters?.limit);

  const spaceService = new SpacesService();
  const result = spaceService.getMySpaces({ userId, from, limit });

  return formatJSONResponse({
    data: result,
    count: result.length,
  });
};

export const main = middyfy(getMySpaces);
