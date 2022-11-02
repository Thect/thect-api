import { middyfy } from '../../../libs/lambda';

import { createContext } from '../../../context';
import { SpacesService } from 'src/services/SpacesService';
import { SpacesListItem } from 'src/models/spaces/spacesListItem';

export const spaceService = new SpacesService(createContext());

export const getMySpaces = async (event) => {
  let userId = '';
  if (event.headers) {
    userId = event.headers['x-validated-user']?.valueOf();
  }

  if (!userId) {
    return {
      statusCode: 401,
    };
  }

  console.log(userId);

  let from = NaN;
  let limit = NaN;
  if (event.queryStringParameters) {
    console.log(JSON.stringify(event.queryStringParameters));
    from = Number(event.queryStringParameters?.from);
    limit = Number(event.queryStringParameters?.limit);
    console.log(JSON.stringify({ userId, from, limit }));
  }

  const amountOfMySpaces = await spaceService.countMySpaces({ userId });

  let spaces: SpacesListItem[] = [];
  if (amountOfMySpaces > 0) {
    spaces = await spaceService.getMySpaces({ userId, from, limit });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: spaces,
      count: amountOfMySpaces,
    }),
  };
};

export const main = middyfy(getMySpaces);
