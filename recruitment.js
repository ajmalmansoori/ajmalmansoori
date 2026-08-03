/*=========================================
        RECRUITMENT PAGE SCRIPT
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*=========================================
            REVEAL ANIMATION (SCROLL)
    =========================================*/
    const infoBoxes = document.querySelectorAll(".info-box");

    const recruitmentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                // Agar aap chahte hain ki ek baar show hone ke baad animation dobara na ho,
                // toh aap yahan ye line uncomment kar sakte hain:
                // recruitmentObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    infoBoxes.forEach(box => {
        recruitmentObserver.observe(box);
    });


    /*=========================================
            TABLE HOVER EFFECT
    =========================================*/
    document.querySelectorAll(".info-box tbody tr").forEach(row => {
        
        row.addEventListener("mousemove", (e) => {
            const rect = row.getBoundingClientRect();
            const x = e.clientX - rect.left;
            
            // Mouse ke sath sath green gradient chalega
            row.style.background = `linear-gradient(90deg, rgba(32,255,105,.15) ${x}px, #161616 ${x + 150}px)`;
        });

        row.addEventListener("mouseleave", () => {
            // Mouse hatne par style reset kar diya taaki CSS wala color wapas aa jaye
            row.style.background = ""; 
        });
    });


    /*=========================================
            BUTTON STYLE FIX (For Ripple)
    =========================================*/
    // Ripple effect ke liye button ko relative aur hidden karna zaroori hai
    document.querySelectorAll(".links-table a").forEach(btn => {
        btn.style.position = "relative";
        btn.style.overflow = "hidden";
    });


    /*=========================================
            LINK BUTTON RIPPLE EFFECT
    =========================================*/
    document.querySelectorAll(".links-table a").forEach(btn => {
        btn.addEventListener("click", function (e) {
            
            const ripple = document.createElement("span");
            const rect = this.getBoundingClientRect();
            
            // Ripple CSS directly applied
            ripple.style.width = "12px";
            ripple.style.height = "12px";
            ripple.style.position = "absolute";
            ripple.style.borderRadius = "50%";
            ripple.style.background = "rgba(255,255,255,.7)";
            ripple.style.left = (e.clientX - rect.left) + "px";
            ripple.style.top = (e.clientY - rect.top) + "px";
            ripple.style.transform = "translate(-50%,-50%) scale(0)";
            ripple.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";
            ripple.style.pointerEvents = "none";
            
            this.appendChild(ripple);
            
            // Animation trigger
            requestAnimationFrame(() => {
                ripple.style.transform = "translate(-50%,-50%) scale(25)";
                ripple.style.opacity = "0";
            });
            
            // Remove ripple from DOM after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });


    /*=========================================
            SMOOTH SCROLLING
    =========================================*/
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            
            if (targetId !== "#") { // Sirf tab scroll kare jab href me "#" ke aage kuch ho
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            }
        });
    });

});
