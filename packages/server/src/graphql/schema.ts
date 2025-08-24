export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    tokens: Int!
    lastReplenished: String!
  }

  type PixLookupResponse {
    success: Boolean!
    message: String!
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    lookupPixKey(key: String!): PixLookupResponse
  }
`;
