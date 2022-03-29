


function run(connection,data){
  connection.query(data,function(err,results,fields){
    if(err){
      throw err;
    }
  });
}

module.exports = run;
