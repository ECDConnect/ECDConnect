function isObject(value: any): boolean {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

interface InitialRoute {
  ROOT: string;
}

export default function addPrefix<M extends Record<string, {}>>(
  prefix: string,
  routes: M
): M & InitialRoute {
  const initial: M & InitialRoute = Object.assign(
    {
      ROOT: prefix,
    },
    routes
  );

  return Object.keys(routes).reduce(
    (accumulator: M & InitialRoute, key: string) =>
      Object.assign(accumulator, {
        [key]: isObject(routes[key])
          ? addPrefix(prefix, routes[key])
          : `${prefix}${routes[key]}`,
      }),
    initial
  );
}
