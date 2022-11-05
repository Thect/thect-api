import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'spaces/v1/my',
        authorizer: 'auth',
        request: {
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
