import sys,random,time,requests
import json

ip = "http://127.0.0.1:3000/"
alphabet = list("qwertyuiopasdfghjklzxcvbnm")

def createGroup(u,p,t):
    s = loginUser(u,p)
    data = {"GroupName":t}

    a = s.post(ip+"group/createGroup",data=data)
    print(a)


def loginUser(u,p):
    log = {"username":u,"password":p}
    s = requests.Session()
    a = s.post(ip+"login",data=log)
    return s

def createGroupName():
    name = ""
    for k in range(random.randint(6,12)):
        up = random.choice([0,1])
        if up == 0:
            name += random.choice(alphabet)
        else:
            name += random.choice(alphabet).upper()
    return name

if __name__ == '__main__':
    with open("userLogin.json") as jsrd:
        user = json.load(jsrd)
    if len(sys.argv) == 2 and sys.argv[1] != "loop":
        i = user["Usernames"].index(sys.argv[1])
        createGroup(user["Usernames"][i],user["Passwords"][i],createGroupName())
    elif len(sys.argv) == 3 and sys.argv[1] == "loop":
        for p in range(int(sys.argv[2])):
            i = random.randint(0,len(user["Usernames"]))
            createGroup(user["Usernames"][i],user["Passwords"][i],createGroupName())
    else:
        i = random.randint(0,len(user["Usernames"]))
        createGroup(user["Usernames"][i],user["Passwords"][i],createGroupName())
