# :construction_worker: HeadHunter MegaK v0.1.0 backend
Application as a recruitment platform. It connects the participants of the MegaK course and potential employers. The purpose of the app is to help students find their first job as a developer.
## :bear: Resources
**Live demo:** IN PROGRESS \
**Github frontend:** https://github.com/Jutrzenka/HeadHunterG11-FR \
**Github backend:** https://github.com/Jutrzenka/HeadHunterG11-BE
## :cow: Tech Stack
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
## :guardsman: Authors:
**Group members:**
1. [Jutrzenka](https://github.com/Jutrzenka) **Jutrzenka#2251** kacperczaja1999@gmail.com
2. [iwanczakrafal](https://github.com/iwanczakrafal)
3. [madridista5](https://github.com/madridista5)
4. [Marcel998](https://github.com/Marcel998) **Marcel998#5607**
5. [marooonio](https://github.com/marooonio)
6. [NorGoz](https://github.com/NorGoz)
7. [OllaWilk](https://github.com/OllaWilk)
8. [RafalKuchta](https://github.com/RafalKuchta)

**Additional roles in the team:**
- SM: [Jutrzenka](https://github.com/Jutrzenka)
- Author of demo films: [Marcel998](https://github.com/Marcel998)

## :camel: Project structure
```
HeadHunterG11-BE/
├── public/
│   └── build
├── src/
│   ├── admin/
│   │   ├── authorization-token
│   │   ├── dto
│   │   └── schema
│   ├── auth/
│   │   ├── authorization-token
│   │   ├── dto
│   │   └── schema
│   ├── interview/
│   │   ├── dto
│   │   └── schema
│   ├── mail/
│   │   └── templates
│   ├── userData/
│   │   ├── dto
│   │   └── entities
│   └── Utils/
│       ├── config
│       ├── decorators
│       ├── function
│       └── types
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env
├── .eslintrc.js
├── .gitignore
├── .npmrc
├── .prettierrc
├── nest-cli.json
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```
## :panda_face: Environment Variables

To run this project, you will need to add the following environment variables to your .env file
```.env
SSL = true/false
SECURE = true/false
DOMAIN = your domain
PORT = your port
SALT_ROUND = 13
SECRET_OR_KEY = long hash

SERVICE_MAILER = null
HOST_MAILER = your mailer domain
PORT_MAILER = your mailer port
SECURE_MAILER = true/false
AUTH_USER_NAME_MAILER = admin
AUTH_USER_PASS_MAILER = admin
FROM_MAILER = headhunter@admin.example.com
STRICT_MAILER = true/false

DB_NOSQL = mongodb address

DB_TYPE_SQL = mysql
DB_DATABASE_SQL = head_hunter
DB_HOST_SQL = localhost
DB_PORT_SQL = 3306
DB_USERNAME_SQL = root
DB_PASSWORD_SQL = ''
```
## :dragon_face: Installation project

**Clone the project:**
```
git clone https://github.com/Jutrzenka/HeadHunterG11-BE.git
```
**Go to the project directory:**
```
cd HeadHunterG11-BE
```
**Install dependencies:**
```
npm install
```
**Start the server:**
```
npm start
```
## :racehorse: Endpoints available
Insomnia V4 template: `https://drive.google.com/file/d/14bLvYNFqQ_gnsD6XyitEMOubZxVNPMRD/view?usp=sharing`
