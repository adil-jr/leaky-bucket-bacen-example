import { graphql, useLazyLoadQuery, useMutation } from "react-relay";
import type { AppQuery as AppQueryType } from "./__generated__/AppQuery.graphql";
import type { AppLookupPixKeyMutation as MutationType } from "./__generated__/AppLookupPixKeyMutation.graphql";
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

const AppLookupPixKeyMutation = graphql`
  mutation AppLookupPixKeyMutation($key: String!) {
    lookupPixKey(key: $key) {
      success
      message
      user {
        id
        tokens
      }
    }
  }
`;

function App() {
  const data = useLazyLoadQuery<AppQueryType>(AppQuery, {});

  const [commitMutation, isMutationInFlight] = useMutation<MutationType>(
    AppLookupPixKeyMutation,
  );

  const handleLookupClick = () => {
    const randomKey = `chave-pix-${Math.random().toString(36).substring(7)}`;

    commitMutation({
      variables: {
        key: randomKey,
      },
    });
  };

  return (
    <div className="card">
      {data.me ? (
        <>
          <h1>Bem-vindo, {data.me.name}!</h1>
          <p>Tokens restantes: {data.me.tokens}</p>
          <button onClick={handleLookupClick} disabled={isMutationInFlight}>
            {isMutationInFlight ? "Consultando..." : "Simular Consulta PIX"}
          </button>
        </>
      ) : (
        <h1>Usuário não encontrado. Verifique seu token.</h1>
      )}
    </div>
  );
}

export default App;
