function getToken() {
    const hash = window.location.hash;
    if (hash) {
        const match = hash.match(/access_token=([^&]*)/);
        if (match) {
            const token = match[1];
            localStorage.setItem('spotify_token', token);
            window.history.replaceState(null, null, ' ');
            return token;
        }
    }
    return localStorage.getItem('spotify_token');
}

document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('login-link');
    const logoutBtn = document.getElementById('logout-btn');
    const playlistTitle = document.getElementById('playlist-title');
    const createBtn = document.getElementById('create-btn');
    const generateBtn = document.getElementById('generate-btn');
    const tableContainer = document.getElementById('song-table-container');
    const playlistSuccess = document.getElementById('playlist-success');
    const warning = document.getElementById('validation-warning');

    const redirectUri = window.location.origin;
    if (loginLink)
        loginLink.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=playlist-modify-private`;

    let accessToken = getToken();
    if (accessToken) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        if (loginLink) loginLink.style.display = 'inline-block';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('spotify_token');
            window.location.reload();
        });
    }

    let songs = [];
    let selected = [];

    async function fetchSongs(date, limit) {
        const res = await fetch(`/scrape?date=${date}&limit=${limit}&enrich=true`);
        return res.json();
    }

    function renderTable() {
        if (!songs.length) return;
        let html = '<table class="song-table"><thead><tr><th>#</th>';
        if (accessToken) html += '<th class="include-col">Include?</th>';
        html += '<th class="track-col">Track</th></tr></thead><tbody>';
        songs.forEach((s, i) => {
            html += `<tr><td>${i + 1}</td>`;
            if (accessToken) {
                const checked = selected.includes(i) ? 'checked' : '';
                html += `<td class="include-col"><input data-idx="${i}" type="checkbox" ${checked}></td>`;
            }
            html += `<td class="track-col"><a href="${s.spotify_url}" target="_blank" class="listen-link">${s.title}</a><br/><a href="${s.artist_url}" target="_blank" class="song-artist-link">${s.artist}</a></td></tr>`;
        });
        html += '</tbody></table>';
        tableContainer.innerHTML = '<div class="song-table-wrapper">' + html + '</div>';
        if (accessToken) {
            tableContainer.querySelectorAll('input[type=checkbox]').forEach(box => {
                box.addEventListener('change', () => {
                    const idx = parseInt(box.dataset.idx, 10);
                    if (box.checked) {
                        if (!selected.includes(idx)) selected.push(idx);
                    } else {
                        selected = selected.filter(i => i !== idx);
                    }
                });
            });
            createBtn.style.display = 'inline-block';
        }
    }

    generateBtn.addEventListener('click', async () => {
        const dateInput = document.getElementById('date').value;
        const count = parseInt(document.getElementById('track-count').value, 10);
        if (count > 100) {
            warning.style.display = 'block';
            return;
        }
        warning.style.display = 'none';
        const data = await fetchSongs(dateInput, count);
        if (data.success) {
            songs = data.songs;
            selected = songs.map((_, i) => i);
            playlistTitle.value = `Rewindify: Billboard ${dateInput}`;
            if (accessToken) playlistTitle.style.display = 'block';
            renderTable();
        } else {
            alert(data.message || 'Something went wrong.');
        }
    });

    createBtn.addEventListener('click', async () => {
        const dateInput = document.getElementById('date').value;
        const count = parseInt(document.getElementById('track-count').value, 10);
        const title = playlistTitle.value.trim() || `Rewindify: Billboard ${dateInput}`;
        const res = await fetch('/api/create-playlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: dateInput,
                track_limit: count,
                access_token: accessToken,
                selected_indices: selected,
                custom_name: title
            })
        });
        const data = await res.json();
        if (data.success) {
            playlistSuccess.innerHTML = `🎉 Your playlist is ready! <a href="${data.playlist_url}" target="_blank" rel="noopener noreferrer">Open in Spotify</a>`;
            playlistSuccess.style.display = 'block';
        } else {
            alert(data.message || 'Failed to create playlist.');
        }
    });
});
