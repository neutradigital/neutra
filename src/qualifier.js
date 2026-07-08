document.addEventListener('DOMContentLoaded', () => {
  const openBtns = document.querySelectorAll('.js-open-qualifier');
  const modal = document.getElementById('qualifier-modal');
  const closeBtn = document.getElementById('close-qualifier');
  const contentArea = document.getElementById('qualifier-content');
  const progressBar = document.getElementById('qualifier-progress');
  
  let currentStep = 0;
  
  let leadData = {
    sector: (window.location.pathname.includes('real-estate') || window.location.pathname.includes('architecture')) ? 'Arquitectura' : 'Automotriz',
    company: '',
    value: '',
    improvement: '',
    name: '',
    whatsapp: '',
    availability: ''
  };
  
  const isArchitecture = leadData.sector === 'Arquitectura';
  
  const questions = {
    q1: { label: isArchitecture ? "Nombre de la Inmobiliaria, Desarrollo o Firma Arquitectónica." : "Nombre del Concesionario o Lote Deportivo.", type: "text", key: "company" },
    q2: { label: isArchitecture ? "¿Cuál es el valor promedio de las propiedades?" : "¿Cuál es el valor promedio de las unidades?", options: isArchitecture ? ["Menor a $2M MXN", "$2M - $6M MXN", "Mayor a $6M MXN"] : ["Menor a $600k MXN", "$600k - $1.5M MXN", "Mayor a $1.5M MXN"], key: "value" },
    q3: { label: isArchitecture ? "¿Qué crees que podría mejorar del aspecto visual de cómo presentas tus propiedades o proyectos en redes sociales y/o sitio web?" : "¿Qué crees que podría mejorar del aspecto visual de cómo presentas tus unidades o inventario en redes sociales y/o sitio web?", type: "textarea", key: "improvement" }
  };

  const deliverables = isArchitecture 
    ? "1 video editado y 15 fotos de la propiedad (general y detalles)" 
    : "1 video editado y 15 fotos de la unidad (general y detalles)";

  const steps = [
    // Paso 0: Identidad
    () => renderInput(questions.q1.label, questions.q1.type, "Siguiente →", questions.q1.key),
    
    // Paso 1: Magnitud
    () => renderOptions(questions.q2.label, questions.q2.options, questions.q2.key),
    
    // Paso 2: Diagnóstico
    () => renderInput(questions.q3.label, questions.q3.type, "Evaluar Caso →", questions.q3.key),
    
    // Paso 3: Filtro de Ego
    () => `
      <span class="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase block mb-4">DIAGNÓSTICO TÁCTICO</span>
      <h3 class="text-3xl md:text-4xl font-light text-white mb-10 leading-tight">¿Consideras que la estética visual actual de tu inventario está atrayendo a curiosos en lugar de compradores de alto perfil?</h3>
      <div class="flex flex-col gap-4">
        <button onclick="nextStep()" class="w-full py-5 border border-gray-700 text-white hover:bg-white hover:text-black transition-colors text-sm uppercase tracking-widest font-bold">Sí, hay un problema visual evidente</button>
        <button onclick="rejectUser()" class="w-full py-5 border border-gray-800 text-gray-500 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold">No, mi material ya atrae al cliente ideal</button>
      </div>
    `,
    
    // Paso 4: Intersticial de Autoridad
    () => `
      <div class="relative w-full py-20 flex flex-col items-center justify-center border border-white/10 bg-[#21222e] overflow-hidden">
        <div class="absolute bottom-0 left-0 w-full h-1/2 bg-white/5" style="clip-path: polygon(0 100%, 100% 100%, 100% 0, 0 80%);"></div>
        <div class="relative z-10 text-center px-8">
          <span class="text-6xl md:text-8xl font-light text-white block mb-4">85%</span>
          <p class="text-gray-400 text-lg max-w-md mx-auto font-light leading-relaxed mb-8">De las decisiones de compra en high-ticket se justifican en los primeros 3 segundos de percepción visual. Si el activo no proyecta estatus inmediatamente, el cliente entra en modo de regateo.</p>
          <button onclick="nextStep()" class="bg-white text-black text-xs font-bold tracking-widest uppercase py-4 px-10 hover:bg-gray-200 transition-colors">ENTENDIDO →</button>
        </div>
      </div>
    `,
    
    // Paso 5: Cierre Especial + WhatsApp Directo
    () => `
      <span class="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase block mb-4">RESOLUCIÓN DE ESTATUS</span>
      <h3 class="text-3xl md:text-4xl font-light italic text-white mb-4 leading-tight">Laboratorio Maestro: Selección Oficial</h3>
      <p class="text-gray-400 text-sm md:text-base font-light leading-relaxed mb-8">Neutra absorberá el 100% de los honorarios de dirección cinematográfica a cambio de poder mostrar el proyecto en nuestra web y redes sociales como caso de estudio. Tu única inversión cubre el despliegue operativo (<span class="text-white font-bold">$2,500 MXN</span>) e incluye: <span class="text-white">${deliverables}</span>.</p>
      
      <div class="flex flex-col gap-6 text-left mb-8">
        <div>
          <input type="text" id="contact-name" class="w-full bg-transparent border-b border-gray-700 text-white text-lg py-3 focus:outline-none focus:border-white transition-colors" placeholder="Tu nombre y cargo (Ej. Director Comercial)">
        </div>
        <div>
          <input type="tel" id="contact-phone" class="w-full bg-transparent border-b border-gray-700 text-white text-lg py-3 focus:outline-none focus:border-white transition-colors" placeholder="WhatsApp Directo">
        </div>
        <div>
          <input type="text" id="contact-time" class="w-full bg-transparent border-b border-gray-700 text-white text-lg py-3 focus:outline-none focus:border-white transition-colors" placeholder="Día y hora de preferencia para contacto">
        </div>
        <button onclick="submitForm()" id="submit-btn" class="mt-4 w-full py-5 bg-white text-black hover:bg-gray-200 transition-colors text-sm uppercase tracking-widest font-bold">ENVIAR POSTULACIÓN →</button>
      </div>

      <div class="pt-6 border-t border-gray-800 text-center">
        <span class="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">¿Prioridad Operativa? Comunícate sin espera:</span>
        <a href="https://wa.me/522221978263" target="_blank" class="text-white hover:text-gray-300 font-bold tracking-widest text-sm transition-colors">
          LÍNEA DIRECTA: +52 222 197 8263
        </a>
      </div>
    `
  ];

  function renderInput(label, type, btnText, dataKey) {
    const inputHtml = type === 'textarea' 
      ? `<textarea id="input-val" rows="3" class="w-full bg-transparent border-b border-gray-700 text-white text-xl py-4 focus:outline-none focus:border-white transition-colors resize-none" placeholder="Escribe aquí..."></textarea>`
      : `<input type="text" id="input-val" class="w-full bg-transparent border-b border-gray-700 text-white text-2xl py-4 focus:outline-none focus:border-white transition-colors" placeholder="Escribe aquí...">`;
    return `
      <h3 class="text-2xl md:text-4xl font-light text-white mb-10 leading-tight">${label}</h3>
      ${inputHtml}
      <button onclick="saveAndNext('${dataKey}')" class="mt-12 w-full py-5 border border-white text-white hover:bg-white hover:text-black transition-colors text-sm uppercase tracking-widest font-bold">${btnText}</button>
    `;
  }

  function renderOptions(label, options, dataKey) {
    const btns = options.map(opt => `<button onclick="saveOptionAndNext('${dataKey}', '${opt}')" class="w-full text-left py-5 px-6 border border-gray-700 text-gray-300 hover:border-white hover:text-white transition-colors text-lg font-light mb-4">${opt}</button>`).join('');
    return `
      <h3 class="text-2xl md:text-4xl font-light text-white mb-10 leading-tight">${label}</h3>
      <div class="flex flex-col">${btns}</div>
    `;
  }

  window.saveAndNext = (key) => {
    const val = document.getElementById('input-val').value;
    if (!val.trim()) return;
    leadData[key] = val;
    nextStep();
  };

  window.saveOptionAndNext = (key, val) => {
    leadData[key] = val;
    nextStep();
  };

  window.nextStep = () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateUI();
    }
  };

  window.rejectUser = () => {
    contentArea.innerHTML = `
      <div class="text-center">
        <h3 class="text-3xl font-light text-white mb-6">Auditoría Finalizada</h3>
        <p class="text-gray-400 text-lg font-light">Tu ecosistema visual está optimizado. No requieres la intervención de nuestro Laboratorio Maestro en este momento. Gracias por tu tiempo.</p>
        <button onclick="closeModal()" class="mt-10 text-xs font-bold tracking-widest uppercase text-white hover:text-gray-500 transition-colors border-b border-white pb-1">CERRAR SESIÓN</button>
      </div>
    `;
  };

  window.submitForm = async () => {
    const name = document.getElementById('contact-name').value;
    const phone = document.getElementById('contact-phone').value;
    const time = document.getElementById('contact-time').value;
    
    if (!name || !phone || !time) {
      alert('Por favor, completa todos los campos para la evaluación.');
      return;
    }
    
    leadData.name = name;
    leadData.whatsapp = phone;
    leadData.availability = time;
    
    const btn = document.getElementById('submit-btn');
    btn.innerText = 'ENVIANDO POSTULACIÓN...';
    btn.disabled = true;

    try {
      const ENDPOINT_URL = 'https://formspree.io/f/mykqljnl'; 
      
      const response = await fetch(ENDPOINT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(leadData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Error HTTP ${response.status}`);
      }
      
      contentArea.innerHTML = `
        <div class="text-center py-10">
          <span class="text-5xl mb-6 block text-white">✓</span>
          <h3 class="text-3xl font-light text-white mb-6">Postulación Recibida</h3>
          <p class="text-gray-400 text-lg font-light max-w-md mx-auto mb-10">Hemos capturado los datos de tu inventario. Evaluaremos la viabilidad operativa y nos pondremos en contacto por WhatsApp si tu activo es seleccionado.</p>
          <a href="https://wa.me/522221978263" target="_blank" class="block w-full py-4 border border-white text-white hover:bg-white hover:text-black transition-colors text-xs font-bold tracking-widest uppercase mb-4">COMUNICACIÓN DIRECTA CON DIRECCIÓN</a>
          <button onclick="closeModal()" class="text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-white transition-colors">CERRAR SESIÓN</button>
        </div>
      `;
    } catch (error) {
      console.error('Error enviando a Formspree:', error);
      alert('Error al enviar la postulación: ' + error.message);
      btn.innerText = 'ERROR. INTENTAR DE NUEVO';
      btn.disabled = false;
    }
  };

  window.closeModal = () => {
    modal.classList.remove('opacity-100');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 500);
  };

  function updateUI() {
    contentArea.classList.remove('translate-y-0', 'opacity-100');
    contentArea.classList.add('translate-y-4', 'opacity-0');
    
    setTimeout(() => {
      contentArea.innerHTML = steps[currentStep]();
      progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
      
      requestAnimationFrame(() => {
        contentArea.classList.remove('translate-y-4', 'opacity-0');
        contentArea.classList.add('translate-y-0', 'opacity-100');
      });
    }, 400); 
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentStep = 0;
      leadData = { sector: isArchitecture ? 'Arquitectura' : 'Automotriz', company: '', value: '', improvement: '', name: '', whatsapp: '', availability: '' };
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      requestAnimationFrame(() => {
        modal.classList.add('opacity-100');
        updateUI();
      });
    });
  });

  closeBtn.addEventListener('click', closeModal);
});
