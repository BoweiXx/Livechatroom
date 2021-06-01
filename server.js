const path = require('path');
const http = require('http');
const express = require('express');
const nodemon = require('nodemon');
const app = express();
const userList = new Array();
const PORT = 8080 || process.env.PORT;
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
io.on("connection", socket => {
    socket.username = "anonymous"
    socket.on("message", (message) => {
        console.log(message)
        io.emit("message", message);
    });
    socket.on("join", (username) =>{
            socket.username = username;
            userList.push(socket.username);
            console.log(userList);
            io.emit('updateUser', userList)
    })
    socket.on("disconnect", (username)=>{
        username = socket.username;
        loc = userList.indexOf(username);
        userList.splice(loc,1);
        console.log(userList);
        io.emit("updateUser", userList);
    })
});
//stupid
// const parseMessage = msg => {
//     return `${msg.username}: ${msg.words}`;
// }
