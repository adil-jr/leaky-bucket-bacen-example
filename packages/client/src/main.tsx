import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { RelayEnvironmentProvider } from "react-relay";
import RelayEnvironment from "./RelayEnvironment.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback={"Carregando..."}>
        <App />
      </Suspense>
    </RelayEnvironmentProvider>
  </React.StrictMode>,
);
