export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export interface Doctor {
  [key: string]: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  FETCHING_DATA = 'FETCHING_DATA',
  THINKING = 'THINKING',
  STREAMING = 'STREAMING',
}