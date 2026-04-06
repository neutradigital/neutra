import './style.css'


// Inicialización Centralizada
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initMobileMenu();
    initSectorCards();
    initCustomCursor();
    initContactForm();
    initSlideOver();
});


const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    gestureDirection: 'vertical',
    smoothTouch: false,
    touchMultiplier: 2,
});

// Exponer lenis globalmente para que initSlideOver pueda detenerlo
window.lenis = lenis;

// INTEGRACIÓN GSAP + SCROLLTRIGGER
gsap.registerPlugin(ScrollTrigger);

// Sincronización Lenis-ScrollTrigger a través del ticker de GSAP.
// ÚNICO loop de animación: gsap.ticker llama a lenis.raf() — NO usar requestAnimationFrame separado.
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Scroll suave para anclas internas
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            lenis.scrollTo(target, {
                offset: 0,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});

// 3. SISTEMA DE ANIMACIONES ("NEUTRA MOTION")

// 3. SISTEMA DE ANIMACIONES ("NEUTRA MOTION")

function initAnimations() {

    // A. REVEAL BÁSICO (Fade Up)
    // Excluimos h1, p y button dentro del hero (#hero) — ya tienen animate-fade-in-up en CSS
    // y añadir ScrollTrigger sobre el hero h1 crea un observer innecesario visible antes del scroll.
    const revealElements = document.querySelectorAll(
        'main h2, main h3, main p, main button, .js-sector-card, #trusted-partners h2, #contacto h4'
    );

    revealElements.forEach(element => {
        gsap.fromTo(element,
            { y: 30, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: element,
                    start: "top 90%",
                    toggleActions: "play none none none",
                    once: true,
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                onComplete: () => { element.style.willChange = 'auto'; }
            }
        );
    });

    // B. BENTO CARDS: Reveal on Scroll (IntersectionObserver — sin GSAP, cero overhead)
    const bentoCards = document.querySelectorAll('.js-bento-card');
    if (bentoCards.length > 0) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const card = entry.target;
                        const delay = Array.from(bentoCards).indexOf(card) * 60;
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.25,1,0.5,1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                            setTimeout(() => { card.style.willChange = 'auto'; }, 800);
                        }, delay);
                        revealObserver.unobserve(card);
                    }
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
        );
        bentoCards.forEach(card => revealObserver.observe(card));
    }

    // C. LÍNEAS DE SEPARACIÓN
    const lines = document.querySelectorAll('.h-px');
    lines.forEach(line => {
        gsap.fromTo(line,
            { scaleX: 0, transformOrigin: "left center" },
            {
                scaleX: 1,
                scrollTrigger: {
                    trigger: line,
                    start: "top 92%",
                    toggleActions: "play none none none",
                    once: true,
                },
                duration: 1.0,
                ease: "expo.out"
            }
        );
    });

}

// CONTROL DEL PRELOADER
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');

    if (preloader) {
        // Pequeño delay artificial para que la animación no sea un "flash" molesto si carga muy rápido
        setTimeout(() => {
            preloader.classList.add('opacity-0'); // Desvanece
            preloader.classList.add('pointer-events-none'); // Permite clickear debajo

            // Opcional: Iniciar animaciones de entrada del Hero aquí
            // document.getElementById('hero-title').classList.add('animate-in');
        }, 900);
    }
});

