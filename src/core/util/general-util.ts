export const lowercaseFirstLetter = (value: string) => {
  return value.charAt(0).toLowerCase() + value.slice(1);
};

export const uppercaseFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
