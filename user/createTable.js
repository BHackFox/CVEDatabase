

async function run(connection){
  //await dumpTABLES(connection);
  //await dumpTABLE(connection,"Tags");
  //await dumpTRIGGERS(connection);
  let triggers = [
    `CREATE TRIGGER updateOSTimeUsed
      AFTER INSERT ON HasTags
      FOR EACH ROW
        UPDATE OSTags SET TimesUsed = TimesUsed + 1 WHERE (SELECT Tags.TagOS FROM Tags,HasTags WHERE new.TagName = Tags.TagName) = OSTags.OSName`,

    `CREATE TRIGGER UpdateUserJoin
      AFTER INSERT ON UserJoinGroup
      FOR EACH ROW
        UPDATE InviteInGroup SET Used = 1 WHERE InviteInGroup.Username = new.Username`
  ]
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
    TimeCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)`,

    `CREATE TABLE IF NOT EXISTS Tags(
      id INT PRIMARY KEY AUTO_INCREMENT,
      TagName VARCHAR(30) NOT NULL,
      TagDescription VARCHAR(30) NOT NULL,
      TagOS VARCHAR(30),
      TagLanguage VARCHAR(30),
      TagType VARCHAR(30),
      TagTimeCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,

    `CREATE TABLE IF NOT EXISTS HasTags(
      id INT PRIMARY KEY AUTO_INCREMENT,
      TagName VARCHAR(30) NOT NULL,
      CVEName VARCHAR(30) NOT NULL,
      Username VARCHAR(30) NOT NULL,
      TagTimeUsed TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS OSTag(
      id INT PRIMARY KEY AUTO_INCREMENT,
      OSName VARCHAR(30) NOT NULL,
      OSDescription TEXT NOT NULL,
      TimesUsed INT DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS LanguageTag(
      id INT PRIMARY KEY AUTO_INCREMENT,
      LanguageName VARCHAR(30) NOT NULL,
      LanguageDescription TEXT NOT NULL,
      TimesUsed INT DEFAULT 0
    )`
    ];
    //await createTABLE(connection,createTABLES[6]);
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

function createTABLE(connection,table){
  new Promise((resolve,reject)=>{
    connection.query(table,function(err,results,fields){
      if(err){
        throw err;
      }
    });
  })
}
function dumpTABLES(connection) {
  new Promise((resolve, reject) =>{
    connection.query(`DROP TABLE Users, CVE, Grps,InviteInGroup,UserJoinGroup`,function(err,results,fields){
      if (err) {
        throw err;
      }
      return resolve(true);
    });
  })
  new Promise((resolve, reject) =>{
    connection.query(`DROP TRIGGER updateOSTimeUsed, UpdateUserJoin`,function(err,results,fields){
      if (err) {
        throw err;
      }
      return resolve(true);
    });
  })
}

function dumpTABLE(connection,table) {
  new Promise((resolve, reject) =>{
    connection.query(`DROP TABLE ${table}`,function(err,results,fields){
      if (err) {
        throw err;
      }
      return resolve(true);
    });
  });
}

function dumpTRIGGERS(connection) {
  new Promise((resolve, reject) =>{
    connection.query(`DROP TRIGGER updateOSTimeUsed`,function(err,results,fields){
      if (err) {
        throw err;
      }
      return resolve(true);
    });
  })
}
module.exports = run;
