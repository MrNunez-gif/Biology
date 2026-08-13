const rooms=[
{theme:"jungle",icon:"🌴",name:"The Expedition",title:"Room 1 — Read the Mission",kind:"mission"},
{theme:"camp",icon:"🎒",name:"The Supply Camp",title:"Room 2 — Choose Your Five",kind:"resources"},
{theme:"storm",icon:"🛡️",name:"The Decision Tent",title:"Room 3 — Defend Your Decision",kind:"defend"},
{theme:"lab",icon:"🌧️",name:"The Storm Lab",title:"Room 4 — Adapt to Change",kind:"adapt"},
{theme:"risk",icon:"⚠️",name:"The Danger Lab",title:"Room 5 — Calculate Risk",kind:"risk"},
{theme:"team",icon:"👥",name:"The Team Station",title:"Room 6 — Compare & Rethink",kind:"compare"},
{theme:"station",icon:"🔬",name:"The Research Station",title:"Room 7 — Final Reflection",kind:"reflect"}
];

const resources=[
["Water Filter","Filters bacteria and makes water safer to drink."],["First-Aid Kit","Treats injuries and manages minor emergencies."],
["Waterproof Map","Helps navigate terrain and avoid getting lost."],["Flashlight","Provides light and can help signal for help."],
["Rope","Useful for climbing, securing gear, and shelter."],["Thermal Blanket","Retains body heat and helps prevent hypothermia."],
["Solar Charger","Charges devices using sunlight."],["Insect Protection","Reduces insect bites and disease risk."],
["Nutrient-Dense Food","Provides energy for the expedition."],["Rain Collection Sheet","Collects rainwater."],
["Compass","Helps find direction without electronics."],["Field Notebook","Records observations and clues."],
["Water-Testing Kit","Tests water quality."],["Signal Mirror","Reflects sunlight to signal rescuers."],
["Emergency Shelter Material","Builds shelter and protects from weather."]
];

