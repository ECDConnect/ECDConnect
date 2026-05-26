export interface AppError {
  id: string;
  type: 'network' | 'graphql' | 'api';
  message: string;
  stack?: string;
  timestamp: number;
  payload?: any;
  eventDate: number;
}

export interface ErrorState {
  queryErrors: AppError[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}
