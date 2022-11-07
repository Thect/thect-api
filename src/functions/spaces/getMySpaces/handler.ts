import { middyfy } from '../../../libs/lambda';

import { createContext } from '../../../context';
import { SpacesService } from 'src/services/SpacesService';
import { SpacesListItem } from 'src/models/spaces/spacesListItem';

export const spaceService = new SpacesService(createContext());

export const getMySpaces = async (event) => {
  let userId = '';
  if (event?.requestContext?.authorizer) {
    userId = event.requestContext.authorizer.principalId;
  }

  if (!userId) {
    return {
      statusCode: 401,
    };
  }

  let from = NaN;
  let limit = NaN;
  if (event.queryStringParameters) {
    from = Number(event.queryStringParameters?.from);
    limit = Number(event.queryStringParameters?.limit);
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