/**
 * ------------------------------------------------------------------
 * SISTEMA 1: MENÚ MÓVIL (Burger Menu)
 * ------------------------------------------------------------------
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const menuItems = document.getElementById('menu-items');

    // Elementos del icono (líneas)
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');

    // Variable de estado
    let isMenuOpen = false;

    // Función interna para alternar estado
    const toggleMenuState = () => {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            // ABRIR
            menuItems.classList.remove('opacity-0', 'pointer-events-none');
            menuItems.classList.add('opacity-100', 'pointer-events-auto');
            document.body.style.overflow = 'hidden'; // Bloquear scroll

            // Animación Burger -> X
            line1.classList.add('rotate-45', 'translate-y-2');
            line2.classList.add('opacity-0');
            line3.classList.add('-rotate-45', '-translate-y-2');
        } else {
            // CERRAR
            menuItems.classList.remove('opacity-100', 'pointer-events-auto');
            menuItems.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = ''; // Desbloquear scroll

            // Animación X -> Burger
            line1.classList.remove('rotate-45', 'translate-y-2');
            line2.classList.remove('opacity-0');
            line3.classList.remove('-rotate-45', '-translate-y-2');
        }
    };

    // Event Listener al botón
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenuState();
        });
    }

    // Cerrar menú al hacer click en enlaces (UX)
    const links = menuItems ? menuItems.querySelectorAll('a') : [];
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenuState();
        });
    });

    // Exponer función globalmente si usas onclick="closeMenu()" en el HTML
    window.closeMenu = () => {
        if (isMenuOpen) toggleMenuState();
    };
}

/**
 * ------------------------------------------------------------------
 * SISTEMA 2: TARJETAS DE SECTORES (Accordión Mobile)
 * ------------------------------------------------------------------
 */
function initSectorCards() {
    // IMPORTANTE: Asegúrate que en HTML las tarjetas tengan la clase 'js-sector-card'
    const cards = document.querySelectorAll('.js-sector-card');

    if (cards.length === 0) {
        console.warn('Neutra Debug: No se encontraron tarjetas con clase .js-sector-card');
        return;
    }

    cards.forEach(card => {
        card.addEventListener('click', (e) => {

            // Lógica exclusiva para Tablets y Móviles (< 1025px)
            if (window.innerWidth < 1025) {

                // Evitar conflictos con enlaces internos si los hubiera
                // e.preventDefault(); 

                const isExpanded = card.classList.contains('is-expanded');

                // 1. Reset: Cerrar todas las demás tarjetas
                cards.forEach(c => c.classList.remove('is-expanded'));

                // 2. Acción: Si no estaba expandida, la expandimos
                if (!isExpanded) {
                    // Forzar repintado para evitar glitches en iOS
                    void card.offsetWidth;
                    card.classList.add('is-expanded');
                }
            }
        });
    });

    // Limpieza al redimensionar: debounced para no disparar en cada pixel
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth >= 1025) {
                cards.forEach(c => c.classList.remove('is-expanded'));
            }
        }, 150);
    });
}

function initCustomCursor() {
    // Solo activar en Desktop (> 1024px)
    if (window.innerWidth < 1025) return;

    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    if (!dot || !outline) return;

    // Promover a layers de composición propios — evita que el movimiento repinte el layout
    dot.style.willChange = 'transform';
    outline.style.willChange = 'transform';

    // Usamos transform en lugar de top/left para evitar reflows en cada frame
    let mouseX = 0, mouseY = 0;
    let outX = 0, outY = 0;
    let visible = false;

    // 1. Rastrear movimiento del mouse
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // El punto pequeño: transform es GPU-composited, sin reflow
        dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;

        if (!visible) {
            visible = true;
            dot.style.opacity = '1';
            outline.style.opacity = '1';
        }
    }, { passive: true });

    // 2. Animación fluida del outline (LERP) — usa transform, sin top/left
    const animateCursor = () => {
        outX += (mouseX - outX) * 0.15;
        outY += (mouseY - outY) * 0.15;
        outline.style.transform = `translate(calc(${outX}px - 50%), calc(${outY}px - 50%))`;
        requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // 3. Detectar elementos interactivos usando delegación de eventos (un solo listener)
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .js-sector-card, input, textarea, select')) {
            document.body.classList.add('hovering');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .js-sector-card, input, textarea, select')) {
            document.body.classList.remove('hovering');
        }
    });
}

