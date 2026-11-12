/* ---------- Ticket prices (tickets.html) ----------
   Reads data/tickets.csv: date,category,price_usd,source */
(async function(){
  const s=document.getElementById('ticketStatus');
  let rows=[];try{rows=parseCSV(await load('data/tickets.csv'))}catch(e){}
  if(!rows.length){s.textContent="No ticket data yet. Add rows to data/tickets.csv.";return}
  const dates=[...new Set(rows.map(r=>r.date))].sort();
  const cats=[...new Set(rows.map(r=>r.category))];
  const pal=['#1f6b4a','#c23b2e','#d9a520','#14202b','#5b7fa6','#8a5a9e'];
  new Chart(document.getElementById('ticketChart'),{type:'line',
    data:{labels:dates,datasets:cats.map((c,i)=>({label:c,borderColor:pal[i%pal.length],backgroundColor:pal[i%pal.length],tension:.2,
      data:dates.map(d=>{const r=rows.find(x=>x.date===d&&x.category===c);return r?+r.price_usd:null})}))},
    options:{spanGaps:true,scales:{y:{title:{display:true,text:"Price (USD)"}}}}});
})();
