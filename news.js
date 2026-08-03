import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyClRNa0XSg0WTDd_dOduSvm1-YKDMKlk0M",
    authDomain: "ajmalmansooriapp.firebaseapp.com",
    projectId: "ajmalmansooriapp",
    storageBucket: "ajmalmansooriapp.firebasestorage.app",
    messagingSenderId: "65419237118",
    appId: "1:65419237118:web:b815aebf50614cd98237af"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
    const updateListContainer = document.querySelector(".update-list");
    
    // 1. Firebase se posts load karne ka function
    async function loadFrontendPosts() {
        if (!updateListContainer) return;
        updateListContainer.innerHTML = '<p style="color: #fff; text-align: center; padding: 20px;">Loading live updates...</p>';

        try {
            const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);

            let html = "";
            if (snapshot.empty) {
                updateListContainer.innerHTML = '<p style="color: #9d9d9d; text-align: center; padding: 20px;">No updates found.</p>';
                return;
            }

            snapshot.forEach((docSnap) => {
                const item = docSnap.data();
                
                // Format Date & Time
                let dateStr = "Recent";
                let timeStr = "";
                if (item.createdAt && item.createdAt.toDate) {
                    const d = item.createdAt.toDate();
                    dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                    timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                }

                // Determine target link (Prioritize Link -> PDF -> Photo)
                const targetLink = item.link || item.pdfUrl || item.photoUrl || "#";

                html += `
                <div class="update-card" data-category="${item.category ? item.category.toLowerCase() : 'updates'}">
                    <div class="left">
                        <div class="icon green">
                            <i class="fa-solid fa-bullhorn"></i>
                        </div>
                        <div class="content">
                            <span>${item.category ? item.category.toUpperCase() : 'UPDATE'}</span>
                            <h3>${item.title}</h3>
                            <p>Click arrow or link to view official document/details.</p>
                        </div>
                    </div>
                    <div class="right">
                        <div class="date">
                            <i class="fa-regular fa-calendar"></i>
                            <div>
                                <h5>${dateStr}</h5>
                                <p>${timeStr}</p>
                            </div>
                        </div>
                        <div class="status new">NEW</div>
                        <a href="${targetLink}" target="_blank" class="arrow" style="text-decoration: none;">
                            <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>`;
            });

            updateListContainer.innerHTML = html;
            initInteractiveElements(); // Re-bind filters & search after dynamic load

        } catch (error) {
            console.error("Error loading posts from Firebase:", error);
            updateListContainer.innerHTML = '<p style="color: #ff4040; text-align: center;">Failed to load updates.</p>';
        }
    }

    await loadFrontendPosts();

    // 2. Filters, Search & Interactive Logic
    function initInteractiveElements() {
        const filterButtons = document.querySelectorAll(".filters button");
        const cards = document.querySelectorAll(".update-card");
        const searchInput = document.querySelector(".search-box input");

        // Filter Buttons Logic
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                const filterValue = button.innerText.toLowerCase().trim();

                cards.forEach(card => {
                    const category = card.getAttribute("data-category") || "";
                    if (filterValue === "all" || category.includes(filterValue)) {
                        card.style.display = "flex";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        });

        // Live Search Logic
        if (searchInput) {
            searchInput.addEventListener("keyup", () => {
                const search = searchInput.value.toLowerCase();

                cards.forEach(card => {
                    const titleElement = card.querySelector("h3");
                    const title = titleElement ? titleElement.innerText.toLowerCase() : "";

                    if (title.includes(search)) {
                        card.style.display = "flex";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        }

        // Active Card Hover Effect
        cards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                cards.forEach(c => c.classList.remove("active"));
                card.classList.add("active");
            });
        });
    }
});
