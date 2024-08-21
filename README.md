# jeu_piste-backend

movde to nextJs [https://github.com/PlaySorbonne/glyph](https://github.com/PlaySorbonne/glyph)

## Question

- Conditionner l'accès aux quêtes aux heures où c'est possible de les faire ou les afficher et dire "c'est possible de les faire que entre x et x"

- Juste pour vérifier, il n'y pas besoin de lier un NPC à une quête, il faut juste afficher les images NPC qui peuvent donner des quêtes ?


## Liste de features

### le jeu

- [X] Pouvoir créer un compte
 - [ ] Rajouter des connexions tier (discord, google...)
 - [X] l'ajout de mot de passe & mail est optionnel
- [X] Pouvoir se connecter
 - [ ] Si mdp existe, connexion avec mdp seulement
- [X] Pouvoir se déconnecter
- [ ] Pouvoir choisir sa fraternité
  - [ ] Quizz pour selectionner sa fraternité (pas une priorité)
  - [ ] Endpoint qui attribue la fraternité avec le moins de personne, si égalité, random
- [ ] Pouvoir voir les quêtes (auquel on a accès)
- [ ] Afficher les npcs qui peuvent donner des quêtes

### Les quetes

- [ ] Ont potentiellement une date de fin & une date de début
- [ ] peuvent être global ou pas (c'est à dire que tout le monde peut la voir ou pas)
- [ ] si non global, qrcode pour accéder à la quête (pas une priorité/sera jamais fait)
- [ ] qrcode pour finir la quête (attribue les points au joueur et donc à la fraternité)


### Interface ADMIN

- [ ] ajouter une quête (titre, description, points, ...)
- [ ] ajouter des étapes à une quête (titre, description, points, ...) ( vraiment pas une priorité )
- [ ] Générer des qrcode pour :
  - [ ] accéder aux quêtes non globales (pas une pririté/sera jamais fait)
  - [ ] finir les quêtes
  - [ ] ajouter x points à une personne
- [ ] Ajouter des Admin
- [ ] Ajouter des NPCs
 - [ ] Pouvoir toggle les afficher ou pas sur le site facilement
- [ ] Modifier les points d'une personne

### DEV

- [ ] Ajouter un système de log (surtout comment x personne a gagné x points) (pas une priorité)

### Frontend

*dans l'instant TheGame*

- [ ] pouvoir modifier facilement la description (ou certain texte de la frontend) (un peu overkill mais bon, facilité >)

## Routes
