// ==========================================
// 1. FIREBASE INITIALIZATION
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getCountFromServer, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyClRNa0XSg0WTDd_dOduSvm1-YKDMKlk0M",
    authDomain: "ajmalmansooriapp.firebaseapp.com",
    projectId: "ajmalmansooriapp",
    storageBucket: "ajmalmansooriapp.firebasestorage.app",
    messagingSenderId: "65419237118",
    appId: "1:65419237118:web:b815aebf50614cd98237af"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// 2. CHECK LOGIN & INIT
// ==========================================
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("login.html");
    } else {
        document.body.style.display = "block";
        fetchDashboardStats();
        loadProfile();
        loadAllNormalPosts(); // Load News, Results, Admit Cards
    }
});

// ==========================================
// 3. UI TAB SWITCHING & SIDEBAR (SLIDER FIX)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- SIDEBAR SLIDER LOGIC ---
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const toggleBtn = document.getElementById('sidebarToggleBtn');

    function toggleSidebar() { 
        if(sidebar) sidebar.classList.toggle('open'); 
        if(overlay) overlay.classList.toggle('active'); 
    }
    if(toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if(overlay) overlay.addEventListener('click', toggleSidebar);


    // --- SIDEBAR TABS LOGIC ---
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.tab-section').forEach(sec => sec.style.display = 'none');
            
            item.classList.add('active');
            const target = document.getElementById(item.getAttribute('data-tab'));
            if(target) target.style.display = 'block';
            
            // मोबाइल में टैब पर क्लिक करते ही स्लाइडर खुद बंद हो जाएगा
            if(sidebar && sidebar.classList.contains('open')) toggleSidebar();
        });
    });

    // --- PROFILE DROPDOWN LOGIC ---
    const profileBtn = document.getElementById('profileDropdownBtn');
    const profileMenu = document.getElementById('profileDropdownMenu');
    if(profileBtn) {
        profileBtn.addEventListener('click', (e) => { e.stopPropagation(); profileMenu.classList.toggle('show'); });
    }
    document.addEventListener('click', (e) => { if(profileMenu && !profileBtn.contains(e.target)) profileMenu.classList.remove('show'); });

    // --- PROFILE TAB FROM DROPDOWN ---
    document.getElementById('updateProfileBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        profileMenu.classList.remove('show');
        document.querySelectorAll('.tab-section').forEach(tab => tab.style.display = 'none');
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        document.getElementById('sec-profile').style.display = 'block';
        document.querySelector('.menu-item[data-tab="sec-profile"]').classList.add('active');
        
        if(sidebar && sidebar.classList.contains('open')) toggleSidebar();
    });

    // --- LOGOUT LOGIC ---
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth);
    });
});

// ==========================================
// 4. FETCH DASHBOARD STATS
// ==========================================
async function fetchDashboardStats() {
    try {
        const postsCol = collection(db, "posts");
        const snapshot = await getCountFromServer(postsCol);
        if(document.getElementById('totalPostsCount')) document.getElementById('totalPostsCount').innerText = snapshot.data().count;

        const viewsRef = doc(db, "statistics", "site_stats");
        const viewsDoc = await getDoc(viewsRef);
        const tv = document.getElementById('totalViewsCount');
        if(viewsDoc.exists() && tv) tv.innerText = viewsDoc.data().total_views + "+";
    } catch (error) { console.error("Stats Error:", error); }
}

// ==========================================
// 5. NORMAL POSTS (NEWS, ADMIT CARD, RESULT)
// ==========================================
// Toggle Form
const openPostFormBtn = document.getElementById('openPostFormBtn');
const addPostFormContainer = document.getElementById('addPostFormContainer');
if(openPostFormBtn) openPostFormBtn.addEventListener('click', () => addPostFormContainer.style.display = 'block');
document.getElementById('cancelPostBtn')?.addEventListener('click', () => addPostFormContainer.style.display = 'none');

// Submit Form
const addPostForm = document.getElementById('addPostForm');
if(addPostForm) {
    addPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "posts"), {
                title: document.getElementById('postTitle').value,
                category: document.getElementById('postCategory').value,
                mediaType: document.getElementById('postMediaType').value,
                link: document.getElementById('postLink').value,
                createdAt: serverTimestamp()
            });
            document.getElementById('postStatusMsg').style.display = 'block';
            addPostForm.reset();
            fetchDashboardStats(); 
            loadAllNormalPosts(); 
            setTimeout(() => { document.getElementById('postStatusMsg').style.display = 'none'; addPostFormContainer.style.display = 'none'; }, 2000);
        } catch (error) { alert("Error adding post: " + error.message); }
    });
}

// Load Posts into Tabs
async function loadAllNormalPosts() {
    const newsContainer = document.getElementById('newsList');
    const admitContainer = document.getElementById('admitCardList');
    const resultContainer = document.getElementById('resultList');

    if(newsContainer) newsContainer.innerHTML = 'Loading...';
    if(admitContainer) admitContainer.innerHTML = 'Loading...';
    if(resultContainer) resultContainer.innerHTML = 'Loading...';

    try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        let newsHTML = '', admitHTML = '', resultHTML = '';

        snapshot.forEach((docSnap) => {
            const item = docSnap.data();
            const id = docSnap.id;
            const html = `
              <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="background: #e0e7ff; color: #4338ca; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">${item.category}</span>
                  <h4 style="margin: 8px 0 0 0; font-size: 1rem;">${item.title}</h4>
                </div>
                <div style="display: flex; gap: 10px;">
                  <a href="${item.link}" target="_blank" style="padding: 8px 12px; background: #f8fafc; color: #6366f1; border-radius: 6px; text-decoration: none; font-size: 0.85rem; font-weight: 600; border: 1px solid #e2e8f0;">Open</a>
                  <button onclick="deletePost('${id}')" style="padding: 8px 12px; background: #fee2e2; color: #ef4444; border: none; border-radius: 6px; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>`;

            if(item.category === 'Result') resultHTML += html;
            else if(item.category === 'Admit Card') admitHTML += html;
            else newsHTML += html;
        });

        if(newsContainer) newsContainer.innerHTML = newsHTML || 'No posts found.';
        if(admitContainer) admitContainer.innerHTML = admitHTML || 'No admit cards found.';
        if(resultContainer) resultContainer.innerHTML = resultHTML || 'No results found.';
    } catch (error) { console.error("Error loading posts:", error); }
}

