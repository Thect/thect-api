import type { AWS } from '@serverless/typescript';
import { auth, getMySpaces } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'thect-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-central-1',
    stage: '${opt:stage}',
    profile: '${opt:stage, "prod"}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      JWKS_URI: '${env:JWKS_URI}',
      TOKEN_ISSUER: '${env:TOKEN_ISSUER}',
      AUDIENCE: '${env:AUDIENCE}',
    },
  },
  // import the function via paths
  functions: { auth, getMySpaces },
  package: { individually: true },
  useDotenv: true,
  custom: {
    stage: '${opt:stage, self:provider.stage}',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
