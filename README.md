# API de Despesas Pessoais

API RESTful para gerenciamento de despesas pessoais, desenvolvida com NestJS, Prisma ORM e PostgreSQL.

## 🚀 Tecnologias

- NestJS
- Prisma ORM
- PostgreSQL
- Redis (Cache)
- JWT (Autenticação)
- Swagger (Documentação)
- Zod (Validação)

## 📋 Pré-requisitos

- Node.js
- PostgreSQL
- Redis
- Yarn

## 🔧 Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd expenses-api
```

2. Instale as dependências
```bash
yarn install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/expenses?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"
```

4. Execute as migrações do Prisma
```bash
yarn prisma migrate dev
```

## 🚀 Executando o projeto

```bash
# Desenvolvimento
yarn start:dev

# Produção
yarn build
yarn start:prod
```

## 📚 Documentação da API

A documentação da API está disponível em `/api` quando o servidor estiver rodando.

## 🧪 Testes

```bash
# Testes unitários
yarn test

# Testes e2e
yarn test:e2e

# Cobertura de testes
yarn test:cov
```

## 📝 Endpoints

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /users/register` - Registro de usuário

### Despesas
- `POST /expenses` - Criar despesa
- `GET /expenses` - Listar despesas (com filtros)
- `GET /expenses/:id` - Buscar despesa por ID
- `PATCH /expenses/:id` - Atualizar despesa
- `DELETE /expenses/:id` - Excluir despesa

## 🔒 Autenticação

A API usa JWT para autenticação. Para acessar os endpoints protegidos, inclua o token no header:
```
Authorization: Bearer seu-token-jwt
```

## 📦 Estrutura do Projeto

```
src/
├── auth/           # Autenticação e autorização
├── expenses/       # Módulo de despesas
├── users/          # Módulo de usuários
├── prisma/         # Configuração do Prisma
└── app.module.ts   # Módulo principal
```

## 📄 Licença

Este projeto está sob a licença MIT.
