const Lyrics = require('song-lyrics-api');
const lyrics = new Lyrics();

lyrics.getLyrics('bad idea right?')
    .then((response) => {
        return console.log(response);
    })
    .catch((error) => {
        return console.log(error);
    })