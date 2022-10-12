export enum LogTypes {
  IMPRESSION = 'impression',
  CONVERSION = 'conversion',
}

export interface User {
  id: string;
  createdTime: string;
  fields: {
    Id: number;
    Name: string;
    avatar: string;
    occupation: string;
  };
}

export interface UserResponse {
  records: User[];
  offset?: string;
}

export interface Log {
  revenue: number;
  time: string;
  type: string;
  user_id: number;
}

export interface UserMetrics {
  impressions: number;
  conversions: number;
  revenue: number;
  conversionDates: Map<string, number>;
}

export interface Metrics {
  minDay: string | null;
  maxDay: string | null;
  userMetrics: Map<number, UserMetrics>;
}
