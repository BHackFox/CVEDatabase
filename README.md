## CVE Database

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Linux Mint](https://img.shields.io/badge/Linux%20Mint-87CF3E?style=for-the-badge&logo=Linux%20Mint&logoColor=white)


<h4>Progetto Base di Dati II anno accademico 2021-2022</h4>


[Università La Sapienza Roma](https://www.uniroma1.it/en), [Dipartimento di Informatica](https://www.studiareinformatica.uniroma1.it/)

![alt text](https://www.uniroma1.it/sites/default/files/images/logo/sapienza-big.png)

`Federico Rosatelli 1882771`

## Descrizione Progetto

Si vuole realizzare una base di dati di una piattaforma di CVE (Common Vulnerabilities and
Exposition).

Ogni utente registrato avrà modo di postare il proprio CVE visualizzabile in maniera gratuita e disponibile a tutti.


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
