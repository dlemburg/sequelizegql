import { ResolverFieldMapArgs } from '../../types';

class OperationArgs {
  private args: ResolverFieldMapArgs;

  constructor(args) {
    this.args = args;

    return this;
  }

  private buildArgs({ adornKey = false, adornValue = false }): string {
    return this.args.length
      ? `(${this.args
          .map((x) => {
            const [value] = Object.entries(x);
            return `${adornKey ? '$' : ''}${value[0]}: ${adornValue ? '$' : ''}${value[0]}`;
          })
          .join(', ')})`
      : '';
  }

  public operationNameArgs(): string {
    return this.buildArgs({ adornValue: true });
  }

  public operationArgs(): string {
    return this.buildArgs({ adornKey: true });
  }
}

export const OperationArgsFactory = (args: ResolverFieldMapArgs) => new OperationArgs(args);
