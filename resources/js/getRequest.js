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
var url;
/* get audio lists for the main search menu */

function searchMedia(search, a) {
  /* read json from a get request and store it */
  getJSON(search, (err, data) => {
    if (err !== null) {
      alert('Something went wrong: ' + err);

    } else {
      if (a == 1) {
        console.log("Search Page");
        searchResults(data);
      } else if (a == 2) {
        console.log("Audio Player");
        loadMedia(data);
      } else if (a == 3) {
        console.log("Suggestions");
        console.log("doesnt exist yet");
      }
    }

  });
}