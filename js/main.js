document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Menu Mobile Hamburger ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            hamburger.classList.toggle("open");
        });
    }

    // --- 2. Animação ao Scroll (Intersection Observer) ---
    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                
                // Disparar contadores se estiverem visíveis nesta área
                const counters = entry.target.querySelectorAll(".counter");
                counters.forEach(counter => runCounter(counter));
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));

    // --- 3. Contadores Animados ---
    function runCounter(element) {
        if (element.classList.contains('started')) return;
        element.classList.add('started');
        
        const target = +element.getAttribute("data-target");
        const duration = 2000; // 2 segundos
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime < duration) {
                const progress = elapsedTime / duration;
                const currentVal = Math.floor(progress * target);
                element.innerText = currentVal.toLocaleString("pt-BR") + "+";
                requestAnimationFrame(updateNumber);
            } else {
                element.innerText = target.toLocaleString("pt-BR") + "+";
            }
        }
        requestAnimationFrame(updateNumber);
    }

    // --- 4. Lightbox da Galeria ---
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeLightbox = document.getElementById("lightbox-close");
    
    document.querySelectorAll(".gallery-thumb").forEach(img => {
        img.addEventListener("click", () => {
            lightbox.classList.add("active");
            lightboxImg.src = img.src;
        });
    });

    if (closeLightbox) {
        closeLightbox.addEventListener("click", () => lightbox.classList.remove("active"));
        lightbox.addEventListener("click", (e) => {
            if (e.target !== lightboxImg) lightbox.classList.remove("active");
        });
    }

    // --- 5. Accordion (FAQ) ---
    document.querySelectorAll(".accordion-header").forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // --- 6. Carrossel de Depoimentos ---
    const track = document.querySelector(".carousel-track");
    if (track) {
        const slides = Array.from(track.children);
        let currentIndex = 0;
        
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }, 5000);
    }

    // --- 7. Validação de Formulários e Disparo WhatsApp ---
    const formatWhatsAppMsg = (texto) => encodeURIComponent(texto);
    const numWhatsapp = "5511999999999";

    // Form Franquia
    const franchiseForm = document.getElementById("franchiseForm");
    if(franchiseForm) {
        franchiseForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nome = document.getElementById("fran-nome").value;
            const tel = document.getElementById("fran-tel").value;
            const email = document.getElementById("fran-email").value;
            const cidade = document.getElementById("fran-cidade").value;
            const msg = document.getElementById("fran-msg").value;

            const textoFinal = `Olá! Recebi seu interesse em franquia. Dados:\nNome: ${nome}\nTelefone: ${tel}\nEmail: ${email}\nCidade: ${cidade}\nMensagem: ${msg}`;
            window.open(`https://wa.me/${numWhatsapp}?text=${formatWhatsAppMsg(textoFinal)}`, '_blank');
            showToast("Mensagem de Franquia gerada com sucesso!");
            franchiseForm.reset();
        });
    }

    // Form Contato
    const contactForm = document.getElementById("contactForm");
    if(contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nome = document.getElementById("ct-nome").value;
            const email = document.getElementById("ct-email").value;
            const assunto = document.getElementById("ct-assunto").value;
            const msg = document.getElementById("ct-msg").value;

            const textoFinal = `Contato Quero Lavar:\nNome: ${nome}\nEmail: ${email}\nAssunto: ${assunto}\nMensagem: ${msg}`;
            window.open(`https://wa.me/${numWhatsapp}?text=${formatWhatsAppMsg(textoFinal)}`, '_blank');
            showToast("Mensagem de contato enviada!");
            contactForm.reset();
        });
    }

    function showToast(mensagem) {
        const toast = document.getElementById("toast");
        if(toast) {
            toast.innerText = mensagem;
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 3500);
        }
    }
});

// --- 8. Engine Dinâmico da Calculadora ---
let calcDados = { pessoas: 1, lavagens: 1 };

window.increment = function(tipo) {
    if (tipo === 'pessoas' && calcDados.pessoas < 10) calcDados.pessoas++;
    if (tipo === 'lavagens' && calcDados.lavagens < 7) calcDados.lavagens++;
    updateCalcUI();
}

window.decrement = function(tipo) {
    if (tipo === 'pessoas' && calcDados.pessoas > 1) calcDados.pessoas--;
    if (tipo === 'lavagens' && calcDados.lavagens > 1) calcDados.lavagens--;
    updateCalcUI();
}

function updateCalcUI() {
    document.getElementById("val-pessoas").innerText = calcDados.pessoas;
    document.getElementById("val-lavagens").innerText = calcDados.lavagens;
    
    // Fórmula: (40 - 25) * lavagens/semana * 4 * pessoas
    const economia = (40 - 25) * calcDados.lavagens * 4 * calcDados.pessoas;
    document.getElementById("total-economia").innerText = economia.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
