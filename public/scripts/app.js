$(document).ready(function(){


  $("#game").click(function(){

    $.getJSON("http://localhost:3000/game/0/travel/153095", function(result){

      var obj = result;
      Object.keys(obj).forEach(function(key, index) {
      // console.log(key, obj[key], index);
      // console.log(key, index)
      if (index == 3) {
            $("div").append("The starting URL is: " + obj.url)
      }
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


  $("#btnSun").click(function(){

    $.getJSON("http://localhost:3000/game/0/travel/153095", function(result){

      var obj = result;
      Object.keys(obj).forEach(function(key, index) {
      // console.log(key, obj[key], index);
      // console.log(key, index)
      if (index == 5) {
            $("div").append("Clue: " + obj.clues[0])
      }

});
  });
});
});

// $(document).ready(function() {
//   $('#btnSun').click(myFunction);
// });

// function myFunction() {
//   alert('hi');
// }



      // $.each(result, function(i, field){

//       //   $("div").append(field + " ");
//       //   console.log(JSON.gameid)
//       // });
// // var res = ''
//       if (result.url == "https://en.wikipedia.org/wiki/Radio_navigation") {
//       for (let results in result){
//         let value = result[results];
//       // console.log(result.gameid)
// // res += result[results].split(":", 1)[0];

//       // console.log(result.destinations[0])
// // console.log(res)
// // console.log(result)
//       // console.log("the result is: ", result.clues[0]);
//       // return result.gameid
//       console.log(result.gameid)
//         $("div").append("The initial start page is:" + result.url);
//     }}
//       else {
//         console.log('nope')
//       }
//     });