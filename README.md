# Endurance Strategy Reporter (server)

Endurance Strategy Reporter brings detailed post-race analysis straight to your
fingertips.

For more details, checkout the [main repository](https://github.com/aseehra/endurance-strategy).

## Installation
### Requirements
- PostgreSQL
- Express
- Node.js

### Instructions
1. Clone repository and run
```bash
$ yarn
```
2. Create a new database and update `/knexfile.js` with the URI for the database.

3. Use knex.js to set up database tables:
```bash
$ npx knex [--env production] migrate:latest
```
4. To seed the database, use knex.js's seed function:
```bash
$ npx knex [--env production] seed:run
```
5. Launch the server
```bash
$ node src/index.js
```

### Notes
The number of rows used by ESR to store a race will exhaust a Heroku Hobby
PostgreSQL plan.
