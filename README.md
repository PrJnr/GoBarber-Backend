# GoBarber-Backend
App de Agendamento de serviço para Barbearia desenvolvido utilizando Node.js + Express no Backend;

### Instalando e Executando
`git clone https://github.com/PrJnr/GoBarber-Backend.git`

Instalando as Depêndencias:
`Yarn` ou `Npm install`

Executando o Projeto:
`yarn dev` ou `npm run dev`

## Ferramentas Utilizadas

* NodeJS
* ExpressJS
* Nodemon
* ESLint
* Prettier
* Multer
* JWT
* Sucrase
* Nodemailer
* Sequelize
* Postgres
* MongoDB
* Redis
* Yup
* Youch
* Docker

## Instalação do Docker e Clone do Repositório no DockerHub

* Instalação:
> https://docs.docker.com/toolbox/toolbox_install_windows/ -> Windows

> https://docs.docker.com/docker-for-mac/install/ -> MAC

> https://docs.docker.com/install/linux/docker-ce/ubuntu/ -> Linux(v. Ubuntu)

* Clonando meu Repositório do Docker Hub:

No terminal Docker(Quickstart Terminal no Windows) execute:

-Postgress:
`docker pull pauloricardojnr/gobarber:postgress `

-MongoDB:
 `docker pull pauloricardojnr/gobarber:mongo `

 Postgress utilizado para tabelas relacionais, e MongoDB para as notificações do app.


* Iniciando os Containers:

Postgress:
`docker start database`

Mongo:
`docker start mongobarber`


