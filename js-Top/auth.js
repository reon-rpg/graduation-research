import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    updateProfile,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB4CuUAhLFTCbQKwYvSARuiyZNC9oEwGx8",
    authDomain: "fraise-de-lune-4218c.firebaseapp.com",
    projectId: "fraise-de-lune-4218c",
    storageBucket: "fraise-de-lune-4218c.firebasestorage.app",
    messagingSenderId: "940100574267",
    appId: "1:940100574267:web:57abcbb567d9d704bf901e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const isGmail = (email) => email.toLowerCase().endsWith('@gmail.com');

const displayError = (element, message) => {
    element.style.color = "#c0392b";
    element.textContent = message;
};

const displaySuccess = (element, message) => {
    element.style.color = "#27ae60";
    element.textContent = message;
};

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const resetForm = document.getElementById('resetForm');
    if (resetForm) {
        resetForm.addEventListener('submit', handlePasswordReset);
    }
});

async function handleRegistration(e) {
    e.preventDefault();
    const messageElement = document.getElementById("message");
    messageElement.textContent = "";

    const username = document.getElementById('username')?.value;
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    if (!email || !password || !username) {
        displayError(messageElement, "すべての項目を入力してください。");
        return;
    }

    if (!isGmail(email)) {
        displayError(messageElement, "ご利用いただけるメールアドレスは**Gmailのみ**です。");
        return;
    }

    if (password.length < 8) {
        displayError(messageElement, "パスワードは8文字以上で設定してください。");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });
        
        displaySuccess(messageElement, "新規会員登録が完了しました！\n10%OFFクーポンをご確認ください。");
        
        const couponModal = document.getElementById('couponModal');
        if (couponModal) {
            couponModal.style.display = 'flex';
            const closeModalAndRedirect = () => {
                couponModal.style.display = 'none';
                window.location.href = 'index.html';
            };
            
            const closeButton = couponModal.querySelector('.modal-close');
            closeButton.onclick = closeModalAndRedirect;
            
            couponModal.onclick = (event) => {
                if (event.target === couponModal) {
                    closeModalAndRedirect();
                }
            };
        } else {
            alert('新規会員登録が完了しました！10%OFFクーポンをプレゼント！ (コード: LUNE10OFF)');
            window.location.href = 'index.html';
        }

    } catch (error) {
        let errorMessage = "会員登録に失敗しました。";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "このGmailアドレスは既に使用されています。";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "パスワードが弱すぎます。8文字以上、より複雑なパスワードを設定してください。";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "無効なメールアドレス形式です。";
        }
        displayError(messageElement, errorMessage);
        console.error(error);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const messageElement = document.getElementById("message");
    messageElement.textContent = "";

    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    if (!email || !password) {
        displayError(messageElement, "メールアドレスとパスワードを入力してください。");
        return;
    }

    if (!isGmail(email)) {
        displayError(messageElement, "ご利用いただけるメールアドレスは**Gmailのみ**です。");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'index.html'; 
    } catch (error) {
        displayError(messageElement, 'メールアドレスまたはパスワードが正しくありません。');
        console.error(error);
    }
}

async function handlePasswordReset(e) {
    e.preventDefault();
    const messageElement = document.getElementById("message");
    messageElement.textContent = "";

    const email = document.getElementById('email')?.value;

    if (!email) {
        displayError(messageElement, "メールアドレスを入力してください。");
        return;
    }

    if (!isGmail(email)) {
        displayError(messageElement, "ご利用いただけるメールアドレスは**Gmailのみ**です。");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        
        displaySuccess(messageElement, "パスワード再設定用のメールを送信しました。\nメールをご確認ください。");
        document.getElementById('resetForm').reset();
    } catch (error) {
        let errorMessage = "再設定メールの送信に失敗しました。";
        if (error.code === 'auth/user-not-found') {
            errorMessage = "この**Gmailアドレス**は登録されていません。";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "無効なメールアドレス形式です。**Gmailアドレスを入力してください。**";
        }
        displayError(messageElement, errorMessage);
        console.error(error);
    }
}

window.logout = function() {
    signOut(auth).then(() => {
        alert('ログアウトしました。');
        window.location.href = 'index.html'; 
    }).catch((error) => {
        console.error('ログアウトエラー:', error);
    });
}

onAuthStateChanged(auth, (user) => {
    const loginStatusIndicator = document.getElementById('loginStatusIndicator');
    
    if (loginStatusIndicator) {
        if (user) {
            const userName = user.displayName || user.email;
            console.log('User is signed in:', userName);
            
            loginStatusIndicator.innerHTML = `
                <button onclick="logout()" class="status-button logout-btn" aria-label="ログアウト">
                    <span class="status-icon">🔓</span> ログアウト
                </button>
            `;
            
        } else {
            console.log('User is signed out');
            
            loginStatusIndicator.innerHTML = `
                <a href="login.html" class="status-link login-link" aria-label="ログインページへ">
                    <span class="status-icon">👤</span> ログイン
                </a>
            `;
        }
    }
});
