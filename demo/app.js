var cfg = require("./knex-cfg").sqlite;
var screen = require("./screen");
var knex = require("knex")(cfg);
var Treeize = require("treeize");

screen.clear();

// var query = knex("book").column("title", "rating").limit(2);
// run(query, "pretty");
var query = knex("book")
    .join("author", "author.id", "=", 'book.author_id')
    .select(
        "author.firstname", "author.lastname",
        "book.title as book:title", "book.rating as book:rating", "book.id as book:id"
    ).where("author.id", 1).then(function(rows) {
        var tree = new Treeize();
        tree.grow(rows);
        var authors = tree.getData();
        screen.write(authors[0], "json");
        screen.write(rows, "json");
    })
    .catch(function(err) {
        screen.write("Oops");
        screen.write(err);
    })
    .finally(function() {
        knex.destroy();
    });

;
// run(query, "pretty");

function run(knexQuery, mode) {
    return knexQuery.then(function(rows) {
            screen.write(rows, mode);
        })
        .catch(function(err) {
            screen.write("Oops");
            screen.write(err);
        })
        .finally(function() {
            knex.destroy();
        });
}