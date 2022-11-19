function loadInfo(audio) {
  /* shit here adds information to the mediaInfo Div */
  let info = document.createElement("div");
  let name = document.createElement("p");
  let length = document.createElement("p");
  let volume = document.createElement("p");
  let progressBar = document.createElement("div");

  let waveform = document.createElement("img");
  let audioFile = document.createElement("audio");

  let extraInfo = "";
  if (audio.artist) {
    console.log("artist found")
    extraInfo = extraInfo.concat("<br>Artist: " + audio.artist);
  }
  if (audio.album) {
    console.log("album found");
    extraInfo = extraInfo.concat("<br>Album: " + audio.album);
  }

  name.innerHTML = "Name: " + audio.name + extraInfo;
  name.id = "topLeft";

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

  length.innerHTML = "Length: " + audio.length + "<br>Rating: " + starRating;
  length.id = "bottomRight";

  volume.id = "bottomLeft";
  volume.addEventListener("click", (e) => {

    if (audioFile.muted) {
      audioFile.muted = false;
    } else {
      audioFile.muted = true
    }
    waveformDisplay();
  }, false);


  progressBar.id = "progressBar";

  waveform.src = "/resources/media/thumbs/" + audio.waveform;
  waveform.id = "waveformImg";
  waveform.draggable = false;

  waveform.addEventListener("mousedown", waveformClick, false);
  waveform.addEventListener("wheel", scrollWheel, false);

  info.appendChild(progressBar);
  info.appendChild(name);
  info.appendChild(length);
  info.appendChild(volume);
  info.appendChild(waveform);

  info.className = "container";
  info.id = "waveformPlayer";

  mediaInfo.appendChild(info);

  audioFile.id = "audioFile";
  audioFile.src = "/resources/media/Music/" + audio.fileName;
  audioFile.controls = true;

  audioFile.ontimeupdate = function() {
    waveformDisplay();
  }
  /*audioFile.onpause = function() {
    // maybe only do this after some amount of time?
    makeIcon();
  }*/

  audioPlayer.appendChild(audioFile);

  /* set the POST url for the rating form */
  ratingForm.action = "/db/modify/" + audio.id;

  /* set window title to the current Song */
  document.title = audio.name;


  /* run extra stuff */
  makeIcon();

}

var pendingClick;
function waveformClick(e) {
    if (pendingClick) {
        clearTimeout(pendingClick);
        pendingClick = 0;
    }// kill any pending single clicks

  let offsetX = e.offsetX;
  let offsetY = e.offsetY;

  if (e.button == 0) {
    switch (e.detail) {
      case 1:
        pendingClick = setTimeout(function() {
          audioFile.currentTime = (offsetX / document.getElementById("waveformImg").width) * audioFile.duration;
        }, 200);
      break;
      case 2:
        if (document.getElementById("audioFile").paused) {
          document.getElementById("audioFile").play();
        } else {
          document.getElementById("audioFile").pause();
        }
      break;
    }
  } else if (e.button == 1) {
    e.preventDefault();
    audioFile.currentTime = (e.offsetX / document.getElementById("waveformImg").width) * audioFile.duration;
    if (document.getElementById("audioFile").paused) {
      document.getElementById("audioFile").play();
    }
  } else if (e.button == 2) {
  }
}

function scrollWheel(e) {
  e.preventDefault();
  let currentVolume = document.getElementById("audioFile").volume;

  if (event.deltaY < 0) {
    // Volume Up
    if (currentVolume == 1) {
      // stop errors by making it not execute the thing
    } else {
      document.getElementById("audioFile").volume = currentVolume + 0.05;
    }

  }
  else if (event.deltaY > 0) {
    // Volume Down
    if (currentVolume == 0) {
      // Stop execution when volume is down
    } else {
      document.getElementById("audioFile").volume = currentVolume - 0.05;
    }

  }
}

function waveformDisplay(consuming) {

  let volume = document.getElementById("bottomLeft");
  let timePercent = (parseFloat(audioFile.currentTime) / parseFloat(audioFile.duration));
  let decimalPercent = (waveformImg.width * (parseFloat(timePercent)));

  /* whatever you subtract by has to be the total width of the progress bar */
  progressBar.style.left = (parseFloat(decimalPercent) - 3) + "px";

  let currentTime = secondsToTime(audioFile.currentTime);
  let currentVolume;

  if (audioFile.muted) {
    currentVolume = "Muted!";
  } else {
    currentVolume = Math.round(parseFloat(audioFile.volume) * 100) + "%";
  }

  if (audioFile.paused) {
    volume.innerHTML = "(paused) " + currentTime + "<br />Volume: " + currentVolume;

  } else {
    volume.innerHTML = currentTime + "<br />Volume: " + currentVolume;

  }

}

function keyBinds(e) {
  /* add keybinds here */
}

function secondsToTime(e){
    const /*h = Math.floor(e / 3600).toString().padStart(2,'0'),*/
          m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
          s = Math.floor(e % 60).toString().padStart(2,'0');

    // return h + ':' + m + ':' + s;
    return m + ':' + s;
    //return `${h}:${m}:${s}`;
}

function makeIcon() {
  // pause icon to overlay on the waveform
  // overlay replay button in this function to

  if (!document.getElementById("playIcon")) {
    // make the thing
    let playIcon = document.createElement("img");
    let waveformPlayer = document.getElementById("waveformPlayer");

    playIcon.src = "/resources/media/icon/playBtn.svg";
    playIcon.id = "playIcon";

    playIcon.addEventListener("click", (e) => {
      // on single click unpause audio, and hide button.
      document.getElementById("audioFile").play();
      playIcon.style.display = "none";
    }, false)

    waveformPlayer.appendChild(playIcon);

  } else {
    document.getElementById("playIcon").style.display = "block";

  }
}
