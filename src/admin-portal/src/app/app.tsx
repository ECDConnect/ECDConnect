import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  Config,
  DialogServiceProvider,
  NOTIFICATION,
  PanelServiceProvider,
  useNotifications,
} from '@ecdlink/core';
import { createUploadLink } from 'apollo-upload-client';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { MainRoutes, PublicRoutes } from './app.routes';
import { useAuth } from './hooks/useAuth';
import { UserProvider } from './hooks/useUser';

const cache = new InMemoryCache({});

const App: React.FC = () => {
  const { authenticatedUser, getAccessTokenPromise, logout } = useAuth();
  const { setNotification } = useNotifications();
  const [client, setClient] = useState<ApolloClient<any>>();
  const history = useHistory();

  useEffect(() => {
    if (!authenticatedUser) {
      logout();
      history.push('/');
    } else {
      const linkError = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path, extensions }) => {
            const errorMessage = extensions?.message;
            console.log(
              `[GraphQL error]: Message: ${errorMessage}, Location: ${locations}, Path: ${path}`
            );
            setNotification({
              title: path && path.length > 0 ? path[0]?.toString()?.toUpperCase() : 'Server Error!',
              message: errorMessage,
              variant: NOTIFICATION.ERROR,
            });
          });
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
          setNotification({
            title: 'Network Error!',
            message: 'Please check your internet connection and try again',
            variant: NOTIFICATION.ERROR,
          });
        }
      });

      const linkMain = createHttpLink({
        uri: Config.graphQlApi,
      });

      const linkTokenHeader = setContext(async (_, { headers }) => {
        const accessToken = await getAccessTokenPromise();
        return {
          headers: {
            ...headers,
            authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        };
      });

      const client = new ApolloClient({
        link: ApolloLink.from([
          linkTokenHeader,
          linkError,
          createUploadLink({ uri: Config.graphQlApi }),
          linkMain,
        ]),
        cache,
      });

      setClient(client);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticatedUser]);

  if (authenticatedUser && client) {
    return (
      <ApolloProvider client={client}>
        <PanelServiceProvider>
          <DialogServiceProvider>
            <UserProvider userId={authenticatedUser.id}>
              <MainRoutes />
            </UserProvider>
          </DialogServiceProvider>
        </PanelServiceProvider>
      </ApolloProvider>
    );
  } else {
    return <PublicRoutes />;
  }
};

export default App;
