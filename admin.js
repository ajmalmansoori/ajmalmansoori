// ==========================================
// 1. FIREBASE INITIALIZATION
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
// Imports updated for getDocs, deleteDoc, query, orderBy, serverTimestamp
import { getFirestore, collection, addDoc, getCountFromServer, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// 2. SECURITY GUARD (Check Login)
// ==========================================
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Agar login nahi hai, to login.html par wapas bhej do
        window.location.replace("login.html");
    } else {
        // Agar login hai, to page dikhao aur saara data load karo
        document.body.style.display = "block";
        fetchDashboardStats();
        loadProfile();
        loadAllPosts(); // NAYA: Page load hote hi saari posts load karega
    }
});


// ==========================================
// 3. UI LOGIC (Sidebar & Tabs)
// ==========================================
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const toggleBtn = document.getElementById('sidebarToggleBtn');

function toggleSidebar() { 
    if(sidebar) sidebar.classList.toggle('open'); 
    if(overlay) overlay.classList.toggle('active'); 
}
if(toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
if(overlay) overlay.addEventListener('click', toggleSidebar);

document.querySelectorAll('.menu-list .menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
        
        item.classList.add('active');
        const tabId = item.getAttribute('data-tab');
        const targetTab = document.getElementById(tabId);
        if(targetTab) targetTab.classList.add('active');
        
        // CSS display handling for tabs
        document.querySelectorAll('.tab-section').forEach(tab => tab.style.display = 'none');
        if(targetTab) targetTab.style.display = 'block';
        
        if(sidebar && sidebar.classList.contains('open')) toggleSidebar();
    });
});

// Profile Dropdown & Logout
const profileDropdownBtn = document.getElementById('profileDropdownBtn');
const profileDropdownMenu = document.getElementById('profileDropdownMenu');
if(profileDropdownBtn) {
    profileDropdownBtn.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        profileDropdownMenu.classList.toggle('show'); 
    });
}
document.addEventListener('click', (e) => { 
    if (profileDropdownMenu && !profileDropdownMenu.contains(e.target) && !profileDropdownBtn.contains(e.target)) {
        profileDropdownMenu.classList.remove('show'); 
    }
});

const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => window.location.replace("login.html"));
    });
}


// ==========================================
// 4. FIREBASE DATA LOGIC
// ==========================================

// Fetch Dashboard Stats
async function fetchDashboardStats() {
    try {
        const postsCol = collection(db, "posts");
        const snapshot = await getCountFromServer(postsCol);
        const tp = document.getElementById('totalPostsCount');
        if(tp) tp.innerText = snapshot.data().count;

        const viewsRef = doc(db, "statistics", "site_stats");
        const viewsDoc = await getDoc(viewsRef);
        const tv = document.getElementById('totalViewsCount');
        
        if(viewsDoc.exists() && tv) {
            tv.innerText = viewsDoc.data().total_views + "+";
        } else if (tv) {
            tv.innerText = "0";
        }
    } catch (error) { 
        console.error("Error fetching stats:", error); 
        const tv = document.getElementById('totalViewsCount');
        const tp = document.getElementById('totalPostsCount');
        if(tv) tv.innerText = "Error";
        if(tp) tp.innerText = "Error";
    }
}

// Add Post Logic
const openPostFormBtn = document.getElementById('openPostFormBtn');
const cancelPostBtn = document.getElementById('cancelPostBtn');
const addPostFormContainer = document.getElementById('addPostFormContainer');
const addPostForm = document.getElementById('addPostForm');

if(openPostFormBtn) openPostFormBtn.addEventListener('click', () => addPostFormContainer.style.display = 'block');
if(cancelPostBtn) cancelPostBtn.addEventListener('click', () => addPostFormContainer.style.display = 'none');

if(addPostForm) {
    addPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "posts"), {
                title: document.getElementById('postTitle').value,
                category: document.getElementById('postCategory').value,
                mediaType: document.getElementById('postMediaType').value,
                link: document.getElementById('postLink').value,
                createdAt: serverTimestamp() // NAYA: Better sorting ke liye
            });
            document.getElementById('postStatusMsg').style.display = 'block';
            addPostForm.reset();
            
            fetchDashboardStats(); 
            loadAllPosts(); // NAYA: Post add hote hi list refresh hogi
            
            setTimeout(() => { 
                document.getElementById('postStatusMsg').style.display = 'none'; 
                addPostFormContainer.style.display = 'none'; 
            }, 2000);
        } catch (error) { 
            console.error("Error adding post:", error); 
            alert("Error adding post! Check console."); 
        }
    });
}

