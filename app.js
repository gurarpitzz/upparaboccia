/* =========================================================================
   app.js - Uttar Pradesh Para Boccia Association (UPPBA)
   Main Interactive Controller (Mobile-Friendly Showcase Edition)
   ========================================================================= */

(function () {
    "use strict";

    // ---------------------------------------------------------------------
    // 1. PRELOADER + DIAGONAL TRICOLOUR SWEEP + HERO ANIMATION HANDOFF
    // ---------------------------------------------------------------------
    const preloader = document.getElementById("bsfi-preloader");
    const sweep = document.getElementById("tricolour-sweep");
    const navyHold = document.getElementById("navy-hold");
    const pageWrapper = document.getElementById("page-wrapper");
    const skipBtn = document.getElementById("plSkipBtn");

    let loaderTimeline = null;
    let dismissed = false;

    const prefersReducedMotionQuery = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)");
    function isMotionReduced() {
        return Boolean(
            (prefersReducedMotionQuery && prefersReducedMotionQuery.matches) ||
            document.documentElement.classList.contains("reduce-motion") ||
            document.documentElement.classList.contains("a11y-reduce-motion")
        );
    }

    if (document.body) {
        document.body.classList.add("preloader-active");
    }

    if (typeof gsap !== "undefined" && !isMotionReduced() && preloader) {
        loaderTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.45 });

        loaderTimeline
            .set(["#red-ball", "#blue-ball", "#white-ball"], { x: 0, y: 0 })
            .set("#player-arm", { rotation: 0, svgOrigin: "41.75 94.5" })
            .set(["#player-group", "#red-ball", "#ground-line"], { opacity: 1, scale: 1 })
            .set(["#blue-ball", "#white-ball"], { scale: 1 })
            .set("#text-lockup", { opacity: 0 });

        loaderTimeline
            .to("#player-arm", { rotation: -40, duration: 0.28, ease: "power1.inOut" })
            .add("throw")
            .to("#red-ball", { x: 65, duration: 0.48, ease: "power1.inOut" }, "throw")
            .to("#red-ball", { y: -15, duration: 0.24, ease: "power1.out" }, "throw")
            .to("#red-ball", { y: 28, duration: 0.24, ease: "power1.in" }, "throw+=0.24")
            .to("#player-arm", { rotation: 20, duration: 0.36, ease: "power2.out" }, "throw")
            .add("impact")
            .to("#red-ball", {
                scaleY: 0.7,
                scaleX: 1.2,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                transformOrigin: "bottom"
            }, "impact")
            .to("#red-ball", { x: 75, duration: 0.28, ease: "power1.out" }, "impact")
            // Arc blue ball & white ball to flank "BOCCIA / UTTAR PRADESH" cleanly
            .to("#blue-ball", { x: -67, duration: 0.55, ease: "power1.inOut" }, "impact")
            .to("#blue-ball", { y: -108, duration: 0.28, ease: "power1.out" }, "impact")
            .to("#blue-ball", { y: -84, duration: 0.27, ease: "power1.in" }, "impact+=0.28")
            .to("#white-ball", { x: 97, duration: 0.55, ease: "power1.inOut" }, "impact")
            .to("#white-ball", { y: -108, duration: 0.28, ease: "power1.out" }, "impact")
            .to("#white-ball", { y: -84, duration: 0.27, ease: "power1.in" }, "impact+=0.28")
            .add("lockup", "-=0.08")
            .to(["#player-group", "#red-ball", "#ground-line"], { opacity: 0, duration: 0.35 }, "lockup")
            .to("#text-lockup", { opacity: 1, duration: 0.4 }, "lockup")
            .to({}, { duration: 1.25 });
    }

    function revealContentNow() {
        if (preloader) preloader.style.display = "none";
        if (sweep) sweep.style.display = "none";
        if (navyHold) {
            navyHold.style.display = "none";
            navyHold.style.pointerEvents = "none";
        }
        document.body.classList.remove("preloader-active");
        if (pageWrapper) pageWrapper.classList.add("content-ready");
        if (typeof window.triggerHeroAnimation === "function") {
            window.triggerHeroAnimation();
        }
    }

    window.dismissPreloader = function () {
        if (dismissed) return;
        dismissed = true;

        if (typeof gsap !== "undefined" && loaderTimeline) {
            loaderTimeline.kill();
        }

        if (isMotionReduced() || !sweep || !navyHold) {
            revealContentNow();
            return;
        }

        sweep.classList.add("sweeping");

        setTimeout(() => {
            navyHold.style.opacity = "1";
            navyHold.style.pointerEvents = "all";
            if (preloader) preloader.style.display = "none";
            document.body.classList.remove("preloader-active");
        }, 950);

        setTimeout(() => {
            if (pageWrapper) pageWrapper.classList.add("content-ready");
            navyHold.style.opacity = "0";
            if (typeof window.triggerHeroAnimation === "function") {
                window.triggerHeroAnimation();
            }
            setTimeout(() => {
                navyHold.style.display = "none";
                navyHold.style.pointerEvents = "none";
            }, 520);
        }, 1150);

        setTimeout(() => {
            sweep.style.display = "none";
        }, 1650);
    };

    if (skipBtn) {
        skipBtn.addEventListener("click", () => window.dismissPreloader());
    }

    const startTime = Date.now();
    window.addEventListener("load", () => {
        if (isMotionReduced()) {
            window.dismissPreloader();
            return;
        }
        const elapsed = Date.now() - startTime;
        const minTime = 2400;
        if (elapsed < minTime) {
            setTimeout(window.dismissPreloader, minTime - elapsed);
        } else {
            window.dismissPreloader();
        }
    });

    // Hard safety timeout so page never locks
    setTimeout(window.dismissPreloader, 6000);

    // ---------------------------------------------------------------------
    // 2. DOM READY CONTROLLERS
    // ---------------------------------------------------------------------
    document.addEventListener("DOMContentLoaded", () => {
        initNavigation();
        initHeroSlideshow();
        initOverviewTabs();
        initUttarPradeshMap();
        initStatsCounter();
        initStarPlayers();
        initGalleryAndLightbox();
    });

    // ---------------------------------------------------------------------
    // NAVIGATION & STICKY SCROLL HEADER
    // ---------------------------------------------------------------------
    function initNavigation() {
        const burger = document.getElementById("burgerBtn");
        const pillList = document.querySelector(".nav-pill-list");
        const header = document.querySelector(".site-header-fixed");

        if (burger && pillList) {
            burger.addEventListener("click", () => {
                const isOpen = pillList.classList.toggle("open");
                burger.setAttribute("aria-expanded", String(isOpen));
            });

            pillList.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", () => {
                    pillList.classList.remove("open");
                    burger.setAttribute("aria-expanded", "false");
                });
            });

            // Close mobile drawer when tapping outside
            document.addEventListener("click", (e) => {
                if (
                    pillList.classList.contains("open") &&
                    !pillList.contains(e.target) &&
                    !burger.contains(e.target)
                ) {
                    pillList.classList.remove("open");
                    burger.setAttribute("aria-expanded", "false");
                }
            });
        }

        if (header) {
            const onScroll = () => {
                if (window.scrollY > 24) {
                    header.classList.add("scrolled");
                } else {
                    header.classList.remove("scrolled");
                }
            };
            window.addEventListener("scroll", onScroll, { passive: true });
            onScroll();
        }
    }

    // ---------------------------------------------------------------------
    // HERO CAROUSEL + WORD-BY-WORD GSAP QUOTE CHOREOGRAPHY + TOUCH SWIPE
    // ---------------------------------------------------------------------
    function initHeroSlideshow() {
        const heroEl = document.getElementById("home");
        const slides = document.querySelectorAll(".hero-slideshow-wrapper .slide");
        const dots = document.querySelectorAll(".hero-slideshow-wrapper .slide-dot");
        const captionEl = document.getElementById("heroSlideCaption");
        const prevBtn = document.getElementById("heroPrevBtn");
        const nextBtn = document.getElementById("heroNextBtn");

        const captions = [
            "2nd Boccia India Federation Cup 2026 • Gold Medal: Mr. Jatin Kushwah (BC-4)",
            "2nd Boccia India Federation Cup 2026 • Silver Medal: Ms. Sarita Dwivedi (BC-3)",
            "UPPBA President Dr. Amit Ranjan & General Secretary Dr. Priyanka Yadav honoured in New Delhi",
            "Inaugural CME & Regional Stakeholders' Conclave on Para-Sports 'Boccia' at Dr. RMLIMS, Lucknow",
            "Representing Uttar Pradesh & India at Pilsen 2026 World Boccia Challenger"
        ];

        let current = 0;
        let timer = null;

        function goTo(n) {
            if (!slides.length) return;
            slides[current].classList.remove("active");
            if (dots[current]) dots[current].classList.remove("active");
            current = (n + slides.length) % slides.length;
            slides[current].classList.add("active");
            if (dots[current]) dots[current].classList.add("active");
            if (captionEl && captions[current]) {
                captionEl.textContent = captions[current];
            }
        }

        function startTimer() {
            clearInterval(timer);
            if (isMotionReduced() || slides.length < 2) return;
            timer = setInterval(() => goTo(current + 1), 5200);
        }

        window.addEventListener("uppba:reducemotion", (e) => {
            if (e.detail && e.detail.reduced) {
                clearInterval(timer);
            } else {
                startTimer();
            }
        });

        dots.forEach((dot, idx) => {
            dot.addEventListener("click", () => {
                goTo(idx);
                startTimer();
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                goTo(current - 1);
                startTimer();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                goTo(current + 1);
                startTimer();
            });
        }

        // Touch swipe support on phones
        if (heroEl) {
            let touchStartX = 0;
            heroEl.addEventListener("touchstart", (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            heroEl.addEventListener("touchend", (e) => {
                const dx = e.changedTouches[0].screenX - touchStartX;
                if (Math.abs(dx) > 45) {
                    goTo(dx < 0 ? current + 1 : current - 1);
                    startTimer();
                }
            }, { passive: true });
        }

        startTimer();

        // Word-by-word GSAP prep
        const textElements = document.querySelectorAll(".animated-words");
        textElements.forEach((el) => {
            const words = el.textContent.trim().split(/\s+/);
            el.innerHTML = words
                .map(
                    (word) =>
                        `<span class="hero-anim-word" style="display:inline-block;opacity:0;transform:translateY(10px);margin-right:0.24em;">${word}</span>`
                )
                .join("");
        });

        const fadeItems = document.querySelectorAll(".animated-fade-item");
        fadeItems.forEach((item) => {
            item.style.opacity = "0";
            item.style.transform = "translateY(14px)";
            item.style.transition = "none";
        });

        window.triggerHeroAnimation = function () {
            if (typeof gsap === "undefined" || isMotionReduced()) {
                document.querySelectorAll(".hero-anim-word").forEach((w) => {
                    w.style.opacity = "1";
                    w.style.transform = "none";
                });
                fadeItems.forEach((i) => {
                    i.style.opacity = "1";
                    i.style.transform = "none";
                });
                return;
            }
            const tl = gsap.timeline();
            tl.to(".hero-anim-word", {
                opacity: 1,
                y: 0,
                stagger: 0.14,
                duration: 0.45,
                ease: "power2.out"
            }).to(
                ".animated-fade-item",
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.12,
                    duration: 0.5,
                    ease: "power2.out"
                },
                "-=0.2"
            );
        };
    }

    // ---------------------------------------------------------------------
    // ABOUT UPPBA INTERACTIVE TABS
    // ---------------------------------------------------------------------
    function initOverviewTabs() {
        const tabBtns = document.querySelectorAll(".overview-tab-btn");
        const tabPanes = document.querySelectorAll(".overview-tab-pane");
        if (!tabBtns.length) return;

        tabBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const targetId = "tab-" + btn.getAttribute("data-tab");
                tabBtns.forEach((b) => b.classList.remove("active"));
                tabPanes.forEach((p) => p.classList.remove("active"));
                btn.classList.add("active");
                const targetPane = document.getElementById(targetId);
                if (targetPane) targetPane.classList.add("active");
            });
        });
    }

    // ---------------------------------------------------------------------
    // INTERACTIVE UTTAR PRADESH SVG MAP
    // ---------------------------------------------------------------------
    function initUttarPradeshMap() {
        const detailBox = document.getElementById("map-details-card");
        if (!detailBox) return;

        const UP_HUBS = {
            lucknow: {
                title: "Lucknow • Awadh State HQ & Clinical Rehab Hub",
                badge: "State HQ & Clinical Nerve Centre",
                badgeColor: "#24C27A",
                institutions: "Dr. RMLIMS (Dept. of PMR), SGPGI, KGMU, DSMNRU, CRC Lucknow, Indian Red Cross Society",
                leaders: "Dr. Amit Ranjan (President, UPPBA) & Prof. Dr. V. S. Gogia (Head PMR, Dr. RMLIMS)",
                milestone: "India's pioneering hospital-based Boccia Rehabilitation Unit for post-ICU disability recovery & host of Inaugural CME Conclave (4 Nov 2026).",
                classes: "BC1 • BC2 • BC3 • BC4 & Post-ICU Adaptive Rehab"
            },
            kanpur: {
                title: "Kanpur • Central Doab Assistive Tech & Star Hub",
                badge: "International Medallist & ALIMCO Partner",
                badgeColor: "#FF9933",
                institutions: "ALIMCO (Artificial Limbs Manufacturing Corp. of India) & Regional Para-Rehab Network",
                leaders: "Ms. Sarita Dwivedi (BC-3 Silver Medallist 2026, ALIMCO Brand Ambassador & Triple Amputee Innovator)",
                milestone: "Home hub of India's pioneering female BC-3 international medallist and grassroots ramp/assistive device innovation.",
                classes: "BC3 Assistive Ramp Excellence • ADIP / Assistive Tech"
            },
            agra: {
                title: "Agra & Braj Region • Western UP High-Performance Hub",
                badge: "4x National Champion & Fed Cup Gold Hub",
                badgeColor: "#F4B942",
                institutions: "Western UP Para-Sports Development Network & District Youth Outreach",
                leaders: "Mr. Jatin Kushwah (BC-4 Gold Medallist — 2nd Federation Cup 2026, Bahrain 2024 World Medallist)",
                milestone: "Produces consistent national gold medals across 7th, 8th, 9th & 10th National Championships and Federation Cup podiums.",
                classes: "BC4 Elite Precision & Pairs Competition"
            },
            gorakhpur: {
                title: "Gorakhpur • Purvanchal Sports Psychiatry & Medical Hub",
                badge: "Mental Conditioning & East UP Research Partner",
                badgeColor: "#38BDF8",
                institutions: "AIIMS Gorakhpur (Department of Psychiatry) & Purvanchal Medical Colleges",
                leaders: "Dr. Manoj Prithviraj (Head, Dept. of Psychiatry, AIIMS Gorakhpur — UPPBA Webinar Expert)",
                milestone: "Spearheading psychological focus, competitive resilience, and Purvanchal talent scouting across eastern Uttar Pradesh.",
                classes: "Sports Psychology • Cognitive Precision • Youth Outreach"
            },
            varanasi: {
                title: "Varanasi & Kashi Zone • South-East UP Expansion Hub",
                badge: "Regional Inclusive Sports Corridor",
                badgeColor: "#24C27A",
                institutions: "Regional Rehabilitation Centres & Collegiate Para-Sports Volunteers",
                leaders: "Coordinated by UPPBA General Secretary Dr. Priyanka Yadav",
                milestone: "Connecting Kashi and Vindhya divisions into UPPBA's state championship qualification pathway.",
                classes: "Athlete Screening • Coach Awareness • District Drives"
            },
            prayagraj: {
                title: "Prayagraj • Sangam Collegiate & Awareness Hub",
                badge: "Academic & Athlete Roots",
                badgeColor: "#FF9933",
                institutions: "University of Allahabad Fine Arts & Inclusive Campus Community",
                leaders: "Academic & Fine Arts Alumni Network Supporting Para Athletes",
                milestone: "Where Ms. Sarita Dwivedi earned her B.F.A. alongside four National Creative Honours before conquering international Boccia courts.",
                classes: "Student Outreach • Awareness Workshops • BC1–BC4 Trials"
            },
            jhansi: {
                title: "Jhansi & Bundelkhand • Grassroots Inclusion Zone",
                badge: "Two-Week P&O & Disability Outreach Focus",
                badgeColor: "#F4B942",
                institutions: "Bundelkhand Prosthetic, Orthotic & District Disability Screening Drives",
                leaders: "UPPBA Grassroots & Stakeholder Network",
                milestone: "Part of UPPBA's mission to ensure no eligible person with severe physical disability in Bundelkhand lacks court access.",
                classes: "Community Identification • Equipment Support"
            },
            noida: {
                title: "Noida & NCR / Meerut • Harit Pradesh & National Gateway",
                badge: "Direct Gateway to BSFI & National Camps",
                badgeColor: "#38BDF8",
                institutions: "NCR Para-Athletic Facilities & Rajputana Rifles New Delhi Competition Corridor",
                leaders: "Joint UPPBA & BSFI National Coordination Team",
                milestone: "Bridging Western UP athletes seamlessly into national Federation Cups and pre-departure international camps.",
                classes: "High-Performance Camps • Referees & Classifiers"
            }
        };

        const hubGroups = document.querySelectorAll(".up-hub-group");
        const zoneShapes = document.querySelectorAll(".up-zone-shape");
        const regionPills = document.querySelectorAll(".up-region-pill");

        function renderHubDetails(hubKey) {
            const info = UP_HUBS[hubKey] || UP_HUBS.lucknow;

            hubGroups.forEach((g) => {
                g.classList.toggle("active", g.getAttribute("data-hub") === hubKey);
            });
            zoneShapes.forEach((z) => {
                z.classList.toggle("active-zone", z.getAttribute("data-hub") === hubKey);
            });
            regionPills.forEach((p) => {
                p.classList.toggle("active", p.getAttribute("data-hub") === hubKey);
            });

            detailBox.innerHTML = `
                <h4 class="map-detail-heading">${info.title}</h4>
                <div style="margin-bottom:0.85rem;">
                    <span class="map-detail-badge" style="background:rgba(255,255,255,0.1);border:1px solid ${info.badgeColor};color:${info.badgeColor};">● ${info.badge}</span>
                </div>
                <p class="map-detail-body" style="margin-bottom:1rem;color:rgba(250,247,240,0.9);font-size:0.9rem;line-height:1.55;">
                    ${info.milestone}
                </p>
                <div class="map-detail-grid" style="display:grid;grid-template-columns:1fr;gap:0.55rem;">
                    <div style="background:rgba(255,255,255,0.06);padding:0.6rem 0.85rem;border-radius:10px;">
                        <div style="font-size:0.68rem;text-transform:uppercase;letter-spacing:0.6px;opacity:0.68;">Key Institutions &amp; Stakeholders</div>
                        <strong style="font-size:0.84rem;color:#FAF7F0;">${info.institutions}</strong>
                    </div>
                    <div style="background:rgba(255,255,255,0.06);padding:0.6rem 0.85rem;border-radius:10px;">
                        <div style="font-size:0.68rem;text-transform:uppercase;letter-spacing:0.6px;opacity:0.68;">Leadership / Champion Presence</div>
                        <strong style="font-size:0.84rem;color:#FAF7F0;">${info.leaders}</strong>
                    </div>
                    <div style="background:rgba(255,255,255,0.06);padding:0.6rem 0.85rem;border-radius:10px;">
                        <div style="font-size:0.68rem;text-transform:uppercase;letter-spacing:0.6px;opacity:0.68;">Focus Programmes</div>
                        <strong style="font-size:0.84rem;color:#FFD700;">${info.classes}</strong>
                    </div>
                </div>
            `;
        }

        [...hubGroups, ...zoneShapes, ...regionPills].forEach((el) => {
            el.addEventListener("click", () => {
                renderHubDetails(el.getAttribute("data-hub"));
            });
            el.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    renderHubDetails(el.getAttribute("data-hub"));
                }
            });
        });

        // Default initialize with Lucknow State HQ
        renderHubDetails("lucknow");
    }

    // ---------------------------------------------------------------------
    // ANIMATED COUNT-UP STATS BAR
    // ---------------------------------------------------------------------
    function initStatsCounter() {
        const nums = document.querySelectorAll(".stat-number[data-target]");
        if (!nums.length) return;

        const animateNum = (el) => {
            if (el.dataset.animated === "1") return;
            el.dataset.animated = "1";
            el.classList.add("counted");
            const target = parseInt(el.getAttribute("data-target"), 10) || 0;
            const suffix = el.getAttribute("data-suffix") || "";
            if (isMotionReduced()) {
                el.textContent = target + suffix;
                return;
            }
            const duration = 1200;
            const start = performance.now();
            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        const checkAllStats = () => {
            const vh = window.innerHeight || document.documentElement.clientHeight;
            nums.forEach((el) => {
                if (el.dataset.animated === "1") return;
                const rect = el.getBoundingClientRect();
                if (rect.top <= vh * 0.96) {
                    animateNum(el);
                }
            });
        };

        if ("IntersectionObserver" in window) {
            const obs = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            animateNum(entry.target);
                            obs.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.05 }
            );
            nums.forEach((n) => obs.observe(n));
        } else {
            nums.forEach(animateNum);
        }

        // Immediate & scroll fallback so fast scrolls / deep-links never leave numbers at 0
        checkAllStats();
        window.addEventListener("scroll", checkAllStats, { passive: true });
        window.addEventListener("resize", checkAllStats, { passive: true });
    }

    // ---------------------------------------------------------------------
    // STAR PLAYERS OF UTTAR PRADESH (Jatin Kushwah & Sarita Dwivedi)
    // ---------------------------------------------------------------------
    function initStarPlayers() {
        const ICONS = {
            gold: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="color:#f4b942;"><circle cx="12" cy="12" r="10" stroke="#f4b942" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="5"/></svg>`,
            silver: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="color:#94a3b8;"><circle cx="12" cy="12" r="10" stroke="#94a3b8" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="5"/></svg>`,
            trophy: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="color:#f4b942;"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.44 1.72 4.48 4 4.9V19H5v2h14v-2h-2v-4.1c2.28-.42 4-2.46 4-4.9V7c0-1.1-.9-2-2-2zM5 10V7h2v3H5zm14 0h-2V7h2v3z"/></svg>`,
            india: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="color:#102a63;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
            idea: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="color:#f39c12;"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>`
        };

        const upAthletes = [
            {
                id: "jatin_kushwah",
                name: "Mr. Jatin Kushwah",
                classification: "BC4",
                accentColor: "#8E44AD",
                district: "Agra, Uttar Pradesh",
                svgCoords: { x: 140, y: 120 },
                photos: [
                    "assets/up-media/jatin-gold-fedcup-2026.jpeg",
                    "assets/images/star-players/jatin-1.webp",
                    "assets/images/star-players/jatin-2.webp",
                    "assets/images/star-players/jatin-3.webp"
                ],
                story:
                    "Living with muscular dystrophy, I began my Boccia journey in 2023 and haven't left the podium since — winning Gold at the 7th, 8th, 9th & 10th Nationals, winning Bahrain 2024 World Boccia Challenger Silver & Bronze, and proudly bringing home the GOLD Medal for Uttar Pradesh at the 2nd Boccia India Federation Cup 2026 in New Delhi.",
                badges: ["Fed Cup 2026 Gold • New Delhi", "4x National Champion", "World Challenger Medallist"],
                careerHighlights: [
                    { icon: ICONS.gold, title: "Gold — 2nd Federation Cup 2026", sub: "Rajputana Rifles, New Delhi (3–8 Oct 2026)" },
                    { icon: ICONS.trophy, title: "World Challenger Bahrain 2024", sub: "Silver (BC4 Pairs) & Bronze (Individual)" },
                    { icon: ICONS.india, title: "4x Consecutive National Gold", sub: "7th, 8th, 9th & 10th National Championships" }
                ],
                currentMission: "Representing Uttar Pradesh & preparing for World Boccia Championships"
            },
            {
                id: "sarita_dwivedi",
                name: "Ms. Sarita Dwivedi",
                classification: "BC3",
                accentColor: "#FF9933",
                district: "Kanpur / Prayagraj, Uttar Pradesh",
                svgCoords: { x: 360, y: 120 },
                photos: [
                    "assets/up-media/sarita-pilsen-2026.jpeg",
                    "assets/up-media/sarita-silver-fedcup-2026.jpeg",
                    "assets/images/star-players/sarita-1.webp",
                    "assets/images/star-players/sarita-2.webp"
                ],
                story:
                    "A childhood 11,000V electric shock left me a triple amputee — yet I earned a B.F.A., four National Creative Honours, the Zero Project International Discovery Award 2025, became India's first female BC-3 international medallist (Double Bronze at Cairo 2024), represented India at Pilsen 2026 World Boccia Challenger, and won SILVER for Uttar Pradesh at the 2nd Boccia India Federation Cup 2026.",
                badges: ["Fed Cup 2026 Silver • New Delhi", "Pilsen 2026 India Team", "Zero Project Awardee 2025"],
                careerHighlights: [
                    { icon: ICONS.silver, title: "Silver — 2nd Federation Cup 2026", sub: "Rajputana Rifles, New Delhi (BC-3 Division)" },
                    { icon: ICONS.india, title: "Cairo 2024 & Pilsen 2026 World Stage", sub: "First Indian BC-3 Female Int'l Medallist (2x Bronze)" },
                    { icon: ICONS.idea, title: "8x National Medallist & Innovator", sub: "Zero Project Int'l Discovery Award 2025 • ALIMCO" }
                ],
                currentMission: "Pioneering BC-3 ramp excellence & mentoring UP's para athletes"
            }
        ];

        const revealWrapper = document.getElementById("starsRevealWrapper");
        const constellationContainer = document.getElementById("constellationContainer");
        const constellationCenter = document.getElementById("constellationCenter");
        const beacons = document.querySelectorAll(".athlete-beacon");
        const switchBtns = document.querySelectorAll(".up-star-switch-btn");
        const summaryCards = document.querySelectorAll(".up-athlete-summary-card");
        const card = document.getElementById("athleteProfileCard");
        const cardEmptyState = document.getElementById("cardEmptyStateView");
        const cardMainProfile = document.getElementById("cardMainProfileView");

        if (!card || !cardMainProfile) return;

        const cardAthleteName = document.getElementById("cardAthleteName");
        const cardClassBadge = document.getElementById("cardClassBadge");
        const cardLocation = document.getElementById("cardLocation");
        const cardBadgesRow = document.getElementById("cardBadgesRow");
        const cardStory = document.getElementById("cardStory");
        const cardHighlightsContainer = document.getElementById("cardHighlightsContainer");
        const cardMission = document.getElementById("cardMission");
        const dynamicTravel = document.getElementById("dynamic-travel");

        let activeIndex = -1;
        let filmReelTimer = null;
        let autoRotateTimer = null;

        function startFilmReelSlideshow(photos, name) {
            clearInterval(filmReelTimer);
            const container = document.getElementById("cardFilmStrip");
            if (!container) return;

            container.innerHTML = photos
                .map(
                    (p, idx) => `
                <div class="film-strip-slide ${idx === 0 ? "active" : ""}">
                    <img src="${p}" alt="${name} photo ${idx + 1}" decoding="async">
                </div>`
                )
                .join("");

            const slides = container.querySelectorAll(".film-strip-slide");
            if (slides.length <= 1 || isMotionReduced()) return;

            let idx = 0;
            filmReelTimer = setInterval(() => {
                slides[idx].classList.remove("active");
                idx = (idx + 1) % slides.length;
                slides[idx].classList.add("active");
            }, 3800);
        }

        function startAutoRotate() {
            clearInterval(autoRotateTimer);
            if (isMotionReduced()) return;
            autoRotateTimer = setInterval(() => {
                selectUpAthlete((activeIndex + 1) % upAthletes.length);
            }, 14000);
        }

        function selectUpAthlete(index) {
            const athlete = upAthletes[index];
            if (!athlete || index === activeIndex) return;
            activeIndex = index;

            if (constellationContainer) constellationContainer.classList.add("has-active-beacon");
            beacons.forEach((b) => {
                b.classList.toggle("active", b.getAttribute("data-id") === athlete.id);
            });
            switchBtns.forEach((b) => {
                b.classList.toggle("active", Number(b.getAttribute("data-idx")) === index);
            });
            summaryCards.forEach((c) => {
                c.classList.toggle("active", Number(c.getAttribute("data-idx")) === index);
            });

            if (dynamicTravel) {
                dynamicTravel.setAttribute("d", `M 250 250 L ${athlete.svgCoords.x} ${athlete.svgCoords.y}`);
                dynamicTravel.setAttribute("stroke", athlete.accentColor);
                dynamicTravel.classList.remove("animating");
                void dynamicTravel.getBoundingClientRect();
                dynamicTravel.classList.add("animating");
            }

            card.classList.remove("active-transition");
            if (cardEmptyState) cardEmptyState.style.display = "none";
            cardMainProfile.style.display = "flex";
            card.style.setProperty("--class-color", athlete.accentColor);

            cardAthleteName.textContent = athlete.name;
            cardClassBadge.textContent = athlete.classification;
            cardLocation.textContent = athlete.district;
            cardBadgesRow.innerHTML = athlete.badges
                .map((b) => `<span class="meta-pill pill-gold">${b}</span>`)
                .join("");
            cardStory.textContent = `"${athlete.story}"`;
            cardMission.textContent = athlete.currentMission;
            cardHighlightsContainer.innerHTML = athlete.careerHighlights
                .map(
                    (h) => `
                <div class="career-highlight-card">
                    <div class="highlight-icon-wrap">${h.icon}</div>
                    <div class="highlight-info">
                        <div class="highlight-title">${h.title}</div>
                        <div class="highlight-sub">${h.sub}</div>
                    </div>
                </div>`
                )
                .join("");

            startFilmReelSlideshow(athlete.photos, athlete.name);
            setTimeout(() => card.classList.add("active-transition"), 30);
        }

        const starsSection = document.getElementById("boccia-stars");
        if (starsSection && revealWrapper && "IntersectionObserver" in window) {
            const obs = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            revealWrapper.classList.add("revealed");
                            obs.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );
            obs.observe(starsSection);
        } else if (revealWrapper) {
            revealWrapper.classList.add("revealed");
        }

        // Populate Jatin Kushwah immediately on load so card is crisp even before click
        selectUpAthlete(0);

        // Auto-rotate every 14s unless user interacts or reduce-motion is enabled
        let userStoppedAuto = false;
        const stopAuto = () => {
            userStoppedAuto = true;
            clearInterval(autoRotateTimer);
        };
        startAutoRotate();

        window.addEventListener("uppba:reducemotion", (e) => {
            if (e.detail && e.detail.reduced) {
                clearInterval(filmReelTimer);
                clearInterval(autoRotateTimer);
            } else {
                const currentAthlete = upAthletes[Math.max(0, activeIndex)];
                if (currentAthlete) startFilmReelSlideshow(currentAthlete.photos, currentAthlete.name);
                if (!userStoppedAuto) startAutoRotate();
            }
        });

        beacons.forEach((b) => {
            b.addEventListener("click", () => {
                stopAuto();
                const id = b.getAttribute("data-id");
                const idx = upAthletes.findIndex((a) => a.id === id);
                if (idx !== -1) selectUpAthlete(idx);
            });
        });

        [...switchBtns, ...summaryCards].forEach((el) => {
            el.addEventListener("click", () => {
                stopAuto();
                const idx = Number(el.getAttribute("data-idx"));
                if (!Number.isNaN(idx)) selectUpAthlete(idx);
            });
        });

        if (constellationCenter) {
            constellationCenter.addEventListener("click", () => {
                stopAuto();
                selectUpAthlete((activeIndex + 1) % upAthletes.length);
            });
        }
    }

    // ---------------------------------------------------------------------
    // PHOTO GALLERY CATEGORY FILTERS + GLIGHTBOX
    // ---------------------------------------------------------------------
    function initGalleryAndLightbox() {
        const filterBtns = document.querySelectorAll(".up-gallery-filter-btn");
        const galleryItems = document.querySelectorAll(".up-gallery-item");
        let lightboxInstance = null;

        function refreshLightbox() {
            if (typeof GLightbox === "undefined") return;
            if (lightboxInstance && typeof lightboxInstance.destroy === "function") {
                lightboxInstance.destroy();
            }
            lightboxInstance = GLightbox({
                selector: ".glightbox",
                touchNavigation: true,
                loop: true,
                keyboardNavigation: true
            });
        }

        filterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                filterBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                const cat = btn.getAttribute("data-filter");

                galleryItems.forEach((item) => {
                    const match = cat === "all" || item.getAttribute("data-category") === cat;
                    item.style.display = match ? "" : "none";
                });
            });
        });

        refreshLightbox();
    }
})();
