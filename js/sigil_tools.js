$(function(){

// Array shuffle function
function shuffleCards(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

$('#submitButton').click(function(){
    location.reload();
});