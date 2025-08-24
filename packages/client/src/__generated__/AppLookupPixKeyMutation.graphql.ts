/**
 * @generated SignedSource<<564cb2d8bad9df4a41abf7acbf3b702f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AppLookupPixKeyMutation$variables = {
  key: string;
};
export type AppLookupPixKeyMutation$data = {
  readonly lookupPixKey: {
    readonly message: string;
    readonly success: boolean;
    readonly user: {
      readonly id: string;
      readonly tokens: number;
    };
  } | null | undefined;
};
export type AppLookupPixKeyMutation = {
  response: AppLookupPixKeyMutation$data;
  variables: AppLookupPixKeyMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "key"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "key",
        "variableName": "key"
      }
    ],
    "concreteType": "PixLookupResponse",
    "kind": "LinkedField",
    "name": "lookupPixKey",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "message",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "tokens",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AppLookupPixKeyMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AppLookupPixKeyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6d61ba50aa2b4409185f5fa73484fc10",
    "id": null,
    "metadata": {},
    "name": "AppLookupPixKeyMutation",
    "operationKind": "mutation",
    "text": "mutation AppLookupPixKeyMutation(\n  $key: String!\n) {\n  lookupPixKey(key: $key) {\n    success\n    message\n    user {\n      id\n      tokens\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2e089d491fe06e2010e9800f13554458";

export default node;
