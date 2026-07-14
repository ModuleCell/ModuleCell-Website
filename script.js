// ==========================================================================
// ModuleCell Interactive Scripts (Bilingual Light Mode Remade)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link, .nav-link-btn');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when links are clicked (useful for single page navigation)
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Hero Automatic Slideshow ---
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds per slide for a slow, premium fade

    if (slides.length > 0) {
        setInterval(() => {
            // Remove active from current slide
            slides[currentSlide].classList.remove('active');
            
            // Increment index
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Add active to new slide
            slides[currentSlide].classList.add('active');
        }, slideInterval);
    }

    // --- Scroll to Top Button Visibility & Header Shrink ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        // Toggle Scroll to Top Button
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }

        // Header shrinking/glow effect on scroll using CSS class toggle
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Reveal-on-Scroll Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Project Grid Filters ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // --- Project Details Database (Bilingual: English Primary, Chinese Secondary) ---
    const projectDetails = {
        'circle-tesoro': {
            title: "MoCe 100 ADU (Circle Tesoro)",
            cat: "Prefab Residential / 預製住宅",
            images: ['assets/circle_tesoro.png'],
            specs: {
                structure: "Circular Prefab Wood-Steel System / 圓形預製木鋼混合系統",
                area: "450 sq ft / 42 ㎡ (Built ADU)",
                materials: "Cedar Siding, Double-Pane Low-E Glass / 紅杉木外牆板、雙層 Low-E 隔熱玻璃",
                tech: "Revit Parametric Design, Twinmotion / 參數化 Revit 設計、Twinmotion 渲染",
                green: "LEED Platinum Target / 綠建築白金級標準"
            },
            desc: "A circular prefab ADU designed for seamless integration with nature. Features sustainable cedar wood cladding, high-performance panoramic windows, and a highly efficient circular floor plan that minimizes heat loss.<br><span class='translation-sub'>專為與自然融合而設計的圓形預製 ADU。採用永續紅杉木外牆、高效能全景窗，以及能將熱損失降至最低的高效圓形平面配置。</span>",
            phase1: "<strong>Concept / 概念探索:</strong> Exploring circular layout options and modular wall panel segments.<br><span class='translation-sub'>探索圓形平面配置方案與模組化牆板分段。</span>",
            phase2: "<strong>Schematic / 方案設計:</strong> Parameterizing circular framing in Revit and setting up forest biotope views.<br><span class='translation-sub'>在 Revit 中進行圓形結構框架參數化，並建立森林生態景觀視角。</span>",
            phase3: "<strong>Development / 設計發展:</strong> Detailing modular panel connection joints and waterproofing details.<br><span class='translation-sub'>深化模組化牆板連接節點與防水收邊構造。</span>",
            phase4: "<strong>Construction / 施工圖面:</strong> Generating assembly shop drawings and structural framing schedules.<br><span class='translation-sub'>產出工廠預製組裝圖面與結構構件明細表。</span>"
        },
        'angle-alma': {
            title: "MoCe Angle Alma (Angled Modular Unit)",
            cat: "Prefab Residential / 預製住宅",
            images: ['assets/angle_alma.png'],
            specs: {
                structure: "Angled Modular Steel Frame / 摺角預製鋼骨結構",
                area: "1,200 sq ft / 111 ㎡ (Multi-Module Residence)",
                materials: "Dark Metal Siding, Douglas Fir Panels / 深色金屬壁板、花旗松裝飾板",
                tech: "BIM Coordination, Twinmotion / BIM 衝突檢討、Twinmotion 渲染",
                green: "Solar Roof Integration / 整合式太陽能屋頂"
            },
            desc: "A multi-module prefab residence featuring dynamic angled geometry. It integrates dark metal siding with warm wood cladding, creating a striking contrast in a forested landscape.<br><span class='translation-sub'>具有動態摺角幾何的多模組預製住宅。整合了深色金屬外牆與溫慢的木質內襯，在森林景觀中創造出鮮明的對比。</span>",
            phase1: "<strong>Concept / 概念探索:</strong> Analyzing module stacking combinations and solar orientation.<br><span class='translation-sub'>分析模組堆疊組合與太陽日照軌跡。</span>",
            phase2: "<strong>Schematic / 方案設計:</strong> Creating 3D massing and volumetric studies in Revit.<br><span class='translation-sub'>在 Revit 中進行 3D 體量與空間關係研究。</span>",
            phase3: "<strong>Development / 設計發展:</strong> Designing custom joint connectors for angled steel frames.<br><span class='translation-sub'>設計摺角鋼架的專用連接鐵件。</span>",
            phase4: "<strong>Construction / 施工圖面:</strong> Preparing detailed construction drawings for permit submission.<br><span class='translation-sub'>準備送審所需的詳細施工圖面與節點圖。</span>"
        },
        'moce-rv': {
            title: "MoCe RV (Mobile Modular Living)",
            cat: "Mobile Prefab / 移動式預製單元",
            images: ['assets/moce_rv.png'],
            specs: {
                structure: "Mobile Light-Gauge Steel Frame / 移動式輕鋼架結構",
                area: "280 sq ft / 26 ㎡ (Mobile Unit)",
                materials: "Composite Metal Panels, Interior Birch Plywood / 複合金屬板、白樺木夾板內裝",
                tech: "Chassis Integration, Revit Modeling / 底盤整合、Revit 建模",
                green: "Off-Grid Solar & Battery System / 離網太陽能與儲能系統"
            },
            desc: "A luxury mobile prefab unit designed for off-grid modular living. Features photorealistic metal cladding and a cozy interior layout that fits on a trailer chassis.<br><span class='translation-sub'>專為離網生活設計的奢華移動預製單元。採用高質感金屬外牆與整合拖車底盤的舒適內部空間配置。</span>",
            phase1: "<strong>Concept / 概念探索:</strong> Studying trailer weight distribution and space efficiency.<br><span class='translation-sub'>研究拖車載重分佈與空間極致利用。</span>",
            phase2: "<strong>Schematic / 方案設計:</strong> Developing interior multi-functional furniture and chassis mounting.<br><span class='translation-sub'>設計內部多功能家具與底盤固定座。</span>",
            phase3: "<strong>Development / 設計發展:</strong> Coordinating off-grid solar, battery, and water tank systems.<br><span class='translation-sub'>整合離網太陽能、蓄電池與水箱儲水系統。</span>",
            phase4: "<strong>Construction / 施工圖面:</strong> Drafting trailer integration shop drawings for factory assembly.<br><span class='translation-sub'>繪製用於工廠組裝的拖車整合製造圖面。</span>"
        },
        'montecito': {
            title: "Montecito Canyon Residence (Net-Zero Estate)",
            cat: "Residential / 住宅設計",
            images: ['assets/montecito.jpg', 'assets/prototype.jpg', 'assets/montecito_2.jpg'],
            specs: {
                structure: "Prefab Steel Structural Frame / 鋼結構預製工法",
                area: "6,500 sq ft / 605 ㎡ (Built: 3,200 sq ft)",
                materials: "Weathering Steel Cladding, Low-E Glass / 耐候鋼板外牆、高能效複層玻璃",
                tech: "Revit BIM Modelling, Twinmotion Solar Study / 參數化建模、日照能耗模擬",
                green: "Net-Zero (LEED Platinum Certified) / 淨零能耗 (LEED 白金級認證)"
            },
            desc: "Conceived as an environmentally resilient estate achieving Net-Zero on a steep hillside. Conceived as a series of folded 'skins' that shield the building from natural elements, featuring integrated photo-voltaic panels and massive graywater and stormwater collection systems to survive extreme climate conditions.<br><span class='translation-sub'>此專案為挑戰陡峭山坡地的環境友善永續住宅。設計概念為一系列的折疊「外表皮（Skins）」，用以遮蔽並保護建築免受極端自然氣候影響，表面整合太陽能光電面板，並配備大型雨水與中水回收系統，在乾旱與氣候變遷下仍可永續運作。</span>",
            phase1: "<strong>Concept / 概念探索:</strong> Studying folded skin geometries, analyzing steep site topography, and researching passive solar shading angles.<br><span class='translation-sub'>研究三維幾何摺板「表皮」形態，分析陡峭山坡地地形起伏，並進行被動式遮陽與太陽輻射角模擬。</span>",
            phase2: "<strong>Schematic / 方案設計:</strong> Creating massing models in Revit, exporting to Twinmotion for environmental simulations, and building three physical skin option models.<br><span class='translation-sub'>在 Revit 中建置概念體量，導入 Twinmotion 進行環境模擬分析，並手工製作三套實體摺板皮層模型（Skin Option 1-3）進行視覺比較。</span>",
            phase3: "<strong>Development / 設計發展:</strong> Detailing structural cantilevers over the undisturbed landscape, selecting weather-resistant cladding, and designing water storage systems.<br><span class='translation-sub'>深化懸挑於自然景觀之上的鋼結構骨架節點，選定耐候外牆面材，並設計隱藏於地基中的大型儲水與過濾系統。</span>",
            phase4: "<strong>Construction / 施工圖面:</strong> Documenting full architectural drawing sets for city permits, structural coordination, and foundation details.<br><span class='translation-sub'>繪製全套用於取得市政府建築執照與結構技師審查的施工圖紙，包含精密的鋼結構鉸接詳圖與基礎錨定圖面。</span>"
        },
        'castaway': {
            title: "Castaway Newport Beach (Medical Facade Re-Skin)",
            cat: "Commercial / 商業與餐飲",
            images: ['assets/castaway.jpg', 'assets/castaway_2.jpg', 'assets/castaway_dwg.jpg'],
            specs: {
                structure: "Concrete Shell & Steel Retrofit / 鋼筋混凝土結構外牆補強",
                area: "32,860 sq ft / 3,052 ㎡ (2-Story Remodeling)",
                materials: "Perforated Aluminum Louvers, Terrazzo / 穿孔遮陽鋁板、大理石水磨石地磚",
                tech: "BIM Facade Re-skinning, CAD Detailing / 外牆參數化拉皮、CAD 大樣繪製",
                green: "Energy-Saving Facade Shading System / 節能外牆遮陽系統設計"
            },
            desc: "A complete facade renovation ('re-skin') of a 32,860 square foot 2-story medical office building originally built in 1964. The project upgrades accessibility and public plazas, integrating south-side shading louvers. The lobby features a terrazzo floor, stainless-steel handrails, and a modern glass guardrail.<br><span class='translation-sub'>本專案為一棟建於 1964 年、面積 32,860 平方英尺的兩層樓醫療辦公大樓進行全外牆拉皮（Re-Skin）。同時優化了無障礙動線與戶外廣場，增設南側金屬遮陽格柵。大廳內部採用水磨石地磚、不鏽鋼扶手與現代玻璃護欄重新裝修。</span>",
            phase1: "<strong>Concept / 概念探索:</strong> Surveying the 1964 concrete structure, sketching modern glass/metal facade concepts, and analyzing building circulation path.<br><span class='translation-sub'>測繪勘查 1964 年舊有混凝土結構，繪製現代鋼骨玻璃帷幕與木紋金屬飾板的概念立面圖，重構無障礙動線。</span>",
            phase2: "<strong>Schematic / 方案設計:</strong> Simulating louver layouts in Revit for heat gain control, rendering visual facades, and presenting lobby entry options.<br><span class='translation-sub'>在 Revit 中建立外立面參數化模型，模擬格柵間距對室內進熱量影響，產出渲染圖並提供多款大廳挑空入口方案。</span>",
            phase3: "<strong>Development / 設計發展:</strong> Detailing custom steel frames for the screen, designing glass railing connections, and coordinating with mechanical engineers.<br><span class='translation-sub'>深化懸掛式金屬帷幕的支撐鐵件，設計樓梯玻璃護欄的隱藏式錨固件，並與暖通空調技師協調風管變更。</span>",
            phase4: "<strong>Construction / 施工圖面:</strong> Compiling full construction documentation packages (plans, elevations, and section details) for city planning approval and permit clearance.<br><span class='translation-sub'>編製全套拉皮工程的施工圖面（平、立、剖面詳圖與節點構造），順利送審並通過市政府的無障礙與外牆變更許可。</span>"
        },
        'shenzhou': {
            title: "Shenzhou Peninsula Master Plan (Resort Center)",
            cat: "Urban Planning / 都市與社區規劃",
            images: ['assets/shenzhou.jpg', 'assets/shenzhou_2.jpg', 'assets/shenzhou_3.jpg'],
            specs: {
                structure: "Concrete Frame & Wood-steel Trusses / 混凝土框架及鋼木混合桁架",
                area: "4.5 Hectares / 45,000 ㎡ (Master Planned Resort)",
                materials: "Timber Decking, Local Stone, Clay Tiles / 防腐木甲板、在地石材、中式黏土瓦",
                tech: "Master Plan CAD Zoning, 3D Rendering / 規劃分區 CAD、3D 高階渲染示範",
                green: "Ecology Preservation Waterfront Spine / 生態水系保留、親水商業步道"
            },
            desc: "A complete master-planned resort community combining retail, residential, hospitality, office, and community functions. A central pedestrian spine lined with retail, water features, and landscape shading structures links the lagoon to the beachfront, creating a lively leisure promenade.<br><span class='translation-sub'>此為結合零售、住宅、度假酒店、辦公與休閒機能的度假中心綜合開發案。中央規劃了一條景觀商業步道（Pedestrian Spine），穿插水景、遮陽棚與豐富植栽，流暢連接潟湖與海灘，營造充滿朝氣的休閒散步體驗。</span>",
            phase1: "<strong>Concept / 概念探索:</strong> Mapping site zoning, defining pedestrian connections between the beach and lagoon, and sketching programmatic anchor points.<br><span class='translation-sub'>繪製基地機能分區圖，規劃潟湖與海灘間的行人步行軸線，並草擬包含駁船碼頭、海灘俱樂部在內的亮點配置。</span>",
            phase2: "<strong>Schematic / 方案設計:</strong> Modeling 3D site layout, designing individual components (Barge City, Visitor Center, Fish Restaurant, and Temple of Noodle) in 3D Revit models.<br><span class='translation-sub'>進行大範圍 3D 地形與量體配置。針對駁船城、遊客中心、海鮮餐廳與麵食館等單體建築進行 Revit 方案建模與初步造型。</span>",
            phase3: "<strong>Development / 設計發展:</strong> Detailing pedestrian spine landscape elements, coordinating water features, and designing shade structure structures.<br><span class='translation-sub'>深化商業步道兩側的景觀鋪面、戶外噴泉水路、活動遮陽棚構造，並整合公共街道無高差平整化動線。</span>",
            phase4: "<strong>Construction / 施工圖面:</strong> Packaging architectural guidelines, coordinates drawings, and rendering presentations for client and city council alignment.<br><span class='translation-sub'>彙整開發總體規劃導則、放樣坐標圖面、主要立面造型規範，並編製全套簡報圖冊供開發商與規劃部門審查。</span>"
        },
        'antojitos': {
            title: "Antojitos Cocina Mexicana (Universal City Walk)",
            cat: "Commercial / 商業與餐飲",
            images: ['assets/antojitos.jpg', 'assets/antojitos_2.jpg', 'assets/antojitos_3.jpg'],
            specs: {
                structure: "Steel Frame Remodeling / 既有鋼結構裝修與外牆改造",
                area: "8,200 sq ft / 762 ㎡ (Indoor/Outdoor Seating)",
                materials: "NanaWall Glass System, Textured Plaster / NanaWall 摺疊門、手工質感水泥漆",
                tech: "3D Headroom Coordination, Shop Dwg Reviews / 淨高衝突檢討、廠商製造圖審查",
                green: "Seamless Natural Vent Seating Layout / 無障礙自然通風半戶外餐飲空間"
            },
            desc: "A remodeling project for a Mexican restaurant chain at Universal Citywalk Hollywood. The main design concept is to create a seamless indoor-outdoor dining space using a custom curved Nana Wall sliding glass partition, with all overhead tracks hidden within the ceiling.<br><span class='translation-sub'>位於好萊塢環球影城步行街（City Walk）的墨西哥連鎖餐廳室內外裝修設計。核心概念是使用特製的弧形 Nana Wall 玻璃折疊門系統，創造無邊界的室內外用餐體驗，並將所有的懸掛軌道隱藏於天花板內。</span>",
            phase1: "<strong>Concept / 概念探索:</strong> Zoning dining layouts, defining indoor-outdoor boundaries, and sketching curved Nana Wall storefront options.<br><span class='translation-sub'>劃分座位區與服務動線，界定室內與半戶外中庭的過渡區域，並草擬弧形玻璃拉門的軌道走向方案。</span>",
            phase2: "<strong>Schematic / 方案設計:</strong> Modeling ceiling structure in Revit, calculating head clearance, and selecting materials for the dining courtyard.<br><span class='translation-sub'>利用 Revit 建立天花板與結構梁架模型，精確計算管線吊頂高度，並選定與墨西哥色彩對比的水泥、鋼木材質。</span>",
            phase3: "<strong>Development / 設計發展:</strong> Developing detail details for the Nana Wall system, including head track pockets and zero-threshold floor drainage rails.<br><span class='translation-sub'>與 Nana Wall 廠商共同開發特製收納槽，深化隱藏式吊頂軌道大樣與地面平齊無障礙排水軌道構造。</span>",
            phase4: "<strong>Construction / 施工圖面:</strong> Drafting construction documents for Universal Studios tenant approval, building permit clearance, and MEP coordination.<br><span class='translation-sub'>編製全套符合環球影城商鋪規範的施工圖紙（包含消防、水電、結構補強大樣），順利順暢取得開工許可。</span>"
        },
        'substation': {
            title: "SCE Substation Addition (A Yellow Protection)",
            cat: "Infrastructure / 辦公與基礎設施",
            images: ['assets/substation.jpg', 'assets/substation_2.jpg', 'assets/substation_dwg.jpg'],
            specs: {
                structure: "Heavy Steel Structure / 重型工業鋼結構",
                area: "12,500 sq ft / 1,160 ㎡ (Office & Substation)",
                materials: "Fluorocarbon Perforated Screen / 氟碳烤漆穿孔金屬板屏風",
                tech: "Revit Frame Detailing, Wind Load analysis / 鋼結構大樣建模、沙塵風荷載計算",
                green: "High Thermal Mass Desert Climate Shield / 沙漠乾旱高隔熱外牆屏障"
            },
            desc: "Office building expansion for a Southern California Edison hot spring substation. To address the harsh hot-dry desert weather, a bold yellow perforated metal screen facade is designed to shield the building from solar heat gain while creating a signature entrance.<br><span class='translation-sub'>南加州愛迪生電力公司（SCE）溫泉變電所的辦公大樓擴建工程。因應高溫乾燥的沙漠氣候，增設一層鮮黃色穿孔金屬板外遮陽格柵，不仅有效降低西曬熱幅射，更勾勒出鮮明的入口立面意象。</span>",
            phase1: "<strong>Concept / 概念探索:</strong> Studying thermal loads under desert sun, sketching metal screen patterns, and designing entry wind-break options.<br><span class='translation-sub'>進行沙漠強烈日照下的熱負荷計算，繪製穿孔金屬板的不同孔徑與幾何圖樣概念，並規劃防沙塵入口屏障。</span>",
            phase2: "<strong>Schematic / 方案設計:</strong> Modeling screen steel framing in Revit, rendering visual facades, and coordinating building expansion layout.<br><span class='translation-sub'>在 Revit 中建立遮陽鋼骨支架與主建築的咬合模型，導入 Twinmotion 渲染出鮮黃色格柵在陽光下的投影，確定擴建平面。</span>",
            phase3: "<strong>Development / 設計發展:</strong> Detailing metal panel anchorage, calculating wind load framing requirements, and selecting weather-resistant coatings.<br><span class='translation-sub'>深化金屬板與主體鋼骨的防震連接件，精算強風與沙塵暴下的風荷載，並選用抗紫外線、耐高溫的氟碳烤漆塗料。</span>",
            phase4: "<strong>Construction / 施工圖面:</strong> Drafting structural and architectural drawing packages for utility permit clearances and order lists.<br><span class='translation-sub'>產出結構技師簽證圖紙、鋼結構組裝圖、機電管線整合平立面，並順利送交公共事業審查委員會（CPU）核准開工。</span>"
        }
    };

    // --- Modal Popup & Interactive Gallery Logic ---
    const projectModal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');

    // DOM Elements inside modal
    const modalMainImg = document.getElementById('modalMainImg');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const modalThumbnails = document.getElementById('modalThumbnails');

    const modalCat = document.getElementById('modalCat');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalPhase1 = document.getElementById('modalPhase1');
    const modalPhase2 = document.getElementById('modalPhase2');
    const modalPhase3 = document.getElementById('modalPhase3');
    const modalPhase4 = document.getElementById('modalPhase4');

    // Specifications DOM Elements
    const specStructure = document.getElementById('specStructure');
    const specArea = document.getElementById('specArea');
    const specMaterials = document.getElementById('specMaterials');
    const specTech = document.getElementById('specTech');
    const specGreen = document.getElementById('specGreen');

    // Gallery state variables
    let activeProjectImages = [];
    let activeImageIndex = 0;

    function updateModalGallery() {
        if (activeProjectImages.length === 0 || !modalMainImg) return;
        
        // Update main image source with quick transition effect
        modalMainImg.style.opacity = 0;
        setTimeout(() => {
            modalMainImg.src = activeProjectImages[activeImageIndex];
            modalMainImg.style.opacity = 1;
        }, 150);

        // Update thumbnails indicator
        if (modalThumbnails) {
            modalThumbnails.innerHTML = '';
            activeProjectImages.forEach((img, idx) => {
                const dot = document.createElement('span');
                dot.className = 'thumbnail-dot' + (idx === activeImageIndex ? ' active' : '');
                dot.addEventListener('click', () => {
                    activeImageIndex = idx;
                    updateModalGallery();
                });
                modalThumbnails.appendChild(dot);
            });
        }
    }

    if (projectModal && modalClose) {
        
        // Open Modal (Bound to project cards)
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project-id');
                if (projectId === 'thesis') {
                    window.location.href = 'thesis.html';
                    return;
                }
                const data = projectDetails[projectId];
                
                if (data) {
                    // Populate basic text fields
                    modalCat.textContent = data.cat;
                    modalTitle.textContent = data.title;
                    modalDesc.innerHTML = data.desc;
                    modalPhase1.innerHTML = data.phase1;
                    modalPhase2.innerHTML = data.phase2;
                    modalPhase3.innerHTML = data.phase3;
                    modalPhase4.innerHTML = data.phase4;
                    
                    // Populate technical specifications sidebar
                    specStructure.textContent = data.specs.structure;
                    specArea.textContent = data.specs.area;
                    specMaterials.textContent = data.specs.materials;
                    specTech.textContent = data.specs.tech;
                    specGreen.textContent = data.specs.green;

                    // Initialize gallery state
                    activeProjectImages = data.images || [];
                    activeImageIndex = 0;
                    updateModalGallery();
                    
                    // Activate modal overlay
                    projectModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // prevent background body scroll
                }
            });
        });

        // Navigation Prev Click
        if (galleryPrev) {
            galleryPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                if (activeProjectImages.length > 0) {
                    activeImageIndex = (activeImageIndex - 1 + activeProjectImages.length) % activeProjectImages.length;
                    updateModalGallery();
                }
            });
        }

        // Navigation Next Click
        if (galleryNext) {
            galleryNext.addEventListener('click', (e) => {
                e.stopPropagation();
                if (activeProjectImages.length > 0) {
                    activeImageIndex = (activeImageIndex + 1) % activeProjectImages.length;
                    updateModalGallery();
                }
            });
        }

        // Close Modal via button
        modalClose.addEventListener('click', () => {
            projectModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // restore background scroll
        });

        // Close Modal via clicking overlay background
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Close Modal via Escape Key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('active')) {
                projectModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset header height dynamically
                const headerHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Lab Automatic Slideshow ---
    const labSlides = document.querySelectorAll('.lab-slide');
    let currentLabSlide = 0;
    const labSlideInterval = 5000; // 5 seconds per slide

    if (labSlides.length > 0) {
        setInterval(() => {
            // Remove active from current lab slide
            labSlides[currentLabSlide].classList.remove('active');
            
            // Increment index
            currentLabSlide = (currentLabSlide + 1) % labSlides.length;
            
            // Add active to new lab slide
            labSlides[currentLabSlide].classList.add('active');
        }, labSlideInterval);
    }


});
