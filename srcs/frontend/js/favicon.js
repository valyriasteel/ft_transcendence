// Favicon animasyonu için çerçeve listesi
const frames = ["../ico/favicon-1.png", "../ico/favicon-2.png", "../ico/favicon-3.png", "../ico/favicon-4.png", "../ico/favicon-5.png", "../ico/favicon-6.png", "../ico/favicon-7.png", "../ico/favicon-8.png", "../ico/favicon-9.png", "../ico/favicon-10.png", "../ico/favicon-11.png", "../ico/favicon-12.png", "../ico/favicon-13.png", "../ico/favicon-14.png", "../ico/favicon-15.png"];
let currentFrame = 0;

function animateFavicon() {
    const favicon = document.getElementById("dynamic-favicon");
    if (favicon) {
        favicon.href = frames[currentFrame];
        currentFrame = (currentFrame + 1) % frames.length;
    }
    setTimeout(animateFavicon, 200); // 200ms'de bir değiştir
}

window.onload = animateFavicon;
