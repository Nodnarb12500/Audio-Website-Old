
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
    if (arrayIndex == null) {
        arrayIndex = 0;
    }
    localStorage.setItem("arrayIndex", arrayIndex);

}

function removePlaylist(id, index) {
    // remove items from the playlist and update the local storage variable including the index
    // need the index? or can i easily find the index? or can i just cut it out with the thing?

}

function clearPlaylist() {
    // clear and delete the playlist and index
    localStorage.clear();
}

function getPlaylistPreview() {
    // a loop that goes though the entire array and creates a preview for each item and appends it to the playlist overflow box
    
}

function getPlaylist() {
    // needs a catch to skip to the next song
    if (localStorage.getItem("arrayIndex") != null) {
        playList = JSON.parse(localStorage.getItem("playlist"));
        arrayIndex = parseInt(localStorage.getItem("arrayIndex"));


        console.log("Grabbed the Stored values, playlist: " + playList + " index: " + arrayIndex);
        console.log("current song is: " + playList[arrayIndex]);
    } else { 
        console.log("no stored values");
    }
}

function getPlaylistItem() {
    // give the waveform player the information it needs
    // hopfully the screen clears and doesnt leave shit in ram? lmao

    url = window.location.href.split('/');
    let search = url[0] + "//" + url[2] + "/db/get/" + playList[arrayIndex];

    console.log(search);

    // maybe merge this with get media?
    searchMedia(search, 2);
}