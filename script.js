// Variables globales
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let timer = null;
let timeLeft = 10;
let answerTimes = [];
let startTime = null;
let quizQuestions = []; // Questions sélectionnées pour ce quiz
let userAnswers = []; // Réponses de l'utilisateur
let questionStartTimes = []; // Temps de début de chaque question
let username = ''; // Nom d'utilisateur

// Éléments DOM
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');
const questionImage = document.getElementById('question-image');
const questionText = document.getElementById('question-text');
const answerBtns = document.querySelectorAll('.answer-btn');
const progressFill = document.getElementById('progress-fill');
const questionCounter = document.getElementById('question-counter');
const scoreElement = document.getElementById('score');
const timerText = document.getElementById('timer-text');
const usernameInput = document.getElementById('username');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Événements des boutons
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartQuiz);
    homeBtn.addEventListener('click', goToHome);
    
    // Bouton d'administration
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            window.open('admin.html', '_blank');
        });
    }
    
    // Événements des réponses
    answerBtns.forEach(btn => {
        btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.index)));
    });
    
    // Sauvegarder le nom d'utilisateur
    usernameInput.addEventListener('input', () => {
        username = usernameInput.value;
        localStorage.setItem('quizUsername', username);
    });
    
    // Charger le nom d'utilisateur sauvegardé
    loadUserSettings();
});

// Charger les paramètres utilisateur sauvegardés
function loadUserSettings() {
    const savedUsername = localStorage.getItem('quizUsername');
    if (savedUsername) {
        usernameInput.value = savedUsername;
        username = savedUsername;
    }
}

// Fonctions principales
function startQuiz() {
    // Vérifier que le nom d'utilisateur est saisi
    if (!username.trim()) {
        alert('Veuillez saisir votre nom avant de commencer le quiz.');
        usernameInput.focus();
        return;
    }
    
    // Utiliser toutes les 132 questions
    quizQuestions = [...allQuestions];
    
    // Réinitialiser les variables
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    answerTimes = [];
    questionStartTimes = [];
    selectedAnswer = null;
    
    showScreen(quizScreen);
    loadQuestion();
}

function loadQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    
    // Réinitialiser l'état
    selectedAnswer = null;
    timeLeft = 10;
    startTime = Date.now();
    questionStartTimes[currentQuestionIndex] = startTime;
    
    // Mettre à jour l'interface
    questionImage.src = question.image;
    questionText.textContent = question.question;
    // Afficher le compteur de questions
    questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${quizQuestions.length}`;
    // Masquer le score à l'utilisateur (calculé en arrière-plan pour la sauvegarde locale)
    // scoreElement.textContent = `Score: ${score}`;
    
    // Afficher la barre de progression
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Mélanger l'ordre des réponses pour cette question
    const shuffledAnswers = shuffleArray([...question.answers]);
    const correctAnswerIndex = question.answers[question.correct];
    const newCorrectIndex = shuffledAnswers.indexOf(correctAnswerIndex);
    
    // Réinitialiser les boutons avec les réponses mélangées
    answerBtns.forEach((btn, index) => {
        btn.className = 'answer-btn';
        btn.querySelector('.answer-text').textContent = shuffledAnswers[index];
        btn.dataset.correctIndex = newCorrectIndex; // Stocker le nouvel index de la bonne réponse
        btn.disabled = false;
        // Retirer la classe selected si elle existe
        btn.classList.remove('selected');
    });
    
    // Désactiver le bouton suivant
    nextBtn.disabled = true;
    
    // Démarrer le timer
    startTimer();
}

function startTimer() {
    timerText.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

function timeUp() {
    clearInterval(timer);
    
    // Si aucune réponse n'a été sélectionnée, considérer comme incorrecte
    if (selectedAnswer === null) {
        selectedAnswer = -1;
        
        // Enregistrer la réponse "timeout" pour la sauvegarde locale
        const correctIndex = parseInt(answerBtns[0].dataset.correctIndex);
        userAnswers[currentQuestionIndex] = {
            questionIndex: currentQuestionIndex,
            selectedAnswer: -1, // -1 = Aucune réponse
            correctAnswer: correctIndex,
            isCorrect: false, // Toujours incorrect si pas de réponse
            responseTime: 10, // Temps maximum (10 secondes)
            question: quizQuestions[currentQuestionIndex]
        };
        
        // Ajouter le temps de réponse pour les statistiques
        answerTimes.push(10);
    }
    
    showCorrectAnswer();
}

function selectAnswer(answerIndex) {
    if (selectedAnswer !== null) return; // Empêcher la sélection multiple
    
    selectedAnswer = answerIndex;
    clearInterval(timer);
    
    // Ajouter la classe selected pour garder le bouton en bleu
    answerBtns.forEach((btn, index) => {
        if (index === answerIndex) {
            btn.classList.add('selected');
        }
    });
    
    // Calculer le temps de réponse
    const responseTime = Math.round((Date.now() - startTime) / 1000);
    answerTimes.push(responseTime);
    
    // Récupérer le nouvel index de la bonne réponse
    const correctIndex = parseInt(answerBtns[0].dataset.correctIndex);
    
    // Sauvegarder la réponse de l'utilisateur
    userAnswers[currentQuestionIndex] = {
        questionIndex: currentQuestionIndex,
        selectedAnswer: answerIndex,
        correctAnswer: correctIndex, // Utiliser le nouvel index
        isCorrect: answerIndex === correctIndex, // Comparer avec le nouvel index
        responseTime: responseTime,
        question: quizQuestions[currentQuestionIndex]
    };
    
    // Désactiver tous les boutons
    answerBtns.forEach(btn => btn.disabled = true);
    
    // Afficher la réponse correcte
    showCorrectAnswer();
}

function showCorrectAnswer() {
    const question = quizQuestions[currentQuestionIndex];
    // Utiliser le nouvel index de la bonne réponse stocké dans le dataset
    const correctIndex = parseInt(answerBtns[0].dataset.correctIndex);
    
    // Ne pas marquer visuellement les réponses - masquer complètement le feedback
    // answerBtns[correctIndex].classList.add('correct');
    
    // Ne pas marquer la réponse sélectionnée si elle est incorrecte
    // if (selectedAnswer !== null && selectedAnswer !== correctIndex) {
    //     answerBtns[selectedAnswer].classList.add('incorrect');
    // }
    
    // Mettre à jour le score en arrière-plan (pour la sauvegarde locale uniquement)
    if (selectedAnswer === correctIndex) {
        score++;
        // Ne pas afficher le score à l'utilisateur
        // scoreElement.textContent = `Score: ${score}`;
    }
    
    // Activer le bouton suivant
    nextBtn.disabled = false;
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= quizQuestions.length) {
        showResults();
    } else {
        loadQuestion();
    }
}

function showResults() {
    // Calculer les statistiques en arrière-plan pour la sauvegarde locale uniquement
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const wrongAnswers = quizQuestions.length - score;
    const avgTime = answerTimes.length > 0 ? Math.round(answerTimes.reduce((a, b) => a + b) / answerTimes.length) : 0;
    
    // Ne pas afficher les statistiques à l'utilisateur
    // finalScoreText.textContent = `${score}/${quizQuestions.length}`;
    // percentageElement.textContent = `${percentage}%`;
    // correctAnswersElement.textContent = score;
    // wrongAnswersElement.textContent = wrongAnswers;
    // avgTimeElement.textContent = `${avgTime}s`;
    
    // Ne pas générer le résumé des réponses
    // generateAnswersSummary();
    
    showScreen(resultsScreen);
    
    // Sauvegarder les résultats dans la base de données locale
    saveResultsToLocalDB(score, avgTime);
}

function restartQuiz() {
    startQuiz();
}

function goToHome() {
    showScreen(startScreen);
}

function showScreen(screen) {
    // Masquer tous les écrans
    startScreen.classList.remove('active');
    quizScreen.classList.remove('active');
    resultsScreen.classList.remove('active');
    
    // Afficher l'écran demandé
    screen.classList.add('active');
}

// Fonction utilitaire pour mélanger un tableau
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Fonction pour sauvegarder les résultats dans la base de données locale
function saveResultsToLocalDB(score, avgTime) {
    try {
        // Calculer les statistiques par catégorie
        const categoryStats = {};
        userAnswers.forEach(answer => {
            const category = answer.question.category;
            if (!categoryStats[category]) {
                categoryStats[category] = { correct: 0, total: 0 };
            }
            categoryStats[category].total++;
            if (answer.isCorrect) {
                categoryStats[category].correct++;
            }
        });
        
        // Préparer les données du résultat
        const resultData = {
            score: score,
            totalQuestions: quizQuestions.length,
            avgTime: avgTime,
            username: username || 'Officier SASP',
            categories: categoryStats,
            userAnswers: userAnswers,
            date: new Date().toISOString()
        };
        
        // Sauvegarder dans le localStorage
        const savedResults = localStorage.getItem('quizResults');
        let results = savedResults ? JSON.parse(savedResults) : [];
        
        results.push(resultData);
        localStorage.setItem('quizResults', JSON.stringify(results));
        
        console.log('✅ Résultats sauvegardés dans la base de données locale');
        
        // Notifier la page d'administration si elle est ouverte
        if (window.opener && window.opener.addQuizResult) {
            window.opener.addQuizResult(resultData);
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde des résultats:', error);
    }
}

 