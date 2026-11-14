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

function drawFilledHeart() {
    const existingWords = document.querySelectorAll('.love-word');
    existingWords.forEach(word => word.remove());

    const isMobile = window.innerWidth <= 680;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const centerX = width / 2;
    const centerY = height / 2 - (isMobile ? 8 : 15);

    // Espaciado más compacto para un relleno más denso
    const stepX = isMobile ? 24 : 38;
    const stepY = isMobile ? 14 : 21;
    const scale = isMobile ? 130 : 240;

    const validPoints = [];

    for (let py = -height / 2; py <= height / 2; py += stepY) {
        for (let px = -width / 2; px <= width / 2; px += stepX) {
            const nx = px / scale;
            const ny = -(py + (isMobile ? 10 : 20)) / scale;

            // Ecuación implícita del corazón: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
            const a = nx * nx + ny * ny - 1;
            const heartValue = a * a * a - nx * nx * ny * ny * ny;

            if (heartValue <= 0) {
                const jitterX = (Math.random() - 0.5) * (stepX * 0.4);
                const jitterY = (Math.random() - 0.5) * (stepY * 0.4);

                validPoints.push({
                    x: centerX + px + jitterX,
                    y: centerY + py + jitterY
                });
            }
        }
    }

    // Mezclar orden de aparición aleatoriamente
    validPoints.sort(() => Math.random() - 0.5);

    validPoints.forEach((point, index) => {
        const span = document.createElement('span');
        span.classList.add('love-word');

        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        span.textContent = randomPhrase;

        // Intercalar azul y amarillo sin orden concreto
        if (Math.random() < 0.5) {
            span.classList.add('color-blue');
        } else {
            span.classList.add('color-yellow');
        }

        span.style.left = `${point.x}px`;
        span.style.top = `${point.y}px`;

        canvas.appendChild(span);

        setTimeout(() => {
            span.classList.add('visible');
        }, index * 12);
    });

    // Activar el latido suave cuando se termina de rellenar el corazón
    const totalAnimationTime = validPoints.length * 12 + 300;
    setTimeout(() => {
        canvas.classList.add('heart-beat');
    }, totalAnimationTime);
}

window.addEventListener('DOMContentLoaded', drawFilledHeart);

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        canvas.classList.remove('heart-beat');
        drawFilledHeart();
    }, 300);
});
