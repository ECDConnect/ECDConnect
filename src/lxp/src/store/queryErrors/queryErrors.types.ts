export interface AppError {
  id?: string;
  type: 'network' | 'graphql' | 'api';
  message: string;
  payload?: any;
  eventDate: number;
  clientUrl?: string; // the url of the client when the error occurred
  isOnline?: boolean; // was the user online or not
  requestPayload?: any; // this includes the graph query Id and arguments
  userAgent?: string; // browser and OS info
}

export interface ErrorState {
  queryErrors: AppError[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}
