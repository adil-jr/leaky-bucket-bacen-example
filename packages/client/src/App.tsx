import { graphql, useLazyLoadQuery } from "react-relay";
import type { AppQuery as AppQueryType } from "./__generated__/AppQuery.graphql";
import "./App.css";

const AppQuery = graphql`
  query AppQuery {
    me {
      id
      name
      tokens
    }
  }
`;

function App() {
  const data = useLazyLoadQuery<AppQueryType>(AppQuery, {});

  return (
    <div className="card">
      {data.me ? (
        <>
          <h1>Bem-vindo, {data.me.name}!</h1>
          <p>Tokens restantes: {data.me.tokens}</p>
        </>
      ) : (
        <h1>Usuário não encontrado. Verifique seu token.</h1>
      )}
    </div>
  );
}

export default App;
