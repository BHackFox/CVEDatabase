

async function run(connection){
  await dumpTABLES(connection);
  let createTABLES = [
    `CREATE TABLE IF NOT EXISTS Users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(30) NOT NULL,
    Email VARCHAR(30) NOT NULL,
    Password VARCHAR(30) NOT NULL,
    Name VARCHAR(30),
    Surname VARCHAR(30),
    TimeAccount TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)`,


    `CREATE TABLE IF NOT EXISTS Grps(
    id INT PRIMARY KEY AUTO_INCREMENT,
    GroupName VARCHAR(30) NOT NULL,
    GroupDescription TEXT,
    GroupTimeCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)`,


    `CREATE TABLE IF NOT EXISTS UserJoinGroup(
      id INT PRIMARY KEY AUTO_INCREMENT,
      Username VARCHAR(30) NOT NULL,
      GroupName VARCHAR(30) NOT NULL,
      UserRole VARCHAR(30) NOT NULL,
      UserTimeJoin TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,


    `CREATE TABLE IF NOT EXISTS InviteInGroup(
      id INT PRIMARY KEY AUTO_INCREMENT,
      Username VARCHAR(30) NOT NULL,
      GroupName VARCHAR(30) NOT NULL,
      InviteMember VARCHAR(30) NOT NULL,
      UrlInvite VARCHAR(60) NOT NULL,
      UserRole VARCHAR(30) NOT NULL,
      Used BOOLEAN DEFAULT FALSE,
      UserTimeJoin TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,

    `CREATE TABLE IF NOT EXISTS CVE(
    id INT PRIMARY KEY AUTO_INCREMENT,
    CVEName VARCHAR(30) NOT NULL,
    CVETitle VARCHAR(64) NOT NULL,
    CVEDescription TEXT NOT NULL,
    CVEUserCreate VARCHAR(30) NOT NULL,
    CVEZeroDay TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CVELinks TEXT,
    CVENote TEXT,
    CVEConfermation BOOLEAN DEFAULT FALSE,
    TimeCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)`
    ];
    for (var i = 0; i < createTABLES.length; i++) {
      new Promise((resolve,reject)=>{
        connection.query(createTABLES[i],function(err,results,fields){
          if(err){
            throw err;
          }
        });
      })
    }
}


function dumpTABLES(connection) {
  return new Promise((resolve, reject) =>{
    connection.query(`DROP TABLE Users, CVE, Grps,InviteInGroup,UserJoinGroup`,function(err,results,fields){
      if (err) {
        throw err;
      }
      return resolve(true);
    });
  })
}

module.exports = run;
