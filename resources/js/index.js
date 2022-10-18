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

function load(path, page) {
  /* read json from a get request and store it */

  const url = window.location.href.split('/');
  let scheme = url[0];
  let site = url[2];

  page = page - 1;

  if (path == "") {
    var search = scheme + "//" + site + "/db/search/all/" + page;
  } else {
    var search = scheme + "//" + site + "/search/" + path + "/" + page;
  }

  console.log(path);
  console.log(search);

  getJSON(search,
          function(err, data) {
            if (err !== null) {
              alert('Something went wrong: ' + err);
            } else {
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
      let name = document.createElement("p");
      let length = document.createElement("p");

      // let a = document.createElement("a");
      // a.href = "/db/get/" + audios.id;

      name.innerText = audios.name;
      name.className = "left";

      length.innerText = "Length: " + audios.length + "\nRating: " + audios.rating;
      length.className = "right";

      /* make onclick event to go to manga/id */

      row.appendChild(name);
      row.appendChild(length);

      let imgPath = "/resources/media/thumbs/" + audios.waveform;
      row.style.backgroundImage = "url(\'" + imgPath + "\')";

      console.log(imgPath);

      // row.appendChild(a);
      row.className = "item";
      audioList.appendChild(row);
    }
  }
}
