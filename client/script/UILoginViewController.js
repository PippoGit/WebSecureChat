function UILoginViewController() {
  this.DOMElement = document.getElementById('UILoginView');

  document.getElementById("UIButtonLoginView").addEventListener("click", function() {

    if(me.logged == 0) {
      ac.startServerConnection();
    }

    me.username = document.getElementById("UITextUsernameView").value;
    me.pkey = document.getElementById("UIPublicKeyView").value;
    me.private = document.getElementById("UIPrivateKeyView").value;

    var message = new SecureMessage({
      action: "login",
      username: me.username
    });

    me.serverSessionKey = message.appendSessionKey(Settings.security.serverPublic);
    message.sign(me.private);
    ac.serverConnection.send(message.stringify());
    console.log(message.stringify());
  });
}
