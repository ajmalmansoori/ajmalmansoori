import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLRNa0XSg0WTdd_dOduSvm1-YKDMKlk0M",
  authDomain: "ajmalmansooriapp.firebaseapp.com",
  projectId: "ajmalmansooriapp",
  storageBucket: "ajmalmansooriapp.firebasestorage.app",
  messagingSenderId: "65419237118",
  appId: "1:65419237118:web:b815aebf50614cd98237af"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 1. SMART AUTH ROUTING (No Loop)
onAuthStateChanged(auth, (user) => {
  const currentPath = window.location.pathname;

  if (user) {
    if (currentPath.includes("login.html")) {
      window.location.href = "admin.html";
    } else if (currentPath.includes("admin.html")) {
      loadData();
    }
  } else {
    if (currentPath.includes("admin.html")) {
      window.location.href = "login.html";
    }
  }
});

// 2. LOGIN LOGIC
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errorMsg = document.getElementById('errorMsg');

    if (errorMsg) errorMsg.style.display = 'none';

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "admin.html";
    } catch (err) {
      console.error("Firebase Login Error:", err.code, err.message);
      if (errorMsg) {
        errorMsg.innerText = "Error: " + err.message;
        errorMsg.style.display = 'block';
      }
    }
  });
}

// 3. ADMIN DASHBOARD - ADD & LOAD DATA
const contentForm = document.getElementById('contentForm');
if (contentForm) {
  contentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "materials"), {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        link: document.getElementById('link').value,
        description: document.getElementById('description').value,
        createdAt: serverTimestamp()
      });
      contentForm.reset();
      loadData();
    } catch (err) {
      alert("Publish Error: " + err.message);
    }
  });
}

async function loadData() {
  const list = document.getElementById('contentList');
  const totalMaterialsCount = document.getElementById('totalMaterialsCount');
  if (!list) return;

  list.innerHTML = "Loading live data...";
  const snapshot = await getDocs(collection(db, "materials"));
  list.innerHTML = "";

  let count = 0;
  if (snapshot.empty) {
    list.innerHTML = `<p style="color: #64748B;">No materials added yet.</p>`;
    if (totalMaterialsCount) totalMaterialsCount.innerText = "0";
    return;
  }

  snapshot.forEach(docSnap => {
    count++;
    const item = docSnap.data();
    list.innerHTML += `
      <div class="data-item">
        <div class="data-info">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom: 4px;">
            <span class="badge">${item.category}</span>
            <h4>${item.title}</h4>
          </div>
          <p>${item.description || ''}</p>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <a href="${item.link}" target="_blank" style="color: #6366F1;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open</a>
          <button class="btn-delete" onclick="deleteItem('${docSnap.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
  });
  if (totalMaterialsCount) totalMaterialsCount.innerText = count;
}

window.deleteItem = async (id) => {
  if (confirm("Delete this material?")) {
    await deleteDoc(doc(db, "materials", id));
    loadData();
  }
};
