## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
----

## Live Demo
[https://lief-pomodoro.vercel.app/](https://lief-pomodoro.vercel.app/)

---


## Screen Shots
---
<img src="pics/1.png" width="200">
<img src="pics/2.png" width="200">
<img src="pics/3.png" width="200">
<img src="pics/4.png" width="200">
<img src="pics/5.png" width="200">
<img src="pics/6.png" width="200">
<img src="pics/7.png" width="200">
<img src="pics/8.png" width="200">

## Features Implemented
---
- Task Management
- Pomodoro Timer
- User Authentication (Auth0)
- Grommet UI/UX
- Analytics Dashboard
---

## Folder Structure
```
.
├── graphql/
│   └── resolvers.ts <== Graphql resolvers
├── lib/
│   ├── apollo.ts <== Graphql Client Configuration
│   └── prisma.ts <== Prisma Singleton
├── prisma/
│   └── schema.prisma <== All schemas
└── src/
    ├── pages/
    │   └── api/
    │       ├── auth <== auth0 endpoint
    │       └── graphql <== Graphql endpoint
    ├── components/ <== All Components
    └── context/ <== All Contexts
```
---
## ER Diagram
![ER Diagram](pics/prisma-erd.svg)

---
## Tech Stack
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Gormmet UI](https://img.shields.io/badge/grommet-%237D4CDB.svg?style=for-the-badge&logo=grommet&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)
![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)
![Type-graphql](https://img.shields.io/badge/-TypeGraphQL-%23C04392?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PlanetScale](https://img.shields.io/badge/planetscale-%23000000.svg?style=for-the-badge&logo=planetscale&logoColor=white)
![Auth0](https://img.shields.io/badge/Auth0-EB5424?style=for-the-badge&logo=auth0&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=for-the-badge&logo=Vercel&logoColor=white)

---