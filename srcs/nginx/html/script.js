function showPage(pageId) {
    // Tüm sayfaları gizle
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.add('d-none'));

    // Seçilen sayfayı göster
    document.getElementById(pageId).classList.remove('d-none');

    // Navbar menüsünü mobilde kapat
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarToggler && navbarCollapse.classList.contains('show')) {
        navbarToggler.click();
    }
}
