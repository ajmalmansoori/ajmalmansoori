// =========================================
// FIREBASE INITIALIZATION
// =========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getCountFromServer, 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// आपके Firebase की डिटेल्स
const firebaseConfig = {
  apiKey: "AIzaSyCLRNa0XSg0WTdd_dOduSvm1-YKDMKlk0M",
  authDomain: "ajmalmansooriapp.firebaseapp.com",
  projectId: "ajmalmansooriapp",
  storageBucket: "ajmalmansooriapp.firebasestorage.app",
  messagingSenderId: "65419237118",
  appId: "1:65419237118:web:b815aebf50614cd98237af"
};

// Firebase ऐप और डेटाबेस स्टार्ट करना
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// =========================================
// 1. UI LOGIC: SIDEBAR & TABS
// =========================================
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const toggleBtn = document.getElementById('sidebarToggleBtn');

// Sidebar ओपन/क्लोज करने का फंक्शन
function toggleSidebar() {
  if(sidebar && overlay) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  }
}
if(toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
if(overlay) overlay.addEventListener('click', toggleSidebar);

// Tabs स्विच करने का फंक्शन (जैसे News, Result, Profile पर क्लिक करना)
document.querySelectorAll('.menu-list .menu-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    // पुराने एक्टिव टैब हटाना
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
    
    // नया टैब एक्टिव करना
    item.classList.add('active');
    const tabId = item.getAttribute('data-tab');
    const targetTab = document.getElementById(tabId);
    if(targetTab) targetTab.classList.add('active');
    
    // अगर मोबाइल व्यू में है तो क्लिक करने के बाद साइडबार बंद कर देना
    if(sidebar.classList.contains('open')) {
      toggleSidebar();
    }
  });
});

// प्रोफाइल ड्रॉपडाउन मेनू
const profileDropdownBtn = document.getElementById('profileDropdownBtn');
const profileDropdownMenu = document.getElementById('profileDropdownMenu');

if(profileDropdownBtn && profileDropdownMenu) {
  profileDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdownMenu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!profileDropdownMenu.contains(e.target) && !profileDropdownBtn.contains(e.target)) {
      profileDropdownMenu.classList.remove('show');
    }
  });
}


// =========================================
// 2. FIREBASE LOGIC: DASHBOARD STATS
// =========================================
async function fetchDashboardStats() {
  try {
    // A) Total Posts काउंट करना
    const postsCol = collection(db, "posts");
    const snapshot = await getCountFromServer(postsCol);
    const totalPosts = document.getElementById('totalPostsCount');
    if(totalPosts) totalPosts.innerText = snapshot.data().count;

    // B) Total Views लाना (अगर statistics कलेक्शन में site_stats फाइल बनी हो)
    const viewsRef = doc(db, "statistics", "site_stats");
    const viewsDoc = await getDoc(viewsRef);
    const totalViews = document.getElementById('totalViewsCount');
    
    if(viewsDoc.exists() && totalViews) {
      totalViews.innerText = viewsDoc.data().total_views + "+";
    } else if (totalViews) {
      totalViews.innerText = "0";
    }
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
  }
}
// पेज लोड होते ही डेटा फेच करना
fetchDashboardStats();


// =========================================
// 3. FIREBASE LOGIC: ADD NEW POST
// =========================================
const openPostFormBtn = document.getElementById('openPostFormBtn');
const cancelPostBtn = document.getElementById('cancelPostBtn');
const addPostFormContainer = document.getElementById('addPostFormContainer');
const addPostForm = document.getElementById('addPostForm');

if(openPostFormBtn) {
  openPostFormBtn.addEventListener('click', () => {
    addPostFormContainer.style.display = 'block';
  });
}

if(cancelPostBtn) {
  cancelPostBtn.addEventListener('click', () => {
    addPostFormContainer.style.display = 'none';
  });
}

if(addPostForm) {
  addPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // फॉर्म के इनपुट की वैल्यूज़ लेना
    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const mediaType = document.getElementById('postMediaType').value; // Link, PDF, Video, Image
    const link = document.getElementById('postLink').value;
    
    try {
      // Firebase में 'posts' कलेक्शन में सेव करना
      await addDoc(collection(db, "posts"), {
        title: title,
        category: category,
        mediaType: mediaType,
        link: link,
        createdAt: new Date()
      });
      
      // सक्सेस मैसेज दिखाना
      const statusMsg = document.getElementById('postStatusMsg');
      if(statusMsg) statusMsg.style.display = 'block';
      
      // फॉर्म रिसेट करना और डैशबोर्ड नंबर अपडेट करना
      addPostForm.reset();
      fetchDashboardStats(); 
      
      // 2 सेकंड बाद फॉर्म और मैसेज गायब कर देना
      setTimeout(() => {
        if(statusMsg) statusMsg.style.display = 'none';
        if(addPostFormContainer) addPostFormContainer.style.display = 'none';
      }, 2000);
      
    } catch (error) {
      console.error("Error adding post:", error);
      alert("Post Add करने में दिक्कत आ रही है।");
    }
  });
}


// =========================================
// 4. FIREBASE LOGIC: PROFILE UPDATE
// =========================================
const profileUpdateForm = document.getElementById('profileUpdateForm');

// पहले से सेव प्रोफाइल डेटा को लोड करना
async function loadProfile() {
  const adminRef = doc(db, "users", "adminProfile");
  const adminDoc = await getDoc(adminRef);
  
  if(adminDoc.exists()) {
    const data = adminDoc.data();
    const adminNameInput = document.getElementById('adminName');
    const adminEmailInput = document.getElementById('adminEmail');
    const displayAdminName = document.getElementById('displayAdminName');
    
    if(adminNameInput) adminNameInput.value = data.name || "";
    if(adminEmailInput) adminEmailInput.value = data.email || "";
    if(displayAdminName) displayAdminName.innerText = data.name || "Ajmal Mansoori";
  }
}
loadProfile();

// नई प्रोफाइल अपडेट करना
if(profileUpdateForm) {
  profileUpdateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newName = document.getElementById('adminName').value;
    const newEmail = document.getElementById('adminEmail').value;
    
    try {
      // 'users' कलेक्शन में 'adminProfile' डॉक्यूमेंट सेव/अपडेट करना
      await setDoc(doc(db, "users", "adminProfile"), {
        name: newName,
        email: newEmail,
        updatedAt: new Date()
      });
      
      const displayAdminName = document.getElementById('displayAdminName');
      if(displayAdminName) displayAdminName.innerText = newName;
      
      const profileStatusMsg = document.getElementById('profileStatusMsg');
      if(profileStatusMsg) {
        profileStatusMsg.style.display = 'block';
        setTimeout(() => profileStatusMsg.style.display = 'none', 2000);
      }
      
    } catch(error) {
      console.error("Error updating profile:", error);
      alert("प्रोफाइल अपडेट में एरर आ रहा है।");
    }
  });
}
