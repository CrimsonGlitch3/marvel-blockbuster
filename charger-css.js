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

  /* ------------------------------------------------------------------------
     PANNEAU SMILEYS DE LA PAGE DE RÉPONSE
     --------------------------------------------------------------------------
     Le panneau "Voir plus de smileys" sous la zone de saisie est un iframe
     séparé (/smilies?mode=smilies_frame) qui charge sa PROPRE feuille de
     style Forumactif, différente de celle du reste du site. Ni notre CSS, ni
     ce script (chargé uniquement dans la page parente) n'y ont accès par les
     moyens habituels. On y injecte donc un thème directement dans le document
     de l'iframe, et on ré-injecte à chaque rechargement (le menu déroulant de
     catégorie soumet un formulaire qui recharge l'iframe).

     Attention à ne PAS ajouter color-scheme:dark ici : ça pousse Chromium à
     re-théma­tiser lui-même le <select> et écrase nos couleurs — appearance:
     none en !important suffit et donne un rendu correct.
     ------------------------------------------------------------------------ */
  function themerSmileys(doc) {
    if (!doc || !doc.head || doc.getElementById('theme-smilies')) return;
    var style = doc.createElement('style');
    style.id = 'theme-smilies';
    style.textContent =
      'html, body { background-color: #121111 !important; }' +
      '#smilies_header { background-color: #191818 !important; border-bottom: 1px solid #424242 !important; }' +
      '#smilies_header select {' +
        '-webkit-appearance: none !important;' +
        'appearance: none !important;' +
        'background-color: #191818 !important;' +
        'background-image: none !important;' +
        'color: #C5A96B !important;' +
        'border: 1px solid #424242 !important;' +
        'border-radius: 3px;' +
        "font-family: 'Roboto Condensed', sans-serif !important;" +
        'font-size: 11px;' +
        'padding: 2px 6px;' +
      '}' +
      'table, td.row1, td.row2 { background-color: #191818 !important; border: 0 !important; }';
    doc.head.appendChild(style);
  }

  function surveillerSmileys() {
    var conteneur = document.getElementById('smileyContainer');
    if (!conteneur) return;
    var cadre = conteneur.querySelector('iframe');
    if (!cadre) return;

    cadre.addEventListener('load', function () {
      try { themerSmileys(cadre.contentDocument); }
      catch (e) { /* cross-origin improbable ici, on abandonne sans bruit */ }
    });
    try { themerSmileys(cadre.contentDocument); } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', surveillerSmileys);
  } else {
    surveillerSmileys();
  }
})();
