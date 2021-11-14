class OperationArgs {
  private args;

  constructor(args) {
    this.args = args;

    return this;
  }

  public operationNameArgs() {
    return this.args.length
      ? `(${this.args
          .map((x) => {
            const [value] = Object.entries(x);
            return `$${value[0]}: ${value[1]}`;
          })
          .join(', ')})`
      : '';
  }

  public operationArgs() {
    return this.args.length
      ? `(${this.args
          .map((x) => {
            const [value] = Object.entries(x);
            return `${value[0]}: $${value[0]}`;
          })
          .join(', ')})`
      : '';
  }
}

export const OperationArgsFactory = (args) => new OperationArgs(args);
