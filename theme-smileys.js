/* ==========================================================================
   PANNEAU SMILEYS (page de réponse ET réponse rapide)
   --------------------------------------------------------------------------
   Le sélecteur de smileys est un iframe séparé (/smilies?mode=smilies_frame)
   qui charge sa PROPRE feuille de style Forumactif, différente de celle du
   reste du site (22-ltr.css au lieu de 1-ltr.css). Ni le CSS du site ni un
   script limité au document principal n'y ont accès par les moyens
   habituels — d'où ce fichier séparé, indépendant de la façon dont le CSS
   principal est chargé (CDN ou collé sur le forum).

   Deux endroits différents utilisent cet iframe, avec un cycle de vie
   différent :
     - la page de réponse classique (posting.php) : l'iframe existe déjà
       dans le HTML au chargement de la page ;
     - la réponse rapide en bas d'un sujet : l'iframe n'existe pas au
       chargement, elle est créée dynamiquement par SCEditor seulement quand
       on clique sur le bouton smiley de la barre d'outils.
   On détecte donc TOUTE iframe de smileys par son attribut src (peu importe
   son conteneur ou son id), à la fois celles déjà présentes et celles
   ajoutées plus tard via un MutationObserver. Et comme le menu déroulant de
   catégorie recharge l'iframe (donc reset son contenu), on réinjecte le
   thème à chaque évènement 'load', pas seulement à la création.

   Attention à ne PAS ajouter color-scheme:dark dans le CSS injecté : ça
   pousse Chromium à re-thématiser lui-même le <select>, ce qui écrase nos
   couleurs. appearance: none en !important suffit et donne un rendu correct.
   ========================================================================== */

(function () {

  function themerDocument(doc) {
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

  function estIframeSmileys(cadre) {
    return cadre.tagName === 'IFRAME' &&
           /\/smilies(\?|$)/.test(cadre.getAttribute('src') || '');
  }

  function surveillerIframe(cadre) {
    cadre.addEventListener('load', function () {
      try { themerDocument(cadre.contentDocument); }
      catch (e) { /* cross-origin improbable ici, on abandonne sans bruit */ }
    });
    try { themerDocument(cadre.contentDocument); } catch (e) {}
  }

  function demarrer() {
    /* Iframes déjà présentes (page de réponse classique) */
    document.querySelectorAll('iframe').forEach(function (cadre) {
      if (estIframeSmileys(cadre)) surveillerIframe(cadre);
    });

    /* Iframes créées plus tard (popup de la réponse rapide, au clic) */
    var observateur = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (noeud) {
          if (noeud.nodeType !== 1) return;
          if (estIframeSmileys(noeud)) { surveillerIframe(noeud); return; }
          if (!noeud.querySelectorAll) return;
          noeud.querySelectorAll('iframe').forEach(function (cadre) {
            if (estIframeSmileys(cadre)) surveillerIframe(cadre);
          });
        });
      });
    });
    observateur.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }

})();
