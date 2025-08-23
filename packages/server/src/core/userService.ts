import { LeakyUser } from "./userModel";

const users = new Map<string, LeakyUser>([
  [
    "alice-super-secret-token",
    {
      id: "user-01",
      name: "Alice",
      token: "alice-super-secret-token",
      tokens: 10,
      lastReplenished: new Date(),
    },
  ],
  [
    "bob-super-secret-token",
    {
      id: "user-02",
      name: "Bob",
      token: "bob-super-secret-token",
      tokens: 10,
      lastReplenished: new Date(),
    },
  ],
]);

export const findUserByToken = (token: string): LeakyUser | undefined => {
  return users.get(token);
};

export const updateUserState = (user: LeakyUser): LeakyUser => {
  if (!users.has(user.token)) {
    throw new Error("User not found, cannot update.");
  }
  users.set(user.token, user);
  return user;
};
