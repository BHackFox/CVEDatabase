DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS Users(
  id INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(30) NOT NULL,
  Email VARCHAR(60) NOT NULL,
  Password VARCHAR(30) NOT NULL,
  TimeAccount TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DROP TABLE IF EXISTS Grps;

CREATE TABLE IF NOT EXISTS Grps(
  id INT PRIMARY KEY AUTO_INCREMENT,
  GroupName VARCHAR(30) NOT NULL,
  GroupDescription TEXT,
  GroupTimeCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DROP TABLE IF EXISTS UserJoinGroup;

CREATE TABLE IF NOT EXISTS UserJoinGroup(
  id INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(30) NOT NULL,
  GroupName VARCHAR(30) NOT NULL,
  UserRole VARCHAR(30) NOT NULL,
  UserTimeJoin TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DROP TABLE IF EXISTS InviteInGroup;

CREATE TABLE IF NOT EXISTS InviteInGroup(
  id INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(30) NOT NULL,
  GroupName VARCHAR(30) NOT NULL,
  InviteMember VARCHAR(30) NOT NULL,
  UrlInvite VARCHAR(60) NOT NULL,
  UserRole VARCHAR(30) NOT NULL,
  Used BOOLEAN DEFAULT FALSE,
  UserTimeJoin TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DROP TABLE IF EXISTS CVE;

CREATE TABLE IF NOT EXISTS CVE(
  id INT PRIMARY KEY AUTO_INCREMENT,
  CVEName VARCHAR(30) NOT NULL,
  CVETitle VARCHAR(64) NOT NULL,
  CVEDescription TEXT NOT NULL,
  CVEUserCreate VARCHAR(30) NOT NULL,
  CVEConfermation BOOLEAN DEFAULT FALSE,
  TimeCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DROP TABLE IF EXISTS Tags;

CREATE TABLE IF NOT EXISTS Tags(
  id INT PRIMARY KEY AUTO_INCREMENT,
  TagName VARCHAR(30) NOT NULL,
  TagDescription TEXT NOT NULL,
  TagOS VARCHAR(30),
  TagLanguage VARCHAR(30),
  TagType VARCHAR(30),
  TagTimeCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DROP TABLE IF EXISTS HasTags;

CREATE TABLE IF NOT EXISTS HasTags(
  id INT PRIMARY KEY AUTO_INCREMENT,
  TagName VARCHAR(30) NOT NULL,
  CVEName VARCHAR(30) NOT NULL,
  Username VARCHAR(30) NOT NULL,
  TagTimeUsed TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DROP TABLE IF EXISTS OSTag;

CREATE TABLE IF NOT EXISTS OSTag(
  id INT PRIMARY KEY AUTO_INCREMENT,
  OSName VARCHAR(30) NOT NULL,
  OSDescription TEXT NOT NULL
);

INSERT INTO OSTag(OSName,OSDescription) VALUES("Linux","Linux is a family of open-source Unix-like operating systems based on the Linux kernel, an operating system kernel first released on September 17, 1991, by Linus Torvalds. Linux is typically packaged in a Linux distribution.");
INSERT INTO OSTag(OSName,OSDescription) VALUES("Windows","Microsoft Windows, also called Windows and Windows OS, computer operating system (OS) developed by Microsoft Corporation to run personal computers (PCs). Featuring the first graphical user interface (GUI) for IBM-compatible PCs, the Windows OS soon dominated the PC market. Approximately 90 percent of PCs run some version of Windows.");
INSERT INTO OSTag(OSName,OSDescription) VALUES("MacOS","MacOS is a Unix operating system developed and marketed by Apple Inc. since 2001. It is the primary operating system for Apple's Mac computers. Within the market of desktop and laptop computers it is the second most widely used desktop OS, after Microsoft Windows and ahead of Chrome OS.");


DROP TABLE IF EXISTS LanguageTag;

CREATE TABLE IF NOT EXISTS LanguageTag(
  id INT PRIMARY KEY AUTO_INCREMENT,
  LanguageName VARCHAR(30) NOT NULL,
  LanguageDescription TEXT NOT NULL
);

INSERT INTO LanguageTag(LanguageName,LanguageDescription) VALUES("Javascript","Javascript, often abbreviated JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. Over 97% of websites use JavaScript on the client side for web page behavior, often incorporating third-party libraries. All major web browsers have a dedicated JavaScript engine to execute the code on users' devices.");
INSERT INTO LanguageTag(LanguageName,LanguageDescription) VALUES("Python","Python is a high-level, interpreted, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation.");
INSERT INTO LanguageTag(LanguageName,LanguageDescription) VALUES("Java","Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible. It is a general-purpose programming language intended to let programmers write once, run anywhere (WORA), meaning that compiled Java code can run on all platforms that support Java without the need to recompile. Java applications are typically compiled to bytecode that can run on any Java virtual machine (JVM) regardless of the underlying computer architecture.");
INSERT INTO LanguageTag(LanguageName,LanguageDescription) VALUES("C","C is a general-purpose computer programming language. It was created in the 1970s by Dennis Ritchie, and remains very widely used and influential. By design, C's features cleanly reflect the capabilities of the targeted CPUs. It has found lasting use in operating systems, device drivers, protocol stacks, though decreasingly for application software, and is common in computer architectures that range from the largest supercomputers to the smallest microcontrollers and embedded systems.");
INSERT INTO LanguageTag(LanguageName,LanguageDescription) VALUES("PHP","PHP is a general-purpose scripting language geared toward web development. It was originally created by Danish-Canadian programmer Rasmus Lerdorf in 1994. The PHP reference implementation is now produced by The PHP Group. PHP originally stood for Personal Home Page, but it now stands for the recursive initialism PHP: Hypertext Preprocessor.");
INSERT INTO LanguageTag(LanguageName,LanguageDescription) VALUES("Go","Go is a statically typed, compiled programming language designed at Google by Robert Griesemer, Rob Pike, and Ken Thompson. It is syntactically similar to C, but with memory safety, garbage collection, structural typing, and CSP-style concurrency. It is often referred to as Golang because of its former domain name, golang.org, but its proper name is Go.");
INSERT INTO LanguageTag(LanguageName,LanguageDescription) VALUES("Haskell","Haskell is a general-purpose, statically-typed, purely functional programming language with type inference and lazy evaluation. Designed for teaching, research and industrial application, Haskell has pioneered a number of programming language features such as type classes, which enable type-safe operator overloading. Haskell's main implementation is the Glasgow Haskell Compiler (GHC). It is named after logician Haskell Curry.");


DROP TABLE IF EXISTS GroupEvents;

CREATE TABLE IF NOT EXISTS GroupEvents(
  id INT PRIMARY KEY AUTO_INCREMENT,
  EventType VARCHAR(30) NOT NULL,
  EventDescription VARCHAR(30) NOT NULL,
  EventUser VARCHAR(30) NOT NULL,
  EventTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DROP TABLE IF EXISTS Persona;

CREATE TABLE IF NOT EXISTS Persona(
  id INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(30) NOT NULL,
  Name VARCHAR(40),
  Surname VARCHAR(40),
  Mobile VARCHAR(20),
  Country VARCHAR(30),
  City VARCHAR(60),
  Address VARCHAR(60),
  Zip INT(6),
  Passport VARCHAR(40),
  LastEdit TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DROP TABLE IF EXISTS UserLite;

CREATE TABLE IF NOT EXISTS UserLite(
  id INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(30) NOT NULL,
  TimeAccount TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DROP TABLE IF EXISTS UserPremium;

CREATE TABLE IF NOT EXISTS UserPremium(
  id INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(30) NOT NULL,
  Card VARCHAR(30) NOT NULL,
  TimeAccount TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DROP TABLE IF EXISTS Badges;

CREATE TABLE IF NOT EXISTS Badges(
  id INT PRIMARY KEY AUTO_INCREMENT,
  BadgeName VARCHAR(30) NOT NULL,
  BadgeType VARCHAR(30) NOT NULL,
  BadgePosition VARCHAR(30) NOT NULL,
  BadgeCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO Badges(BadgeName,BadgeType,BadgePosition) VALUES("1CVE","CVE","/images/1CVE.png");
INSERT INTO Badges(BadgeName,BadgeType,BadgePosition) VALUES("10CVE","CVE","/images/10CVE.png");
INSERT INTO Badges(BadgeName,BadgeType,BadgePosition) VALUES("10MB","Group","/images/10MB.png");
INSERT INTO Badges(BadgeName,BadgeType,BadgePosition) VALUES("20MB","Group","/images/20MB.png");
INSERT INTO Badges(BadgeName,BadgeType,BadgePosition) VALUES("CVEMaster","CVE","/images/CVEMaster.png");
INSERT INTO Badges(BadgeName,BadgeType,BadgePosition) VALUES("1place","Race","/images/1place.png");
INSERT INTO Badges(BadgeName,BadgeType,BadgePosition) VALUES("2palce","Race","/images/2place.png");
INSERT INTO Badges(BadgeName,BadgeType,BadgePosition) VALUES("3place","Race","/images/3place.png");


DROP TABLE IF EXISTS HasBadge;

CREATE TABLE IF NOT EXISTS HasBadge(
  id INT PRIMARY KEY AUTO_INCREMENT,
  BadgeName VARCHAR(30) NOT NULL,
  GroupName VARCHAR(30) NOT NULL,
  TimeAssigned TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DROP TABLE IF EXISTS Messages;

CREATE TABLE IF NOT EXISTS Messages(
  id INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(30) NOT NULL,
  TextContent TEXT NOT NULL,
  TimeText TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DROP TABLE IF EXISTS MessagesGroup;

CREATE TABLE IF NOT EXISTS MessagesGroup(
  id INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(30) NOT NULL,
  GroupName VARCHAR(30) NOT NULL,
  TextContent TEXT NOT NULL,
  TimeText TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

DROP TRIGGER IF EXISTS UpdateUserJoin;

CREATE TRIGGER UpdateUserJoin
  AFTER INSERT ON UserJoinGroup
  FOR EACH ROW
    UPDATE InviteInGroup SET Used=1 WHERE InviteInGroup.Username=new.Username;


DROP TRIGGER IF EXISTS createPersona;

CREATE TRIGGER createPersona
  AFTER INSERT ON Users
  FOR EACH ROW
    INSERT INTO Persona(Username) VALUES(new.Username);


DROP TRIGGER IF EXISTS eventListenerCVE;

CREATE TRIGGER eventListenerCVE
  AFTER INSERT ON CVE
  FOR EACH ROW
    INSERT INTO GroupEvents(EventType,EventDescription,EventUser) VALUES("CVE","A new CVE was created!",new.CVEUserCreate);


DROP TRIGGER IF EXISTS eventListenerJoin;

CREATE TRIGGER eventListenerJoin
  AFTER INSERT ON UserJoinGroup
  FOR EACH ROW
    INSERT INTO GroupEvents(EventType,EventDescription,EventUser) VALUES("JOIN","New user has join the group",new.Username);


DROP TRIGGER IF EXISTS eventListenerInvite;

CREATE TRIGGER eventListenerInvite
  AFTER INSERT ON InviteInGroup
  FOR EACH ROW
    INSERT INTO GroupEvents(EventType,EventDescription,EventUser) VALUES("INVITE",new.Username,new.InviteMember);


DROP TRIGGER IF EXISTS eventListenerCVEDelete;

CREATE TRIGGER eventListenerCVEDelete
  AFTER DELETE ON CVE
  FOR EACH ROW
    INSERT INTO GroupEvents(EventType,EventDescription,EventUser) VALUES("CVE","A CVE Was Deleted",old.CVEUserCreate);

-- DROP TRIGGER IF EXISTS badgeListenerCVE;
--
-- CREATE TRIGGER badgeListenerCVE
--   AFTER INSERT ON CVE
--   FOR EACH ROW BEGIN
--     IF((SELECT SUM(NUM) AS Sum_Users FROM (SELECT Grps.GroupName,Username FROM Grps,UserJoinGroup WHERE Grps.GroupName = UserJoinGroup.GroupName AND UserJoinGroup.Username = NEW.CVEUserCreate) AS t1 LEFT OUTER JOIN CVE AS t2 ON t1.Username = t2.Username GROUP BY t1.GroupName) > 9) THEN
--       INSERT INTO HasBadge(BadgeName,GroupName) VALUES ;
