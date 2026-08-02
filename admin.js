import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Sidebar Drawer Control
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const toggleBtn = document.getElementById('sidebarToggleBtn');

function toggleSidebar() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

toggleBtn.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

// Generic Dropdown Toggle Helper
function setupDropdown(toggleId, subMenuId, arrowId) {
  const toggle = document.getElementById(toggleId);
  const subMenu = document.getElementById(subMenuId);
  const arrow = document.getElementById(arrowId);

  if (toggle) {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      subMenu.classList.toggle('show');
      arrow.classList.toggle('rotate');
    });
  }
}

// Initialize Sidebar Submenus
setupDropdown('offeringsToggle', 'offeringsSubMenu', 'offeringsArrow');
setupDropdown('reportsToggle', 'reportsSubMenu', 'reportsArrow');
setupDropdown('marketingToggle', 'marketingSubMenu', 'marketingArrow');
setupDropdown('supportToggle', 'supportSubMenu', 'supportArrow');
setupDropdown('settingsToggle', 'settingsSubMenu', 'settingsArrow');
setupDropdown('customToggle', 'customSubMenu', 'customArrow');

// Tab Switching System
function switchTab(targetTabId) {
  document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.sub-menu li').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));

  const targetSection = document.getElementById(targetTabId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  if (sidebar.classList.contains('open')) {
    toggleSidebar();
  }
}

// Click Listeners for Sidebar Links
document.querySelectorAll('.menu-list > .menu-item:not(.dropdown)').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const tabId = item.getAttribute('data-tab');
    item.classList.add('active');
    switchTab(tabId);
  });
});

document.querySelectorAll('.sub-menu a').forEach(subLink => {
  subLink.addEventListener('click', (e) => {
    e.preventDefault();
    const tabId = subLink.getAttribute('data-tab');
    
    const parentMenu = subLink.closest('.dropdown');
    if (parentMenu) parentMenu.classList.add('active');
    subLink.parentElement.classList.add('active');

    switchTab(tabId);
  });
});

// Profile Header Dropdown Widget
const profileDropdownBtn = document.getElementById('profileDropdownBtn');
const profileDropdownMenu = document.getElementById('profileDropdownMenu');

profileDropdownBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  profileDropdownMenu.classList.toggle('show');
});

document.addEventListener('click', (e) => {
  if (!profileDropdownMenu.contains(e.target) && !profileDropdownBtn.contains(e.target)) {
    profileDropdownMenu.classList.remove('show');
  }
});

// Open Profile Tab from Dropdown Menu
document.getElementById('profileMenuLink').addEventListener('click', (e) => {
  e.preventDefault();
  profileDropdownMenu.classList.remove('show');
  switchTab('sec-profile');
});

// Logout Handler
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Logged out successfully!');
});

// Profile Subtab Switcher
window.switchProfileSubTab = function(subTabId) {
  document.querySelectorAll('.prof-subtab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelectorAll('.prof-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const targetSubTab = document.getElementById(subTabId);
  if (targetSubTab) {
    targetSubTab.classList.add('active');
  }

  event.currentTarget.classList.add('active');
};
