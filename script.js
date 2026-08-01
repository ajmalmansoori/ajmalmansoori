// ==============================
// Smooth Scrolling
// ==============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

// ==============================
// Navbar Scroll Effect
// ==============================
window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.style.background = "rgba(10,10,10,.98)";
        navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,.4)";
    } else {
        navbar.style.background = "rgba(10,10,10,.95)";
        navbar.style.boxShadow = "none";
    }

});

// ==============================
// Browse Premium Slider
// ==============================

const swiper = new Swiper(".browseSwiper", {

    slidesPerView: 1.2,
    spaceBetween: 25,
    loop: true,
    speed: 700,
    grabCursor: true,

    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },

    navigation: {
        nextEl: "#next",
        prevEl: "#prev",
    },

    breakpoints: {

        768: {
            slidesPerView: 2,
        },

        1200: {
            slidesPerView: 3,
        }

    }

});
