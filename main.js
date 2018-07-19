const path = require('path');
const express = require('express');

const SecureMessage = require("./client/script/SecureMessage.js");
const settings = require('./settings.json');
var users = require('./database.json');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('client'));

app.get('/', function(req, res) {
  res.sendFile(path.join('index.html'));
});

io.on('connection', function(socket) {
  console.log(socket.id, 'new connection!');
  io.emit("connected");

  socket.on("heartbeat", function() {
    socket.emit("heartbeat");
  });

  socket.on("disconnect", function() {
    if(socket.username == undefined) {
      console.log(' - An unlogged user disconnected...');
      return;
    }

    console.log(' * ' + socket.username + ' client disconnected');
    users[socket.username].logged = 0;
    users[socket.username].busy = 0;
  });

  socket.on('message', (buffer) => {
    try {
      var secmsg;

      if(socket.username == undefined || !users[socket.username].logged) {
        //user is not logged yet, which means it doesn't have the session key
        secmsg = SecureMessage.parse(buffer.toString());
      }
      else
      {
        //User already logged in, which means we can use AES
        console.log("AES Decryption using " + JSON.stringify(socket.sessionKey));
        console.log("ciphertext: \n" + buffer.toString());
        secmsg = SecureMessage.decrypt(socket.sessionKey, buffer.toString());
      }

      //Let's try to handle the message...
      console.log(socket.username + " wants to " + secmsg.message.action);
      socket.handle(secmsg);
    }
    catch(e) {
      console.error("*** ERROR\n SocketID " + socket.username + " sent an invalid message:\n" + e);
      var m = new SecureMessage({
        action:"error",
        description: e
      });

      if(socket.username == undefined || !users[socket.username].logged) {
        //user is not logged yet, which means it doesn't have the session key
        socket.send(m.stringify());
      }
      else {
        socket.send(m.encrypt(socket.sessionKey));
      }
    }

  });

  socket.handle = (secmsg) => {
    switch(secmsg.message.action) {
      case "login":
        login(socket, secmsg);
        break;

      case "list":
        list(socket.username);
        break;

      case "post":
        post(socket.username, secmsg.message.recipient, secmsg);
        break;

      case "request":
        request(socket.username, secmsg.message.recipient);
        break;

      case "accept":
        accept(socket.username, secmsg);
        break;

      case "decline":
        decline(socket.username, secmsg.message.other);
        break;

      case "close":
        close(socket.username, secmsg.message.other);
        break;

      default:
        throw("Parse Message Exception: action not allowed");
    }
  }
});

var PORT = process.env.PORT || settings.net.port;
http.listen(PORT, function () {
  console.log('\033c'); //clean console out
  console.log('** SecureChat Server **');
  console.log('A cybersecurity project by Filippo Scotto\n');

  console.log('\n Server available on port:', PORT);
  console.log('------------------------------------------------------');
});

function login(socket, secmsg) {
  var username = secmsg.message.username;

  if(!users.hasOwnProperty(username)) {
    throw("User doesn't exist");
  }
  if(users[username].logged == 1) {
    throw("User already logged in!");
  }

  try {
    secmsg.verify(users[username].pkey);
  }
  catch(e) {
    throw("Don't even try. You are not " + username);
  }


  console.log(username + " logged id");
  users[username].busy = 0;
  users[username].logged = 1;
  users[username].socket = socket;
  socket.username = username;

  var m = new SecureMessage({action:"grant", nonce: secmsg.message.nonce});
  socket.sessionKey = m.appendSessionKey(users[username].pkey);
  m.sign(settings.security.private);
  socket.send(m.stringify());
}

function request(sender, recipient) {

  console.log(sender, " wants to connect with ", recipient)

  users[sender].busy = 1;

  if(users[recipient].busy == 1 || !users[recipient].logged) {
    throw("Recipient busy or not logged in...");
  }

  users[recipient].busy = 1;

  var m = new SecureMessage({
    action: "request",
    sender: sender,
    pkey: users[sender].pkey,
  });
  m.appendNonce();
  users[recipient].nonce = m.message.nonce;
  m.sign(settings.security.private);
  users[recipient].socket.send(m.encrypt(users[recipient].socket.sessionKey));
}

function close(user, other) {
  console.log(user + " wants to close conn with " + other);

  users[user].busy = 0;
  users[other].busy = 0;

  var m = new SecureMessage({action: "close"});

  users[other].socket.send(m.encrypt(users[other].socket.sessionKey));
}

function accept(user, secmsg) {
  try {
    secmsg.verify(users[user].pkey);
    console.log(secmsg.stringify());
    console.log("nonce: " + user + " " + users[user].nonce + " - " + secmsg.message.nonce);
    if(users[user].nonce != secmsg.message.nonce)
      throw("Session Key is not fresh!");
  }
  catch(e) {
     console.log(user + " sent an unauthorized session key - closing connection");
     users[user].busy = 0;
     users[other].busy = 0;
     return;
  }

  console.log(user, " accepted to chat with ", secmsg.message.other);

  var m = new SecureMessage({
    action: "accepted",
    username: user,
    sessionKey: secmsg.message.sessionKey,
    pkey: users[user].pkey
  });
  m.sign(settings.security.private);
  users[secmsg.message.other].socket.send(m.encrypt(users[secmsg.message.other].socket.sessionKey));
}

function decline(user, other) {
  console.log(user, " declined to chat with ", other);

  users[user].busy = 0;
  users[other].busy = 0;

  var m = new SecureMessage({
    action: "declined",
    username: user
  });

  users[other].socket.send(m.encrypt(users[other].socket.sessionKey));
}

function post(sender, recipient, secmsg) {
  var message = secmsg.message.text;
  console.log(JSON.stringify(message));
  console.log(sender + " sent message to " + recipient);
  console.log("message: " + message);

  var m = new SecureMessage({
    id: secmsg.message.id,
    action: "post",
    text: message
  });

  users[recipient].socket.send(m.encrypt(users[recipient].socket.sessionKey));
}

function list(username) {
  var list = [];

  for (var u in users) {
    if (users[u].logged && !users[u].busy && u != username)
      list.push(u);
  }

  var m = new SecureMessage({
    action: "list",
    list: list
  });
  // m.sign(settings.security.private);
  users[username].socket.send(m.encrypt(users[username].socket.sessionKey));
  return list;
}
