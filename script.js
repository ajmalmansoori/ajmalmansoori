// ==============================
// Smooth Scrolling
// ==============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
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
    centeredSlides: false,

    navigation: {
        nextEl: "#next",
        prevEl: "#prev",
    },

    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },

    breakpoints: {
        768: {
            slidesPerView: 2,
            spaceBetween: 25,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
    }
});
