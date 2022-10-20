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

var url;

function load(path, page) {
  /* read json from a get request and store it */

  url = window.location.href.split('/');
  page = parseInt(page) - 1;

  if (path == "") {
    path = "all";
  }

  let search = url[0] + "//" + url[2] + "/db/search/" + path + "/" + page;

  // console.log(path);
  // console.log(search);

  getJSON(search,
          function(err, data) {
            if (err !== null) {
              alert('Something went wrong: ' + err);
            } else {
              listAudio(data);
              pagesBar(page);
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

      let starRating = "";
      if (audios.rating != "-1") {
        for (let i = parseInt(audios.rating); i != 0; i--) {
          starRating = starRating.concat("&starf;");
        };
        /* fill in the rest of the stars with empty ones */
        for (let i = 5 - parseInt(audios.rating); i != 0; i--) {
          starRating = starRating.concat("&star;");
        }

      } else {
        for (let i = 5; i != 0; i--) {
          starRating = starRating.concat("&star;");
        }
      }

      length.innerHTML = "Length: " + audios.length + "<br />Rating: " + starRating;
      length.className = "right";

      /* make onclick event to go to manga/id */

      row.appendChild(name);
      row.appendChild(length);

      let imgPath = "/resources/media/thumbs/" + audios.waveform;
      row.style.backgroundImage = `url(\"` + imgPath + `\")`;

      // row.appendChild(a);
      row.className = "item";
      row.addEventListener("click", (e) => {
        window.open(url[0] + "//" + url[2] + "/audio/" + audios.id);
      })
      audioList.appendChild(row);
    }
  }
}

function pagesBar(page) {
  /* clear out the old buttons */
  pageButtons.innerHTML = "";

  /* page buttons */
  let first = document.createElement("a");
  let index1 = document.createElement("a");
  let index2 = document.createElement("a");
  let index3 = document.createElement("a");
  let index4 = document.createElement("a");
  let index5 = document.createElement("a");
  let last = document.createElement("a");

  let indexOneVal = "0";
  if (parseInt(page) >= 3) {
    indexOneVal = page - 1;
  } else {
    indexOneVal = "1";
  }

  first.innerText = "«";
  first.href = "#";
  first.addEventListener("click", (e) => {
    load(searchbar.value, 1);
  });

  index1.innerText = indexOneVal;
  index1.href = "#";
  if (parseInt(page) == 0) {
    index1.className = "active";
  }
  index1.addEventListener("click", (e) => {
    load(searchbar.value, indexOneVal);
  });

  let indexTwoVal = parseInt(indexOneVal) + 1;
  index2.innerText = indexTwoVal;
  index2.href = "#";
  if (parseInt(page) == 1) {
    index2.className = "active";
  }
  index2.addEventListener("click", (e) => {
    load(searchbar.value, indexTwoVal);
  });

  let indexThreeVal = parseInt(indexTwoVal) + 1;
  index3.innerText = indexThreeVal;
  index3.href = "#";
  if (parseInt(page) >= 2) {
    index3.className = "active";
  }
  index3.addEventListener("click", (e) => {
    load(searchbar.value, indexThreeVal);
  });

  let indexFourVal = parseInt(indexThreeVal) + 1;
  index4.innerText = indexFourVal;
  index4.href = "#";
  index4.addEventListener("click", (e) => {
    load(searchbar.value, indexFourVal);
  });

  let indexFiveVal = parseInt(indexFourVal) + 1;
  index5.innerText = indexFiveVal;
  index5.href = "#";
  index5.addEventListener("click", (e) => {
    load(searchbar.value, indexFiveVal);
  });

  last.innerText = "»";
  last.href = "#";
  last.addEventListener("click", (e) => {
    load(searchbar.value, indexOneVal);
  });

  pageButtons.appendChild(first);
  pageButtons.appendChild(index1);
  pageButtons.appendChild(index2);
  pageButtons.appendChild(index3);
  pageButtons.appendChild(index4);
  pageButtons.appendChild(index5);
  pageButtons.appendChild(last);
}
