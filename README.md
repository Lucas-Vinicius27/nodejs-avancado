# nodejs-avancado
Curso de nodejs avançado com TDD, TypeScript, Clean Architecture, TypeORM e integração com APIs de terceiros.

## comandos husky
Rodar os comandos no terminal:
```bash
yarn run prepare
```
```bash
npx husky add .husky/pre-commit "npx lint-staged"
```
```bash
npx husky add .husky/pre-push "yarn run test:coverage"
```
Apenas uma vez ao iniciar o projeto se não existir os arquivos.
