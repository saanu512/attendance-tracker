"use strict";
const START_DATE=new Date(2026,8,7), KEY="attendance-tracker-data", LEGACY_KEYS=["attendance-tracker-data-v10-fresh","attendance-tracker-data-v2","attendance-tracker-data-v1"];
const STATUS={ATTENDED:"attended",ABSENT:"absent",LEAVE:"leave",NOT_HELD:"not_held"};
const CLINICAL_SWITCH=new Date(2027,7,9);
const CLINICAL_OLD=[["G.Medicine","General Surgery","OBG","Pediatrics","ENT","Respiratory Medicine"],["G.Medicine","General Surgery","OBG","Pediatrics","ENT","Respiratory Medicine"],["G.Medicine","General Surgery","OBG","Pediatrics","ENT","Psychiatry"],["G.Medicine","General Surgery","OBG","Pediatrics","ENT","Psychiatry"],["G.Medicine","General Surgery","OBG","Orthopaedics","EYE","Dermatology"],["G.Medicine","General Surgery","OBG","Orthopaedics","EYE","Dermatology"],["G.Medicine","General Surgery","OBG","Orthopaedics","EYE","Anaesthesiology (ICU)"],["G.Medicine","General Surgery","OBG","Orthopaedics","EYE","Anaesthesiology (ICU)"],["General Surgery","OBG","G.Medicine","ENT","Respiratory Medicine","Pediatrics"],["General Surgery","OBG","G.Medicine","ENT","Respiratory Medicine","Pediatrics"],["General Surgery","OBG","G.Medicine","ENT","Psychiatry","Pediatrics"],["General Surgery","OBG","G.Medicine","ENT","Psychiatry","Pediatrics"],["General Surgery","OBG","G.Medicine","EYE","Dermatology","Orthopaedics"],["General Surgery","OBG","G.Medicine","EYE","Dermatology","Orthopaedics"],["General Surgery","OBG","G.Medicine","EYE","Anaesthesiology (ICU)","Orthopaedics"],["General Surgery","OBG","G.Medicine","EYE","Anaesthesiology (ICU)","Orthopaedics"],["OBG","G.Medicine","General Surgery","Respiratory Medicine","Pediatrics","ENT"],["OBG","G.Medicine","General Surgery","Respiratory Medicine","Pediatrics","ENT"],["OBG","G.Medicine","General Surgery","Psychiatry","Pediatrics","ENT"],["OBG","G.Medicine","General Surgery","Psychiatry","Pediatrics","ENT"],["OBG","G.Medicine","General Surgery","Dermatology","Orthopaedics","EYE"],["OBG","G.Medicine","General Surgery","Dermatology","Orthopaedics","EYE"],["OBG","G.Medicine","General Surgery","Anaesthesiology (ICU)","Orthopaedics","EYE"],["OBG","G.Medicine","General Surgery","Anaesthesiology (ICU)","Orthopaedics","EYE"],["Respiratory Medicine","Pediatrics","ENT","OBG","G.Medicine","General Surgery"],["Respiratory Medicine","Pediatrics","ENT","OBG","G.Medicine","General Surgery"],["Psychiatry","Pediatrics","ENT","OBG","G.Medicine","General Surgery"],["Psychiatry","Pediatrics","ENT","OBG","G.Medicine","General Surgery"],["Dermatology","Orthopaedics","EYE","OBG","G.Medicine","General Surgery"],["Dermatology","Orthopaedics","EYE","OBG","G.Medicine","General Surgery"],["Anaesthesiology (ICU)","Orthopaedics","EYE","OBG","G.Medicine","General Surgery"],["Anaesthesiology (ICU)","Orthopaedics","EYE","OBG","G.Medicine","General Surgery"],["ENT","Respiratory Medicine","Pediatrics","General Surgery","OBG","G.Medicine"],["ENT","Respiratory Medicine","Pediatrics","General Surgery","OBG","G.Medicine"],["ENT","Psychiatry","Pediatrics","General Surgery","OBG","G.Medicine"],["ENT","Psychiatry","Pediatrics","General Surgery","OBG","G.Medicine"],["EYE","Dermatology","Orthopaedics","General Surgery","OBG","G.Medicine"],["EYE","Dermatology","Orthopaedics","General Surgery","OBG","G.Medicine"],["EYE","Anaesthesiology (ICU)","Orthopaedics","General Surgery","OBG","G.Medicine"],["EYE","Anaesthesiology (ICU)","Orthopaedics","General Surgery","OBG","G.Medicine"],["Pediatrics","ENT","Respiratory Medicine","G.Medicine","General Surgery","OBG"],["Pediatrics","ENT","Respiratory Medicine","G.Medicine","General Surgery","OBG"],["Pediatrics","ENT","Psychiatry","G.Medicine","General Surgery","OBG"],["Pediatrics","ENT","Psychiatry","G.Medicine","General Surgery","OBG"],["Orthopaedics","EYE","Dermatology","G.Medicine","General Surgery","OBG"],["Orthopaedics","EYE","Dermatology","G.Medicine","General Surgery","OBG"],["Orthopaedics","EYE","Anaesthesiology (ICU)","G.Medicine","General Surgery","OBG"],["Orthopaedics","EYE","Anaesthesiology (ICU)","G.Medicine","General Surgery","OBG"]];
const CLINICAL_NEW=[["General Surgery","OBG","Radiodiagnosis","Emergency Medicine"],["General Surgery","OBG","Radiodiagnosis","Emergency Medicine"],["Emergency Medicine","Radiodiagnosis","OBG","General Surgery"],["Emergency Medicine","Radiodiagnosis","OBG","General Surgery"],["G.Medicine","ENT","Emergency Medicine","Radiodiagnosis"],["G.Medicine","ENT","Emergency Medicine","Radiodiagnosis"],["Radiodiagnosis","Emergency Medicine","ENT","G.Medicine"],["Radiodiagnosis","Emergency Medicine","ENT","G.Medicine"]];
let draftDate=null,draftStatus={};
const SUBJECT_LIST=["AETCOM / Pandemic Module","Anaesthesiology (ICU)","Anaesthesiology (ICU) (Clinical)","Anesthesia","Anesthesia (Evening)","Clinical Posting","Dermatology","Dermatology (Evening)","Dermatology (Clinical)","Emergency Medicine","Emergency Medicine (Evening)","Emergency Medicine (Clinical)","ENT","ENT (Evening)","ENT (Clinical)","EYE","EYE (Evening)","EYE (Clinical)","General Medicine","General Medicine (Evening)","General Medicine (Clinical)","General Surgery","General Surgery (Evening)","General Surgery (Clinical)","Monthly Assessment (Evening)","OBG","OBG (Evening)","OBG (Clinical)","Orthopedics","Orthopedics (Evening)","Orthopedics (Clinical)","Pediatrics","Pediatrics (Evening)","Pediatrics (Clinical)","Psychiatry","Psychiatry (Evening)","Psychiatry (Clinical)","Radiodiagnosis","Radiodiagnosis (Evening)","Radiodiagnosis (Clinical)","Respiratory Medicine","Respiratory Medicine (Evening)","Respiratory Medicine (Clinical)"];
function subjectOptions(selected=""){let opts=SUBJECT_LIST.map(x=>`<option value="${esc(x)}" ${x===selected?"selected":""}>${esc(x)}</option>`).join("");return `<select id="subjectSelect" class="input"><option value="">Select subject</option>${opts}<option value="__OTHER__">Other (type manually)</option></select><div id="otherSubjectWrap" class="hidden"><label class="label">Other subject / activity</label><input id="otherSubject" class="input" placeholder="Type carefully"></div>`}
function selectedSubject(){let sel=document.getElementById("subjectSelect");if(!sel)return "";return sel.value==="__OTHER__"?(document.getElementById("otherSubject")?.value.trim()||""):sel.value}
const DEFAULT_SCHEDULE={1:[["09:00","10:00","General Medicine"],["10:00","11:00","OBG"],["11:00","14:00","Clinical Posting"],["15:00","17:00","General Medicine (Evening)"]],2:[["09:00","10:00","General Medicine"],["10:00","11:00","General Surgery"],["11:00","14:00","Clinical Posting"],["15:00","17:00","OBG (Evening)"]],3:[["09:00","10:00","General Surgery"],["10:00","11:00","Pediatrics"],["11:00","14:00","Clinical Posting"],["15:00","17:00","General Surgery (Evening)"]],4:[["09:00","10:00","ENT"],["10:00","11:00","Psychiatry"],["11:00","14:00","Clinical Posting"],["15:00","16:00","Respiratory Medicine (Evening)"],["16:00","17:00","Pediatrics (Evening)"]],5:[["09:00","10:00","EYE"],["10:00","11:00","Dermatology"],["11:00","14:00","Clinical Posting"],["15:00","16:00","Orthopedics (Evening)"],["16:00","17:00","General Medicine (Evening)"]],6:[["09:00","10:00","OBG"],["10:00","11:00","Orthopedics"],["11:00","12:00","General Surgery"],["12:00","14:00","AETCOM / Pandemic Module"],["15:00","17:00","Monthly Assessment (Evening)"]]};
const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function clone(x){return JSON.parse(JSON.stringify(x))}function pad(n){return String(n).padStart(2,"0")}function key(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}function parseKey(k){let p=k.split("-").map(Number);return new Date(p[0],p[1]-1,p[2])}function add(d,n){let x=new Date(d);x.setDate(x.getDate()+n);return x}function today(){let d=new Date();d.setHours(0,0,0,0);return d}function fmt(d){return d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}function monthFmt(d){return d.toLocaleDateString("en-GB",{month:"long",year:"numeric"})}function time(s){let[h,m]=s.split(":").map(Number),ap=h>=12?"PM":"AM";h=h%12||12;return h+":"+pad(m)+" "+ap}function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function defaultState(){return {status:{},records:{},holidays:{},notes:{},overrides:{},extraClasses:{},tab:"log",viewDate:key(today()),calendarMonth:key(new Date(today().getFullYear(),today().getMonth(),1)),statsFilter:"all",settings:{name:"Sharad Sourav",course:"3rd Prof Part-II",required:75,unlockHour:6,theme:"light",edition:"earth-day",rollNumber:"",rollLocked:false,schedule:clone(DEFAULT_SCHEDULE)}}}
let state=defaultState();
function applyEveningLabels(){let changed=false;Object.values(state.settings.schedule||{}).forEach(a=>(a||[]).forEach(s=>{let h=Number(String(s[0]).slice(0,2));if(h>=15&&!/\s\(Evening\)$/.test(s[2])){s[2]=s[2]+" (Evening)";changed=true}}));return changed}
function migrateLegacyEvening(v){if(typeof v==="string")return v.replace(/\(ALC\)/g,"(Evening)");if(Array.isArray(v))return v.map(migrateLegacyEvening);if(v&&typeof v==="object"){Object.keys(v).forEach(k=>v[k]=migrateLegacyEvening(v[k]));}return v}
function load(){try{let raw=localStorage.getItem(KEY);if(!raw){for(const legacyKey of LEGACY_KEYS){raw=localStorage.getItem(legacyKey);if(raw)break}}if(raw){let parsed=JSON.parse(raw),defs=defaultState();state={...defs,...parsed,status:{...defs.status,...(parsed.status||{})},records:{...defs.records,...(parsed.records||{})},holidays:{...defs.holidays,...(parsed.holidays||{})},notes:{...defs.notes,...(parsed.notes||{})},overrides:{...defs.overrides,...(parsed.overrides||{})},extraClasses:{...defs.extraClasses,...(parsed.extraClasses||{})},settings:{...defs.settings,...(parsed.settings||{})}};migrateLegacyEvening(state);state.settings.unlockHour=6;applyEveningLabels();localStorage.setItem(KEY,JSON.stringify(state));return}}catch(e){console.warn(e)}state=defaultState()}
function save(){const data=JSON.stringify(state);localStorage.setItem(KEY,data)}
function hasSavedRoll(){return !!(state.settings&&state.settings.rollLocked&&/^(?:[1-9]|[1-9][0-9]|100)$/.test(String(state.settings.rollNumber||"")))}
function requireSavedRoll(){if(hasSavedRoll())return true;showAppAlert('Please save your roll number in Settings before marking or saving attendance.', '⚠️ Save Roll Number First');return false}
function applyTheme(){
  const systemDark=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;
  let t=state.settings.theme;
  if(t!=="light"&&t!=="dark"&&t!=="system")t="system";
  const resolved=t==="system"?(systemDark?"dark":"light"):t;
  document.documentElement.setAttribute("data-theme",resolved);
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.setAttribute("content",resolved==="dark"?"#121817":"#F4F6F5");
}
function watchSystemTheme(){
  if(!window.matchMedia)return;
  const media=window.matchMedia("(prefers-color-scheme: dark)");
  const update=()=>{if(state.settings.theme==="system"){applyTheme();render()}};
  if(media.addEventListener)media.addEventListener("change",update);
  else if(media.addListener)media.addListener(update);
}
function editable(k){let d=parseKey(k),t=today();if(d<START_DATE||d>t)return false;if(d.getTime()===t.getTime())return new Date().getHours()>=Number(state.settings.unlockHour||0);return true}
function attendanceEditable(k,i){
  if(!editable(k))return false;
  const d=parseKey(k),t=today(),sk=sessionKey(k,i);
  // Today stays fully editable. For past dates, only the FINAL saved state matters:
  // a class is locked only when it currently has a saved attendance status.
  // If it was cleared and that cleared state was saved before midnight, it remains
  // available for one-time entry as a missed past class.
  if(d<t)return !Object.prototype.hasOwnProperty.call(state.status,sk);
  return true
}
function subjectBase(s){return String(s).replace(/\s\(Evening\)$/," ").replace(/\s\(Clinical\)$/," ").trim()}
function subjectKind(s){return /\(Evening\)$/.test(s)?1:/\(Clinical\)$/.test(s)?2:0}
function subjects(){let set=new Set,raw=[];let scan=d=>sessionsFor(d).forEach(s=>{if(!set.has(s[2])){set.add(s[2]);raw.push(s[2])}});Object.values(state.settings.schedule).forEach(a=>(a||[]).forEach(s=>{if(s[2]!=="Clinical Posting"&&!set.has(s[2])){set.add(s[2]);raw.push(s[2])}}));let cur=new Date(START_DATE),endd=rangeEnd();while(cur<=endd){scan(cur);cur=add(cur,1)};let bases=[];raw.forEach(x=>{let b=subjectBase(x);if(!bases.includes(b))bases.push(b)});return raw.slice().sort((a,b)=>{let ba=subjectBase(a),bb=subjectBase(b),ia=bases.indexOf(ba),ib=bases.indexOf(bb);if(ia!==ib)return ia-ib;return subjectKind(a)-subjectKind(b)})}
function clinicalGroupFor(d){let r=Number(state.settings.rollNumber);if(!Number.isFinite(r)||r<1||r>100)return -1;if(d<CLINICAL_SWITCH)return r<=16?0:r<=32?1:r<=49?2:r<=66?3:r<=83?4:5;return r<=25?0:r<=50?1:r<=75?2:3}
function clinicalDepartmentFor(d){let start=d<CLINICAL_SWITCH?START_DATE:CLINICAL_SWITCH;let arr=d<CLINICAL_SWITCH?CLINICAL_OLD:CLINICAL_NEW;let monday=new Date(d);monday.setHours(0,0,0,0);monday.setDate(monday.getDate()-((monday.getDay()+6)%7));let wk=Math.floor((monday-start)/(7*86400000));let g=clinicalGroupFor(d);return wk>=0&&wk<arr.length&&g>=0&&g<arr[wk].length?arr[wk][g]:"Clinical department not scheduled"}
function nthWeekdayOfMonth(d){return Math.floor((d.getDate()-1)/7)+1}
function applyDateBasedEvening(d,x){let day=d.getDay(),n=nthWeekdayOfMonth(d),st=x[0],en=x[1],sub=x[2];
// Apply automatic week-of-month rules only to the original timetable slots.
// If Manage Schedule changes a slot to another subject, that saved subject is respected.
if(day===4&&st==="15:00"&&en==="16:00"&&["Respiratory Medicine (Evening)","Radiodiagnosis (Evening)"].includes(sub))x[2]=(n<=2?"Respiratory Medicine":"Radiodiagnosis")+" (Evening)";
else if(day===4&&st==="16:00"&&en==="17:00"&&["Pediatrics (Evening)","Anesthesia (Evening)"].includes(sub))x[2]=(n<=2?"Pediatrics":"Anesthesia")+" (Evening)";
else if(day===5&&st==="15:00"&&en==="16:00"&&["Orthopedics (Evening)","OBG (Evening)"].includes(sub))x[2]=(n<=2?"Orthopedics":"OBG")+" (Evening)";
else if(day===5&&st==="16:00"&&en==="17:00"&&sub==="General Medicine (Evening)")x[2]="General Medicine (Evening)";
return x}
function sessionsFor(d){let dk=key(d),base=(state.settings.schedule[d.getDay()]||[]).map(x=>clone(x));base=base.map((x,i)=>{applyDateBasedEvening(d,x);let original=x[2];if(original==="Clinical Posting"){let dep=clinicalDepartmentFor(d);x[2]=dep+" (Clinical)";x._scheduled=original; x._clinical=true}else x._scheduled=original;if(state.overrides&&state.overrides[dk]&&state.overrides[dk][i]){let o=state.overrides[dk][i];x._scheduled=x[2];if(typeof o==="string")x[2]=o;else{x[2]=o.subject||x[2];x[0]=o.start||x[0];x[1]=o.end||x[1]}}return x});let extra=(state.extraClasses&&state.extraClasses[dk]||[]).map(x=>[x[0],x[1],x[2],true]);return base.concat(extra)}
function sessionKey(dateKey,i){return dateKey+"-"+i}
function statusOf(dateKey,i){return state.status[sessionKey(dateKey,i)]}
function draftValue(k){return Object.prototype.hasOwnProperty.call(draftStatus,k)?draftStatus[k]:state.status[k]}
function ensureDraft(dk){if(draftDate!==dk){draftDate=dk;draftStatus={}}}
function setStatus(k,v){if(!requireSavedRoll())return;let dk=k.slice(0,10),i=Number(k.slice(dk.length+1));if(!attendanceEditable(dk,i))return;ensureDraft(dk);let current=draftValue(k);if(current===v){draftStatus[k]=null}else{draftStatus[k]=v}/* Update only this attendance control in place: no full page render, so no blink/fade. */document.querySelectorAll(`[data-act="status"][data-k="${k}"]`).forEach(btn=>{btn.classList.toggle("active",draftValue(k)===btn.dataset.v)});let d=parseKey(state.viewDate);if(key(d)===dk){let ss=sessionsFor(d),marked=0;ss.forEach((_,n)=>{if(draftValue(sessionKey(dk,n)))marked++});let txt=document.querySelector(".progressText");let bar=document.querySelector(".progress > i");if(txt)txt.textContent=marked+" / "+ss.length+" marked";if(bar)bar.style.width=(ss.length?marked/ss.length*100:0)+"%"}}
async function saveAttendance(dk){if(!requireSavedRoll())return;if(!editable(dk))return;ensureDraft(dk);let changes=Object.keys(draftStatus);if(!changes.length){toast("No attendance changes to save");return}if(!await appConfirm("Today remains editable until midnight. For past dates, only classes with a currently saved status are locked; a class cleared and saved as unmarked remains available for one-time past entry.","Save attendance?"))return;state.records=state.records||{};let ss=sessionsFor(parseKey(dk));changes.forEach(k=>{let v=draftStatus[k],i=Number(k.slice(dk.length+1));if(v){state.status[k]=v;let x=ss[i];if(x)state.records[k]={subject:x[2],scheduled:x._scheduled||x[2],start:x[0],end:x[1]}}else{delete state.status[k];delete state.records[k]}});save();draftStatus={};draftDate=dk;render();toast("Attendance saved") }
function toggleHoliday(dk){if(!editable(dk))return;state.holidays[dk]?delete state.holidays[dk]:state.holidays[dk]=true;save();render()}
function setNote(dk,text){if(!editable(dk))return;if(text.trim())state.notes[dk]=text.trim();else delete state.notes[dk];save();toast("Note saved")}
function rangeEnd(){return today()}
function compute(filter="all"){let out={attended:0,absent:0,leave:0,notHeld:0,pending:0,total:0,holiday:0,subjects:{}};subjects().forEach(s=>out.subjects[s]={attended:0,absent:0,leave:0,notHeld:0,pending:0,total:0});let cur=new Date(START_DATE),end=rangeEnd();while(cur<=end){if(filter!=="all"&&key(cur).slice(0,7)!==filter){cur=add(cur,1);continue}let dk=key(cur),ss=sessionsFor(cur);if(ss.length){if(state.holidays[dk])out.holiday++;else ss.forEach((x,i)=>{let rec=state.records&&state.records[sessionKey(dk,i)],s=rec&&rec.subject?rec.subject:x[2],st=statusOf(dk,i);if(!out.subjects[s])out.subjects[s]={attended:0,absent:0,leave:0,notHeld:0,pending:0,total:0};out.total++;out.subjects[s].total++;if(st===STATUS.ATTENDED){out.attended++;out.subjects[s].attended++}else if(st===STATUS.ABSENT){out.absent++;out.subjects[s].absent++}else if(st===STATUS.LEAVE){out.leave++;out.subjects[s].leave++}else if(st===STATUS.NOT_HELD){out.notHeld++;out.subjects[s].notHeld++}else{out.pending++;out.subjects[s].pending++}})}cur=add(cur,1)}out.rows=Object.entries(out.subjects).map(([subject,x])=>{let held=x.attended+x.absent+x.leave,pct=held?x.attended/held*100:null;return {subject,...x,held,pct}});out.held=out.attended+out.absent+out.leave;out.percent=out.held?out.attended/out.held*100:null;return out}
function dayProgress(d){let dk=key(d),ss=sessionsFor(d);if(state.holidays[dk])return {total:0,marked:0};let marked=ss.filter((_,i)=>!!statusOf(dk,i)).length;return {total:ss.length,marked}}
function header(){return `<div class="header"><div class="brand">▣ Attendance</div><p class="sub">7 Sep 2026 onwards · ${esc(state.settings.course)}</p><p class="sub">Personal attendance tracker</p></div>`}
function dateControls(){let d=parseKey(state.viewDate),isToday=key(d)===key(today());return `<div class="card datebar"><button class="iconbtn" data-act="prev">‹</button><button data-act="pickDate" style="background:transparent;color:var(--ink);border:0" class="datecenter"><b>${DAYS[d.getDay()]}</b><span>${fmt(d)} · 📅</span></button><button class="iconbtn" data-act="next">›</button></div>${isToday?"":`<div class="todayRow" style="margin-bottom:10px"><button class="btn soft compactBtn" data-act="today">↩ Go to Today</button></div>`}`}
function logTab(){let d=parseKey(state.viewDate),dk=key(d),ss=sessionsFor(d),past=d<today(),future=d>today(),can=editable(dk),before=!past&&!future&&!can,isHoliday=!!state.holidays[dk],p=dayProgress(d);let h=dateControls();if(d<START_DATE)return h+`<div class="banner lock">🔒 Attendance tracking starts on 7 Sep 2026.</div>`;if(ss.length)h+=`<div class="card progressCard"><div class="progressHead"><b>Today's progress</b><span class="progressText">${isHoliday?"Holiday":p.marked+" / "+p.total+" marked"}</span></div><div class="progress"><i style="width:${p.total?p.marked/p.total*100:0}%"></i></div></div>`;if(before)h+=`<div class="banner warn">🕕 Logging opens at 6:00 AM.</div>`;else if(past)h+=`<div class="banner info">🕘 Past date: classes not yet saved can be entered once. Already saved classes are permanently locked.</div>`;else if(future)h+=`<div class="banner lock">🔒 Future date — it becomes editable when that day arrives.</div>`;else h+=`<div class="banner info">✓ Today is editable until midnight.</div>`;if(!ss.length)return h+`<div class="card formCard" style="text-align:center;color:var(--soft)">No classes scheduled — Sunday.</div>`;h+=`<button class="holiday" data-act="holiday" ${can?"":"disabled"}>${isHoliday?"🏖 Marked as holiday"+(can?" — tap to undo":""):can?"🏖 Mark whole day as holiday":"🔒 Not a holiday"}</button>`;if(!isHoliday){ss.forEach((s,i)=>{let cur=draftValue(sessionKey(dk,i)),classCan=attendanceEditable(dk,i),locked=classCan?"":"disabled",changed=s._scheduled&&s._scheduled!==s[2];h+=`<div class="card session"><div class="sessionTop"><div><div class="sessionName">${esc(s[2])}${s[3]?" 📌":""}${changed?" 🔄":""}</div>${changed?`<div class="small">Scheduled: ${esc(s._scheduled)}</div>`:""}<div class="sessionTime">${time(s[0])} – ${time(s[1])}</div></div><div>${classCan?`${s[3]?`<div style="display:flex;gap:6px;justify-content:flex-end"><button class="btn outline" style="padding:7px 9px;font-size:11px" data-act="editClass" data-i="${i}">✏️ Edit</button></div>`:`<button class="btn outline" style="padding:7px 9px;font-size:11px" data-act="editClass" data-i="${i}">✏️ Edit</button>`}`:`<div class="locktag">${past?"🔒 Saved & locked":future?"🔒 Future":"🕕 Opens later"}</div>`}</div></div><div class="statusRow"><button ${locked} data-act="status" data-k="${sessionKey(dk,i)}" data-v="attended" class="status green ${cur==="attended"?"active":""}">✓<br>Present</button><button ${locked} data-act="status" data-k="${sessionKey(dk,i)}" data-v="absent" class="status red ${cur==="absent"?"active":""}">✕<br>Absent</button><button ${locked} data-act="status" data-k="${sessionKey(dk,i)}" data-v="not_held" class="status gray ${cur==="not_held"?"active":""}">⊘<br>Not held</button></div></div>`});if(can){h+=`<div class="attendanceActions"><button class="saveAttendance actionCompact" data-act="addExtra">＋ Add extra class</button><button class="saveAttendance actionCompact" data-act="saveAttendance">💾 Save attendance</button></div>`}h+=`<div class="card noteBox"><h3>📝 Note for this day</h3><textarea id="dayNote" ${can?"":"disabled"} placeholder="Optional note...">${esc(state.notes[dk]||"")}</textarea>${can?`<div style="margin-top:8px"><button class="saveAttendance actionCompact" data-act="saveNote">Save note</button></div>`:""}</div>`}else h+=`<div class="card formCard" style="text-align:center">🏖 Classes are excluded from attendance calculations for this holiday.</div>`;return h}
function timeParts(v){let m=/^(\d{1,2}):(\d{2})$/.exec(String(v||"09:00"));let h=m?Number(m[1]):9,mi=m?Number(m[2]):0,ap=h>=12?"PM":"AM";h=h%12||12;return {h,mi,ap}}
function timePicker(id,value,extraClass=""){let v=/^\d{2}:\d{2}$/.test(String(value||""))?String(value):"09:00";return `<div class="timePicker ${extraClass}" data-time-id="${id}" data-time-value="${v}"><button type="button" class="timeWheelTrigger" data-act="openTimeWheel">${time(v)}</button></div>`}
function readTimePicker(ref){let box=typeof ref==="string"?document.querySelector(`[data-time-id="${ref}"]`):ref;if(!box)return "";return box.dataset.timeValue||""}
function openTimeWheel(box){let t=timeParts(box.dataset.timeValue||"09:00"),hours=Array.from({length:12},(_,i)=>i+1),mins=Array.from({length:60},(_,i)=>i),aps=["AM","PM"];let items=a=>a.map(x=>`<div class="wheelItem" data-value="${String(x).padStart(a===mins?2:0,"0")}">${a===mins?String(x).padStart(2,"0"):x}</div>`).join("");let overlay=document.createElement("div");overlay.className="wheelTimeOverlay";overlay.innerHTML=`<div class="wheelTimeDialog" role="dialog" aria-modal="true"><div class="wheelTimeTitle">Set time</div><div class="wheelWrap"><div class="wheelCol" data-wheel="hour">${items(hours)}</div><div class="wheelCol" data-wheel="minute">${items(mins)}</div><div class="wheelCol" data-wheel="ampm">${items(aps)}</div></div><div class="wheelActions"><button type="button" class="wheelBtn wheelCancel">Cancel</button><button type="button" class="wheelBtn wheelOk">OK</button></div></div>`;document.body.appendChild(overlay);let cols={hour:overlay.querySelector('[data-wheel="hour"]'),minute:overlay.querySelector('[data-wheel="minute"]'),ampm:overlay.querySelector('[data-wheel="ampm"]')},vals={hour:String(t.h),minute:String(t.mi).padStart(2,"0"),ampm:t.ap};function choose(col){let items=[...col.children],mid=col.scrollTop+col.clientHeight/2,best=items.reduce((a,x)=>Math.abs(x.offsetTop+x.offsetHeight/2-mid)<Math.abs(a.offsetTop+a.offsetHeight/2-mid)?x:a,items[0]);return best}function refresh(col,name){let x=choose(col);if(!x)return;vals[name]=x.dataset.value;[...col.children].forEach(i=>i.classList.toggle("selected",i===x))}Object.entries(cols).forEach(([name,col])=>{let initial=[...col.children].find(i=>i.dataset.value===vals[name]);requestAnimationFrame(()=>{if(initial)col.scrollTop=initial.offsetTop-(col.clientHeight-initial.offsetHeight)/2;refresh(col,name)});col.addEventListener("scroll",()=>refresh(col,name),{passive:true})});overlay.querySelector('.wheelCancel').onclick=()=>overlay.remove();overlay.querySelector('.wheelOk').onclick=()=>{let h=Number(vals.hour),m=vals.minute,ap=vals.ampm,hh=(h%12)+(ap==="PM"?12:0),v=String(hh).padStart(2,"0")+":"+m;box.dataset.timeValue=v;box.querySelector('.timeWheelTrigger').textContent=time(v);overlay.remove()};overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove()})}
function classModal(i){let d=parseKey(state.viewDate),ss=sessionsFor(d),s=ss[i];if(!s)return;let modal=`<div class="modal"><div class="modalBox"><div class="row" style="justify-content:space-between"><b>✏️ Actual class</b><button class="btn outline" data-act="closeModal">Close</button></div><p class="small">The original scheduled class is kept in the record. Select what actually happened.</p><label class="label">Actual subject</label>${subjectOptions(s[2])}<label class="label">Start time</label>${timePicker("actualStart",s[0])}<label class="label">End time</label>${timePicker("actualEnd",s[1])}<div class="row" style="margin-top:14px"><button class="btn grow" data-act="saveClassEdit" data-i="${i}">Save actual class</button>${i<(state.settings.schedule[d.getDay()]||[]).length?`<button class="btn outline" data-act="restoreClass" data-i="${i}">Restore schedule</button>`:`<button class="btn outline" data-act="removeExtra" data-i="${i}">Remove</button>`}</div></div></div>`;document.body.insertAdjacentHTML("beforeend",modal)}
function extraModal(){document.body.insertAdjacentHTML("beforeend",`<div class="modal"><div class="modalBox"><div class="row" style="justify-content:space-between"><b>＋ Add extra class</b><button class="btn outline" data-act="closeModal">Close</button></div><label class="label">Subject</label>${subjectOptions("")}<label class="label">Start time</label>${timePicker("extraStart","15:00")}<label class="label">End time</label>${timePicker("extraEnd","16:00")}<button class="btn" style="width:100%;margin-top:14px" data-act="saveExtra">Add class</button></div></div>`)}
function combinedEveningRows(st,filter="all"){
  // Flexible combined attendance:
  // Build combinations ONLY from classes that were actually saved, not from the weekly timetable.
  // Any subject can qualify: if the same subject has a held class before lunch and another
  // held class after lunch, it gets a combined card. The subject name itself does not matter.
  const groups=new Map();
  const records=state.records||{};
  Object.entries(records).forEach(([recordKey,rec])=>{
    const dk=String(recordKey).slice(0,10);
    if(filter!=="all" && dk.slice(0,7)!==filter)return;
    const status=state.status[recordKey];
    // Ignore pending classes. Cancelled (Not Held) classes are counted separately
    // for information, but do not affect the held-class attendance calculation.
    if(status!==STATUS.ATTENDED && status!==STATUS.ABSENT && status!==STATUS.LEAVE && status!==STATUS.NOT_HELD)return;
    const subject=String(rec&&rec.subject||"").trim();
    const start=String(rec&&rec.start||"");
    if(!subject || /\(Clinical\)$/.test(subject))return;
    const base=subjectBase(subject);
    if(!base)return;
    const period=start>="15:00"?"after":"before";
    let g=groups.get(base);
    if(!g){
      g={before:{attended:0,absent:0,leave:0,notHeld:0},after:{attended:0,absent:0,leave:0,notHeld:0}};
      groups.set(base,g);
    }
    const bucket=g[period];
    if(status===STATUS.ATTENDED)bucket.attended++;
    else if(status===STATUS.ABSENT)bucket.absent++;
    else if(status===STATUS.LEAVE)bucket.leave++;
    else if(status===STATUS.NOT_HELD)bucket.notHeld++;
  });

  return [...groups.entries()]
    .filter(([,g])=>{
      const beforeHeld=g.before.attended+g.before.absent+g.before.leave;
      const afterHeld=g.after.attended+g.after.absent+g.after.leave;
      return beforeHeld>0 && afterHeld>0;
    })
    .sort(([a],[b])=>a.localeCompare(b))
    .map(([base,g])=>{
      const attended=g.before.attended+g.after.attended;
      const absent=g.before.absent+g.after.absent;
      const leave=g.before.leave+g.after.leave;
      const notHeld=g.before.notHeld+g.after.notHeld;
      const held=attended+absent+leave;
      return {
        subject:base+" — Morning + Evening",
        attended,absent,leave,notHeld,held,
        pct:held?attended/held*100:null,
        combined:true
      };
    });
}
function attendanceAdvice(r){if(r.held===0)return "No held classes yet";let req=Number(state.settings.required)||75, q=req/100;if(q>=1){return r.attended===r.held?"✓ 100% attendance — do not miss any class":"Need to attend all future classes; 100% can only be reached if no class was missed"}if(r.pct>=req){let canMiss=Math.floor(r.attended/q-r.held+1e-9);if(canMiss<0)canMiss=0;return canMiss===0?"<span class=\"attendanceEnough\">✓ Attendance is enough,</span><span class=\"cannotMiss\"> but you cannot miss the next class</span>":"✓ Attendance is enough — you can miss "+canMiss+" more class"+(canMiss===1?"":"es")+" and still stay at or above "+req+"%"}let needed=Math.ceil((q*r.held-r.attended)/(1-q));if(needed<0)needed=0;return "⚠ Need to attend the next "+needed+" class"+(needed===1?"":"es")+" consecutively to reach "+req+"%"}
function statsCard(r,label=""){let good=r.pct!==null&&r.pct>=state.settings.required;let bad=r.pct!==null&&r.pct<state.settings.required;let tone=good?"statsGood":bad?"statsBad":"statsNeutral";let cancelled=Number(r.notHeld||0);let advice=attendanceAdvice(r);let adviceTone=good?"goodAdvice":bad?"badAdvice":"neutralAdvice";return `<div class="card subject ${tone}" style="--fill:${Math.max(0,Math.min(100,r.pct||0))}%"><div class="subjectHead"><div class="subjectName">${esc(r.subject)}${label}</div><div class="pct">${r.pct===null?"—":r.pct.toFixed(1)+"%"}</div></div><div class="bar"><i style="width:${r.pct||0}%"></i></div><div class="subjectMeta"><span class="metaPresent">Present ${r.attended}</span><span class="metaAbsent">Absent ${r.absent}</span><span class="metaHeld">Held ${r.held}</span><span class="metaCancelled">Cancelled ${cancelled}</span></div><div class="attendanceAdvice ${adviceTone}" style="font-size:11px;margin-top:10px">${advice}</div></div>`}
function statsTab(){let filter=state.statsFilter,st=compute(filter),pct=st.percent===null?0:Math.min(100,st.percent),months=[];let c=new Date(START_DATE.getFullYear(),START_DATE.getMonth(),1),e=new Date(today().getFullYear(),today().getMonth(),1);while(c<=e){months.push(key(c).slice(0,7));c=new Date(c.getFullYear(),c.getMonth()+1,1)}let h=`<div class="tabs"><button class="filter ${filter==="all"?"active":""}" data-act="filter" data-v="all">Overall</button>${months.slice().reverse().map(m=>`<button class="filter ${filter===m?"active":""}" data-act="filter" data-v="${m}">${parseKey(m+"-01").toLocaleDateString("en-GB",{month:"short",year:"2-digit"})}</button>`).join("")}</div><div class="card statsHero ${st.percent!==null&&st.percent>=state.settings.required?"statsGood":"statsBad"}" style="--fill:${pct}%"><div class="ring" style="--p:${pct}%"><div class="ringIn">${st.percent===null?"—":st.percent.toFixed(1)+"%"}</div></div><b>Overall attendance</b><div class="small">${st.attended} present of ${st.held} held classes</div></div><div class="grid4"><div class="card metric presentMetric"><b>${st.attended}</b><span>Present</span></div><div class="card metric absentMetric"><b>${st.absent}</b><span>Absent</span></div><div class="card metric pendingMetric"><b>${st.pending}</b><span>Pending</span></div><div class="card metric totalMetric"><b>${st.held}</b><span>Total Classes</span></div></div><div class="sectionTitle">📚 Subject attendance</div><div class="statsLegend"><span class="legendGood">● At or above required attendance</span><span class="legendBad">● Below required attendance</span></div>`;
// Individual subjects only — combined rows are deliberately kept out of this section.
// Highest attendance percentage appears first. Rows without held classes are kept at the bottom.
const byAttendanceDesc=(a,b)=>{const ap=a.pct===null?-1:a.pct,bp=b.pct===null?-1:b.pct;return bp-ap||a.subject.localeCompare(b.subject)};
st.rows.slice().sort(byAttendanceDesc).forEach(r=>h+=statsCard(r));
// Flexible combinations from actually saved classes get their own separate section and are sorted independently.
let combined=combinedEveningRows(st,filter).slice().sort(byAttendanceDesc);
if(combined.length){h+=`<div class="sectionTitle">🔗 Combined Morning & Evening Attendance</div><div class="small" style="margin:-4px 0 10px">Shown automatically when the same subject has actually been held both in the morning and evening.</div>`;combined.forEach(r=>h+=statsCard(r," 🔗"))}
return h}
function calendarTab(){let m=parseKey(state.calendarMonth),y=m.getFullYear(),mo=m.getMonth(),first=new Date(y,mo,1),start=first.getDay(),days=new Date(y,mo+1,0).getDate();let h=`<div class="card calendar"><div class="row" style="justify-content:space-between;margin-bottom:10px"><button class="btn outline" data-act="calPrev">‹</button><b>${monthFmt(first)}</b><button class="btn outline" data-act="calNext">›</button></div><div class="calGrid">${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(x=>`<div class="calDow">${x}</div>`).join("")}${Array.from({length:start},()=>`<div class="calDay empty"></div>`).join("")}`;for(let n=1;n<=days;n++){let d=new Date(y,mo,n),dk=key(d),ss=sessionsFor(d),dot="";if(state.holidays[dk])dot="holiday";else if(ss.length){let vals=ss.map((_,i)=>statusOf(dk,i));if(vals.some(v=>v===STATUS.ABSENT||v===STATUS.LEAVE))dot=vals.some(v=>v===STATUS.ATTENDED)?"mix":"bad";else if(vals.some(v=>v===STATUS.ATTENDED))dot="good"}h+=`<button class="calDay ${dk===key(today())?"today":""}" data-act="calPick" data-v="${dk}">${n}${dot?`<i class="dot ${dot}"></i>`:""}</button>`}h+=`</div></div><div class="banner info">🟢 Present · 🔴 Absent · 🟡 Mixed · 🟣 Holiday. Tap a date to open its log.</div>`;return h}
function settingsTab(){let s=state.settings,edition=s.edition||(s.theme==="dark"?"earth-night":"earth-day"),day=edition==="earth-day";return `<div class="card formCard"><b>⚙️ Settings</b><label class="label">Name</label><input id="setName" class="input" value="${esc(s.name)}"><label class="label">Course / Academic part</label><input id="setCourse" class="input" value="${esc(s.course)}"><label class="label">Minimum required attendance (%)</label><input id="setRequired" class="input" type="number" min="1" max="100" value="${s.required}"><p class="small" style="margin-top:12px">🔒 Attendance logging time is fixed at 6:00 AM and cannot be changed.</p><label class="label">Clinical Posting Roll Number</label>${s.rollLocked&&s.rollNumber?`<div class="input" style="display:flex;align-items:center;justify-content:space-between"><b>${esc(s.rollNumber)}</b><span>🔒 Permanently locked</span></div><p class="small">Your roll number is permanently saved and cannot be changed.</p>`:`<input id="setRoll" class="input" type="number" min="1" max="100" value="${esc(s.rollNumber||"")}" placeholder="Enter your roll number (1–100)"><p class="small">⚠️ Check carefully. Once saved, your roll number will be permanently locked.</p>`}<p class="small">The app automatically switches to the new roll-number group arrangement from 9 Aug 2027.</p><div style="margin-top:14px"><button class="btn" data-act="saveSettings">Save settings</button></div></div><div class="card editionCard"><b>🌍 App Edition</b><div class="editionChoices"><button class="editionChoice ${day?"selected":""}" data-act="edition" data-v="earth-day">☀️ Earth Day</button><button class="editionChoice ${!day?"selected":""}" data-act="edition" data-v="earth-night">🌙 Earth Night</button></div></div><div class="card formCard"><b>📚 Schedule</b><p class="small">Schedule changes apply to new/unsaved classes. Saved attendance keeps its original subject permanently for accurate history and statistics.</p><button class="btn scheduleManage" type="button" onclick="openManageSchedule()">Manage schedule</button></div><p class="small" style="text-align:center">Tracking starts on 7 Sep 2026 and continues indefinitely.</p><div class="cosmosEdition">${day?"🌍 EARTH DAY EDITION":"🌙 EARTH NIGHT EDITION"} • UI VERIFIED</div>`}
function footer(){return `<div class="madeby">Made By Sharad Sourav🩺</div>`}
function bottom(){let items=[["log","▣","Log"],["calendar","▦","Calendar"],["stats","▥","Stats"],["settings","⚙","Settings"]];return `<div class="nav">${items.map(x=>`<button class="${state.tab===x[0]?"active":""}" data-act="tab" data-v="${x[0]}"><b>${x[1]}</b>${x[2]}</button>`).join("")}</div>`}
function render(){applyTheme();let content=state.tab==="log"?logTab():state.tab==="stats"?statsTab():state.tab==="calendar"?calendarTab():settingsTab();let animate=window.__animateNavigation===true;window.__animateNavigation=false;document.getElementById("app").innerHTML=`<div class="app">${header()}<main class="container${animate?" tabTransition":""}">${content}${footer()}</main>${bottom()}</div>`}
function toast(msg){let old=document.querySelector(".toast");if(old)old.remove();let x=document.createElement("div");x.className="toast";x.textContent=msg;document.body.appendChild(x);setTimeout(()=>x.remove(),2200)}
function datePicker(){
  // Use a visible date control inside a modal. Some Android WebViews (including
  // certain AppGeyser builds) do not open a programmatically-clicked hidden date input.
  const modal=document.createElement("div");
  modal.className="modal";
  modal.innerHTML=`<div class="modalBox" role="dialog" aria-modal="true">
    <h2 style="margin:0 0 14px;font-size:19px">Choose date</h2>
    <label class="label" for="pickerDate">Attendance date</label>
    <input id="pickerDate" class="input" type="date" min="${key(START_DATE)}" value="${state.viewDate}">
    <div class="row" style="margin-top:16px;justify-content:flex-end">
      <button class="btn outline" data-act="closeModal">Cancel</button>
      <button class="btn" data-act="confirmDate">Open date</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
}
document.addEventListener("click",async e=>{let el=e.target.closest("[data-act]");if(!el)return;let a=el.dataset.act;if(a==="tab"){window.__animateNavigation=true;draftDate=null;draftStatus={};state.tab=el.dataset.v;save();render()}else if(a==="prev"){draftDate=null;draftStatus={};let d=add(parseKey(state.viewDate),-1);state.viewDate=key(d<START_DATE?START_DATE:d);save();render()}else if(a==="next"){draftDate=null;draftStatus={};state.viewDate=key(add(parseKey(state.viewDate),1));save();render()}else if(a==="today"){draftDate=null;draftStatus={};state.viewDate=key(today());save();render()}else if(a==="pickDate"||a==="dateInput")datePicker();else if(a==="confirmDate"){let inp=document.getElementById("pickerDate");if(inp&&inp.value){draftDate=null;draftStatus={};state.viewDate=inp.value;window.__animateNavigation=true;state.tab="log";save();document.querySelectorAll(".modal").forEach(m=>m.remove());render()}}else if(a==="status")setStatus(el.dataset.k,el.dataset.v);else if(a==="saveAttendance")saveAttendance(state.viewDate);else if(a==="holiday")toggleHoliday(state.viewDate);else if(a==="saveNote")setNote(state.viewDate,document.getElementById("dayNote").value);else if(a==="editClass")classModal(Number(el.dataset.i));else if(a==="addExtra")extraModal();else if(a==="openTimeWheel"){let box=el.closest(".timePicker");if(box)openTimeWheel(box)}else if(a==="saveClassEdit"){let i=Number(el.dataset.i),dk=state.viewDate,base=(state.settings.schedule[parseKey(dk).getDay()]||[]).length,sub=selectedSubject(),st=readTimePicker("actualStart"),en=readTimePicker("actualEnd");if(!sub||!st||!en){toast("Enter subject and times");return}if(i<base){state.overrides[dk]=state.overrides[dk]||{};state.overrides[dk][i]={subject:sub,start:st,end:en}}else{let j=i-base;state.extraClasses[dk][j]=[st,en,sub]}save();document.querySelectorAll(".modal").forEach(m=>m.remove());render();toast("Actual class saved")}else if(a==="restoreClass"){let dk=state.viewDate,i=Number(el.dataset.i);if(state.overrides[dk])delete state.overrides[dk][i];save();document.querySelectorAll(".modal").forEach(m=>m.remove());render();toast("Scheduled class restored")}else if(a==="saveExtra"){let dk=state.viewDate,sub=selectedSubject(),st=readTimePicker("extraStart"),en=readTimePicker("extraEnd");if(!sub||!st||!en){toast("Enter subject and times");return}state.extraClasses[dk]=state.extraClasses[dk]||[];state.extraClasses[dk].push([st,en,sub]);save();document.querySelectorAll(".modal").forEach(m=>m.remove());render();toast("Extra class added")}else if(a==="removeExtra"){let dk=state.viewDate,i=Number(el.dataset.i),base=(state.settings.schedule[parseKey(dk).getDay()]||[]).length,j=i-base;if(j<0||!state.extraClasses[dk]||!state.extraClasses[dk][j]){toast("Extra class not found");return}if(!attendanceEditable(dk,i)){toast("Saved past classes are locked");return}if(!await appConfirm("Delete this extra class? This will remove the extra class and its attendance entry for this date.","Delete extra class?"))return;state.extraClasses[dk].splice(j,1);let shiftStore=obj=>{if(!obj)return;let updates=[];Object.keys(obj).forEach(k=>{if(!k.startsWith(dk+"-"))return;let n=Number(k.slice(dk.length+1));if(!Number.isFinite(n)||n<i)return;if(n===i)updates.push([k,null]);else updates.push([k,dk+"-"+(n-1),obj[k]])});updates.forEach(x=>{if(x[1]===null){delete obj[x[0]]}else{delete obj[x[0]];obj[x[1]]=x[2]}})};shiftStore(state.status);shiftStore(state.records);shiftStore(draftStatus);save();document.querySelectorAll(".modal").forEach(m=>m.remove());render();toast("Extra class deleted");}else if(a==="filter"){state.statsFilter=el.dataset.v;render()}else if(a==="calPrev"){let d=parseKey(state.calendarMonth);state.calendarMonth=key(new Date(d.getFullYear(),d.getMonth()-1,1));save();render()}else if(a==="calNext"){let d=parseKey(state.calendarMonth);state.calendarMonth=key(new Date(d.getFullYear(),d.getMonth()+1,1));save();render()}else if(a==="calPick"){draftDate=null;draftStatus={};state.viewDate=el.dataset.v;window.__animateNavigation=true;state.tab="log";save();render()}else if(a==="edition"){state.settings.edition=el.dataset.v;state.settings.theme=el.dataset.v==="earth-night"?"dark":"light";save();applyTheme();render()}else if(a==="saveSettings"){let rollInput=document.getElementById("setRoll");if(!state.settings.rollLocked){let rn=(rollInput?rollInput.value:"").trim();if(!/^(?:[1-9]|[1-9][0-9]|100)$/.test(rn)){showAppAlert("Please fill your Roll Number first before saving settings.","⚠️ Save Roll Number First");return}if(!await appConfirm("Confirm roll number "+rn+"? Once saved, it cannot be changed.","Save Settings"))return;state.settings.rollNumber=rn;state.settings.rollLocked=true}state.settings.name=document.getElementById("setName").value.trim()||"Student";state.settings.course=document.getElementById("setCourse").value.trim()||"Course";state.settings.required=Math.max(1,Math.min(100,Number(document.getElementById("setRequired").value)||75));state.settings.unlockHour=6;state.settings.edition=state.settings.edition||"earth-day";state.settings.theme=state.settings.edition==="earth-night"?"dark":"light";save();applyTheme();render();toast("Settings saved")}else if(a==="schedule")scheduleModal();else if(a==="closeModal"){document.querySelectorAll(".modal").forEach(m=>m.remove())}else if(a==="addSession"){let box=document.getElementById("sch"+el.dataset.day),i=box.children.length;box.insertAdjacentHTML("beforeend",scheduleRow(el.dataset.day,i,["09:00","10:00","New Subject"]))}else if(a==="removeSession"){el.parentElement.remove()}else if(a==="saveSchedule"){let ns={};for(let day=1;day<=6;day++){ns[day]=[...document.querySelectorAll("#sch"+day+" > .schRow")].map(r=>{let sub=r.querySelector(".schSubject").value;if(sub==="__OTHER__")sub=r.querySelector(".schOther").value.trim();return [readTimePicker(r.querySelector(".schStart")),readTimePicker(r.querySelector(".schEnd")),sub]}).filter(x=>x[0]&&x[1]&&x[2])}state.settings.schedule=ns;save();document.querySelectorAll(".modal").forEach(m=>m.remove());render();toast("Schedule saved and will be used for future unsaved classes")}});

function checkDay(){let cur=key(today());if(state.viewDate<key(START_DATE))state.viewDate=key(START_DATE);render()}document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")checkDay()});window.addEventListener("focus",checkDay);setInterval(checkDay,60000);
const ACTIVATION_KEY="attendance-tracker-activated-v1";
const ACTIVATION_CODE="Med@2026#Sharad!K7p9";
function activateGate(){
  const overlay=document.getElementById("activationOverlay");
  const input=document.getElementById("activationCode");
  const btn=document.getElementById("activationBtn");
  const error=document.getElementById("activationError");
  // Only genuinely existing users with meaningful saved attendance/settings are grandfathered in.
  if(HAD_MEANINGFUL_APP_DATA_BEFORE_ACTIVATION)localStorage.setItem(ACTIVATION_KEY,"1");
  if(localStorage.getItem(ACTIVATION_KEY)==="1")return;
  overlay.classList.add("show");
  const tryActivate=()=>{
    if(input.value===ACTIVATION_CODE){
      localStorage.setItem(ACTIVATION_KEY,"1");
      overlay.classList.remove("show");
      input.value="";error.textContent="";
    }else{
      error.textContent="Incorrect access code";
      input.select();
    }
  };
  btn.addEventListener("click",tryActivate);
  input.addEventListener("keydown",e=>{if(e.key==="Enter")tryActivate()});
  setTimeout(()=>input.focus(),50);
}
// Capture existing storage before load() can initialize a fresh installation.
function hasMeaningfulStoredData(){
  try{
    const candidates=[KEY,...LEGACY_KEYS];
    for(const k of candidates){
      const raw=localStorage.getItem(k); if(!raw) continue;
      const d=JSON.parse(raw);
      if(Object.keys(d.status||{}).length || Object.keys(d.records||{}).length || Object.keys(d.extraClasses||{}).length || Object.keys(d.notes||{}).length || Object.keys(d.holidays||{}).length) return true;
      if(d.settings && (d.settings.rollLocked || d.settings.rollNumber || d.settings.name && d.settings.name!=="Sharad Sourav")) return true;
    }
  }catch(e){}
  return false;
}
const HAD_MEANINGFUL_APP_DATA_BEFORE_ACTIVATION = hasMeaningfulStoredData();
load();applyTheme();watchSystemTheme();render();if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",activateGate,{once:true});}else{activateGate();}if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js?v=22-earth-editions").then(r=>r.update?.()).catch(()=>{}));

// Robust Manage Schedule controls (direct handlers; independent of delegated clicks)
function openManageSchedule(){
  document.querySelectorAll('.modal').forEach(m=>m.remove());
  const s=state.settings.schedule||{};
  let html='<div class="modal" id="manageScheduleModal"><div class="modalBox">'
    +'<div class="row" style="justify-content:space-between"><b>Manage weekly schedule</b><button type="button" class="btn outline" onclick="closeManageSchedule()">Close</button></div>'
    +'<p class="small">Edit your timetable. Saved attendance is never changed. The updated schedule is used for future and unsaved classes.</p>';
  for(let day=1;day<=6;day++){
    html+='<div class="formCard card"><b>'+DAYS[day]+'</b><div id="freshSch'+day+'">';
    (s[day]||[]).forEach((x,i)=>html+=freshScheduleRow(day,i,x));
    html+='</div><button type="button" class="btn soft" onclick="addFreshScheduleRow('+day+')">+ Add class</button></div>';
  }
  html+='<div class="row"><button type="button" class="btn grow" onclick="saveManageSchedule()">Save schedule</button><button type="button" class="btn outline" onclick="closeManageSchedule()">Cancel</button></div></div></div>';
  document.body.insertAdjacentHTML('beforeend',html);
}
function freshScheduleRow(day,i,x){
  const opts=SUBJECT_LIST.map(v=>'<option value="'+esc(v)+'" '+(v===x[2]?'selected':'')+'>'+esc(v)+'</option>').join('')+'<option value="__OTHER__" '+(!SUBJECT_LIST.includes(x[2])?'selected':'')+'>Other (type manually)</option>';
  const other=SUBJECT_LIST.includes(x[2])?'':'<input class="input freshOther" value="'+esc(x[2])+'" placeholder="Other subject">';
  return '<div class="freshSchRow" style="margin:8px 0;display:flex;gap:6px;align-items:center;flex-wrap:wrap">'
    +timePicker('freshStart_'+day+'_'+i,x[0],'freshStart')
    +timePicker('freshEnd_'+day+'_'+i,x[1],'freshEnd')
    +'<select class="input freshSubject" style="flex:1;min-width:180px" onchange="freshOtherToggle(this)">'+opts+'</select>'+other
    +'<button type="button" class="btn outline" onclick="this.closest(&quot;.freshSchRow&quot;).remove()">×</button></div>';
}
function freshOtherToggle(sel){
  const row=sel.closest('.freshSchRow'); let old=row.querySelector('.freshOther');
  if(sel.value==='__OTHER__'&&!old){sel.insertAdjacentHTML('afterend','<input class="input freshOther" placeholder="Other subject">');}
  if(sel.value!=='__OTHER__'&&old)old.remove();
}
function addFreshScheduleRow(day){document.getElementById('freshSch'+day).insertAdjacentHTML('beforeend',freshScheduleRow(day,0,['09:00','10:00',SUBJECT_LIST[0]]));}
function closeManageSchedule(){const m=document.getElementById('manageScheduleModal');if(m)m.remove();}
function saveManageSchedule(){
  const ns={};
  for(let day=1;day<=6;day++){
    ns[day]=[...document.querySelectorAll('#freshSch'+day+' .freshSchRow')].map(r=>{
      const subSel=r.querySelector('.freshSubject');
      const sub=subSel.value==='__OTHER__'?(r.querySelector('.freshOther')?.value.trim()||''):subSel.value;
      return [readTimePicker(r.querySelector('.freshStart')),readTimePicker(r.querySelector('.freshEnd')),sub];
    }).filter(x=>x[0]&&x[1]&&x[2]);
  }
  state.settings.schedule=ns;
  save(); closeManageSchedule(); render(); toast('Schedule saved successfully');
}
window.openManageSchedule=openManageSchedule;window.closeManageSchedule=closeManageSchedule;window.saveManageSchedule=saveManageSchedule;window.addFreshScheduleRow=addFreshScheduleRow;window.freshOtherToggle=freshOtherToggle;


function showAppAlert(message, title){
  const overlay=document.getElementById('appAlertOverlay');
  const titleEl=document.getElementById('appAlertTitle');
  const msgEl=document.getElementById('appAlertMessage');
  if(!overlay) return;
  titleEl.textContent=title || '⚠️ Notice';
  msgEl.textContent=message || '';
  overlay.classList.add('show');
}
function closeAppAlert(){
  const o=document.getElementById('appAlertOverlay');
  if(o)o.classList.remove('show');
}
document.addEventListener('click', function(e){
  if(e.target && (e.target.id==='appAlertOk' || e.target.id==='appAlertOverlay')) closeAppAlert();
});


function appConfirm(message,title="Confirmation"){
  return new Promise(resolve=>{
    const overlay=document.getElementById("appDialogOverlay");
    const titleEl=document.getElementById("appDialogTitle");
    const messageEl=document.getElementById("appDialogMessage");
    const cancel=document.getElementById("appDialogCancel");
    const ok=document.getElementById("appDialogOk");
    if(!overlay){resolve(false);return}
    titleEl.textContent=title;
    messageEl.textContent=message;
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden","false");
    let finished=false;
    const finish=value=>{
      if(finished)return;
      finished=true;
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden","true");
      cancel.removeEventListener("click",onCancel);
      ok.removeEventListener("click",onOk);
      overlay.removeEventListener("click",onOverlay);
      document.removeEventListener("keydown",onKey);
      resolve(value);
    };
    const onCancel=()=>finish(false);
    const onOk=()=>finish(true);
    const onOverlay=e=>{if(e.target===overlay)finish(false)};
    const onKey=e=>{if(e.key==="Escape")finish(false);if(e.key==="Enter")finish(true)};
    cancel.addEventListener("click",onCancel);
    ok.addEventListener("click",onOk);
    overlay.addEventListener("click",onOverlay);
    document.addEventListener("keydown",onKey);
    setTimeout(()=>ok.focus(),0);
  });
}
