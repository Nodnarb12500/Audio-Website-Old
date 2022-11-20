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

function searchMedia(search) {
  return new Promise(function(resolve, reject) {
    getJSON(search, (err, data) => {
      if (err !== null) {
        alert("something went wrong: " + err);
        reject(err);
      } else {
        thing = JSON.stringify(data);
        resolve(thing);
      }
    })
  })
}