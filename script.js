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
    scene.background = new THREE.Color(0x040508);

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

    const dirLight1 = new THREE.DirectionalLight(0xFFEE00, 1.2);
    dirLight1.position.set(20, 40, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00F0FF, 0.9);
    dirLight2.position.set(-20, -10, -20);
    scene.add(dirLight2);

    // Grid Helper
    const grid = new THREE.GridHelper(40, 20, 0xFFEE00, 0x222633);
    grid.position.y = -0.1;
    scene.add(grid);

    // Build 3D Architectural Model Structure (Simulating 2604 Via Madronas ADU IFC Model)
    modelGroup = new THREE.Group();

    // Materials (Autodesk Color Palette)
    const slabMat = new THREE.MeshPhongMaterial({ color: 0x181B24, emissive: 0x00F0FF, emissiveIntensity: 0.15, wireframe: isWireframe });
    const wallMat = new THREE.MeshPhongMaterial({ color: 0x222633, emissive: 0x2563EB, emissiveIntensity: 0.1, wireframe: isWireframe });
    const roofMat = new THREE.MeshPhongMaterial({ color: 0xFFEE00, emissive: 0xFFEE00, emissiveIntensity: 0.3, wireframe: isWireframe });
    const doorMat = new THREE.MeshPhongMaterial({ color: 0x00F0FF, emissive: 0x00F0FF, emissiveIntensity: 0.4, wireframe: isWireframe });

    // Ground Slab (IfcSlab)
    const slabGeom = new THREE.BoxGeometry(14, 0.5, 10);
    const slab = new THREE.Mesh(slabGeom, slabMat);
    slab.position.set(0, 0, 0);
    slab.userData = { type: 'IfcSlab (Foundation Slab)', guid: '2604$VM_Slab_01', name: 'ADU Foundation Slab' };
    modelGroup.add(slab);

    // Exterior Walls (IfcWallStandardCase)
    const wall1Geom = new THREE.BoxGeometry(14, 6, 0.4);
    const wallBack = new THREE.Mesh(wall1Geom, wallMat);
    wallBack.position.set(0, 3.25, -4.8);
    modelGroup.add(wallBack);

    const wall2Geom = new THREE.BoxGeometry(0.4, 6, 10);
    const wallLeft = new THREE.Mesh(wall2Geom, wallMat);
    wallLeft.position.set(-6.8, 3.25, 0);
    modelGroup.add(wallLeft);

    const wallRight = new THREE.Mesh(wall2Geom, wallMat);
    wallRight.position.set(6.8, 3.25, 0);
    modelGroup.add(wallRight);

    // Parametric Pitched Roof (IfcRoof - generated via add_roof.py script)
    const roofGeom = new THREE.ConeGeometry(9.5, 4.5, 4);
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.position.set(0, 8.5, 0);
    roof.rotation.y = Math.PI / 4;
    roof.userData = {
        type: 'IfcRoof (Parametric Roof)',
        guid: '2604$VM_Roof_01',
        name: 'Via Madronas Gable Roof',
        script: 'add_roof.py'
    };
    modelGroup.add(roof);

    // Entry Door (IfcDoor - generated via add_door.py script)
    const doorGeom = new THREE.BoxGeometry(2.2, 4.2, 0.5);
    const door = new THREE.Mesh(doorGeom, doorMat);
    door.position.set(0, 2.3, 4.8);
    door.userData = {
        type: 'IfcDoor (Main Entrance)',
        guid: '2604$VM_Door_01',
        name: 'Parametric Exterior Door D-01',
        script: 'add_door.py'
    };
    modelGroup.add(door);

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
