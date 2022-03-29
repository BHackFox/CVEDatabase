import requests, random, json
import sys
ip = "http://localhost:3000/"

alphabet = list("qwertyuiopasdfghjklzxcvbnm")



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

        for k in range(random.randint(2,4)):
            domain += random.choice(alphabet)
        email = name.lower() + "@" + domain
        emails.append(email)

        password = ""

        for k in range(random.randint(8,16)):
            up = random.choice([0,1])
            if up == 0:
                password += random.choice(alphabet)
            else:
                password += random.choice(alphabet).upper()

        passwords.append(password)

        data = {"Usernames":usernames,"Emails":emails,"Passwords":passwords}

        with open("userLogin.json","w") as jswr:
            json.dump(data,jswr)


def loginUser(username,password):
    s = requests.Session()
    data = {"username":username,"password":password}

    res = s.post(ip+"login",data=data)
    print(res.text)


def registerUser(username,email,password):
    data = {"username":username,"email":email,"password":password}
    res = requests.post(ip+"newUser",data=data)
    print(res)

if __name__ == '__main__':
    if sys.argv[1].lower() == "create":
        if len(sys.argv) == 3 and sys.argv[2].isdigit():
            n = int(sys.argv[2])
            createUsers(n)
    if sys.argv[1].lower() == "register":
        data = {}
        with open("userLogin.json") as jsrd:
            data = json.load(jsrd)
        if len(sys.argv) == 3 and sys.argv[2] in data["Usernames"]:
            ind = data["Usernames"].index(sys.argv[2])
            registerUser(data["Usernames"][ind],data["Emails"][ind],data["Passwords"][ind])
        else:
            for i in range(len(data["Usernames"])):
                registerUser(data["Usernames"][i],data["Emails"][i],data["Passwords"][i])
    if sys.argv[1].lower() == "login":
        data = {}
        with open("userLogin.json") as jsrd:
            data = json.load(jsrd)
        if len(sys.argv) == 3 and sys.argv[2] in data["Usernames"]:
            ind = data["Usernames"].index(sys.argv[2])
            loginUser(data["Usernames"][ind],data["Passwords"][ind])
        else:
            for i in range(len(data["Usernames"])):
                loginUser(data["Usernames"][i],data["Passwords"][i])
