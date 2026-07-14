// ==========================================================================
// ModuleCell Interactive Scripts (Terrazzo Redesign)
// Office: ModuleCell | 磨石建築設計事務所
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
    const slideInterval = 6000; // Slow, premium fade

    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, slideInterval);
    }

    // --- Scroll to Top & Header Shrink ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }

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

    // --- ADU Hub Tab Switching ---
    const aduTabBtns = document.querySelectorAll('.adu-tab-btn');
    const aduTabPanels = document.querySelectorAll('.adu-tab-panel');

    aduTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            aduTabBtns.forEach(b => b.classList.remove('active'));
            aduTabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            const targetPanel = document.getElementById(`tab-${targetTab}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // --- Product Detail Database (Terrazzo Redesign) ---
    const projectDetails = {
        'moshi-cabin': {
            title: "Moshi Cabin (磨石居 — 獨立工作室)",
            cat: "Single-Module Cabin / 微型石質單元",
            images: ['assets/terrazzo_hero_cabin.png', 'assets/terrazzo_interior.png'],
            specs: {
                structure: "Zinc-coated steel & Mineral envelope / 鍍鋅輕鋼構與礦物護甲",
                area: "280 sq ft / 26 ㎡ (7.6m x 3.4m)",
                materials: "Seamless Polished Terrazzo / 無縫打磨拋光水磨石",
                tech: "Volcanic Cement Board (R-24) / 火山灰水泥防火絕熱牆面",
                green: "Leed Platinum Certified / 綠建築白金級標準"
            },
            desc: "Designed as a peaceful home office or creative studio. Moshi Cabin features high-end seamless white terrazzo floors, minimalist mineral plaster walls, custom floor-to-ceiling glass sliding systems, and built-in stone cabinetry.<br><span class='translation-sub'>專為家庭工作室、沉修茶室設計的微型石質單元。室內鋪設無縫珍珠白水磨石，牆體塗裝呼吸硅藻土礦物塗料，搭配大開口全景落地玻璃拉門，在綠意中營造石材質樸寧靜的氛圍。</span>",
            phase1: "<strong>Zoning & BIM / 設計發展:</strong> Checking municipal height limits for backyard cottages and optimizing structural loads in Revit BIM.<br><span class='translation-sub'>核對地方容積率與高度限制，並於 Revit BIM 軟體中精算結構荷載。</span>",
            phase2: "<strong>Precision Casting / 精準澆灌:</strong> Casting concrete panels in carbon-cured steel molds to ensure millimeter accuracy.<br><span class='translation-sub'>在工廠以鋼模進行水泥纖維挂板與底座的精準注模，並以二氧化碳養護提升固碳強度。</span>",
            phase3: "<strong>Pre-assembly & Polishing / 廠內精裝與打磨:</strong> Wet-sanding the terrazzo flooring with 8 progress grids and installing all electrical fittings.<br><span class='translation-sub'>於恆溫工廠內對水磨石地坪進行八道水磨拋光，並完成水電管線與衛浴隔間裝配。</span>",
            phase4: "<strong>Craning & Key / 吊裝與交付:</strong> Transporting the completed module to site and hoisting onto steel foundation screws.<br><span class='translation-sub'>將整裝完成的單元運抵基地，由吊車吊起落位至地錨上，當日完成管線快接並交付鑰匙。</span>"
        },
        'moshi-adu': {
            title: "Moshi ADU (無垢石閣 — 旗艦款後院小屋)",
            cat: "Accessory Dwelling Unit / 附屬住宅",
            images: ['assets/terrazzo_interior.png', 'assets/terrazzo_hero_cabin.png', 'assets/terrazzo_detail.png'],
            specs: {
                structure: "Basalt Steel Frame & Concrete / basalt 防鏽鋼架與輕質混凝土",
                area: "480 sq ft / 45 ㎡ (9.8m x 4.6m)",
                materials: "Travertine Cladding, Terrazzo Counters / 洞石外牆、手工磨石中島廚房",
                tech: "ERV Heat Recovery Vent (R-30) / 全新風熱回收空氣循環",
                green: "Passive House Standard / 歐盟被動式超低能耗住宅"
            },
            desc: "A premium backyard cottage featuring a spacious bedroom, full-scale custom kitchen with aggregate terrazzo countertops, walk-in slate shower, and a light-filled travertine dining deck. Connected seamlessly with gardens.<br><span class='translation-sub'>旗艦款後院小屋。配置寬敞臥室、整套手工水磨石中島廚房、天然板岩淋浴間與大面積洞石平台。室內地坪的高熱容（Thermal Mass）能主動平衡室溫，四季皆宜。</span>",
            phase1: "<strong>Zoning & BIM / 設計發展:</strong> Completing zoning review and designing custom electrical routes.<br><span class='translation-sub'>進行後院副樓法規送審，並完成水電配線與結構節點大樣設計。</span>",
            phase2: "<strong>Precision Casting / 精準澆灌:</strong> Manufacturing structured steel frames and curing solid stone siding.<br><span class='translation-sub'>在廠內製作重防腐鋼結構框架，並預製灌注無機磨石牆體面板。</span>",
            phase3: "<strong>Pre-assembly & Polishing / 廠內精裝與打磨:</strong> Mounting the custom travertine tiles and polishing the complete living area.<br><span class='translation-sub'>在廠內鋪設地暖管道，安裝天然洞石牆板，並對室內中島與地坪進行精細研磨。</span>",
            phase4: "<strong>Craning & Key / 吊裝與交付:</strong> Bolting two factory-completed modules on site. Move-in within 48 hours.<br><span class='translation-sub'>拖車將兩組預製單元載至現場拼裝，接合防震防水墊，並於兩日內完成細部清潔點交。</span>"
        },
        'moshi-villa': {
            title: "Moshi Villa (沐光石舍 — 多模組生活空間)",
            cat: "Multi-Module Residence / 拼接式住宅",
            images: ['assets/terrazzo_detail.png', 'assets/terrazzo_interior.png'],
            specs: {
                structure: "Steel-Concrete Hybrid Frame / 鋼骨與清水混凝土複合結構",
                area: "960 sq ft / 89 ㎡ (Three Stitched Modules)",
                materials: "Basalt Fiber Cladding, Terrazzo / 玄武岩纖維掛板、結晶磨石",
                tech: "Triple-Pane Low-E Window (R-38) / 三層 Low-E 氬氣充填玻璃",
                green: "Net-Zero Carbon Footprint / 全生命週期零碳排"
            },
            desc: "Designed for full-time luxury living. Features a double-height vaulted ceiling, central mineral atrium, ERV mechanical fresh air ventilation, solar roof shingles, and high-performance carbon-cured stone thermal envelopes.<br><span class='translation-sub'>適合現代家庭長居的多模組別墅。挑高斜屋頂斜屋頂、中央磨石庭院、光伏發電瓦、以及新風空氣交換系統。結構大梁以抗震耐重鋼構複合無毒礦物板製成，提供極致的隔音與斷熱屏障。</span>",
            phase1: "<strong>Zoning & BIM / 設計發展:</strong> Master layout zoning calculations, solar path studies, and architectural permits.<br><span class='translation-sub'>設計整體配置圖，進行日照能耗與陰影遮擋模擬，並送交建管科取得建造執照。</span>",
            phase2: "<strong>Precision Casting / 精準澆灌:</strong> Casting heavy basalt concrete columns and structural floors.<br><span class='translation-sub'>灌注具備高抗折強度的玄武岩纖維水泥大梁與抗震樓板。</span>",
            phase3: "<strong>Pre-assembly & Polishing / 廠內精裝與打磨:</strong> Integrating active floor solar grids and custom interior quartz counters.<br><span class='translation-sub'>同步在工廠製作三組模組，安裝防夾障子隔間、廚衛管道及嵌合式太陽能瓦。</span>",
            phase4: "<strong>Craning & Key / 吊裝與交付:</strong> Hoisting the three modules with a 100-ton crane. Final alignment in 3 days.<br><span class='translation-sub'>使用百噸級大吊車於基地一日內完成三組單元的拼裝與水電對接，三日內交屋。</span>"
        }
    };

    // --- Modal Popup & Interactive Gallery Logic ---
    const projectModal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const projectCards = document.querySelectorAll('.product-card');

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

    const specStructure = document.getElementById('specStructure');
    const specArea = document.getElementById('specArea');
    const specMaterials = document.getElementById('specMaterials');
    const specTech = document.getElementById('specTech');
    const specGreen = document.getElementById('specGreen');

    let activeProjectImages = [];
    let activeImageIndex = 0;

    function updateModalGallery() {
        if (activeProjectImages.length === 0 || !modalMainImg) return;
        
        modalMainImg.style.opacity = 0;
        setTimeout(() => {
            modalMainImg.src = activeProjectImages[activeImageIndex];
            modalMainImg.style.opacity = 1;
        }, 150);

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
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project-id');
                const data = projectDetails[projectId];
                
                if (data) {
                    modalCat.textContent = data.cat;
                    modalTitle.textContent = data.title;
                    modalDesc.innerHTML = data.desc;
                    modalPhase1.innerHTML = data.phase1;
                    modalPhase2.innerHTML = data.phase2;
                    modalPhase3.innerHTML = data.phase3;
                    modalPhase4.innerHTML = data.phase4;
                    
                    specStructure.textContent = data.specs.structure;
                    specArea.textContent = data.specs.area;
                    specMaterials.textContent = data.specs.materials;
                    specTech.textContent = data.specs.tech;
                    specGreen.textContent = data.specs.green;

                    activeProjectImages = data.images || [];
                    activeImageIndex = 0;
                    updateModalGallery();
                    
                    projectModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        if (galleryPrev) {
            galleryPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                if (activeProjectImages.length > 0) {
                    activeImageIndex = (activeImageIndex - 1 + activeProjectImages.length) % activeProjectImages.length;
                    updateModalGallery();
                }
            });
        }

        if (galleryNext) {
            galleryNext.addEventListener('click', (e) => {
                e.stopPropagation();
                if (activeProjectImages.length > 0) {
                    activeImageIndex = (activeImageIndex + 1) % activeProjectImages.length;
                    updateModalGallery();
                }
            });
        }

        modalClose.addEventListener('click', () => {
            projectModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

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

    // --- Cost Estimator Calculator (Terrazzo Redesign) ---
    const modelRadios = document.querySelectorAll('input[name="adu-model"]');
    const finishRadios = document.querySelectorAll('input[name="adu-finish"]');
    const addonCheckboxes = document.querySelectorAll('input[name="adu-addon"]');

    const valFactory = document.getElementById('val-factory');
    const valAddons = document.getElementById('val-addons');
    const valSite = document.getElementById('val-site');
    const valTotal = document.getElementById('val-total');

    const modelPrices = {
        'moshi-cabin': 65000,
        'moshi-adu': 98000,
        'moshi-villa': 195000
    };

    const finishModifiers = {
        'larch': 1.0,      // Travertine Sand (Base)
        'shousugi': 1.15,  // Basalt Aggregate (+15%)
        'cedar': 1.22      // Travertine Quartz (+22%)
    };

    const addonPrices = {
        'solar': 9000,
        'offgrid': 13000,
        'tatami': 4500,     // Travertine Courtyard
        'hvac': 6500
    };

    const siteEstimates = {
        'moshi-cabin': { min: 12000, max: 18000 },
        'moshi-adu': { min: 18000, max: 26000 },
        'moshi-villa': { min: 35000, max: 55000 }
    };

    function calculateEstimates() {
        if (!valFactory || !valAddons || !valSite || !valTotal) return;

        let selectedModel = 'moshi-cabin';
        modelRadios.forEach(radio => {
            if (radio.checked) selectedModel = radio.value;
        });
        const modelBasePrice = modelPrices[selectedModel];

        let selectedFinish = 'larch';
        finishRadios.forEach(radio => {
            if (radio.checked) selectedFinish = radio.value;
        });
        const modifier = finishModifiers[selectedFinish];

        const factoryCost = Math.round(modelBasePrice * modifier);

        let addonsCost = 0;
        addonCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                addonsCost += addonPrices[checkbox.value] || 0;
            }
        });

        const siteRange = siteEstimates[selectedModel];
        const minTotal = factoryCost + addonsCost + siteRange.min;
        const maxTotal = factoryCost + addonsCost + siteRange.max;

        valFactory.textContent = `$${factoryCost.toLocaleString()}`;
        valAddons.textContent = `$${addonsCost.toLocaleString()}`;
        valSite.textContent = `$${siteRange.min.toLocaleString()} - $${siteRange.max.toLocaleString()}`;
        valTotal.textContent = `$${minTotal.toLocaleString()} - $${maxTotal.toLocaleString()}`;
    }

    modelRadios.forEach(radio => radio.addEventListener('change', calculateEstimates));
    finishRadios.forEach(radio => radio.addEventListener('change', calculateEstimates));
    addonCheckboxes.forEach(checkbox => checkbox.addEventListener('change', calculateEstimates));

    // Run initial calculation
    calculateEstimates();

    // --- Feasibility Checker Wizard ---
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const wizardProgressFill = document.getElementById('wizard-progress');
    const wizardPrevBtn = document.getElementById('wizard-prev');
    const wizardStepIndicator = document.getElementById('wizard-step-indicator');
    const wizardNavFooter = document.getElementById('wizard-nav-footer');
    const wizardResultBox = document.getElementById('wizard-result');

    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultText = document.getElementById('result-text');

    let currentStep = 1;
    let wizardAnswers = {};

    function updateWizardUI() {
        wizardSteps.forEach((step, idx) => {
            if (idx + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        const progressPercentage = (currentStep / wizardSteps.length) * 100;
        if (wizardProgressFill) {
            wizardProgressFill.style.width = `${progressPercentage}%`;
        }

        if (wizardStepIndicator) {
            wizardStepIndicator.textContent = `Step ${currentStep} of ${wizardSteps.length}`;
        }

        if (wizardPrevBtn) {
            wizardPrevBtn.disabled = currentStep === 1;
        }
    }

    const optionButtons = document.querySelectorAll('.wizard-opt-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const stepVal = btn.getAttribute('data-value');
            wizardAnswers[currentStep] = stepVal;

            if (currentStep < wizardSteps.length) {
                currentStep++;
                updateWizardUI();
            } else {
                showWizardResult();
            }
        });
    });

    if (wizardPrevBtn) {
        wizardPrevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateWizardUI();
                
                if (wizardResultBox) wizardResultBox.style.display = 'none';
                wizardSteps.forEach(s => s.classList.remove('active'));
                const activeStepEl = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
                if (activeStepEl) activeStepEl.classList.add('active');
                if (wizardNavFooter) wizardNavFooter.style.display = 'flex';
            }
        });
    }

    function showWizardResult() {
        wizardSteps.forEach(s => s.classList.remove('active'));
        if (wizardNavFooter) wizardNavFooter.style.display = 'none';
        if (wizardProgressFill) wizardProgressFill.style.width = '100%';

        const answersList = Object.values(wizardAnswers);
        const hasFail = answersList.includes('fail');
        const hasConsult = answersList.includes('consult');

        if (wizardResultBox && resultIcon && resultTitle && resultText) {
            wizardResultBox.style.display = 'flex';

            if (hasFail) {
                resultIcon.className = 'wizard-result-icon fail';
                resultIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
                resultTitle.innerHTML = 'Site Requires Custom Consultation <span class="subtitle-zh" style="display:block; font-size:0.6em; margin-top:0.4rem; color:var(--text-secondary);">基地需要專案評估</span>';
                resultText.innerHTML = 'Your backyard or access way presents some site constraints (such as narrow lanes or overhead wires) that might prevent standard crane installation. We can still help you using smaller pre-fab parts or custom construction. Let\'s discuss your options.<br><span class="translation-sub">您的基地條件（如巷道較窄或上方有電線）可能無法進行標準模組吊裝。我們仍能透過拆分單元或工廠微調等方式為您客製規劃，歡迎與我們取得聯繫。</span>';
            } else if (hasConsult) {
                resultIcon.className = 'wizard-result-icon pass';
                resultIcon.style.color = 'var(--accent)';
                resultIcon.style.borderColor = 'var(--accent)';
                resultIcon.style.backgroundColor = 'var(--accent-glow)';
                resultIcon.innerHTML = '<i class="fa-solid fa-circle-question"></i>';
                resultTitle.innerHTML = 'Zoning Audit Recommended <span class="subtitle-zh" style="display:block; font-size:0.6em; margin-top:0.4rem; color:var(--text-secondary);">建議進行法規核對</span>';
                resultText.innerHTML = 'Your yard has perfect physical dimensions, but your zoning laws need verification. Book a call and our design team will check your local city regulations for free.<br><span class="translation-sub">您的後院空間與吊裝環境非常理想！唯有當地建管法規需要進一步釐清，歡迎預約免費法規審核服務，我們將為您查詢。</span>';
            } else {
                resultIcon.className = 'wizard-result-icon pass';
                resultIcon.style.color = 'var(--highlight)';
                resultIcon.style.borderColor = 'var(--highlight)';
                resultIcon.style.backgroundColor = 'var(--highlight-glow)';
                resultIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
                resultTitle.innerHTML = 'Excellent Backyard Feasibility! <span class="subtitle-zh" style="display:block; font-size:0.6em; margin-top:0.4rem; color:var(--text-secondary);">基地可行性極佳！</span>';
                resultText.innerHTML = 'Your site appears to be 100% ready for our prefabricated modular unit installation. Transport, craning, and space limits look ideal. Let\'s start drafting your concept design.<br><span class="translation-sub">太棒了！您的後院與通道條件非常完美，完全符合預製屋吊裝的所有要件。讓我們開始著手您的空間提案吧！</span>';
            }
        }
    }

});
