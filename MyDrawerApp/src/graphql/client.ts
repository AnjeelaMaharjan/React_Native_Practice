import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { graphqlZeroApiUrl, rickAndApiUrl } from './constants';

const rickAndMortyLink = createHttpLink({
  uri: rickAndApiUrl,
});

const graphqlZeroLink = createHttpLink({
  uri: graphqlZeroApiUrl,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      // Route based on operation name
      const operationName = definition.name?.value || '';

      // Posts operations go to GraphQL Zero
      const isPostOperation = /Post|post/.test(operationName);
      return isPostOperation;
    },
    authLink.concat(graphqlZeroLink),    // Posts → GraphQL Zero
    authLink.concat(rickAndMortyLink)    // Characters → Rick and Morty
  ),
  cache: new InMemoryCache(),
});