window.deletePost = async (id) => {
    if(confirm("Delete this post?")) {
        await deleteDoc(doc(db, "posts", id));
        loadAllNormalPosts();
        fetchDashboardStats();
    }
};

// ==========================================
// 6. MEGA RECRUITMENT UPLOAD LOGIC
// ==========================================
const megaRecruitmentForm = document.getElementById('megaRecruitmentForm');
if(megaRecruitmentForm) {
    megaRecruitmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "recruitment_data"), {
                title: document.getElementById('recTitle').value,
                badge: document.getElementById('recBadge').value,
                dates: {
                    start: document.getElementById('dateStart').value,
                    end: document.getElementById('dateEnd').value,
                    feeLast: document.getElementById('dateFee').value,
                    correction: document.getElementById('dateCorrection').value,
                    exam: document.getElementById('dateExam').value,
                    admitCard: document.getElementById('dateAdmitCard').value
                },
                fees: {
                    genObcEws: document.getElementById('feeGen').value,
                    scSt: document.getElementById('feeSC').value,
                    ph: document.getElementById('feePH').value,
                    mode: document.getElementById('feeMode').value
                },
                age: {
                    min: document.getElementById('ageMin').value,
                    max: document.getElementById('ageMax').value,
                    rules: document.getElementById('ageRules').value
                },
                links: {
                    apply: document.getElementById('linkApply').value,
                    notification: document.getElementById('linkNotification').value,
                    website: document.getElementById('linkWebsite').value
                },
                createdAt: serverTimestamp()
            });
            document.getElementById('recruitmentStatusMsg').style.display = 'block';
            megaRecruitmentForm.reset();
            setTimeout(() => document.getElementById('recruitmentStatusMsg').style.display = 'none', 3000);
        } catch (error) { alert("Upload fail! " + error.message); }
    });
}

// ==========================================
// 7. PROFILE UPDATE LOGIC
// ==========================================
async function loadProfile() {
    const adminDoc = await getDoc(doc(db, "users", "adminProfile"));
    if(adminDoc.exists()) {
        const data = adminDoc.data();
        if(document.getElementById('adminName')) document.getElementById('adminName').value = data.name || "";
        if(document.getElementById('adminEmail')) document.getElementById('adminEmail').value = data.email || "";
        if(document.getElementById('displayAdminName')) document.getElementById('displayAdminName').innerText = data.name || "Ajmal Mansoori";
    }
}

const profileUpdateForm = document.getElementById('profileUpdateForm');
if(profileUpdateForm) {
    profileUpdateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = document.getElementById('adminName').value;
        const newEmail = document.getElementById('adminEmail').value;
        await setDoc(doc(db, "users", "adminProfile"), { name: newName, email: newEmail, updatedAt: new Date() });
        if(document.getElementById('displayAdminName')) document.getElementById('displayAdminName').innerText = newName;
        document.getElementById('profileStatusMsg').style.display = 'block';
        setTimeout(() => document.getElementById('profileStatusMsg').style.display = 'none', 2000);
    });
}
// ==========================================
// 8. PUBLISH COURSE LOGIC
// ==========================================
const publishCourseBtn = document.getElementById('publishCourseBtn');

if (publishCourseBtn) {
    publishCourseBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // फॉर्म से वैल्यू लेना
        const title = document.getElementById('courseTitleInput').value;
        const price = document.getElementById('coursePriceInput').value;
        
        // चेक करना कि टाइटल और प्राइस खाली तो नहीं हैं
        if(!title || !price) {
            alert("⚠️ Please enter Course Title and Price!");
            return;
        }

        try {
            // बटन पर Loading दिखाना
            publishCourseBtn.innerHTML = 'Publishing... <i class="fa-solid fa-spinner fa-spin"></i>';
            
            // Firebase में "courses" नाम के फोल्डर में सेव करना
            await addDoc(collection(db, "courses"), {
                title: title,
                price: price,
                createdAt: serverTimestamp()
            });

            // सक्सेस मैसेज
            alert("✅ Course Published Successfully!");
            
            // फॉर्म को बंद करना और रिसेट करना
            document.getElementById('courseTitleInput').value = '';
            document.getElementById('coursePriceInput').value = '';
            document.getElementById('premiumFormOverlay').style.display = 'none';
            
            // बटन को वापस नार्मल करना
            publishCourseBtn.innerHTML = 'Finish <i class="fa-solid fa-check"></i>';
            
            // स्टेप 1 पर वापस भेजना
            window.goToStep(1);

        } catch (error) {
            alert("❌ Error publishing course: " + error.message);
            publishCourseBtn.innerHTML = 'Finish <i class="fa-solid fa-check"></i>';
        }
    });
}
