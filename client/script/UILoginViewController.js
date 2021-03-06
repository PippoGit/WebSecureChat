function UILoginViewController() {
  this.DOMElement = document.getElementById('UILoginView');

  document.getElementById("UIButtonLoginView").addEventListener("click", function() {

    if(me.logged == 0) {
      ac.startServerConnection();
    }

    me.username = document.getElementById("UITextUsernameView").value;
    //me.pkey = document.getElementById("UIPublicKeyView").value;
    me.private = document.getElementById("UIPrivateKeyView").value;

    var message = new SecureMessage({
      action: "login",
      username: me.username
    });
    message.appendNonce();
    me.nonce = message.message.nonce;
    message.sign(me.private);
    ac.serverConnection.send(message.stringify());
  });
}
