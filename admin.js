import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getCountFromServer, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("login.html");
    } else {
        document.body.style.display = "block";
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
// MEGA RECRUITMENT UPLOAD LOGIC
// ==========================================
const megaRecruitmentForm = document.getElementById('megaRecruitmentForm');

if(megaRecruitmentForm) {
    megaRecruitmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            // Gathering ALL data from the massive form
            const recruitmentData = {
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
            };

            // Saving to a specific 'recruitment_data' collection in Firebase
            await addDoc(collection(db, "recruitment_data"), recruitmentData);
            
            // Show Success Message
            document.getElementById('recruitmentStatusMsg').style.display = 'block';
            megaRecruitmentForm.reset();
            
            setTimeout(() => { 
                document.getElementById('recruitmentStatusMsg').style.display = 'none'; 
            }, 3000);

        } catch (error) { 
            console.error("Error adding recruitment details:", error); 
            alert("Upload fail ho gaya bhai! Console check karo."); 
        }
    });
}
