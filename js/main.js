// Aguarda o DOM (estrutura HTML) estar completamente carregado
document.addEventListener('DOMContentLoaded', function() {

    // Atualiza o ano no rodapé
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) { // Verifica se o elemento existe
        yearSpan.textContent = new Date().getFullYear();
    }

    // Aqui adicionaremos outras funcionalidades JS depois (ex: menu mobile, acessibilidade A+/A-)

}); // Fim do DOMContentLoaded'

document.addEventListener('DOMContentLoaded', function() {

    // --- Código do Menu Mobile Principal ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('is-active');
            menuToggle.classList.toggle('is-active');
            menuToggle.setAttribute('aria-expanded', mainNav.classList.contains('is-active'));

            // Fecha submenus ao fechar o menu principal (opcional, mas bom)
            closeAllSubmenus(mainNav);
        });
    }

    // --- Código do Submenu Mobile ---
    const submenuToggles = mainNav.querySelectorAll('.has-submenu .submenu-toggle');

    submenuToggles.forEach(toggle => {
        const subMenu = toggle.closest('.has-submenu').querySelector('.submenu');
        const parentLink = toggle.closest('a'); // Link pai que contém o botão

        if (subMenu) {
            // Ação ao clicar no botão +/-
            toggle.addEventListener('click', function(event) {
                event.preventDefault(); // Impede o link pai de navegar (se tiver href)
                event.stopPropagation(); // Impede que o clique feche o menu principal

                const isOpen = subMenu.classList.toggle('submenu-active');
                toggle.classList.toggle('is-active');
                toggle.setAttribute('aria-expanded', isOpen);

                 // Fecha outros submenus abertos (opcional)
                 // closeAllSubmenus(mainNav, subMenu);
            });

            // Impedir que clicar no link pai feche o menu no mobile (se o botão for usado)
             if (parentLink) {
                 parentLink.addEventListener('click', function(event){
                     // Só impede o link no modo mobile (quando o toggle é visível)
                     if (window.getComputedStyle(toggle).display !== 'none') {
                         event.preventDefault();
                         // Talvez disparar o clique no botão?
                          toggle.click();
                     }
                 });
             }
        }
    });

    // Função para fechar todos os submenus (útil ao fechar o menu principal)
    function closeAllSubmenus(navContainer, exceptThisSubmenu = null) {
        const openSubmenus = navContainer.querySelectorAll('.submenu.submenu-active');
        openSubmenus.forEach(submenu => {
            if (submenu !== exceptThisSubmenu) {
                submenu.classList.remove('submenu-active');
                const toggle = submenu.closest('.has-submenu').querySelector('.submenu-toggle');
                if (toggle) {
                    toggle.classList.remove('is-active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }


    // --- Atualiza o ano no rodapé ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

}); // Fim do DOMContentLoaded
// Aguarda o DOM estar carregado
document.addEventListener('DOMContentLoaded', function() {

    // ... (código do ano e menu mobile aqui) ...

    // --- CÓDIGO DE ACESSIBILIDADE - TAMANHO DA FONTE ---

    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    // Vamos alterar o font-size do elemento <main>
    // Poderia ser 'body' também, mas 'main' afeta mais o conteúdo principal.
    const contentArea = document.querySelector('main');

    // Valores de controle
    const step = 0.1; // Quanto aumentar/diminuir (em 'em') a cada clique
    const minSize = 0.8; // Tamanho mínimo relativo (0.8em)
    const maxSize = 1.5; // Tamanho máximo relativo (1.5em)
    const storageKey = 'fontSizePreference'; // Chave para salvar no localStorage

    // Função para aplicar o tamanho da fonte
    function applyFontSize(size) {
        if (contentArea) {
            // Adiciona uma classe para sabermos que a fonte foi alterada
            document.body.classList.add('font-size-adjusted');
            // Define o font-size no elemento <main>
            contentArea.style.fontSize = size + 'em';
            // Salva no localStorage
            localStorage.setItem(storageKey, size);
        }
    }

    // Função para obter o tamanho atual ou o padrão
    function getCurrentSize() {
        let currentSize = 1; // Tamanho padrão (1em)
        if (contentArea) {
            const currentStyle = window.getComputedStyle(contentArea).fontSize;
            // Se já tiver um estilo inline, usa ele, senão calcula a partir do px
             if (contentArea.style.fontSize && contentArea.style.fontSize.includes('em')) {
                 currentSize = parseFloat(contentArea.style.fontSize);
             } else if (currentStyle.includes('px')) {
                 // Calcula o 'em' relativo ao 'font-size' do pai (body, geralmente 16px)
                 const parentFontSize = parseFloat(window.getComputedStyle(contentArea.parentElement).fontSize);
                 currentSize = parseFloat(currentStyle) / parentFontSize;
             }
             // Arredonda para evitar problemas com floats muito pequenos
             currentSize = Math.round(currentSize * 100) / 100;
        }
        return isNaN(currentSize) ? 1 : currentSize; // Retorna 1 se der erro
    }

    // Carrega a preferência salva ao carregar a página
    const savedSize = localStorage.getItem(storageKey);
    if (savedSize && contentArea) {
        // Aplica o tamanho salvo, respeitando os limites
        const initialSize = Math.max(minSize, Math.min(parseFloat(savedSize), maxSize));
         applyFontSize(initialSize);
    }


    // Evento para aumentar a fonte
    if (increaseFontBtn && contentArea) {
        increaseFontBtn.addEventListener('click', function() {
            let currentSize = getCurrentSize();
            let newSize = Math.round((currentSize + step) * 100) / 100; // Calcula e arredonda
            // Aplica o novo tamanho se não ultrapassar o máximo
            if (newSize <= maxSize) {
                applyFontSize(newSize);
            } else {
                 applyFontSize(maxSize); // Aplica o máximo se tentar passar
            }
        });
    }

    // Evento para diminuir a fonte
    if (decreaseFontBtn && contentArea) {
        decreaseFontBtn.addEventListener('click', function() {
            let currentSize = getCurrentSize();
            let newSize = Math.round((currentSize - step) * 100) / 100; // Calcula e arredonda
             // Aplica o novo tamanho se não for menor que o mínimo
            if (newSize >= minSize) {
                applyFontSize(newSize);
            } else {
                 applyFontSize(minSize); // Aplica o mínimo se tentar passar
            }
        });
    }

    // --- FIM DO CÓDIGO DE ACESSIBILIDADE ---

}); // Fim do DOMContentLoaded