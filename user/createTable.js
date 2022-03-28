

function run(connection){
  let createTodos = "CREATE TABLE IF NOT EXISTS Users(id INT PRIMARY KEY AUTO_INCREMENT, Username VARCHAR(30) NOT NULL, Email VARCHAR(30) NOT NULL, Password VARCHAR(30) NOT NULL)";
  connection.query(createTodos,function(err,results,fields){
    if(err){
      throw err;
    }
  });
}

module.exports = run;
