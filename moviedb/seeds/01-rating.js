exports.seed = function(knex, Promise) 
{
  var tblName = 'rating';

  var rows =
  [
      {name: 'G'    },  //1
      {name: 'PG'   },  //2
      {name: 'PG-13'},  //3
      {name: 'R'    },  //4
  ];
        
        
  return knex(tblName)
		.del()                                      //Remove all rows from table
		.then(function()
		{
			return knex.insert(rows).into(tblName);   //Insert new rows
		});
};