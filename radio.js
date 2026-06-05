metadati-radio

const locandina = document.getElementById('locandina');
const locandinaTitle = document.getElementById('locandinaTitle');
const locandinaBody = document.getElementById('locandinaBody');
const coverLocandina = document.getElementById('coverLocandina');
const boomContainer = document.getElementById('boomContainer');
let clockInterval = null;

let userData = { city: "Rilevamento...", status: "pending" };
let liveMetadata = { song: "In attesa...", artist: "Radio Live" };

function lookupUserGeotarget() {
    const script = document.createElement('script');
    script.src = 'https://ipinfo.io/json?callback=handleGeoResponse';
    document.body.appendChild(script);
}

window.handleGeoResponse = function(response) {
    if (response && response.city) {
        userData.city = response.city;
        userData.status = "success";
    } else {
        userData.city = "Stanza Live";
    }
};

function startMetadataScanner(radioUrl) {
    if (!radioUrl) return;
    let baseUrl = radioUrl.split('/;')[0];
    if (baseUrl.endsWith('.mp3')) baseUrl = baseUrl.replace('.mp3', '');
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    
    let streamStatsUrl = baseUrl + '/stats?json=1';

    function updateTitles() {
        fetch(streamStatsUrl)
            .then(res => res.json())
            .then(data => {
                if (data && data.songtitle) {
                    let trackParts = data.songtitle.split(' - ');
                    if (trackParts.length >= 2) {
                        liveMetadata.artist = trackParts[0].trim();
                        liveMetadata.song = trackParts[1].trim();
                    } else {
                        liveMetadata.artist = "Radio Live";
                        liveMetadata.song = data.songtitle.trim();
                    }
                    autoFetchiTunesCover(liveMetadata.song, liveMetadata.artist);
                }
            })
            .catch(() => {
                const urlParams = new URLSearchParams(window.location.search);
                let titleParam = urlParams.get('title') || urlParams.get('currentsong');
                if (titleParam) {
                    let trackParts = decodeURIComponent(titleParam).split(' - ');
                    liveMetadata.artist = trackParts[0] || "Artista";
                    liveMetadata.song = trackParts[1] || "Traccia Live";
                    autoFetchiTunesCover(liveMetadata.song, liveMetadata.artist);
                }
            });
    }
    setInterval(updateTitles, 10000);
    updateTitles();
}

function autoFetchiTunesCover(song, artist) {
    const query = encodeURIComponent(song + ' ' + artist);
    fetch('https://itunes.apple.com/search?term=' + query + '&entity=song&limit=1')
        .then(res => res.json())
        .then(data => {
            if(data.results && data.results.length > 0) {
                const track = data.results[0];
                const bigCover = track.artworkUrl100.replace('100x100bb', '400x400bb');
                document.getElementById('trackCoverImg').src = bigCover;
                document.getElementById('coverTrackName').textContent = track.trackName;
                document.getElementById('coverArtistName').textContent = track.artistName;
            } else {
                document.getElementById('trackCoverImg').src = 'https://via.placeholder.com/300/b300ff/ffffff?text=Radio+Live';
                document.getElementById('coverTrackName').textContent = song;
                document.getElementById('coverArtistName').textContent = artist;
            }
        })
        .catch(() => {
            document.getElementById('coverTrackName').textContent = song;
            document.getElementById('coverArtistName').textContent = artist;
        });
}

function closeLocandina() {
    locandina.classList.remove('active');
    boomContainer.classList.remove('active');
    if (clockInterval) clearInterval(clockInterval);
}

function closeCoverLocandina() {
    coverLocandina.classList.remove('active');
}

