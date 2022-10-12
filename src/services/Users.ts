import axios from 'axios';
import { UserResponse } from '@pv/types';

export const getUsers = async (offset: string | null = null) => {
  const { data } = await axios.get<UserResponse>(
    'https://api.airtable.com/v0/appBTaX8XIvvr6zEC/Users?sort%5B0%5D%5Bfield%5D=Name&sort%5B0%5D%5Bdirection%5D=asc',
    {
      headers: {
        authorization: 'Bearer key4v56MUqVr9sNJv',
      },
      params: {
        pageSize: 20,
        ...(offset ? { offset } : {}),
      },
    }
  );

  return data;
};
