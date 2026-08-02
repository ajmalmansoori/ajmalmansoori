import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLRNa0XSg0WTdd_dOduSvm1-YKDMKlk0M",
  authDomain: "ajmalmansooriapp.firebaseapp.com",
  projectId: "ajmalmansooriapp",
  storageBucket: "ajmalmansooriapp.firebasestorage.app",
  messagingSenderId: "65419237118",
  appId: "1:65419237118:web:b815aebf50614cd98237af"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore se data fetch karke website par dikhane ka function
async function displayMaterials() {
  const querySnapshot = await getDocs(collection(db, "materials"));
  const container = document.getElementById('materials-container'); // Apni website ka div ID
  
  if(container) {
    container.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      container.innerHTML += `
        <div class="course-card">
          <span class="badge">${data.category}</span>
          <h3>${data.title}</h3>
          <p>${data.description}</p>
          <a href="${data.link}" target="_blank">Download / Open</a>
        </div>
      `;
    });
  }
}

displayMaterials();
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const auth = getAuth(app);

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Agar user logged in nahi hai, toh login.html par bhej do
    window.location.href = "login.html";
  }
});
