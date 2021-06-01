const path = require('path');
const http = require('http');
const express = require('express');
const nodemon = require('nodemon');
const app = express();
const userList = new Array();
const PORT = 80 || process.env.PORT;

//set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/chatroom.html');
})
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
    console.log(`server @${PORT}`)
});
const io = require('socket.io')(httpServer);
/*get msg from one client then transmit to every other client, do not use io.emit();*/
//nvm
io.on("connection", socket => {
    socket.username = "";
    socket.on("message", (message) => {
        console.log(message);
        io.emit("message", message);
        // io.emit("getTime", getTime());
        // console.log(getTime());
    });
    socket.on("join", (username) =>{
            socket.username = username;
            userList.push(socket.username);
            console.log(userList);
            io.emit('updateUser', userList)
    });
    socket.on("disconnect", (username)=>{
        username = socket.username;
        loc = userList.indexOf(username);
        userList.splice(loc,1);
        console.log(userList);
        io.emit("updateUser", userList);
    });
});
//stupid
// const parseMessage = msg => {
//     return `${msg.username}: ${msg.words}`;
// }
//this only gets the server's time, update time on the client side
// const getTime = () =>{
//     let current = new Date();
//     const obj = {
//         Year: current.getFullYear(),
//         month: current.getMonth() + 1,
//         day: current.getDate(),
//         hour: current.getHours(),
//         minute: current.getMinutes(),
//         sec: current.getSeconds()
//     }    
//     return `${obj.Year}\/${obj.month}\/${obj.day}\/\/${obj.hour}:${obj.minute}:${obj.sec}`;
// }