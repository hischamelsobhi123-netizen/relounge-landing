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
