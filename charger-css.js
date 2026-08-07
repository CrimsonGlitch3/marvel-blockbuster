/* ==========================================================================
   CHARGEMENT DU CSS DEPUIS GITHUB
   --------------------------------------------------------------------------
   Un @import dans le champ CSS de Forumactif est ignoré : Forumactif place
   ce champ après tout son propre CSS généré (thème, barre d'outils...) dans
   le fichier final, or la règle CSS exige qu'@import soit la toute première
   instruction du fichier. On charge donc la feuille externe via JS.

   On récupère le CSS via fetch({cache:'no-store'}) et on l'injecte dans un
   <style>, plutôt que d'utiliser un simple <link href="...">. Un <link>
   serait mis en cache par CHAQUE navigateur visiteur indépendamment du CDN :
   même après une purge jsDelivr, les visiteurs ayant déjà chargé la page une
   fois continueraient de voir l'ancienne version tant que leur propre cache
   ne s'invalide pas. {cache:'no-store'} force une requête réseau fraîche à
   chaque chargement de page ; seul le cache du CDN jsDelivr reste à purger
   après un push (voir la routine de mise à jour du design), ce qui est fait
   côté GitHub, pas depuis le forum.
   ========================================================================== */

(function () {
  var URL_CSS = 'https://cdn.jsdelivr.net/gh/CrimsonGlitch3/marvel-blockbuster@main/design.css';

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
