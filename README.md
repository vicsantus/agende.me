# Seja Bem-Vindo(a) ao repositório do projeto Agende-me

Agende-me é um projeto de agendamento para profissionais de todos os tipos, que trabalham com agendamentos de algum tipo, e utilizam ferramentas que não são feitas para isso como whatsapp e email para marcar um agendamento. Ele permite que os usuários façam login, cadastrem-se, adicionem e removam um agendamento, e realizem buscas por profissionais. Além disso, a pessoa prestadora de serviços tem a capacidade remover seus agendamentos.


## Funcionalidades Principais
- Autenticação de usuários: Os usuários podem fazer login para acessar o aplicativo.
- Cadastro de usuário: Os usuários podem se cadastrar fornecendo informações básicas.
- Realização de agendamentos: Os usuários podem ver, deletar e adicionar agendamentos nos perfis dos prestadores de serviços (esses sendo pessoas que trabalham prestando algum serviço que precise de agendamento, como motoristas particulares, entregadores/frete, no caso que gerou esse projeto, taróloga, entre outros).
- Busca de profissionais: Os usuários podem buscar por profissionais conforme seu nome, email, tags e conteúdo do profile.

## Tecnologias Utilizadas

- React Native
- Context API
- Node.js
- Express
- Sequelize
- MySQL
- JWT
- Eslint
- Docker
- Redis
- Swagger
- BullMQ

## Configuração do Ambiente de Desenvolvimento local

- Obs.1: Para rodar o projeto localmente é necessário ter android studio e instalar a extensão adb.
- Obs.2: Também se faz necessário ter instalado no computador o docker e o docker compose para o funcionamento do backend e as portas 9393, 8081, 3306 e 6379 estejam livres.
- Obs.3: Ultimo ponto é que se faz necessário ter node.js instalado para os comandos npm, e os comandos utilizados são comandos linux, para rodar no windows, seria necessário entender o que os comandos fazem, e fazer o mesmo, porém no windows.

1. Clone este repositório: ```git clone git@github.com:vicsantus/agende.me.git```
2. Navegue até o diretório do projeto: ```cd agende.me```
3. Configure os arquivos .env na raiz do projeto, dentro de api e dentro de agende_me:
 - Dentro de agende_me, no arquivo env.js, nesse arquivo existe uma variável de ambiente chamada BASE_URL, essa env é o ip do seu backend que, localmente, está no seu computador na sua rede local, então para rodar o projeto, você deve executar o comando ```hostname -I``` no linux, copiar o primeiro ip que aparece, e colar no env.js onde está escrito IP-DO-SEU-BACKEND no env.example.js, e em seguida renomear env.example.js para env.js;
 - Dentro da pasta api, existe o arquivo .env.example, copie e cole ele renomeando-o para .env.
 - Na raiz do projeto, existe o arquivo .env.local, copie e cole ele renomeando-o para .env.
4. Instale as dependências: ```cd api && npm install && cd .. && cd agende_me && npm install && cd ..```
5. Inicialize o container: ```docker-compose up -d```
6. Inicialize o fron-end: ```cd agende_me` e `npm start```

## Contribuição

Contribuições são bem-vindas! Se você deseja contribuir com o projeto, siga as etapas abaixo:

1. Fork este repositório.
2. Crie um branch com sua nova funcionalidade ou correção de bug: `git checkout -b minha-funcionalidade`.
3. Faça commit das suas alterações: `git commit -m 'feat: Adiciona nova funcionalidade'`.
4. Faça push para o branch: `git push origin feature/minha-funcionalidade`.
5. Envie um pull request.

## Licença

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Developers

- <a href = "https://github.com/vicsantus">Victor Santos</a>

## Agradecimentos
Agradeço a Universidade Estácio de Sá, pela oportunidade de apresentação do projeto, e agradeço a <a href = "https://www.linkedin.com/in/alinefgn/">Aline Nascimento</a> por disponibilizar seu tempo para entender suas necessidades, e ajuda-la resultando nesse projeto. Obrigado ♥️!

## Contato

Se tiver alguma dúvida ou sugestão sobre o projeto, entre em contato com <a href = "mailto:victor.santos.fk@hotmail.com">victor.santos.fk@hotmail.com</a>