window.showDynamicInfo = function(type) {
    if (clockInterval) clearInterval(clockInterval);
    boomContainer.classList.remove('active');
    locandina.classList.remove('active');

    const colors = {
        datario: '#ff0055', oroscopo: '#ff66cc', citta: '#0099ff',
        meteo: '#ffcc00', playlist: '#ff6600', notifiche: '#b300ff', impostazioni: '#00ffff'
    };
    
    locandina.style.borderColor = colors[type];
    locandina.style.boxShadow = '0 0 30px ' + colors[type];
    locandinaTitle.style.color = colors[type];

    if (type === 'datario') {
        locandinaTitle.textContent = "Datario & Orologio";
        function updateLocandinaClock() {
            const now = new Date();
            const dateStr = now.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const timeStr = now.toLocaleTimeString('it-IT');
            locandinaBody.innerHTML = '<div style="font-size: 24px; font-weight: bold; color: #fff; margin-bottom: 10px;">' + timeStr + '</div><div style="font-size: 14px; text-transform: capitalize; color: #aaa;">' + dateStr + '</div>';
        }
        updateLocandinaClock();
        clockInterval = setInterval(updateLocandinaClock, 1000);
        locandina.classList.add('active');

    } else if (type === 'oroscopo') {
        locandinaTitle.textContent = "Oroscopo - Gemelli ♊";
        // Genera la data di oggi in automatico (es: 05 Giugno)
        const oggi = new Date();
        const dataOggiStr = oggi.toLocaleDateString('it-IT', { day: '2-digit', month: 'Long' });
        
        locandinaBody.innerHTML = '<div style="font-size: 13px; color: #ff66cc; font-weight: bold; margin-bottom: 5px;">Data: ' + dataOggiStr + '</div><p style="font-style: italic; font-size: 15px; color: #eee; line-height: 1.4;">"Gemelli! La Luna di oggi accende la tua mente e la voglia di ballare in chat. Sarà una giornata piena di messaggi privati interessanti e intuizioni d\'oro."</p><div style="text-align: right; font-size: 11px; color: #888; font-weight: bold; margin-top: 10px;">✍️ Creato da Cartaio</div>';
        locandina.classList.add('active');

    } else if (type === 'citta') {
        locandinaTitle.textContent = "La Tua Città";
        locandinaBody.innerHTML = '<p style="margin: 5px 0;">📍 Ti stai connettendo in tempo reale da:</p><div style="font-size: 24px; font-weight: bold; color: #fff; margin: 12px 0; text-transform: uppercase; letter-spacing: 1px;">' + userData.city + '</div><p style="font-size: 11px; color: #888;">Tracciamento dinamico IP completato</p>';
        locandina.classList.add('active');

    } else if (type === 'meteo') {
        locandinaTitle.textContent = "Meteo Live";
        const meteoSim = ["Sereno ☀️", "Clima Caldo per Ballare 🕺🔥", "Stelle Visibili ✨"];
        const scelta = meteoSim[Math.floor(Math.random() * meteoSim.length)];
        locandinaBody.innerHTML = '<p style="margin: 5px 0;">Situazione Meteo attuale a <strong>' + userData.city + '</strong>:</p><div style="font-size: 22px; font-weight: bold; color: #fff; margin: 10px 0;">24°C - ' + scelta + '</div>';
        locandina.classList.add('active');

    } else if (type === 'playlist') {
        locandinaTitle.textContent = "Titoli Streaming";
        locandinaBody.innerHTML = '<div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 6px; border-left: 3px solid #ff6600;"><span style="font-size: 11px; color: #ff6600; display: block; font-weight: bold;">🔴 IN ONDA ORA:</span><strong style="color: #fff; font-size: 15px;">' + liveMetadata.song + '</strong><br><span style="color: #aaa; font-size: 13px;">' + liveMetadata.artist + '</span></div>';
        locandina.classList.add('active');

    } else if (type === 'notifiche') {
        coverLocandina.classList.add('active');

    } else if (type === 'impostazioni') {
        locandinaTitle.textContent = "BOOM Effect Attivo";
        locandinaBody.innerHTML = '<p>⚡ Spettacolo visivo attivato! Guarda i raggi laser colorati che girano sopra il video.</p>';
        boomContainer.classList.add('active');
        locandina.classList.add('active');
    }
}

function getRadioUrlFromXat() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('url') || urlParams.get('stream') || urlParams.get('radio') || urlParams.get('playlist');
}

window.addEventListener('DOMContentLoaded', () => {
    lookupUserGeotarget();
    const radio = document.getElementById('backboneRadio');
    let xatRadioUrl = getRadioUrlFromXat() || "https://stm2.srvif.com:7198/;";
    
    if (xatRadioUrl) {
        let decodedUrl = decodeURIComponent(xatRadioUrl);
        if(!decodedUrl.includes(';') && !decodedUrl.endsWith('/')) {
            radio.src = decodedUrl + '/;';
        } else {
            radio.src = decodedUrl;
        }
        radio.volume = 1.0;
        radio.load();
        startMetadataScanner(decodedUrl);
        
        document.body.addEventListener('mouseenter', () => {
            if (radio.paused) {
                radio.play().catch(e => console.log("Audio attivo."));
            }
        }, { once: true });
    }
});
