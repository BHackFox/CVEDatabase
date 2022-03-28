
function run(connection,data){
  let insert = `INSERT INTO Users(Username,Email,Password) VALUES("${data.Username}","${data.Email}","${data.Password}")`;
  connection.query(insert,function(err,results,fields){
    if(err){
      throw err;
    }
  });
}

module.exports = run;
