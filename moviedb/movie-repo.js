"use strict";

var Promise = require("bluebird");
var db = require("./db");
var util = require('./db-util');

//All functions return a bluebird promise for their results

module.exports = {
    //===============================QUERIES========================================

    //Returns the tag ids for a movie
    getTagIDsFor: function(movieID) {
        return db("tag_movie").pluck("tag_id").where("movie_id", movieID).then();
    },

    //Returns the person ids for actors of a movie
    getActorIDsFor: function(movieID) {
        return db("actor_movie").pluck('person_id').where('movie_id', movieID).then();
    },

    //Lists all tags
    listTags: function() {
        return db.select("id", "name as text").from("tag").then();
    },

    //Lists all ratings
    listRatings: function() {
        return db.select("id", "name as text").from("rating").then();
    },

    //Returns a movie object for the given movieID
    getMovie: function(movieID) {
        return db("movie as m")
            .join("person as p", "p.id", "m.director_id")
            .select("m.*", "p.name as director")
            .where("m.id", movieID)
            .first().then();
    },

    //Lists the tags for a particular movie
    listTagsFor: function(movieID) {
        return db("tag as t")
            .select("t.id", "t.name as text")
            .joinRaw("JOIN tag_movie tm ON tm.tag_id=t.id AND tm.movie_id=?", movieID)
            .then();
    },

    //Lists the actors for a particular movie
    listActorsFor: function(movieID) {
        return db("person as p")
            .select(db.raw("p.id, p.name as text"))
            .joinRaw("JOIN actor_movie am on am.person_id=p.id AND am.movie_id=?", movieID)
            .then();
    },

    //Returns a movie object for editing purposes w/ its associated data
    get4Edit: function(movieID) {
        var pMovie = this.getMovie(movieID),
            pActors = this.listActorsFor(movieID),
            pTags = this.listTagsFor(movieID);

        return Promise.all([pMovie, pActors, pTags]).then(function(results) {
            var movie = results[0];
            movie.actors = results[1];
            movie.tags = results[2];
            return movie;
        });
    },

    //Lists movies matching the given query filter
    listMovies: function(qf) {
        var result = {},
            sort = util.parseSortString(qf.sort, "m.id"),
            pgSize = Math.min(qf.pgSize, 10),
            offset = (qf.pgNum - 1) * pgSize;

        return db("movie").count("* as total").then(function(rows) {
                result.total = rows[0].total;
            })
            .then(function() {
                return db("movie as m")
                    .select("m.id", "m.title", "m.lastplaydt", "m.score", "m.runtime",
                        "m.releaseyr", "r.name as rating")
                    .join("rating as r", "r.id", "m.rating_id")
                    .limit(pgSize).offset(offset)
                    .orderBy(sort.column, sort.direction)
                    .then();
            })
            .then(function(rows) {
                result.pgSize = pgSize;
                result.items = rows;
                return result;
            });
    },

    //===============================DELETE========================================
    //Deletes the movie with the given id
    deleteMovie: function(movieID) {
        return db("movie").where("id", movieID).del().then();
    },

    //===============================================INSERT=========================================

    //Adds the given movie-graph to the DB. Resolves to the movie's ID
    add: function(m) {
        //Pull actors/tags arrays off the movie graph
        var actors = m.actors;
        var tags = m.tags;
        delete m.actors;
        delete m.tags;

        //Ensure no ID is present for an INSERT. We want the DB to assign a new one.
        delete m.id;

        return db.transaction(function(trx) {
            return trx
                .insert(m, 'id').into("movie") //Insert movie
                .then(function(ids) {
                    m.id = ids[0]; //Set movie's id
                    actors = util.idToMMObjArr("person_id", actors, "movie_id", ids[0]); //Convert actor IDs to actor_movie objects
                    tags = util.idToMMObjArr("tag_id", tags, "movie_id", ids[0]); //Convert tag   IDs to tag_movie   objects

                    if (actors.length) { return trx.insert(actors).into("actor_movie"); } //Insert actors  
                })
                .then(function() {
                    if (tags.length) { return trx.insert(tags).into("tag_movie"); } //Insert tags
                })
                .then(function() {
                    return m.id; //Return the movie's ID
                });
        });
    },

    //===============================================UPDATE=========================================
    //Updates a movie using the given movie-graph
    update: function(m) {
        //Pull actors,tags, & id off the movie graph
        var id = m.id;
        var newActorIDs = m.actors;
        var newTagIDs = m.tags;
        delete m.actors;
        delete m.tags;
        delete m.id;

        //Will hold the actors/tags to add/delete from the movie
        var actorDelta, tagDelta;

        //Get existing actor/tag ids for the movie
        return Promise.all([this.getActorIDsFor(id), this.getTagIDsFor(id)]).then(function(results) {
                actorDelta = util.getMMDelta(newActorIDs, results[0], "person_id", "movie_id", id); //Get changes to actors
                tagDelta = util.getMMDelta(newTagIDs, results[1], "tag_id", "movie_id", id); //Get changes to tags
            })
            .then(function() {
                return db.transaction(function(trx) {
                    var work = [
                        trx("movie").where('id', id).update(m), //Update movie
                        trx("actor_movie").whereIn('person_id', actorDelta.del).andWhere('movie_id', id).del(), //Delete actors
                        trx("tag_movie").whereIn('tag_id', tagDelta.del).andWhere('movie_id', id).del(), //Delete tags
                    ];

                    if (actorDelta.add.length) { work.push(trx.insert(actorDelta.add).into("actor_movie")); } //Insert actors
                    if (tagDelta.add.length) { work.push(trx.insert(tagDelta.add).into("tag_movie")); } //Insert tags

                    return Promise.all(work); //Perform all work
                });
            });
    },
};