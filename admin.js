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

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("login.html");
    } else {
        document.body.style.display = "block";
        fetchDashboardStats();
        loadProfile();
        loadAllPostsHistory();
        loadGallery();
    }
});

// UI Navigation & Sidebar
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const toggleBtn = document.getElementById('sidebarToggleBtn');

    function toggleSidebar() { 
        if(sidebar) sidebar.classList.toggle('open'); 
        if(overlay) overlay.classList.toggle('active'); 
    }
    if(toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if(overlay) overlay.addEventListener('click', toggleSidebar);

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.tab-section').forEach(sec => sec.style.display = 'none');
            
            item.classList.add('active');
            const target = document.getElementById(item.getAttribute('data-tab'));
            if(target) target.style.display = 'block';
            if(sidebar && sidebar.classList.contains('open')) toggleSidebar();
        });
    });

    const profileBtn = document.getElementById('profileDropdownBtn');
    const profileMenu = document.getElementById('profileDropdownMenu');
    if(profileBtn) {
        profileBtn.addEventListener('click', (e) => { e.stopPropagation(); profileMenu.classList.toggle('show'); });
    }
    document.addEventListener('click', (e) => { if(profileMenu && !profileBtn.contains(e.target)) profileMenu.classList.remove('show'); });

    document.getElementById('updateProfileBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        profileMenu.classList.remove('show');
        document.querySelectorAll('.tab-section').forEach(tab => tab.style.display = 'none');
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        document.getElementById('sec-profile').style.display = 'block';
        document.querySelector('.menu-item[data-tab="sec-profile"]').classList.add('active');
    });

    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth);
    });
});

// Dashboard Stats (Views, Posts, Earning)
async function fetchDashboardStats() {
    try {
        const postsCol = collection(db, "posts");
        const snapshot = await getCountFromServer(postsCol);
        if(document.getElementById('totalPostsCount')) document.getElementById('totalPostsCount').innerText = snapshot.data().count;

        const viewsRef = doc(db, "statistics", "site_stats");
        const viewsDoc = await getDoc(viewsRef);
        if(viewsDoc.exists() && document.getElementById('totalViewsCount')) {
            document.getElementById('totalViewsCount').innerText = viewsDoc.data().total_views + "+";
        }
        
        // Earning setup (AdSense placeholder)
        if(document.getElementById('totalEarningAmount')) {
            document.getElementById('totalEarningAmount').innerText = "₹0"; 
        }
    } catch (error) { console.error("Stats Error:", error); }
}

// Generic Form Toggles & Submissions
function setupFormHandler(formId, btnId, containerId, cancelId, categoryName) {
    const openBtn = document.getElementById(btnId);
    const container = document.getElementById(containerId);
    const cancelBtn = document.getElementById(cancelId);
    const form = document.getElementById(formId);

    if(openBtn && container) openBtn.addEventListener('click', () => container.style.display = 'block');
    if(cancelBtn && container) cancelBtn.addEventListener('click', () => container.style.display = 'none');

    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                let title = form.querySelector('input[type="text"]').value;
                let link = form.querySelector('input[type="url"]').value;

                await addDoc(collection(db, "posts"), {
                    title: title,
                    category: categoryName,
                    link: link,
                    createdAt: serverTimestamp()
                });
                
                form.reset();
                container.style.display = 'none';
                fetchDashboardStats();
                loadAllPostsHistory();
                alert("✅ Published Successfully!");
            } catch (err) { alert("Error: " + err.message); }
        });
    }
}

setupFormHandler('addUpdateForm', 'openUpdateFormBtn', 'updateFormContainer', 'cancelUpdateBtn', 'Updates');
setupFormHandler('addAdmitForm', 'openAdmitFormBtn', 'admitFormContainer', null, 'Admit Card');
setupFormHandler('addResultForm', 'openResultFormBtn', 'resultFormContainer', null, 'Result');
setupFormHandler('addCutoffForm', 'openCutoffFormBtn', 'cutoffFormContainer', null, 'Cutoff');
setupFormHandler('addAdmissionForm', 'openAdmissionFormBtn', 'admissionFormContainer', null, 'Admission');

