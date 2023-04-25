/*
Programmer Name: Jong Won Lim
*/
const aboutBtn = document.getElementById("about-btn");

aboutBtn.addEventListener("click", function() {
  window.location.href = "/public/about.html";
});

const upgradeBtn = document.getElementById("upgrade-btn");

upgradeBtn.addEventListener("click", function() {
  window.location.href = "/public/upgrade.html";
});

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", function() {
  window.location.href = "/public/login.html";
});