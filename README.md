# Leaky Bucket

Este projeto é uma implementação completa do algoritmo **Leaky Bucket (Balde Furado)** para controle de taxa de requisições (rate limiting).

O sistema foi construído utilizando uma stack moderna com TypeScript, Node.js e React, em uma arquitetura de monorepo, e oferece tanto uma API REST quanto uma API GraphQL.

-----

## O Algoritmo Leaky Bucket

O Leaky Bucket é um algoritmo usado para controlar o fluxo de tráfego, garantindo que ele seja processado a uma taxa constante. A analogia é a de um balde com um furo no fundo:

1.  **O Balde:** Representa a capacidade de um usuário fazer requisições. Ele tem um tamanho máximo.
2.  **A Água:** Cada requisição de um usuário é como uma gota de água adicionada ao balde.
3.  **O Furo:** O balde "vaza" a uma taxa constante, o que representa a reposição da capacidade de fazer requisições ao longo do tempo.
4.  **Transbordamento:** Se chegarem muitas requisições (gotas) em um curto período, o balde enche. Qualquer nova requisição que chegar enquanto o balde estiver cheio será descartada (rejeitada).

Isso garante que, independentemente dos picos de requisições, o sistema só as processe a uma taxa média sustentável.

### Regras de Negócio Implementadas

Baseado na especificação do PIX, este projeto segue as seguintes regras:

  - **Capacidade Máxima:** Cada usuário começa com **10 tokens** (o tamanho do balde).
  - **Consumo:** Cada requisição para simular a consulta de chave PIX consome **1 token**.
  - **Reposição:** O sistema repõe **1 token a cada hora** para cada usuário (a taxa de vazamento).
  - **Limite:** Um usuário nunca pode acumular mais do que os 10 tokens iniciais.
  - **Bloqueio:** Se um usuário tentar fazer uma requisição sem tokens, ele receberá um erro `429 Too Many Requests`.

-----

## Arquitetura e Stack Tecnológica

O projeto foi desenvolvido como um **monorepo** usando **Yarn Workspaces**, separando o backend do frontend de forma organizada.

  - **Backend (`packages/server`):**

      - **Linguagem:** TypeScript
      - **Ambiente:** Node.js 20.x
      - **Framework:** Koa.js
      - **APIs:** REST e GraphQL (com Apollo Server)
      - **Testes:** Jest (Testes Unitários e de Integração)
      - **Princípios:** Programação Funcional, Clean Architecture

  - **Frontend (`packages/client`):**

      - **Framework:** React 19 com TypeScript
      - **Ferramenta de Build:** Vite
      - **Cliente GraphQL:** Relay

-----

## Pré-requisitos

Antes de começar, garanta que você tem as seguintes ferramentas instaladas:

  - **Node.js**: `v20.x` ou superior
  - **Yarn**: `v4.x` (instalado via `corepack enable`)
  - **Apollo Rover CLI**: Ferramenta para introspecção do schema GraphQL. Instale com:
    ```bash
    npm install -g @apollo/rover
    ```

-----

## Guia de Instalação e Execução

Siga estes passos para rodar o projeto localmente.

### 1\. Clone o Repositório

```bash
git clone <url-do-seu-repositorio>
cd leaky-bucket-bacen
```

### 2\. Instale as Dependências

Execute na raiz do projeto. O Yarn irá instalar as dependências de todos os pacotes do monorepo.

```bash
yarn install
```

### 3\. Configure as Variáveis de Ambiente

O servidor precisa de um arquivo `.env`. Copie o exemplo e o utilize.

Crie o arquivo `packages/server/.env` com o seguinte conteúdo:

```env
# Configurações do Servidor
PORT=3000

# Configurações do Banco de Dados (para futuras implementações com MongoDB)
MONGO_URI="mongodb://localhost:27017/leaky_bucket_db"
```

### 4\. Execute o Backend

Este comando iniciará o servidor Koa na porta `3000`.

```bash
# A partir da raiz do projeto
yarn server
```

Você verá logs indicando que as APIs REST e GraphQL estão disponíveis.

### 5\. Baixe o Schema do GraphQL

Com o backend rodando, abra **outro terminal** e execute o comando abaixo para que o frontend saiba qual é a estrutura da API GraphQL.

```bash
# A partir da raiz do projeto
rover graph introspect http://localhost:3000/graphql --header "Authorization: Bearer alice-super-secret-token" > packages/client/schema.graphql
```

### 6\. Compile o Código do Relay

O Relay precisa compilar as queries GraphQL escritas nos componentes React.

```bash
# A partir da raiz do projeto
yarn workspace @leaky-bucket/client relay
```

### 7\. Execute o Frontend

Finalmente, inicie o servidor de desenvolvimento do React.

```bash
# A partir da raiz do projeto
yarn workspace @leaky-bucket/client dev
```

A aplicação React estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

-----

## Como Executar os Testes

Para rodar a suíte completa de testes (unitários e de integração) do backend, execute:

```bash
# A partir da raiz do projeto
yarn test
```

-----

## Documentação da API

A autenticação em todos os endpoints protegidos é feita via `Bearer Token` no cabeçalho `Authorization`.

**Tokens de Exemplo:**

  - **Alice:** `alice-super-secret-token`
  - **Bob:** `bob-super-secret-token`

### API REST

| Método | Endpoint                    | Descrição                                                                      | Autenticação |
| :----- | :-------------------------- | :----------------------------------------------------------------------------- | :----------- |
| `GET`  | `/`                         | Health check básico para verificar se a API está online.                         | Nenhuma      |
| `GET`  | `/me`                       | Retorna os dados do usuário autenticado, incluindo o estado atual dos tokens.    | Obrigatória  |
| `POST` | `/pix/keys/:key`            | Simula uma consulta de chave PIX, consumindo um token do usuário autenticado.    | Obrigatória  |

**Exemplo de Resposta (GET /me):**

```json
{
  "message": "Hello, Alice!",
  "authenticatedUser": {
    "id": "user-01",
    "name": "Alice",
    "token": "alice-super-secret-token",
    "tokens": 10,
    "lastReplenished": "2025-08-24T18:45:00.000Z"
  }
}
```

**Exemplo de Resposta (POST /pix/keys/...):**

```json
{
  "message": "Successfully looked up PIX key 'chave-pix-123'",
  "tokens_left": 9
}
```

### API GraphQL

Acesse o **Apollo Sandbox** em `http://localhost:3000/graphql` para interagir com a API.

**Lembre-se:** para executar queries/mutations, configure o cabeçalho de autenticação na aba "Headers" do Sandbox:

  - **Key:** `Authorization`
  - **Value:** `Bearer alice-super-secret-token`

#### Query: `me`

Busca os dados do usuário autenticado.

```graphql
query GetCurrentUser {
  me {
    id
    name
    tokens
    lastReplenished
  }
}
```

#### Mutation: `lookupPixKey`

Simula uma consulta PIX, consome um token e retorna o estado atualizado do usuário.

```graphql
mutation PerformPixLookup($key: String!) {
  lookupPixKey(key: $key) {
    success
    message
    user {
      id
      tokens
    }
  }
}
```

**Variáveis da Query (exemplo):**

```json
{
  "key": "minha-chave-pix-graphql"
}
```

-----
