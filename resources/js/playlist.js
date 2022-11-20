
/* TODO
 *
 * this will be called on almost every page.
 * 1. fetching and storing the playlist variables will be handled in this file along with storing the current index in the array.
 * 2. this file will eventually handle moving and removing playlist items as well.
 * 3. 
 * 4. 
 * 
 */

// Global Variables
var playList = [];
var arrayIndex;
// auto run this everytime
getPlaylist();

function storePlaylist(id) {
    // Add append items to the array and update the local storage variable including the index
    playList.push(id);
    console.log(id);

    localStorage.setItem("playlist", JSON.stringify(playList));
    if (arrayIndex == null) { arrayIndex = 0; }
    localStorage.setItem("arrayIndex", arrayIndex);

}

function removePlaylistItem(id) {
    // remove items from the playlist and update the local storage variable including the index
    // need the index? or can i easily find the index? or can i just cut it out with the thing?


    console.log(playList.indexOf(id));

    playList.splice(playList.indexOf(id), 1);

    /* save the new array after */
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
        console.log("++");
        arrayIndex++;
        localStorage.setItem("arrayIndex", arrayIndex);
        getPlaylistItem();
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
                    deleteBtn.addEventListener("click", (e) => { removePlaylistItem(audio.id); }, false);

                    row.className = "playlistItem";

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
    // needs a catch to skip to the next song
    if (localStorage.getItem("arrayIndex") != null) {
        playList = JSON.parse(localStorage.getItem("playlist"));
        arrayIndex = parseInt(localStorage.getItem("arrayIndex"));

    } else { console.log("no stored values"); }

}

async function getPlaylistItem() {
    // give the waveform player the information it needs
    // hopfully the screen clears and doesnt leave shit in ram? lmao

    url = window.location.href.split('/');
    let search = url[0] + "//" + url[2] + "/db/get/" + playList[arrayIndex];

    // maybe merge this with get media?
    searchMedia(search).then(result => {
        loadMedia(JSON.parse(result));
    });
}