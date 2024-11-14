function showPage(pageId) {
    // Tüm sayfaları gizle
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.add('hidden'));

    // Seçilen sayfayı göster
    document.getElementById(pageId).classList.remove('hidden');
}
