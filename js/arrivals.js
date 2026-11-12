/* ---------- Arrivals map (arrivals.html) ----------
   Reads data/arrivals.csv: iso3,country,month,arrivals  (month like 2026-06) */
(async function(){
  const map=L.map('map',{worldCopyJump:true}).setView([20,0],2);
  const status=document.getElementById('mapStatus');
  const slider=document.getElementById('month'),label=document.getElementById('monthLabel');
  let data=[];
  try{data=parseCSV(await load('data/arrivals.csv'))}catch(e){}
  const by={};data.forEach(d=>{(by[d.iso3]=by[d.iso3]||{name:d.country})[d.month]=+d.arrivals});
  const months=[...new Set(data.map(d=>d.month).filter(m=>m.startsWith('2026')))].sort();
  if(!months.length){label.textContent="No data yet";status.textContent="Add rows to data/arrivals.csv to see the map shaded.";}
  slider.max=Math.max(months.length-1,0);
  const names=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const colors=[[-50,'#8c2d04'],[-20,'#e6550d'],[-5,'#fdae6b'],[5,'#e5ebe6'],[20,'#74c476'],[50,'#238b45'],[Infinity,'#00441b']];
  const color=p=>p==null?'#d7dcd8':colors.find(c=>p<c[0])[1];
  function change(iso,m){const d=by[iso];if(!d)return null;const prev=(+m.slice(0,4)-1)+m.slice(4);
    return d[m]!=null&&d[prev]?((d[m]-d[prev])/d[prev])*100:null}
  let layer;
  try{
    const geo=await (await fetch('https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json')).json();
    function draw(){
      const m=months[+slider.value];
      if(m)label.textContent=names[+m.slice(5)-1]+" "+m.slice(0,4)+" vs. "+(+m.slice(0,4)-1);
      if(layer)layer.remove();
      layer=L.geoJSON(geo,{
        style:f=>({fillColor:color(m?change(f.id,m):null),weight:.6,color:'#fff',fillOpacity:.9}),
        onEachFeature:(f,l)=>{const p=m?change(f.id,m):null;
          l.bindTooltip(f.properties.name+": "+(p==null?"no data":(p>0?"+":"")+p.toFixed(1)+"%"))}
      }).addTo(map);
    }
    slider.addEventListener('input',draw);draw();
  }catch(e){status.textContent="The country outlines could not load. Check your connection and refresh."}
  const lg=L.control({position:'bottomright'});
  lg.onAdd=()=>{const d=L.DomUtil.create('div','legend');
    d.innerHTML="<strong>Change vs. 2025</strong><br>"+[['#8c2d04','below −50%'],['#e6550d','−50% to −20%'],['#fdae6b','−20% to −5%'],['#e5ebe6','−5% to +5%'],['#74c476','+5% to +20%'],['#238b45','+20% to +50%'],['#00441b','above +50%'],['#d7dcd8','no data']].map(x=>`<i style="background:${x[0]}"></i>${x[1]}`).join('<br>');return d};
  lg.addTo(map);
})();
