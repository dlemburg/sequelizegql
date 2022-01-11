import { InitializeInput } from '../../types';

export const validateInput = (input: InitializeInput): Error | void => {
  const errs: string[] = [];

  if (!input.sequelize) {
    errs.push('Sequelize instance must be provided!');
  }

  if (errs.length) {
    throw new Error(errs.join('\n'));
  }
};
