function getMedia() {
  /* Ask the server for the media Data */
  url = window.location.href.split('/');
  let search = url[0] + "//" + url[2] + "/db/get/" + url[4];

  searchMedia(search).then(result => {
    loadMedia(JSON.parse(result));
  });
  
  console.error("testing some other shit this is broken");
}

function loadMedia(data) {
  /* Parse data from server and loop though it */
  var json = data;

  // clear the waveform player (mainly for the playlist thing)
  document.getElementById("mediaInfo").innerHTML = "";
  document.getElementById("audioPlayer").innerHTML = "";

  for (var key in json) {
    // skip loop if the property is from prototype
    if (!json.hasOwnProperty(key)) continue;

    var obj = json[key];
    for (var prop in obj) {
        // skip loop if the property is from prototype
      if (!obj.hasOwnProperty(prop)) continue;

      /* Object prop is what i wanted i can now start using the ojects to create html */
      var audio = JSON.parse(JSON.stringify(obj[prop]));

      loadInfo(audio);
    }
  }
}

function search(path, page) {
  // create the search request here and then send it to the search thing
  url = window.location.href.split('/');
  page = parseInt(page) - 1;

  if (path == "") {
    path = "all";
    document.title = "Search: Everything";
  } else {
    document.title = "Search: " + path;
  }
  let search = url[0] + "//" + url[2] + "/db/search/" + path + "/" + page;

  searchMedia(search).then(result => {
    console.log(JSON.parse(result));
    searchResults(JSON.parse(result));
  });

  pagesBar(page);
}

function searchResults(data) {
  // turn the json array into HTML
  audioList.innerHTML = "";
  var json = data;

  for (var key in json) {
    if (!json.hasOwnProperty(key)) continue;
    var obj = json[key];
    for (var prop in obj) {
      if (!obj.hasOwnProperty(prop)) continue;
      let audio = JSON.parse(JSON.stringify(obj[prop]));

      /* Main shit */
      let row = document.createElement("div");
      let name = document.createElement("p");
      let length = document.createElement("p");
      let addBtn = document.createElement("img");

      let extraInfo = "";
      if (audio.artist) { extraInfo = extraInfo.concat("<br />Artist: " + audio.artist); }
      if (audio.album) { extraInfo = extraInfo.concat("<br />Album: " + audio.album); }

      name.innerHTML = "Name: " + audio.name + extraInfo;
      name.className = "topLeft";

      let starRating = "";
      if (audio.rating != "-1") {
        for (let i = parseInt(audio.rating); i != 0; i--) { starRating = starRating.concat("&starf;"); }
        for (let i = 5 - parseInt(audio.rating); i != 0; i--) { starRating = starRating.concat("&star;"); }
      } else { for (let i = 5; i != 0; i--) { starRating = starRating.concat("&star;"); } }

      addBtn.src = "/resources/media/icon/addBtn.svg";
      addBtn.className = "topRight";

      length.innerHTML = "Length: " + audio.length + "<br />Rating: " + starRating;
      length.className = "bottomRight";

      row.appendChild(name);
      row.appendChild(addBtn);
      row.appendChild(length);

      let imgPath = "/resources/media/thumbs/" + audio.waveform;
      row.style.backgroundImage = `url(\"` + imgPath + `\")`;

      row.className = "item";
      row.addEventListener("click", (e) => {
        // check if the add button was clicked and only do add button shit, otherwise do normal shit
        if (e.target.className == "topRight") {
          console.log(audio.id);
          storePlaylist(audio.id);
        
        } else { window.open(url[0] + "//" + url[2] + "/audio/" + audio.id); }
      });

      audioList.appendChild(row);
    }
  }
}