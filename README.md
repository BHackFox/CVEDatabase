## CVE Database

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Linux Mint](https://img.shields.io/badge/Linux%20Mint-87CF3E?style=for-the-badge&logo=Linux%20Mint&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)


<h4>Progetto Base di Dati II anno accademico 2021-2022</h4>


[Università La Sapienza Roma](https://www.uniroma1.it/en), [Dipartimento di Informatica](https://www.studiareinformatica.uniroma1.it/)

![alt text](https://www.uniroma1.it/sites/default/files/images/logo/sapienza-big.png)

`Federico Rosatelli 1882771`

## Descrizione Progetto

Si vuole realizzare una base di dati di una piattaforma di CVE (Common Vulnerabilities and Exposures).
CVE Database è una piattaforma web che permette di visualizzare e postare vulnerabilità informatiche di qualsiasi tipo. Ogni utente registrato avrà modo di creare il proprio CVE visualizzabile in maniera gratuita e disponibile a tutti. Ogni CVE è caratterizzato da  un titolo e una descrizione che cercano di spiegare in maniera più esaustiva possibile di cosa tratta la vulnerabilità esposta. Ogni CVE ha anche una raccolta di tag creati dagli utenti per facilitare la ricerca per corrispondenze comuni. Ogni tag è composto da un nome e descrizione che lo illustrano brevemente, un'indicazione sul sistema operativo, sul liguaggio informatico utilizzato e sul type, se local o remote. Ad esempio il tag #wordpress comprenderà il sistema operativo linux, il linguaggio informatico PHP e type remote.
Ogni utente, per poter postare un CVE, deve necessariamente creare un account o di tipo Lite, quindi gratuito, oppure Premium, a pagamento. Gli utenti Lite, oltre a creare i CVE hanno la possibilità di entrare nei gruppi nei quali sono invitati. I gruppi sono solo creati dagli utenti premium e permettono di raccogliere le informazioni di tutti gli utenti che ci partecipano. Più CVE e utenti ha il gruppo e più è in cima alla classifica globale dei gruppi. Ogni utente nel gruppo ha un ruolo, definito dalla persona che lo ha invitato, che gli permette di poter modificare o meno le informazioni del gruppo, invitare e cacciare altri utenti.
Gli utenti Premium possono inoltre creare i tags e verificare la validità dei vari CVE. Infatti tutti i CVE sono dichiarati non verificati finchè un utente premium non certifica le informazioni al suo interno.
Ogni utente sia Lite che Premium ha la possibilità di fornire le proprie informazioni personali per aumentare le sue possibilità di essere accettato in un gruppo. Le informazioni personali comprendono username,nome,cognome,numero di telefono,nazionalità,città di domicilio,strada,zip code e carta d'identità. Gli utenti Premium hanno come informazione aggiuntiva la carta di credito e la data di rinnovo del pagamento. Tutti gli utenti sono caratterizzati da un username e email unici e da una password.
Gli utenti appartenendi ad un gruppo possono invitare altri utenti non appartenenti al suo gruppo generando un invito. Un invito è caratterizzato da: l’username dell’invitato, l’username dell’invitatore, un link per poter accedere al gruppo, il nome del gruppo a cui si invita, il ruolo e la data dell’invito.
I CVE sono inoltre caratterizzati da un nome univoco, un titolo e una descrizione, l'username dell'utente che l'ha creato, la verifica fatta dagli utenti e la data di creazione di esso.
Ogni settimana si crea una graduatoria per i dieci migliori gruppi e viene conferito loro un badge esibito sulla pagina del gruppo.
Tale graduatoria è fornita tramite il numero e il tipo di badge che il gruppo possiede. Della graduatoria ci interessa sapere la data e il numero di gruppi partecipanti.
I gruppi sono caratterizzati da un nome univoco, da una descrizione e dalla data di creazione del gruppo.
I badges sono caratterizzati da un nome univoco, dal tipo di badge, la data di creazione e un link ad un'immagine che lo rappresenta.
Ogni gruppo inoltre ha la possibilità di visualizzare un log degli eventi degli utenti appartenenti ad esso categorizzato per tipo di evento. Gli eventi possono essere del tipo CVE, quando un utente posta o rimuove un CVE, JOIN, quando un utente entra nel gruppo, e INVITE, quando un membro invita un utente a partecipare al gruppo. Ogni evento è inoltre caratterizzato dalla data di creazione  e dall’username che genera l’evento.
Gli eventi possono generare dei badge ai gruppi a cui sono collegati in base ai CVE totali, al numero dei partecipanti e di quanti tag crea il gruppo.
Ogni utente è inoltre in grado di chattare con gli altri utenti appartenenti al suo gruppo.
La chat è caratterizzata da un id univoco, dal gruppo di appartenenza, l’utente che manda il messaggio e il tempo di invio.

## Installazione ed Esecuzione

Prima di poter iniziare l'installazione della piattaforma bisogna installare ed entrare nel `MySQL Monitor`

```shell
sudo apt update && apt install -y mysql-server mysql-client
sudo mysql -u root -p
```
 Dopo aver immesso la password bisogna creare il database CVE e l'utente fede

 ```sql
 CREATE DATABASE CVEDatabase;
 CREATE USER 'fede'@'localhost' IDENTIFIED BY 'fede';
 GRANT ALL PRIVILEGES ON CVEDatabase TO 'fede'@'localhost';
 FLUSH PRIVILEGES;
 QUIT;
 ```
A questo punto non resta che importare il file `CVEDatabaseSQL.sql` con il comando

```shell
mysql -u fede -p CVEDatabase < CVEDatabaseSQL.sql
```

Per la creazione e l'esecuzione della piattaforma vera e propria bisogna seguire i sequenti passi:

<ins>Per l'installazione di nodejs e delle dependencies</ins>

```shell
sudo apt install -y nodejs
npm install
```
<ins>Per l'esecuzione</ins>

```shell
npm start
```

Per la creazione e l'esecuzione della piattaforma tramite docker bisogna accertarsi di avere i requisiti stabiliti dal [sito ufficiale docker.com](https://docs.docker.com/engine/install/debian/#install-using-the-repository). Solo successivamente si potrà partire con il build del file `docker-compose.yml`

```shell
docker compose up
```

## Testing

Per confermare che l'installazione sia andata a buon fine si possono eseguire dei test tramite il file `testCVE.py` nella directory `python/test/`. Per eseguire il file di testing basterà solo fare:

```shell
cd python/test
python3 testCVE.py --general-test
```

Per altri comandi di testing si può consultare l'help del programma tramite
```shell
python3 testCVE.py --help
```