function initContactForm() {
    const form = document.getElementById('project-form');
    const result = document.getElementById('form-result');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Evita recargar la página

        // UI: Estado de carga
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        result.classList.add('hidden');

        // Empaquetar datos
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        // Enviar a Web3Forms
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    // ÉXITO
                    result.innerHTML = "Solicitud recibida. Analizaremos tu perfil en breve.";
                    result.classList.remove('hidden', 'text-red-400', 'border-red-500/50', 'bg-red-500/10');
                    result.classList.add('text-green-400', 'border-green-500/50', 'bg-green-500/10');
                    form.reset(); // Limpiar campos
                } else {
                    // ERROR DE API
                    console.log(response);
                    result.innerHTML = json.message;
                    result.classList.remove('hidden', 'text-green-400', 'border-green-500/50', 'bg-green-500/10');
                    result.classList.add('text-red-400', 'border-red-500/50', 'bg-red-500/10');
                }
            })
            .catch(error => {
                // ERROR DE RED
                console.log(error);
                result.innerHTML = "Error de conexión. Intente nuevamente.";
                result.classList.remove('hidden');
                result.classList.add('text-red-400', 'border-red-500/50', 'bg-red-500/10');
            })
            .finally(() => {
                // UI: Restaurar botón
                submitBtn.disabled = false;
                btnText.classList.remove('hidden');
                btnLoading.classList.add('hidden');

                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    result.classList.add('hidden');
                }, 5000);
            });
    });
}

/**
 * ------------------------------------------------------------------
 * SISTEMA 3: SLIDE-OVER METODOLOGÍA
 * ------------------------------------------------------------------
 */
