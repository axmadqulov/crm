const ST={new:["Yangi","--s-new"],talk:["Aloqada","--s-talk"],offer:["Taklif berilgan","--s-offer"],won:["Yutilgan","--s-won"],lost:["Yo'qotilgan","--s-lost"]};
const KEY="crm_mijozlar_v1";
const seed=[
 {id:1,name:"Dilshod Karimov",co:"Oltin Yo'l MChJ",ph:"+998 90 123 45 67",amt:12000000,st:"talk",note:"Juma kuni qayta qo'ng'iroq qilish"},
 {id:2,name:"Madina Yusupova",co:"Sharq Savdo",ph:"+998 93 555 12 34",amt:8500000,st:"offer",note:"Narx taklifi yuborildi"},
 {id:3,name:"Aziz Rahimov",co:"Tez Logistika",ph:"+998 97 777 00 11",amt:25000000,st:"won",note:""}
];
let data;
try{data=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!Array.isArray(data))data=seed;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}};
const $=id=>document.getElementById(id);
const fmt=n=>(n||0).toLocaleString("ru-RU")+" so'm";
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
$("st").innerHTML=Object.entries(ST).map(([k,v])=>`<option value="${k}">${v[0]}</option>`).join("");
$("f").innerHTML='<option value="">Barcha holatlar</option>'+$("st").innerHTML;
let editId=null;

function render(){
  const q=$("q").value.trim().toLowerCase(),f=$("f").value;
  const rows=data.filter(c=>(!f||c.st===f)&&(!q||[c.name,c.co,c.ph].join(" ").toLowerCase().includes(q)));
  const won=data.filter(c=>c.st==="won").reduce((s,c)=>s+(+c.amt||0),0);
  const open=data.filter(c=>["new","talk","offer"].includes(c.st));
  $("stats").innerHTML=[
    [data.length,"Jami mijozlar"],
    [open.length,"Ochiq bitimlar"],
    [fmt(open.reduce((s,c)=>s+(+c.amt||0),0)),"Kutilayotgan summa"],
    [fmt(won),"Yutilgan summa"]
  ].map(([a,b])=>`<div class="stat"><b>${a}</b><span>${b}</span></div>`).join("");
  $("list").innerHTML=rows.length?rows.map(c=>`
   <div class="row">
     <div><b>${esc(c.name)}</b><small>${esc(c.note)||"&nbsp;"}</small></div>
     <div class="c3">${esc(c.co)}<small>${esc(c.ph)}</small></div>
     <div class="c4">${fmt(c.amt)}</div>
     <div><span class="tag" style="color:var(${ST[c.st][1]})">${ST[c.st][0]}</span></div>
     <div class="acts"><button class="btn ghost sm" data-e="${c.id}">Tahrirlash</button><button class="btn ghost sm" data-d="${c.id}">O'chirish</button></div>
   </div>`).join(""):'<div class="empty">Hech narsa topilmadi. "Yangi mijoz" tugmasi bilan birinchi mijozni qo\'shing.</div>';
}
function open_(c){
  editId=c?c.id:null;
  $("dt").textContent=c?"Mijozni tahrirlash":"Yangi mijoz";
  $("name").value=c?c.name:"";$("co").value=c?c.co:"";$("ph").value=c?c.ph:"";
  $("amt").value=c?c.amt:"";$("st").value=c?c.st:"new";$("note").value=c?c.note:"";
  $("dlg").showModal();
}
$("add").onclick=()=>open_();
$("cancel").onclick=()=>$("dlg").close();
$("form").onsubmit=()=>{
  const o={name:$("name").value.trim(),co:$("co").value.trim(),ph:$("ph").value.trim(),amt:+$("amt").value||0,st:$("st").value,note:$("note").value.trim()};
  if(editId){Object.assign(data.find(c=>c.id===editId),o)}else{data.unshift({id:Date.now(),...o})}
  save();render();
};
$("list").onclick=e=>{
  const t=e.target;
  if(t.dataset.e)open_(data.find(c=>c.id==t.dataset.e));
  if(t.dataset.d&&confirm("Bu mijozni o'chirasizmi?")){data=data.filter(c=>c.id!=t.dataset.d);save();render()}
};
$("q").oninput=render;$("f").onchange=render;
render();
