const $ = id => document.getElementById(id);
const COLORS = ["red","blue","yellow","green"];
const COLOR_NAME = {red:"Merah",blue:"Biru",yellow:"Kuning",green:"Hijau"};
const SYMBOL = {skip:"⊘",reverse:"↻",draw2:"+2",wild:"W",wild4:"+4"};
let mode = "bot", localState = null, playerId = "p0";
let busy = false, hasDrawn = false;
function show(id){$(id).classList.remove("hidden")}
function hide(id){$(id).classList.add("hidden")}
function makeDeck(){
  const deck=[];
  COLORS.forEach(color=>{
    deck.push({color,value:"0"});
    for(let n=1;n<=9;n++){deck.push({color,value:String(n)},{color,value:String(n)});}
    ["skip","reverse","draw2"].forEach(value=>{deck.push({color,value},{color,value});});
  });
  for(let i=0;i<4;i++){deck.push({color:"wild",value:"wild"},{color:"wild",value:"wild4"});}
  return shuffle(deck);
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function drawFrom(state){if(!state.deck.length){if(state.discard.length>1){const top=state.discard.pop();state.deck=shuffle(state.discard);state.discard=[top];}else return {color:COLORS[Math.floor(Math.random()*4)],value:String(Math.floor(Math.random()*10))};}return state.deck.pop();}
function makeState(names, humanCount){
  const s={players:names.map((name,i)=>({id:"p"+i,name,bot:i>=humanCount,hand:[]})),deck:makeDeck(),discard:[],current:0,direction:1,activeColor:"red",winner:null,rankings:[],startedAt:Date.now()};
  s.players.forEach(p=>{for(let i=0;i<7;i++)p.hand.push(drawFrom(s));});
  let first=drawFrom(s);while(first.color==="wild"){s.deck.push(first);s.deck=shuffle(s.deck);first=drawFrom(s);}
  s.discard.push(first);s.activeColor=first.color;
  return s;
}
function topCard(s){return s.discard[s.discard.length-1]}
function canPlay(c,s){return c.color==="wild"||c.color===s.activeColor||c.value===topCard(s).value}
function isRanked(s, player){return (s.rankings||[]).some(r=>r.id===player.id)}
function nextIndex(s,steps=1){
  const n=s.players.length;
  for(let step=0;step<steps;step++){
    let tries=0;
    do { s.current=(s.current+s.direction+n)%n; tries++; }
    while(tries<=n && isRanked(s,s.players[s.current]));
  }
}
function drawN(s,p,n){for(let i=0;i<n;i++)p.hand.push(drawFrom(s))}
function chooseBotColor(p){const counts={red:0,blue:0,yellow:0,green:0};p.hand.forEach(c=>{if(c.color!=="wild")counts[c.color]++;});return Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0]}
function cardLabel(c){return SYMBOL[c.value]||c.value}
function makeCard(c,large=false,disabled=false,onClick=null){
  const el=document.createElement(onClick?"button":"div");el.className="card "+(large?"large ":"")+(c.color==="wild"?"wild":c.color);
  el.innerHTML=`<span>${cardLabel(c)}</span>`;
  if(onClick){el.disabled=disabled;el.addEventListener("click",onClick);}
  return el;
}
function currentUserIndex(s){return 0}
function isMyTurn(s){return s.players[s.current]?.id==="p0"}
function render(s, message=""){
  $("opponents").innerHTML="";
  const me=0;
  s.players.forEach((p,i)=>{
    if(i===me)return;
    const el=document.createElement("div");el.className="opponent"+(i===s.current?" active":"");
    el.innerHTML=`<div class="avatar">${p.bot?"🤖":"🧑‍🎓"}</div><div class="op-name"></div><div class="op-count">${p.hand.length} kartu tersisa</div>`;
    el.querySelector(".op-name").textContent=p.name+(i===s.current?" • GILIRAN":"");
    $("opponents").appendChild(el);
  });
  while($("opponents").children.length<3){const el=document.createElement("div");el.className="opponent";el.innerHTML='<div class="avatar">🎴</div><div class="op-name">Menunggu pemain</div><div class="op-count">—</div>';$("opponents").appendChild(el);}
  $("discard").className="card large "+(topCard(s).color==="wild"?"wild":topCard(s).color);
  $("discard").innerHTML=`<span>${cardLabel(topCard(s))}</span>`;
  $("hand").innerHTML="";
  const mePlayer=s.players[me];
  if(mePlayer)mePlayer.hand.forEach((c,i)=>$("hand").appendChild(makeCard(c,false,!isMyTurn(s)||busy||!canPlay(c,s),()=>humanPlay(i))));
  $("handCount").textContent=(mePlayer?.hand.length||0)+" kartu";
  $("status").textContent=message||(s.winner?`${s.winner} menang!`:isMyTurn(s)?"Giliran kamu! Cocokkan warna atau angka.":`Menunggu giliran ${s.players[s.current]?.name||"pemain"}…`);
  $("drawPile").disabled=!isMyTurn(s)||busy||hasDrawn||!!s.winner;
  $("passButton").disabled=!isMyTurn(s)||busy||!hasDrawn||!!s.winner;
  $("unoButton").disabled=!mePlayer||mePlayer.hand.length>2||!!s.winner;
}
function showGame(title){
  hide("menu");show("game");$("gameTitle").textContent=title;
}
function startBotGame(){
  mode="bot";playerId="p0";hasDrawn=false;busy=false;
  localState=makeState(["Kamu","Bot A","Bot B","Bot C"],1);
  showGame("Lawan Komputer");hide("roomBadge");render(localState,"Giliran kamu! Mulai dengan kartu yang cocok.");
}
function showColorPicker(onPick){
  show("modal");$("modalTitle").textContent="Pilih warna";$("modalText").textContent="Tentukan warna aktif berikutnya.";
  show("colorChoices");hide("modalClose");
  $("colorChoices").querySelectorAll("[data-color]").forEach(b=>b.onclick=()=>{hide("modal");onPick(b.dataset.color);});
}
function showNotice(title,msg){
  show("modal");$("modalTitle").textContent=title;$("modalText").textContent=msg;hide("colorChoices");show("modalClose");
}
function showPodium(s){
  const ranks=s.rankings||[];
  const lines=ranks.slice(0,3).map((r,i)=>["🥇","🥈","🥉"][i]+" Juara "+(i+1)+": "+r.name);
  showNotice("🏆 Podium UNO",lines.join("\n")+"\n\nTekan Tutup, lalu Mulai Ulang untuk bermain lagi.");
}
$("modalClose").addEventListener("click",()=>hide("modal"));
function commitPlay(s,pi,idx,color){
  const p=s.players[pi],c=p.hand.splice(idx,1)[0];s.discard.push(c);s.activeColor=c.color==="wild"?color:c.color;
  let msg=`${p.name} memainkan ${c.color==="wild"?"Wild":COLOR_NAME[c.color]+" "+cardLabel(c)}.`;
  if(!p.hand.length){
    s.rankings=s.rankings||[];
    if(!s.rankings.some(r=>r.id===p.id)) s.rankings.push({id:p.id,name:p.name,rank:s.rankings.length+1});
    msg+=` ${p.name} mendapat peringkat ${s.rankings.length}!`;
    if(s.rankings.length>=3){s.winner=s.rankings[0].name;return msg+" Podium sudah lengkap!";}
    nextIndex(s,1);
    return msg+" Permainan berlanjut untuk menentukan podium.";
  }
  if(c.value==="skip"){nextIndex(s,2);msg+=" Giliran berikutnya dilewati.";}
  else if(c.value==="reverse"){s.direction*=-1;nextIndex(s,1);msg+=" Arah permainan berbalik.";}
  else if(c.value==="draw2"){nextIndex(s,1);drawN(s,s.players[s.current],2);msg+=` ${s.players[s.current].name} mengambil 2 kartu.`;nextIndex(s,1);}
  else if(c.value==="wild4"){nextIndex(s,1);drawN(s,s.players[s.current],4);msg+=` ${s.players[s.current].name} mengambil 4 kartu.`;nextIndex(s,1);}
  else nextIndex(s,1);
  return msg+` Warna aktif: ${COLOR_NAME[s.activeColor]}.`;
}
function botPlay(){
  if(mode!=="bot"||busy||localState.winner)return;
  const s=localState,p=s.players[s.current];
  if(!p?.bot)return;
  busy=true;
  setTimeout(()=>{
    const options=p.hand.map((c,i)=>({c,i})).filter(x=>canPlay(x.c,s));
    let msg;
    if(options.length){
      options.sort((a,b)=>({wild4:6,draw2:5,skip:4,reverse:3,wild:2}[b.c.value]||0)-({wild4:6,draw2:5,skip:4,reverse:3,wild:2}[a.c.value]||0));
      const ch=options[0],color=ch.c.color==="wild"?chooseBotColor(p):ch.c.color;
      msg=commitPlay(s,s.current,ch.i,color);
    }else{
      drawN(s,p,1);msg=p.name+" mengambil satu kartu.";
      const idx=p.hand.length-1,c=p.hand[idx];
      if(canPlay(c,s)){msg+=" Kartu itu langsung dimainkan.";msg=commitPlay(s,s.current,idx,c.color==="wild"?chooseBotColor(p):c.color);}
      else nextIndex(s,1);
    }
    busy=false;render(s,msg);
    if(!s.winner&&s.players[s.current]?.bot)botPlay();
    if(s.winner)showPodium(s);
  },700);
}
function humanPlay(idx){
  if(busy)return;
  const s=localState,pi=currentUserIndex(s);
  if(!s||!isMyTurn(s))return;
  const c=s.players[pi].hand[idx];if(!canPlay(c,s))return;
  const finish=color=>{
    const msg=commitPlay(s,pi,idx,color);hasDrawn=false;
    render(s,msg);
    if(!s.winner&&s.players[s.current]?.bot)botPlay();
    if(s.winner)showPodium(s);
  };
  if(c.color==="wild")showColorPicker(finish);else finish(c.color);
}
function humanDraw(){
  const s=localState,pi=s?currentUserIndex(s):-1;
  if(!s||pi<0||!isMyTurn(s)||hasDrawn||s.winner||busy)return;
  drawN(s,s.players[pi],1);hasDrawn=true;
  const drawn=s.players[pi].hand[s.players[pi].hand.length-1];
  const msg=canPlay(drawn,s)?"Kartu yang diambil bisa dimainkan, atau tekan Lewati giliran.":"Kartu diambil. Tekan Lewati giliran.";
  render(s,msg);
  
}
function humanPass(){
  const s=localState,pi=s?currentUserIndex(s):-1;
  if(!s||pi<0||!isMyTurn(s)||!hasDrawn||s.winner)return;
  hasDrawn=false;nextIndex(s,1);
  render(s,"Kamu melewati giliran.");if(s.players[s.current]?.bot)botPlay();
}
$("drawPile").addEventListener("click",humanDraw);
$("passButton").addEventListener("click",humanPass);
$("unoButton").addEventListener("click",()=>{const s=localState;if(s)render(s,"UNO! Tinggal sedikit kartu—semangat!");});
$("botMode").addEventListener("click",startBotGame);
$("exitGame").addEventListener("click",()=>{hide("game");show("menu");busy=false;hasDrawn=false;});
$("newGame").addEventListener("click",startBotGame);
