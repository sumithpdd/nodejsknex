# Movie database using KNEX

## Instructions

Assuming you have installed Node.js, you can install the dependencies for this demo by entering the moviedb folder and running:

> npm install

and then installing knex globally:
> npm i knex sqlite3 bluebird prettyjson
> npm install knex -g
> npm i mysql
You can then run the migration or seed files by using the knex CLI.
> knex migrate:latest
> knex migrate:latest --env production
> knex seed:make 01.rating
> knex seed:run --env production