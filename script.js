const IMG={
  "bd": "images/butter_duo_pink_n_yellow.jpg",
  "bp": "images/butter_pink.jpg",
  "by": "images/butter_yellow.jpg",
  "cd": "images/cheese_squishy_pink_n_yellow.jpg",
  "cp": "images/cheese_squishy_pink.jpg",
  "cy": "images/cheese_squishy_yellow.jpg",
  "c1": "images/crossant_squishy_1.jpg",
  "c2": "images/crossant_squishy_2.jpg",
  "p1": "images/pandesal_squishy_1.jpg",
  "p2": "images/pansedal_2.jpg",
  "b1": "images/pineapple_bun_1_squishy.jpg",
  "bpk": "images/pineapple_bun_pink_squishy.jpg",
  "byl": "images/pineapple_bun_yellow_squishy.jpg"
};
const peso=n=>'₱'+Math.round(n).toLocaleString('en-PH');
const P=[
{id:'butter',name:'Butter Stick Squishy',d:'Soft 4 oz stick with a real salted-butter label.',v:[['Yellow',99,['by']],['Pink',99,['bp']],['Duo Set',179,['bd']]]},
{id:'cheese',name:'Cheese Cube Squishy',d:'Chunky cheese block with deep holes you can squeeze.',v:[['Yellow',129,['cy']],['Pink',129,['cp']],['Duo Set',239,['cd']]]},
{id:'croissant',name:'Jumbo Croissant',d:'Golden, slow-rising and big enough for two hands.',v:[['Classic',149,['c1','c2']]]},
{id:'pandesal',name:'Pandesal Loaf',d:'Soft bread block with a pressable, doughy middle.',v:[['Single',79,['p1','p2']]]},
{id:'pine',name:'Pineapple Bun',d:'Cross-hatched crust, round and satisfying to squish.',v:[['Classic',119,['b1']],['Pink',129,['bpk']],['Golden',129,['byl']]]}
];
let cart={};try{cart=JSON.parse(localStorage.getItem('sqcart')||'{}')}catch(e){}
const sel={},thumb={};
const $=id=>document.getElementById(id);
function save(){try{localStorage.setItem('sqcart',JSON.stringify(cart))}catch(e){}}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('show'),1800)}

// shop
function card(p){
  const i=sel[p.id]||0,v=p.v[i],t=thumb[p.id]||0;
  return `<article class="card"><div class="ph" data-open="${p.id}" style="cursor:zoom-in"><img src="${IMG[v[2][t]]}" alt="${p.name} ${v[0]}">${v[2].length>1?`<div class="th">${v[2].map((k,j)=>`<button class="${j==t?'on':''}" data-th="${p.id}:${j}" aria-label="Photo ${j+1}"><img src="${IMG[k]}" alt=""></button>`).join('')}</div>`:''}</div>
  <div class="bd"><h3 data-open="${p.id}" style="cursor:pointer">${p.name}</h3><p>${p.d}</p>
  <div class="chips">${p.v.map((x,j)=>`<button class="${j==i?'on':''}" data-v="${p.id}:${j}">${x[0]}</button>`).join('')}</div>
  <div class="price">${peso(v[1])}</div><button class="btn" data-add="${p.id}">Add to cart</button></div></article>`}
function shop(){$('grid').innerHTML=P.map(card).join('')}
$('grid').onclick=e=>{
  const b=e.target.closest('button');if(!b){const o=e.target.closest('[data-open]');if(o)openP(o.dataset.open);return}
  if(b.dataset.v){const[id,j]=b.dataset.v.split(':');sel[id]=+j;thumb[id]=0;shop()}
  else if(b.dataset.th){const[id,j]=b.dataset.th.split(':');thumb[id]=+j;shop()}
  else if(b.dataset.add){const p=P.find(x=>x.id==b.dataset.add),i=sel[p.id]||0,k=p.id+'-'+i;cart[k]=(cart[k]||0)+1;save();draw();toast(p.name+' ('+p.v[i][0]+') added')}
};

