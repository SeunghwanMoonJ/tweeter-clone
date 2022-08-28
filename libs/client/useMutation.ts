import { useState } from "react";

interface useMutationState<T> {
  loading: boolean;
  data: T;
  error: object;
}
type useMutationResult<T> = [(data?: any) => void, useMutationState<T>];

export default function useMutation<T = any>(
  url: string
): useMutationResult<T> {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<undefined | any>(undefined);
  const [error, setError] = useState<undefined | any>(undefined);

  function mutation(data?: any) {
    setLoading(true);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch(() => {}) // reponse json 없을때 에러 무시
      .then((json) => setData(json)) // .then(setData)
      .catch((error) => setError(error)) // .then(setError)로 줄이기 가능
      .finally(() => setLoading(false));
  }
  return [mutation, { loading, data, error }];
}
