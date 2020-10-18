var cfg = require('./knex-cfg').sqlite;
var screen = require('./screen');
var knex = require("knex")(cfg);

var query = knex
    .select("title", 'rating')
    .from("book");
var sql = query.toSQL();
screen.write(sql);

query.then(rows => {
        screen.write(rows, 'pretty');
        return rows;
    })
    .catch(error => console.log(error));
// knex.destroy();
console.log("Working!!!");