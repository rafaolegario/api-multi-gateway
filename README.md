# API Multi Gateway - BeTalent

API de pagamentos com suporte a múltiplos gateways, fallback automático por prioridade.

## Resumo geral

### Stack

- **AdonisJS v7**
- **Lucid ORM** (Nativo do Adonis)
- **VineJS** (Nativo do Adonis)
- **Japa** (testes) (Nativo do Adonis)

### Arquitetura e Padrões

- **TDD**
- **Clean Architecture**
- **SOLID**
- **Repository Pattern**
- **Registry Pattern**
- **Dependency Injection**

### Estatísticas do desafio

- **Nivel escolhido: 3**
- **Rotas implementadas: 20/20**
- **Testes unitários: 70**

## Requisitos

- Docker e Docker Compose

## Como rodar

```bash
# Clonar o repositório
git clone <repo-url>
cd api-multi-gateway
```

```bash
# Copiar variáveis de ambiente
cp .env.example .env

# Padrões geradas pelo Adonis
TZ=UTC
PORT=3000 #(Não usar 3001 e 3002)
HOST=localhost
LOG_LEVEL=info
APP_KEY=JRTP0T0udj2iS0zF4QPmd0UXTW72LIlc #Chave unica, essa está sendo passada a fins de testes
APP_URL=http://${HOST}:${PORT}

# Valores Sugeridos

# Banco de dados para o desafio (Sugestão)
DB_HOST=localhost
DB_PORT=3306
DB_USER=beTalent
DB_PASSWORD=123456789
DB_NAME=BeTalent

# JWT (exemplo)
JWT_SECRET=your_jwt_secret_key

# Payment Gateways
GATEWAY_1_URL= #URL disponibilizada no desafio
GATEWAY_1_EMAIL= #Email Disponibilizado no desafio
GATEWAY_1_TOKEN= #Token Disponibilizado no desafio

GATEWAY_2_URL= #URL disponibilizada no dasefio
GATEWAY_2_AUTH_TOKEN= #Token Disponibilizado no desafio
GATEWAY_2_AUTH_SECRET= #Secret Disponibilizado no desafio

```

```bash

# Subir todos os serviços (MySQL, mock dos gateways e aplicação)
docker compose up -d

A Aplicação ficará disponivel em http://localhost:3000 #ou porta configurada na .env
```

### Aplicação no rodando

Ao iniciar a aplicação o uma seed é executada no banco de dados criando alguns valores padrões, sendo eles:

| Recurso  | Dados                                              |
| -------- | -------------------------------------------------- |
| User     | `admin@betalent.com` / `admin123` (role: admin)    |
| Produtos | `product1` (R$ 10,00), `product2` (R$ 20,00)       |
| Gateways | Gateway 1 (prioridade 1), Gateway 2 (prioridade 2) |

### Rodar testes

```bash
pnpm test
```

Os testes unitários utilizam repositórios in-memory, sem necessidade de banco de dados.

## Rotas

Coleção do postman aqui [Multi-gateway-api.postman](Multi-gateway-api.postman_collection.json)

### Rotas Públicas

### Login

```
POST /auth/login
```

```json
{
  "email": "admin@betalent.com",
  "password": "admin123"
}
```

`email` - email do usuário<br>
`password` - senha do usuário

Retorna um token de auth

### Realizar compra

```
POST /purchase
```

```json
{
  "name": "Tester",
  "email": "tester@email.com",
  "cardNumber": "4111111111111111",
  "cvv": "123",
  "products": [
    { "id": "id-produto", "quantity": 2 },
    { "id": "id-produto", "quantity": 1 }
  ]
}
```

`name` - nome do comprador<br>
`email` - email do comprador<br>
`cardNumber` - número do cartão (16 dígitos)<br>
`cvv` - cvv do cartão<br>
`products` - lista de produtos com `id` (UUID do produto) e `quantity` (quantidade)

Retorna uma mensagem de sucesso ou falha

### Rotas Privadas

Todas as rotas privadas requerem o header `Authorization: Bearer <token>`.

#### Usuários (ADMIN, MANAGER)

Obs: Como não foi especificado nenhuma regra especifica para o gerenciamento de roles, deixei dessa forma:<br>
- Admins podem criar/editar todos, inclusive outros admins
- Managers podem criar/editar User e Finance, mas não podem criar/editar outros Managers nem Administradores

### Listar usuários com paginação

```
GET /users?page=1&limit=10
```

`page` - página atual (mínimo 1)<br>
`limit` - quantidade por página (mínimo 1, máximo 100)

### Detalhe do usuário

```
GET /users/:id
```

`:id` - UUID do usuário no banco de dados

### Criar usuário

```
POST /users
```

```json
{
  "email": "novo@email.com",
  "password": "senha1234",
  "role": "manager"
}
```

`email` - email do usuário<br>
`password` - senha<br>
`role` - papel do usuário (`admin`, `manager`, `finance`, `user`)

