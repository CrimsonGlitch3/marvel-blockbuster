/* ==========================================================================
   CHARGEMENT DE LA PAGE D'ACCUEIL DEPUIS GITHUB
   --------------------------------------------------------------------------
   Même principe que charger-css.js : le contenu vit sur GitHub et le forum
   va le chercher, ce qui évite de recoller la PA dans le panneau
   d'administration à chaque retouche.

   Le message d'accueil (Panneau d'administration > Affichage > Accueil >
   Message général) ne contient plus que le conteneur :

       <div id="pa-distante"></div>

   Tout HTML laissé à l'intérieur de ce conteneur sert de repli : il reste
   affiché tel quel si GitHub est injoignable, et n'est remplacé qu'une fois
   le fichier distant reçu. Y coller une copie de la PA est donc une
   sécurité, pas une obligation.

   fetch({cache:'no-store'}) et raw.githubusercontent plutôt qu'un CDN, pour
   les mêmes raisons que dans charger-css.js : jsDelivr sert l'alias de
   branche @main de façon très agressive, raw renvoie max-age=300, soit 5
   minutes de décalage au pire et aucune purge à faire après un push.

   Le fichier distant est PA.php : l'extension n'a aucune importance ici,
   raw.githubusercontent renvoie du texte brut et ne l'exécute jamais. Elle
   est conservée pour que le dépôt et le dossier de travail portent le même
   nom de fichier, et qu'il n'y ait donc qu'une seule source.

   À ne garder que le temps du développement : la PA n'existe alors plus
   dans le HTML servi par Forumactif, elle n'est ni indexée ni visible sans
   JavaScript. Une fois la mise en page figée, recoller le contenu dans le
   message d'accueil et retirer ce script.
   ========================================================================== */

(function () {
  var URL_PA = 'https://raw.githubusercontent.com/CrimsonGlitch3/marvel-blockbuster/main/PA.php';

  function charger() {
    var cible = document.getElementById('pa-distante');

    /* Le script est chargé sur toutes les pages du forum ; ailleurs que sur
       l'index, le conteneur n'existe pas et il n'y a rien à faire. */
    if (!cible) return;

    fetch(URL_PA, { cache: 'no-store' })
      .then(function (reponse) {
        if (!reponse.ok) throw new Error(reponse.status);
        return reponse.text();
      })
      .then(function (html) {
        cible.innerHTML = html;
      })
      .catch(function () {
        /* Échec réseau : on laisse en place le repli éventuel plutôt que de
           vider la page d'accueil. */
      });
  }

  /* Forumactif peut insérer ce script avant comme après le corps de la page
     selon l'emplacement choisi dans la gestion des codes JavaScript : on
     attend le DOM si besoin, au lieu de dépendre de ce réglage. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', charger);
  } else {
    charger();
  }
})();
