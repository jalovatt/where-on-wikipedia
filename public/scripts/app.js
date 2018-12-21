// $(document).ready(function(){

//   $("#game").click(function(){

//     $.getJSON("/game/new/", function(result){
//      console.log(result)

//   });
// });
// });

$(document).ready(function(){

  $("#game").click(function(){

    $.getJSON("/game/new/", function(result){

      var obj = result;
      console.log(result)
      Object.keys(obj).forEach(function(key, index) {
      // console.log(key, obj[key], index);

        if (index) {
           $('#wiki-content').attr('src', obj.url); //button for starting game
           $("#resultJson").text("Starring Article: " + obj.title) //button for rendering clues
        }
  });

      var integerCount = 0;

      $("#btnSun").click(function(){
        Object.keys(obj).forEach(function(key, index) {

      $("#clueResult").text("Clue: " + obj.clues[integerCount]) //button for rendering clues
      integerCount ++;

      if (integerCount > 4){
        integerCount = 0;
    }
});
  });
      var integerCount2 = 0

      $("#btnSun2").click(function(){
        Object.keys(obj).forEach(function(key, index) {

      $("#destResult").text(obj.destinations[integerCount])
      $('#wiki-content').attr('src', "https://en.m.wikipedia.org/wiki/" + obj.destinations[integerCount]);
      integerCount ++;


      if (integerCount > 4){
        integerCount = 0;
    }
});
  });
});
});

});



// $(document).ready(function(){
//     var integerCount = 0;

//   $("#btnSun2").click(function(){
//     $.getJSON("http://localhost:3000/game/example/travel/153095", function(result){
//       var obj = result;

//       Object.keys(obj).forEach(function(key, index) {
//     $("#destResult").text(obj.destinations[integerCount])
//     $('#wiki-content').attr('src', "https://en.m.wikipedia.org/wiki/" + obj.destinations[integerCount]);
//     integerCount ++;
//     console.log(integerCount)
//     // console.log(/game/new)
//     // $('#wiki-content').attr('src', "https://en.m.wikipedia.org/wiki/" + destinations[integerCount]);

//    if (integerCount > 4){
//       integerCount = 0;
//     }
// });
//   });
// });
// });
