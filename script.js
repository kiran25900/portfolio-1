/* Execute Interaction Logic */

document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------------------------------------------- //
    // 1. Custom Cursor Engine (Inverted + Spring Physics Trailing)     //
    // ---------------------------------------------------------------- //
    const dot = document.getElementById("cursor-dot");
    const outline = document.getElementById("cursor-outline");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let dotX = mouseX;
    let dotY = mouseY;
    let outlineX = mouseX;
    let outlineY = mouseY;

    // Track mouse
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Handle scroll offsets for absolute positioning if needed, 
    // but fixed positioning avoids this computationally expensive recalculation

    // Render loop for spring physics
    const renderCursor = () => {
        const dx = mouseX - dotX;
        const dy = mouseY - dotY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Fast snap for dot (minimal latency)
        dotX += dx * 0.7;
        dotY += dy * 0.7;

        // Fluid spring physics for the trailing outline
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        // Apply dynamic translate concatenated with the centering offset from CSS
        dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
        outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;

        // Dynamic glow physics based on motion velocity
        const glow = Math.min(dist * 0.8, 30);
        dot.style.boxShadow = `0 0 ${10 + glow}px ${2 + glow / 4}px rgba(234, 234, 234, ${0.3 + glow / 60})`;

        requestAnimationFrame(renderCursor);
    };
    renderCursor();

    // Hover state management
    const elements = document.querySelectorAll("a, button, .project-matrix, .magnetic-btn, .magnetic-link, .capability-node");

    elements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            outline.classList.add("hover-active");
            dot.style.opacity = "0.2";
        });
        el.addEventListener("mouseleave", () => {
            outline.classList.remove("hover-active");
            dot.style.opacity = "1";
        });
    });

    // ---------------------------------------------------------------- //
    // 2. Magnetic Pull Interactions                                    //
    // ---------------------------------------------------------------- //
    const magnetics = document.querySelectorAll(".magnetic-btn, .magnetic-link");

    magnetics.forEach(el => {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            // Vector calculation from center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Subtle pull
            const strength = el.classList.contains("magnetic-btn") ? 0.35 : 0.25;
            el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        el.addEventListener("mouseleave", () => {
            el.style.transform = `translate(0px, 0px)`;
        });
    });

    // ---------------------------------------------------------------- //
    // 3. Entrance Animations via Intersection Observer                 //
    // ---------------------------------------------------------------- //
    const fadeEls = document.querySelectorAll(".fade-up");

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15 // Fire when 15% of the element is in view
    };

    const entranceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target); // Ruthless optimization: do not re-calculate
            }
        });
    }, observerOptions);

    fadeEls.forEach(el => entranceObserver.observe(el));

    // ---------------------------------------------------------------- //
    // 4. Obfuscated Mailto Logic (Spam bots mitigation)                //
    // ---------------------------------------------------------------- //
    const mailLinks = document.querySelectorAll('.obf-mail');

    mailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const rawData = link.getAttribute('data-contact');
            if (rawData) {
                // Reverse string logic
                const email = rawData.split('').reverse().join('');
                window.location.href = `mailto:${email}`;
            }
        });
    });

    // ---------------------------------------------------------------- //
    // 5. Project Modal Logic                                           //
    // ---------------------------------------------------------------- //
    const projectData = {
        "01": {
            title: "Careflow Provider",
            tags: "Flutter / Node.js / MongoDB / Mobile (iOS & Android)",
            desc: `<strong>Caregiver Shift & Task Management</strong><br><br>
                The mobile terminal for healthcare staff. Designed for absolute friction-free use, allowing caregivers to manage their schedules, view patient requirements, and log vital updates without being distracted by administrative overhead.<br><br>
                <strong>Key Features:</strong>
                <ul style="margin-top: 8px; margin-left: 20px; color: rgba(234, 234, 234, 0.7);">
                    <li>Geolocation-based clock-in and clock-out</li>
                    <li>Real-time shift scheduling and shift-swapping</li>
                    <li>Daily patient care task checklists</li>
                    <li>Secure, encrypted messaging with agency dispatch</li>
                </ul><br>
                <em>About This Project:</em> Solves the problem of caregiver burnout caused by clunky administrative tools. The UI is ruthlessly minimal, ensuring that logging patient data takes seconds, allowing the provider to focus entirely on care.`
        },
        "02": {
            title: "Careflow Family",
            tags: "React.js / Express / MongoDB / Web & Mobile Web",
            desc: `<strong>Patient Monitoring & Care Coordination</strong><br><br>
                A transparent portal that bridges the gap between care providers and the families of those receiving care. It translates complex medical and scheduling data into clear, reassuring, and actionable insights.<br><br>
                <strong>Key Features:</strong>
                <ul style="margin-top: 8px; margin-left: 20px; color: rgba(234, 234, 234, 0.7);">
                    <li>Live updates on caregiver arrivals and departures</li>
                    <li>Daily health and mood reports</li>
                    <li>Simplified billing and invoice management</li>
                    <li>Direct care-plan modification requests</li>
                </ul><br>
                <em>About This Project:</em> Alleviates the anxiety families face when coordinating remote care. The architecture prioritizes data security and clear data visualization, turning a stressful process into a seamless digital experience.`
        },
        "03": {
            title: "Careflow Command",
            tags: "React.js / Node.js / MongoDB (MERN) / Desktop Web",
            desc: `<strong>Agency Operations & Dispatch Dashboard</strong><br><br>
                The central nervous system of the Careflow ecosystem. A high-density data dashboard engineered for agency administrators to oversee hundreds of concurrent caregivers and patients with total clarity.<br><br>
                <strong>Key Features:</strong>
                <ul style="margin-top: 8px; margin-left: 20px; color: rgba(234, 234, 234, 0.7);">
                    <li>Interactive, drag-and-drop master scheduling matrix</li>
                    <li>System-wide financial reporting and payroll generation</li>
                    <li>Automated caregiver-to-patient matching logic</li>
                    <li>Role-based access control (RBAC) and audit logging</li>
                </ul><br>
                <em>About This Project:</em> Tackles the massive cognitive load of running a healthcare logistics agency. The UI utilizes advanced data tables and asymmetric grid layouts to make complex relational data instantly scannable and actionable.`
        },
        "04": {
            title: "Quantitative Trading Engine",
            tags: "Python / Financial APIs / Desktop / Server-side",
            desc: `<strong>Automated Python Trading Bot</strong><br><br>
                A bespoke automated trading system built to execute predefined stock trading strategies. The architecture handles real-time market analysis, dynamic capital allocation, and algorithmic trade execution without manual intervention.<br><br>
                <em>About This Project:</em> Showcases backend logic, automation, and analytical capabilities, focusing on absolute deterministic execution and high-speed data flow parsing.`
        },
        "05": {
            title: "Global E-Commerce Storefront",
            tags: "Shopify / Web Design / Web & Mobile Web",
            desc: `<strong>International Dropshipping Platform</strong><br><br>
                A highly optimized Shopify storefront designed for the international dropshipping market. The focus is on a high-conversion user journey, seamless product discovery, and rapid checkout flows.<br><br>
                <strong>Key Features:</strong>
                <ul style="margin-top: 8px; margin-left: 20px; color: rgba(234, 234, 234, 0.7);">
                    <li>Conversion-optimized UI/UX</li>
                    <li>Integrated international product sourcing</li>
                    <li>Streamlined payment and checkout funnels</li>
                </ul><br>
                <em>About This Project:</em> Highlights commercial awareness, e-commerce skills, and understanding of conversion-driven design tailored for a global audience.`
        }
    };

    const modalOverlay = document.getElementById("project-modal");
    const modalCloseBtn = document.getElementById("modal-close");
    const modalTitle = document.getElementById("modal-title");
    const modalTags = document.getElementById("modal-tags");
    const modalDesc = document.getElementById("modal-desc");
    const projectTriggers = document.querySelectorAll(".project-matrix");

    // Open Modal
    projectTriggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            const projectId = trigger.getAttribute("data-project");
            const data = projectData[projectId];

            if (data) {
                // Populate Modal Data
                modalTitle.textContent = data.title;
                modalTags.textContent = data.tags;
                modalDesc.textContent = data.desc;

                // Show Modal
                modalOverlay.classList.add("active");
                // Disable background scrolling
                document.body.style.overflow = "hidden";
            }
        });
    });

    // Close Modal via Button
    modalCloseBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    });

    // Close Modal via Overlay Click
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });

    // Close Modal via Escape Key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
            modalOverlay.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });

    // ---------------------------------------------------------------- //
    // 6. Infinite Loop Ticker & Navigation (Curated Architectures)     //
    // ---------------------------------------------------------------- //
    const tickerContainer = document.getElementById("stack-ticker");
    const prevBtn = document.getElementById("prev-project");
    const nextBtn = document.getElementById("next-project");
    let originalNodes = Array.from(document.querySelectorAll("#stack-ticker .stack-node"));

    // We clone nodes to create an infinite ribbon.
    // Clone all nodes once and append them to the end, and prepend to the start
    originalNodes.forEach(node => {
        let cloneEnd = node.cloneNode(true);
        tickerContainer.appendChild(cloneEnd);
    });

    originalNodes.forEach(node => {
        let cloneStart = node.cloneNode(true);
        tickerContainer.insertBefore(cloneStart, tickerContainer.firstChild);
    });

    // Re-select all nodes including clones
    let allNodes = Array.from(document.querySelectorAll("#stack-ticker .stack-node"));

    // Tracking indices
    let currentIndex = originalNodes.length; // Start at the first real node
    let gap = parseInt(window.getComputedStyle(tickerContainer).gap) || 0;

    function getOffsetConfig() {
        const nodeWidth = allNodes[0].offsetWidth;
        return nodeWidth + gap;
    }

    // Initialize immediate position without animation to snap to first real node
    tickerContainer.style.transition = 'none';
    requestAnimationFrame(() => {
        const itemWidthAndGap = getOffsetConfig();
        tickerContainer.style.transform = `translateX(-${currentIndex * itemWidthAndGap}px)`;
        // Force reflow
        tickerContainer.offsetHeight;
        tickerContainer.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    function navigateTicker(direction) {
        const itemWidthAndGap = getOffsetConfig();

        if (direction === 'next') {
            currentIndex++;
        } else {
            currentIndex--;
        }

        tickerContainer.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        tickerContainer.style.transform = `translateX(-${currentIndex * itemWidthAndGap}px)`;
    }

    function handleTransitionEnd() {
        const itemWidthAndGap = getOffsetConfig();
        // If we scrolled past the cloned boundaries, snap back to real data instantly
        if (currentIndex <= 0) {
            tickerContainer.style.transition = 'none';
            currentIndex = originalNodes.length;
            tickerContainer.style.transform = `translateX(-${currentIndex * itemWidthAndGap}px)`;
            tickerContainer.offsetHeight; // Reflow
        } else if (currentIndex >= originalNodes.length * 2) {
            tickerContainer.style.transition = 'none';
            currentIndex = originalNodes.length; // Snap back to the mathematical start
            tickerContainer.style.transform = `translateX(-${currentIndex * itemWidthAndGap}px)`;
            tickerContainer.offsetHeight; // Reflow
        }
    }

    tickerContainer.addEventListener('transitionend', handleTransitionEnd);

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => navigateTicker('next'));
        prevBtn.addEventListener('click', () => navigateTicker('prev'));
    }

});
