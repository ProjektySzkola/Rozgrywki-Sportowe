// navigation.js
function loadNavigation() {
    // Sprawdź czy nawigacja już istnieje
    if (document.querySelector('.navigation-header')) return;

    // Utwórz element style i dodaj go do head
    const style = document.createElement('style');
    style.textContent = `
        .navigation-loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 60px;
            background: linear-gradient(135deg, #4361ee, #3f37c9);
            z-index: 1000;
        }
        
        @media (max-width: 768px) {
            .navigation-loading {
                height: 56px;
            }
        }
    `;
    document.head.appendChild(style);

    // Tymczasowy pasek ładowania
    const loadingBar = document.createElement('div');
    loadingBar.className = 'navigation-loading';
    document.body.prepend(loadingBar);

    // Utwórz nagłówek
    const header = document.createElement('header');
    header.className = 'navigation-header';
    
    // Główna struktura nawigacji
    header.innerHTML = `
        <div class="navigation-container">
            <div class="navigation-logo-container">
                <img src="../cropped-logo-1.png" alt="Logo szkoły" class="navigation-logo-img">
                <a href="../index.html" class="navigation-logo">Szkolna Liga Sportowa</a>
            </div>
            
            <button class="navigation-toggle" aria-label="Menu" aria-expanded="false">
                <span class="navigation-toggle-bar"></span>
                <span class="navigation-toggle-bar"></span>
                <span class="navigation-toggle-bar"></span>
            </button>
            
            <div class="navigation-menu-wrapper">
                <ul class="navigation-menu">
                    <li class="navigation-item" data-section="koszykowka">
                        <button class="navigation-link navigation-dropdown-btn">Koszykówka</button>
                        <ul class="navigation-submenu">
                            <li class="navigation-subitem" data-page="wyniki"><a href="../koszykowka/wyniki.html" class="navigation-sublink">Wyniki</a></li>
                            <li class="navigation-subitem" data-page="terminarz"><a href="../koszykowka/terminarz.html" class="navigation-sublink">Terminarz</a></li>
                            <li class="navigation-subitem" data-page="zawodnicy"><a href="../koszykowka/zawodnicy.html" class="navigation-sublink">Zawodnicy</a></li>
                        </ul>
                    </li>
                    
                    <li class="navigation-item" data-section="siatkowka">
                        <button class="navigation-link navigation-dropdown-btn">Siatkówka</button>
                        <ul class="navigation-submenu">
                            <li class="navigation-subitem" data-page="wyniki"><a href="../siatkowka/wyniki.html" class="navigation-sublink">Wyniki</a></li>
                            <li class="navigation-subitem" data-page="terminarz"><a href="../siatkowka/terminarz.html" class="navigation-sublink">Terminarz</a></li>
                            <li class="navigation-subitem" data-page="zawodnicy"><a href="../siatkowka/zawodnicy.html" class="navigation-sublink">Zawodnicy</a></li>
                        </ul>
                    </li>
                    
                    <li class="navigation-item" data-page="dokumenty">
                        <a href="../dokumenty.html" class="navigation-link">Dokumenty</a>
                    </li>
                </ul>
            </div>
        </div>
    `;

    // Wstaw nagłówek na stronę
    document.body.insertBefore(header, document.body.firstChild);
    loadingBar.remove();

    // Załaduj CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../navigation.css';
    document.head.appendChild(link);

    // Funkcja do ustawiania aktywnych elementów
    function setActiveElements() {
        const path = window.location.pathname;
        const isIndex = path.endsWith('/') || path.endsWith('index.html') || path.split('/').filter(Boolean).length === 0;
        const pathParts = path.split('/').filter(part => part && !part.endsWith('.html'));
        const currentPage = path.split('/').pop() || 'index.html';

        // Reset wszystkie aktywne elementy
        document.querySelectorAll('.navigation-item.active, .navigation-subitem.active').forEach(el => {
            el.classList.remove('active');
        });

        // Strona główna
        if (isIndex) return;

        // Dokumenty
        if (currentPage === 'dokumenty.html') {
            const item = document.querySelector('.navigation-item[data-page="dokumenty"]');
            if (item) item.classList.add('active');
            return;
        }

        // Podstrony
        const section = pathParts[0];
        const pageType = currentPage.replace('.html', '');

        if (section && pageType) {
            const subitem = document.querySelector(`.navigation-item[data-section="${section}"] .navigation-subitem[data-page="${pageType}"]`);
            
            if (subitem) {
                subitem.classList.add('active');
                const parentItem = subitem.closest('.navigation-item');
                if (parentItem) {
                    parentItem.classList.add('active');
                    // Otwórz submenu jeśli jesteśmy na mobile
                    if (window.innerWidth <= 992) {
                        const submenu = parentItem.querySelector('.navigation-submenu');
                        if (submenu) submenu.style.maxHeight = submenu.scrollHeight + 'px';
                    }
                }
            }
        }
    }

    // Obsługa menu mobilnego
    function setupMobileMenu() {
        const toggle = document.querySelector('.navigation-toggle');
        const menuWrapper = document.querySelector('.navigation-menu-wrapper');
        const menu = document.querySelector('.navigation-menu');
        const dropdownBtns = document.querySelectorAll('.navigation-dropdown-btn');
        const isMobile = window.innerWidth <= 992;

        if (toggle && menu) {
            // Toggle menu główne
            const toggleMenu = (show) => {
                const isExpanded = show ?? toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
                toggle.classList.toggle('active', !isExpanded);
                menuWrapper.classList.toggle('active', !isExpanded);
                
                if (!isExpanded) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            };

            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMenu();
            });

            // Obsługa dropdownów na mobile
            dropdownBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    if (!isMobile) return;
                    
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const parentItem = this.closest('.navigation-item');
                    const submenu = parentItem.querySelector('.navigation-submenu');
                    const isOpen = submenu.style.maxHeight;
                    
                    // Zamknij wszystkie inne submenu
                    document.querySelectorAll('.navigation-submenu').forEach(sm => {
                        if (sm !== submenu) sm.style.maxHeight = null;
                    });
                    
                    // Toggle aktualne submenu
                    submenu.style.maxHeight = isOpen ? null : submenu.scrollHeight + 'px';
                    parentItem.classList.toggle('submenu-open', !isOpen);
                });
            });

            // Zamknij menu po kliknięciu na link (dla mobile)
            document.querySelectorAll('.navigation-sublink').forEach(link => {
                link.addEventListener('click', () => {
                    if (isMobile) {
                        toggleMenu(false);
                        document.body.style.overflow = '';
                    }
                });
            });

            // Zamknij menu po kliknięciu poza nim
            document.addEventListener('click', (e) => {
                if (!menuWrapper.contains(e.target)) {
                    toggleMenu(false);
                    document.body.style.overflow = '';
                }
            });

            // Zamknij menu po zmianie orientacji
            window.addEventListener('orientationchange', () => {
                if (window.innerWidth > 992) {
                    toggleMenu(false);
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // Inicjalizacja
    setActiveElements();
    setupMobileMenu();

    // Obsługa zmian rozmiaru okna
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setupMobileMenu();
            
            // Automatyczne zamknięcie menu na desktop
            if (window.innerWidth > 992) {
                const toggle = document.querySelector('.navigation-toggle');
                const menuWrapper = document.querySelector('.navigation-menu-wrapper');
                
                if (toggle && menuWrapper) {
                    menuWrapper.classList.remove('active');
                    toggle.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                    document.querySelectorAll('.navigation-submenu').forEach(submenu => {
                        submenu.style.maxHeight = null;
                    });
                    document.body.style.overflow = '';
                }
            }
        }, 100);
    });
}

// Uruchom po załadowaniu DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavigation);
} else {
    loadNavigation();
}