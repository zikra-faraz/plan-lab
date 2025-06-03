import { useState } from "react";
import { toast } from "sonner";

const useFetch = <T>(cb: (...args: any[]) => Promise<T>) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};
//{
//   data: T | undefined,
//   loading: boolean,
//   error: Error | null,
//   fn: (...args: any[]) => Promise<void>,
//   setData: React.Dispatch<React.SetStateAction<T | undefined>>
// }

export default useFetch;
