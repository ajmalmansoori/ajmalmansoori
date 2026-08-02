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

// ===============================
// Browse Slider
// ===============================

const browseSwiper = new Swiper(".browseSwiper", {

    loop: true,

    speed: 700,

    spaceBetween: 30,

    grabCursor: true,

    centeredSlides: false,

    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },

    navigation: {
        nextEl: ".next-btn",
        prevEl: ".prev-btn",
    },

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    breakpoints: {

        0: {
            slidesPerView: 1,
            spaceBetween: 20,
        },

        576: {
            slidesPerView: 1.2,
            spaceBetween: 20,
        },

        768: {
            slidesPerView: 2,
            spaceBetween: 25,
        },

        992: {
            slidesPerView: 3,
            spaceBetween: 30,
        },

        1200: {
            slidesPerView: 4,
            spaceBetween: 30,
        }

    }

});

// ===============================
// Card Hover Animation
// ===============================

const cards = document.querySelectorAll(".card");

cards.forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.background = `
        radial-gradient(
            circle at ${x}px ${y}px,
            rgba(32,255,105,.18),
            #0b0f0e 55%
        )`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.background =
            "linear-gradient(180deg,#0e1312,#09100d)";

    });

});

// ===============================
// Arrow Click Animation
// ===============================

document.querySelectorAll(".prev-btn,.next-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        btn.animate(

            [

                { transform: "scale(1)" },

                { transform: "scale(.90)" },

                { transform: "scale(1)" }

            ],

            {

                duration: 250

            }

        );

    });

});

// ===============================
// Scroll Reveal Animation
// ===============================

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";

            entry.target.style.transform = "translateY(0px)";

        }

    });

}, {
    threshold: 0.15
});

cards.forEach(card => {

    card.style.opacity = "0";

    card.style.transform = "translateY(40px)";

    card.style.transition = ".6s ease";

    observer.observe(card);

});

// ===============================
// End
// ===============================
