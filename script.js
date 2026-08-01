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

// ======================================
// PREMIUM BROWSE SWIPER
// ======================================

const browseSwiper = new Swiper(".browseSwiper", {

    loop: true,
    speed: 800,
    grabCursor: true,
    centeredSlides: false,

    spaceBetween: 28,

    slidesPerView: 1.15,

    autoplay: {

        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,

    },

    navigation: {

        nextEl: "#next",
        prevEl: "#prev",

    },

    pagination: {

        el: ".swiper-pagination",
        clickable: true,

    },

    breakpoints: {

        576: {

            slidesPerView: 1.4,

        },

        768: {

            slidesPerView: 2,

        },

        992: {

            slidesPerView: 3,

        },

        1200: {

            slidesPerView: 4,

        },

        1600: {

            slidesPerView: 5,

        }

    }

});
// ==============================
// Feature Slider
// ==============================

const featureSwiper = new Swiper(".featureSwiper", {

    slidesPerView: 1.2,
    spaceBetween: 25,
    loop: true,
    speed: 700,
    grabCursor: true,

    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },

    navigation: {
        nextEl: "#featureNext",
        prevEl: "#featurePrev",
    },

    breakpoints: {

        768: {
            slidesPerView: 2,
        },

        1024: {
            slidesPerView: 3,
        },

        1400: {
            slidesPerView: 4,
        }

    }

});
// ==============================
// FEATURES ANIMATION
// ==============================

const featureCards = document.querySelectorAll(".feature-card");

featureCards.forEach((card, index) => {

    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";

    setTimeout(() => {

        card.style.transition = "all .6s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";

    }, index * 150);

});
// ==============================
// FEATURE CARD HOVER EFFECT
// ==============================

featureCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-12px) scale(1.02)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "translateY(0) scale(1)";

    });

});
