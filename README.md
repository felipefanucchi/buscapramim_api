# Busca pra mim - API


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

#### Iniciando o servidor de desenvolvimento

Para iniciar o servidor de desenvolvimento com o Docker, basta abrir uma nova sessão do terminal na sua máquina e digitar:

```bash
docker-compose exec node npm run dev
```

E após a inicialização a API estará disponível em http://localhost:3333/ (ou a porta especificada em API_PORT no seu .env)
