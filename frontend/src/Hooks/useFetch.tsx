import { useCallback, useState } from 'react';
import { Response } from '../utils/services';

type Fetch<T, K> = (params: T) => Promise<Response<K>>;

const DEFAULT_ERROR = ['Something went wrong'];

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
            setError(response.errors || DEFAULT_ERROR);
            setData(null);
            return;
          }
          setData(response.data);
        } catch (error) {
          setError(DEFAULT_ERROR);
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
