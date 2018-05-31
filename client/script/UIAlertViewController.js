function UIAlertViewController() {
  this.DOMElement = document.getElementById('UIAlertView');

  document.getElementById("UIAlertDismissView").addEventListener("click", function() {
    document.getElementById("MainView").style.filter = "";
    document.getElementById("UIAlertView").style.display = "none";
  });
}

UIAlertViewController.prototype.show = function (title, description, closeAction) {
  document.getElementById("MainView").style.filter = "blur(16px)";
  document.getElementById("UIAlertView").style.display = "block";
  document.getElementById("UIAlertTitle").innerHTML = title;
  document.getElementById("UIAlertDescription").innerHTML = description;
};
