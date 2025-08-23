export interface User {
  id: string;
  name: string;
}

export const users: User[] = [
  { id: "user-01", name: "Alice" },
  { id: "user-02", name: "Bob" },
];

export const validTokens = new Map<string, string>([
  ["super-secret-token-alice", "user-01"],
  ["super-secret-token-bob", "user-02"],
  ["another-valid-token-bob", "user-02"],
]);

export const findUserById = (id: string): User | undefined =>
  users.find((user) => user.id === id);
