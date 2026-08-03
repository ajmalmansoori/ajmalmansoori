/*=========================================
        RECRUITMENT PAGE SCRIPT
=========================================*/

// Reveal Animation

const infoBoxes = document.querySelectorAll(".info-box");

const recruitmentObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0.15
});

infoBoxes.forEach(box=>{

    recruitmentObserver.observe(box);

});


/*=========================================
        TABLE HOVER EFFECT
=========================================*/

document.querySelectorAll(".info-box tbody tr").forEach(row=>{

    row.addEventListener("mousemove",(e)=>{

        const rect = row.getBoundingClientRect();

        const x = e.clientX - rect.left;

        row.style.background =
        `linear-gradient(
        90deg,
        rgba(32,255,105,.15) ${x}px,
        #161616 ${x+150}px
        )`;

    });

    row.addEventListener("mouseleave",()=>{

        row.style.background="#161616";

    });

});


/*=========================================
        LINK BUTTON RIPPLE
=========================================*/

document.querySelectorAll(".links-table a").forEach(btn=>{

    btn.addEventListener("click",function(e){

        const ripple=document.createElement("span");

        const rect=this.getBoundingClientRect();

        ripple.style.width="12px";
        ripple.style.height="12px";
        ripple.style.position="absolute";
        ripple.style.borderRadius="50%";
        ripple.style.background="rgba(255,255,255,.7)";
        ripple.style.left=(e.clientX-rect.left)+"px";
        ripple.style.top=(e.clientY-rect.top)+"px";
        ripple.style.transform="translate(-50%,-50%) scale(0)";
        ripple.style.transition=".6s";
        ripple.style.pointerEvents="none";

        this.appendChild(ripple);

        requestAnimationFrame(()=>{

            ripple.style.transform="translate(-50%,-50%) scale(18)";
            ripple.style.opacity="0";

        });

        setTimeout(()=>{

            ripple.remove();

        },600);

    });

});


/*=========================================
        BUTTON STYLE FIX
=========================================*/

document.querySelectorAll(".links-table a").forEach(btn=>{

    btn.style.position="relative";

    btn.style.overflow="hidden";

});


/*=========================================
        SMOOTH SCROLL
=========================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

    anchor.addEventListener("click",function(e){

        e.preventDefault();

        const target=document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});


/*=========================================
        END
=========================================*/
