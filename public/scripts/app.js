$(document).ready(function(){

  function populateDestinations(dests) {

    if (dests.deadend == true){
      // $("#finalArticle").text("The article you're looking for isn't here!")
      $("#destResult").text("Article number 1: " + dests.destinations[0])
      $("#destResult1").text("Article number 2: " + dests.destinations[1])
      $("#destResult2").text("Article number 3: " + dests.destinations[2])
      $("#destResult3").text("Article number 4: " + dests.destinations[3])
      $("#destResult4").text("Article number 5: " + dests.destinations[4])
      // console.log(object.clues)
      console.log(dests)
      console.log(dests.destinations)
    }
    else {
      // $("#finalArticle").text("The suspect is hiding in: " + object.destinations[0].title)
      $("#destResult").text("Article number 1: " + dests.destinations[0].title)
      $("#destResult1").text("Article number 2: " + dests.destinations[1].title)
      $("#destResult2").text("Article number 3: " + dests.destinations[2].title)
      $("#destResult3").text("Article number 4: " + dests.destinations[3].title)
      $("#destResult4").text("Article number 5: " + dests.destinations[4].title)

      $("#destResult").attr('href', "https://en.m.wikipedia.org/wiki/" + dests.destinations[0].title); //button for rendering articles
      $("#destResult1").attr('href', "https://en.m.wikipedia.org/wiki/" + dests.destinations[1].title);
      $("#destResult2").attr('href', "https://en.m.wikipedia.org/wiki/" + dests.destinations[2].title);
      $("#destResult3").attr('href', "https://en.m.wikipedia.org/wiki/" + dests.destinations[3].title);
      $("#destResult4").attr('href', "https://en.m.wikipedia.org/wiki/" + dests.destinations[4].title);
    }
  }

  function showTab(event) {
    const btn = event.target;
    const tabId = "tab-" + btn.id.match(/btn-(.+)/)[1];

    $(".button").removeClass("active");
    $(btn).addClass("active");

    $(".tab").addClass("hidden");
    $(`#${tabId}`).removeClass("hidden");
  }

  $("#btn-travel").click(showTab);
  $("#btn-search").click(showTab);
  $("#btn-suspect").click(showTab);
  $("#btn-menu").click(showTab);
  $("#btn-help").click(showTab);

  $("#game").click(function(){
    $("#hide").removeClass("hidden");
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
          }

        });
      });

      $("#btnSun2").click(function(){
        Object.keys(obj).forEach(function(key, index) {

          $("#finalArticle").empty();
          populateDestinations(obj);

        });
      });

      function travelTo(gameId, articleId) {
        $.getJSON("/game/" + gameId + "/travel/" + articleId, populateDestinations);
      }

      $("#destResult").click( travelTo(obj.gameid, obj.destinations[0].id) );

      $("#destResult1").click( travelTo(obj.gameid, obj.destinations[1].id) );

      $("#destResult2").click( travelTo(obj.gameid, obj.destinations[2].id) );

      $("#destResult3").click( travelTo(obj.gameid, obj.destinations[3].id) );

      $("#destResult4").click( travelTo(obj.gameid, obj.destinations[4].id) );
    });
  });

});
