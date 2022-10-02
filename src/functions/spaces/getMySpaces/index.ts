import { handlerPath } from '@libs/handler-resolver';
import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'spaces/v1/my',
        request: {
          schemas: {
            'application/json': schema,
          },
          parameters: {
            querystrings: {
              from: false,
              limit: false,
            },
          },
        },
      },
    },
  ],
};
