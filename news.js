import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyClRNa0XSg0WTDd_dOduSvm1-YKDMKlk0M",
    authDomain: "ajmalmansooriapp.firebaseapp.com",
    projectId: "ajmalmansooriapp",
    storageBucket: "ajmalmansooriapp.firebasestorage.app",
    messagingSenderId: "65419237118",
    appId: "1:65419237118:web:b815aebf50614cd98237af",
    measurementId: "G-ZYW4JN8CW2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Category Normalization Function (एडमिन और फ्रंटएंड के नाम मैच करने के लिए)
function normalizeCategory(cat) {
    if (!cat) return "updates";
    let c = cat.toLowerCase().trim();
    if (c.includes("result")) return "result";
    if (c.includes("admit")) return "admit card";
    if (c.includes("cutoff")) return "cutoff";
    if (c.includes("admission")) return "admission";
    if (c.includes("recruitment") || c.includes("vacancy")) return "recruitment";
    return c;
}

document.addEventListener("DOMContentLoaded", async () => {
    const updateListContainer = document.querySelector(".update-list");
    
    async function loadFrontendPosts() {
        if (!updateListContainer) return;
        updateListContainer.innerHTML = '<p style="color: #fff; text-align: center; padding: 20px;">Loading live updates...</p>';

        try {
            const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);

            let html = "";
            if (snapshot.empty) {
                updateListContainer.innerHTML = '<p style="color: #9d9d9d; text-align: center; padding: 20px;">No updates found in database.</p>';
                return;
            }

            snapshot.forEach((docSnap) => {
                const item = docSnap.data();
                
                let dateStr = "Recent";
                let timeStr = "";
                if (item.createdAt && item.createdAt.toDate) {
                    const d = item.createdAt.toDate();
                    dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                    timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                }

                const targetLink = item.link || item.pdfUrl || item.photoUrl || "#";
                const categoryName = item.category ? item.category.trim() : 'Updates';
                const categoryClass = normalizeCategory(categoryName);

                html += `
                <div class="update-card" data-category="${categoryClass}">
                    <div class="left">
                        <div class="icon green">
                            <i class="fa-solid fa-bullhorn"></i>
                        </div>
                        <div class="content">
                            <span>${categoryName.toUpperCase()}</span>
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
            initFiltersAndSearch();

        } catch (error) {
            console.error("Firebase Load Error:", error);
            updateListContainer.innerHTML = '<p style="color: #ff4040; text-align: center; padding: 20px;">Error loading data. Check Firestore Rules.</p>';
        }
    }

    await loadFrontendPosts();

    function initFiltersAndSearch() {
        const filterButtons = document.querySelectorAll(".filters button");
        const searchInput = document.querySelector(".search-box input");
        const cards = document.querySelectorAll(".update-card");

        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                const filterValue = button.innerText.toLowerCase().trim();

                cards.forEach(card => {
                    const cardCat = card.getAttribute("data-category") || "";
                    if (filterValue === "all" || cardCat.includes(filterValue) || filterValue.includes(cardCat)) {
                        card.style.display = "flex";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        });

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
    }
});
