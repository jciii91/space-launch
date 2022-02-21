// wait for document to load
$(document).ready(function () {
  M.AutoInit();
  
  // global variable initialization
  var badDatesArray = [];
  var launchData = [];
  var savedLaunches = [];

  // check for saved launches
  function checkLocal() {
    favorites = JSON.parse(localStorage.getItem("saveData"));
    if (favorites != null) {
      savedLaunches = favorites;
    }
  }

  // default mission for page load
  function firstMission() {
    fetch ("https://lldev.thespacedevs.com/2.2.0/launch/aed29ce0-d4e3-4177-b286-d186c7b21354/")
      .then (response => response.json())
      .then (data => {
        var launch = data;
        try {
          getMap(launch.pad.latitude, launch.pad.longitude);
        } catch (TypeError) {
          document.getElementById("mapImg").setAttribute("src", "./assets/images/image-not-available.jpg");
        }
        showMissionData(launch);
        serviceProvider(launch);
        missionDesc(launch);
      })
  }

  // fetch map from mapquest api
  // coordinates used are from li item clicked
  function getMap(lat, lon) {
    fetch(
      "https://www.mapquestapi.com/staticmap/v5/map?key=lCzrKhevQBbPeLBz5rv7JRWrlYKVnVae&center=" +
        lat +
        "," +
        lon
        + "&type=hyb&locations=" +
        lat +
        "," +
        lon
        + "&defaultMarker=marker-880808"
    ).then((response) => {
      document.getElementById("mapImg").setAttribute("src", response.url);
    });
  }

  // if available, updates card with image and link to launch pad info
  function showMissionData(missionData) {
    try {
      if (missionData.image == null) {
        document.getElementById("vessleImg").setAttribute("src", "./assets/images/image-not-available.jpg");
      } else {
        document.getElementById("vessleImg").setAttribute("src", missionData.image);
      }
    } catch (TypeError) {
      document.getElementById("mapImg").setAttribute("src", "./assets/images/image-not-available.jpg");
    }
    document.getElementById("info").innerText = missionData.name;
    link = document.getElementById("padLink");
    if (missionData.pad.wiki_url == "") {
      link.setAttribute("href", "javascript: void(0)");
      link.target = "";
    } else {
      link.setAttribute("href", missionData.pad.wiki_url);
      link.target = "_blank";
    }
  }

  // display service provider name on card
  function serviceProvider(providerInfo) {
    document.getElementById("service-provider").innerText =
      providerInfo.launch_service_provider.name;
  }

  // display mission description on card if available
  function missionDesc(missionDesc) {
    try {
      document.getElementById("mission-desc").innerText =
        missionDesc.mission.description;
    } catch (TypeError) {
      document.getElementById("mission-desc").innerText =
        "No mission description available.";
    }
  }

  // check selected month for days that have launch data
  // fetch is sent to Launch Library API, returned array contains any launch objects from the chosen month
  // any dates that do not have start windows for a launch are disabled and cannot be selected
  function getBadDates(inputYear, inputMonth) {
    badDatesArray = [];
    var maxDay = 31;

    switch (inputMonth) {
      case "January":
        month = "01";
        nextMonth = "02";
        nextYear = inputYear;
        maxDay = 31;
        break;
      case "February":
        month = "02";
        nextMonth = "03";
        nextYear = inputYear;
        maxDay = 28;
        if (inputYear % 4 == 0) {
          maxDay = 29;
        }
        break;
      case "March":
        month = "03";
        nextMonth = "04";
        nextYear = inputYear;
        maxDay = 31;
        break;
      case "April":
        month = "04";
        nextMonth = "05";
        nextYear = inputYear;
        maxDay = 30;
        break;
      case "May":
        month = "05";
        nextMonth = "06";
        nextYear = inputYear;
        maxDay = 31;
        break;
      case "June":
        month = "06";
        nextMonth = "07";
        nextYear = inputYear;
        maxDay = 30;
        break;
      case "July":
        month = "07";
        nextMonth = "08";
        nextYear = inputYear;
        maxDay = 31;
        break;
      case "August":
        month = "08";
        nextMonth = "09";
        nextYear = inputYear;
        maxDay = 31;
        break;
      case "September":
        month = "09";
        nextMonth = "10";
        nextYear = inputYear;
        maxDay = 30;
        break;
      case "October":
        month = "10";
        nextMonth = "11";
        nextYear = inputYear;
        maxDay = 31;
        break;
      case "November":
        month = "11";
        nextMonth = "12";
        nextYear = inputYear;
        maxDay = 30;
        break;
      case "December":
        month = "12";
        nextMonth = "01";
        nextYear = parseInt(inputYear) + 1;
        maxDay = 31;
        break;
    }

    fetch(
      "https://lldev.thespacedevs.com/2.2.0/launch/?limit=100&window_start__gte=" +
        inputYear +
        "-" +
        month +
        "-01T00%3A00%3A00Z&window_start__lt=" +
        nextYear +
        "-" +
        nextMonth +
        "-01T00%3A00%3A00Z"
    )
      .then((response) => response.json())
      .then((data) => {
        for (var i = 0; i < data.count; i++) {
          launches = data.results;
          badDatesArray.push(launches[i].window_start.slice(0, 10));
        }

        calendar = document.createElement("input");
        calendar.setAttribute("type", "input");
        calendar.setAttribute("id", "datePicker");
        calendar.setAttribute("class", "datepicker");

        document.getElementById("buttonHolder").appendChild(calendar);

        var calID = $("#datePicker");
        var checkButtonPosition = $("#setMonth").offset();
        calID.css({left:checkButtonPosition.left - 100});

        monthInt = parseInt(month) - 1;
        calID.datepicker({
          autoClose: true,
          defaultDate: new Date(year,monthInt,1),
          minDate: new Date(year,monthInt,1),
          maxDate: new Date(year,monthInt,maxDay),
          disableDayFn: function (date) {
            var string = jQuery.datepicker.formatDate("yy-mm-dd", date);
            var array = badDatesArray;
            return array.indexOf(string) == -1;
          },
          onClose: function () {
            output = this.date;
            formattedOuput = jQuery.datepicker.formatDate("yy-mm-dd", output);
            secondDate = formattedOuput.slice(0, 5) + nextMonth + "-01";
            getMissionData(formattedOuput, secondDate);
            calID.remove();
          }
        });
        calID[0].click();
      });
  }

  // lists the missions from the selected date
  function getMissionData(firstDate, secondDate) {
    var ul = $("#missionName");

    fetch(
      "https://lldev.thespacedevs.com/2.2.0/launch/?limit=100&window_start__gte=" +
        firstDate +
        "T00%3A00%3A00Z&window_start__lt=" +
        secondDate +
        "T00%3A00%3A00Z"
    )
      .then(function (response) {
        if (response.ok) return response.json();
      })
      .then(function (launches) {
        ul.empty();

        $.each(launches.results, function (i, launch) {
          launchData = launches.results;
          var li = $("<li>");
          li.text(launch.name);
          ul.append(li);
          var faveBtn = document.createElement("button");
          faveBtn.innerHTML = `<a class="btn-floating btn-small waves-effect waves-light black"><i class="material-icons">+</i></a>`;
          ul.append(faveBtn);
        });
      });
  }

  // lists the next 10 launches that will occur
  // uses the current date as the starting point
  function getNextLaunches() {
    fetch("https://lldev.thespacedevs.com/2.2.0/launch/upcoming")
      .then((response) => response.json())
      .then((data) => {
        var ul = $("#missionName");
        var launches = data;

        ul.empty();
        $.each(launches.results, function (i, launch) {
          launchData = launches.results;
          var li = $("<li>");
          li.text(launch.name);
          ul.append(li);
          var faveBtn = document.createElement("button");
          faveBtn.innerHTML = `<a class="btn-floating btn-small waves-effect waves-light black"><i class="material-icons">+</i></a>`;
          ul.append(faveBtn);
        });
      });
  }

  // opens modal showing saved launches
  // selecting a launch from the list will fetch the most recent data from the API
  function showFavorites() {
    modalContent = document.getElementsByClassName("modal-content");
    var index = 0;
    if (modalContent.length > 1) {
      index = 1;
    }
    listOfFavorites = document.createElement("ul");
    listOfFavorites.setAttribute("id","ulFav");
    for (var i = 0; i < savedLaunches.length; i++) {
      var listItem = document.createElement("li");
      listItem.innerText = savedLaunches[i].name;
      listOfFavorites.append(listItem);
    }
    modalContent[index].append(listOfFavorites);
  }

  // saves a launch to favorites
  // duplicate launches not saved
  function saveFavorites(item) {
    var flag = false;
    for (let i = 0; i < savedLaunches.length; i++) {
      if (savedLaunches[i].url == item.url) {
        flag = true;
      }
    }
    if (flag) {
      return;
    }
    savedLaunches.push(item);
    localStorage.setItem("saveData", JSON.stringify(savedLaunches));
  }

  // clears saved launches from localStorage
  function clearFavorites() {
    list = document.getElementById("ulFav");

    if (list == null) {
      return;
    }

    list.remove();
    localStorage.removeItem("saveData");
    savedLaunches = [];
  }

  // fetches selected launch from favorites list
  function loadFavorite(url) {
    fetch(url)
      .then (response => response.json())
      .then (data => {
        launchObject = data;
        try {
          getMap(launchObject.pad.latitude, launchObject.pad.longitude);
        } catch (TypeError) {
          document.getElementById("mapImg").setAttribute("src", "./assets/images/image-not-available.jpg");
        }
        showMissionData(launchObject);
        serviceProvider(launchObject);
        missionDesc(launchObject);
        $(".modal").modal("close");
      })
  }

  // listener clears favorites list when modal closes
  // prevents list from being printed repeatedly
  $('.modal').modal({
    onCloseStart: function () {
      list = document.getElementById("ulFav");
      if (list == null) {
        return;
      }
      list.remove();
    }
  });

  // listener for the Check for Launches Button
  $("#setMonth").on("click", function () {
    year = $("#launchYear")[0].value;
    month = $("#monthsList")[0].value;
    getBadDates(year, month);
  });

  // listener for the Next 10 Launches button
  $("#next10").on("click", function () {
    getNextLaunches();
  });

  // listener for the Select From Favorites button
  $("#favorites").on("click", function () {
    showFavorites();
  });

  // listener for the Clear Favorites button in the modal
  $("#clearFavorites").on("click", function () {
    clearFavorites();
  });

  // listener for the li elements in the Favorites modal
  $("#selectWindow").on("click", "li", function () {
    var child = this;
    var parent = child.parentNode;
    var index = Array.prototype.indexOf.call(parent.children, child);
    var launch = savedLaunches[index];
    console.log(launch);
    loadFavorite(launch.url);
  });

  // listener for the li elements in the missions list
  $("ul").on("click", "li", function () {
    var child = this;
    var parent = child.parentNode;
    var index = Math.ceil((Array.prototype.indexOf.call(parent.children, child) - 1) / 2);
    var launch = launchData[index];
    
    try {
      getMap(launch.pad.latitude, launch.pad.longitude);
    } catch (TypeError) {
      document.getElementById("mapImg").setAttribute("src", "./assets/images/image-not-available.jpg");
    }
    showMissionData(launch);
    serviceProvider(launch);
    missionDesc(launch);
  });

  // listener for the Save buttons
  $("ul").on("click", "button", function () {
    var child = this;
    var parent = child.parentNode;
    var index = (Array.prototype.indexOf.call(parent.children, child) - 1) / 2;
    var launch = launchData[index];
    var favoriteItem = {
      name: launch.name,
      url: launch.url,
    };
    saveFavorites(favoriteItem);
  });

  checkLocal();
  firstMission();
});