// cart
function lines(){return Object.entries(cart).map(([k,q])=>{const[id,i]=k.split('-');const p=P.find(x=>x.id==id),v=p.v[+i];return{k,q,p,v}})}
function draw(){
  const L=lines(),n=L.reduce((a,l)=>a+l.q,0),s=L.reduce((a,l)=>a+l.q*l.v[1],0),sh=s==0||s>=500?0:49;
  $('count').textContent=n;
  $('items').innerHTML=L.length?L.map(l=>`<div class="it"><img src="${IMG[l.v[2][0]]}" alt=""><div><b>${l.p.name}</b><small>${l.v[0]} · ${peso(l.v[1])}</small><div class="q"><button data-m="${l.k}" aria-label="Less">−</button>${l.q}<button data-p="${l.k}" aria-label="More">+</button></div></div><div><b>${peso(l.q*l.v[1])}</b><br><button data-r="${l.k}" style="background:none;border:0;color:var(--blue);cursor:pointer;font-weight:700">Remove</button></div></div>`).join(''):'<div class="empty">Your cart is empty.<br>Add a squishy from the shop.</div>';
  $('sub').textContent=peso(s);$('ship').textContent=s==0?peso(0):sh?peso(sh):'Free';$('tot').textContent=peso(s+sh);
}
$('items').onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.p)cart[d.p]++;if(d.m&&--cart[d.m]<=0)delete cart[d.m];if(d.r)delete cart[d.r];save();draw()};
const dr=o=>{$('drawer').classList.toggle('open',o);$('veil').classList.toggle('open',o);document.body.classList.toggle('lock',o)};
$('open').onclick=()=>dr(true);$('close').onclick=$('veil').onclick=()=>dr(false);
$('clr').onclick=()=>{cart={};save();draw()};
$('co').onclick=()=>{if(!Object.keys(cart).length)return toast('Add something first');cart={};save();draw();dr(false);toast('Order placed! Thank you.')};

// product viewer
let cur=null,sl=[];
function slide(i){const s=$('sl');s.scrollTo({left:i*s.clientWidth,behavior:'smooth'})}
function pm(){
  const i=sel[cur.id]||0,v=cur.v[i],n=Math.round($('sl').scrollLeft/($('sl').clientWidth||1));
  $('mc').innerHTML=cur.v.map((x,j)=>`<button class="${j==i?'on':''}" data-j="${j}">${x[0]}</button>`).join('');
  $('mp').textContent=peso(v[1]);
  $('dots').innerHTML=sl.map((s,k)=>`<i class="${k==n?'on':''}"></i>`).join('');
}
function openP(id){
  cur=P.find(x=>x.id==id);sl=[];
  cur.v.forEach((v,vi)=>v[2].forEach(k=>{if(!sl.some(s=>s.k==k))sl.push({k,vi})}));
  $('mt').textContent=cur.name;$('md').textContent=cur.d;
  $('sl').innerHTML=sl.map(s=>`<img src="${IMG[s.k]}" alt="${cur.name} ${cur.v[s.vi][0]}">`).join('');
  $('pm').classList.add('open');document.body.classList.add('lock');
  const st=Math.max(0,sl.findIndex(s=>s.vi==(sel[id]||0)));
  $('sl').scrollLeft=st*$('sl').clientWidth;pm();
}
function closeP(){$('pm').classList.remove('open');document.body.classList.remove('lock');shop()}
$('sl').onscroll=()=>{
  const n=Math.round($('sl').scrollLeft/($('sl').clientWidth||1)),s=sl[n];
  if(s)sel[cur.id]=s.vi;pm();
};
$('mc').onclick=e=>{const b=e.target.closest('button');if(!b)return;const j=+b.dataset.j;sel[cur.id]=j;slide(Math.max(0,sl.findIndex(s=>s.vi==j)));pm()};
$('pl').onclick=()=>$('sl').scrollBy({left:-$('sl').clientWidth,behavior:'smooth'});
$('pn').onclick=()=>$('sl').scrollBy({left:$('sl').clientWidth,behavior:'smooth'});
$('px').onclick=closeP;
$('pm').onclick=e=>{if(e.target==$('pm'))closeP()};
$('ma').onclick=()=>{const i=sel[cur.id]||0,k=cur.id+'-'+i;cart[k]=(cart[k]||0)+1;save();draw();toast(cur.name+' ('+cur.v[i][0]+') added')};
document.onkeydown=e=>{if(!$('pm').classList.contains('open'))return;if(e.key=='Escape')closeP();if(e.key=='ArrowRight')$('pn').click();if(e.key=='ArrowLeft')$('pl').click()};

document.querySelectorAll('footer [data-open]').forEach(a=>a.onclick=e=>{e.preventDefault();openP(a.dataset.open);});
shop();draw();