// Firebase v10 Imports
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

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCLRNa0XSg0WTdd_dOduSvm1-YKDMKlk0M",
  authDomain: "ajmalmansooriapp.firebaseapp.com",
  projectId: "ajmalmansooriapp",
  storageBucket: "ajmalmansooriapp.firebasestorage.app",
  messagingSenderId: "65419237118",
  appId: "1:65419237118:web:b815aebf50614cd98237af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================================
   1. UI NAVIGATION LOGIC (Sidebar & Tabs)
========================================= */
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const toggleBtn = document.getElementById('sidebarToggleBtn');

function toggleSidebar() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}
toggleBtn.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

// Switch Tabs
document.querySelectorAll('.menu-list .menu-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
    
    item.classList.add('active');
    const tabId = item.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
    
    if(sidebar.classList.contains('open')) toggleSidebar();
  });
});


/* =========================================
   2. FIREBASE LOGIC: GET ORIGINAL STATS
========================================= */
async function fetchDashboardStats() {
  try {
    // A) Get Total Posts from 'posts' collection
    const postsCol = collection(db, "posts");
    const snapshot = await getCountFromServer(postsCol);
    document.getElementById('totalPostsCount').innerText = snapshot.data().count;

    // B) Get Total Views (Assuming you have a 'stats' document in Firebase)
    // You need to create a document: Collection 'statistics', Document 'site_stats' with a field 'total_views'
    const viewsRef = doc(db, "statistics", "site_stats");
    const viewsDoc = await getDoc(viewsRef);
    if(viewsDoc.exists()) {
      document.getElementById('totalViewsCount').innerText = viewsDoc.data().total_views + "+";
    } else {
      document.getElementById('totalViewsCount').innerText = "0";
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
}
// Call this when page loads
fetchDashboardStats();


/* =========================================
   3. FIREBASE LOGIC: ADD NEW POST
========================================= */
const openPostFormBtn = document.getElementById('openPostFormBtn');
const cancelPostBtn = document.getElementById('cancelPostBtn');
const addPostFormContainer = document.getElementById('addPostFormContainer');
const addPostForm = document.getElementById('addPostForm');

// Show/Hide Form
openPostFormBtn.addEventListener('click', () => addPostFormContainer.style.display = 'block');
cancelPostBtn.addEventListener('click', () => addPostFormContainer.style.display = 'none');

// Submit Data to Firebase
addPostForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = document.getElementById('postTitle').value;
  const category = document.getElementById('postCategory').value;
  const link = document.getElementById('postLink').value;
  
  try {
    // Adds a new document to 'posts' collection
    await addDoc(collection(db, "posts"), {
      title: title,
      category: category,
      link: link,
      createdAt: new Date() // Sets current time
    });
    
    document.getElementById('postStatusMsg').style.display = 'block';
    addPostForm.reset();
    fetchDashboardStats(); // Refresh the posts count
    
    setTimeout(() => {
      document.getElementById('postStatusMsg').style.display = 'none';
      addPostFormContainer.style.display = 'none';
    }, 2000);
    
  } catch (error) {
    console.error("Error adding post:", error);
    alert("Error publishing post. Check console.");
  }
});


/* =========================================
   4. FIREBASE LOGIC: UPDATE PROFILE
========================================= */
const profileUpdateForm = document.getElementById('profileUpdateForm');

// First, Load existing profile data if available
async function loadProfile() {
  const adminRef = doc(db, "users", "adminProfile");
  const adminDoc = await getDoc(adminRef);
  if(adminDoc.exists()) {
    const data = adminDoc.data();
    document.getElementById('adminName').value = data.name || "";
    document.getElementById('adminEmail').value = data.email || "";
    document.getElementById('displayAdminName').innerText = data.name || "Ajmal Mansoori";
  }
}
loadProfile();

// Save new profile data
profileUpdateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newName = document.getElementById('adminName').value;
  const newEmail = document.getElementById('adminEmail').value;
  
  try {
    // Overwrites or creates the 'adminProfile' document in 'users' collection
    await setDoc(doc(db, "users", "adminProfile"), {
      name: newName,
      email: newEmail,
      updatedAt: new Date()
    });
    
    document.getElementById('displayAdminName').innerText = newName;
    document.getElementById('profileStatusMsg').style.display = 'block';
    
    setTimeout(() => {
      document.getElementById('profileStatusMsg').style.display = 'none';
    }, 2000);
    
  } catch(error) {
    console.error("Error updating profile:", error);
  }
});
