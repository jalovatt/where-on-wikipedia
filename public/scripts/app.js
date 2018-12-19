$(document).ready(function(){
  $("button").click(function(){
    $.getJSON("http://localhost:3000/game/0/travel/153095", function(result){
      $.each(result, function(i, field){
        $("div").append(field + " ");
        console.log(JSON.gameid)
      });
    });
  });
});

$(document).ready(function() {
  $('#btnSun').click(myFunction);
});

function myFunction() {
  alert('hi');
}
