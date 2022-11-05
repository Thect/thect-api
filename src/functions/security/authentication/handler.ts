import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import jwksClient from 'jwks-rsa';

const getToken = (params) => {
  if (!params.type || params.type !== 'TOKEN') {
    throw new Error('Expected "event.type" parameter to have value "TOKEN"');
  }

  const tokenString = params.authorizationToken;
  if (!tokenString) {
    throw new Error('Expected "event.authorizationToken" parameter to be set');
  }

  const match = tokenString.match(/^Bearer (.*)$/);
  if (!match || match.length < 2) {
    throw new Error(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
  }
  return match[1];
};

const client = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
  jwksUri: process.env.JWKS_URI ?? '',
});

const jwtOptions = {
  audience: process.env.AUDIENCE,
  issuer: process.env.TOKEN_ISSUER,
};

const getPolicyDocument = (effect, resource) => {
  const policyDocument = {
    Version: '2012-10-17', // default version
    Statement: [
      {
        Action: 'execute-api:Invoke', // default action
        Effect: effect,
        Resource: resource,
      },
    ],
  };
  return policyDocument;
};

export const authenticate = async (parameters) => {
  const token = getToken(parameters);

  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('invalid token');
  }
  const getSigningKey = promisify(client.getSigningKey);
  return getSigningKey(decoded.header.kid)
    .then((key) => {
      const signingKey = key?.getPublicKey() ?? '';
      return jwt.verify(token, signingKey, jwtOptions);
    })
    .then((decoded) => ({
      principalId: decoded?.sub,
      policyDocument: getPolicyDocument('Allow', parameters.methodArn),
    }));
};

let data;
export const main = async (event, context) => {
  try {
    data = await authenticate(event);
  } catch (err) {
    console.log(err);
    return context.fail('Unauthorized');
  }
  return data;
};
