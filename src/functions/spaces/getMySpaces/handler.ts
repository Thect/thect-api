import { middyfy } from '../../../libs/lambda';

import { createContext } from '../../../context';
import { SpacesService } from 'src/services/SpacesService';

export const spaceService = new SpacesService(createContext());

export const getMySpaces = async (event) => {
  let userId = '';
  if (event.headers) {
    userId = event.headers['x-validated-user']?.valueOf();
  }

  let from = NaN;
  let limit = NaN;
  if (event.queryStringParameters) {
    console.log(JSON.stringify(event.queryStringParameters));
    from = Number(event.queryStringParameters?.from);
    limit = Number(event.queryStringParameters?.limit);
    console.log(JSON.stringify({ userId, from, limit }));
  }

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
