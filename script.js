let isDarkMode = true; // Dark mode as default

function toggleDarkMode() {
    const body = document.body;
    const table = document.querySelector('.table');

    isDarkMode = !isDarkMode;

    body.classList.toggle('light-mode', !isDarkMode);
    table.classList.toggle('table-dark', isDarkMode);
    table.classList.toggle('table-light', !isDarkMode);
}

function clearHistory() {
    const historyDiv = document.getElementById('searchHistory');
    historyDiv.innerHTML = '';
}

async function fetchArtistData() {
    // Hide the artist image initially
    document.getElementById('artistImage').style.display = 'none';

    const artistName = document.getElementById('artistSearch').value;
    const apiUrl = `https://spotifiers-f9b575e2cffb.herokuapp.com/?artist_name=${encodeURIComponent(artistName)}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        const artist = data.message;

        document.getElementById('artistName').innerText = artist.name;
        document.getElementById('artistFollowersTableCell').innerText = artist.followers.total;
        document.getElementById('artistGenresTableCell').innerText = artist.genres.join(", ");
        document.getElementById('artistPopularityTableCell').innerText = artist.popularity;
        document.getElementById('artistSpotifyLink').href = artist.external_urls.spotify;
        document.getElementById('artistImage').src = artist.images[0].url;

        // Display the artist image after data is fetched
        document.getElementById('artistImage').style.display = 'block';

        addToHistory(artist);

        fetchTopTracks(artistName);

    } catch (error) {
        console.error("There was an issue fetching the artist data.", error);
    }
}

async function fetchTopTracks(artistName) {
    const apiUrl = `https://spotifiers-f9b575e2cffb.herokuapp.com/top-tracks?artist_name=${encodeURIComponent(artistName)}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        const topTracks = data.top_tracks;

        const tracksDiv = document.getElementById('topTracks');
        tracksDiv.innerHTML = '';

        topTracks.forEach(track => {
            const trackLink = document.createElement('a');
            trackLink.href = track.external_urls.spotify;
            trackLink.target = "_blank";
            trackLink.innerText = track.name;
            const listItem = document.createElement('li');
            listItem.appendChild(trackLink);
            tracksDiv.appendChild(listItem);
        });

    } catch (error) {
        console.error("There was an issue fetching the top tracks.", error);
    }
}

function addToHistory(artist) {
    const historyDiv = document.getElementById('searchHistory');
    const artistLink = document.createElement('a');
    artistLink.href = artist.external_urls.spotify;
    artistLink.target = "_blank";
    artistLink.innerText = artist.name;
    const listItem = document.createElement('li');
    listItem.appendChild(artistLink);
    historyDiv.appendChild(listItem);
}

function handleSearch(event) {
    event.preventDefault();
    fetchArtistData();
}
