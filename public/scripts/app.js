$(document).ready(function(){

  $("#game").click(function(){
  $("#hide").removeClass("hidden")
    $.getJSON("/game/new/", function(result){

      var obj = result;
      console.log(result)
      Object.keys(obj).forEach(function(key, index) {
      // console.log(key, obj[key], index);

           $('#wiki-content').attr('src', obj.url); //button for starting game
           $("#resultJson").attr('href', obj.url);
           $("#resultJson").text("Starting Article: " + obj.title) //button for rendering clues
           $("#clueResult").empty();
           $("#destResult").empty();
  });

      var integerCount = 0;

      $("#btnSun").click(function(){
        Object.keys(obj).forEach(function(key, index) {

      $("#clueResult").text("Clue number " + (integerCount + 1) + ": " + obj.clues[integerCount]) //button for rendering clues
      integerCount ++;

      if (integerCount > 4){
        integerCount = 0;
    }
});
  });
      var integerCount2 = 0

      $("#btnSun2").click(function(){
        Object.keys(obj).forEach(function(key, index) {

      $("#destResult").attr('href', "https://en.m.wikipedia.org/wiki/" + obj.destinations[integerCount2]);
      $("#destResult").text("Article number " + (integerCount2 + 1) + ": " + obj.destinations[integerCount2]) //button for rendering articles
      integerCount2 ++;


      if (integerCount2 > 4){
        integerCount2 = 0;
    }
});
  });
});
});

});

