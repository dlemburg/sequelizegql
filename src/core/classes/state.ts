import { Model, Sequelize } from 'sequelize';
import { Models } from '../../types';

class State {
  private models: Models;
  private enums;
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
