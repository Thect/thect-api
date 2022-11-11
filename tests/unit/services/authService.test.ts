import { AuthService } from 'src/services/authService';

describe('Services', () => {
  describe('Auth Service', () => {
    describe('Extract Token', () => {
      it('Should return a token', () => {
        const token = 'test-token';
        const params = {
          type: 'TOKEN',
          authorizationToken: `Bearer ${token}`,
        } as any;
        const authService = new AuthService();

        const result = authService.extractToken(params);
        expect(result).toBe(token);
      });

      it('Should throw an error if event is not token', () => {
        const params = {
          headers: {},
        } as any;
        const authService = new AuthService();
        expect(() => authService.extractToken(params)).toThrow(
          'Expected "event.type" parameter to have value "TOKEN"'
        );
      });

      it('Should throw an error if authorizationToken is not set', () => {
        const params = {
          type: 'TOKEN',
        } as any;
        const authService = new AuthService();
        expect(() => authService.extractToken(params)).toThrow(
          'Expected "event.authorizationToken" parameter to be set'
        );
      });

      it('Should throw an error if authorizationToken is not bearer token', () => {
        const token = 'test-token';
        const params = {
          type: 'TOKEN',
          authorizationToken: `${token}`,
        } as any;
        const authService = new AuthService();
        expect(() => authService.extractToken(params)).toThrow(
          `Invalid Authorization token - ${token} does not match "Bearer .*`
        );
      });
    });
    describe('Decode Token', () => {
      it('Should return a decoded token', () => {
        const token = 'test-token';
        const decodedToken = {
          header: {
            kid: 'test-kid',
            alg: 'test-alg',
          },
          payload: {},
          signature: 'test-signature',
        };
        const authService = new AuthService();
        const decodeTokenSpy = jest.spyOn(authService, 'decodeToken');
        decodeTokenSpy.mockReturnValue(decodedToken);
        const result = authService.decodeToken(token);
        expect(result).toBe(decodedToken);
      });

      it('Should throw an error if the token is invalid', () => {
        const token = 'test-token';
        const authService = new AuthService();
        expect(() => authService.decodeToken(token)).toThrow('invalid token');
      });
    });
    describe('Authenticate', () => {
      it('Should return a policy document', async () => {
        const decodedToken = {
          header: {
            kid: 'test-kid',
            alg: 'test-alg',
          },
          payload: {},
          signature: 'test-signature',
        };
        const authService = new AuthService();
        const extractTokenSpy = jest.spyOn(authService, 'extractToken');
        extractTokenSpy.mockReturnValue(decodedToken);
        const decodeTokenSpy = jest.spyOn(authService, 'decodeToken');
        decodeTokenSpy.mockReturnValue(decodedToken);
        const verifyTokenSpy = jest.spyOn(authService, 'verifyToken');
        verifyTokenSpy.mockReturnValue(Promise.resolve(decodedToken));
        const result = await authService.authenticate({} as any);
        expect(result).toEqual({
          policyDocument: {
            Version: '2012-10-17',
            Statement: [{ Action: 'execute-api:Invoke', Effect: 'Allow' }],
          },
        });
      });
    });
  });
});
