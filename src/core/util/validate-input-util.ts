import { InitializeInput } from '../../types';

export const validateInput = (input: InitializeInput): Error | void => {
  const errs: string[] = [];
  const baseStr = (str) => `One of <${str}> must be provided`;

  if (!input.pathToSequelize && !input.sequelize) {
    errs.push('pathToSequelize, sequelize');
  }

  if (errs.length) {
    throw new Error(errs.map((x) => baseStr(x)).join('\n'));
  }
};
