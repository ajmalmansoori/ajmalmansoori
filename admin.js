// ==========================================
// 1. FIREBASE INITIALIZATION
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getCountFromServer, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
        // अगर लॉगिन नहीं है, तो तुरंत login.html पर वापस भेज दो
        window.location.replace("login.html");
    } else {
        // अगर लॉगिन है, तो पेज दिखाओ और डेटा लोड करो
        document.body.style.display = "block";
        fetchDashboardStats();
        loadProfile();
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
        document.getElementById(item.getAttribute('data-tab')).classList.add('active');
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

// Fetch Stats
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
                createdAt: new Date()
            });
            document.getElementById('postStatusMsg').style.display = 'block';
            addPostForm.reset();
            fetchDashboardStats(); 
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

// Profile Update Logic
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
