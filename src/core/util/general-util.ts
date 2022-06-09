export const lowercaseFirstLetter = (value: string) => {
  return value.charAt(0).toLowerCase() + value.slice(1);
};

export const uppercaseFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const findValueCaseInsensitive = (obj, key: string) => {
  try {
    const lowered = obj?.[lowercaseFirstLetter(key)];
    const uppered = obj?.[uppercaseFirstLetter(key)];

    return lowered || uppered;
  } catch {
    return undefined;
  }
};
