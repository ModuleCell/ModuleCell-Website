/* ==========================================================================
   OpenBIM Studio Los Angeles - Master JavaScript Logic & Interactive 3D Canvas
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    init3DViewer();
});

// Modal Logic
function openContactModal(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('contact-modal');
    if (modal) modal.classList.add('active');
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.classList.remove('active');
}

function submitForm(e) {
    e.preventDefault();
    alert('Thank you for your consultation request! Our Los Angeles Open BIM team will contact you within 24 business hours.');
    closeContactModal();
}

// --------------------------------------------------------------------------
// Three.js Interactive 3D Open-IFC Viewer Simulation
// --------------------------------------------------------------------------
let scene, camera, renderer, modelGroup;
let isWireframe = true;

function init3DViewer() {
    const container = document.getElementById('ifc-canvas');
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 420;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04070D);

    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(20, 18, 28);
    camera.lookAt(0, 4, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06B6D4, 1.2);
    dirLight1.position.set(20, 40, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3B82F6, 0.8);
    dirLight2.position.set(-20, -10, -20);
    scene.add(dirLight2);

    // Grid Helper
    const grid = new THREE.GridHelper(40, 20, 0x06B6D4, 0x1E293B);
    grid.position.y = -0.1;
    scene.add(grid);

    // Build 3D Architectural Model Structure (Simulating IFC elements)
    modelGroup = new THREE.Group();

    // Slabs (IfcSlab)
    const slabMat = new THREE.MeshPhongMaterial({
        color: 0x0F172A,
        emissive: 0x06B6D4,
        emissiveIntensity: 0.1,
        wireframe: isWireframe,
        transparent: true,
        opacity: 0.85
    });

    const slabGeom = new THREE.BoxGeometry(16, 0.6, 16);
    
    const slab1 = new THREE.Mesh(slabGeom, slabMat);
    slab1.position.set(0, 0, 0);
    slab1.userData = { type: 'IfcSlab', guid: '3A$1v04K_SlabL1', name: 'Ground Floor Slab' };
    modelGroup.add(slab1);

    const slab2 = new THREE.Mesh(slabGeom, slabMat);
    slab2.position.set(0, 6, 0);
    slab2.userData = { type: 'IfcSlab', guid: '3A$2v04K_SlabL2', name: 'Level 2 Slab' };
    modelGroup.add(slab2);

    const slab3 = new THREE.Mesh(slabGeom, slabMat);
    slab3.position.set(0, 12, 0);
    slab3.userData = { type: 'IfcSlab', guid: '3A$3v04K_SlabL3', name: 'Roof Slab' };
    modelGroup.add(slab3);

    // Columns (IfcColumn)
    const colMat = new THREE.MeshPhongMaterial({
        color: 0x3B82F6,
        wireframe: isWireframe
    });
    const colGeom = new THREE.BoxGeometry(0.8, 12, 0.8);
    const colPositions = [[-7, 6, -7], [7, 6, -7], [-7, 6, 7], [7, 6, 7]];

    colPositions.forEach((pos, idx) => {
        const col = new THREE.Mesh(colGeom, colMat);
        col.position.set(...pos);
        col.userData = { type: 'IfcColumn', guid: `1C$0${idx}v04K_Col`, name: `Structural Column C${idx+1}` };
        modelGroup.add(col);
    });

    // Mechanical Pump Equipment Proxy (IfcBuildingElementProxy / MEP)
    const pumpMat = new THREE.MeshPhongMaterial({
        color: 0x06B6D4,
        emissive: 0x06B6D4,
        emissiveIntensity: 0.4,
        wireframe: isWireframe
    });
    const pumpGeom = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
    const pump = new THREE.Mesh(pumpGeom, pumpMat);
    pump.position.set(0, 1.8, 0);
    pump.userData = {
        type: 'IfcBuildingElementProxy',
        guid: '2Xb$9v04K_aZ9L',
        name: 'Chilled Water Pump P-101',
        omniClass: '23-15 11 00 (Pumps)'
    };
    modelGroup.add(pump);

    scene.add(modelGroup);

    // Animation Loop (Slow Rotation)
    function animate() {
        requestAnimationFrame(animate);
        modelGroup.rotation.y += 0.003;
        renderer.render(scene, camera);
    }
    animate();

    // Window Resize
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    // Control Buttons
    const btnWire = document.getElementById('btn-wire');
    const btnShaded = document.getElementById('btn-shaded');
    const btnReset = document.getElementById('btn-reset');

    if (btnWire && btnShaded) {
        btnWire.addEventListener('click', () => {
            setWireframeMode(true);
            btnWire.classList.add('active');
            btnShaded.classList.remove('active');
        });
        btnShaded.addEventListener('click', () => {
            setWireframeMode(false);
            btnShaded.classList.add('active');
            btnWire.classList.remove('active');
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            modelGroup.rotation.y = 0;
            camera.position.set(20, 18, 28);
        });
    }
}

function setWireframeMode(wireframe) {
    if (!modelGroup) return;
    modelGroup.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.wireframe = wireframe;
        }
    });
}

// Simulated IDS Audit Function
function runSimulatedAudit() {
    const logContainer = document.getElementById('audit-results');
    const warnItem = document.getElementById('res-warn');
    
    if (!logContainer) return;

    logContainer.style.opacity = '0.5';
    setTimeout(() => {
        logContainer.style.opacity = '1';
        if (warnItem) {
            warnItem.innerHTML = '<span>CALGreen Title 24 Energy Data Check</span><span class="status-pass"><i class="fa-solid fa-circle-check"></i> AUTO-FIXED (100% Compliant)</span>';
        }
        alert('Simulated Audit Complete!\nAll 342 IFC elements verified against ISO 16739 & US COBie v2.4 standards.');
    }, 800);
}
