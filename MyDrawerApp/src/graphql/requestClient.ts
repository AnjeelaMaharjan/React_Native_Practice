import { GraphQLClient } from 'graphql-request';
import { graphqlZeroApiUrl } from './constants';

// Single graphql-request client instance for Posts offline-first feature
export const gqlClient = new GraphQLClient(graphqlZeroApiUrl);
