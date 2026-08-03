/*=========================================
        COURSE FILTER
=========================================*/

const filterButtons = document.querySelectorAll(".filter-buttons button");
const courseCards = document.querySelectorAll(".course-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        courseCards.forEach(card => {

            if (filter === "all") {

                card.style.display = "block";

                setTimeout(() => {
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, 100);

            }

            else if (card.classList.contains(filter)) {

                card.style.display = "block";

                setTimeout(() => {
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, 100);

            }

            else {

                card.style.opacity = "0";
                card.style.transform = "translateY(25px)";

                setTimeout(() => {
                    card.style.display = "none";
                }, 250);

            }

        });

    });

});


/*=========================================
        COURSE SEARCH
=========================================*/

const searchInput = document.getElementById("courseSearch");

searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    courseCards.forEach(card => {

        const title = card.querySelector("h3").innerText.toLowerCase();
        const desc = card.querySelector("p").innerText.toLowerCase();

        if (
            title.includes(value) ||
            desc.includes(value)
        ) {

            card.style.display = "block";

        }

        else {

            card.style.display = "none";

        }

    });

});


/*=========================================
        SCROLL REVEAL
=========================================*/

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold:0.15

});


courseCards.forEach(card => {

    observer.observe(card);

});


/*=========================================
        CARD HOVER EFFECT
=========================================*/

courseCards.forEach(card => {

    card.addEventListener("mousemove",(e)=>{

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.background =
        `radial-gradient(circle at ${x}px ${y}px,
        rgba(22,255,115,.12),
        #111111 60%)`;

    });

    card.addEventListener("mouseleave",()=>{

        card.style.background="#111111";

    });

});


/*=========================================
        SMOOTH SCROLL
=========================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

    anchor.addEventListener("click",function(e){

        e.preventDefault();

        const target=document.querySelector(
            this.getAttribute("href")
        );

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});


/*=========================================
        STAGGER ANIMATION
=========================================*/

window.addEventListener("load",()=>{

    courseCards.forEach((card,index)=>{

        setTimeout(()=>{

            card.classList.add("show");

        },index*120);

    });

});


/*=========================================
        SEARCH CLEAR (ESC KEY)
=========================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        searchInput.value="";

        courseCards.forEach(card=>{

            card.style.display="block";

        });

    }

});


/*=========================================
        BUTTON RIPPLE EFFECT
=========================================*/

document.querySelectorAll(".course-btn").forEach(btn=>{

    btn.addEventListener("click",function(e){

        const ripple=document.createElement("span");

        const rect=this.getBoundingClientRect();

        ripple.style.left=(e.clientX-rect.left)+"px";
        ripple.style.top=(e.clientY-rect.top)+"px";

        ripple.className="ripple";

        this.appendChild(ripple);

        setTimeout(()=>{

            ripple.remove();

        },600);

    });

});
