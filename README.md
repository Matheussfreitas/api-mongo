# Api_MongoDB

- [x] Rota POST para cadastrar uma entidade qualquer
- [x] Rota GET para listar todas as entidades 
- [x] Rota GET para listar um elemento pelo ID
- [x] Rota GET para buscar itens de forma paginada
- [x] Rota PUT para atualizar dados de um determinado item
- [] As rotas devem permitir projeção
- [] Cada entidade deve ser armazenada em coleções diferentes
- [] O usuário da API pode criar qualquer entidade


### Exemplo de requisição

```
{
    "name": "User",
    "fields": {
        "name": { "type": "string", "required": true },
        "email": { "type": "string", "required": true, "unique": true },
        "age": { "type": number }
    }
}
```