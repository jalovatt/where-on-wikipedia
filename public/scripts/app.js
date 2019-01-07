$(document).ready(function(){

  function travelTo(gameId, articleId) {
    $.getJSON("/game/" + gameId + "/travel/" + articleId, populateDestinations);

  }

  function populateDestinations(obj) {

    console.log("populating");

    $("#clueResults").empty();

    if (obj.deadend){

      $("#destResult0").text(obj.destinations[0]);
      $("#destResult0").removeAttr("href");
      $("#destResult1").empty();
      $("#destResult2").empty();
      $("#destResult3").empty();
      $("#destResult4").empty();
    }
    else {

      obj.destinations.forEach(function (dest, idx) {
        $("#destResult" + idx)
          .text(dest.title)
          .attr("href", "https://en.m.wikipedia.org/wiki/" + dest.title)
          .off("click")
          .click( function() { travelTo(obj.gameid, dest.id);});
      });

      console.log(obj);

      var integerCount = 0;

      $("#btn-clues").click(function(){

        if (integerCount > 4) return;

        const clue = obj.clues[integerCount];

        if (!clue) return;

        const clueElement = '<li class="clue">' + clue + "</li>";

        $("#clueResults").append(clueElement);
        if (clue.match("The suspect is")) {
          $("#suspectClues").append(clueElement);
        }

        integerCount ++;

      });
    }

    if (obj.finalstep == true) {
      console.log("success");
    }
  }

  function showTab(event) {
    var btn = event.target;
    var tabId = "tab-" + btn.id.match(/btn-(.+)/)[1];

    $(".button").removeClass("active");
    $(btn).addClass("active");

    $(".tab").addClass("hidden");
    $("#" + tabId).removeClass("hidden");
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
    $("#clueResults").empty();
    $("#destResult0").empty();
    $("#destResult1").empty();
    $("#destResult2").empty();
    $("#destResult3").empty();
    $("#destResult4").empty();
    $("#finalArticle").empty();

    populateDestinations(obj);
    console.log(obj);

    var integerCount = 0;

    // $("#btn-clues").click(function(){

    //   if (integerCount > 4) return;

    //   $("#clueResults").append('<li class="clue">' + obj.clues[integerCount] + "</li>");
    //   // $("#clueResults").text("Clue number " + (integerCount + 1) + ": " + obj.clues[integerCount]); //button for rendering clues
    //   // console.log(obj.clues[integerCount[0]]);
    //   integerCount ++;

    // });

    // $("#btnSun2").click(function(){
    //   $("#finalArticle").empty();
    //   populateDestinations(obj);
    //   // console.log(obj)
    // });



  }

  $("#game").click(function(){
    $("#hide").removeClass("hidden");
    $.getJSON("/game/new/", initializeGame);
  });

  $("#game-example").click(function () {
    $("#hide").removeClass("hidden");
    $.getJSON("/game/example/", initializeGame);
  });

  $("#game-existing").click(function () {
    var id = $("#game-existing-id").val();

    console.log("id: " + id);

    if (!id || id === "") {
      alert("Please enter a game ID");
    } else {
      $("#hide").removeClass("hidden");
      $.getJSON("/game/" + id + "/", initializeGame);
    }
  });

});
