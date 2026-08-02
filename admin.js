import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const auth = getAuth(app);

// ==========================================
// 1. SMART ROUTING CHECK (Fixes Reload Issue)
// ==========================================
onAuthStateChanged(auth, (user) => {
  const currentPath = window.location.pathname;

  if (!user) {
    // Agar user logged-in NAHI hai aur admin.html khola hai, tabhi login par bhejo
    if (currentPath.includes("admin.html")) {
      window.location.href = "login.html";
    }
  } else {
    // Agar user logged-in hai aur login.html par hai, toh admin panel bhej do
    if (currentPath.includes("login.html")) {
      window.location.href = "admin.html";
    }
  }
});

// ==========================================
// 2. FIRESTORE DATA FETCH
// ==========================================
async function displayMaterials() {
  const container = document.getElementById('materials-container');
  if (!container) return; // Agar HTML me container id nahi hai toh error na aaye

  try {
    const querySnapshot = await getDocs(collection(db, "materials"));
    container.innerHTML = "";
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      container.innerHTML += `
        <div class="course-card">
          <span class="badge">${data.category || ''}</span>
          <h3>${data.title || ''}</h3>
          <p>${data.description || ''}</p>
          <a href="${data.link || '#'}" target="_blank">Download / Open</a>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error fetching materials: ", error);
  }
}

displayMaterials();
