$(document).ready(function(){

  $("#game").click(function(){
  $("#hide").removeClass("hidden")
    $.getJSON("/game/new/", function(result){
      let obj = result;
      console.log(obj)
      console.log(obj.gameid)
      Object.keys(obj).forEach(function(key, index) {

           $('#wiki-content').attr('src', obj.url); //button for starting game
           $("#resultJson").attr('href', obj.url);
           $("#resultJson").text("Starting Article: " + obj.title)
           $("#clueResult").empty();
           $("#destResult").empty();
           $("#destResult1").empty();
           $("#destResult2").empty();
           $("#destResult3").empty();
           $("#destResult4").empty();
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

      $("#btnSun2").click(function(){
        Object.keys(obj).forEach(function(key, index) {

           $("#destResult").attr('href', "https://en.m.wikipedia.org/wiki/" + obj.destinations[0].title); //button for rendering articles
           $("#destResult1").attr('href', "https://en.m.wikipedia.org/wiki/" + obj.destinations[1].title);
           $("#destResult2").attr('href', "https://en.m.wikipedia.org/wiki/" + obj.destinations[2].title);
           $("#destResult3").attr('href', "https://en.m.wikipedia.org/wiki/" + obj.destinations[3].title);
           $("#destResult4").attr('href', "https://en.m.wikipedia.org/wiki/" + obj.destinations[4].title);

           $("#destResult").text("Article number 1: " + obj.destinations[0].title)
           $("#destResult1").text("Article number 2: " + obj.destinations[1].title)
           $("#destResult2").text("Article number 3: " + obj.destinations[2].title)
           $("#destResult3").text("Article number 4: " + obj.destinations[3].title)
           $("#destResult4").text("Article number 5: " + obj.destinations[4].title)

});
  });

      $("#destResult").click(function(){

        $.getJSON("/game/" + obj.gameid + "/travel/" + obj.destinations[0].id, function(res){
          let object = res;

          $("#destResult").text("Article number 1: " + object.destinations[0])
          $("#destResult1").text("Article number 2: " + object.destinations[1])
          $("#destResult2").text("Article number 3: " + object.destinations[2])
          $("#destResult3").text("Article number 4: " + object.destinations[3])
          $("#destResult4").text("Article number 5: " + object.destinations[4])
          console.log(object)
          console.log(object.pageid)

          });

     });

      $("#destResult1").click(function(){

        $.getJSON("/game/" + obj.gameid + "/travel/" + obj.destinations[1].id, function(res){
          let object = res;

          $("#destResult").text("Article number 1: " + object.destinations[0])
          $("#destResult1").text("Article number 2: " + object.destinations[1])
          $("#destResult2").text("Article number 3: " + object.destinations[2])
          $("#destResult3").text("Article number 4: " + object.destinations[3])
          $("#destResult4").text("Article number 5: " + object.destinations[4])
          console.log(object)
          console.log(object.pageid)
          });

     });

      $("#destResult2").click(function(){

        $.getJSON("/game/" + obj.gameid + "/travel/" + obj.destinations[2].id, function(res){
          let object = res;

          $("#destResult").text("Article number 1: " + object.destinations[0])
          $("#destResult1").text("Article number 2: " + object.destinations[1])
          $("#destResult2").text("Article number 3: " + object.destinations[2])
          $("#destResult3").text("Article number 4: " + object.destinations[3])
          $("#destResult4").text("Article number 5: " + object.destinations[4])
          console.log(object)
          console.log(object.pageid)
          });

     });

      $("#destResult3").click(function(){

        $.getJSON("/game/" + obj.gameid + "/travel/" + obj.destinations[3].id, function(res){
          let object = res;

          $("#destResult").text("Article number 1: " + object.destinations[0])
          $("#destResult1").text("Article number 2: " + object.destinations[1])
          $("#destResult2").text("Article number 3: " + object.destinations[2])
          $("#destResult3").text("Article number 4: " + object.destinations[3])
          $("#destResult4").text("Article number 5: " + object.destinations[4])
          console.log(object)
          console.log(object.pageid)
          });

     });

      $("#destResult4").click(function(){

        $.getJSON("/game/" + obj.gameid + "/travel/" + obj.destinations[4].id, function(res){
           let object = res;

          $("#destResult").text("Article number 1: " + object.destinations[0])
          $("#destResult1").text("Article number 2: " + object.destinations[1])
          $("#destResult2").text("Article number 3: " + object.destinations[2])
          $("#destResult3").text("Article number 4: " + object.destinations[3])
          $("#destResult4").text("Article number 5: " + object.destinations[4])
          console.log(object)
          console.log(object.pageid)
          });

     });
});
});

});
