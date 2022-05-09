import requests,time,json
import argparse
import random

alphabet = list("qwertyuiopasdfghjklzxcvbnm")
ip = "http://127.0.0.1:3000/"

class Test():

    def __init__(self,username,email,password):
        self.username = username
        self.email = email
        self.password = password
        self.session = self.loginUser()
        self.testPassed = 0

    def loginUser(self):
        log = {"username":self.username,"password":self.password}
        s = requests.Session()
        a = s.post(ip+"login",data=log)
        return s

    def createCVE(self,tags):
        data = {"CVETitle":f"Prova {self.username}","CVEDescription":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","tags":tags}

        a = self.session.post(ip+"CVE/newcve",json=data)
        print(a)

    def createTag(self,name,desc,os,lang,local):
        data = {"TagName":name,"TagDescription":desc,"TagOs":os,"TagLanguage":lang,"TagType":local}
        res = self.session.post(ip+"api/tags/newtag",json=data)
        print(f"Tag {name} created!")
        return name




def registerUser(username,email,password):
    data = {"username":username,"email":email,"password":password}
    res = requests.post(ip+"register",data=data)
    print(res)



def importUsers():
    data = {}
    with open("../userLogin.json") as jsrd:
        data = json.load(jsrd)
    return data

def createUsers(n):
    usernames = []
    emails = []
    passwords = []
    for i in range(n):
        name = ""
        for k in range(random.randint(4,12)):
            up = random.choice([0,1])
            if up == 0:
                name += random.choice(alphabet)
            else:
                name += random.choice(alphabet).upper()
        usernames.append(name)
        domain = ""

        for k in range(random.randint(2,6)):
            domain += random.choice(alphabet)
        email = name.lower() + "@" + domain + ".com"
        emails.append(email)

        password = ""

        for k in range(random.randint(8,16)):
            up = random.choice([0,1])
            if up == 0:
                password += random.choice(alphabet)
            else:
                password += random.choice(alphabet).upper()

        passwords.append(password)


    passwords.append("fede")
    emails.append("fede@fede.com")
    usernames.append("fede")
    data = {"Usernames":usernames,"Emails":emails,"Passwords":passwords}
    with open("../userLogin.json","w") as jswr:
        json.dump(data,jswr)


def importOS():
    data = {}
    with open("../OSTag.json") as jsrd:
        data = json.load(jsrd)
    return data

def importLang():
    data = {}
    with open("../LanguageTag.json") as jsrd:
        data = json.load(jsrd)
    return data

def main(args):
    print(args)
    #createUsers(2000)
    listTags = []
    listos = importOS()
    listlang = importLang()
    usersList = importUsers()
    for i in range(len(usersList["Usernames"])):
        registerUser(usersList["Usernames"][i],usersList["Emails"][i],usersList["Passwords"][i])
        t = Test(usersList["Usernames"][i],usersList["Emails"][i],usersList["Passwords"][i])
        if random.randint(0,4) == 1:
            os = listos[random.randint(0,len(listos)-1)]["OSName"]
            lang = listlang[random.randint(0,len(listlang)-1)]["LanguageName"]
            local = random.choice(["Local","Remote"])
            name = ""
            for n in range(0,random.randint(1,10)):
                name += random.choice(alphabet)
            listTags.append(t.createTag(name,"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",os,lang,local))
        for k in range(random.randint(1,8)):
            tags = []
            if len(listTags)>0:
                for p in range(random.randint(0,len(listTags)-1)):
                    tags.append(listTags[p])
            t.createCVE(tags)






if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='CVEDatabase Tests')
    parser.add_argument('--general-test',action='store_true',help='Run all tests')
    parser.add_argument('--users',action='store_true',help='Run all Users tests')
    parser.add_argument('--cves',action='store_true',help='Run all CVEs tests')
    parser.add_argument('--groups',action='store_true',help='Run all Groups tests')
    parser.add_argument('--create-users',action='store_true',help='Create new set of users')
    args = parser.parse_args()
    main(args)
