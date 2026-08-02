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
// DOWNLOAD APP SECTION
// ==========================================

// Select Elements
const downloadSection = document.querySelector(".download-app");
const phone = document.querySelector(".phone");
const playBtn = document.querySelector(".playstore-btn");
const ratingBox = document.querySelector(".rating-box");
const downloadBox = document.querySelector(".download-box");

// =============================
// Scroll Reveal Animation
// =============================

const appObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.animate([
                {
                    opacity:0,
                    transform:"translateY(60px)"
                },
                {
                    opacity:1,
                    transform:"translateY(0)"
                }
            ],{
                duration:800,
                fill:"forwards"
            });

            appObserver.unobserve(entry.target);

        }

    });

},{threshold:0.2});

if(downloadSection){
    appObserver.observe(downloadSection);
}

// =============================
// Mouse Glow Effect
// =============================

if(phone){

phone.addEventListener("mousemove",(e)=>{

const rect=phone.getBoundingClientRect();

const x=e.clientX-rect.left;
const y=e.clientY-rect.top;

phone.style.background=
`radial-gradient(circle at ${x}px ${y}px,
rgba(32,255,105,.18),
#101010 70%)`;

});

phone.addEventListener("mouseleave",()=>{

phone.style.background="#101010";

});

}

// =============================
// Play Button Click Animation
// =============================

if(playBtn){

playBtn.addEventListener("click",()=>{

playBtn.animate([

{transform:"scale(1)"},

{transform:"scale(.94)"},

{transform:"scale(1.04)"},

{transform:"scale(1)"}

],{

duration:350

});

});

}

// =============================
// Floating Cards
// =============================

function floating(el,duration){

if(!el) return;

el.animate([

{
transform:"translateY(0px)"
},

{
transform:"translateY(-10px)"
},

{
transform:"translateY(0px)"
}

],{

duration:duration,
iterations:Infinity

});

}

floating(ratingBox,2800);
floating(downloadBox,3400);

// =============================
// Phone Tilt Effect
// =============================

if(phone){

phone.addEventListener("mousemove",(e)=>{

const rect=phone.getBoundingClientRect();

const x=e.clientX-rect.left;
const y=e.clientY-rect.top;

const rotateY=((x-rect.width/2)/28);
const rotateX=((rect.height/2-y)/28);

phone.style.transform=
`perspective(1000px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
translateY(-8px)`;

});

phone.addEventListener("mouseleave",()=>{

phone.style.transform=
"perspective(1000px) rotateX(0deg) rotateY(0deg)";

});

}

// =============================
// Auto Pulse Button
// =============================

if(playBtn){

setInterval(()=>{

playBtn.animate([

{
boxShadow:"0 0 0 rgba(32,255,105,0)"
},

{
boxShadow:"0 0 35px rgba(32,255,105,.45)"
},

{
boxShadow:"0 0 0 rgba(32,255,105,0)"
}

],{

duration:1800

});

},4500);

}
/*=========================================
        JOIN COMMUNITY JAVASCRIPT
=========================================*/


// Scroll Reveal Animation
const communityBox = document.querySelector(".community-box");

window.addEventListener("scroll",()=>{

    let position = communityBox.getBoundingClientRect().top;
    let screen = window.innerHeight;

    if(position < screen - 100){

        communityBox.style.opacity="1";
        communityBox.style.transform="translateY(0)";

    }

});


// Initial Animation Style
communityBox.style.opacity="0";
communityBox.style.transform="translateY(80px)";
communityBox.style.transition="0.8s ease";



// Newsletter Subscribe
const subscribeBtn = document.querySelector(".newsletter-box button");
const emailInput = document.querySelector(".newsletter-box input");


subscribeBtn.addEventListener("click",()=>{


    let email = emailInput.value.trim();


    if(email === ""){

        showMessage("⚠️ Please enter your email");

    }

    else if(!email.includes("@")){

        showMessage("❌ Enter a valid email address");

    }

    else{


        showMessage("🎉 Successfully Joined Learnify Community!");

        emailInput.value="";


    }


});



// Popup Message Function

function showMessage(text){


    let msg = document.createElement("div");

    msg.innerHTML=text;

    msg.style.position="fixed";
    msg.style.bottom="30px";
    msg.style.right="30px";
    msg.style.background="#101010";
    msg.style.color="#20ff69";
    msg.style.padding="18px 25px";
    msg.style.borderRadius="15px";
    msg.style.border="1px solid #20ff69";
    msg.style.fontWeight="700";
    msg.style.zIndex="9999";
    msg.style.boxShadow="0 15px 40px rgba(0,0,0,.5)";
    msg.style.transition=".4s";


    document.body.appendChild(msg);



    setTimeout(()=>{

        msg.style.opacity="0";
        msg.style.transform="translateY(30px)";

    },2500);



    setTimeout(()=>{

        msg.remove();

    },3000);



}



// Button Click Animation

const communityButtons = document.querySelectorAll(
".telegram-btn, .youtube-community-btn"
);


communityButtons.forEach(btn=>{


    btn.addEventListener("click",()=>{


        btn.style.transform="scale(.95)";


        setTimeout(()=>{

            btn.style.transform="";

        },150);



    });


});
// ==========================================
// END
// ==========================================
