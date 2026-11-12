/* ---------- Denied-entry cases (access.html) ----------
   Reads data/cases.json: a list of {who, country, date, what_happened, source_title, source_url} */
(async function(){
  const box=document.getElementById('caseList');
  let cases=[];try{cases=JSON.parse(await load('data/cases.json'))}catch(e){}
  if(!cases.length){box.innerHTML='<p class="empty">No cases added yet.</p>';return}
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  box.innerHTML=cases.map(c=>`<article class="case"><h3>${esc(c.who)}</h3>
    <div class="meta">${esc(c.country)} · ${esc(c.date)}</div>
    <p>${esc(c.what_happened)}</p>
    <a href="${esc(c.source_url)}">${esc(c.source_title)}</a></article>`).join('');
})();
