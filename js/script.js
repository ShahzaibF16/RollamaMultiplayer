var teacherIdx = 0;
var courseData = {};
var currentList = '';
$(document).ready(function () {
  function editableList(listname) {
    var list = document.getElementById(listname);
    var listItems = list.querySelectorAll("li");
    var inputs = list.querySelectorAll("input");

    for (var i = 0; i < listItems.length; i++) {
      setEventListener(listItems[i], inputs[i]);
    }

    function editItem(eventInput, object) {
      if (!object) object = this;
      object.classList.add("edit");
      var inputField = object.querySelector("input");
      inputField.focus();
      inputField.setSelectionRange(0, inputField.value.length);
    }

    function blurInput(event) {
      this.parentNode.classList.remove("edit");

      if (this.value == "") {
        console.log(this.parentNode);
        list.removeChild(this.parentNode);
        if (this.parentNode.getAttribute("data-new")) addChild();
      } else {
        this.previousElementSibling.innerHTML = this.value;

        if (this.parentNode.getAttribute("data-new")) {
          this.parentNode.removeAttribute("data-new");
          addChild();
        }
      }
    }

    function keyInput(event) {
      if (event.which == 13 || event.which == 9) {
        event.preventDefault();
        this.blur();

        if (!this.parentNode.getAttribute("data-new")) {
          editItem(null, this.parentNode.nextElementSibling);
        }
      }
    }

    function setEventListener(listItem, input) {
      listItem.addEventListener("click", editItem);
      input.addEventListener("blur", blurInput);
      input.addEventListener("keydown", keyInput);
    }

    function addChild() {
      var entry = document.createElement("li");
      entry.classList.add("list-group-item");
      entry.innerHTML = "<span>add another</span><input type='text'>";
      entry.setAttribute("data-new", true);
      list.appendChild(entry);
      setEventListener(entry, entry.lastChild);
      updateNameList();
      syncData();
    }
  }

  function displayList(names) {
    var htmlstr = "";
    for (var i = 0; i < names.length; i++) {
      if (names[i]) {
        htmlstr += '<li class="list-group-item"><span>' + names[i] + '</span><input type="text" value="' + names[i] + '" /></li>';
      }
    }
    htmlstr += '<li data-new="true" class="list-group-item"><span>add another</span><input type="text" /></li>';
    $("#list").html(htmlstr);
    editableList("list");
  }

  editableList("list");

  function updateNameList() {
    var names = [];
    $("#list span").each(function () {
      names.push($(this).text());
    });
    names = names.slice(0, names.length - 1);
    if(names.length){
      names.forEach((val) => {
        if (currentList) {
          var kis = Object.keys(courseData[currentList]);
          if (!kis.includes(val)) {
            courseData[currentList][val] = 0;
          }
        } else {
          if (Object.keys(courseData).length) {
            var kis = Object.keys(courseData[Object.keys(courseData)[0]]);
            if (!kis.includes(val)) {
              courseData[Object.keys(courseData)[0]][val] = 0;
            }
          } else {
            courseData["class0"] = {};
            courseData["class0"][val] = 0;
            currentList = "class0";
          }
        }
      });
  
      if (currentList) {
        var kis = Object.keys(courseData[currentList]);
        kis.forEach((val) => {
          if (!names.includes(val)) {
            delete courseData[currentList][val];
          }
        });
      } else {
        if (Object.keys(courseData).length) {
          var kis = Object.keys(courseData[Object.keys(courseData)[0]]);
          kis.forEach((val) => {
            if (!names.includes(val)) {
              delete courseData[Object.keys(courseData)[0]][val];
            }
          });
        } else {
          courseData["class0"][val] = 0;
        }
      }
      Cookies.set("llama_current_clist", currentList);
      editableList("list");
    }
  }

  $(".bulkadd").click(function () {
    var names = [];
    $("#list span").each(function () {
      names.push($(this).text());
    });
    names = names.slice(0, names.length - 1);
    var namestr = "";
    for (var i = 0; i < names.length; i++) {
      namestr += names[i] + "\n";
    }

    $(".namelist").val(namestr);
  });

  $(".svchanges").click(function () {
    var namelist = $(".namelist").val();
    var names = namelist.split("\n");
    var htmlstr = "";
    for (var i = 0; i < names.length; i++) {
      if (names[i]) {
        htmlstr += '<li class="list-group-item"><span>' + names[i] + '</span><input type="text" value="' + names[i] + '" /></li>';
      }
    }
    htmlstr += '<li data-new="true" class="list-group-item"><span>add another</span><input type="text" /></li>';

    $("#list").html(htmlstr);
    editableList("list");
    updateNameList();
    syncData();

    $("#clistmodal_idx").modal("hide");

    $("#clistmodal2").modal("hide");
  });

  function getPoints() {
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

  $("#pointsbtn").click(function () {
    getPoints();
  });


  function pointsHandler() {
    $(".plus_points").click(function () {
      var plusAudio = new Audio("./audio/coin.mp3");
      plusAudio.play();
      var name = $(this).parent().parent().find(".pname").text();
      courseData[currentList][name] += 1;
      getPoints();
      syncData();
    });

    $(".minus_points").click(function () {
      var name = $(this).parent().parent().find(".pname").text();
      courseData[currentList][name] -= 1;
      getPoints();
      syncData();
    });
  }

  $(".resetpts").click(function () {
    var ki = Object.keys(courseData[currentList]);
    ki.forEach((val) => {
      courseData[currentList][val] = 0;
    });
    getPoints();
    syncData();
  });

  if (!Cookies.get("llama_teacher_idx")) {
    $.post("./js/process.php", {
      "add_teacher_idx": "1",
      "course_data": "{}"
    }).done(function (data) {
      Cookies.set("llama_teacher_idx", data);
    });
  } else {
    teacherIdx = Cookies.get("llama_teacher_idx");
    $.post("./js/process.php", {
      "get_course_data": "1",
      "teacher_idx": teacherIdx
    }).done(function (data) {
      courseData = JSON.parse(data);
      cookieCurrentList();
      if (Object.keys(courseData).length && currentList == '') {
        displayList(Object.keys(courseData[Object.keys(courseData)[0]]));
      } else if (currentList != '') {
        displayList(Object.keys(courseData[currentList]));
      }
    });
  }

  function syncData() {
    $.post("./js/process.php", {
      "course_data_sync": "1",
      "sync_data": JSON.stringify(courseData),
      "teacher_idx": teacherIdx
    }).done(function (data) {});
  }

  $(".clistsvchanges").click(function () {

    if (!$("#classListName").val()) {
      alert("Please enter a class name.");
    } else {
      var cnames = {};
      var namelist = $("#cnamelist").val();
      var names = namelist.split("\n");
      for (var i = 0; i < names.length; i++) {
        if (names[i]) {
          cnames[names[i]] = 0;
        }
      }

      courseData[$("#classListName").val()] = cnames;
      syncData();
      $("#clistmodal_2").modal("hide");
    }
  });

  $("#classesList").click(function () {
    var htmlstr = '';
    var keys = Object.keys(courseData);
    var count = 1;
    keys.forEach((val) => {
      htmlstr += '<tr> <th scope="row">' + count + '</th> <td class="cname"><a href="#" class="clistSelect">' + val + '</a></td> <td><span class="editclasslist"><i class="fas fa-edit"></i></span></td> <td><span class="removeclasslist"><i class="fas fa-times"></i></span></td> </tr>';
      count += 1;
    });
    $(".classtable").html(htmlstr);
    selectListener();
  });

  var cname_edit;

  function selectListener() {
    $(".clistSelect").click(function (e) {
      e.preventDefault();
      currentList = $(this).text();
      Cookies.set("llama_current_clist", currentList);
      displayList(Object.keys(courseData[currentList]));
      $("#classes").modal("hide");
    });

    $(".editclasslist").click(function () {
      $("#classes").modal("hide");
      $("#clistmodal_3").modal("show");
      cname_edit = $(this).parent().parent().find(".cname .clistSelect").text();
      $("#classListName2").val(cname_edit);
      var names = Object.keys(courseData[cname_edit]);
      var namestr = "";
      for (var i = 0; i < names.length; i++) {
        namestr += names[i] + "\n";
      }
      $("#cnamelist2").val(namestr);
    });

    $(".removeclasslist").click(function () {
      if (confirm("Do you really wish to delete this class?")) {
        cname_edit = $(this).parent().parent().find(".cname .clistSelect").text();
        delete courseData[cname_edit];
        var htmlstr = '';
        var keys = Object.keys(courseData);
        var count = 1;
        keys.forEach((val) => {
          htmlstr += '<tr> <th scope="row">' + count + '</th> <td class="cname"><a href="#" class="clistSelect">' + val + '</a></td> <td><span class="editclasslist"><i class="fas fa-edit"></i></span></td> <td><span class="removeclasslist"><i class="fas fa-times"></i></span></td> </tr>';
          count += 1;
        });
        $(".classtable").html(htmlstr);
        selectListener();
        if (cname_edit == currentList) {
          $("#list").html('<li data-new="true" class="list-group-item"><span>add another</span><input type="text" /></li>');
          currentList = "";
          Cookies.set("llama_current_clist", currentList);
        }
        syncData();
      }
    });
  }

  $(".clistsvchanges2").click(function () {
    if (!$("#classListName2").val()) {
      alert("Please enter a class name.");
    } else {
      if ($("#classListName2").val().trim() != cname_edit) {
        delete Object.assign(courseData, {
          [$("#classListName2").val()]: courseData[cname_edit]
        })[cname_edit];
        if (currentList == cname_edit) {
          currentList = $("#classListName2").val();
          Cookies.set("llama_current_clist", currentList);
        }
      }
      var namelist = $("#cnamelist2").val();
      var names = namelist.split("\n");
      console.log(names);
      for (var i = 0; i < names.length; i++) {
        if (names[i]) {
          var kis = Object.keys(courseData[$("#classListName2").val()]);
          if (!kis.includes(names[i])) {
            courseData[$("#classListName2").val()][names[i]] = 0;
          }
        }
      }

      var kis = Object.keys(courseData[$("#classListName2").val()]);
      kis.forEach((val) => {
        if (!names.includes(val)) {
          delete courseData[$("#classListName2").val()][val];
        }
      });
      console.log(Object.keys(courseData[currentList]));
      displayList(Object.keys(courseData[currentList]));
      syncData();
      $("#clistmodal_3").modal("hide");
    }
  });

  function cookieCurrentList() {
    if (Cookies.get("llama_current_clist")) {
      currentList = Cookies.get("llama_current_clist");
      displayList(Object.keys(courseData[currentList]));
    }
  }

  function setDifficulty() {
    var diff = Cookies.get("llama_diff");
    if (diff) {
      if (diff == "0") {
        $(".easy-diff").click();
      } else if (diff == "1") {
        $(".mid-diff").click();
      } else if (diff == "2") {
        $(".max-diff").click();
      }
    }
  }

  setDifficulty();
});