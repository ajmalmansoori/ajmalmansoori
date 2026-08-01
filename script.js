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
// Navbar Scroll Effect
// ==============================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});
const swiper = new Swiper(".browseSwiper", {

    slidesPerView:1.15,

    spaceBetween:25,

    loop:true,

    speed:700,

    grabCursor:true,

    navigation:{
        nextEl:"#next",
        prevEl:"#prev"
    },
    breakpoints:{
        768:{
            slidesPerView:2
        },
        1100:{
            slidesPerView:3
        },
        1400:{
            slidesPerView:4
        }
    }
});
