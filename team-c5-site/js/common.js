/* Shared helpers used by arrivals.js, tickets.js and cases.js.
   Load this file BEFORE the page's own script. */

function parseCSV(t){
  const rows=[];let r=[],c="",q=false;
  for(let i=0;i<t.length;i++){const ch=t[i];
    if(q){if(ch==='"'&&t[i+1]==='"'){c+='"';i++}else if(ch==='"')q=false;else c+=ch}
    else if(ch==='"')q=true;else if(ch===','){r.push(c);c=""}
    else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&t[i+1]==='\n')i++;r.push(c);c="";if(r.some(x=>x!==""))rows.push(r);r=[]}
    else c+=ch}
  if(c!==""||r.length){r.push(c);rows.push(r)}
  const h=rows.shift()||[];
  return rows.map(x=>Object.fromEntries(h.map((k,i)=>[k.trim(),(x[i]||"").trim()])));
}
const load=u=>fetch(u).then(r=>{if(!r.ok)throw new Error(u);return r.text()});
