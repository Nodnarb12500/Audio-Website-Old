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
  if (audio.artist) { extraInfo = extraInfo.concat("<br>Artist: " + audio.artist); }
  if (audio.album) { extraInfo = extraInfo.concat("<br>Album: " + audio.album); }

  name.innerHTML = "Name: " + audio.name + extraInfo;
  name.id = "topLeft";

  let starRating = "";
  if (audio.rating != "-1") {
    for (let i = parseInt(audio.rating); i != 0; i--) { starRating = starRating.concat("&starf;"); }
    for (let i = 5 - parseInt(audio.rating); i != 0; i--) { starRating = starRating.concat("&star;"); }
  } else {
    for (let i = 5; i != 0; i--) { starRating = starRating.concat("&star;"); }
  }

  length.innerHTML = "Length: " + audio.length + "<br>Rating: " + starRating;
  length.id = "bottomRight";

  volume.id = "bottomLeft";
  volume.addEventListener("click", (e) => {
    if (audioFile.muted) { 
      audioFile.muted = false;
    } else { 
      audioFile.muted = true;
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

  audioFile.ontimeupdate = function() { waveformDisplay(), false }
  audioPlayer.appendChild(audioFile);

  ratingForm.action = "/db/modify/" + audio.id;

  document.title = audio.name;

  /* run extra stuff */
  waveformDisplay();
  makeIcon("play");
  makeDescription(audio);
  addListener();

}

function makeDescription(audio) {
  let row = document.getElementById("description");
  let name = document.createElement("p");

  //clear the old data.
  row.innerHTML = "";

  let extraInfo = "";
  if (audio.artist) { extraInfo = extraInfo.concat("<br>Artist: " + audio.artist); }
  if (audio.album)  { extraInfo = extraInfo.concat("<br>Album: " + audio.album); }

  name.innerHTML = "Name: " + audio.name + extraInfo;
  row.appendChild(name);
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
    audioFile.currentTime = (offsetX / document.getElementById("waveformImg").width) * audioFile.duration;
    if (document.getElementById("audioFile").paused) {
      document.getElementById("audioFile").play();
    }
  } else if (e.button == 2) {
  }
}

function scrollWheel(e) {
  e.preventDefault();
  let currentVolume = document.getElementById("audioFile").volume;

  if (e.deltaY < 0) {
    // Volume Up
    if (currentVolume == 1) {
      // stop errors by making it not execute the thing
    } else {
      document.getElementById("audioFile").volume = currentVolume + 0.05;
    }

  }
  else if (e.deltaY > 0) {
    // Volume Down
    if (currentVolume == 0) {
      // Stop execution when volume is down
    } else {
      document.getElementById("audioFile").volume = currentVolume - 0.05;
    }

  }
}

function waveformDisplay() {
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

    if (audioFile.currentTime === audioFile.duration) {
      // make replay button
      makeIcon("replay");
    } else if (audioFile.currentTime != 0) {
      // make pause button
      makeIcon("pause");
    }

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

function makeIcon(icon) {
  // pause icon to overlay on the waveform
  // overlay replay button in this function to

  if (icon == "play") {
    if (!document.getElementById("playIcon")) {
      // make the thing
      let playIcon = document.createElement("img");
      let waveformPlayer = document.getElementById("waveformPlayer");

      playIcon.src = "/resources/media/icon/playBtn.svg";
      playIcon.id = "playIcon";
      playIcon.className = "playerControls";

      playIcon.addEventListener("click", (e) => {
        // on single click unpause audio, and hide button.
        document.getElementById("audioFile").play();
        playIcon.style.display = "none";
      }, false)

      waveformPlayer.appendChild(playIcon);

      } else {
        document.getElementById("playIcon").style.display = "block";

      }
  } else if (icon == "pause") {
    if (!document.getElementById("pauseIcon")) {
      // make the thing
      let iconImg = document.createElement("img");
      let waveformPlayer = document.getElementById("waveformPlayer");

      iconImg.src = "/resources/media/icon/pauseBtn.svg";
      iconImg.id = "pauseIcon";
      iconImg.className = "playerControls";

      iconImg.addEventListener("click", (e) => {
        // on single click unpause audio, and hide button.
        document.getElementById("audioFile").play();
        iconImg.style.display = "none";
      }, false)

      waveformPlayer.appendChild(iconImg);

      } else {
        if (document.getElementById("playIcon").style.display == "block") {
          // no place pausebutton
        } else {
          document.getElementById("pauseIcon").style.display = "block";
        }
        

      }

  } else if (icon == "replay") {
    if (!document.getElementById("replayIcon")) {
      // make the thing
      let iconImg = document.createElement("img");
      let waveformPlayer = document.getElementById("waveformPlayer");

      iconImg.src = "/resources/media/icon/replayBtn.svg";
      iconImg.className = "playerControls";

      iconImg.addEventListener("click", (e) => {
        // on single click unpause audio, and hide button.
        document.getElementById("audioFile").play();
        iconImg.style.display = "none";
      }, false)

      waveformPlayer.appendChild(iconImg);

      } else {
        document.getElementById("replayIcon").style.display = "block";

      }

  } else {
    console.error("button: " + icon + " Doesnt exist yet!");
  }
}