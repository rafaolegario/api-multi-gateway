# Tarefas Pendentes

## Rotas Públicas

- [x] POST /auth/login - Realizar o login
- [ ] POST /purchases - Realizar uma compra informando o produto

## Rotas Privadas

### Gateways

- [ ] PATCH /gateways/:id/toggle - Ativar/desativar um gateway
- [ ] PATCH /gateways/:id/priority - Alterar a prioridade de um gateway

### Usuários (CRUD com roles)

- [ ] GET /users - Listar usuários
- [ ] GET /users/:id - Detalhe do usuário
- [ ] POST /users - Criar usuário
- [ ] PUT /users/:id - Atualizar usuário
- [ ] DELETE /users/:id - Deletar usuário

### Produtos (CRUD com roles)

- [ ] GET /products - Listar produtos
- [ ] GET /products/:id - Detalhe do produto
- [ ] POST /products - Criar produto
- [ ] PUT /products/:id - Atualizar produto
- [ ] DELETE /products/:id - Deletar produto

### Clientes

- [ ] GET /clients - Listar todos os clientes
- [ ] GET /clients/:id - Detalhe do cliente e todas suas compras

### Compras/Transações

- [ ] GET /transactions - Listar todas as compras
- [ ] GET /transactions/:id - Detalhes de uma compra
- [ ] POST /transactions/:id/refund - Realizar reembolso (com roles)

## Implementações Pendentes

### Repositories Lucid

- [x] LucidUserRepository
- [ ] LucidGatewayRepository
- [ ] LucidClientRepository
- [ ] LucidProductRepository
- [ ] LucidTransactionRepository

### Services

- [x] AuthenticateService
- [ ] GatewayService
- [ ] ClientService
- [ ] ProductService
- [ ] TransactionService (compra + reembolso)
- [ ] PurchaseService (integração com gateways)

### Controllers

- [x] AuthenticateController
- [ ] GatewayController
- [ ] ClientController
- [ ] ProductController
- [ ] TransactionController
- [ ] PurchaseController

### Validators

- [x] loginValidator
- [ ] purchaseValidator
- [ ] gatewayValidator
- [ ] productValidator
- [ ] userValidator (create/update)

### Middleware

- [ ] Validação de roles por rota

### Integração Gateways

- [ ] Serviço de integração com gateways externos
- [ ] Lógica de fallback (prioridade)
- [ ] Processamento de compra
- [ ] Processamento de reembolso
