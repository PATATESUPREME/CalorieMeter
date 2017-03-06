Calorie Meter
===============================

Un projet Knockout.js de calcul des calories créé en Mars 2017 par Kévin DESSIMOULIE.

Lien vers le sujet : http://www.unilim.fr/pages_perso/frederic.mora/js/frameworks/

Lien pour essayer l'application :
https://codepen.io/kde/pen/BWKvEX

Installation à partir du git
===============================

L'application est dépendante de plugin externes comme JQuery pour l'intéraction avec le serveur de Nutritionix ou Bootstrap qui fait le rendu de celle-ci, donc il faut penser à être connecté à internet.

Ensuite pour pouvoir mettre en marche l'application, il suffit d'ouvrir le index.html dans un navigateur et c'est partie.

Technologies utilisées
===============================

Knockout 3.2
-------------------------------

Le Calorie Meter est construit à partir du framework Knockout.

![Knockout_logo](https://lh6.googleusercontent.com/h31RtQCIjABL53hOzdebY-CWvc0sJx613sI8PFjF_1dRTh6mQJ031MlBdT-10e1-lFgDNutdNiauGlE0fHIfZp1YZuhBWFQBypk9omaAkJ8qiwts6UkzAd3PQVTEqSBQz5_BaRYR "Knockout logo")

Knockout est une librarie JavaScript qui permet de créer des interfaces utilisateurs riches et responsives avec un modèle de données propre. A chaque fois que vous avez des sections de l'UI qui se met à jour dynamiquement (c'est à dire, l'utilisateur entreprend une action qui va modifier l'état de l'interface ou encore lorsque des données externes changent), Knockout peut vous aider à implémenter cela plus facilement et de façon entretenable.

![Knockout_MVVM](http://dbottiau.azurewebsites.net/content/images/2014/Sep/MVVM-1-.jpg "Knockout MVVM")

Ce framework est composé, comme on peut le voir ci dessus, d'une architecture Model - View - ViewModel. Qui est aussi appelé dans le cas de Knockout Model – View – Binder car il sépare la vue du model par essentiellement un data-binder.

Nutritionix 1.1
-------------------------------

![Nutritionix_logo](https://res.cloudinary.com/crunchbase-production/image/upload/v1397184951/518e8f4e0be1087b30f87c4b55378b54.png "Nutritionix logo")

Nutritionix est une API permettant un accès à une base de données qui recense une grande quantité d'aliment. Ceci permettant un apport externe en données à l'application Calorie Meter et ainsi avoir un jeu d'essai pertinent.

Bootstrap 4
-------------------------------

![Bootstrap_logo](https://speckycdn-sdm.netdna-ssl.com/wp-content/uploads/2016/01/monthly-freebies-january-2016-02.png "Bootstrap logo")

Bootstrap est le framework le plus populaire du monde pour construire des sites et des applications responsifs et/ou mobiles-first. À l'intérieur vous trouverez un HTML, un CSS et un Javascript de grande qualité pour démarrer des projets plus facilement jamais.

JQuery 3.1.1
-------------------------------

![JQuery_logo](https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/JQuery_logo.svg/1280px-JQuery_logo.svg.png "JQuery logo")

JQuery est une librarie Javascript rapide, petite et riche en caractéristique. Il rend des choses comme la manipulation de document HTML et la gestion, le traitement d'événement, l'animation et Ajax beaucoup plus simples avec une API facile à utiliser qui fonctionne à travers une multitude de navigateurs. Avec une combinaison de polyvalence et l'extensibilité, jQuery a changé la façon que les millions personnes écrivent le Javascript.

Tether 1.1
-------------------------------

Tether est une dépendance de Bootstrap 4 principalement pour le rendu des select et de tooltips.

Caractéristiques
===============================

Barre de recherche
-------------------------------

#### Demande

> L'application présente un champ de saisie pour rechercher des aliments sur la base de mots clés.

#### Réalisation

![CalorieMeter_searchBar]("Search Bar")

Résultats d'une recherche
-------------------------------

#### Demande

> Le résultat d'une recherche apparaît sous la forme d'une liste dont les éléments sont sélectionnables.

#### Réalisation

Garde manger
-------------------------------

#### Demande

> Les aliments sélectionnés par l'utilisateur sont placer dans le "garde manger" qui n'est ni plus ni moins que l'ensemble des aliments sélectionnés jusqu'à alors. Les aliments sont ajoutés avec une quantité unitaire par défaut. Mais il est possible de modifier cette quantité pour chaque aliment. Pour chaque aliment, l'apport calorifique est indiqué dynamiquement en tenant compte de la quantité choisie par l'utilisateur. Il est aussi possible de supprimer des aliments du garde manger. Toutes les modifications effectuées sur le garde manger modifie la valeur calorifique totale du garde manger qui est aussi tenue à jour dynamiquement.

#### Réalisation

Navigation
-------------------------------

#### Demande

> Votre application est compatible avec les boutons de navigation (précédent/suivant) du navigateur web.

#### Réalisation

Je n'ai pas fait cette partie car je ne vois pas ce qui peut être fait puisque mon application est sur une seul page.

Profil utilisateur
-------------------------------

#### Demande

> L'application permet à l'utilisateur de choisir son profil afin de déterminer le nombre de calories journalier dont il a idéalement besoin. Pour ce on se basera sur des critères fonctions de l'âge et du sexe de l'utilisateur tel que définis ici : https://fr.wikipedia.org/wiki/Ration_alimentaire

#### Réalisation

Seuil d'alerte
-------------------------------

#### Demande

> L'application alerte l'utilisateur si la valeur calorifique de son garde manger excède l'apport journalier idéal défini par son profil. L'application affiche aussi en permanence combien de calories peuvent être encore ajoutée au garde manger avant d'atteindre le seuil d'alerte.

#### Réalisation

Recherche bornée
-------------------------------

#### Demande

> L'application permet de rechercher des aliments mais en limitant les réponses aux aliments dont la valeur calorifique (unitaire) est inférieur à un maximum choisi par l'utilisateur.

#### Réalisation

Informations complémentaires
-------------------------------

#### Demande

> En plus des calories, l'application calcule (chaque fois que possible) pour chaque aliment et pour l'ensemble du garde manger la quantité de graisses saturées et la quantité de sel (sodium). On mettra également un seuil d'alerte sur le sel sachant que l'OMS préconise un apport journalier inférieur à 5 grammes.

#### Réalisation