### Atualizar usuário

```
PUT /users/:id
```

```json
{
  "email": "atualizado@email.com",
  "password": "novasenha123",
  "role": "admin"
}
```

`:id` - UUID do usuário no banco de dados<br>
`email` - (opcional) email do usuário<br>
`password` - (opcional) senha<br>
`role` - (opcional) papel do usuário (`admin`, `manager`, `finance`, `user`)

### Deletar usuário

```
DELETE /users/:id
```

`:id` - UUID do usuário no banco de dados

---

#### Produtos (ADMIN, MANAGER, FINANCE)

### Listar produtos com paginação

```
GET /products?page=1&limit=10
```

`page` - página atual (mínimo 1)<br>
`limit` - quantidade por página (mínimo 1, máximo 100)

### Detalhe do produto

```
GET /products/:id
```

`:id` - UUID do produto no banco de dados

### Criar produto

```
POST /products
```

```json
{
  "name": "Produto Exemplo",
  "amount": 1500
}
```

`name` - nome do produto<br>
`amount` - valor do produto em centavos (mínimo 1)

### Atualizar produto

```
PUT /products/:id
```

```json
{
  "name": "Produto Atualizado",
  "amount": 2000
}
```

`:id` - UUID do produto no banco de dados<br>
`name` - (opcional) nome do produto<br>
`amount` - (opcional) valor do produto em centavos (mínimo 1),

### Deletar produto

```
DELETE /products/:id
```

`:id` - UUID do produto no banco de dados

---

#### Gateways (ADMIN, USER)

### Listar gateways com paginação

```
GET /gateways?page=1&limit=10
```

`page` - página atual (mínimo 1)<br>
`limit` - quantidade por página (mínimo 1, máximo 100)

### Ativar ou desativar um gateway

```
PATCH /gateways/:id/toggle
```

`:id` - UUID do gateway no banco de dados

### Alterar prioridade do gateway

```
PATCH /gateways/:id/change-priority
```

```json
{
  "priority": 1
}
```

`:id` - UUID do gateway no banco de dados<br>
`priority` - nova prioridade do gateway (mínimo 1)

---

#### Clientes (ADMIN, MANAGER, FINANCE, USER)

### Listar clientes com paginação

```
GET /clients?page=1&limit=10
```

`page` - página atual (mínimo 1)<br>
`limit` - quantidade por página (mínimo 1, máximo 100)

### Detalhe do cliente e suas compras com paginação

```
GET /clients/:id/transactions?page=1&limit=10
```

`:id` - UUID do cliente no banco de dados<br>
`page` - página atual (mínimo 1)<br>
`limit` - quantidade por página (mínimo 1, máximo 100)

---

#### Transações (ADMIN, MANAGER, FINANCE, USER)

### Listar transações com paginação e filtros opcionais

```
GET /transactions?page=1&limit=10
```

`page` - página atual (mínimo 1) <br>
`limit` - quantidade por página (mínimo 1, máximo 100)<br>
`gatewayId` - (opcional) UUID do gateway para filtrar<br>
`status` - (opcional) filtrar por status (`successful`, `failed`, `refunded`)

### Detalhe da transação

```
GET /transactions/:id
```

`:id` - UUID da transação no banco de dados

### Reembolsar transação (ADMIN, FINANCE)

```
POST /transactions/:id/refund
```

```json
{
  "reason": "Produto com defeito"
}
```

`:id` - UUID da transação no banco de dados<br>
`reason` - motivo do reembolso (mínimo 3 caracteres)

## Estratégia de Fallback e Gerenciamento de Gateways

Para o fallback entre gateways, criei um contrato base (`PaymentGateway`) que define os métodos `charge` e `refund`. Cada gateway tem sua própria implementação desse contrato, lidando com as particularidades de autenticação e endpoints de cada API. Essas implementações são registradas por nome em um `GatewayRegistry`, que funciona como um `Map` — para adicionar um novo gateway no futuro, basta criar a classe e registrar, sem alterar a lógica de processamento.

Na hora da compra, o `PurchaseService` busca no banco todos os gateways ativos, ordenados por prioridade, e percorre essa lista tentando cobrar em cada um. Se o primeiro responder com sucesso, já retorna. Se falhar, segue para o próximo. Se todos falharem, a transação é salva como `FAILED` com a mensagem do último erro.

## Dificuldades encontradas

As principais dificuldades estiveram relacionadas à adaptação de sintaxe entre frameworks e ORMs já conhecidos e os utilizados no projeto:

- **AdonisJS vs NestJS** – As diferenças na estrutura de módulos, injeção de dependências, middlewares e construção de rotas entre os dois frameworks exigiram um período de adaptação, já que minha experiência diária é com o NestJS.

- **Lucid ORM vs Prisma** – A forma de definir models, schemas, migrations, realizar queries e lidar com relacionamentos no Lucid é diferente do Prisma, o que trouxe um aprendizado adicional durante o desenvolvimento.
