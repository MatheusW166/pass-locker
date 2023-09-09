[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/MatheusW166/pass-locker-backend/blob/main/LICENSE)

# Pass Locker

## Sobre

Pass Locker é uma aplicação para guardar dados sensíveis de vários tipos, como senhas de wifi, credenciais de acesso, dados de cartão de crédito e anotações.

## Documentação da API

Acesse a documentação [aqui](https://pass-locker.onrender.com/api).

## Features

- Login
- Cadastro
- Autenticação com JWT
- Criptografia de senhas
- Requer senha mestra para visualização de informações

## Stack

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white) ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

## Como utilizar

Pré requisitos: é necessário ter instalado o postgresql, nestjs/cli e nodejs na última versão.

- Clonar repositório

```bash
git clone https://github.com/MatheusW166/postify-backend.git
```
- Instalar dependências
```bash
npm install
```
- Configurar .env.development e .env.test, seguindo o exemplo em [.env.example](https://github.com/MatheusW166/pass-locker-backend/blob/main/.env.example)
- Migrar base de dados de desenvolvimento
```bash
npm run dev:migrate
```
- Migrar base de dados de teste
```bash
npm run test:migrate
```
- Rodar testes de integração
```bash
npm run test:e2e
```
- Rodar em modo de desenvolvimento
```bash
npm run start:dev
```
Divirta-se! 😁
