var globals = {
  backId: 0,
  gameStarted: false
};

// Trying to keep all of our HTML strings in one place
var htmlFragments = {
  clue(text) {return "<li class='clue'>" + text + "</li>";},
  loading() {return "<h1><i class='fa fa-refresh fa-spin'></i></h1>";},
  newGame(json) {return "<p>Someone has stolen the article for '" + json.title + "'. Track them down and get it back before Wikipedia's database notices and the article is lost forever!</p>";},
  newGameError(err) { return "<h4>Something went wrong:</h4>" +
    "<h4>" + err + "</h4>";},
  travel(title) {return "<p>Have a look around '" + title + "' and see if anybody noticed your quarry.</p>";},
};

$(document).ready(function(){

  $("#btn-travel").click(   function() {showTab("travel");} );
  $("#btn-search").click(   function() {showTab("search");} );
  $("#btn-suspect").click(  function() {showTab("suspect");} );
  $("#btn-menu").click(     function() {showTab("menu");} );
  $("#btn-help").click(     function() {showTab("help");} );

  $("#game").click(         function() {requestGame("new");} );
  $("#game-example").click( function() {requestGame("example");} );

  // Allow the user to request a specific game by its ID. Disabled in the HTML
  // for now, until we have a nice way to display game IDs to the user.
  $("#game-existing").click(function () {
    var id = $("#game-existing-id").val();

    if (!id || id === "") {
      alert("Please enter a game ID");
    } else {
      requestGame(id);
    }
  });

  $("#menu-suspect").change(function() {
    $("#btn-view-suspect").attr("href", "https://en.wikipedia.org/?curid=" + this.value);
  });

  showTab("help");

});

// Request a game from the server by id, or generate a new one if id = "new"
function requestGame(id) {

  // Show the modal + loading icon
  showModal("Fetching game data",
    htmlFragments.loading()
  );

  $.getJSON("/game/" + id + "/")
    .done(function (json) {
      initializeGame(json);
      showModal("Oh no!", htmlFragments.newGame(json));
    })
    .fail(function (json) {
      showModal("Oops!", htmlFragments.newGameError(json.responseJSON.error));
    });
}

function requestTravel(gameId, articleId) {

  // Show the modal + loading icon
  showModal("Travelling...", htmlFragments.loading());

  // Send the request
  $.getJSON("/game/" + gameId + "/travel/" + articleId)
    .done(function (json) {
      // When the request comes back, populate and show the starting message
      populateStep(json);

      showModal("You've arrived!", htmlFragments.travel(json.title));
    })
    .fail(function (json) {
      showModal("Oops!", htmlFragments.travelError(json.responseJSON.error));
    });

}

function requestCapture(gameId, articleId, suspectId) {
  var suspectName = $("#menu-suspect").find(":selected").text();

  $.getJSON("/game/" + gameId + "/capture/" + articleId + "/" + suspectId, function(res) {
    if (res.victory === false){
      showModal("Oh dear...", "<em class='centered-text'>" + res.message + "</em><p>The culprit got away, and all of Wikipedia mourns the loss of... well, nobody knows what they lost because it's gone now. Better luck time.</p>");
    }
    if (res.victory === true){
      showModal("You did it!", "<p>Congratulations, you've apprehended " + suspectName + " and returned the stolen article. Wikipedia is once again a safe, happy, magical place.");
    }
  });
}

function initializeGame(obj) {
  globals.gameStarted = true;

  $(".wiki.screen").addClass("screen-on");
  $("#wiki-content").addClass("screen-content-on");
  $("#wiki-content").attr("src", obj.url);
  $("#suspectClues").empty();
  $("#finalArticle").empty();

  $(".button").removeClass("disabled");

  populateStep(obj);
}

function populateStep(step) {

  $("#clueResults").empty();

  var clueCount = 0;

  if (step.deadend){

    $("#destResult0").text(step.destinations[0]).removeAttr("href").off("click");
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
      requestTravel(step.gameid, globals.backId);

      $("#li2").removeClass("hidden");
      $("#li3").removeClass("hidden");
      $("#li4").removeClass("hidden");
      $("#li5").removeClass("hidden");
    });

    $("#btn-clues").off("click").click(function() {
      if (clueCount === 1) return;

      var clue = step.clues[clueCount];
      if (!clue) return;

      var clueElement = htmlFragments.clue(clue);
      $("#clueResults").append(clueElement);

      clueCount++;
    });

  } else {

    $("#backButton").addClass("hidden");

    if (step.pageid) {
      globals.backId = step.pageid;
    }

    step.destinations.forEach(function (dest, idx) {
      $("#destResult" + idx)
        .removeClass("hidden")
        .text(dest.title)
        .attr("href", "https://en.m.wikipedia.org/wiki/" + dest.title)
        .off("click")
        .click( function() { requestTravel(step.gameid, dest.id);});
    });

    $("#btn-clues").off("click").click(function(){

      if (clueCount > step.clues.length) return;

      if (step.finalstep && clueCount === 1) {
        var suspectId = $("#menu-suspect").find(":selected").val();
        requestCapture(step.gameid, step.pageid, suspectId);
        return;
      }

      var clue = step.clues[clueCount];

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

  if (!globals.gameStarted && !(tab === "menu" || tab === "help" || tab === "modal")) return;

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
