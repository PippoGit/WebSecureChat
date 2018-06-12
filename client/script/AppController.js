function AppController() {

  this.chatView = new UIChatViewController();
  this.loginView = new UILoginViewController();
  this.alertView = new UIAlertViewController();
  this.contactView = new UIContactsViewController();

  this.currentView = this.loginView.DOMElement;
}

AppController.prototype.changeView = function(view) {
  this.currentView.style.display = "none";
  this.currentView = document.getElementById(view);
  this.currentView.style.display = "block";
};

AppController.prototype.startServerConnection = function() {
  this.serverConnection = io();

  //send heartbeat to keep connection alive!
  var that = this;
  setInterval(function() {
    that.serverConnection.emit('heartbeat');
  }, 5000);

  this.serverConnection.on('connected', function() {
    console.log("connected with the server!");
  });

  this.serverConnection.on('message', function(data) {
    if(SecureMessage.isClearTxt(data.toString())) {
      var secmsg = SecureMessage.parse(data.toString());
    }
    else {
      var secmsg = SecureMessage.decrypt(me.serverSessionKey, data.toString());
    }

    var m = secmsg.message;

    switch(m.action) {
      case "list":
        ac.contactView.refreshList(m.list);
        break;

      case "close":
        if(!me.busy) return;

        me.busy = 0;
        ac.alertView.show(ac.chatView.recipient + " closed the connection", "The user closed the connection.");
        ac.chatView.closeChat();
        break;

      case "error":
        ac.alertView.show("Error from server", m.description);
        break;

      case "post":
        secmsg.decryptText(me.chatSessionKey, secmsg.message.text)
        ac.chatView.addReceivedMessage(secmsg);
        break;

      case "grant":

        me.logged = 1;
        ac.changeView("UIContactsView");
        ac.getContactsList();
        break;

      case "request":
        try {
          secmsg.verify(Settings.security.serverPublic);
        }
        catch(e) {
          ac.alertView.show("Alert", "You received an unauthorized chat request");
          return;
        }

        var r = confirm("New request from " + m.sender);
        var message;

        if (r == true) {
          ac.changeView("UIChatView");
          ac.chatView.newChat(m.sender);
          message = new SecureMessage({
            action: "accept",
            other: m.sender
          });

          me.chatSessionKey = message.appendSessionKey(m.pkey);
          message.sign(me.private);
          me.busy = 1;
        }
        else {
          message = new SecureMessage({
            action: "decline",
            other: m.sender
          });
        }
        ac.serverConnection.send(message.encrypt(me.serverSessionKey));
        break;

      case "accepted":
        try {
          secmsg.verify(Settings.security.serverPublic);
        }
        catch(e) {
          ac.alertView.show("Alert", "You received an unauthorized session key");
          return;
        }

        alert(m.username + " accepted your request!");
        me.busy = 1;
        me.chatSessionKey = secmsg.extractSessionKey(me.private);
        ac.changeView("UIChatView");
        ac.chatView.newChat(m.username);
        break;

      case "declined":
        ac.alertView.show("Request declined", m.username + " declined your request.");
        break;
    }

  });

  this.serverConnection.on('end', function() {
    console.log('disconnected from server');

    if(me.logged) //if user logged out me is undefined
      ac.alertView.show("Connection Lost", "Connection lost with the server..."); //server went down...
  });

}

AppController.prototype.getContactsList = function() {
  var message = new SecureMessage({action: "list"});
  ac.serverConnection.send(message.encrypt(me.serverSessionKey));
}
