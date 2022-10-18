/* Function to get the json from a GET request */
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

function load(path) {
  /* read json from a get request and store it */
  // getJSON('http://localhost:3000/manga',
  const url = window.location.href.split('/');
  let scheme = url[0];
  let site = url[2];

  // if (path == "") {
  //   var search = scheme + "//" + site + "/manga";
  // } else {
  //   var search = scheme + "//" + site + "/search/" + path;
  // }

  console.log(path);
  console.log(search);

  getJSON(search,
          function(err, data) {
            if (err !== null) {
              alert('Something went wrong: ' + err);
            } else {
              //alert(data);
              //console.log(data);
              listAudio(data);
            }
          });
}

function listAudio(data) {
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
      let audios = JSON.parse(JSON.stringify(obj[prop]));

      /* Main shit */
      let row = document.createElement("div");
      let img = document.createElement("img");
      let name = document.createElement("p");
      let length = document.createElement("p");
      let a = document.createElement("a");

      img.src = manga.image;
      img.loading = "lazy";

      name.innerText = audio.name;
      name.className = "left";

      length.innerText = "Length: " + audio.length + "\nRating: " + audio.rating;
      length.className = "right";

      /* make onclick event to go to manga/id */
      a.href = "/db/get/" + audio.id;

      a.appendChild(waveform);
      a.appendChild(name);

      row.style.backgroundImage = audio.waveform;

      row.appendChild(a);
      row.className = "item";
      mangaBox.appendChild(row);
    }
  }
}
