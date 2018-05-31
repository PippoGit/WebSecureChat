function UIChatViewController() {
  this.maxSeen = -1;
  this.lastSent = -1;

  this.DOMElement = document.getElementById('UIChatView');
  this.recipient = "";

  this.messagesList = document.getElementById("UIMessagesListView");

  var that = this;

  document.getElementById("UIButtonCloseConnectionView").addEventListener("click", function() {
    var message = new SecureMessage({
      action: "close",
      other: that.recipient
    });

    ac.serverConnection.send(message.encrypt(me.serverSessionKey));
    me.busy = 0;
    that.maxSeen = -1;
    that.lastSent = -1;
    ac.changeView("UIContactsView");
  });

  document.getElementById("UITextAreaMessageView").addEventListener("keypress", function(e) {
    if(e.which == 13 && !e.shiftKey) {

      var message = new SecureMessage({
        action: "post",
        recipient: that.recipient,
        text: this.value
      });
      message.setID(that.lastSent);
      that.lastSent = message.message.id;
      message.encryptText(me.chatSessionKey);
      ac.serverConnection.send(message.encrypt(me.serverSessionKey));

      that.addSentMessage(this.value);
      this.value = "";
      e.preventDefault();
      return false;
    }
  });
}

UIChatViewController.prototype.addMessage = function (type, text) {
  var li = document.createElement("li");
  li.className = type;
  var span = document.createElement("span");
  span.appendChild(document.createTextNode(text));
  li.appendChild(span);

  this.messagesList.appendChild(li);
  this.messagesList.scrollTop += li.clientHeight;
}

UIChatViewController.prototype.addReceivedMessage = function (secmsg) {
  if(this.maxSeen == -1 || secmsg.message.id > this.maxSeen) {
    this.maxSeen = secmsg.message.id;
    this.addMessage("UIMessageReceivedView", secmsg.message.text);
  }
  else
    console.log("I received an old message...");
};

UIChatViewController.prototype.addSentMessage = function (text) {
  this.addMessage("UIMessageSentView", text);
};

UIChatViewController.prototype.newChat = function (username) {
  this.recipient = username;

  while (this.messagesList.firstChild) {
      this.messagesList.removeChild(this.messagesList.firstChild);
  }

  document.getElementById("UIChatRecipientUsernameText").textContent = username;
  document.getElementById("UITextAreaMessageView").disabled = false;
  document.getElementById("UITextAreaMessageView").value = "";
};


UIChatViewController.prototype.closeChat = function () {
  this.maxSeen = -1;
  this.lastSent = -1;

  document.getElementById("UITextAreaMessageView").disabled = true;
};
