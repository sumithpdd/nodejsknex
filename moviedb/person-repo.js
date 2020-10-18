"use strict";

var Promise = require("bluebird");
var db      = require("./db");

//All functions return a bluebird promise for their results

module.exports = 
{
	//Lists all people matching the given search text
	listPeople: function(searchTxt)
	{
		return db("person")
				.whereRaw("LOWER(name) like '%' || LOWER(?) || '%'", searchTxt)
				.select("id", "name as text")
				.orderBy("name")
				.then();
	},
	
	//Inserts the given person object and resolves to its ID
    add: function (person)
    {
		return db("person").insert(person, "id").then();
    },
	
};