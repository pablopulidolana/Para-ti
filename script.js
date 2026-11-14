const phrases = [
    "Te amo", "I love you", "Je t'aime", "Ti amo", "Ich liebe dich",
    "Eu te amo", "愛してる", "사랑해", "我爱你", "Я тебя люблю",
    "أحبك", "Ik hou van jou", "Jag älskar dig", "Jeg elsker deg", "Jeg elsker dig",
    "Rakastan sinua", "Σ' αγαπώ", "Seni seviyorum", "Kocham Cię", "Miluji tě",
    "Szeretlek", "Te iubesc", "Обичам те", "Volim te", "Ljubim te",
    "אני אוהב אותך", "मैं तुमसे प्यार करता हूँ", "ฉันรักคุณ", "Anh yêu em", "Aku cinta kamu",
    "Mahal kita", "Maite zaitut", "T'estimo", "Quérote", "Ég elska þig",
    "Mo ni fe re", "Nakupenda", "Ngiyakuthanda", "S'agapo", "Aloha wau iā ʻoe",
    "Aroha ahau ki a koe", "Is breá liom tú", "Rwy'n dy garu di", "Mi amas vin"
];

const canvas = document.getElementById('heart-canvas');
const centerMessage = document.getElementById('center-message');

function drawHeart() {
    const existingWords = document.querySelectorAll('.love-word');
    existingWords.forEach(word => word.remove());

    const isMobile = window.innerWidth <= 650;
    const scale = isMobile ? 9.5 : 17.5; 
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2 - (isMobile ? 10 : 20);

    const total = phrases.length;

    phrases.forEach((phrase, index) => {
        const t = (index / total) * 2 * Math.PI;

        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        const posX = centerX + x * scale;
        const posY = centerY + y * scale;

        const span = document.createElement('span');
        span.classList.add('love-word');
        span.textContent = phrase;
        span.style.left = `${posX}px`;
        span.style.top = `${posY}px`;

        canvas.appendChild(span);

        setTimeout(() => {
            span.classList.add('visible');
        }, index * 75);
    });

    const totalAnimationTime = total * 75 + 400;
    setTimeout(() => {
        centerMessage.classList.add('visible');
        canvas.classList.add('heart-beat');
    }, totalAnimationTime);
}

window.addEventListener('DOMContentLoaded', drawHeart);

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        centerMessage.classList.remove('visible');
        canvas.classList.remove('heart-beat');
        drawHeart();
    }, 300);
});