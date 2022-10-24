/* get media function for the audio players */
function getMedia() {
  /* Ask the server for the manga Data */
  url = window.location.href.split('/');
  let search = url[0] + "//" + url[2] + "/db/get/" + url[4];

  searchMedia(search, 2);
}

function loadMedia(data) {
  console.log(data);
  /* Parse data from server and loop though it */
  // turn the json array into HTML
  var json = data;
  // clear out any todo things
  // mediaInfo.innerText = "";

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
