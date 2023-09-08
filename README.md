# Teste Técnico Shopper
Teste técnico referente a vaga Desenvolvedor Full Stack Júnior

# Como rodar Projeto

### Via Docker

- Necessário Docker e docker-compose
- Criar arquivo .env na pasta backend seguindo o exemplo _env
- Exemplo:
<pre>
PORT=8080
MYSQL_DB=shopper
MYSQL_USER=admin
MYSQL_PASSWORD=admin
MYSQL_HOST=mysql
#MYSQL_HOST=127.0.0.1 MYSQL rodando localmente
</pre>
- O arquivo .env deve ser exatamente o mesmo que informado acima
- Executar comando docker-compose up --build
- Frontend - http://localhost:5173
- Backend - http://localhost:8080
- MySQL - Porta: 3306



### Vida Node e NPM

- Necessário node e npm
- Criar arquivo .env na pasta backend seguindo o exemplo _env
- IMPORTANTE verificar as credenciais de sua instância mysql em sua máquina
- Exemplo:
<pre>
PORT=8080
MYSQL_DB=shopper
MYSQL_USER=admin
MYSQL_PASSWORD=admin
MYSQL_HOST=127.0.0.1
</pre>
- Acessar via terminal pasta backend e executar comandos "npm install" e "npm start"
- Acessar via terminal pasta frontend e executar comandos "npm install" e "npm start"
- Observação: É necessário que tenha uma instância MySQL rodando em sua máquina ou em algum servidor externo para que a aplicação possa se conectar

# Observação

- Ao iniciar o projeto os dados serão resetados para o estado inicial como no arquivo database.sql

# Preview 
![Screenshot_1](https://github.com/PedroBSanchez/teste_shopper/assets/68929967/40d6da29-b38b-473b-a4fa-1f14ed839b08)


