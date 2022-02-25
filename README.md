# AquilAppEx

Pour lancer le projet, lancez npm start dans le fichier serveur ainsi que dans le fichier client.<br>
Pour le bon fonctionnement le port 3000 et 3001 doivent être libre.<br>

Une fois le site ouvert, voici son fonctionnement:
- Le premier bloc permet d'ajouter un utilisateur à l'aide de son email<br>
<strong><!>Attention<!></strong> L'entrée de texte ne prend que des emails, un simple mot ne suffit pas<br>
Il est ensuite possible de renseigner une indisponibilité pour l'utilisteur concerné en séléctionnant la date de son début d'indisponiblité ainsi que la date de fin.<br>
<strong><!>Attention<!></strong> Mettre la date de fin avant celle de début ne fonctionnera pas, tout comme ne renseigner qu'une seule des deux dates<br>
Il est néanmoins possible de ne renseigner aucune des deux dates lors de la création d'un utilisateur<br>

- Le second bloc, permet d'afficher (refresh) la liste des utilisateurs ajoutés avec leurs indisponibilités<br>

- Le troisième bloc permet d'ajouter une réunion avec un nombre illimité d'utilisateurs et un nom de réunion unique<br>
<strong><!>Attention<!></strong> Une réunion ne peut être crée qu'avec des utilisteurs déja ajoutés avec le premier bloc<br>
<strong><!>Attention<!></strong> Elle ne peut également être crée que si elle a un nom unique (c'est à dire encore non utilisé)<br>

- Le dernier bloc, permet d'afficher (refresh) la liste des réunions ajoutées<br>

Pour accéder à la documentation de la base de données, il faut ouvrir le fichier "index.html" dans le dossier "UML Documents" à la racine
