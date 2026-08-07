/* ==========================================================================
   PANNEAU SMILEYS DE LA PAGE DE RÉPONSE
   --------------------------------------------------------------------------
   Le panneau "Voir plus de smileys" sous la zone de saisie est un iframe
   séparé (/smilies?mode=smilies_frame) qui charge sa PROPRE feuille de style
   Forumactif, différente de celle du reste du site (22-ltr.css au lieu de
   1-ltr.css). Ni le CSS du site ni un script limité à la page parente n'y
   ont accès par les moyens habituels — d'où ce fichier séparé, indépendant
   de la façon dont le CSS principal est chargé (CDN ou collé sur le forum).

   On injecte donc un thème directement dans le document de l'iframe, et on
   ré-injecte à chaque rechargement : le menu déroulant de catégorie soumet
   un formulaire qui recharge le cadre, ce qui perdrait le style injecté sans
   ce ré-armement.

   Attention à ne PAS ajouter color-scheme:dark ici : ça pousse Chromium à
   re-thématiser lui-même le <select> et écrase nos couleurs — appearance:
   none en !important suffit et donne un rendu correct.
   ========================================================================== */

(function () {
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
