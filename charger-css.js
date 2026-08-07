/* ==========================================================================
   CHARGEMENT DU CSS DEPUIS GITHUB
   --------------------------------------------------------------------------
   Un @import dans le champ CSS de Forumactif est ignoré : Forumactif place
   ce champ après tout son propre CSS généré (thème, barre d'outils...) dans
   le fichier final, or la règle CSS exige qu'@import soit la toute première
   instruction du fichier. On charge donc la feuille externe via JS.

   On récupère le CSS via fetch({cache:'no-store'}) et on l'injecte dans un
   <style>, plutôt que d'utiliser un simple <link href="...">. Un <link>
   serait mis en cache par CHAQUE navigateur visiteur : les visiteurs ayant
   déjà chargé la page une fois continueraient de voir l'ancienne version
   tant que leur propre cache ne s'invalide pas. {cache:'no-store'} force une
   requête réseau fraîche à chaque chargement de page.

   Source : raw.githubusercontent.com et NON le CDN jsDelivr. jsDelivr met en
   cache l'alias de branche @main de façon très agressive : il a servi une
   version périmée pendant des heures malgré des purges répondant "finished",
   et un paramètre anti-cache ne le contourne pas. raw.githubusercontent
   renvoie cache-control: max-age=300, soit 5 minutes de décalage maximum et
   aucune purge à faire après un push.
   Le type MIME text/plain renvoyé par raw n'a aucune importance ici : on lit
   le texte et on l'injecte nous-mêmes dans un <style>.
   ========================================================================== */

(function () {
  var URL_CSS = 'https://raw.githubusercontent.com/CrimsonGlitch3/marvel-blockbuster/main/design.css';

  fetch(URL_CSS, { cache: 'no-store' })
    .then(function (reponse) { return reponse.text(); })
    .then(function (css) {
      var style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    })
    .catch(function () {
      /* Secours si le fetch échoue (réseau, CORS...) : on retombe sur un
         <link> classique, mis en cache mais toujours mieux que rien. */
      var lien = document.createElement('link');
      lien.rel  = 'stylesheet';
      lien.href = URL_CSS;
      document.head.appendChild(lien);
    });
})();
