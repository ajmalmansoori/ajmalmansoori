// ===============================
// SEARCH FUNCTION
// ===============================

const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".news-card");

searchInput.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    cards.forEach(card => {

        const text = card.innerText.toLowerCase();

        if (text.includes(value)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});

// ===============================
// CATEGORY FILTER
// ===============================

const filterButtons = document.querySelectorAll(".filters button");

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        const filter = this.dataset.filter;

        cards.forEach(card => {

            if (filter === "all") {

                card.style.display = "block";

            }

            else if (card.classList.contains(filter)) {

                card.style.display = "block";

            }

            else {

                card.style.display = "none";

            }

        });

    });

});

// ===============================
// LOAD MORE
// ===============================

const loadMoreBtn = document.getElementById("loadMore");

let currentItems = 6;

cards.forEach((card, index) => {

    if (index >= currentItems) {

        card.style.display = "none";

    }

});

loadMoreBtn.addEventListener("click", () => {

    currentItems += 3;

    cards.forEach((card, index) => {

        if (index < currentItems) {

            card.style.display = "block";

        }

    });

    if (currentItems >= cards.length) {

        loadMoreBtn.style.display = "none";

    }

});

// ===============================
// CARD HOVER EFFECT
// ===============================

cards.forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const y = e.clientY - rect.top;

        card.style.background = `
        radial-gradient(circle at ${x}px ${y}px,
        rgba(34,255,115,.15),
        #101010 60%)`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.background = "#101010";

    });

});

// ===============================
// SCROLL REVEAL
// ===============================

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";

            entry.target.style.transform = "translateY(0)";

            observer.unobserve(entry.target);

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
// SMOOTH BUTTON RIPPLE
// ===============================

document.querySelectorAll(".bottom a, .load-more button").forEach(btn => {

    btn.addEventListener("click", function () {

        this.animate(

            [

                { transform: "scale(1)" },

                { transform: "scale(.94)" },

                { transform: "scale(1)" }

            ],

            {

                duration: 250

            }

        );

    });

});

// ===============================
// END
// ===============================
