import { middyfy } from '../../../libs/lambda';

import { createContext } from '../../../context';
import { SpacesService } from 'src/services/SpacesService';

export const spaceService = new SpacesService(createContext());

export const getMySpaces = async (event) => {
  const userId = event.headers['x-validated-user']?.valueOf();
  const from = Number(event.queryStringParameters?.from);
  const limit = Number(event.queryStringParameters?.limit);

  const result = await spaceService.getMySpaces({ userId, from, limit });

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: result,
      count: result.length,
    }),
  };
};

export const main = middyfy(getMySpaces);
