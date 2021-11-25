import { newLine } from './new-line';

export const whereInputFilterEnumGql = (name, whereAttributes) => {
  const enumName = `${name}WhereInputFilterEnum`;

  return {
    enumGql: `
      enum ${enumName} {
        ${whereAttributes.map((x) => x.key).join(`${newLine()}`)}
      }
    `,
    enumName,
  };
};
