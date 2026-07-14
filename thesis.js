// ==========================================================================
// Master Thesis Interactive Gallery & Simulators Script
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. GALLERY & LIGHTBOX CONTROLS
    // ==========================================================================
    const thumbs = document.querySelectorAll('.panel-thumb');
    const activePanelImg = document.getElementById('activePanelImg');
    const activePanelTitle = document.getElementById('activePanelTitle');
    const activePanelDesc = document.getElementById('activePanelDesc');
    const lightboxOpenBtn = document.getElementById('lightboxOpenBtn');

    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
    const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
    const lightboxNextBtn = document.getElementById('lightboxNextBtn');

    let currentPanelIndex = 0;
    const panelSources = Array.from(thumbs).map(thumb => ({
        src: thumb.getAttribute('data-src'),
        title: thumb.getAttribute('data-title'),
        desc: thumb.getAttribute('data-desc')
    }));

    // Switch Panel in main view
    function selectPanel(index) {
        currentPanelIndex = index;
        thumbs.forEach((thumb, idx) => {
            if (idx === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });

        // Fade transition on active image
        activePanelImg.style.opacity = 0;
        setTimeout(() => {
            activePanelImg.src = panelSources[index].src;
            activePanelTitle.textContent = panelSources[index].title;
            activePanelDesc.textContent = panelSources[index].desc;
            activePanelImg.style.opacity = 1;
        }, 150);
    }

    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => selectPanel(index));
    });

    // Lightbox navigation
    function openLightbox() {
        lightboxImg.src = panelSources[currentPanelIndex].src;
        lightboxCaption.textContent = panelSources[currentPanelIndex].title;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentPanelIndex = (currentPanelIndex + direction + panelSources.length) % panelSources.length;
        lightboxImg.style.opacity = 0;
        setTimeout(() => {
            lightboxImg.src = panelSources[currentPanelIndex].src;
            lightboxCaption.textContent = panelSources[currentPanelIndex].title;
            lightboxImg.style.opacity = 1;
            selectPanel(currentPanelIndex); // keep thumbnail highlighted in sync
        }, 150);
    }

    if (lightboxOpenBtn && lightboxModal) {
        lightboxOpenBtn.addEventListener('click', openLightbox);
        activePanelImg.addEventListener('click', openLightbox);
        lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightboxPrevBtn.addEventListener('click', () => navigateLightbox(-1));
        lightboxNextBtn.addEventListener('click', () => navigateLightbox(1));

        // Click outside image to close
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }


    // ==========================================================================
    // 2. INTERACTIVE SIMULATORS (HTML5 CANVAS)
    // ==========================================================================
    
    // Draw technical grid background helper
    function drawCanvasGrid(ctx, w, h) {
        ctx.fillStyle = '#0a0d0c'; // Deep forest charcoal bg
        ctx.fillRect(0, 0, w, h);
        
        ctx.strokeStyle = 'rgba(0, 180, 162, 0.05)'; // Faint teal grid
        ctx.lineWidth = 1;
        
        // Grid spacing
        const spacing = 40;
        for (let x = 0; x < w; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // technical borders
        ctx.strokeStyle = 'rgba(0, 180, 162, 0.12)';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, w - 20, h - 20);
    }

    // --- Simulator 1: MRT Entrance (Sequential Rotating Fan Canopy) ---
    const canvasMrt = document.getElementById('canvasMrt');
    const sliderMrt = document.getElementById('sliderMrt');
    const readoutMrt = document.getElementById('readoutMrt');

    function drawMrtSim() {
        if (!canvasMrt) return;
        const ctx = canvasMrt.getContext('2d');
        const w = canvasMrt.width;
        const h = canvasMrt.height;
        const val = parseInt(sliderMrt.value);

        // Update readout text
        readoutMrt.textContent = `${val}% Phase / 相位`;

        drawCanvasGrid(ctx, w, h);

        // Draw structural stairs profile
        ctx.strokeStyle = 'rgba(244, 246, 245, 0.15)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(80, 290);
        ctx.lineTo(150, 290);
        ctx.lineTo(150, 250);
        ctx.lineTo(220, 250);
        ctx.lineTo(220, 210);
        ctx.lineTo(290, 210);
        ctx.lineTo(290, 170);
        ctx.lineTo(360, 170);
        ctx.lineTo(360, 130);
        ctx.lineTo(470, 130);
        ctx.stroke();

        // Support columns
        ctx.strokeStyle = 'rgba(162, 176, 172, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Column 1
        ctx.moveTo(150, 250);
        ctx.lineTo(150, 120);
        // Column 2
        ctx.moveTo(360, 130);
        ctx.lineTo(360, 65);
        ctx.stroke();

        // 18 rafters spaced along slope
        const numRafters = 18;
        const startX = 150;
        const startY = 120;
        const endX = 360;
        const endY = 65;

        const rafterLength = 80;
        const points = [];

        for (let i = 0; i < numRafters; i++) {
            const ratio = i / (numRafters - 1);
            const px = startX + ratio * (endX - startX);
            const py = startY + ratio * (endY - startY);

            // Compute angle with sequential delay
            // slider value maps to base angle rotation
            const progress = val / 100.0;
            const phase = progress * Math.PI * 2.0 - ratio * Math.PI * 1.5;
            // Angle range: 15 to 75 degrees
            const angleDeg = 45.0 + 30.0 * Math.sin(phase);
            const rad = angleDeg * Math.PI / 180;

            // Rafter tip position
            const tx = px + rafterLength * Math.cos(rad - Math.PI / 2);
            const ty = py - rafterLength * Math.sin(rad - Math.PI / 2);

            points.push({ px, py, tx, ty });
        }

        // Draw structural connector rods
        ctx.strokeStyle = 'rgba(0, 180, 162, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < numRafters; i++) {
            ctx.moveTo(points[i].px, points[i].py);
            ctx.lineTo(points[i].tx, points[i].ty);
        }
        ctx.stroke();

        // Draw outer glass skin envelope (connecting the tips)
        ctx.strokeStyle = '#00b4a2';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(points[0].tx, points[0].ty);
        for (let i = 1; i < numRafters; i++) {
            ctx.lineTo(points[i].tx, points[i].ty);
        }
        ctx.stroke();

        // Draw joints & details
        for (let i = 0; i < numRafters; i++) {
            const pt = points[i];
            
            // Hinge base
            ctx.fillStyle = '#a2b0ac';
            ctx.beginPath();
            ctx.circle(pt.px, pt.py, 3);
            ctx.fill();

            // Rafter Tip glow dot
            ctx.fillStyle = '#00b4a2';
            ctx.beginPath();
            ctx.circle(pt.tx, pt.ty, 4);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(0, 180, 162, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.circle(pt.tx, pt.ty, 7);
            ctx.stroke();
        }

        // Draw HUD overlay on canvas
        ctx.fillStyle = '#a2b0ac';
        ctx.font = '10px Courier New';
        ctx.fillText(`SYS.CANOPY: ACTIVE`, 25, 25);
        ctx.fillText(`LVR_COUNT: ${numRafters}`, 25, 38);
        ctx.fillText(`SWEEP: 15DEG - 75DEG`, 25, 51);
    }


    // --- Simulator 2: Bus Stop (Solar Tracking Canopy) ---
    const canvasBus = document.getElementById('canvasBus');
    const sliderBus = document.getElementById('sliderBus');
    const readoutBus = document.getElementById('readoutBus');

    function drawBusSim() {
        if (!canvasBus) return;
        const ctx = canvasBus.getContext('2d');
        const w = canvasBus.width;
        const h = canvasBus.height;
        const val = parseInt(sliderBus.value);

        // Sun position calculations
        // Slider 0-100 maps to sunrise to sunset: 15 to 165 degrees
        const sunAngleDeg = 15.0 + 150.0 * (val / 100.0);
        const sunRad = sunAngleDeg * Math.PI / 180;
        
        let timeLabel = "Morning / 朝陽";
        if (val > 40 && val < 60) timeLabel = "Noon / 正午";
        else if (val >= 60) timeLabel = "Afternoon / 夕陽";
        
        readoutBus.textContent = `${timeLabel} (${sunAngleDeg.toFixed(0)}°)`;

        drawCanvasGrid(ctx, w, h);

        const groundY = 280;
        const shelterX = 275;
        const shelterY = 160;
        const shelterW = 220;

        // Draw Sun
        const sunOrbitR = 150;
        const sunX = shelterX + sunOrbitR * Math.cos(sunRad + Math.PI);
        const sunY = groundY - sunOrbitR * Math.sin(sunRad);

        // Sun orbit path
        ctx.strokeStyle = 'rgba(244, 246, 245, 0.05)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(shelterX, groundY, sunOrbitR, Math.PI, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);

        // Sun ray lines to shelter roof
        ctx.strokeStyle = 'rgba(255, 176, 0, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(shelterX, shelterY);
        ctx.stroke();

        // Draw Sun Circle
        ctx.fillStyle = '#ffb000'; // Sun yellow
        ctx.beginPath();
        ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Sun Glow ring
        ctx.strokeStyle = 'rgba(255, 176, 0, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 13, 0, Math.PI * 2);
        ctx.stroke();

        // Louver angle logic: tracking the solar altitude
        // The louvers tilt dynamically to block the incoming solar rays
        const louverAngleRad = sunRad; 

        // Calculate Shadow offset on ground
        // Shadow offset = H * cot(sunAngle)
        const shelterH = groundY - shelterY;
        const cotan = 1.0 / Math.tan(sunRad);
        const shadowOffset = shelterH * cotan;
        
        const shadowStartX = (shelterX - shelterW/2) - shadowOffset;
        const shadowEndX = (shelterX + shelterW/2) - shadowOffset;

        // Draw Translucent shadow polygon on the ground
        ctx.fillStyle = 'rgba(0, 180, 162, 0.18)';
        ctx.beginPath();
        ctx.moveTo(shelterX - shelterW/2, shelterY);
        ctx.lineTo(shelterX + shelterW/2, shelterY);
        ctx.lineTo(shadowEndX, groundY);
        ctx.lineTo(shadowStartX, groundY);
        ctx.closePath();
        ctx.fill();

        // Draw Ground Line
        ctx.strokeStyle = 'rgba(244, 246, 245, 0.15)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(50, groundY);
        ctx.lineTo(500, groundY);
        ctx.stroke();

        // Draw Shadow bar on ground explicitly
        ctx.strokeStyle = '#00b4a2';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(Math.max(50, shadowStartX), groundY);
        ctx.lineTo(Math.min(500, shadowEndX), groundY);
        ctx.stroke();

        // Draw Bus Stop Shelter Frame
        ctx.strokeStyle = 'rgba(162, 176, 172, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        // Support post Left
        ctx.moveTo(shelterX - shelterW/2.5, groundY);
        ctx.lineTo(shelterX - shelterW/2.5, shelterY);
        // Support post Right
        ctx.moveTo(shelterX + shelterW/2.5, groundY);
        ctx.lineTo(shelterX + shelterW/2.5, shelterY);
        // Roof beam
        ctx.moveTo(shelterX - shelterW/2, shelterY);
        ctx.lineTo(shelterX + shelterW/2, shelterY);
        ctx.stroke();

        // Passenger bench
        ctx.fillStyle = '#111614';
        ctx.strokeStyle = 'rgba(162, 176, 172, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.fillRect(shelterX - 30, groundY - 30, 60, 30);
        ctx.strokeRect(shelterX - 30, groundY - 30, 60, 30);

        // 5 Shading Louver blades on the roof
        const numLouvers = 5;
        const spacing = shelterW / (numLouvers + 1);
        const louverLength = 28;

        for (let i = 0; i < numLouvers; i++) {
            const lx = (shelterX - shelterW/2 + spacing) + i * spacing;
            const ly = shelterY;

            // Compute louver endpoints rotating around pivot lx, ly
            // Perpendicular to solar rays to block maximum light
            const lRad = louverAngleRad;
            const lx1 = lx - (louverLength/2) * Math.cos(lRad);
            const ly1 = ly - (louverLength/2) * Math.sin(lRad);
            const lx2 = lx + (louverLength/2) * Math.cos(lRad);
            const ly2 = ly + (louverLength/2) * Math.sin(lRad);

            // Draw Louver line
            ctx.strokeStyle = '#00b4a2';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(lx1, ly1);
            ctx.lineTo(lx2, ly2);
            ctx.stroke();

            // Louver Hinge Pivot
            ctx.fillStyle = '#f4f6f5';
            ctx.beginPath();
            ctx.circle(lx, ly, 3);
            ctx.fill();
        }

        // Draw HUD overlay on canvas
        ctx.fillStyle = '#a2b0ac';
        ctx.font = '10px Courier New';
        ctx.fillText(`SYS.TRACKING: OPTIMAL`, 25, 25);
        ctx.fillText(`SOLAR_ALT: ${sunAngleDeg.toFixed(1)} DEG`, 25, 38);
        ctx.fillText(`SHADE_EFF: 94.6%`, 25, 51);
    }


    // --- Simulator 3: Kangaroo Bookstore (Elastic Facade Louvers) ---
    const canvasBook = document.getElementById('canvasBook');
    const sliderBook = document.getElementById('sliderBook');
    const readoutBook = document.getElementById('readoutBook');

    function drawBookSim() {
        if (!canvasBook) return;
        const ctx = canvasBook.getContext('2d');
        const w = canvasBook.width;
        const h = canvasBook.height;
        const val = parseInt(sliderBook.value);

        // Update readout text: represent extension from 0 to 450 mm
        const extensionMm = Math.round(val * 4.5);
        readoutBook.textContent = `${extensionMm} mm / 延伸折疊量`;

        drawCanvasGrid(ctx, w, h);

        const groundY = 290;
        const facadeTopY = 90;
        
        // Draw storefront architectural outline (Glass pane, floor, ceiling)
        ctx.strokeStyle = 'rgba(244, 246, 245, 0.1)';
        ctx.lineWidth = 2;
        // Floor
        ctx.beginPath();
        ctx.moveTo(40, groundY);
        ctx.lineTo(510, groundY);
        // Ceiling/Top frame
        ctx.moveTo(40, facadeTopY);
        ctx.lineTo(510, facadeTopY);
        ctx.stroke();

        // Bookstore interior showcase line (simplified)
        ctx.fillStyle = 'rgba(162, 176, 172, 0.05)';
        ctx.fillRect(80, facadeTopY, 390, groundY - facadeTopY);
        ctx.strokeStyle = 'rgba(162, 176, 172, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(80, facadeTopY, 390, groundY - facadeTopY);
        
        // Add bookstack wireframes in interior
        ctx.strokeStyle = 'rgba(162, 176, 172, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(100, groundY - 80, 70, 80);
        ctx.strokeRect(380, groundY - 80, 70, 80);

        // Scissor expansion math:
        // Height of the scissoring awning frame collapses downwards
        // Fully folded top (val=100) -> height is small (40px)
        // Fully extended down (val=0) -> height is large (170px)
        const maxH = 175;
        const minH = 45;
        const scissorHeight = maxH - (maxH - minH) * (val / 100.0);

        // Draw 3 scissor column structures
        const columnsX = [140, 275, 410];
        const numTiers = 3;
        const linkLen = 35; // length of crossed link bar

        columnsX.forEach(cx => {
            const tierHeight = scissorHeight / numTiers;
            
            // Calculate half-width dx based on linkage geometry
            const dy = tierHeight / 2;
            const dx = Math.sqrt(Math.max(4, linkLen * linkLen - dy * dy));

            // Generate joint coordinates
            const joints = [];
            for (let t = 0; t <= numTiers; t++) {
                const jy = facadeTopY + t * tierHeight;
                joints.push({
                    left: { x: cx - dx, y: jy },
                    center: { x: cx, y: jy },
                    right: { x: cx + dx, y: jy }
                });
            }

            // Draw scissor linkage bars (Crosses)
            ctx.strokeStyle = '#00b4a2';
            ctx.lineWidth = 2;
            
            for (let t = 0; t < numTiers; t++) {
                const jA = joints[t];
                const jB = joints[t + 1];

                // Link 1: top-left to bottom-right
                ctx.beginPath();
                ctx.moveTo(jA.left.x, jA.left.y);
                ctx.lineTo(jB.right.x, jB.right.y);
                ctx.stroke();

                // Link 2: top-right to bottom-left
                ctx.beginPath();
                ctx.moveTo(jA.right.x, jA.right.y);
                ctx.lineTo(jB.left.x, jB.left.y);
                ctx.stroke();
            }

            // Draw awning shading panels suspended on the outer tips
            ctx.fillStyle = 'rgba(0, 180, 162, 0.25)';
            ctx.strokeStyle = '#00b4a2';
            ctx.lineWidth = 1;
            
            for (let t = 1; t <= numTiers; t++) {
                const j = joints[t];
                // Draw shading panel plates attached to left outer joints
                ctx.fillRect(j.left.x - 12, j.left.y - 10, 12, 20);
                ctx.strokeRect(j.left.x - 12, j.left.y - 10, 12, 20);

                // Draw shading panel plates attached to right outer joints
                ctx.fillRect(j.right.x, j.right.y - 10, 12, 20);
                ctx.strokeRect(j.right.x, j.right.y - 10, 12, 20);
            }

            // Draw hinge dots
            ctx.fillStyle = '#f4f6f5';
            for (let t = 0; t <= numTiers; t++) {
                const j = joints[t];
                
                // Left joint
                ctx.beginPath();
                ctx.circle(j.left.x, j.left.y, 2.5);
                ctx.fill();

                // Right joint
                ctx.beginPath();
                ctx.circle(j.right.x, j.right.y, 2.5);
                ctx.fill();

                // Center hinge (cross midpoint) - only between tiers
                if (t < numTiers) {
                    const cy = facadeTopY + t * tierHeight + dy;
                    ctx.fillStyle = '#a2b0ac';
                    ctx.beginPath();
                    ctx.circle(cx, cy, 2);
                    ctx.fill();
                    ctx.fillStyle = '#f4f6f5';
                }
            }
        });

        // Draw HUD overlay on canvas
        ctx.fillStyle = '#a2b0ac';
        ctx.font = '10px Courier New';
        ctx.fillText(`SYS.FACADE: SCISSOR`, 25, 25);
        ctx.fillText(`LINKAGE_LEN: 35.0mm`, 25, 38);
        ctx.fillText(`STIFFNESS: 400 N/m`, 25, 51);
    }


    // ==========================================================================
    // 3. INITIALIZATION & LISTENERS
    // ==========================================================================
    
    // Bind slider input events
    if (sliderMrt) {
        sliderMrt.addEventListener('input', drawMrtSim);
    }
    if (sliderBus) {
        sliderBus.addEventListener('input', drawBusSim);
    }
    if (sliderBook) {
        sliderBook.addEventListener('input', drawBookSim);
    }

    // Trigger initial render
    selectPanel(0);
    drawMrtSim();
    drawBusSim();
    drawBookSim();

    // Re-draw when window loads just in case
    window.addEventListener('load', () => {
        drawMrtSim();
        drawBusSim();
        drawBookSim();
    });

    // --- Reveal-on-Scroll Observer for thesis.html elements ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

});

// Helper for drawing circles easily in canvas 2D context
if (CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.circle) {
    CanvasRenderingContext2D.prototype.circle = function(x, y, r) {
        this.arc(x, y, r, 0, Math.PI * 2);
    };
}
