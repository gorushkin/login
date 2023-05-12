import { useCallback, useState } from 'react';
import { Response } from '../utils/services';
import { AppError } from '../utils/utils';

type Fetch<T, K> = (params: T) => Promise<Response<K>>;

export const useFetch = <T, K>(
  request: Fetch<T, K>
): [
  {
    isLoading: boolean;
    data: K | null;
    error: string[];
  },
  (params: T) => void
] => {
  const [error, setError] = useState<string[]>([]);
  const [data, setData] = useState<K | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handler = useCallback(
    (params = {} as T) => {
      const fetchData = async (params: T) => {
        setError([]);
        setData(null);
        try {
          setIsLoading(true);
          const response = await request(params);
          if (!response.ok) {
            setError(response.errors);
            setData(null);
            return;
          }
          setData(response.data);
        } catch (error) {
          setError(['Something went wrong']);
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