// ==========================================
// 5. FETCH & DISTRIBUTE POSTS (News, Result, Admit Card)
// ==========================================
async function loadAllPosts() {
    // Containers select karna
    const newsContainer = document.querySelectorAll('#sec-news .data-card-container')[1]; 
    const admitCardContainer = document.getElementById('admitCardList');
    const resultContainer = document.getElementById('resultList');

    if(newsContainer) newsContainer.innerHTML = '<p style="color: #64748b;">Loading...</p>';
    if(admitCardContainer) admitCardContainer.innerHTML = '<p style="color: #64748b;">Loading...</p>';
    if(resultContainer) resultContainer.innerHTML = '<p style="color: #64748b;">Loading...</p>';

    try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        let newsHTML = '';
        let admitHTML = '';
        let resultHTML = '';

        querySnapshot.forEach((docSnap) => {
            const item = docSnap.data();
            const id = docSnap.id;

            const itemHTML = `
              <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div>
                  <span style="background: #e0e7ff; color: #4338ca; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">${item.category}</span>
                  <span style="background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; margin-left: 5px;">${item.mediaType}</span>
                  <h4 style="margin: 8px 0 0 0; color: #0f172a; font-size: 1rem;">${item.title}</h4>
                </div>
                <div style="display: flex; gap: 10px;">
                  <a href="${item.link}" target="_blank" style="padding: 8px 12px; background: #f8fafc; color: #6366f1; border-radius: 6px; text-decoration: none; font-size: 0.85rem; font-weight: 600; border: 1px solid #e2e8f0;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open</a>
                  <button onclick="deletePost('${id}')" style="padding: 8px 12px; background: #fee2e2; color: #ef4444; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>
            `;

            // Category ke hisaab se sahi tab me bhejna
            if(item.category === 'Result') {
                resultHTML += itemHTML;
            } else if(item.category === 'Admit Card') {
                admitHTML += itemHTML;
            } else {
                newsHTML += itemHTML;
            }
        });

        if(newsContainer) newsContainer.innerHTML = newsHTML || '<p style="color: #64748b;">No updates found.</p>';
        if(admitCardContainer) admitCardContainer.innerHTML = admitHTML || '<p style="color: #64748b;">No admit cards found.</p>';
        if(resultContainer) resultContainer.innerHTML = resultHTML || '<p style="color: #64748b;">No results found.</p>';

    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Global Delete Function (Button click pe kaam karne ke liye)
window.deletePost = async (id) => {
    if(confirm("Are you sure you want to delete this post?")) {
        try {
            await deleteDoc(doc(db, "posts", id));
            loadAllPosts(); // Delete hone ke baad list refresh hogi
            fetchDashboardStats(); // Dashboard ka number update hoga
        } catch(error) {
            alert("Error deleting post: " + error.message);
        }
    }
};


// ==========================================
// 6. PROFILE LOGIC
// ==========================================
async function loadProfile() {
    try {
        const adminDoc = await getDoc(doc(db, "users", "adminProfile"));
        if(adminDoc.exists()) {
            const data = adminDoc.data();
            if(document.getElementById('adminName')) document.getElementById('adminName').value = data.name || "";
            if(document.getElementById('adminEmail')) document.getElementById('adminEmail').value = data.email || "";
            if(document.getElementById('displayAdminName')) document.getElementById('displayAdminName').innerText = data.name || "Ajmal Mansoori";
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

const profileUpdateForm = document.getElementById('profileUpdateForm');
if(profileUpdateForm) {
    profileUpdateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = document.getElementById('adminName').value;
        const newEmail = document.getElementById('adminEmail').value;
        try {
            await setDoc(doc(db, "users", "adminProfile"), { 
                name: newName, 
                email: newEmail, 
                updatedAt: new Date() 
            });
            if(document.getElementById('displayAdminName')) document.getElementById('displayAdminName').innerText = newName;
            document.getElementById('profileStatusMsg').style.display = 'block';
            setTimeout(() => document.getElementById('profileStatusMsg').style.display = 'none', 2000);
        } catch(error) { 
            console.error("Error updating profile:", error); 
        }
    });
}
