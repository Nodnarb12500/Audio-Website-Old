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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

      let info = document.createElement("div")
      let name = document.createElement("p");
      let length = document.createElement("p");

      let progressBar = document.createElement("div");

      let waveform = document.createElement("img");
      let audioFile = document.createElement("audio");

      name.innerText = audio.name;
      name.className = "leftInfo";

      /* somehow convert the likes into stars out of 5 */
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

      length.innerHTML = "Length: " + audio.length + "<br />Rating: " + starRating;
      length.className = "rightInfo";

      progressBar.id = "progressBar";

      waveform.src = "/resources/media/thumbs/" + audio.waveform;
      waveform.id = "waveformImg";
      waveform.draggable = false;

      waveform.addEventListener("click", waveformClick, false);

      info.appendChild(name);
      info.appendChild(progressBar);
      info.appendChild(length);
      info.appendChild(waveform);

      info.className = "container";

      mediaInfo.appendChild(info);

      audioFile.id = "audioFile";
      audioFile.src = "/resources/media/Music/" + audio.fileName;
      audioFile.controls = true;

      audioFile.ontimeupdate = function() {
        waveformDisplay();
      }

      audioPlayer.appendChild(audioFile);

      /* set the POST url for the rating form */
      ratingForm.action = "/db/modify/" + audio.id;

    }
  }
}

/* single/double/triple click */
var pendingClick = 0;
function waveformClick(e) {
    // kill any pending single clicks
    if (pendingClick) {
        clearTimeout(pendingClick);
        pendingClick = 0;
    }

    switch (e.detail) {
      case 1:
        pendingClick = setTimeout(function() {
          console.log('single click action here');
        }, 500);// should match OS multi-click speed

        // Single click
        console.log("Single Click");

        // Seek
        audioFile.currentTime = (e.offsetX / document.getElementById("waveformImg").width) * audioFile.duration;

      break;

      case 2:
        // Double click
        console.log("Double Click");

        // play/pause toggle
        if (document.getElementById("audioFile").paused) {
          document.getElementById("audioFile").play();
        } else {
          document.getElementById("audioFile").pause();
        }

      break;

      case 3:
        // Triple Click
        console.log("triple click")

        // Seek
        audioFile.currentTime = (e.offsetX / waveform.width) * audioFile.duration;

        // play/pause toggle
        if (document.getElementById("audioFile").paused) {
          document.getElementById("audioFile").play();
        } else {
          document.getElementById("audioFile").pause();
        }

        //debug
        break;

        default:
        console.log('higher multi-click actions can be added as needed');
        break;

    }
}


function prependChecks(a) {
  one.className = "checkmark";
  two.className = "checkmark";
  three.className = "checkmark";
  four.className = "checkmark";

  if (a == "1") {
    one.className = "checkBefore";

  } else if (a == "2") {
    one.className = "checkBefore";

  } else if (a == "3") {
    one.className = "checkBefore";
    two.className = "checkBefore";

  } else if (a == "4") {
    one.className = "checkBefore";
    two.className = "checkBefore";
    three.className = "checkBefore";

  } else if (a == "5") {
    one.className = "checkBefore";
    two.className = "checkBefore";
    three.className = "checkBefore";
    four.className = "checkBefore";
  }
}

async function waveformDisplay(consuming) {

  // Debugging
  // console.log(parseFloat(audioFile.currentTime) / parseFloat(audioFile.duration));

  var timePercent = (parseFloat(audioFile.currentTime) / parseFloat(audioFile.duration));
  let decimalPercent = (waveformImg.width * (parseFloat(timePercent)));

  progressBar.style.left = (parseFloat(decimalPercent) - 3) + "px";

}
