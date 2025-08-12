// Configuration
const ADMIN_PASSWORD = 'SASP2024'; // Mot de passe d'administration
const RESULTS_FILE = 'quiz_results.json'; // Fichier de sauvegarde des résultats

// Éléments DOM
const loginScreen = document.getElementById('login-screen');
const adminScreen = document.getElementById('admin-screen');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const refreshBtn = document.getElementById('refresh-btn');
const exportBtn = document.getElementById('export-btn');
const logoutBtn = document.getElementById('logout-btn');
const resultsList = document.getElementById('results-list');
const totalQuizzesEl = document.getElementById('total-quizzes');
const avgScoreEl = document.getElementById('avg-score');
const totalQuestionsEl = document.getElementById('total-questions');

// Variables globales
let isAuthenticated = false;
let quizResults = [];

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Événements des boutons
    loginBtn.addEventListener('click', handleLogin);
    refreshBtn.addEventListener('click', loadResults);
    exportBtn.addEventListener('click', exportResults);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Entrée sur le champ mot de passe
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    // Vérifier si déjà connecté
    checkAuthStatus();
});

// Gestion de la connexion
function handleLogin() {
    const password = passwordInput.value.trim();
    
    if (password === ADMIN_PASSWORD) {
        isAuthenticated = true;
        localStorage.setItem('adminAuthenticated', 'true');
        showAdminScreen();
        loadResults();
    } else {
        showMessage('❌ Mot de passe incorrect', 'error');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Vérifier le statut d'authentification
function checkAuthStatus() {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
        isAuthenticated = true;
        showAdminScreen();
        loadResults();
    }
}

// Afficher l'écran d'administration
function showAdminScreen() {
    loginScreen.classList.remove('active');
    adminScreen.classList.add('active');
}

// Gestion de la déconnexion
function handleLogout() {
    isAuthenticated = false;
    localStorage.removeItem('adminAuthenticated');
    adminScreen.classList.remove('active');
    loginScreen.classList.add('active');
    passwordInput.value = '';
    showMessage('✅ Déconnexion réussie', 'success');
}

// Charger les résultats
function loadResults() {
    try {
        // Charger depuis le localStorage (simulation de base de données)
        const savedResults = localStorage.getItem('quizResults');
        quizResults = savedResults ? JSON.parse(savedResults) : [];
        
        updateStats();
        displayResults();
        
        if (quizResults.length === 0) {
            showMessage('📝 Aucun résultat trouvé. Les résultats apparaîtront ici après la première utilisation du quiz.', 'info');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des résultats:', error);
        showMessage('❌ Erreur lors du chargement des résultats', 'error');
    }
}

// Mettre à jour les statistiques
function updateStats() {
    if (quizResults.length === 0) {
        totalQuizzesEl.textContent = '0';
        avgScoreEl.textContent = '0%';
        totalQuestionsEl.textContent = '0';
        return;
    }
    
    totalQuizzesEl.textContent = quizResults.length;
    
    const totalScore = quizResults.reduce((sum, result) => sum + result.score, 0);
    const avgScore = Math.round(totalScore / quizResults.length);
    avgScoreEl.textContent = `${avgScore}%`;
    
    const totalQuestions = quizResults.reduce((sum, result) => sum + result.totalQuestions, 0);
    totalQuestionsEl.textContent = totalQuestions;
}

// Afficher les résultats
function displayResults() {
    if (quizResults.length === 0) {
        resultsList.innerHTML = '<p style="text-align: center; color: #7f8c8d; font-style: italic;">Aucun résultat disponible</p>';
        return;
    }
    
    resultsList.innerHTML = '';
    
    // Trier par date (plus récent en premier)
    const sortedResults = [...quizResults].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedResults.forEach((result, index) => {
        const resultElement = createResultElement(result, index);
        resultsList.appendChild(resultElement);
    });
}

// Créer un élément de résultat
function createResultElement(result, index) {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result-item';
    
    const date = new Date(result.date).toLocaleString('fr-FR');
    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    
    resultDiv.innerHTML = `
        <div class="result-header">
            <div class="result-title">Quiz #${index + 1} - ${result.username || 'Officier SASP'}</div>
            <div class="result-date">${date}</div>
        </div>
        
        <div class="result-stats">
            <div class="stat-item">
                <span class="stat-value">${result.score}/${result.totalQuestions}</span>
                <span class="stat-label">Score</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${percentage}%</span>
                <span class="stat-label">Pourcentage</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${result.avgTime}s</span>
                <span class="stat-label">Temps moyen</span>
            </div>
        </div>
        
        <div class="result-categories">
            <div class="categories-title">📊 Performance par catégorie :</div>
            ${generateCategoryHTML(result.categories)}
        </div>
    `;
    
    return resultDiv;
}

// Générer le HTML des catégories
function generateCategoryHTML(categories) {
    if (!categories || Object.keys(categories).length === 0) {
        return '<p style="color: #7f8c8d; font-style: italic;">Aucune donnée de catégorie disponible</p>';
    }
    
    let html = '';
    Object.entries(categories).forEach(([category, stats]) => {
        const percentage = Math.round((stats.correct / stats.total) * 100);
        const emoji = percentage >= 80 ? '🟢' : percentage >= 60 ? '🟡' : '🔴';
        
        html += `
            <div class="category-item">
                <span class="category-name">${emoji} ${category}</span>
                <span class="category-score">${stats.correct}/${stats.total} (${percentage}%)</span>
            </div>
        `;
    });
    
    return html;
}

// Exporter les résultats
function exportResults() {
    try {
        const dataStr = JSON.stringify(quizResults, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `sasp_quiz_results_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showMessage('✅ Export réussi !', 'success');
    } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        showMessage('❌ Erreur lors de l\'export', 'error');
    }
}

// Afficher un message
function showMessage(message, type = 'info') {
    // Supprimer les messages existants
    const existingMessages = document.querySelectorAll('.error-message, .success-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = message;
    
    // Ajouter le message en haut de l'écran actif
    const activeScreen = document.querySelector('.screen.active');
    activeScreen.insertBefore(messageDiv, activeScreen.firstChild);
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Fonction pour ajouter un nouveau résultat (appelée depuis le quiz principal)
function addQuizResult(resultData) {
    try {
        // Charger les résultats existants
        const savedResults = localStorage.getItem('quizResults');
        let results = savedResults ? JSON.parse(savedResults) : [];
        
        // Ajouter le nouveau résultat
        const newResult = {
            ...resultData,
            date: new Date().toISOString(),
            id: Date.now() // Identifiant unique
        };
        
        results.push(newResult);
        
        // Sauvegarder dans le localStorage
        localStorage.setItem('quizResults', JSON.stringify(results));
        
        console.log('✅ Résultat sauvegardé avec succès');
        return true;
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde du résultat:', error);
        return false;
    }
}

// Exposer la fonction pour le quiz principal
window.addQuizResult = addQuizResult;
