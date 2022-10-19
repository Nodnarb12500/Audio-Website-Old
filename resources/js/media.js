var getJSON = function(url, callback) {
    /* Needed for sending requests to the server */
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

function getMedia() {
  /* Ask the server for the manga Data */
  const url = window.location.href.split('/');
  let scheme = url[0];
  let site = url[2];
  let id = url[4];

  let search = scheme + "//" + site + "/db/get/" + id;

  getJSON(search, (err, data) => {
    if (err !== null) {
      alert('Something went wrong: ' + err);

    } else {
      loadMedia(data);
    }
  });
};

function loadMedia(data) {
  /* Parse data from server and loop though it */
  // turn the json array into HTML
  var json = data;

  // clear out any todo things
  mediaInfo.innerText = "";

  for (var key in json) {
    // skip loop if the property is from prototype
    if (!json.hasOwnProperty(key)) continue;

    var obj = json[key];
    for (var prop in obj) {
        // skip loop if the property is from prototype
      if (!obj.hasOwnProperty(prop)) continue;

      /* Object prop is what i wanted i can now start using the ojects to create html */
      var audio = JSON.parse(JSON.stringify(obj[prop]));

      let name = document.createElement("p");
      let length = document.createElement("p");

      let waveform = document.createElement("img");
      let audioFile = document.createElement("audio");

      name.innerText = audio.name;
      name.className = "leftInfo";

      length.innerText = "Length: " + audio.length + "\nRating: " + audio.rating;
      length.className = "rightInfo";

      waveform.src = "/resources/media/thumbs/" + audio.waveform;


      console.log(name);
      console.log(length);

      mediaInfo.appendChild(name);
      mediaInfo.appendChild(length);
      mediaInfo.appendChild(waveform);


      <!-- diaply waveform and other information -->
      <!-- Display: Name, Waveform?, length, Rating as stars -->

      <!-- shit goes here -->


      <!-- Star rating system under the audio -->

    }
  }
}
