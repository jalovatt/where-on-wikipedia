$(document).ready(function(){

  function travelTo(gameId, articleId) {
    $.getJSON("/game/" + gameId + "/travel/" + articleId, populateDestinations);

  }

  function checkCapture(gameId, articleId, suspectId) {
    $.getJSON("/game/" + gameId + "/capture/" + articleId + "/" + "441588", function(res) {console.dir(res);});
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

      var clueCount = 0;

      $("#btn-clues").off("click").click(function(){

        if (clueCount > obj.clues.length) return;

        var clue = obj.clues[clueCount];

        if (!clue) return;

        var clueElement = '<li class="clue">' + clue + "</li>";
        $("#clueResults").append(clueElement); //button for rendering clues

        if (clue.match("The suspect is")) {
          $("#suspectClues").append(clueElement);
        }

        clueCount ++;
      });
    }

    if (!obj.finalstep) {
      console.log("no success");
    }

    if (obj.finalstep === true) {
      console.log("success");
      checkCapture(obj.gameid, obj.pageid, 441588)
    }
  }

  function showTab(tab) {
    var btnId = "#btn-" + tab;
    var tabId = "#tab-" + tab;

    $(".button").removeClass("active");
    $(btnId).addClass("active");

    $(".tab").addClass("hidden");
    $(tabId).removeClass("hidden");
  }

  $("#btn-travel").click(function() {showTab("travel");} );
  $("#btn-search").click(function() {showTab("search");} );
  $("#btn-suspect").click(function() {showTab("suspect");} );
  $("#btn-menu").click(function() {showTab("menu");} );
  $("#btn-help").click(function() {showTab("help");} );

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
