import './style.css'

// Inicialización Centralizada
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSectorCards();
});

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