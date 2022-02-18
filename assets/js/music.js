$(document).ready(function () {
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // URL values
    let shuffle = getUrlParameter('shuffle');
    let albumart = getUrlParameter('albumart');
    let volume = getUrlParameter('volume');
    let playlist = getUrlParameter('playlist');

    // Default values if nothing is set
    if (!volume) {
        volume = "1.0";
    }
    if (!albumart) {
        albumart = "true";
    }
    if (!shuffle) {
        shuffle = "false";
    }
    if (!playlist) {
        playlist = "tracklist";
    }

    // Json data
    let tracklist_file = JSON.parse($.getJSON({'url': "./" + playlist + ".json", 'async': false}).responseText);

    // Default track index
    let track_index = 0;

    // Create new audio element
    let curr_track = document.createElement('audio');

    $(curr_track).appendTo('#container');

    function loadTrack(track_index) {
        // Load a new track
        curr_track.src = tracklist_file[track_index].path;
        curr_track.autoplay = true;
        curr_track.controls = false;
        curr_track.volume = volume;
        curr_track.load();
        
        // Move to the next track if the current one finishes playing
        curr_track.addEventListener("ended", nextTrack);

        // HTML
        $('.name').html(tracklist_file[track_index].name);
        $('.artist').html(tracklist_file[track_index].artist);
        $('.url').html(tracklist_file[track_index].url);
        if (albumart === 'true') {
            $('img.image').attr("src",tracklist_file[track_index].image);
        } else {
            $('img.image').css("display","none");
        }
    }

    function nextTrack() {
        if (track_index < tracklist_file.length - 1) {
            track_index += 1;
        } else {
            track_index = 0;
        }
        loadTrack(track_index);
        curr_track.play();
    }

    let randomTrack = Math.floor((Math.random() * tracklist_file.length - 1) + 1);

    // Load a random track in the tracklist
    if (shuffle === 'true') {
        loadTrack(randomTrack);
    } else {
        loadTrack(track_index);
    }

});