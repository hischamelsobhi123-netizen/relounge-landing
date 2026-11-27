/* Lädt eine komplette Seite (HTML) in einen GHL-Custom-Code-Block.
   Einbau in GHL (eine Zeile):
   <script src="https://hischamelsobhi123-netizen.github.io/relounge-landing/typ-test/loader.js" data-page="lp.html"></script>
   Warum: Der GHL-Code-Editor läuft in einem geschützten Rahmen; so muss dort
   nur diese Zeile stehen, und Änderungen an der Seite brauchen kein neues Einfügen. */
(function(){
  var me = document.currentScript;
  var base = me.src.replace(/[^\/]*$/, '');
  /* Kurs v6 (Ramy 17.11. „schalte den neuen kurs on“): Test, Danke und Kurs-Eingang kommen aus v6/.
     Zurück auf die alten Seiten: V6 = false. Eingang Kurs-Anzeigen: data-page="kurs-start.html" oder /typ-test?start=kurs */
  var V6 = true;
  var V6_SEITEN = {'lp.html': 'v6/typ-test.html', 'danke.html': 'v6/danke.html', 'kurs-start.html': 'v6/kurs-start.html'};
  var seiteRoh = me.getAttribute('data-page') || 'lp.html';
  if (V6 && seiteRoh === 'lp.html' && /[?&]start=kurs(&|$)/.test(location.search)) seiteRoh = 'kurs-start.html';
  var url = base + (V6 && V6_SEITEN[seiteRoh] ? V6_SEITEN[seiteRoh] : seiteRoh);

  /* Zwei getrennte Wege (Ramy 26.11. abends: KEINE 50/50-Aufteilung, Seite 2 bekommt eine eigene Kampagne).
     Weg 1 = hischamelsobhi.de/typ-test   → Formular → /typ-test-danke   → v6/danke.html   (für alle wie bisher)
     Weg 2 = hischamelsobhi.de/typ-test-2 → Formular → /typ-test-danke-2 → v6/danke-b.html (nur über die eigene Kampagne)
     Das GHL-Formular leitet immer auf /typ-test-danke. Nur wer den Test auf /typ-test-2 gemacht hat
     (localStorage „typ_weg“ = 2, gesetzt von der Testseite), wird von dort mit allen Angaben auf -2 weitergeleitet.
     Wer danach den normalen Test macht, ist wieder Weg 1. Die Seiten melden danke_variante_a/_b an GHL. */
  var TEST_2 = /\/typ-test-2(\/|$)/.test(location.pathname);
  try { localStorage.removeItem('danke_fassung'); } catch (e) {}  /* alte 50/50-Losung vergessen */
  if (V6 && seiteRoh === 'lp.html') {
    try { localStorage.setItem('typ_weg', TEST_2 ? '2' : '1'); } catch (e) {}
  }
  if (V6 && seiteRoh === 'danke.html') {
    if (/\/typ-test-danke-2(\/|$)/.test(location.pathname)) {
      url = base + 'v6/danke-b.html';
      window.DANKE_FASSUNG = 'b';
    } else {
      var weg = '';
      try { weg = localStorage.getItem('typ_weg') || ''; } catch (e) {}
      if (weg === '2') {
        location.replace(location.pathname.replace(/\/?$/, '') + '-2' + location.search + location.hash);
        return;
      }
      window.DANKE_FASSUNG = 'a';
    }
  }

  /* Ramy 09.11.2026: „Mehr erfahren“ / „So arbeitet Hischam“ führt jetzt in den Kompaktkurs.
     Gilt für den Danke-Knopf, die Lead-WhatsApp und alle Links ohne Sprungmarke.
     Mails springen mit #video (Hischams 5:24-Video) oder #stimmen gezielt auf die alte Seite –
     die bleiben dort. Alte Seite ansehen: /typ-test-mehr?alt=1
     p=0: im Kurs ohne 590-€-Zahl, weil der Lead noch vor dem ersten Anruf steht. */
  if ((me.getAttribute('data-page') || '') === 'mehr.html' && !location.hash && !/[?&]alt=1/.test(location.search)) {
    var mq = (location.search.match(/[?&]m=([^&#]*)/) || [])[1] || '';
    if (!mq) { try { mq = encodeURIComponent((localStorage.getItem('typ_muster') || '').replace(/\+/g, '-')); } catch (e) {} }
    /* 13.11. (Ramy: Typ-Test-Leute duerfen im Kurs nicht noch einmal nach Daten gefragt werden):
       Kontakt-Kennung und Vorname aus dem Link mitnehmen, dann erkennt der Kurs die Person auch in einem anderen Browser. */
    var kq = '';
    [['c','c'],['contact_id','c'],['n','n'],['first_name','n']].forEach(function(p){
      var v = (location.search.match(new RegExp('[?&]' + p[0] + '=([^&#]*)')) || [])[1];
      if (v && !/%7B%7B|\{\{/.test(v) && kq.indexOf('&' + p[1] + '=') < 0) kq += '&' + p[1] + '=' + v;
    });
    location.replace('https://hischamelsobhi.de/kompaktkurs-v7k3?p=0&q=typtest' + (mq ? '&m=' + mq : '') + kq);
    return;
  }

  var box = document.createElement('div');
  me.parentNode.insertBefore(box, me);
  document.documentElement.classList.add('js');

  /* Meta-Pixel „Workshop Gewicht“ (687643727168587) für alle Typ-Test-Seiten.
     Ereignisse: PageView überall · ViewContent auf Test-, Mehr- und Termin-Seite ·
     Lead auf der Danke-Seite (= Test abgeschickt) · TypTestStart beim Klick auf „Auswertung starten“.
     So lässt sich „Test angefangen, aber nicht abgeschickt“ als Zielgruppe bauen. */
  var seite = seiteRoh;
  /* Testmodus (27.11.): ?test=1 oder localhost → kein echter Pixel, keine Meldungen an GHL.
     Gilt für die ganze Sitzung (auch nach der Weiterleitung auf die Ergebnisseite). */
  var TESTMODUS = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || /[?&]test=1(&|$)/.test(location.search);
  try { if (TESTMODUS) sessionStorage.setItem('typ_test', '1'); else if (sessionStorage.getItem('typ_test') === '1') TESTMODUS = true; } catch (e) {}
  window.TYP_TESTMODUS = TESTMODUS;
  if (TESTMODUS) {
    window.fbq = function(){ try { console.log('[Pixel-Testmodus]', [].slice.call(arguments)); } catch (e) {} };
    window._typPixel = 1;
  }
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
    if (seite === 'kurs-start.html') fbq('track', 'ViewContent', {content_name: 'Kurs-Start'});
    if (seite === 'termin.html') fbq('track', 'ViewContent', {content_name: 'Typ-Test Termin'});
    if (seite === 'mehr.html') fbq('track', 'ViewContent', {content_name: 'Typ-Test Mehr'});
    if (seite === 'danke.html') fbq('track', 'Lead', {content_name: 'Typ-Test'});
    /* TypTestStart misst jetzt die Testseite selbst (27.11.: hier kam es wegen stopImmediatePropagation nie an) */
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
