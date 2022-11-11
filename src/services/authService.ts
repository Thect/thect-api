import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { promisify } from 'util';

export class AuthService {
  jwtOptions = {
    audience: process.env.AUDIENCE,
    issuer: process.env.TOKEN_ISSUER,
  };

  client = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: process.env.JWKS_URI ?? '',
  });

  extractToken(params) {
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
  }
  decodeToken(token) {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new Error('invalid token');
    }
    return decoded;
  }
  async verifyToken(token, decodedToken) {
    const getSigningKey = promisify(this.client.getSigningKey);
    const key = await getSigningKey(decodedToken.header.kid);
    promisify(this.client.getSigningKey);
    const signingKey = key?.getPublicKey() ?? '';
    return jwt.verify(token, signingKey, this.jwtOptions);
  }

  getPolicyDocument = (effect, resource) => {
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

  async authenticate(params) {
    const token = this.extractToken(params);
    const decoded = this.decodeToken(token);
    const verified = await this.verifyToken(token, decoded);
    return {
      principalId: verified?.sub,
      policyDocument: this.getPolicyDocument('Allow', params.methodArn),
    };
  }
}
