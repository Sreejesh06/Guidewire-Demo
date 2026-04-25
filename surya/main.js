// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- REVEAL OBSERVER (Matching logic.html) ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (entry.target.id === 'hero-quote') runHeroTyping();
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- HERO TYPING QUOTE (Matching logic.html style) ---
function runHeroTyping() {
    const quote = "Fraud doesn't sleep. But our sensors never stop watching.";
    const heroH1 = document.getElementById('hero-quote');
    if (!heroH1 || heroH1.children.length > 0) return; // Prevent double trigger

    quote.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        if (char === ' ') span.style.width = '0.3em';
        span.style.transition = `opacity 0.1s ease ${i * 0.03}s`;
        heroH1.appendChild(span);
        setTimeout(() => span.style.opacity = '1', 100);
    });
}

// --- GLOBAL GSAP ANIMATIONS ---
// Sections fade in
gsap.utils.toArray('.phase-header').forEach(header => {
    gsap.from(header, {
        scrollTrigger: { trigger: header, start: "top 80%" },
        opacity: 0, y: 50, duration: 1
    });
});

gsap.utils.toArray('.layer-section').forEach(layer => {
    gsap.from(layer.querySelector('.layer-visual-wrap'), {
        scrollTrigger: { trigger: layer, start: "top 70%" },
        opacity: 0, x: layer.querySelector('.reverse') ? 50 : -50, duration: 1, ease: "power3.out"
    });
    gsap.from(layer.querySelector('.layer-info'), {
        scrollTrigger: { trigger: layer, start: "top 70%" },
        opacity: 0, x: layer.querySelector('.reverse') ? -50 : 50, duration: 1, ease: "power3.out", delay: 0.2
    });
});

// --- LAYER 1: SINE WAVE & SHAKE ---
const sineCanvas = document.getElementById('sine-canvas');
if (sineCanvas) {
    const sCtx = sineCanvas.getContext('2d');
    let sWidth = sineCanvas.width = sineCanvas.offsetWidth;
    let sHeight = sineCanvas.height = sineCanvas.offsetHeight;
    let time = 0;

    function drawSine() {
        sCtx.clearRect(0, 0, sWidth, sHeight);
        sCtx.beginPath();
        sCtx.strokeStyle = '#00ff88';
        sCtx.lineWidth = 2;
        for (let i = 0; i < sWidth; i++) {
            const y = sHeight / 2 + Math.sin(i * 0.05 + time) * 15 + (Math.random() * 4 - 2); // Add chaotic noise
            if (i === 0) sCtx.moveTo(i, y);
            else sCtx.lineTo(i, y);
        }
        sCtx.stroke();
        time += 0.1;
        requestAnimationFrame(drawSine);
    }
    drawSine();

    ScrollTrigger.create({
        trigger: '#layer1',
        start: "top center",
        onEnter: () => {
            gsap.fromTo('#accel-telemetry', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" });
        }
    });
}

// Telemetry Logic
const accX = document.getElementById('acc-x');
const accY = document.getElementById('acc-y');
const accZ = document.getElementById('acc-z');
const agCanvas = document.getElementById('accel-graph-canvas');

if (agCanvas) {
    const agCtx = agCanvas.getContext('2d');
    agCanvas.width = agCanvas.offsetWidth || 108;
    agCanvas.height = agCanvas.offsetHeight || 40;

    let historyX = new Array(50).fill(0);
    let historyY = new Array(50).fill(0);
    let historyZ = new Array(50).fill(0);

    function updateTelemetry() {
        const nx = (Math.random() * 2 - 1) * 0.1;
        const ny = (Math.random() * 2 - 1) * 0.1;
        const nz = 0.98 + (Math.random() * 2 - 1) * 0.05;

        if (accX) accX.innerText = (nx > 0 ? '+' : '') + nx.toFixed(3);
        if (accY) accY.innerText = (ny > 0 ? '+' : '') + ny.toFixed(3);
        if (accZ) accZ.innerText = (nz > 0 ? '+' : '') + nz.toFixed(3);

        historyX.push(nx); historyX.shift();
        historyY.push(ny); historyY.shift();
        historyZ.push(nz); historyZ.shift();

        agCtx.clearRect(0, 0, agCanvas.width, agCanvas.height);
        const drawLine = (history, color, offset) => {
            agCtx.beginPath();
            agCtx.strokeStyle = color;
            agCtx.lineWidth = 1;
            for (let i = 0; i < history.length; i++) {
                const x = (i / history.length) * agCanvas.width;
                const y = agCanvas.height / 2 + history[i] * offset;
                if (i === 0) agCtx.moveTo(x, y);
                else agCtx.lineTo(x, y);
            }
            agCtx.stroke();
        };

        drawLine(historyX, '#00b361', 50); // X (Green)
        drawLine(historyY, '#ff4d4d', 50); // Y (Red)
        drawLine(historyZ, '#9d4edd', 20); // Z (Purple)

        requestAnimationFrame(updateTelemetry);
    }
    updateTelemetry();
}

// --- LAYER 2: ATMOS RAIN ---
const rainCanvas = document.getElementById('rain-canvas');
if (rainCanvas) {
    const rCtx = rainCanvas.getContext('2d');
    rainCanvas.width = rainCanvas.offsetWidth || 300;
    rainCanvas.height = rainCanvas.offsetHeight || 300;
    const drops = [];
    for (let i = 0; i < 80; i++) {
        drops.push({ x: Math.random() * rainCanvas.width, y: Math.random() * rainCanvas.height, speed: 3 + Math.random() * 4 });
    }
    function drawRain() {
        rCtx.fillStyle = 'rgba(253,252,251,0.2)';
        rCtx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);
        rCtx.fillStyle = '#121212';
        drops.forEach(d => {
            rCtx.fillRect(d.x, d.y, 1, 15);
            d.y += d.speed;
            if (d.y > rainCanvas.height) { d.y = -15; d.x = Math.random() * rainCanvas.width; }
        });
        requestAnimationFrame(drawRain);
    }
    drawRain();

    ScrollTrigger.create({
        trigger: '#layer2',
        start: "top center",
        onEnter: () => {
            const tl = gsap.timeline();
            tl.to('#lightning-flash', { opacity: 0.8, duration: 0.05 })
                .to('#lightning-flash', { opacity: 0, duration: 0.1 })
                .to('#lightning-flash', { opacity: 0.5, duration: 0.05, delay: 0.1 })
                .to('#lightning-flash', { opacity: 0, duration: 0.3 });
        }
    });
}

