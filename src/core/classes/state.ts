import { Sequelize } from 'sequelize';
import { Enums } from '../../types';

class State {
  private enums: Enums;
  private sequelize: Sequelize;

  constructor({ enums, sequelize }) {
    this.enums = enums;
    this.sequelize = sequelize;
  }

  public getEnums() {
    return this.enums;
  }

  public getModels() {
    return this.sequelize.models;
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
