# Busca pra mim - API

## Sumário

* [Configurando ambiente de desenvolvimento](#configurando-o-ambiente-de-desenvolvimento)
  * [Docker](#docker)
* [Documentação da API](#documentação-da-api)


## Configurando o ambiente de desenvolvimento


### Docker

Inicie a construção dos containers necessários utilizando o docker-compose

```bash
docker-compose up --d --build --force-recreate
``` 

A imagem base para o Node será construída caso não exista.
Após a construção dos containers, abra uma sessão do terminal dentro do container do node com o comando

```bash
docker-compose exec node sh
```

Você será levado para uma sessão do terminal dentro do container.

Instale as dependências do projeto

```bash
yarn install
```

Ou ainda

```bash
npm install
```

Copie o arquivo .env.example para .env na raíz do projeto. O arquivo .env.example esta pronto para ser utilizado 
com os containers do Docker.

Modifique os valores de acordo com a necessidade da sua instalação.

Execute as migrations do banco de dados:

```bash
knex migrate:latest
```

Execute o seeder do primeiro usuario do sistema:

```bash
knex seed:run
```

#### Iniciando o servidor de desenvolvimento

Para iniciar o servidor de desenvolvimento com o Docker, basta abrir uma nova sessão do terminal na sua máquina e digitar:

```bash
docker-compose exec node npm run dev
```

E após a inicialização a API estará disponível em http://localhost:3333/ (ou a porta especificada em API_PORT no seu .env)

## Documentação da API

Para acessar a documentação da API, basta acessar: http://localhost:3333/api-docs (ou a porta especificada em API_PORT no seu .env).

Para documentar uma função de uma rota, gere o bloco de documentação. Exemplo:

```javascript
/**
 * @route POST /forgot_password
 * @group user - Operações para usuários
 * @param {string} email.body.required - E-mail do usuário - Exemplo: a@a.com.br
 * @type {{create(*, *): Promise<*|undefined>}}
 * @returns {object} 400 - Um erro ao tentar enviar o email.
 * @returns {object} 204 - O email foi enviado.
 * @returns {object} 200 - Ocorreu um erro ao tentar redefinir a senha.
 */
module.exports = {
  async create(request, response) {}
}
```

Cada bloco de documentação deve conter os parametros da requisição. 

Se os parametros vem na query string, por exemplo em uma requisição GET, insira:

@param {string} email.query.required

Documente todos os retornos que a função realizar.
