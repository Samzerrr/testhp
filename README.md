# 🚔 SASP Quiz 10-20 - Entraînement Complet

## 📋 Description

Ce projet est un quiz d'entraînement complet pour les officiers du SASP (San Andreas State Police) couvrant toutes les **132 positions 10-20** du jeu GTA RP. Le quiz teste la connaissance des lieux et positions géographiques de Los Santos et ses environs.

## ✨ Fonctionnalités

- **132 questions complètes** couvrant tous les secteurs de la carte
- **6 choix de réponses** par question avec images
- **Timer de 30 secondes** par question
- **Envoi automatique des résultats** sur Discord via webhook
- **Statistiques détaillées** par catégorie géographique
- **Interface moderne et responsive**
- **Sauvegarde automatique** des paramètres Discord

## 🗺️ Catégories de Questions

1. **Vinewood (Orange)** - 25 lieux
2. **Sud Los Santos (Rouge)** - 17 lieux
3. **Sud Ouest LS (Jaune)** - 4 lieux
4. **Centre Ville (Rose)** - 22 lieux
5. **Quartier LS (Lime)** - 20 lieux
6. **Marina/Plage (Azur)** - 8 lieux
7. **Mirror Park (Bleu)** - 12 lieux
8. **Del Perro/Vespucci (Vert foncé)** - 20 lieux
9. **Université (Vert)** - 4 lieux

## 🚀 Installation et Utilisation

### 1. Téléchargement
- Téléchargez tous les fichiers du projet
- Ouvrez `index.html` dans votre navigateur web

### 2. Configuration Discord
1. **Envoi automatique :** ✅
   - Les résultats sont envoyés automatiquement sur Discord à la fin du quiz
   - Aucune configuration requise - tout est pré-configuré !
   - Webhook Discord : `https://discord.com/api/webhooks/1404874505754644531/NcWlCVa_5aj8U4sdJZN3R5PS2BpDav4zanG5l7b0fiY1gYKGK8wgXYm2vr0URdUWYb6F`

2. **Personnalisation (optionnelle) :**
   - Entrez votre nom d'utilisateur pour personnaliser les messages Discord
   - Ce nom apparaîtra dans les messages envoyés automatiquement
   - Les paramètres sont sauvegardés automatiquement

### 3. Lancer le Quiz
- Cliquez sur "🚀 Commencer l'Entraînement Complet (Webhook Configuré)"
- Répondez aux 132 questions (30 secondes par question)
- Consultez vos résultats détaillés
- **Les résultats s'envoient automatiquement sur Discord !** 🤖

## 📊 Système de Scoring

- **Score global** : Nombre de bonnes réponses sur 132
- **Performance par catégorie** : Statistiques détaillées par zone géographique
- **Temps de réponse** : Moyenne des temps de réponse
- **Code couleur Discord** :
  - 🟢 Vert : 80% et plus
  - 🟡 Jaune : 60-79%
  - 🔴 Rouge : Moins de 60%

## 🔧 Structure des Fichiers

```
├── index.html          # Interface principale
├── questions.js        # Base de données des 174 questions
├── script.js          # Logique du quiz et envoi Discord
├── style.css          # Styles et design
└── README.md          # Documentation
```

## 📱 Fonctionnalités Discord

### Embed Discord
Le bot envoie un message riche avec :
- Score global et pourcentage
- Temps moyen de réponse
- Performance détaillée par catégorie
- Horodatage de fin de quiz
- Couleur dynamique selon la performance

### Configuration
- **URL Webhook** : Obligatoire pour commencer le quiz
- **Nom d'utilisateur** : Optionnel, personnalise le message Discord
- **Sauvegarde automatique** : Les paramètres sont conservés entre les sessions

## 🎯 Conseils d'Utilisation

1. **Préparation** : Familiarisez-vous avec la carte GTA RP avant de commencer
2. **Temps** : 30 secondes par question, restez concentré
3. **Catégories** : Identifiez les zones où vous avez des difficultés
4. **Pratique** : Refaites le quiz régulièrement pour améliorer vos scores
5. **Discord** : Utilisez l'envoi automatique pour partager vos progrès

## 🛠️ Personnalisation

### Modifier les Questions
- Éditez `questions.js` pour ajouter/modifier des questions
- Format : `{ question, image, answers, correct, category }`

### Modifier le Design
- Éditez `style.css` pour personnaliser l'apparence
- Utilisez les variables CSS pour les couleurs principales

### Modifier la Logique
- Éditez `script.js` pour changer le comportement du quiz
- Modifiez le timer, le système de scoring, etc.

## 🔒 Sécurité

- Les webhooks Discord sont stockés localement dans le navigateur
- Aucune donnée n'est envoyée à des serveurs tiers
- Le quiz fonctionne entièrement côté client

## 📞 Support

Pour toute question ou suggestion d'amélioration :
- Vérifiez que votre webhook Discord est correct
- Assurez-vous que votre navigateur supporte JavaScript ES6+
- Testez avec un webhook de test avant d'utiliser votre serveur principal

## 🎉 Remerciements

Ce quiz a été créé pour la communauté SASP GTA RP afin d'améliorer la formation des officiers aux positions 10-20.

---

**Bonne chance pour votre entraînement, officier ! 🚔✨** 