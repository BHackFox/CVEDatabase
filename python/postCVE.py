import sys,random,time,requests
import json

ip = "http://127.0.0.1:3000/"

def createCVE(u,p,t,d):
    s = loginUser(u,p)
    data = {"CVETitle":t,"CVEDescription":d}

    a = s.post(ip+"CVE/newcve",data=data)
    print(a.text)


def loginUser(u,p):
    log = {"username":u,"password":p}
    s = requests.Session()
    a = s.post(ip+"login",data=log)
    print(a.text)
    return s


if __name__ == '__main__':
    with open("userLogin.json") as jsrd:
        user = json.load(jsrd)
    if len(sys.argv) == 2:
        i = user["Usernames"].index(sys.argv[1])
        createCVE(user["Usernames"][i],user["Passwords"][i],"prova","Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")
    else:
        i = random.randint(0,len(user["Usernames"]))
        createCVE(user["Usernames"][i],user["Passwords"][i],"prova","Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")
