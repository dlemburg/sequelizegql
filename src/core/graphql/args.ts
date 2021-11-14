export const args = (args) =>
  args.length
    ? `(${args
        .map((x) => {
          const [value] = Object.entries(x);
          return `${value[0]}: ${value[1]}`;
        })
        .join(', ')})`
    : '';
