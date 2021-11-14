export const OperationArgsBuilder = (args) => {
  const operationNameArgs = args.length
    ? `(${args
        .map((x) => {
          const [value] = Object.entries(x);
          return `$${value[0]}: ${value[1]}`;
        })
        .join(', ')})`
    : '';

  const operationArgs = args.length
    ? `(${args
        .map((x) => {
          const [value] = Object.entries(x);
          return `${value[0]}: $${value[0]}`;
        })
        .join(', ')})`
    : '';

  return { operationNameArgs, operationArgs };
};
