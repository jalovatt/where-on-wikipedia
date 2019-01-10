$(document).ready(function(){

  var backId;
  var suspectName;

  var gameStarted = false;


  function requestTravel(gameId, articleId) {

    // Show the modal + loading icon
    showModal("Travelling...", htmlFragments.loading());

    // Send the request
    $.getJSON("/game/" + gameId + "/travel/" + articleId)
      .done(function (json) {
        // When the request comes back, populate and show the starting message
        populateDestinations(json);

        showModal("You've arrived!", htmlFragments.travel(json.title));
      })
      .fail(function (json) {
        showModal("Oops!", htmlFragments.travelError(json.responseJSON.error));
      });

  }

  function requestCapture(gameId, articleId, suspectId) {
    suspectName = $('#suspectDropdown').find(":selected").text();

    $.getJSON("/game/" + gameId + "/capture/" + articleId + "/" + suspectId, function(res) {
      if (res.victory === false){
        showModal("Oh dear...", "<em class='centered-text'>" + res.message + "</em><p>The culprit got away, and all of Wikipedia mourns the loss of... well, nobody knows what they lost because it's gone now. Better luck time.</p>");
        console.log(res)
      }
      if (res.victory === true){
        showModal("You did it!", "<p>Congratulations, you've apprehended " + suspectName + " and returned the stolen article. Wikipedia is once again a safe, happy, magical place.");
        console.log(res)
      }
    });
  }

  function populateDestinations(obj) {

    console.log("populating");
    $("#clueResults").empty();

    var clueCount = 0;

    if (obj.deadend){

      $("#destResult0").text(obj.destinations[0]).removeAttr("href").off("click");
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

      $("#backButton").addClass("hidden");

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

      $("#btn-clues").off("click").click(function(){

        if (clueCount > obj.clues.length) return;

        if (obj.finalstep && clueCount === 1) {
          var suspectId = $('#suspectDropdown').find(":selected").val();
          requestCapture(obj.gameid, obj.pageid, suspectId);
          return;
        }

        var clue = obj.clues[clueCount];

        if (!clue) return;

        var clueElement = htmlFragments.clue(clue);
        $("#clueResults").append(clueElement);

        if (clue.match("The suspect is")) {
          $("#suspectClues").append(clueElement);
        }

        clueCount++;
      });
    }
  }

  function showTab(tab) {

    if (!gameStarted && !(tab === "menu" || tab === "help" || tab === "modal")) return;

    var btnId = "#btn-" + tab;
    var tabId = "#tab-" + tab;

    $(".screen-content").toggleClass("scrollable", (tab === "help"));

    $(".button").removeClass("active");
    $(btnId).addClass("active");

    $(".tab").addClass("hidden");
    $(tabId).removeClass("hidden");

  }

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
    travel(title) {return "<p>Have a look around '" + title + "' and see if anybody noticed your quarry.</p>";},
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
    showModal("Fetching game data",
      htmlFragments.loading()
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
    requestGame("new");
  });

  $("#game-example").click(function () {
    requestGame("example");
  });

  $("#game-existing").click(function () {
    var id = $("#game-existing-id").val();

    console.log("id: " + id);

    if (!id || id === "") {
      alert("Please enter a game ID");
    } else {
      requestGame(id);
    }
  });

  $("#suspectDropdown").change(function() {
    $("#suspectLink").attr("href", "https://en.wikipedia.org/?curid=" + this.value);
  });

});
