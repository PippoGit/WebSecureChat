function UIContactsViewController() {
  this.contactsList = document.getElementById("UIContactsListView");
  this.DOMElement = document.getElementById('UIContactsView');

  document.getElementById("UIButtonRefreshContactsButtonView").addEventListener("click", function() {
    ac.getContactsList();
  });

  document.getElementById("UIButtonLogOutButtonView").addEventListener("click", function() {
    ac.serverConnection.emit("logout");
    me.logged = 0;
    ac.changeView("UILoginView");
  });
}

UIContactsViewController.prototype.refreshList = function (list) {

  while (this.contactsList.firstChild) {
      this.contactsList.removeChild(this.contactsList.firstChild);
  }

  if(list==undefined) return;

  for(var i=0; i<list.length; i++) {
    this.addContact(list[i]);
  }

}

UIContactsViewController.prototype.addContact = function (contact) {

  var li = document.createElement("li");
  var span = document.createElement("span");
  span.className = "UIContactsListUsernameText";
  var spanaccess = document.createElement("span");
  var i = document.createElement("i");
  i.className = "fas fa-chevron-circle-right";
  spanaccess.appendChild(i);
  spanaccess.className="UIContactsListAccess";
  span.appendChild(document.createTextNode(contact));
  li.appendChild(span);
  li.appendChild(spanaccess);

  li.addEventListener("click", function() {
    // me.other = contact.username;
    // me.otherPkey = contact.pkey;

    var message = new SecureMessage({
      action: "request",
      recipient: contact
    });

    ac.serverConnection.send(message.encrypt(me.serverSessionKey));
  });

  this.contactsList.appendChild(li);
}
