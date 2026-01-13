const menuBtn = document.getElementById('menu-btn');
const menuItems = document.getElementById('menu-items');
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const line3 = document.getElementById('line3');

let isMenuOpen = false;

function toggleMenu() {
  isMenuOpen = !isMenuOpen;

  // 1. Mostrar/Ocultar el menú (Overlay)
  if (isMenuOpen) {
    // Abrir menú (Mobile)
    menuItems.classList.remove('opacity-0', 'pointer-events-none');
    
    // Animación de Burguer a "X"
    line1.classList.add('rotate-45', 'translate-y-2');
    line2.classList.add('opacity-0');
    line3.classList.add('-rotate-45', '-translate-y-2');
    
  } else {
    // Cerrar menú
    menuItems.classList.add('opacity-0', 'pointer-events-none');
    
    // Animación de "X" a Burguer
    line1.classList.remove('rotate-45', 'translate-y-2');
    line2.classList.remove('opacity-0');
    line3.classList.remove('-rotate-45', '-translate-y-2');
  }
}

// Evento Click
menuBtn.addEventListener('click', toggleMenu);

// Función extra: Cerrar menú al hacer click en un link (UX vital)
function closeMenu() {
  if (window.innerWidth < 768) { // Solo en móvil
    toggleMenu();
  }
}

/**
 * Lógica de Interacción Neutra
 * Maneja la expansión y colapso simétrico de los sectores.
 */

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.sector-card');

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Verificamos si la tarjeta ya está activa
            const isActive = card.classList.contains('is-active');

            // 1. Cerramos TODAS las tarjetas abiertas
            // Esto garantiza el efecto acordeón y limpia estados previos
            cards.forEach(c => {
                c.classList.remove('is-active');
            });

            // 2. Si la tarjeta clickeada NO estaba activa, la activamos
            // Si YA estaba activa, al haber hecho el remove general en el paso 1, 
            // el resultado es que se queda cerrada.
            if (!isActive) {
                card.classList.add('is-active');
            }
        });
    });
});
