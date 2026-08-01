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
