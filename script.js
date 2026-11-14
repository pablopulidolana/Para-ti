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

const colorClasses = ['color-blue', 'color-blue-bright', 'color-yellow', 'color-yellow-bright'];
// Ángulos típicos de nube de palabras (rectas, diagonales suaves y verticales)
const angles = [0, 0, -15, 15, -30, 30, -45, 45, 90, -90];

const canvas = document.getElementById('heart-canvas');

function createWordCloudHeart() {
    const existingWords = document.querySelectorAll('.love-word');
    existingWords.forEach(w => w.remove());

    const isMobile = window.innerWidth <= 680;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const centerX = width / 2;
    const centerY = height / 2 - (isMobile ? 10 : 18);

    const elements = [];

    // 1. CONTORNO DEFINIDO (Para que la silueta del corazón sea perfecta)
    const borderCount = isMobile ? 55 : 85;
    const borderScale = isMobile ? 9.6 : 17.5;

    for (let i = 0; i < borderCount; i++) {
        const t = (i / borderCount) * 2 * Math.PI;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        // Calcular inclinación tangente aproximada o ángulo ligero para el borde
        const angle = (Math.random() - 0.5) * 35;
        const size = isMobile ? (Math.random() * 0.25 + 0.62) : (Math.random() * 0.35 + 0.85);

        elements.push({
            x: centerX + x * borderScale,
            y: centerY + y * borderScale,
            angle: angle,
            size: size,
            weight: 700
        });
    }

    // 2. RELLENO INTERIOR TIPO NUBE DE PALABRAS (Diferentes tamaños y rotaciones)
    const innerCount = isMobile ? 130 : 230;
    const innerScale = isMobile ? 132 : 242;

    let attempts = 0;
    let added = 0;

    while (added < innerCount && attempts < 4000) {
        attempts++;
        // Generar punto aleatorio dentro del cuadrado contenedor
        const rx = (Math.random() * 2 - 1) * 1.15;
        const ry = (Math.random() * 2 - 1) * 1.15;

        // Ecuación del corazón (dejando un pequeño margen respecto al borde)
        const a = rx * rx + ry * ry - 0.88;
        const heartVal = a * a * a - rx * rx * ry * ry * ry;

        if (heartVal <= 0) {
            const posX = centerX + rx * innerScale;
            const posY = centerY - ry * innerScale + (isMobile ? 8 : 15);

            // Variar tamaños: algunos "Te amo" más grandes que destacan y otros pequeñitos rellenando huecos
            const isBig = Math.random() < 0.18;
            const size = isMobile
                ? (isBig ? Math.random() * 0.3 + 0.85 : Math.random() * 0.25 + 0.52)
                : (isBig ? Math.random() * 0.5 + 1.25 : Math.random() * 0.35 + 0.72);

            const angle = angles[Math.floor(Math.random() * angles.length)];

            elements.push({
                x: posX,
                y: posY,
                angle: angle,
                size: size,
                weight: isBig ? 700 : 500
            });
            added++;
        }
    }

    // Mezclar orden de aparición
    elements.sort(() => Math.random() - 0.5);

    elements.forEach((item, index) => {
        const span = document.createElement('span');
        span.classList.add('love-word');

        // Dar algo más de protagonismo al español e inglés entre todos los idiomas
        const phrase = Math.random() < 0.22
            ? (Math.random() < 0.6 ? "Te amo" : "I love you")
            : phrases[Math.floor(Math.random() * phrases.length)];

        span.textContent = phrase;

        // Color aleatorio entre la paleta azul y amarilla
        const colorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
        span.classList.add(colorClass);

        span.style.left = `${item.x}px`;
        span.style.top = `${item.y}px`;
        span.style.fontSize = `${item.size}rem`;
        span.style.fontWeight = item.weight;

        // Posición inicial antes de aparecer (pequeña y desplazada)
        const startOffsetX = (Math.random() - 0.5) * 60;
        const startOffsetY = (Math.random() - 0.5) * 60;
        span.style.transform = `translate(calc(-50% + ${startOffsetX}px), calc(-50% + ${startOffsetY}px)) rotate(${item.angle}deg) scale(0.2)`;

        canvas.appendChild(span);

        // Animar hacia su posición final dentro del corazón
        setTimeout(() => {
            span.classList.add('visible');
            span.style.transform = `translate(-50%, -50%) rotate(${item.angle}deg) scale(1)`;
        }, index * 10);
    });

    // Latido suave al completar el corazón
    const totalTime = elements.length * 10 + 400;
    setTimeout(() => {
        canvas.classList.add('heart-beat');
    }, totalTime);
}

window.addEventListener('DOMContentLoaded', createWordCloudHeart);

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        canvas.classList.remove('heart-beat');
        createWordCloudHeart();
    }, 300);
});
