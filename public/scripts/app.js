$(document).ready(function(){

  function travelTo(gameId, articleId) {
    $.getJSON("/game/" + gameId + "/travel/" + articleId, populateDestinations);

  }

  function checkCapture(gameId, articleId, suspectId) {
    $.getJSON("/game/" + gameId + "/capture/" + articleId + "/" + "441588", function(res) {
      console.dir(res)
      showModal("capture status", JSON.stringify(res));
    });
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

        var clueElement = htmlFragments.clue(clue);
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

  // 'title' will be wrapped in an <h1>
  // 'message' will be used as-is, so should have any necessary HTML already
  function showModal(title, message) {
    var modal = $("#tab-modal").empty();

    if (title && title !== "") modal.append("<h1>" + title + "</h1>");
    modal.append(message);

    showTab("modal");
  }

  var htmlFragments = {
    clue(text) {return "<li class='clue'>" + text + "</li>";},
    loading() {return "<i class='fa fa-refresh fa-spin'></i> Loading";},


  };


  $("#btn-travel").click(function() {showTab("travel");} );
  $("#btn-search").click(function() {showTab("search");} );
  $("#btn-suspect").click(function() {showTab("suspect");} );
  $("#btn-menu").click(function() {showTab("menu");} );
  $("#btn-help").click(function() {showTab("help");} );

  function initializeGame(obj) {

    $(".wiki.screen").addClass("screen-on");
    $("#wiki-content").addClass("screen-content-on");
    $("#wiki-content").attr("src", obj.url); //button for starting game
    // $("#resultJson").attr("href", obj.url);
    // $("#resultJson").text("Starting Article: " + obj.title);
    $("#clueResult").empty();
    $("#destResult0").empty();
    $("#destResult1").empty();
    $("#destResult2").empty();
    $("#destResult3").empty();
    $("#destResult4").empty();
    $("#finalArticle").empty();

    populateDestinations(obj);

  }

  function requestGame(id) {

    // Show the modal + loading icon
    showModal("Waiting for the server",
      htmlFragments.loading() +
      "<br><em>If generating a new game, this may take 10-20 seconds</em>"
    );

    // Send the request
    $.getJSON("/game/" + id + "/")
      .done(function (json) {
        // When the request comes back, populate and show the starting message
        initializeGame(json)

        showModal("Oh no!", "<p>Someone has stolen XXXXX. Track them down and get it back!</p>");

      })
      .fail(function (json) {
        showModal("Oops!", "Something went wrong:" + JSON.stringify(json));
      });

  }

  $("#game").click(function(){
    // $("#hide").removeClass("hidden");
    requestGame("new");
  });

  $("#game-example").click(function () {
    // $("#hide").removeClass("hidden");
    requestGame("example");
  });

  $("#game-existing").click(function () {
    var id = $("#game-existing-id").val();

    console.log("id: " + id);

    if (!id || id === "") {
      alert("Please enter a game ID");
    } else {
      // $("#hide").removeClass("hidden");
      requestGame(id);
    }
  });

});
