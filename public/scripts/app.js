$(document).ready(function(){

  function travelTo(gameId, articleId) {
    $.getJSON("/game/" + gameId + "/travel/" + articleId, populateDestinations);

  }

  function populateDestinations(obj) {

    console.log("populating");

    if (obj.deadend == true){

      $("#destResult0").text(obj.destinations[0]);
      $("#destResult0").removeAttr("href");
      $("#destResult1").empty();
      $("#destResult2").empty();
      $("#destResult3").empty();
      $("#destResult4").empty();
      $("#clueResult").empty();
    }
    else {

      $("#destResult0").text("Article number 1: " + obj.destinations[0].title);
      $("#destResult1").text("Article number 2: " + obj.destinations[1].title);
      $("#destResult2").text("Article number 3: " + obj.destinations[2].title);
      $("#destResult3").text("Article number 4: " + obj.destinations[3].title);
      $("#destResult4").text("Article number 5: " + obj.destinations[4].title);

      $("#destResult0").attr("href", "https://en.m.wikipedia.org/wiki/" + obj.destinations[0].title); //button for rendering articles
      $("#destResult1").attr("href", "https://en.m.wikipedia.org/wiki/" + obj.destinations[1].title);
      $("#destResult2").attr("href", "https://en.m.wikipedia.org/wiki/" + obj.destinations[2].title);
      $("#destResult3").attr("href", "https://en.m.wikipedia.org/wiki/" + obj.destinations[3].title);
      $("#destResult4").attr("href", "https://en.m.wikipedia.org/wiki/" + obj.destinations[4].title);

      $("#destResult0").off("click").click( function() { travelTo(obj.gameid, obj.destinations[0].id);});
      $("#destResult1").off("click").click( function() { travelTo(obj.gameid, obj.destinations[1].id);});
      $("#destResult2").off("click").click( function() { travelTo(obj.gameid, obj.destinations[2].id);});
      $("#destResult3").off("click").click( function() { travelTo(obj.gameid, obj.destinations[3].id);});
      $("#destResult4").off("click").click( function() { travelTo(obj.gameid, obj.destinations[4].id);});

      console.log(obj)

      var integerCount2 = 0;

      $("#btnSun").click(function(){
        $("#clueResult").text("Clue number " + (integerCount2 + 1) + ": " + obj.clues[integerCount2]); //button for rendering clues
        console.log(obj.clues[integerCount2[0]])
        integerCount2 ++;

        if (integerCount2 > 4){
          integerCount2 = 0;
        }
      });
    }

    if (obj.finalstep == true) {
      console.log('success')
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

  function initializeGame(obj) {

    $(".wiki.screen").addClass("screen-on");
    $("#wiki-content").addClass("screen-content-on");
    $("#wiki-content").attr("src", obj.url); //button for starting game
    $("#resultJson").attr("href", obj.url);
    $("#resultJson").text("Starting Article: " + obj.title);
    $("#clueResult").empty();
    $("#destResult0").empty();
    $("#destResult1").empty();
    $("#destResult2").empty();
    $("#destResult3").empty();
    $("#destResult4").empty();
    $("#finalArticle").empty();

    populateDestinations(obj);
    console.log(obj)

    var integerCount = 0;

    $("#btnSun").click(function(){
      $("#clueResult").text("Clue number " + (integerCount + 1) + ": " + obj.clues[integerCount]); //button for rendering clues
      console.log(obj.clues[integerCount[0]])
      integerCount ++;

      if (integerCount > 4){
        integerCount = 0;
      }
    });

    $("#btnSun2").click(function(){
      $("#finalArticle").empty();
      populateDestinations(obj);
      // console.log(obj)
    });



  }

  $("#game").click(function(){
    $("#hide").removeClass("hidden");
    $.getJSON("/game/new/", initializeGame);
  });

  $("#game-example").click(function () {
    $("#hide").removeClass("hidden");
    $.getJSON("/game/example/", initializeGame);
  });

});
