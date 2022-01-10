import { Sequelize } from 'sequelize';

class State {
  private sequelize: Sequelize;

  constructor({ sequelize }) {
    this.sequelize = sequelize;
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
