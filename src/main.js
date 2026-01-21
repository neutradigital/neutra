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
        card.addEventListener('click', function(e) {
            // Detenemos cualquier otro evento que pueda interferir
            e.stopPropagation();
            
            const isAlreadyActive = this.classList.contains('is-active');

            // 1. Limpieza total de todas las tarjetas
            cards.forEach(c => {
                c.classList.remove('is-active');
                // Esto fuerza al navegador a resetear la altura si se quedó "trabado"
                c.style.height = ''; 
            });

            // 2. Activación si corresponde
            if (!isAlreadyActive) {
                this.classList.add('is-active');
            }
        });
    });
});


const track = document.getElementById('track');
const items = document.querySelectorAll('.carousel-item');

const updateFocus = () => {
  const containerCenter = track.getBoundingClientRect().left + track.offsetWidth / 2;
  
  items.forEach(item => {
    const itemCenter = item.getBoundingClientRect().left + item.offsetWidth / 2;
    const distance = Math.abs(containerCenter - itemCenter);
    
    // Si el elemento está cerca del centro (umbral de 100px)
    if (distance < 150) {
      item.classList.add('is-active');
    } else {
      item.classList.remove('is-active');
    }
  });
};

const handleInfinite = () => {
  const scrollPos = track.scrollLeft;
  const maxScroll = track.scrollWidth - track.offsetWidth;

  if (scrollPos <= 0) {
    track.scrollLeft = maxScroll / 2;
  } else if (scrollPos >= maxScroll) {
    track.scrollLeft = maxScroll / 2;
  }
};

track.addEventListener('scroll', () => {
  updateFocus();
  handleInfinite();
});

// Inicialización
window.onload = () => {
  track.scrollLeft = (track.scrollWidth - track.offsetWidth) / 2;
  updateFocus();
};
