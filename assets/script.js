$(function () {
    $("#datepicker").datepicker();
});

function getMap(lat, lon) {
    fetch("https://www.mapquestapi.com/staticmap/v5/map?key=lCzrKhevQBbPeLBz5rv7JRWrlYKVnVae&center=" + lat + "," + lon)
        .then(response => {
            console.log(response);
            document.getElementById("map").setAttribute("src", response.url);
        })
}
//getMap()

var ul = $("#missionName");

fetch("https://lldev.thespacedevs.com/2.2.0/launch/?limit=100&window_start__gte=2022-02-10T00%3A00%3A00Z&window_start__lte=2022-02-11T00%3A00%3A00Z")
    .then(function (response) {
        if (response.ok) return response.json();
    })
    .then(function (launches) {
        ul.empty();

        $.each(launches.results, function (i, launch) {
            console.log(launch)
            var li = $("<li>");
            li.text(launch.mission.name);
            ul.append(li);
        })
        //var coordinates = launch.pad..latitude.longitude;
    })

ul.on("click", "li", function () {
    getMap(5.3019, -52.8346);
})








