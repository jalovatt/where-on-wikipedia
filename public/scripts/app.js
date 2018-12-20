$(document).ready(function(){


  $("#game").click(function(){

    $.getJSON("http://localhost:3000/game/0/travel/153095", function(result){

      var obj = result;
      Object.keys(obj).forEach(function(key, index) {
      console.log(key, obj[key], index);



        if (index == 3) {

              $("#resultJson").text("The starting URL is: " + obj.url)

        }


      // if ("div".append === "The starting URL is: " + obj.url) {
      //   console.log("apple")
      // }
      //  if (index == 1) {
      //   console.log(obj.pageid)
      // }
      // console.log(obj.gameid.index)
      // console.log(obj.gameid[index])
});
  });
});
});

$(document).ready(function(){
    var integerCount = 0;


  $("#btnSun").click(function(){

    $.getJSON("http://localhost:3000/game/0/travel/153095", function(result){

      var obj = result;
      Object.keys(obj).forEach(function(key, index) {


    $("#clueResult").text("Clue: " + obj.clues[integerCount])
    integerCount ++;
    console.log(integerCount)

    if (integerCount > 4){
      integerCount = 0;
    }


});
  });
});
});





