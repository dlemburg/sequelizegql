class State {
  private models;
  private enums;
  private sequelize;

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

export const StateFactory = (input) => new State(input);