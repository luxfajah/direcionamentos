/* 
   Alice Stoff - Creative Direction Brand Portal JS
   Interactive components: Navigation, Simulator, Checklist, Lightbox, Clipboard Copy
*/

// Image Data for Lightbox
const moodboardImages = [
    { src: 'assets/images/extracted_img_p7_1_X137.png', caption: 'Capa com Lettering de Destaque' },
    { src: 'assets/images/extracted_img_p7_2_X141.jpg', caption: 'Ambiente Acolhedor & Foco' },
    { src: 'assets/images/extracted_img_p7_3_X146.png', caption: 'Legenda Cursiva Destaque' },
    { src: 'assets/images/extracted_img_p7_4_X150.png', caption: 'Grifos e Legenda Laranja' },
    { src: 'assets/images/extracted_img_p7_5_X154.png', caption: 'Bloco de Texto 2-3 Palavras' },
    { src: 'assets/images/extracted_img_p7_6_X158.png', caption: 'Tipografia Editorial' },
    { src: 'assets/images/extracted_img_p7_7_X162.png', caption: 'Legenda Cursiva & Grifo' },
    { src: 'assets/images/extracted_img_p7_8_X166.png', caption: 'Finalização & Logo da Marca' }
];

let activeLightboxIndex = 0;

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSimulator();
    initChecklist();
    initLightboxKeyboard();
});

// 1. Navigation Logic
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            switchSection(targetId);
        });
    });
}

function switchSection(sectionId) {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    // Remove active class from all nav items
    navItems.forEach(item => item.classList.remove('active'));
    // Hide all sections
    sections.forEach(sec => sec.classList.remove('active'));

    // Find the current active item
    const activeNavItem = document.querySelector(`.nav-item[data-target="${sectionId}"]`);
    const activeSection = document.getElementById(sectionId);

    if (activeNavItem && activeSection) {
        activeNavItem.classList.add('active');
        activeSection.classList.add('active');
        // Scroll back to top of content area
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 2. Simulator Logic
function initSimulator() {
    const input = document.getElementById('simulator-input');
    const previewCosmo = document.getElementById('preview-cosmodrome');
    const previewAlbert = document.getElementById('preview-albertsans');

    if (input && previewCosmo && previewAlbert) {
        input.addEventListener('input', (e) => {
            const value = e.target.value.trim() === '' ? 'O essencial é invisível aos olhos.' : e.target.value;
            previewCosmo.textContent = value;
            previewAlbert.textContent = value;
        });
    }
}

// 3. Checklist of Quality Logic
function initChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const clearBtn = document.getElementById('btn-clear-checklist');
    
    // Load saved checklist states
    checkboxes.forEach(chk => {
        const id = chk.getAttribute('data-id');
        const isChecked = localStorage.getItem(`chk_${id}`) === 'true';
        chk.checked = isChecked;
        
        chk.addEventListener('change', () => {
            localStorage.setItem(`chk_${id}`, chk.checked);
            updateChecklistProgress();
        });
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Tem certeza de que deseja limpar todo o progresso do checklist?')) {
                checkboxes.forEach(chk => {
                    const id = chk.getAttribute('data-id');
                    chk.checked = false;
                    localStorage.removeItem(`chk_${id}`);
                });
                updateChecklistProgress();
            }
        });
    }

    updateChecklistProgress();
}

function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    if (checkboxes.length === 0) return;

    const total = checkboxes.length;
    let checkedCount = 0;

    checkboxes.forEach(chk => {
        if (chk.checked) checkedCount++;
    });

    const percent = Math.round((checkedCount / total) * 100);

    // Update Text
    const percentEl = document.getElementById('checklist-progress-percent');
    if (percentEl) percentEl.textContent = `${percent}%`;

    // Update Circle Ring (stroke-dashoffset)
    // 339.29 is the total circumference for radius=54
    const ring = document.getElementById('checklist-progress-ring');
    if (ring) {
        const circumference = 339.29;
        const offset = circumference - (percent / 100) * circumference;
        ring.style.strokeDashoffset = offset;
    }
}

// 4. Lightbox Gallery Logic
function openLightbox(index) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');

    if (modal && img && caption && moodboardImages[index]) {
        activeLightboxIndex = index;
        img.src = moodboardImages[index].src;
        caption.textContent = moodboardImages[index].caption;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore background scroll
    }
}

function changeLightboxSlide(dir) {
    let nextIndex = activeLightboxIndex + dir;
    if (nextIndex >= moodboardImages.length) {
        nextIndex = 0;
    } else if (nextIndex < 0) {
        nextIndex = moodboardImages.length - 1;
    }
    openLightbox(nextIndex);
}

function initLightboxKeyboard() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('lightbox-modal');
        if (modal && modal.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                changeLightboxSlide(1);
            } else if (e.key === 'ArrowLeft') {
                changeLightboxSlide(-1);
            }
        }
    });

    // Close lightbox when clicking outside the content image
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeLightbox();
            }
        });
    }
}

// 5. Copy Helpers
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message || 'Copiado com sucesso!';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
}

function copyColor(hex, element) {
    copyToClipboard(hex, () => {
        showToast(`Cor ${hex} copiada para a área de transferência!`);
        
        // Brief button animation feedback
        if (element) {
            element.style.transform = 'scale(0.95)';
            setTimeout(() => {
                element.style.transform = '';
            }, 150);
        }
    });
}

function copyText(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const text = element.textContent;
        copyToClipboard(text, () => {
            showToast('Código copiado para a área de transferência!');
        });
    }
}

function copyToClipboard(text, successCallback) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => {
                if (successCallback) successCallback();
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                fallbackCopyToClipboard(text, successCallback);
            });
    } else {
        fallbackCopyToClipboard(text, successCallback);
    }
}

function fallbackCopyToClipboard(text, successCallback) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Prevent scrolling
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful && successCallback) {
            successCallback();
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}
