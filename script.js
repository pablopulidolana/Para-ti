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

// Ordenamos una lista auxiliar priorizando palabras cortas/medianas para rellenar huecos estrechos
const shortPhrases = [...phrases].sort((a, b) => a.length - b.length);

const canvas = document.getElementById('heart-canvas');

function isOverlapping(rect1, rect2, margin = 5) {
    return !(
        rect1.right + margin < rect2.left ||
        rect1.left - margin > rect2.right ||
        rect1.bottom + margin < rect2.top ||
        rect1.top - margin > rect2.bottom
    );
}

function tryPlaceWord(phrase, posX, posY, fontSize, placedRects, margin) {
    const span = document.createElement('span');
    span.classList.add('love-word');
    span.textContent = phrase;
    span.style.fontSize = `${fontSize}rem`;
    span.style.left = `${posX}px`;
    span.style.top = `${posY}px`;

    canvas.appendChild(span);

    const width = span.offsetWidth;
    const height = span.offsetHeight;
    const currentRect = {
        left: posX - width / 2,
        right: posX + width / 2,
        top: posY - height / 2,
        bottom: posY + height / 2
    };

    const collides = placedRects.some(existingRect => 
        isOverlapping(currentRect, existingRect, margin)
    );

    if (collides) {
        span.remove();
        return null;
    }

    placedRects.push(currentRect);
    return span;
}

function drawHeart() {
    const existingWords = document.querySelectorAll('.love-word');
    existingWords.forEach(word => word.remove());

    const isMobile = window.innerWidth <= 650;
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2 - (isMobile ? 10 : 20);

    const scales = isMobile 
        ? [9.5, 8.2, 6.9, 5.6, 4.3, 3.0, 1.8] 
        : [17.5, 15.3, 13.1, 10.9, 8.7, 6.5, 4.3, 2.2];

    const placedRects = [];
    const placedSpans = [];
    let globalIndex = 0;

    // 1. Primera pasada: colocación simétrica alternando izquierda y derecha
    scales.forEach((scale, layerIndex) => {
        const halfCandidates = Math.max(8, Math.floor(26 * (scale / scales[0])));
        const baseSize = isMobile ? 0.72 : 0.94;
        const sizeFactor = 0.75 + 0.25 * (scale / scales[0]);
        const fontSize = baseSize * sizeFactor;
        const margin = isMobile ? 3.5 : 5.5;

        for (let i = 0; i <= halfCandidates; i++) {
            // Ángulo en el lado derecho (0 a PI) y su espejo en el lado izquierdo (2*PI a PI)
            const angleOffset = (layerIndex % 2) * (Math.PI / (halfCandidates * 2));
            const tRight = (i / halfCandidates) * Math.PI + angleOffset;
            const tLeft = 2 * Math.PI - tRight;

            // Alternamos el orden de prioridad entre derecha e izquierda
            const angles = (i % 2 === 0) ? [tRight, tLeft] : [tLeft, tRight];

            angles.forEach(t => {
                const phrase = phrases[globalIndex % phrases.length];
                globalIndex++;

                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

                const posX = centerX + x * scale;
                const posY = centerY + y * scale;

                const span = tryPlaceWord(phrase, posX, posY, fontSize, placedRects, margin);
                if (span) placedSpans.push(span);
            });
        }
    });

    // 2. Segunda pasada: rellenar huecos pequeños restantes (especialmente en el lóbulo derecho e interior)
    let shortIndex = 0;
    scales.forEach((scale) => {
        const extraSteps = 60;
        const fontSize = isMobile ? 0.62 : 0.78;
        const margin = isMobile ? 3 : 4.5;

        for (let i = 0; i < extraSteps; i++) {
            const t = (i / extraSteps) * 2 * Math.PI;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            const posX = centerX + x * scale;
            const posY = centerY + y * scale;

            const phrase = shortPhrases[shortIndex % shortPhrases.length];
            const span = tryPlaceWord(phrase, posX, posY, fontSize, placedRects, margin);
            if (span) {
                placedSpans.push(span);
                shortIndex++;
            }
        }
    });

    // Animar todas las palabras colocadas
    placedSpans.forEach((span, index) => {
        setTimeout(() => {
            span.classList.add('visible');
        }, index * 14);
    });

    const totalAnimationTime = placedSpans.length * 14 + 400;
    setTimeout(() => {
        canvas.classList.add('heart-beat');
    }, totalAnimationTime);
}

document.fonts.ready.then(() => {
    drawHeart();
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        canvas.classList.remove('heart-beat');
        drawHeart();
    }, 300);
});