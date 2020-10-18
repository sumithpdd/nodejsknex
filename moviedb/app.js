"use strict";

var db = require("./db");
var screen = require("./screen");
var mRepo = require("./movie-repo");
var pRepo = require("./person-repo");

screen.clear();

// mRepo.listRatings().then(function(result) {
//     screen.write(result, "pretty");
// }).catch(function(err) {
//     console.error(err);
// }).finally(function() {
//     db.destroy();
// });

// mRepo.listTags().then(function(result) {
//     screen.write(result, "pretty");
// }).catch(function(err) {
//     console.error(err);
// }).finally(function() {
//     db.destroy();
// });
// pRepo.listPeople('ca').then(function(result) {
//     screen.write(result, "pretty");
// }).catch(function(err) {
//     console.error(err);
// }).finally(function() {
//     db.destroy();
// });

// mRepo.getMovie(2).then(function(result) {
//     screen.write(result, "pretty");
// }).catch(function(err) {
//     console.error(err);
// }).finally(function() {
//     db.destroy();
// });
var qf = {
    pgNum: 1,
    pgSize: 2,
    sort: "title"
};

var edward = { firstname: "Edward", lastname: "Zwick", name: "Edward Zwick" }; //42
var movie = {
    id: 9, //Update movie
    rating_id: 4, //R
    director_id: 42, //Edward Zwick
    actors: [16, 42], //Ken Watanabe, Edward Zwick
    tags: [12, 7], //Martial Arts, Drama
    title: "The Last Sumurai !!!",
    releaseyr: 2003,
    score: 10,
    runtime: 154,
    lastplaydt: "2015-10-20",
    overview: "An American military adviser embraces the Samurai culture he was hired to destroy after he is captured in battle."
};
screen.clear();

// mRepo.get4Edit(2).then(function(result) {
//         screen.write(result, "json");
//     })
//     .catch(function(err) {
//         console.error(err);
//     })
//     .finally(function() {
//         db.destroy();
//     });

// pRepo.add(edward).then(function(result) {
//         screen.write(result, "json");
//     })
//     .catch(function(err) {
//         console.error(err);
//     })
//     .finally(function() {
//         db.destroy();
//     });

// mRepo.add(movie).then(function(result) {
//         screen.write(result, "json");
//     })
//     .catch(function(err) {
//         console.error(err);
//     })
//     .finally(function() {
//         db.destroy();
//     });

mRepo.get4Edit(9).then(function(result) {
        screen.write(result, "json");
    })
    .catch(function(err) {
        console.error(err);
    })
    .finally(function() {
        db.destroy();
    });