let roomIndex=0,selected=[],riskScores={},seconds=2700,timer=null;
const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(id).classList.add("active")}
function start(){roomIndex=0;selected=[];riskScores={};seconds=2700;clearInterval(timer);timer=setInterval(()=>{seconds=Math.max(0,seconds-1);updateTimer()},1000);show("gameScreen");render()}
function updateTimer(){$("timer")&&($("timer").textContent=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`)}
function render(){
 const r=rooms[roomIndex];$("roomCounter").textContent=`ROOM ${roomIndex+1} / ${rooms.length}`;$("roomCounter2").textContent=`${roomIndex+1} / ${rooms.length}`;$("roomName").textContent=r.name;$("progressBar").style.width=`${roomIndex/rooms.length*100}%`;
 $("room").dataset.theme=r.theme;
 $("room").innerHTML=`<div class="room-inner">${roomHeader(r)}${content(r.kind)}</div>`;bind();
}
function roomHeader(r){return `<div class="room-title"><div><div class="room-number">ROOM ${roomIndex+1} OF ${rooms.length}</div><h2>${r.title}</h2></div><div class="room-icon">${r.icon}</div></div>`}
function gate(correct,nextCode){
 return `<div class="code-reveal hidden" id="reveal"><small>CODE FOR THE NEXT ROOM</small><strong>${nextCode}</strong></div>
 <div class="code-gate"><input id="gateInput" maxlength="10" placeholder="ENTER CODE"><button id="gateBtn">UNLOCK NEXT ROOM</button></div><div id="gateMsg" class="feedback"></div>`
}
function content(kind){
 if(kind==="mission")return `<p class="room-sub">A tropical storm is forming faster than predicted. Communication has failed, supply drops cannot reach you, and conditions are becoming dangerous.</p><div class="paper scenario"><b>YOUR MISSION</b><p>You are field scientists on Isla Verde. Make scientifically informed decisions, manage limited resources, adapt to changing conditions, and reach the safe research station.</p><p><b>Scientist's Rule:</b> Use evidence. Use reasoning. Work as a team. Respect every idea.</p></div><button class="submit" id="solveBtn">I UNDERSTAND THE MISSION</button><div id="feedback" class="feedback"></div>${gate("","SURVIVE")}`;
 if(kind==="resources")return `<p class="room-sub">The supply cache has 15 resources, but your team can carry only five. Choose the five you believe give your team the best chance of reaching the station.</p><div class="paper"><div class="selection">Selected: ${selected.length} / 5</div><div class="choices">${resources.map((x,i)=>`<button class="choice ${selected.includes(i)?"selected":""}" data-res="${i}"><strong>${i+1}. ${x[0]}</strong><small>${x[1]}</small></button>`).join("")}</div><div class="ranklist">${selected.map((i,n)=>`<div class="rank"><b>${n+1}</b><span>${resources[i][0]}</span><span><button data-up="${n}">↑</button> <button data-down="${n}">↓</button></span></div>`).join("")}</div></div><button class="submit" id="solveBtn">LOCK IN MY FIVE</button><div id="feedback" class="feedback"></div>${gate("","CAMP")}`;
 if(kind==="defend")return `<p class="room-sub">A scientist must do more than choose. Defend the team's decision using Claim → Evidence → Reasoning.</p><div class="paper"><b>Claim</b><textarea id="claim" class="field" placeholder="We believe..."></textarea><b>Evidence</b><textarea id="evidence" class="field" placeholder="Our evidence suggests..."></textarea><b>Reasoning</b><textarea id="reasoning" class="field" placeholder="This matters because..."></textarea></div><button class="submit" id="solveBtn">SUBMIT OUR DEFENSE</button><div id="feedback" class="feedback"></div>${gate("","DEFEND")}`;
 if(kind==="adapt")return `<p class="room-sub">The environment has changed. Heavy rain has reduced visibility, caused rising water levels, and made the ground slippery.</p><div class="paper"><h3>How should your plan change?</h3><textarea id="plan" class="field" placeholder="Explain how your plan changes..."></textarea><h3>Which resource should become your highest priority?</h3><div class="options">${selected.map(i=>`<button class="mini" data-priority="${i}">${resources[i][0]}</button>`).join("")}</div><textarea id="why" class="field" placeholder="Why is this resource more important now?"></textarea></div><button class="submit" id="solveBtn">ADAPT OUR PLAN</button><div id="feedback" class="feedback"></div>${gate("","ADAPT")}`;
 if(kind==="risk")return `<p class="room-sub">Rate each risk. Likelihood: 1–5. Impact: 1–5. Risk Score = Likelihood × Impact.</p><div class="paper"><div class="riskgrid">${["Water","Weather","Health","Navigation"].map(k=>`<div class="risk"><b>${k}</b><br>Likelihood <input id="l${k}" type="number" min="1" max="5"><br>Impact <input id="i${k}" type="number" min="1" max="5"><p id="s${k}">Score: —</p></div>`).join("")}</div><button class="submit" id="calcBtn">CALCULATE SCORES</button><div id="riskResult" class="feedback"></div></div><button class="submit" id="solveBtn">LOCK IN THE RISK ANALYSIS</button><div id="feedback" class="feedback"></div>${gate("","RISK")}`;
 if(kind==="compare")return `<p class="room-sub">Another expedition team has a different survival plan. Compare ideas and decide whether new evidence should change your thinking.</p><div class="paper"><textarea id="similar" class="field" placeholder="Two similarities between the plans..."></textarea><textarea id="different" class="field" placeholder="Two differences..."></textarea><textarea id="rethink" class="field" placeholder="One choice you would reconsider and why..."></textarea><p><b>Respectful disagreement:</b> “I see your point, but I think…” • “What evidence supports that?”</p></div><button class="submit" id="solveBtn">RETHINK OUR DECISION</button><div id="feedback" class="feedback"></div>${gate("","THINK")}`;
 return `<p class="room-sub">Before entering the research station, reflect on how your team thought like scientists.</p><div class="paper"><textarea id="strongest" class="field" placeholder="What was your strongest decision?"></textarea><textarea id="evidence" class="field" placeholder="What evidence influenced you?"></textarea><textarea id="team" class="field" placeholder="What did your team teach you?"></textarea><textarea id="different" class="field" placeholder="What would you do differently?"></textarea><textarea id="hope" class="field" placeholder="What do you hope to learn in science this year?"></textarea></div><button class="submit" id="solveBtn">COMPLETE THE EXPEDITION</button><div id="feedback" class="feedback"></div>${gate("","ESCAPE")}`;
}
function bind(){
 document.querySelectorAll("[data-res]").forEach(b=>b.onclick=()=>{let i=+b.dataset.res;if(selected.includes(i))selected=selected.filter(x=>x!==i);else if(selected.length<5)selected.push(i);render()});
 document.querySelectorAll("[data-up]").forEach(b=>b.onclick=()=>move(+b.dataset.up,-1));document.querySelectorAll("[data-down]").forEach(b=>b.onclick=()=>move(+b.dataset.down,1));
 document.querySelectorAll("[data-priority]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-priority]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");b.dataset.chosen="1"});
 $("solveBtn").onclick=solve;
 if($("calcBtn"))$("calcBtn").onclick=calc;
 $("gateBtn").onclick=unlock;
}
function move(i,d){let j=i+d;if(j<0||j>=selected.length)return;[selected[i],selected[j]]=[selected[j],selected[i]];render()}
function solve(){
 let ok=false,msg="";
 if(roomIndex===0){ok=true;msg="Mission accepted. You found the first room code."}
 if(roomIndex===1){ok=selected.length===5;msg=ok?"Five resources selected. Your team can move on.":"Choose exactly five resources."}
 if(roomIndex===2){let a=["claim","evidence","reasoning"].every(id=>$(id)&&$(id).value.trim().length>10);ok=a;msg=ok?"Strong scientific defense recorded.":"Complete all three CER sections with specific reasoning."}
 if(roomIndex===3){let p=$("plan").value.trim().length>15,w=document.querySelector("[data-priority][data-chosen='1']"),y=$("why").value.trim().length>10;ok=p&&w&&y;msg=ok?"Your team adapted to the environmental change.":"Explain your adaptation, choose a priority resource, and justify it."}
 if(roomIndex===4){ok=Object.keys(riskScores).length===4;msg=ok?"Risk analysis recorded.":"Calculate all four risk scores first."}
 if(roomIndex===5){ok=["similar","different","rethink"].every(id=>$(id).value.trim().length>10);msg=ok?"Your team compared evidence and reconsidered its thinking.":"Complete all three comparison/reflection responses."}
 if(roomIndex===6){ok=["strongest","evidence","team","different","hope"].every(id=>$(id).value.trim().length>10);msg=ok?"Final reflection complete. The station is ready.":"Complete each reflection box with a thoughtful response."}
 $("feedback").textContent=msg;$("feedback").className="feedback "+(ok?"good":"bad");
 if(ok){$("reveal").classList.remove("hidden")}
}
function calc(){
 riskScores={};let best=null;["Water","Weather","Health","Navigation"].forEach(k=>{let l=+$("l"+k).value,i=+$("i"+k).value;if(l>=1&&l<=5&&i>=1&&i<=5){let s=l*i;riskScores[k]=s;$("s"+k).textContent="Score: "+s;if(!best||s>best[1])best=[k,s]}});$("riskResult").textContent=best?`Highest current risk: ${best[0]} (${best[1]}).`:"Enter valid 1–5 ratings for every category."}
function unlock(){
 let expected=["SURVIVE","CAMP","DEFEND","ADAPT","RISK","THINK","ESCAPE"][roomIndex];
 let value=$("gateInput").value.trim().toUpperCase();
 if(value!==expected){$("gateMsg").textContent="🔒 Incorrect code. Recheck your answer and try again.";$("gateMsg").className="feedback bad";return}
 if(roomIndex<rooms.length-1){roomIndex++;render();window.scrollTo({top:0,behavior:"smooth"})}else finish();
}
function finish(){clearInterval(timer);$("finalCode").textContent="ISLA-VERDE";$("timeResult").textContent=`Expedition time: ${String(Math.floor((2700-seconds)/60)).padStart(2,"0")}:${String((2700-seconds)%60).padStart(2,"0")}`;show("finishScreen")}
$("startBtn").onclick=start;$("againBtn").onclick=start;$("guideBtn").onclick=()=>document.getElementById("guideModal").classList.remove("hidden");$("closeGuide").onclick=()=>document.getElementById("guideModal").classList.add("hidden");
