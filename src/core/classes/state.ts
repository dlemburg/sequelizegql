import { Sequelize } from 'sequelize';
import { Enums, Models } from '../../types';

class State {
  private models: Models;
  private enums: Enums;
  private sequelize: Sequelize;

  constructor({ models, enums, sequelize }) {
    this.models = models;
    this.enums = enums;
    this.sequelize = sequelize;
  }

  public getEnums() {
    return this.enums;
  }

  public getModels() {
    return this.models;
  }

  public getSequelize() {
    return this.sequelize;
  }
}

let stateSingleton: State;

export const StateFactory = (input?) => {
  if (stateSingleton) {
    return stateSingleton;
  }

  stateSingleton = new State(input);

  return stateSingleton;
};
