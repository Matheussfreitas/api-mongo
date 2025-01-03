# Api_MongoDB

## Funcionalidades

- O usuário pode criar qualquer entidade
- A API possui as rotas GET, POST, PUT e DELETE
- O usuário pode definir uma paginação e projeção nas rotas

## Requisitos

- [x] Rota POST para cadastrar uma entidade qualquer
- [x] Rota GET para listar todas as entidades 
- [x] Rota GET para listar um elemento pelo ID
- [x] Rota GET para buscar itens de forma paginada
- [x] Rota PUT para atualizar dados de um determinado item
- [x] As rotas devem permitir projeção
- [x] Cada entidade deve ser armazenada em coleções diferentes
- [x] O usuário da API pode criar qualquer entidade

## Como usar
Inicie o servidor usando:
```
yarn dev
```
Utilize o seguinte Endpoint local para realizar suas requisições:
```
http://localhost:3001/
```

## Exemplos de uso

### Criação de uma entidade

```
{
    "name": "User",
    "fields": {
        "name": { "type": "string", "required": true },
        "email": { "type": "string", "required": true, "unique": true },
        "age": { "type": "number" }
    }
}
```
### Criação de um documento

```
{
    "name": "João Silva",
    "email": "joao.silva@example.com",
    "age": 30
}
```

## Exemplo de rotas

### Rota com paginação e projeção

Requisição:
```
GET /users?page=2&limit=5&fields=name,email
```
Resposta:
```
{
    "totalDocuments": 25,
    "currentPage": 2,
    "totalPages": 5,
    "items": [
        { "name": "João", "email": "joao@example.com" },
        { "name": "Maria", "email": "maria@example.com" },
        { "name": "Carlos", "email": "carlos@example.com" },
        { "name": "Ana", "email": "ana@example.com" },
        { "name": "Paulo", "email": "paulo@example.com" }
    ]
}
```