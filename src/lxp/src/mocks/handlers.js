import { graphql } from 'msw';
import jwt_decode from 'jwt-decode';

const isAuthorized = (req) => {
  const authorizationToken = req.headers.get('authorization');
  const decodedToken = jwt_decode(authorizationToken);
  let currentDate = new Date();
  return decodedToken.exp * 1000 < currentDate.getTime();
};

export const handlers = [
  // Handles a "Login" mutation
  // This is an example of a mutation
  graphql.mutation('Login', (req, res, ctx) => {
    if (isAuthorized(req)) {
      return res(
        ctx.errors([
          {
            message: 'Not authenticated',
            errorType: 'AuthenticationError',
          },
        ])
      );
    }
    return res(
      ctx.status(200),
      ctx.data({
        login: {
          username: 'some username',
        },
      })
    );
  }),

  graphql.query('GetAllPractitioners', (req, res, ctx) => {
    if (isAuthorized(req)) {
      return res(
        ctx.errors([
          {
            message: 'Not authenticated',
            errorType: 'AuthenticationError',
          },
        ])
      );
    }

    // When authenticated, respond with a query payload
    return res(
      ctx.status(200),
      ctx.data({
        GetAllPractitioners: [
          {
            id: '81b990b2-30a6-4e8f-90e6-3073be5bd8f5',
            user: {
              id: 'a7e33063-3a85-440a-9d6d-23e8435702b6',
              idNumber: '9705035056222',
              fullName: 'Brian Cheruiyot',
            },
          },
          {
            id: '21b990b2-30a6-4e8f-90e6-3073be5bd8f5',
            user: {
              id: 'a4e33063-3a85-440a-9d6d-23e8435702b6',
              idNumber: '9705035056223',
              fullName: 'Bryce Cee',
            },
          },
        ],
      })
    );
  }),
];
