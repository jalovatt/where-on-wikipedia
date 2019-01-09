$(document).ready(function(){

  let backId;
  let gameStarted = false;


  if ($("#suspectDropdown").change()){
    $("#suspectDropdown").change(function(){
      var suspectWarrant = $("#suspectDropdown").find(":selected").text();
      console.log(suspectWarrant);
    });
  };


  function requestTravel(gameId, articleId) {

    // Show the modal + loading icon
    showModal("Travelling...", htmlFragments.loading());

    // Send the request
    $.getJSON("/game/" + gameId + "/travel/" + articleId)
      .done(function (json) {
        // When the request comes back, populate and show the starting message
        populateDestinations(json);

        showModal(null, htmlFragments.travel(json.title));
      })
      .fail(function (json) {
        showModal("Oops!", htmlFragments.travelError(json.responseJSON.error));
      });

  }

  function checkCapture(gameId, articleId) {

    const suspectId = 441588;

    $.getJSON("/game/" + gameId + "/capture/" + articleId + "/" + "441588", function(res) {
      console.dir(res);
      showModal("capture status", JSON.stringify(res, null, 2));
    });
  }

  function populateDestinations(obj) {

    console.log("populating");
    $("#clueResults").empty();

    var clueCount = 0;

    if (obj.deadend){

      $("#destResult0").text(obj.destinations[0]);
      $("#destResult0").removeAttr("href");
      $("#destResult1").empty();
      $("#destResult2").empty();
      $("#destResult3").empty();
      $("#destResult4").empty();

      $("#li2").addClass("hidden");
      $("#li3").addClass("hidden");
      $("#li4").addClass("hidden");
      $("#li5").addClass("hidden");

      $("#backButton").removeClass("hidden");
      $("#backButton").text("go back");

      $("#backButton").click(function() {
        requestTravel(obj.gameid, backId);
        // console.log(backId)
        $("#li2").removeClass("hidden");
        $("#li3").removeClass("hidden");
        $("#li4").removeClass("hidden");
        $("#li5").removeClass("hidden");
      });

      $("#btn-clues").off("click").click(function() {
        if (clueCount === 1) return;

        var clue = obj.clues[clueCount];

        if (!clue) return;

        var clueElement = htmlFragments.clue(clue);
        $("#clueResults").append(clueElement); //button for rendering clues

        clueCount ++;

      });

    } else {

      if (obj.pageid) {
        backId = obj.pageid;
      }

      obj.destinations.forEach(function (dest, idx) {
        $("#destResult" + idx)
          .removeClass("hidden")
          .text(dest.title)
          .attr("href", "https://en.m.wikipedia.org/wiki/" + dest.title)
          .off("click")
          .click( function() { requestTravel(obj.gameid, dest.id);});
      });

      // console.log(obj);

      $("#btn-clues").off("click").click(function(){

        if (clueCount > obj.clues.length) return;

        if (obj.finalstep && clueCount === 1) {
          checkCapture(obj.gameid, obj.pageid);
          return;
        }

        var clue = obj.clues[clueCount];

        if (!clue) return;

        var clueElement = htmlFragments.clue(clue);
        $("#clueResults").append(clueElement); //button for rendering clues

        if (clue.match("The suspect is")) {
          $("#suspectClues").append(clueElement);
        }

        clueCount++;
      });
    }

    if (!obj.finalstep) {
      console.log("no success");
    }

    if (obj.finalstep === true) {
      console.log("success");
    }
  }

  function showTab(tab) {

    if (!gameStarted && !(tab === "menu" || tab === "help")) return;

    var btnId = "#btn-" + tab;
    var tabId = "#tab-" + tab;

    $(".screen-content").toggleClass("scrollable", (tab === "help"));

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
    loading() {return "<h1><i class='fa fa-refresh fa-spin'></i></h1>";},
    newGame(json) {return "<p>Someone has stolen the article for '" + json.title + "'. Track them down and get it back before Wikipedia's database notices and the article is lost forever!</p>";},
    newGameError(err) { return "<h4>Something went wrong:</h4>" +
      "<h4>" + err + "</h4>";},
    travel(title) {return "<h2>You've arrived at '" + title + "'</h2>";},
    waitTime() {return "<em>If generating a new game, this may take 10-20 seconds</em>";},
  };


  $("#btn-travel").click(function() {showTab("travel");} );
  $("#btn-search").click(function() {showTab("search");} );
  $("#btn-suspect").click(function() {showTab("suspect");} );
  $("#btn-menu").click(function() {showTab("menu");} );
  $("#btn-help").click(function() {showTab("help");} );

  function initializeGame(obj) {

    gameStarted = true;

    $(".wiki.screen").addClass("screen-on");
    $("#wiki-content").addClass("screen-content-on");
    $("#wiki-content").attr("src", obj.url);
    $("#suspectClues").empty();
    $("#finalArticle").empty();

    populateDestinations(obj);

  }

  function requestGame(id) {

    // Show the modal + loading icon
    showModal("waiting for the server",
      htmlFragments.loading() + "<br>" + htmlFragments.waitTime()
    );

    // Send the request
    $.getJSON("/game/" + id + "/")
      .done(function (json) {
        // When the request comes back, populate and show the starting message
        initializeGame(json);
        showModal("Oh no!", htmlFragments.newGame(json));
      })
      .fail(function (json) {
        showModal("Oops!", htmlFragments.newGameError(json.responseJSON.error));
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