function initSlideOver() {
    const slideWrapper = document.getElementById('slide-over-wrapper');
    const slideBackdrop = document.getElementById('slide-over-backdrop');
    const slidePanel = document.getElementById('slide-over-panel');
    const slideScrollBody = document.getElementById('slide-scroll-body');
    const closeBtn = document.getElementById('close-slide-over');
    const triggers = document.querySelectorAll('.js-slide-trigger');
    const titleEl = document.getElementById('slide-title');
    const phasesCol = document.getElementById('slide-phases-col');
    const stickyCol = document.getElementById('slide-sticky-col');

    if (!slideWrapper || !slideBackdrop || !slidePanel || !slideScrollBody) return;

    // CRÍTICO: Evitar que Lenis intercepte los eventos de scroll dentro del panel.
    slideScrollBody.addEventListener('wheel', (e) => { e.stopPropagation(); }, { passive: true });
    slideScrollBody.addEventListener('touchmove', (e) => { e.stopPropagation(); }, { passive: true });

    // ── CATÁLOGO DE SERVICIOS (estructura por fases) ─────────────
    const slideData = {
        'identidad': {
            title: 'Identidad Estructural',
            phases: [
                {
                    label: 'Fase 1',
                    title: 'Auditoría Orgánica',
                    text: 'Analizamos a fondo el ecosistema actual de tu marca, su posicionamiento, competidores y los objetivos comerciales a largo plazo para detectar brechas y oportunidades reales.',
                    image: './src/images/auditoria_neutra.jpg'
                },
                {
                    label: 'Fase 2',
                    title: 'Arquitectura Visual',
                    text: 'Diseñamos las reglas fundamentales: paletas de color, tipografías y proporciones matemáticas que sostendrán la autoridad visual del proyecto de forma inmutable.',
                    image: './src/images/proceso_identidad.jpg'
                },
                {
                    label: 'Fase 3',
                    title: 'Manual de Operaciones',
                    text: 'Entregamos el reglamento oficial de uso para que tu marca se mantenga unificada e inquebrantable sin importar el medio, el formato o el ejecutor.',
                    image: './src/images/reglamento_brand.jpg'
                }
            ]
        },
        'fotografia': {
            title: 'Dirección Fotográfica',
            phases: [
                {
                    label: 'Fase 1',
                    title: 'Conceptualización',
                    text: 'Aterrizamos la narrativa visual, referencias de iluminación y seleccionamos locaciones que fortalezcan el branding empresarial desde el primer encuadre.',
                    image: './src/ourWork/ourwork2.jpg'
                },
                {
                    label: 'Fase 2',
                    title: 'Ejecución en Set',
                    text: 'Operamos con equipo de alto rango, controlando meticulosamente cada variable: composición, temperatura de luz y dirección de talent para asegurar capturas premium.',
                    image: './src/ourWork/ourwork5.jpg'
                },
                {
                    label: 'Fase 3',
                    title: 'Tratamiento Editorial',
                    text: 'Post-producción intensiva: retoque milimétrico, calibración de color corporativo (Color Grading) y optimización multi-formato para todos los canales del ecosistema.',
                    image: './src/ourWork/ourwork6.jpg'
                }
            ]
        },
        'frontend': {
            title: 'Ingeniería Frontend',
            phases: [
                {
                    label: 'Fase 1',
                    title: 'Wireframing Riguroso',
                    text: 'Mapeamos la arquitectura de información y los flujos de usuario (UX) para garantizar una navegación sin fricciones antes de escribir una sola línea de código.',
                    image: './src/ourWork/ourwork1.jpg'
                },
                {
                    label: 'Fase 2',
                    title: 'Código Puro & Tailwind',
                    text: 'Construimos interfaces con Tailwind CSS v4 e integramos animaciones calculadas con GPU-acceleration para mantener una fluidez de 60fps en cualquier dispositivo.',
                    image: './src/ourWork/ourwork7.jpg'
                },
                {
                    label: 'Fase 3',
                    title: 'Performance & QA',
                    text: 'Auditorías Lighthouse, minificación de assets, lazy loading y pruebas de estrés multiplataforma para garantizar tiempos de carga menores a 1.5 segundos en producción.',
                    image: './src/ourWork/ourwork4.jpg'
                }
            ]
        }
    };


    // Estado interno: rastrear si el panel está abierto
    let isSlideOpen = false;

    // Observer de scroll-spy activo (guardamos ref para desconectarlo al cerrar)
    let spyObserver = null;

    const openSlideOver = (serviceId) => {
        const data = slideData[serviceId];
        if (!data) return;

        // ── LIMPIEZA DE ESTADO DEL ACORDEÓN ────────────────────────
        document.querySelectorAll('.is-open').forEach(row => row.classList.remove('is-open'));
        if (document.activeElement) document.activeElement.blur();

        // ── RENDERIZADO DEL TÍTULO ──────────────────────────────────
        titleEl.textContent = data.title;

        // ── RENDERIZADO DE FASES (Columna Izquierda) ───────────────
        const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

        phasesCol.innerHTML = data.phases.map((phase, i) => `
            <div class="phase-block ${isDesktop ? 'min-h-[70vh] flex flex-col justify-center' : 'pb-10'} transition-opacity duration-500 ${i === 0 ? 'opacity-100' : 'opacity-30'}"
                 data-index="${i}">
                <p class="text-gray-600 text-xs font-bold tracking-[0.3em] uppercase mb-3">${phase.label}</p>
                <h4 class="text-white text-2xl md:text-3xl font-light tracking-tight mb-4 max-w-sm">${phase.title}</h4>
                <p class="text-gray-400 text-base leading-relaxed max-w-lg">${phase.text}</p>
                ${!isDesktop ? `
                <div class="mt-6 aspect-video overflow-hidden rounded-lg bg-gray-900">
                    <img src="${phase.image}" alt="${phase.title}" class="w-full h-full object-cover" loading="lazy" decoding="async">
                </div>` : ''}
            </div>
        `).join('');

        // ── RENDERIZADO DE IMÁGENES SUPERPUESTAS (Columna Derecha, solo desktop) ──
        if (isDesktop) {
            stickyCol.innerHTML = data.phases.map((phase, i) => `
                <img src="${phase.image}"
                     alt="${phase.title}"
                     data-index="${i}"
                     class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${i === 0 ? 'opacity-100' : 'opacity-0'}"
                     loading="lazy" decoding="async">
            `).join('');
        } else {
            stickyCol.innerHTML = '';
        }

        // ── INTERSECTION OBSERVER (Scroll-Spy, solo desktop) ────────
        // Desconectar observer anterior si existe
        if (spyObserver) spyObserver.disconnect();

        if (isDesktop) {
            const phaseBlocks = phasesCol.querySelectorAll('.phase-block');
            const stickyImgs = stickyCol.querySelectorAll('img');

            spyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const activeIndex = parseInt(entry.target.dataset.index);

                    // a) Actualizar opacidad de bloques de texto
                    phaseBlocks.forEach((block, i) => {
                        block.classList.toggle('opacity-100', i === activeIndex);
                        block.classList.toggle('opacity-30', i !== activeIndex);
                    });

                    // b) Cambiar imagen activa en columna sticky
                    stickyImgs.forEach((img, i) => {
                        img.classList.toggle('opacity-100', i === activeIndex);
                        img.classList.toggle('opacity-0', i !== activeIndex);
                    });
                });
            }, {
                root: slideScrollBody,   // Scoped al scroll del panel, no al window
                threshold: 0.5           // Activa cuando el 50% del bloque es visible
            });

            phaseBlocks.forEach(block => spyObserver.observe(block));
        }

        // FIX iOS Safari: webkit-overflow-scrolling activa scroll acelerado por hardware
        slideScrollBody.style.webkitOverflowScrolling = 'touch';

        // Activar Clases Visuales y Aislamiento de Capas
        slideWrapper.classList.remove('pointer-events-none');
        slideBackdrop.classList.remove('opacity-0');
        slidePanel.classList.remove('translate-x-full');

        // SCROLL-LOCK: Bloquear scroll del fondo (único método garantizado en iOS)
        document.body.style.overflow = 'hidden';

        // Bloquear lenis
        if (window.lenis && typeof window.lenis.stop === 'function') {
            window.lenis.stop();
        }

        // HISTORY API: inyectar estado falso para interceptar el botón "Atrás" del móvil
        if (!isSlideOpen) {
            window.history.pushState({ slideOpen: true }, '');
        }
        isSlideOpen = true;
    };

    const closeSlideOver = () => {
        if (!isSlideOpen) return;
        isSlideOpen = false;

        // Desconectar el observer de scroll-spy para evitar memory leaks
        if (spyObserver) {
            spyObserver.disconnect();
            spyObserver = null;
        }

        // Desactivar Clases Visuales
        slideBackdrop.classList.add('opacity-0');
        slidePanel.classList.add('translate-x-full');

        // Esconder wrapper tras la transición
        setTimeout(() => {
            slideWrapper.classList.add('pointer-events-none');
        }, 500);

        // SCROLL-LOCK: Restaurar scroll del fondo
        document.body.style.overflow = '';

        // Restaurar lenis
        if (window.lenis && typeof window.lenis.start === 'function') {
            window.lenis.start();
        }
    };

    // ── Event Listeners ────────────────────────────────────────────

    // Botones "Explorar Metodología"
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceId = trigger.getAttribute('data-service');
            openSlideOver(serviceId);
        });
    });

    // Botón X y backdrop
    closeBtn.addEventListener('click', closeSlideOver);
    slideBackdrop.addEventListener('click', closeSlideOver);

    // Cerrar con Escape (desktop)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSlideOver();
    });

    // ── HISTORY API: interceptar el botón "Atrás" del navegador ────
    // Si el usuario presiona Back mientras el slide está abierto,
    // impedimos la navegación real y cerramos el panel.
    window.addEventListener('popstate', (event) => {
        if (isSlideOpen) {
            // El estado ya fue removido por el popstate; cerramos el panel
            closeSlideOver();
        }
    });

    // ── SWIPE-TO-CLOSE: Deslizar el panel hacia la derecha > 75px ──
    // Solo activo cuando el toque empieza dentro del panel negro.
    let touchStartX = 0;
    let touchStartY = 0;

    slidePanel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    slidePanel.addEventListener('touchend', (e) => {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);

        // Swipe horizontal intencional: >75px hacia la derecha
        // y el movimiento vertical es menor que el horizontal (no es un scroll)
        if (deltaX > 75 && deltaY < Math.abs(deltaX)) {
            // Si hay un estado en el historial, navegamos hacia atrás para limpiarlo
            // antes de cerrar, evitando que quede un estado huérfano
            if (isSlideOpen && window.history.state?.slideOpen) {
                window.history.back();
            } else {
                closeSlideOver();
            }
        }
    }, { passive: true });
}