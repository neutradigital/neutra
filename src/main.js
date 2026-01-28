import './style.css'


// Inicialización Centralizada
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initMobileMenu();
    initSectorCards();
    initCustomCursor();
    initContactForm();
});


const lenis = new Lenis({
    duration: 1.2, // Duración de la inercia (1.2s es el estándar "luxury")
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva exponencial suave
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false, // Recomendado false en móviles para mantener sensación nativa
    touchMultiplier: 2,
});

// Loop de animación (Necesario para que Lenis funcione)
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. INTEGRACIÓN GSAP + SCROLLTRIGGER
gsap.registerPlugin(ScrollTrigger);

// Sincronización Lenis-ScrollTrigger (VITAL para evitar lags visuales)
// Le dice a ScrollTrigger que use el scroll suave de Lenis como referencia
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// 3. SISTEMA DE ANIMACIONES ("NEUTRA MOTION")

// 3. SISTEMA DE ANIMACIONES ("NEUTRA MOTION" - STABLE VERSION)

// 3. SISTEMA DE ANIMACIONES ("NEUTRA MOTION" - STABLE MOBILE)

function initAnimations() {
    
    // A. REVEAL BÁSICO (Fade Up - Funciona en Mobile y Desktop)
    // Esto SÍ lo queremos en móvil porque se ve elegante al entrar
    const revealElements = document.querySelectorAll('h1, h2, h3, p, button, .js-sector-card');
    
    revealElements.forEach(element => {
        gsap.fromTo(element, 
            { 
                y: 50, 
                opacity: 0, 
                willChange: "transform" 
            },
            {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%", 
                    toggleActions: "play none none none",
                    once: true
                },
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out"
            }
        );
    });

    // B. PARALLAX EN IMÁGENES (SOLO DESKTOP)
    // Aquí está la corrección: Envolvemos esto en un 'if'
    if (window.innerWidth > 1024) {
        
        const parallaxImages = document.querySelectorAll('img');
        
        parallaxImages.forEach(img => {
            // Verificamos si es una imagen que debe tener efecto
            if(img.closest('.js-sector-card') || img.closest('#selectedw')) {
                gsap.fromTo(img,
                    { y: -30 }, 
                    {
                        y: 30, 
                        scrollTrigger: {
                            trigger: img.parentElement,
                            scrub: true 
                        },
                        ease: "none"
                    }
                );
            }
        });
    }
    
    // C. LÍNEAS DE SEPARACIÓN (Funciona en ambos)
    const lines = document.querySelectorAll('.h-px, .border-t, .border-b');
    lines.forEach(line => {
        gsap.fromTo(line,
            { scaleX: 0, transformOrigin: "left center" }, 
            {
                scaleX: 1, 
                scrollTrigger: {
                    trigger: line,
                    start: "top 90%",
                    toggleActions: "play none none none",
                    once: true
                },
                duration: 1.5,
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

    // Limpieza al redimensionar: Si pasan a Desktop, quitamos la clase expandida
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1025) {
            cards.forEach(c => c.classList.remove('is-expanded'));
        }
    });
}

function initCustomCursor() {
    // Solo activar en Desktop (> 1024px)
    if (window.innerWidth < 1025) return;

    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');

    // Posición del mouse (Objetivo)
    let mouse = { x: 0, y: 0 };
    // Posición del círculo grande (Actual con retraso)
    let outlinePos = { x: 0, y: 0 };

    // 1. Rastrear movimiento del mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // El punto pequeño se mueve instantáneamente (CSS se encarga del translate -50%)
        dot.style.left = `${mouse.x}px`;
        dot.style.top = `${mouse.y}px`;
        
        // Hack para que aparezcan si estaban ocultos al cargar
        dot.style.opacity = 1;
        outline.style.opacity = 1;
    });

    // 2. Animación fluida (Loop de física)
    const animateCursor = () => {
        // Fórmula LERP: Posición Actual += (Objetivo - Actual) * Velocidad (0.1 = lento, 0.2 = rápido)
        outlinePos.x += (mouse.x - outlinePos.x) * 0.15;
        outlinePos.y += (mouse.y - outlinePos.y) * 0.15;

        outline.style.left = `${outlinePos.x}px`;
        outline.style.top = `${outlinePos.y}px`;

        requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // 3. Detectar elementos interactivos (Links, Botones, Cards)
    // Seleccionamos todo lo que debería activar el cursor
    const interactiveElements = document.querySelectorAll('a, button, .js-sector-card, input, textarea');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });
}

function initContactForm() {
    const form = document.getElementById('project-form');
    const result = document.getElementById('form-result');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');

    if (!form) return;

    form.addEventListener('submit', function(e) {
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