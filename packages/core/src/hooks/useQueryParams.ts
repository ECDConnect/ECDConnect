export const useQueryParams = (url: string) => {
  const query = new URLSearchParams(url);

  const getValue = (key: string) => {
    return query.get(key);
  };

  return { getValue };
};
