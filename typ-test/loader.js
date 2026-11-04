/* Lädt eine komplette Seite (HTML) in einen GHL-Custom-Code-Block.
   Einbau in GHL (eine Zeile):
   <script src="https://hischamelsobhi123-netizen.github.io/relounge-landing/typ-test/loader.js" data-page="lp.html"></script>
   Warum: Der GHL-Code-Editor läuft in einem geschützten Rahmen; so muss dort
   nur diese Zeile stehen, und Änderungen an der Seite brauchen kein neues Einfügen. */
(function(){
  var me = document.currentScript;
  var base = me.src.replace(/[^\/]*$/, '');
  var url = base + (me.getAttribute('data-page') || 'lp.html');
  var box = document.createElement('div');
  me.parentNode.insertBefore(box, me);
  document.documentElement.classList.add('js');

  /* Meta-Pixel „Workshop Gewicht“ (687643727168587) für alle Typ-Test-Seiten.
     Ereignisse: PageView überall · ViewContent auf Test-, Mehr- und Termin-Seite ·
     Lead auf der Danke-Seite (= Test abgeschickt) · TypTestStart beim Klick auf „Auswertung starten“.
     So lässt sich „Test angefangen, aber nicht abgeschickt“ als Zielgruppe bauen. */
  var seite = me.getAttribute('data-page') || 'lp.html';
  try {
    if (!window.fbq) {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
    }
    if (!window._typPixel) { fbq('init', '687643727168587'); fbq('track', 'PageView'); window._typPixel = 1; }
    if (seite === 'lp.html') fbq('track', 'ViewContent', {content_name: 'Typ-Test'});
    if (seite === 'termin.html') fbq('track', 'ViewContent', {content_name: 'Typ-Test Termin'});
    if (seite === 'mehr.html') fbq('track', 'ViewContent', {content_name: 'Typ-Test Mehr'});
    if (seite === 'danke.html') fbq('track', 'Lead', {content_name: 'Typ-Test'});
    document.addEventListener('click', function(e){
      if (e.target && e.target.closest && e.target.closest('#tStart')) fbq('trackCustom', 'TypTestStart');
    });
  } catch (e) {}

  fetch(url, {cache: 'no-cache'}).then(function(r){ return r.text(); }).then(function(html){
    var d = new DOMParser().parseFromString(html, 'text/html');
    d.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(function(n){
      document.head.appendChild(n.cloneNode(true));
    });
    Array.prototype.forEach.call(d.body.childNodes, function(n){
      box.appendChild(document.importNode(n, true));
    });
    /* Skripte, die per innerHTML/import kommen, laufen nicht von selbst:
       der Reihe nach neu anlegen, damit die Reihenfolge stimmt. */
    var alte = Array.prototype.slice.call(box.querySelectorAll('script'));
    (function lauf(i){
      if (i >= alte.length) return;
      var alt = alte[i], neu = document.createElement('script');
      Array.prototype.forEach.call(alt.attributes, function(a){ neu.setAttribute(a.name, a.value); });
      if (alt.src) {
        neu.onload = neu.onerror = function(){ lauf(i + 1); };
        alt.parentNode.replaceChild(neu, alt);
      } else {
        neu.text = alt.text;
        alt.parentNode.replaceChild(neu, alt);
        lauf(i + 1);
      }
    })(0);
  });
})();
