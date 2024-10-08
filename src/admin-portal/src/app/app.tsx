import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
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
import { MainRoutes, PublicRoutes } from './routes/app.routes';
import { useAuth } from './hooks/useAuth';
import { UserProvider } from './hooks/useUser';
import { useHistory, useParams } from 'react-router-dom';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
const cache = new InMemoryCache({});
export let apolloClient: ApolloClient<any> = null;
interface RouteParams {
  userId: string;
}

const App: React.FC = () => {
  const { authenticatedUser, getAccessTokenPromise, logout } = useAuth();
  const { setNotification } = useNotifications();
  const [client, setClient] = useState<ApolloClient<any>>();
  const history = useHistory();
  const { userId } = useParams<RouteParams>();

  useEffect(() => {
    if (!authenticatedUser) {
      if (userId?.length === 0) {
        logout();
        history.push('/');
      } else if (userId) {
        history.push(`/register/${userId}`);
      }
    } else {
      const linkError = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path, extensions }) => {
            const errorMessage = extensions?.message;
            console.log(
              `[GraphQL error]: Message: ${errorMessage}, Location: ${locations}, Path: ${path}`
            );
            setNotification({
              title:
                path && path.length > 0
                  ? path[0]?.toString()?.toUpperCase()
                  : 'Server Error!',
              message: message,
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
        ]),
        cache,
      });

      setClient(client);
      apolloClient = client;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticatedUser]);

  if (authenticatedUser && client) {
    return (
      <ApolloProvider client={client}>
        <DialogServiceProvider>
          <PanelServiceProvider>
            <UserProvider userId={authenticatedUser.id}>
              <MainRoutes />
            </UserProvider>
          </PanelServiceProvider>
        </DialogServiceProvider>
      </ApolloProvider>
    );
  } else {
    return <PublicRoutes />;
  }
};

export default App;
