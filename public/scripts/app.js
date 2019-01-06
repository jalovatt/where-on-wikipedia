$(document).ready(function(){

  $("#game").click(function(){
  $("#hide").removeClass("hidden")
    $.getJSON("/game/new/", function(result){
      let obj = result;
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
           $("#finalArticle").empty();
  });

      var integerCount = 0;

      $("#btnSun").click(function(){
        Object.keys(obj).forEach(function(key, index) {
          click = 1;
          $("#clueResult").removeClass("hidden")
          if (click = 1) {
            $("#clueResult1").removeClass("hidden")
          }

           $("#clueResult").text("Clue number " + (integerCount + 1) + ": " + obj.clues[integerCount]) //button for rendering clues
             integerCount ++;

           if (integerCount > 4){
             integerCount = 0;
           // $("#clueResult").text("clue number 1: " + obj.clues[0])
           // $("#clueResult1").text("clue number 2: " + obj.clues[1])
           // $("#clueResult2").text("clue number 3: " + obj.clues[2])
           // $("#clueResult3").text("clue number 4: " + obj.clues[3])
           // $("#clueResult4").text("clue number 5: " + obj.clues[4])
        }

});
  });

      $("#btnSun2").click(function(){
        Object.keys(obj).forEach(function(key, index) {

           $("#finalArticle").empty();

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

        if (object.deadend == true){
          // $("#finalArticle").text("The article you're looking for isn't here!")
          $("#destResult").text("Article number 1: " + object.destinations[0])
          $("#destResult1").text("Article number 2: " + object.destinations[1])
          $("#destResult2").text("Article number 3: " + object.destinations[2])
          $("#destResult3").text("Article number 4: " + object.destinations[3])
          $("#destResult4").text("Article number 5: " + object.destinations[4])
          // console.log(object.clues)
          console.log(object)
          console.log(object.destinations)
        }
        else {
          // $("#finalArticle").text("The suspect is hiding in: " + object.destinations[0].title)
          $("#destResult").text("Article number 1: " + object.destinations[0].title)
          $("#destResult1").text("Article number 2: " + object.destinations[1].title)
          $("#destResult2").text("Article number 3: " + object.destinations[2].title)
          $("#destResult3").text("Article number 4: " + object.destinations[3].title)
          $("#destResult4").text("Article number 5: " + object.destinations[4].title)

          $("#destResult").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[0].title); //button for rendering articles
          $("#destResult1").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[1].title);
          $("#destResult2").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[2].title);
          $("#destResult3").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[3].title);
          $("#destResult4").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[4].title);
         // console.log(object.clues)
         console.log(object)
         console.log(object.destinations)
        }
          });

     });

      $("#destResult1").click(function(){

        $.getJSON("/game/" + obj.gameid + "/travel/" + obj.destinations[1].id, function(res){
          let object = res;

        if (object.deadend == true){
          // $("#finalArticle").text("The article you're looking for isn't here!")
          $("#destResult").text("Article number 1: " + object.destinations[0])
          $("#destResult1").text("Article number 2: " + object.destinations[1])
          $("#destResult2").text("Article number 3: " + object.destinations[2])
          $("#destResult3").text("Article number 4: " + object.destinations[3])
          $("#destResult4").text("Article number 5: " + object.destinations[4])
          console.log(object.clues)
          console.log(object.destinations)
        }
        else {
          // $("#finalArticle").text("The suspect is hiding in: " + object.destinations[0].title)
          $("#destResult").text("Article number 1: " + object.destinations[0].title)
          $("#destResult1").text("Article number 2: " + object.destinations[1].title)
          $("#destResult2").text("Article number 3: " + object.destinations[2].title)
          $("#destResult3").text("Article number 4: " + object.destinations[3].title)
          $("#destResult4").text("Article number 5: " + object.destinations[4].title)

          $("#destResult").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[0].title); //button for rendering articles
          $("#destResult1").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[1].title);
          $("#destResult2").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[2].title);
          $("#destResult3").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[3].title);
          $("#destResult4").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[4].title);

         console.log(object.clues)
         console.log(object.destinations)
        }
          });

     });

      $("#destResult2").click(function(){

        $.getJSON("/game/" + obj.gameid + "/travel/" + obj.destinations[2].id, function(res){
          let object = res;

        if (object.deadend == true){
          // $("#finalArticle").text("The article you're looking for isn't here!")
          $("#destResult").text("Article number 1: " + object.destinations[0])
          $("#destResult1").text("Article number 2: " + object.destinations[1])
          $("#destResult2").text("Article number 3: " + object.destinations[2])
          $("#destResult3").text("Article number 4: " + object.destinations[3])
          $("#destResult4").text("Article number 5: " + object.destinations[4])
          console.log(object.clues)
          console.log(object.destinations)
        }
        else {
          // $("#finalArticle").text("The suspect is hiding in: " + object.destinations[0].title)
          $("#destResult").text("Article number 1: " + object.destinations[0].title)
          $("#destResult1").text("Article number 2: " + object.destinations[1].title)
          $("#destResult2").text("Article number 3: " + object.destinations[2].title)
          $("#destResult3").text("Article number 4: " + object.destinations[3].title)
          $("#destResult4").text("Article number 5: " + object.destinations[4].title)

          $("#destResult").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[0].title); //button for rendering articles
          $("#destResult1").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[1].title);
          $("#destResult2").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[2].title);
          $("#destResult3").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[3].title);
          $("#destResult4").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[4].title);
         console.log(object.clues)
         console.log(object.destinations)
        }
          });

     });

      $("#destResult3").click(function(){

        $.getJSON("/game/" + obj.gameid + "/travel/" + obj.destinations[3].id, function(res){
          let object = res;

        if (object.deadend == true){
          // $("#finalArticle").text("The article you're looking for isn't here!")
          $("#destResult").text("Article number 1: " + object.destinations[0])
          $("#destResult1").text("Article number 2: " + object.destinations[1])
          $("#destResult2").text("Article number 3: " + object.destinations[2])
          $("#destResult3").text("Article number 4: " + object.destinations[3])
          $("#destResult4").text("Article number 5: " + object.destinations[4])
          console.log(object.clues)
          console.log(object.destinations)
        }
        else {
          // $("#finalArticle").text("The suspect is hiding in: " + object.destinations[0].title)
          $("#destResult").text("Article number 1: " + object.destinations[0].title)
          $("#destResult1").text("Article number 2: " + object.destinations[1].title)
          $("#destResult2").text("Article number 3: " + object.destinations[2].title)
          $("#destResult3").text("Article number 4: " + object.destinations[3].title)
          $("#destResult4").text("Article number 5: " + object.destinations[4].title)

          $("#destResult").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[0].title); //button for rendering articles
          $("#destResult1").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[1].title);
          $("#destResult2").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[2].title);
          $("#destResult3").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[3].title);
          $("#destResult4").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[4].title);
         console.log(object.clues)
         console.log(object.destinations)
        }
          });

     });

      $("#destResult4").click(function(){

        $.getJSON("/game/" + obj.gameid + "/travel/" + obj.destinations[4].id, function(res){
           let object = res;

        if (object.deadend == true){
          // $("#finalArticle").text("The article you're looking for isn't here!")
          $("#destResult").text("Article number 1: " + object.destinations[0])
          $("#destResult1").text("Article number 2: " + object.destinations[1])
          $("#destResult2").text("Article number 3: " + object.destinations[2])
          $("#destResult3").text("Article number 4: " + object.destinations[3])
          $("#destResult4").text("Article number 5: " + object.destinations[4])
          console.log(object.clues)
          console.log(object.destinations)
        }
        else {
          // $("#finalArticle").text("The suspect is hiding in: " + object.destinations[0].title)
          $("#destResult").text("Article number 1: " + object.destinations[0].title)
          $("#destResult1").text("Article number 2: " + object.destinations[1].title)
          $("#destResult2").text("Article number 3: " + object.destinations[2].title)
          $("#destResult3").text("Article number 4: " + object.destinations[3].title)
          $("#destResult4").text("Article number 5: " + object.destinations[4].title)

          $("#destResult").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[0].title); //button for rendering articles
          $("#destResult1").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[1].title);
          $("#destResult2").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[2].title);
          $("#destResult3").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[3].title);
          $("#destResult4").attr('href', "https://en.m.wikipedia.org/wiki/" + object.destinations[4].title);
          console.log(object.clues)
          console.log(object.destinations)
        }
          });

     });
});
});

});