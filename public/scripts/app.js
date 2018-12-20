$(document).ready(function(){


  $("#game").click(function(){

    $.getJSON("http://localhost:3000/game/0/travel/153095", function(result){

      // $.each(result, function(i, field){

      //   $("div").append(field + " ");
      //   console.log(JSON.gameid)
      // });
      for (let results in result){
      if (result.gameid == "example") {
      // console.log(result[r])
      console.log(result.gameid)

      console.log(result.title)

      console.log("the result is: ", result.gameid);
      // return result.gameid
        $("div").append("The initial start page is:" + result.url);
    }
      else {
        console.log('nope')
      }}
    });
  });
});

$(document).ready(function() {
  $('#btnSun').click(myFunction);
});

function myFunction() {
  alert('hi');
}
