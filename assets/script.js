$(document).ready(function () {
  M.AutoInit();

  var badDatesArray = [];
  var launchData = [];

  function getMap(lat, lon) {
    fetch(
      "https://www.mapquestapi.com/staticmap/v5/map?key=lCzrKhevQBbPeLBz5rv7JRWrlYKVnVae&center=" +
        lat +
        "," +
        lon
    ).then((response) => {
      document.getElementById("mapImg").setAttribute("src", response.url);
      console.log(response);
    });
  }

  function showMissionData(missionData) {
    console.log(missionData.image);
    document.getElementById("vessleImg").setAttribute("src", missionData.image);
    document.getElementById("info").innerText = missionData.name;
    document
      .getElementById("padLink")
      .setAttribute("href", missionData.pad.wiki_url);
  }

  function serviceProvider(providerInfo) {
    console.log(providerInfo.launch_service_provider.name);
    document.getElementById("service-provider").innerText =
      providerInfo.launch_service_provider.name;
  }
  function missionDesc(missionDesc) {
    document.getElementById("mission-desc").innerText =
      missionDesc.mission.description;
  }

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

        document.getElementById("calendarHolder").appendChild(calendar);

        var calID = $("#datePicker");

        calID.datepicker({
          minDate: month + "/01/" + year,
          maxDate: month + "/" + maxDay + "/" + year,
          beforeShowDay: function (date) {
            var string = jQuery.datepicker.formatDate("yy-mm-dd", date);
            var array = badDatesArray;
            return [array.indexOf(string) != -1];
          },
          onClose: function (date) {
            firstDate =
              date.slice(6, 10) +
              "-" +
              date.slice(0, 2) +
              "-" +
              date.slice(3, 5);
            secondDate = firstDate.slice(0, -5) + nextMonth + "-01";
            getMissionData(firstDate, secondDate);
            calID.remove();
          },
        });
        calID[0].focus();
      });
  }

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
          console.log(launch);
          var li = $("<li>");
          li.text(launch.name);
          ul.append(li);
          // var btn = $("<button>");
          // btn.classList.add("btn waves-effect waves-light"<i class="material-icons right">send</i>)
          var faveBtn = document.createElement("button");
          faveBtn.innerHTML = `<a class="btn-floating btn-small waves-effect waves-light black"><i class="material-icons">+</i></a>`;
          ul.append(faveBtn);
        });
        //var coordinates = launch.pad..latitude.longitude;
      });
  }

  $("#setMonth").on("click", function () {
    year = $("#launchYear")[0].value;
    month = $("#monthsList")[0].value;
    getBadDates(year, month);
  });

  $("ul").on("click", "li", "button", function () {
    var child = this;
    var parent = child.parentNode;
    var index = Array.prototype.indexOf.call(parent.children, child);
    var launch = launchData[index];
    getMap(launch.pad.latitude, launch.pad.longitude);
    showMissionData(launch);
    serviceProvider(launch);
    missionDesc(launch);
  });
});
