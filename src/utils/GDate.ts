class GDate {
  private static _instance: GDate;
  private date: Date | null;

  private constructor() {
    this.date = null;
  }

  public static get instance(): GDate {
    if (!GDate._instance) {
      GDate._instance = new GDate();
    }
    return GDate._instance;
  }

  public setDate(date: Date) {
    this.date = date;
  }

  public now(): Date {
    return this.date ? this.date : new Date();
  }
}

export default GDate;