// Load History in Dashboard & Tabs
async function loadAllPostsHistory() {
    const historyContainer = document.getElementById('dashboardHistoryList');
    const updatesContainer = document.getElementById('updatesList');
    const admitContainer = document.getElementById('admitCardList');
    const resultContainer = document.getElementById('resultList');
    const cutoffContainer = document.getElementById('cutoffList');
    const admissionContainer = document.getElementById('admissionList');

    [historyContainer, updatesContainer, admitContainer, resultContainer, cutoffContainer, admissionContainer].forEach(c => {
        if(c) c.innerHTML = '<p>Loading...</p>';
    });

    try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        let historyHTML = '', updatesHTML = '', admitHTML = '', resultHTML = '', cutoffHTML = '', admissionHTML = '';

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

            historyHTML += html;
            if(item.category === 'Updates') updatesHTML += html;
            else if(item.category === 'Admit Card') admitHTML += html;
            else if(item.category === 'Result') resultHTML += html;
            else if(item.category === 'Cutoff') cutoffHTML += html;
            else if(item.category === 'Admission') admissionHTML += html;
        });

        if(historyContainer) historyContainer.innerHTML = historyHTML || 'No history found.';
        if(updatesContainer) updatesContainer.innerHTML = updatesHTML || 'No updates found.';
        if(admitContainer) admitContainer.innerHTML = admitHTML || 'No admit cards found.';
        if(resultContainer) resultContainer.innerHTML = resultHTML || 'No results found.';
        if(cutoffContainer) cutoffContainer.innerHTML = cutoffHTML || 'No cutoff found.';
        if(admissionContainer) admissionContainer.innerHTML = admissionHTML || 'No admissions found.';
    } catch (error) { console.error("Error loading history:", error); }
}

window.deletePost = async (id) => {
    if(confirm("Delete this post?")) {
        await deleteDoc(doc(db, "posts", id));
        loadAllPostsHistory();
        fetchDashboardStats();
    }
};

// Gallery Upload Logic
const galleryForm = document.getElementById('galleryUploadForm');
if(galleryForm) {
    galleryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('galleryTitle').value;
        const fileInput = document.getElementById('galleryImageInput');
        
        if(fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = async function(event) {
                const base64Image = event.target.result;
                try {
                    await addDoc(collection(db, "gallery"), {
                        title: title,
                        imageUrl: base64Image,
                        createdAt: serverTimestamp()
                    });
                    alert("✅ Photo Uploaded Successfully!");
                    galleryForm.reset();
                    loadGallery();
                } catch(err) { alert("Error uploading photo: " + err.message); }
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    });
}

async function loadGallery() {
    const galleryList = document.getElementById('galleryList');
    if(!galleryList) return;
    galleryList.innerHTML = 'Loading gallery...';
    try {
        const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">';
        snapshot.forEach(docSnap => {
            const item = docSnap.data();
            const id = docSnap.id;
            html += `
              <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; padding:10px;">
                <img src="${item.imageUrl}" style="width:100%; height:120px; object-fit:cover; border-radius:6px;">
                <p style="font-size:0.9rem; font-weight:600; margin:8px 0 5px 0;">${item.title}</p>
                <button onclick="deleteGallery('${id}')" style="background:#fee2e2; color:#ef4444; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:0.8rem;">Delete</button>
              </div>`;
        });
        html += '</div>';
        galleryList.innerHTML = html || 'No photos in gallery.';
    } catch(err) { console.error("Gallery Error:", err); }
}

window.deleteGallery = async (id) => {
    if(confirm("Delete this photo?")) {
        await deleteDoc(doc(db, "gallery", id));
        loadGallery();
    }
};

// Real Profile Settings (Photo + Name)
async function loadProfile() {
    try {
        const adminDoc = await getDoc(doc(db, "users", "adminProfile"));
        if(adminDoc.exists()) {
            const data = adminDoc.data();
            if(document.getElementById('adminName')) document.getElementById('adminName').value = data.name || "";
            if(document.getElementById('adminEmail')) document.getElementById('adminEmail').value = data.email || "";
            if(document.getElementById('displayAdminName')) document.getElementById('displayAdminName').innerText = data.name || "Ajmal Mansoori";
            
            if(data.photoUrl) {
                const topImg = document.getElementById('topAvatarImg');
                const topInit = document.getElementById('topAvatarInitial');
                const profImg = document.getElementById('profilePreviewImg');
                const profInit = document.getElementById('profilePreviewInitial');
                
                if(topImg && topInit) { topImg.src = data.photoUrl; topImg.style.display = 'block'; topInit.style.display = 'none'; }
                if(profImg && profInit) { profImg.src = data.photoUrl; profImg.style.display = 'block'; profInit.style.display = 'none'; }
            }
        }
    } catch (error) { console.error("Error loading profile:", error); }
}

const profileUpdateForm = document.getElementById('profileUpdateForm');
if(profileUpdateForm) {
    profileUpdateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = document.getElementById('adminName').value;
        const newEmail = document.getElementById('adminEmail').value;
        const photoInput = document.getElementById('adminPhotoInput');

        let profileData = { name: newName, email: newEmail, updatedAt: new Date() };

        if(photoInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = async function(event) {
                profileData.photoUrl = event.target.result;
                await setDoc(doc(db, "users", "adminProfile"), profileData, { merge: true });
                alert("✅ Profile Updated Successfully!");
                loadProfile();
            };
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            await setDoc(doc(db, "users", "adminProfile"), profileData, { merge: true });
            alert("✅ Profile Updated Successfully!");
            loadProfile();
        }
    });
}
