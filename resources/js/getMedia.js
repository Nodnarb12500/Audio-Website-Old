function getMedia() {
  /* Ask the server for the manga Data */
  url = window.location.href.split('/');
  let search = url[0] + "//" + url[2] + "/db/get/" + url[4];

  searchMedia(search, 2);
}

var playList;
var arrayIndex;

function getPlaylist() {
  if (localStorage.getItem("arrayIndex") != null) {
    // get 2 variables, the list of IDs and the current index of the playlist

    playList = JSON.parse(localStorage.getItem("playList"));
    arrayIndex = localStorage.getItem("arrayIndex");

    console.log("Grabbed the Stored values");
  } else { console.log("no stored values"); }
}

function getPlaylistItem(a) {
  url = window.location.href.split('/');
  let search = url[0] + url[1] + url[2] + "/db/get/" + play_list[a];

}

function loadMedia(data) {
  /* Parse data from server and loop though it */
  var json = data;

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
  searchMedia(search, 1);
  pagesBar(page);
}

function searchResults(data) {
   // turn the json array into HTML
  audioList.innerHTML = "";
  var json = data;

  for (var key in json) {
    // skip loop if the property is from prototype
    if (!json.hasOwnProperty(key)) continue;

    var obj = json[key];
    for (var prop in obj) {
        // skip loop if the property is from prototype
        if (!obj.hasOwnProperty(prop)) continue;

      /* Object prop is what i wanted i can now start using the ojects to create html */
      let audio = JSON.parse(JSON.stringify(obj[prop]));

      /* Main shit */
      let row = document.createElement("div");
      let name = document.createElement("p");
      let length = document.createElement("p");
      let addBtn = document.createElement("img");

      // let a = document.createElement("a");
      // a.href = "/db/get/" + audio.id;

      let extraInfo = "";
      if (audio.artist) {
        extraInfo = extraInfo.concat("<br />Artist: " + audio.artist);
      }
      if (audio.album) {
        extraInfo = extraInfo.concat("<br />Album: " + audio.album);
      }

      name.innerHTML = "Name: " + audio.name + extraInfo;
      name.className = "topLeft";

      let starRating = "";
      if (audio.rating != "-1") {
        for (let i = parseInt(audio.rating); i != 0; i--) {
          starRating = starRating.concat("&starf;");
        };
        /* fill in the rest of the stars with empty ones */
        for (let i = 5 - parseInt(audio.rating); i != 0; i--) {
          starRating = starRating.concat("&star;");
        }

      } else {
        for (let i = 5; i != 0; i--) {
          starRating = starRating.concat("&star;");
        }
      }

      addBtn.src = "/resources/media/icon/addBtn.svg";
      addBtn.className = "topRight";

      addBtn.addEventListener("click", (e) => {
        // add audio ID to playlist array

      }, false);

      length.innerHTML = "Length: " + audio.length + "<br />Rating: " + starRating;
      length.className = "bottomRight";

      /* make onclick event to go to manga/id */
      row.appendChild(name);
      row.appendChild(addBtn);
      row.appendChild(length);

      let imgPath = "/resources/media/thumbs/" + audio.waveform;
      row.style.backgroundImage = `url(\"` + imgPath + `\")`;

      // row.appendChild(a);
      row.className = "item";
      row.addEventListener("click", (e) => {
        window.open(url[0] + "//" + url[2] + "/audio/" + audio.id);
      })
      audioList.appendChild(row);
    }
  }
}