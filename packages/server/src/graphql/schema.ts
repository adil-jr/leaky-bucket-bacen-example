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
    tokensLeft: Int!
  }

  type Query {
    """Retorna o usuário atualmente autenticado."""
    me: User
  }

  type Mutation {
    """Simula uma consulta de chave PIX, consumindo um token."""
    lookupPixKey(key: String!): PixLookupResponse
  }
`;
