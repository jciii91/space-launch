function getMap(lat,lon) {
    fetch("https://www.mapquestapi.com/staticmap/v5/map?key=lCzrKhevQBbPeLBz5rv7JRWrlYKVnVae&center=" + lat + ","+ lon)
    .then(response => {
        console.log(response);
        document.getElementById("map").setAttribute("src",response.url);
    })
}

getMap(40.7128,-74.0060);