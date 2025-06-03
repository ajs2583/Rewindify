// Basic front-end functionality extracted from the React version

document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-input');
    const countInput = document.getElementById('track-count-input');
    const titleInput = document.getElementById('playlist-title');
    const generateBtn = document.getElementById('generate-btn');
    const createBtn = document.getElementById('create-playlist-btn');
    const loginBtn = document.getElementById('spotify-login');
    const logoutBtn = document.getElementById('logout-btn');
    const successDiv = document.getElementById('playlist-success');
    const tableContainer = document.getElementById('song-table-container');
    const trackWarning = document.getElementById('track-warning');
    const redirectUri = window.location.origin;

    let songs = [];
    let selectedSongs = [];
    let accessToken = null;

    function handleHashToken() {
        const hash = window.location.hash;
        if (hash) {
            const match = hash.match(/access_token=([^&]*)/);
            if (match) {
                localStorage.setItem('spotify_token', match[1]);
                window.history.replaceState(null, null, ' ');
            }
        }
    }

    function updateLoginState() {
        accessToken = localStorage.getItem('spotify_token');
        if (accessToken) {
            logoutBtn.style.display = 'inline-block';
            loginBtn.style.display = 'none';
            if (songs.length) titleInput.style.display = 'block';
        } else {
            logoutBtn.style.display = 'none';
            loginBtn.style.display = 'inline-block';
            loginBtn.href = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_ID}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=playlist-modify-private`;
            titleInput.style.display = 'none';
        }
    }

    handleHashToken();
    updateLoginState();

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('spotify_token');
        accessToken = null;
        updateLoginState();
    });

    [dateInput, countInput].forEach(el => {
        el.addEventListener('input', () => {
            const valid = dateInput.value && countInput.value && countInput.value <= 100 && new Date(dateInput.value) <= new Date();
            generateBtn.disabled = !valid;
            trackWarning.style.display = countInput.value > 100 ? 'block' : 'none';
        });
    });

    generateBtn.addEventListener('click', async () => {
        generateBtn.textContent = 'Loading...';
        tableContainer.innerHTML = '';
        successDiv.style.display = 'none';
        createBtn.style.display = 'none';
        titleInput.style.display = 'none';
        try {
            const res = await fetch(`/api/scrape?date=${dateInput.value}&limit=${countInput.value}&enrich=true`);
            const data = await res.json();
            if (data.success) {
                songs = data.songs;
                selectedSongs = songs.map((_, i) => i);
                renderTable();
                if (accessToken) {
                    titleInput.value = `Rewindify: Billboard ${dateInput.value}`;
                    titleInput.style.display = 'block';
                    createBtn.style.display = 'inline-block';
                }
            } else {
                alert(data.message || 'Something went wrong.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to fetch songs.');
        } finally {
            generateBtn.textContent = 'Generate';
        }
    });

    function renderTable() {
        if (!songs.length) { tableContainer.innerHTML = ''; return; }
        const wrapper = document.createElement('div');
        wrapper.className = 'song-table-wrapper';
        const table = document.createElement('table');
        table.className = 'song-table';
        const thead = document.createElement('thead');
        thead.innerHTML = '<tr><th>#</th>' + (accessToken ? '<th class="include-col">Include?</th>' : '') + '<th class="track-col">Track</th></tr>';
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        songs.forEach((song, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${idx + 1}</td>` +
                (accessToken ? `<td class="include-col"><input type="checkbox" data-idx="${idx}" checked></td>` : '') +
                `<td class="track-col"><a href="${song.spotify_url}" target="_blank" class="listen-link">${song.title}</a><br><a href="${song.artist_url}" target="_blank" class="song-artist-link">${song.artist}</a></td>`;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        wrapper.appendChild(table);
        tableContainer.innerHTML = '';
        tableContainer.appendChild(wrapper);

        if (accessToken) {
            tbody.querySelectorAll('input[type=checkbox]').forEach(cb => {
                cb.addEventListener('change', (e) => {
                    const idx = parseInt(e.target.dataset.idx);
                    if (e.target.checked) {
                        if (!selectedSongs.includes(idx)) selectedSongs.push(idx);
                    } else {
                        selectedSongs = selectedSongs.filter(i => i !== idx);
                    }
                });
            });
        }
    }

    createBtn.addEventListener('click', async () => {
        if (!accessToken) return alert('Please log into Spotify first.');
        const body = {
            date: dateInput.value,
            track_limit: countInput.value,
            access_token: accessToken,
            selected_indices: selectedSongs,
            custom_name: titleInput.value.trim() === '' ? `Rewindify: Billboard ${dateInput.value}` : titleInput.value
        };
        const res = await fetch('/api/create-playlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await res.json();
        if (data.success) {
            successDiv.innerHTML = `🎉 Your playlist is ready! <a href="${data.playlist_url}" target="_blank" rel="noopener">Open in Spotify</a>`;
            successDiv.style.display = 'block';
        } else {
            alert(data.message || 'Failed to create playlist.');
        }
    });
});
