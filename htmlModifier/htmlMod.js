/*
//Creating Elements
var btn = document.createElement("BUTTON")
var t = document.createTextNode("CLICK ME");
btn.appendChild(t);
//Appending to DOM 
document.body.appendChild(btn);
*/

$(document).ready(function () {
//    console.log($(document.body).html());
//    console.log($('html').html());
    var $html = $(document.documentElement.outerHTML);
    console.log($html.find("#footnote").html());
    console.log(document.documentElement.outerHTML);
});
