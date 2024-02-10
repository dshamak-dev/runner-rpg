export const compareObject = (
  query: Record<string, any>,
  target: Object
): boolean => {
  if (!target) {
    return query === target;
  }

  const match: boolean = Object.entries(query).every(([key, value]) => {
    return target[key] === value;
  });

  return match;
};

export const copyObject = (target) => {
  if (!target) {
    return target;
  }

  return JSON.parse(JSON.stringify(target));
};

export const arrayToMap = <T>(arr: T[], key: string): Record<string, T> => {
  return arr.reduce((prev, it: T) => {
    return { ...prev, [it[key]]: it };
  }, {});
};

export const concatObjects = (...records) => {
  return Object.assign({}, ...records.map(it => copyObject(it)));
};
