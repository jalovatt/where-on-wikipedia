$(document).ready(function(){

  $("#game").click(function(){

    $.getJSON("http://localhost:3000/game/example/travel/153095", function(result){

      var obj = result;
      Object.keys(obj).forEach(function(key, index) {
      // console.log(key, obj[key], index);

        if (index == 3) {
           $("#resultJson").text("This is the starting point:")
        }
        $('#wiki-content').attr('src', obj.url);
});
  });
});
});

$(document).ready(function(){
    var integerCount = 0;

  $("#btnSun").click(function(){
    $.getJSON("http://localhost:3000/game/example/travel/153095", function(result){
      var obj = result;

Object.keys(obj).forEach(function(key, index) {
  $("#clueResult").text("Clue: " + obj.clues[integerCount])
    integerCount ++;
    console.log(integerCount)

    if (integerCount > 4){
       integerCount = 0;
    }
});
  });
});
});


$(document).ready(function(){
    var integerCount = 0;

  $("#btnSun2").click(function(){
    $.getJSON("http://localhost:3000/game/example/travel/153095", function(result){
      var obj = result;

      Object.keys(obj).forEach(function(key, index) {
    $("#destResult").text("Destinations: " + obj.destinations[integerCount])
    integerCount ++;
    console.log(integerCount)
    // $('#wiki-content').attr('src', "https://en.m.wikipedia.org/wiki/?curid=" + obj.url);

   if (integerCount > 4){
      integerCount = 0;
    }
});
  });
});
});





