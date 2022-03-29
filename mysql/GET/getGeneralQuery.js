
function get_info(connection,data,callback){
  return new Promise((resolve, reject) =>{
    connection.query(data,function(err,results){
      if(err){
        throw err;
      }
      return resolve(results);
    })
  })
}

async function run(connection,data){
  var user = await get_info(connection,data);
  return user;

}

module.exports = run;
