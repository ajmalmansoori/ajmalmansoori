import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Config
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

// DOM Elements
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const toggleBtn = document.getElementById('sidebarToggleBtn');

// Slide-out Drawer Functions
function toggleSidebar() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

toggleBtn.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

// Tab Navigation
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const tabId = item.getAttribute('data-tab');

    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));

    item.classList.add('active');
    if (document.getElementById(tabId)) {
      document.getElementById(tabId).classList.add('active');
    }

    // Close sliding sidebar on selection
    toggleSidebar();
  });
});

// Fetch Data Helper
async function loadData(colName, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const snap = await getDocs(collection(db, colName));
    container.innerHTML = snap.empty ? `<p style="color:#6B7280; font-size:0.85rem;">No entries found.</p>` : "";

    snap.forEach(docSnap => {
      const item = docSnap.data();
      const div = document.createElement('div');
      div.className = 'data-item';
      div.innerHTML = `
        <div>
          <strong style="font-size:0.9rem;">${item.title}</strong>
          <p style="font-size:0.78rem; color:#6B7280;">${item.category || item.tag || 'General'}</p>
        </div>
        <button class="btn-del" data-col="${colName}" data-id="${docSnap.id}">Delete</button>
      `;
      container.appendChild(div);
    });

    // Delete Buttons Event
    container.querySelectorAll('.btn-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm("Delete this entry?")) {
          await deleteDoc(doc(db, btn.getAttribute('data-col'), btn.getAttribute('data-id')));
          refreshData();
        }
      });
    });
  } catch (err) {
    console.error("Firebase fetch error:", err);
  }
}

function refreshData() {
  loadData("courses", "coursesList");
  loadData("tests", "testsList");
  loadData("notices", "noticesList");
}

// Form Submissions
document.getElementById('courseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  await addDoc(collection(db, "courses"), {
    title: document.getElementById('courseTitle').value,
    category: document.getElementById('courseCategory').value,
    price: document.getElementById('coursePrice').value,
    link: document.getElementById('courseLink').value,
    createdAt: serverTimestamp()
  });
  e.target.reset();
  refreshData();
});

document.getElementById('testForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  await addDoc(collection(db, "tests"), {
    title: document.getElementById('testTitle').value,
    category: document.getElementById('testCategory').value,
    link: document.getElementById('testLink').value,
    createdAt: serverTimestamp()
  });
  e.target.reset();
  refreshData();
});

document.getElementById('announcementForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  await addDoc(collection(db, "notices"), {
    title: document.getElementById('noticeTitle').value,
    tag: document.getElementById('alertBadge').value,
    link: document.getElementById('noticeLink').value,
    description: document.getElementById('noticeDescription').value,
    createdAt: serverTimestamp()
  });
  e.target.reset();
  refreshData();
});

// Initial Load
refreshData();