// --- LAYER 3: TEMPORAL CLOCKS ---
function pad(num, size = 2) { return ('000' + num).slice(-size); }
const sClock = document.getElementById('server-clock');
const cClock = document.getElementById('client-clock');
if (sClock && cClock) {
    function updateClocks() {
        const now = new Date();
        const serverStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(now.getMilliseconds(), 3)}`;
        sClock.innerText = serverStr;

        // Glitched client clock
        const glitchNow = new Date(now.getTime() - 47300 + (Math.random() * 2000 - 1000));
        const clientStr = `${pad(glitchNow.getHours())}:${pad(glitchNow.getMinutes())}:${pad(glitchNow.getSeconds())}.${pad(glitchNow.getMilliseconds(), 3)}`;
        cClock.innerText = clientStr;

        requestAnimationFrame(updateClocks);
    }
    updateClocks();
}

// --- LAYER 4: HEX GRID ---
const hexGrid = document.getElementById('hex-grid');
if (hexGrid) {
    function createHex(x, y, r) {
        let pts = [];
        for (let i = 0; i < 6; i++) {
            let angle_deg = 60 * i;
            let angle_rad = Math.PI / 180 * angle_deg;
            pts.push(`${x + r * Math.cos(angle_rad)},${y + r * Math.sin(angle_rad)}`);
        }
        let p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        p.setAttribute("points", pts.join(" "));
        p.setAttribute("class", "hex-poly");
        return p;
    }
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 8; col++) {
            let r = 25;
            let x = r * 3 / 2 * col + 40;
            let y = r * Math.sqrt(3) * (row + 0.5 * (col & 1)) + 40;
            hexGrid.appendChild(createHex(x, y, r));
        }
    }
    ScrollTrigger.create({
        trigger: '#layer4',
        start: "top center",
        onEnter: () => {
            const polys = document.querySelectorAll('.hex-poly');
            gsap.to(polys, {
                fill: 'rgba(255, 77, 77, 0.2)',
                stroke: '#ff4d4d',
                duration: 0.2,
                stagger: { amount: 0.5, from: "center" },
                yoyo: true, repeat: 3
            });
            gsap.fromTo('#shield-wave',
                { width: 0, height: 0, opacity: 1 },
                { width: 400, height: 400, opacity: 0, duration: 1.2, delay: 0.5 }
            );
        }
    });
}

// --- LAYER 5: VELOCITY CANVAS ---
const vCanvas = document.getElementById('velocity-canvas');
if (vCanvas) {
    const vCtx = vCanvas.getContext('2d');
    let vW = vCanvas.width = vCanvas.offsetWidth || 300;
    let vH = vCanvas.height = vCanvas.offsetHeight || 300;
    let vProgress = 0;
    let vAnimating = false;

    function drawVelocity() {
        vCtx.clearRect(0, 0, vW, vH);

        let startX = vW * 0.2 + 20, startY = vH * 0.7;
        let endX = vW * 0.8 - 20, endY = vH * 0.3;
        let cpX = vW * 0.5, cpY = vH * 0.1;

        vCtx.beginPath();
        vCtx.moveTo(startX, startY);
        vCtx.quadraticCurveTo(cpX, cpY, endX, endY);
        vCtx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
        vCtx.lineWidth = 2;
        vCtx.stroke();

        if (vAnimating) {
            let t = vProgress;
            let x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * cpX + t * t * endX;
            let y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * cpY + t * t * endY;

            vCtx.beginPath();
            vCtx.arc(x, y, 6, 0, Math.PI * 2);
            vCtx.fillStyle = '#00ff88';
            vCtx.fill();
            vCtx.shadowBlur = 12;
            vCtx.shadowColor = '#00ff88';

            vProgress += 0.015;
            if (vProgress > 0.5) { // Hit glass
                vAnimating = false;
                vCtx.fillStyle = '#ff4d4d';
                vCtx.fill();
                gsap.to('#glass-barrier', { x: 8, duration: 0.05, yoyo: true, repeat: 5, backgroundColor: 'rgba(255,77,77,0.5)' });
            } else {
                requestAnimationFrame(drawVelocity);
            }
        }
    }
    drawVelocity();
    ScrollTrigger.create({
        trigger: '#layer5',
        start: "top center",
        onEnter: () => { vProgress = 0; vAnimating = true; requestAnimationFrame(drawVelocity); }
    });
}

// --- LAYER 6: HEURISTICS ---
ScrollTrigger.create({
    trigger: '#layer6',
    start: "top center",
    onEnter: () => {
        const packets = document.querySelectorAll('.packet-source');
        gsap.set(packets, { x: -150, opacity: 0 });
        packets.forEach((p, i) => {
            let isClean = p.classList.contains('clean');
            gsap.to(p, {
                x: isClean ? 280 : 120,
                opacity: 1,
                duration: 1.2,
                delay: i * 0.6,
                ease: "power2.out",
                onComplete: () => {
                    if (!isClean) {
                        gsap.to(p, { y: 70, opacity: 0, duration: 0.6, scale: 0.8 });
                    } else {
                        gsap.to(p, { opacity: 0, duration: 0.6, scale: 1.2 });
                    }
                }
            });
        });
    }
});

// --- LAYER 7: IDENTITY GRAPH ---
const nCanvas = document.getElementById('node-canvas');
if (nCanvas) {
    const nCtx = nCanvas.getContext('2d');
    let nW = nCanvas.width = nCanvas.offsetWidth || 300;
    let nH = nCanvas.height = nCanvas.offsetHeight || 300;
    let nodes = [];
    let centerNode = { x: nW / 2, y: nH / 2 };

    function initNodes() {
        nodes = [];
        for (let i = 0; i < 18; i++) {
            let angle = Math.random() * Math.PI * 2;
            let radius = 60 + Math.random() * 90;
            nodes.push({
                x: centerNode.x + Math.cos(angle) * radius,
                y: centerNode.y + Math.sin(angle) * radius,
                active: true
            });
        }
    }
    initNodes();

    function drawNodes() {
        nCtx.clearRect(0, 0, nW, nH);

        nodes.forEach(n => {
            nCtx.beginPath();
            nCtx.moveTo(centerNode.x, centerNode.y);
            nCtx.lineTo(n.x, n.y);
            nCtx.strokeStyle = n.active ? 'rgba(0, 255, 136, 0.6)' : 'rgba(255, 77, 77, 0.6)';
            nCtx.lineWidth = n.active ? 1.5 : 2.5;
            if (!n.active) nCtx.setLineDash([6, 6]);
            else nCtx.setLineDash([]);
            nCtx.stroke();

            nCtx.beginPath();
            nCtx.arc(n.x, n.y, 5, 0, Math.PI * 2);
            nCtx.fillStyle = n.active ? '#00ff88' : '#ff4d4d';
            nCtx.fill();
        });

        nCtx.beginPath();
        nCtx.arc(centerNode.x, centerNode.y, 10, 0, Math.PI * 2);
        nCtx.fillStyle = '#00ff88';
        nCtx.fill();
        nCtx.shadowBlur = 20;
        nCtx.shadowColor = '#00ff88';
        nCtx.shadowOffsetX = 0; nCtx.shadowOffsetY = 0;
    }
    drawNodes();

    ScrollTrigger.create({
        trigger: '#layer7',
        start: "top center",
        onEnter: () => {
            setTimeout(() => {
                nodes.forEach(n => n.active = false);
                drawNodes();
                gsap.to(nodes, {
                    x: (i, t) => t.x + (Math.random() - 0.5) * 150,
                    y: (i, t) => t.y + (Math.random() - 0.5) * 150,
                    duration: 1.5,
                    ease: "power2.out",
                    onUpdate: drawNodes
                });
            }, 800);
        }
    });
}

// --- LAYER 8: ML CORE & TERMINAL ---
ScrollTrigger.create({
    trigger: '#layer8',
    start: "top 60%",
    onEnter: () => {
        document.querySelectorAll('.vote-fill').forEach(fill => {
            fill.style.width = fill.style.getPropertyValue('--w');
        });

        const lines = document.querySelectorAll('.t-line:not(.verdict-line)');
        lines.forEach((line, i) => {
            gsap.to(line, { opacity: 1, y: 0, duration: 0.1, delay: i * 0.4 });
        });

        setTimeout(() => {
            const vLine = document.getElementById('verdict-line');
            if (vLine) {
                vLine.style.display = 'block';
                gsap.to(vLine, { opacity: 1, y: 0, duration: 0.1 });

                const text = "FRAUD RING CONFIRMED. QUARANTINE ENGAGED.";
                const textEl = document.getElementById('verdict-text');
                textEl.innerHTML = "";
                let charIdx = 0;
                let typeInterval = setInterval(() => {
                    textEl.innerHTML += text[charIdx];
                    charIdx++;
                    if (charIdx >= text.length) clearInterval(typeInterval);
                }, 40);

                gsap.to('.verdict-section', { backgroundColor: 'rgba(200, 20, 20, 0.2)', duration: 0.3, yoyo: true, repeat: 4 });
            }
        }, lines.length * 400 + 200);
    }
});

const mlCanvas = document.getElementById('ml-canvas');
if (mlCanvas) {
    const mlCtx = mlCanvas.getContext('2d');
    let mlW = mlCanvas.width = mlCanvas.offsetWidth || 800;
    let mlH = mlCanvas.height = mlCanvas.offsetHeight || 600;
    let mlTime = 0;
    function drawML() {
        mlCtx.clearRect(0, 0, mlW, mlH);
        let cx = mlW * 0.7, cy = mlH / 2; // Offset to the right side of the section

        for (let r = 0; r < 5; r++) {
            mlCtx.save();
            mlCtx.translate(cx, cy);
            mlCtx.rotate(mlTime * (r % 2 === 0 ? 1 : -1) * (0.005 + r * 0.002));

            mlCtx.beginPath();
            mlCtx.arc(0, 0, 120 + r * 60, 0, Math.PI * 1.6);
            mlCtx.strokeStyle = `rgba(18, 18, 18, ${0.05 + (r * 0.05)})`;
            mlCtx.lineWidth = 2 + r;
            mlCtx.stroke();
            mlCtx.restore();
        }

        mlTime++;
        requestAnimationFrame(drawML);
    }
    drawML();
}

// Window resize handler
window.addEventListener('resize', () => {
    if (sineCanvas) { sWidth = sineCanvas.width = sineCanvas.offsetWidth; sHeight = sineCanvas.height = sineCanvas.offsetHeight; }
    if (rainCanvas) { rainCanvas.width = rainCanvas.offsetWidth; rainCanvas.height = rainCanvas.offsetHeight; }
    if (vCanvas) { vW = vCanvas.width = vCanvas.offsetWidth; vH = vCanvas.height = vCanvas.offsetHeight; }
    if (nCanvas) {
        nW = nCanvas.width = nCanvas.offsetWidth;
        nH = nCanvas.height = nCanvas.offsetHeight;
        if (typeof centerNode !== 'undefined') { centerNode = { x: nW / 2, y: nH / 2 }; initNodes(); drawNodes(); }
    }
    if (mlCanvas) { mlW = mlCanvas.width = mlCanvas.offsetWidth; mlH = mlCanvas.height = mlCanvas.offsetHeight; }
    const resAgCanvas = document.getElementById('accel-graph-canvas');
    if (resAgCanvas) { resAgCanvas.width = resAgCanvas.offsetWidth; resAgCanvas.height = resAgCanvas.offsetHeight; }
});
