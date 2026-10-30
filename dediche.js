// --- LOGICA PLAYER & PARTICELE ---
let _0x_gr = "";
function speakGreeting(_0x_txt) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const _0x_ut = new SpeechSynthesisUtterance(_0x_txt);
    _0x_ut.lang = 'it-IT';
    _0x_ut.rate = 0.9;
    window.speechSynthesis.speak(_0x_ut);
  }
}

function updateTimeAndGreeting() {
  const _0x_now = new Date();
  const _0x_hr = _0x_now.getHours();
  const _0x_min = String(_0x_now.getMinutes()).padStart(2, '0');
  const _0x_sec = String(_0x_now.getSeconds()).padStart(2, '0');

  document.getElementById('clockText').textContent = `${String(_0x_hr).padStart(2, '0')}:${_0x_min}:${_0x_sec}`;

  let _0x_ng = "";
  if (_0x_hr >= 6 && _0x_hr < 13) {
    _0x_ng = "BUONGIORNO";
  } else if (_0x_hr >= 13 && _0x_hr < 18) {
    _0x_ng = "BUON POMERIGGIO";
  } else if (_0x_hr >= 18 && _0x_hr < 22) {
    _0x_ng = "BUONASERA";
  } else {
    _0x_ng = "BUONANOTTE";
  }

  if (_0x_ng !== _0x_gr) {
    _0x_gr = _0x_ng;
    document.getElementById('greetingText').textContent = _0x_gr;
    speakGreeting(_0x_gr);
  }
}

setInterval(updateTimeAndGreeting, 1000);
updateTimeAndGreeting();

const _0x_audioObj = new Audio('https://stm2.srvif.com:7198/;');
let _0x_onl = false;

function togglePlay() {
  if (_0x_audioObj.paused) {
    _0x_audioObj.play().then(() => {
      $('#btn-play').text('⏸ PAUSE');
      $('#item-music').fadeIn(650);
      _0x_onl = true;
      _0x_uiFx();
    }).catch(() => {
      _0x_audioObj.load();
      $('#btn-play').text('▶ PLAY');
    });
  } else {
    _0x_audioObj.pause();
    $('#btn-play').text('▶ PLAY');
  }
}

function stopSystem() {
  _0x_audioObj.pause();
  _0x_audioObj.currentTime = 0;
  _0x_onl = false;
  $('#item-music').fadeOut(400);
  $('#btn-play').text('▶ PLAY');
}

function setVolume(val) {
  _0x_audioObj.volume = val;
}

function _0x_uiFx() {
  if (!_0x_onl) return;
  // Eventuale logica di aggiornamento metadata stream
}

setInterval(() => {
  if (_0x_onl) _0x_uiFx();
}, 10000);

const _0x_kText = "PARTY_DEDICA_TEXT";
const _0x_kLink = "PARTY_DEDICA_LINK";
const _0x_inp = document.getElementById('userInput');
const _0x_scr = document.getElementById('scroller-text');

function loadSavedText() {
  const saved = localStorage.getItem(_0x_kText);
  if (saved && saved.trim() !== '') {
    _0x_scr.textContent = saved;
  }
}

function updateText() {
  const val = _0x_inp.value.trim();
  if (val === '') return;
  if (val.toUpperCase() === 'RESET') {
    resetText();
    return;
  }
  if (val.includes('http') || val.includes('www')) {
    localStorage.setItem(_0x_kLink, val);
  }
  _0x_scr.textContent = val;
  localStorage.setItem(_0x_kText, val);
  _0x_inp.value = '';
}

function copyLink() {
  const link = localStorage.getItem(_0x_kLink) || _0x_inp.value.trim();
  if (link) {
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copiato negli appunti!');
    }).catch(() => {
      alert('Impossibile copiare automaticamente il link.');
    });
  } else {
    alert('Nessun link salvato da copiare!');
  }
}

function resetText() {
  localStorage.removeItem(_0x_kText);
  localStorage.removeItem(_0x_kLink);
  _0x_inp.value = '';
  _0x_scr.textContent = "IN ATTESA DI STREAM...";
}

_0x_inp.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') updateText();
});

// --- CANVAS PARTICELE ---
const _0x_cvs = document.getElementById('particlesCanvas');
const _0x_ctx = _0x_cvs.getContext('2d');
const _0x_cnt = document.getElementById('mainContainer');
let _0x_parts = [];
const _0x_numP = 41;
const _0x_cols = ['#ff0055', '#00ffcc', '#ffcc00', '#33ff00', '#00ffff', '#0066ff', '#cc00ff'];
const _0x_notes = ['♪', '♫', '♩', '♬', '♭', '♮'];

function _0x_resCvs() {
  _0x_cvs.width = _0x_cnt.clientWidth;
  _0x_cvs.height = _0x_cnt.clientHeight;
}
window.addEventListener('resize', _0x_resCvs);

class _0x_PartClass {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * _0x_cvs.width;
    this.y = Math.random() * _0x_cvs.height;
    this.isNote = Math.random() > 0.4;
    this.char = _0x_notes[Math.floor(Math.random() * _0x_notes.length)];
    this.size = this.isNote ? Math.random() * 12 + 10 : Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 1.6;
    this.speedY = (Math.random() - 0.5) * 1.6;
    this.color = _0x_cols[Math.floor(Math.random() * _0x_cols.length)];
    this.alpha = Math.random() * 0.7 + 0.3;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x <= 0 || this.x >= _0x_cvs.width) this.speedX *= -1;
    if (this.y <= 0 || this.y >= _0x_cvs.height) this.speedY *= -1;
  }
  draw() {
    _0x_ctx.save();
    _0x_ctx.globalAlpha = this.alpha;
    if (this.isNote) {
      _0x_ctx.font = `${this.size}px sans-serif`;
      _0x_ctx.fillStyle = this.color;
      _0x_ctx.fillText(this.char, this.x, this.y);
    } else {
      _0x_ctx.beginPath();
      _0x_ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      _0x_ctx.fillStyle = this.color;
      _0x_ctx.fill();
    }
    _0x_ctx.restore();
  }
}

function _0x_initParts() {
  _0x_resCvs();
  _0x_parts = [];
  for (let i = 0; i < _0x_numP; i++) {
    _0x_parts.push(new _0x_PartClass());
  }
}

function _0x_animParts() {
  _0x_ctx.clearRect(0, 0, _0x_cvs.width, _0x_cvs.height);
  _0x_parts.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(_0x_animParts);
}

loadSavedText();
_0x_initParts();
_0x_animParts();
