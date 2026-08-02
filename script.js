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
// ===============================
// LATEST UPDATES ANIMATION
// ===============================

const updates = document.querySelectorAll(".update-item");

const updateObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

            updateObserver.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.15
});

updates.forEach((item, index) => {

    item.style.opacity = "0";
    item.style.transform = "translateY(40px)";
    item.style.transition = `all .6s ease ${index * 0.08}s`;

    updateObserver.observe(item);

});

// ===============================
// HOVER RIPPLE EFFECT
// ===============================

updates.forEach(item => {

    item.addEventListener("mousemove", (e) => {

        const rect = item.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        item.style.background = `
        radial-gradient(circle at ${x}px ${y}px,
        rgba(32,255,105,.12),
        #111 70%)`;

    });

    item.addEventListener("mouseleave", () => {

        item.style.background = "#0d0d0d";

    });

});

// ===============================
// NEW BADGE PULSE
// ===============================

document.querySelectorAll(".new-badge").forEach(badge => {

    setInterval(() => {

        badge.animate([
            { transform: "scale(1)" },
            { transform: "scale(1.08)" },
            { transform: "scale(1)" }
        ], {
            duration: 800
        });

    }, 2500);

});
// ==========================================
// OUR TEAM SECTION
// ==========================================

// Select Team Cards
const teamCards = document.querySelectorAll(".team-card");

// =============================
// Scroll Reveal Animation
// =============================

const teamObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0px)";

            teamObserver.unobserve(entry.target);

        }

    });

},{
    threshold:0.2
});

teamCards.forEach((card,index)=>{

    card.style.opacity="0";
    card.style.transform="translateY(60px)";
    card.style.transition=`all .7s ease ${index*0.15}s`;

    teamObserver.observe(card);

});

// =============================
// Mouse Glow Effect
// =============================

teamCards.forEach(card=>{

    card.addEventListener("mousemove",(e)=>{

        const rect=card.getBoundingClientRect();

        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;

        card.style.background=`
        radial-gradient(
        circle at ${x}px ${y}px,
        rgba(32,255,105,.12),
        #101010 65%)`;

    });

    card.addEventListener("mouseleave",()=>{

        card.style.background="#101010";

    });

});

// =============================
// 3D Tilt Effect
// =============================

teamCards.forEach(card=>{

    card.addEventListener("mousemove",(e)=>{

        const rect=card.getBoundingClientRect();

        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;

        const rotateY=((x-rect.width/2)/20);
        const rotateX=((rect.height/2-y)/20);

        card.style.transform=
        `perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-10px)`;

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform=
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";

    });

});

// =============================
// Floating Social Icons
// =============================

document.querySelectorAll(".team-overlay a").forEach(icon=>{

    icon.addEventListener("mouseenter",()=>{

        icon.animate([
            {transform:"translateY(0px)"},
            {transform:"translateY(-8px)"},
            {transform:"translateY(0px)"}
        ],{

            duration:400

        });

    });

});

// =============================
// Team Heading Animation
// =============================

const teamHeading=document.querySelector(".team-heading");

const headingObserver=new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

teamHeading.animate([

{
opacity:0,
transform:"translateY(40px)"
},

{
opacity:1,
transform:"translateY(0px)"
}

],{

duration:800,
fill:"forwards"

});

headingObserver.unobserve(teamHeading);

}

});

});

if(teamHeading){

headingObserver.observe(teamHeading);

}

// =============================
// Premium Pulse Effect
// =============================

setInterval(()=>{

teamCards.forEach(card=>{

card.animate([

{
boxShadow:"0 0 0 rgba(32,255,105,0)"
},

{
boxShadow:"0 0 35px rgba(32,255,105,.18)"
},

{
boxShadow:"0 0 0 rgba(32,255,105,0)"
}

],{

duration:2500

});

});

},5000);

// ==========================================
// END
// ==========================================
