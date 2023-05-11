import { useCallback, useState } from 'react';
import { Response } from '../utils/services';
import { AppError } from '../utils/utils';

type Fetch<T, K> = (params: T) => Promise<Response<K>>;

// type UseFetch = <T, K>(
//   request: Fetch<T, K>
// ) => Promise<
//   (
//     | (() => Promise<void>)
//     | {
//         isLoading: boolean;
//         data: K | undefined;
//         error: string;
//       }
//   )[]
// >;

export const useFetch = <T, K>(
  request: Fetch<T, K>
): [
  {
    isLoading: boolean;
    data: K | undefined;
    error: string;
  },
  (params: T) => void
] => {
  const [error, setError] = useState('');
  const [data, setData] = useState<K>();
  const [isLoading, setIsLoading] = useState(false);

  const handler = useCallback(
    (params = {} as T) => {
      const fetchData = async (params: T) => {
        try {
          setIsLoading(true);
          const response = await request(params);
          if (!response.ok) throw new AppError(response.error);
          setData(response.data);
        } catch (error) {
          if (error instanceof AppError) setError(error.message);
          setError('Something went wrong');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData(params);
    },
    [request]
  );

  return [{ isLoading, data, error }, handler];
};
