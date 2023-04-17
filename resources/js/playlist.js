// Global Variables
var playList = [];
var arrayIndex;
var looping = true;
// auto run this everytime
getPlaylist();

function storePlaylist(id) {
    // Add append items to the array and update the local storage variable including the index
    getPlaylist();
    playList.push(id);
    console.log(id);

    localStorage.setItem("playlist", JSON.stringify(playList));
    if (arrayIndex == null) { arrayIndex = 0; }
    localStorage.setItem("arrayIndex", arrayIndex);

}

function removePlaylistItem(id) {
    playList.splice(playList.indexOf(id), 1);

    localStorage.setItem("playlist", JSON.stringify(playList));
    if (arrayIndex == null) { arrayIndex = 0; }
    localStorage.setItem("arrayIndex", arrayIndex);
}

function movePlaylistItems() {
    // figure out how the hell to move shit

}

function clearPlaylist() {
    // clear and delete the playlist and index
    localStorage.clear();
}

function addListener() {
    let audioPlayer = document.getElementById("audioFile");
    // store and grab a variable 

    if (localStorage.getItem("playing") == "yes") { 
        document.getElementById("audioFile").play();
        if (!document.getElementById("audioFile").paused) {
            document.getElementById("playIcon").style.display = "none";
        }
    }

    audioPlayer.addEventListener("play", (e) => {
        // set localstorage thing to playing and if playing exists then start playing when the next audio exists
        localStorage.setItem("playing", "yes");
    }, false);

    audioPlayer.addEventListener("paused", (e) => {
        localStorage.setItem("playing", null);
        console.log("paused");
    }, false);

    audioPlayer.addEventListener("ended", (e) => {
        if (arrayIndex >= playList.length - 1) {
            if (looping == true) {
                arrayIndex = 0;
                localStorage.setItem("arrayIndex", arrayIndex);
                getPlaylistItem();
            } else {
                // just stop executing this?
            }
        } else {
            arrayIndex++;
            localStorage.setItem("arrayIndex", arrayIndex);
            getPlaylistItem();
        }
    });
}

function getPlaylistPreview() {
    // a loop that goes though the entire array and creates a preview for each item and appends it to the playlist overflow box
    url = window.location.href.split('/');

    for (let i = 0; i < playList.length; i++) {
        let search = url[0] + "//" + url[2] + "/db/get/" + playList[i];

        let row = document.createElement("div");
        let name = document.createElement("p");
        let waveformImg = document.createElement("img");
        let deleteBtn = document.createElement("button");

        searchMedia(search).then(result => {
            var json = JSON.parse(result);
            for (var key in json) {
                if (!json.hasOwnProperty(key)) continue;
                var obj = json[key];
                for (var prop in obj) {
                    if (!obj.hasOwnProperty(prop)) continue;
        
                    /* Object prop is what i wanted i can now start using the ojects to create html */
                    var audio = JSON.parse(JSON.stringify(obj[prop]));

                    let extraInfo = "";
                    if (audio.artist) { extraInfo = extraInfo.concat("<br>Artist: " + audio.artist); }
                    if (audio.album) { extraInfo = extraInfo.concat("<br>Album: " + audio.album); }
                  
                    name.innerHTML = "Name: " + audio.name + extraInfo;
                    waveformImg.src = "/resources/media/thumbs/" + audio.waveform;
            
                    deleteBtn.innerText = "remove";
                    deleteBtn.id = "removeBtn";
                    deleteBtn.addEventListener("click", (e) => { 
                        removePlaylistItem(audio.id);
                        e.target.parentElement.remove();
                    }, false);

                    row.className = "playlistItem";
                    row.id = i;

                    row.addEventListener("click", (e) => {
                        // change array index to the song displayed in this box
                        // I don't like this but I don't Know another way yet
                        if (e.target.parentElement.id == "playlist") {
                            arrayIndex = e.target.id;
                        } else if (e.target.id == "removeBtn" ) {
                            // dont do anything lmao
                            arrayIndex = arrayIndex - 1;
                        } else {
                            arrayIndex = e.target.parentElement.id;
                        }

                        getPlaylistItem();
                    }, false)

                    row.appendChild(waveformImg);
                    row.appendChild(name);
                    row.appendChild(deleteBtn);
                    
                    document.getElementById("playlist").appendChild(row);
                }
            }
        });
    }
}

function getPlaylist() {
    if (localStorage.getItem("arrayIndex") != null) {
        playList = JSON.parse(localStorage.getItem("playlist"));
        arrayIndex = parseInt(localStorage.getItem("arrayIndex"));

    } else { console.log("no stored values"); }
}

/*async*/ function getPlaylistItem() {
    url = window.location.href.split('/');

    // if arrayIndex > playlist.length reset to 0
    if (arrayIndex >= playList.length) {
        arrayIndex = 0;
    } else if (arrayIndex < 0) {
        arrayIndex = playList.length - 1;
    }

    let search = url[0] + "//" + url[2] + "/db/get/" + playList[arrayIndex];

    // maybe merge this with get media?
    searchMedia(search).then(result => {
        loadMedia(JSON.parse(result));
    });
}