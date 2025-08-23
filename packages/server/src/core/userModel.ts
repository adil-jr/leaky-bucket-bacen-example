export interface LeakyUser {
  readonly id: string;
  readonly name: string;
  readonly token: string;
  tokens: number;
  lastReplenished: Date;
}
