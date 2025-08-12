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
let discordWebhook = 'https://discord.com/api/webhooks/1404874505754644531/NcWlCVa_5aj8U4sdJZN3R5PS2BpDav4zanG5l7b0fiY1gYKGK8wgXYm2vr0URdUWYb6F'; // Webhook Discord par défaut
let discordUsername = ''; // Nom d'utilisateur Discord

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
const finalScoreText = document.getElementById('final-score-text');
const percentageElement = document.getElementById('percentage');
const correctAnswersElement = document.getElementById('correct-answers');
const wrongAnswersElement = document.getElementById('wrong-answers');
const avgTimeElement = document.getElementById('avg-time');
const answersList = document.getElementById('answers-list');
const discordWebhookInput = document.getElementById('discord-webhook');
const discordUsernameInput = document.getElementById('discord-username');
const discordStatus = document.getElementById('discord-status');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Événements des boutons
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartQuiz);
    homeBtn.addEventListener('click', goToHome);
    
    // Événements des réponses
    answerBtns.forEach(btn => {
        btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.index)));
    });
    
    // Sauvegarder les paramètres Discord
    discordUsernameInput.addEventListener('input', () => {
        discordUsername = discordUsernameInput.value;
        localStorage.setItem('discordUsername', discordUsername);
    });
    
    // Charger les paramètres sauvegardés
    loadDiscordSettings();
});

// Charger les paramètres Discord sauvegardés
function loadDiscordSettings() {
    // Utiliser directement le webhook par défaut
    discordWebhookInput.value = discordWebhook;
    
    // Charger le nom d'utilisateur sauvegardé si disponible
    const savedUsername = localStorage.getItem('discordUsername');
    if (savedUsername) {
        discordUsernameInput.value = savedUsername;
        discordUsername = savedUsername;
    }
}

// Fonctions principales
function startQuiz() {
    // Utiliser toutes les 122 questions
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
    // Masquer le compteur de questions et le score
    // questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${quizQuestions.length}`;
    // scoreElement.textContent = `Score: ${score}`;
    
    // Masquer la barre de progression
    // const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    // progressFill.style.width = `${progress}%`;
    
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
    
    // Mettre à jour le score en arrière-plan (pour Discord uniquement)
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
    // Calculer les statistiques en arrière-plan pour Discord uniquement
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
    
    // Envoyer automatiquement les résultats sur Discord
    setTimeout(() => {
        sendToDiscord();
    }, 2000); // Attendre 2 secondes pour que l'utilisateur voie ses résultats
}

function generateAnswersSummary() {
    answersList.innerHTML = '';
    
    userAnswers.forEach((userAnswer, index) => {
        const question = userAnswer.question;
        const answerItem = document.createElement('div');
        answerItem.className = `answer-item ${userAnswer.isCorrect ? 'correct' : 'incorrect'}`;
        
        // Utiliser les informations stockées dans userAnswer
        const selectedAnswerText = userAnswer.selectedAnswer >= 0 ? 
            question.answers[userAnswer.selectedAnswer] : 'Aucune réponse';
        const correctAnswerText = question.answers[question.correct]; // Utiliser l'index original
        
        answerItem.innerHTML = `
            <div class="answer-number">${index + 1}</div>
            <div class="answer-content">
                <div class="answer-question">${question.question}</div>
                <div class="answer-details">
                    <strong>Votre réponse:</strong> ${selectedAnswerText}<br>
                    <strong>Réponse correcte:</strong> ${correctAnswerText}<br>
                    <strong>Temps:</strong> ${userAnswer.responseTime}s<br>
                    <strong>Catégorie:</strong> ${question.category}
                </div>
            </div>
            <div class="answer-status ${userAnswer.isCorrect ? 'correct' : 'incorrect'}">
                ${userAnswer.isCorrect ? 'Correct' : 'Incorrect'}
            </div>
        `;
        
        answersList.appendChild(answerItem);
    });
}

// Fonction d'envoi vers Discord
async function sendToDiscord() {
    if (!discordWebhook.trim()) {
        console.error('Webhook Discord non configuré');
        return;
    }
    
    // Afficher le statut d'envoi automatique
    showDiscordStatus('📤 Envoi automatique des résultats sur Discord...', 'loading');
    
    try {
        const embed = createDiscordEmbed();
        
        const response = await fetch(discordWebhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: discordUsername || 'SASP Quiz Bot',
                embeds: [embed]
            })
        });
        
        if (response.ok) {
            showDiscordStatus('✅ Résultats envoyés automatiquement sur Discord !', 'success');
        } else {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi vers Discord:', error);
        showDiscordStatus('❌ Erreur lors de l\'envoi automatique vers Discord', 'error');
    }
}

// Créer l'embed Discord
function createDiscordEmbed() {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const wrongAnswers = quizQuestions.length - score;
    const avgTime = answerTimes.length > 0 ? Math.round(answerTimes.reduce((a, b) => a + b) / answerTimes.length) : 0;
    
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
    
    // Créer le résumé des catégories
    let categorySummary = '';
    Object.entries(categoryStats).forEach(([category, stats]) => {
        const categoryPercentage = Math.round((stats.correct / stats.total) * 100);
        const emoji = categoryPercentage >= 80 ? '🟢' : categoryPercentage >= 60 ? '🟡' : '🔴';
        categorySummary += `${emoji} **${category}**: ${stats.correct}/${stats.total} (${categoryPercentage}%)\n`;
    });
    
    return {
        title: '🎯 Résultats SASP Quiz 10-20',
        description: `**${discordUsername || 'Officier SASP'}** a terminé l'entraînement complet !`,
        color: percentage >= 80 ? 0x2ecc71 : percentage >= 60 ? 0xf39c12 : 0xe74c3c,
        fields: [
            {
                name: '📊 Score Global',
                value: `**${score}/${quizQuestions.length}** (${percentage}%)`,
                inline: true
            },
            {
                name: '⏱️ Temps Moyen',
                value: `**${avgTime} secondes**`,
                inline: true
            },
            {
                name: '📈 Performance par Catégorie',
                value: categorySummary || 'Aucune donnée',
                inline: false
            }
        ],
        footer: {
            text: `Quiz terminé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`
        },
        timestamp: new Date().toISOString()
    };
}

// Afficher le statut Discord
function showDiscordStatus(message, type) {
    discordStatus.textContent = message;
    discordStatus.className = `discord-status ${type}`;
    
    // Effacer le message après 5 secondes
    setTimeout(() => {
        discordStatus.textContent = '';
        discordStatus.className = 'discord-status';
    }, 5000);
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

 