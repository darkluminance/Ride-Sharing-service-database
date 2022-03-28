# Welcome to Ride Sharing Service Database Project

## A demo video of this project can be found at: 
https://www.facebook.com/100018744274370/videos/840465419921593/

## FrontEnd setup

Open terminal inside the project folder.

First install the required dependancies using the command

```
npm install
```

### Compiles and hot-reloads for development

To run the project with a live server, use the command in terminal :

```
npm run serve
```

### Compiles and minifies for production

For production build

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).



## BackEnd setup


1. Create a folder and put the files there

2. Open cmd in the folder by typing **cmd** from the location bar on the top of the file explorer

3. Type the following commands in order :

   - npm install (Will install the required packages of this project for node js)
   - code . (Will open up visual studio code in the folder)

Now you can write your codes in the **index.js** file
Note: You have to change username and password at the top of the file to your oracle schema username and password.

4. Open up terminal from the vscode screen and type:

- node index.js (Will run index.js as a node js app. All the javascript codes will be executed now)

----OPTIONAL----

If you change anything from the file and save it, you'll have to stop the current run from the terminal (Hitting Ctrl+C)
and then again run using the **node index.js** command.
In order to avoid that you can do the following :

- npm install nodemon (Will install the nodemon package)
- npx nodemon (Will start a live backend node js server from that folder)

Now if you do any changes to the index.js file and save it, the server will automatically reload everytime.
The main point to remember is everytime you reopen vscode, you'll have to restart the server using **npx nodemon** again.


## Admin page

1. Install the dependancies using **npm install** command.
2. Open up the project in vs code or any editor and start the backend server using node **index.js** or **npx nodemon** command.
3. Install http-server package using **npm install -g http-server** command.
4. To start an http server for the admin page run this command from the root folder **http-server ./**
5. Now you can visit the admin page using localhost:<port number>/public/index.html. Don't forget to change username password of database from the index.js file as well.
   
## Things to keep in mind
   1. Always start the frontend server first before admin page http-server while logging in using an admin account because the url used for admin page in the project was **localhost:8082/public/index.html** and for frontend it was **localhost:8081**. If you wish to change it, you can change the url from the LoginPage.vue file in Frontend project.
