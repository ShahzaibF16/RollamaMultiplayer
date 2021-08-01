$(".easy-diff").click(function (e) {
  e.preventDefault();
  $(".diff-img").attr("src", "../img/low_diff.png");
  difficulty = "0";
  Cookies.set("llama_diff", difficulty);
});

$(".mid-diff").click(function (e) {
  e.preventDefault();
  $(".diff-img").attr("src", "../img/mid_diff.png");
  difficulty = "1";
  Cookies.set("llama_diff", difficulty);
});

$(".max-diff").click(function (e) {
  e.preventDefault();
  $(".diff-img").attr("src", "../img/max_diff.png");
  difficulty = "2";
  Cookies.set("llama_diff", difficulty);
});

$(".easy-diff-game").click(function (e) {
  e.preventDefault();
  $(".diff-img").attr("src", "../img/Low_Level_Yellow_Btn_.png");
  difficulty = "0";
});

$(".mid-diff-game").click(function (e) {
  e.preventDefault();
  $(".diff-img").attr("src", "../img/Med_Level_Yellow_Btn_.png");
  difficulty = "1";
});

$(".max-diff-game").click(function (e) {
  e.preventDefault();
  $(".diff-img").attr("src", "../img/Max_Level_Yellow_Btn_.png");
  difficulty = "2";
});

function syncData(){
  $.post("../js/process.php", {"course_data_sync": "1", "sync_data": JSON.stringify(courseData), "teacher_idx": teacherIdx}).done(function(data){
  });
}


  $(".name1, .name2").click(function () {
    var name = $(this).parent().find("h1").text();
    var tis = $(this);
    if (name) {
      if(!tis.hasClass("pointsAdded")){
        courseData[currentList][name] += 1;
        tis.addClass("pointsAdded");
        syncData();
        var plusAudio = new Audio("../audio/coin.mp3");
        plusAudio.play();
      }
      else{
        courseData[currentList][name] -= 1;
        tis.removeClass("pointsAdded");
        syncData();
      }
    }
  });
  
  $(".rollbtn").click(function(){
    $(".name1, .name2").removeClass("pointsAdded");
  });
  
  $("#pointstablebtn").click(function(e){
    e.preventDefault();
  });
  
  
  function getPoints(names){
    $(".ptstable").empty();
    if(currentList){
      var dato = Object.keys(courseData[currentList]);
      var dat = [];
      dato.forEach((val) => {
        var elm = {};
        elm["name"] = val;
        elm["point"] = courseData[currentList][val];
        dat.push(elm);
      });
      dat.sort((a, b) => a.point > b.point && 1 || -1);
      dat.reverse();
      $(".ptstable").empty();
      for (var i = 0; i < dat.length; i++) {
        $(".ptstable").append('<tr> <th scope="row">' + (i + 1) + '</th> <td class="pname">' + dat[i]["name"] + '</td> <td>' + dat[i]["point"] + '</td> <td><span class="plus_points"><i class="fas fa-plus-square"></i></span><span class="minus_points"><i class="fas fa-minus-square"></i></span></td> </tr>');
      }
      pointsHandler();
    }
  }
  
  $(".pointsbtn2").click(function(){
    getPoints(names);
  });
  
  function pointsHandler(){
    $(".plus_points").click(function(){
      var plusAudio = new Audio("../audio/coin.mp3");
      plusAudio.play();
      var name = $(this).parent().parent().find(".pname").text();
      courseData[currentList][name] += 1;
      getPoints();
      syncData();
    });
  
    $(".minus_points").click(function(){
      var name = $(this).parent().parent().find(".pname").text();
      courseData[currentList][name] -= 1;
      getPoints();
      syncData();
    });
  }
  
  $(".resetpts").click(function(){
    var ki = Object.keys(courseData[currentList]);
    ki.forEach((val)=>{
      courseData[currentList][val] = 0;
    });
    getPoints();
    syncData();
  });
  
function setDifficulty(){
  var diff = Cookies.get("llama_diff");
  if(diff){
    if(diff == "0"){
      $(".easy-diff").click();
    }
    else if(diff == "1"){
      $(".mid-diff").click();
    }
    else if(diff == "2"){
      $(".max-diff").click();
    }
  }
}

setDifficulty();

function cookieCurrentList(){
  if(Cookies.get("llama_current_clist")){
    currentList = Cookies.get("llama_current_clist");
  }
}
