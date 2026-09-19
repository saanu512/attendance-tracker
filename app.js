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
const ADMIN_CLOUD_SYNC_KEY="attendance-tracker-admin-last-cloud-sync-v1";
function readAdminLastSync(){try{const v=localStorage.getItem(ADMIN_CLOUD_SYNC_KEY);if(!v)return null;const d=new Date(v);return Number.isNaN(d.getTime())?null:d}catch(e){return null}}
let cloudSession={user:null,admin:false,ready:!!window.AttendanceCloud,syncing:false,lastSync:null,error:""};
const CLOUD_PENDING_KEY="attendance-tracker-cloud-pending";
const CLOUD_MIGRATION_KEY="attendance-tracker-cloud-migration-v105";
const CLOUD_SYNC_INTERVAL=60000;
function cloudErrorText(e){const c=e?.code||"unknown";const op=e?.operation?" ["+e.operation+"]":"";const msg=e?.message||"Cloud sync failed";return c+op+": "+msg;}
let cloudSyncChain=Promise.resolve();
let adminCache={students:[],selected:null,days:[],studentMonth:"",studentFilter:"all"};
function applyEveningLabels(){let changed=false;Object.values(state.settings.schedule||{}).forEach(a=>(a||[]).forEach(s=>{let h=Number(String(s[0]).slice(0,2));if(h>=15&&!/\s\(Evening\)$/.test(s[2])){s[2]=s[2]+" (Evening)";changed=true}}));return changed}
function migrateLegacyEvening(v){if(typeof v==="string")return v.replace(/\(ALC\)/g,"(Evening)");if(Array.isArray(v))return v.map(migrateLegacyEvening);if(v&&typeof v==="object"){Object.keys(v).forEach(k=>v[k]=migrateLegacyEvening(v[k]));}return v}
function load(){try{let raw=localStorage.getItem(KEY);if(!raw){for(const legacyKey of LEGACY_KEYS){raw=localStorage.getItem(legacyKey);if(raw)break}}if(raw){let parsed=JSON.parse(raw),defs=defaultState();state={...defs,...parsed,status:{...defs.status,...(parsed.status||{})},records:{...defs.records,...(parsed.records||{})},holidays:{...defs.holidays,...(parsed.holidays||{})},notes:{...defs.notes,...(parsed.notes||{})},overrides:{...defs.overrides,...(parsed.overrides||{})},extraClasses:{...defs.extraClasses,...(parsed.extraClasses||{})},settings:{...defs.settings,...(parsed.settings||{})}};migrateLegacyEvening(state);state.settings.unlockHour=6;applyEveningLabels();localStorage.setItem(KEY,JSON.stringify(state));return}}catch(e){console.warn(e)}state=defaultState()}
function save(){const data=JSON.stringify(state);localStorage.setItem(KEY,data)}
function buildCloudSessionSnapshots(sourceState=state){
  const src=sourceState||state, out={};
  const dates=new Set();
  Object.keys(src.status||{}).forEach(k=>dates.add(k.slice(0,10)));
  Object.keys(src.records||{}).forEach(k=>dates.add(k.slice(0,10)));
  Object.keys(src.notes||{}).forEach(d=>dates.add(d));
  Object.keys(src.holidays||{}).forEach(d=>dates.add(d));
  Object.keys(src.overrides||{}).forEach(d=>dates.add(d));
  Object.keys(src.extraClasses||{}).forEach(d=>dates.add(d));
  const prev=state;
  try{
    if(src!==state)state=src;
    dates.forEach(date=>{out[date]=sessionsFor(parseKey(date)).map((x,i)=>({index:i,start:x[0],end:x[1],subject:x[2],scheduledSubject:x._scheduled||x[2],extra:!!x[3]}));});
  }finally{state=prev;}
  return out;
}
function cloudAvailable(){return !!(window.AttendanceCloud&&cloudSession.user&&!cloudSession.admin)}
function cloudQueue(label,date){
  if(!cloudAvailable())return Promise.resolve();
  localStorage.setItem(CLOUD_PENDING_KEY,"1");
  cloudSession.error=""; updateCloudStatus();
  cloudSyncChain=cloudSyncChain.then(async()=>{
    if(!cloudAvailable())return;
    cloudSession.syncing=true; updateCloudStatus();
    try{
      if(date){
        const d=parseKey(date), sessions=sessionsFor(d).map((x,i)=>({index:i,start:x[0],end:x[1],subject:x[2],scheduledSubject:x._scheduled||x[2],extra:!!x[3]}));
        await window.AttendanceCloud.syncDay(cloudSession.user.uid,date,clone(state),sessions);
      }else{
        await window.AttendanceCloud.syncProfile(cloudSession.user.uid,clone(state),cloudSession.user);
      }
      cloudSession.lastSync=new Date();
      cloudSession.error="";
    }catch(e){cloudSession.error=cloudErrorText(e);throw e}
    finally{cloudSession.syncing=false;updateCloudStatus();}
  }).then(()=>{localStorage.removeItem(CLOUD_PENDING_KEY);updateCloudStatus()}).catch(()=>{updateCloudStatus()});
  return cloudSyncChain;
}
function cloudQueueFull(label){
  if(!cloudAvailable())return Promise.resolve();
  localStorage.setItem(CLOUD_PENDING_KEY,"1");
  cloudSession.error=""; updateCloudStatus();
  cloudSyncChain=cloudSyncChain.then(async()=>{
    if(!cloudAvailable())return;
    cloudSession.syncing=true; updateCloudStatus();
    try{
      await window.AttendanceCloud.syncFullState(cloudSession.user.uid,clone(state),cloudSession.user,buildCloudSessionSnapshots());
      cloudSession.lastSync=new Date(); cloudSession.error="";
    }catch(e){cloudSession.error=cloudErrorText(e);throw e}
    finally{cloudSession.syncing=false;updateCloudStatus();}
  }).then(()=>{localStorage.removeItem(CLOUD_PENDING_KEY);updateCloudStatus()}).catch(()=>{updateCloudStatus()});
  return cloudSyncChain;
}

function updateCloudStatus(){
  let text="",cls="syncStatus syncStatusBad";
  if(cloudSession.syncing){text="✓ Syncing…";cls="syncStatus syncStatusGood";}
  else if(cloudSession.error){text="✕ Sync failed · "+cloudSession.error;cls="syncStatus syncStatusBad";}
  else if(cloudSession.user&&cloudSession.lastSync){text="✓ Last synced · "+cloudSession.lastSync.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});cls="syncStatus syncStatusGood";}
  else if(cloudSession.user){text="✕ Sync status unavailable";cls="syncStatus syncStatusBad";}
  else{text="✕ Not signed in";cls="syncStatus syncStatusBad";}
  const els=[document.getElementById("cloudStatusText"),document.getElementById("adminSyncStatusText")].filter(Boolean);
  els.forEach(el=>{el.textContent=text;el.className="small "+cls;});
}
function hasSavedRoll(){return !!(state.settings&&state.settings.rollLocked&&/^(?:[1-9]|[1-9][0-9]|100)$/.test(String(state.settings.rollNumber||"")))}
function requireSavedRoll(){if(hasSavedRoll())return true;showAppAlert('Please save your roll number in Settings before marking or saving attendance.', '⚠️ Save Roll Number First');return false}
function applyTheme(){const ed=(state.settings&&state.settings.edition)||"earth-day";document.body.classList.toggle("nebula-glass",ed==="nebula-glass");document.body.classList.toggle("galactic-night",ed==="galactic-night");document.body.classList.toggle("black-hole",ed==="black-hole");document.body.classList.toggle("heart-nebula",ed==="heart-nebula");document.body.classList.toggle("roshni",ed==="roshni");document.body.classList.toggle("opal-dream",ed==="opal-dream");document.body.classList.toggle("celestial-glass",ed==="celestial-glass");document.body.classList.toggle("outer-space-3d",ed==="outer-space-3d");document.body.classList.toggle("photon-3d",ed==="photon-3d");document.body.setAttribute("data-edition",ed);
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
function setStatus(k,v){if(!requireSavedRoll())return;let dk=k.slice(0,10),i=Number(k.slice(dk.length+1));if(!attendanceEditable(dk,i))return;ensureDraft(dk);let current=draftValue(k);if(current===v){draftStatus[k]=null}else{draftStatus[k]=v}document.querySelectorAll(`[data-act="status"][data-k="${k}"]`).forEach(btn=>{btn.classList.toggle("active",draftValue(k)===btn.dataset.v)});let d=parseKey(state.viewDate);if(key(d)===dk){let ss=sessionsFor(d),marked=0;ss.forEach((_,n)=>{if(draftValue(sessionKey(dk,n)))marked++});let txt=document.querySelector(".progressText");let bar=document.querySelector(".progress > i");if(txt)txt.textContent=marked+" / "+ss.length+" marked";if(bar)bar.style.width=(ss.length?marked/ss.length*100:0)+"%"}}
function classTypeForSave(dk,i,session,baseCount){
  if(i>=baseCount)return "Extra";
  const d=parseKey(dk),original=(state.settings.schedule[d.getDay()]||[])[i];
  if(!original)return "Regular";
  const originalCopy=clone(original);applyDateBasedEvening(d,originalCopy);
  const os=originalCopy[2], actual=session?.[2]||os, ot=originalCopy[0]+"–"+originalCopy[1], at=(session?.[0]||originalCopy[0])+"–"+(session?.[1]||originalCopy[1]);
  if(actual===os && at===ot)return "Regular";
  if(actual===os)return "Rescheduled";
  const scheduledSubjects=(state.settings.schedule[d.getDay()]||[]).map(x=>{const c=clone(x);applyDateBasedEvening(d,c);return c[2]});
  if(scheduledSubjects.includes(actual))return "Exchange / Replacement";
  return "Replacement";
}
async function saveAttendance(dk){if(!requireSavedRoll())return;if(!editable(dk))return;ensureDraft(dk);let changes=Object.keys(draftStatus);if(!changes.length){toast("No attendance changes to save");return}if(!await appConfirm("Today remains editable until midnight. For past dates, only classes with a currently saved status are locked; a class cleared and saved as unmarked remains available for one-time past entry.","Save attendance?"))return;state.records=state.records||{};let ss=sessionsFor(parseKey(dk));changes.forEach(k=>{let v=draftStatus[k],i=Number(k.slice(dk.length+1));if(v){state.status[k]=v;let x=ss[i];if(x){const baseCount=(state.settings.schedule[parseKey(dk).getDay()]||[]).length;state.records[k]={subject:x[2],scheduled:x._scheduled||x[2],start:x[0],end:x[1],scheduledStart:x._scheduled?((state.settings.schedule[parseKey(dk).getDay()]||[])[i]?.[0]||x[0]):x[0],scheduledEnd:x._scheduled?((state.settings.schedule[parseKey(dk).getDay()]||[])[i]?.[1]||x[1]):x[1],type:classTypeForSave(dk,i,x,baseCount)}}}else{delete state.status[k];delete state.records[k]}});save();cloudQueue("attendance",dk);draftStatus={};draftDate=dk;render();toast("Attendance saved") }
function toggleHoliday(dk){if(!editable(dk))return;state.holidays[dk]?delete state.holidays[dk]:state.holidays[dk]=true;save();cloudQueue("holiday",dk);render()}
function setNote(dk,text){if(!editable(dk))return;if(text.trim())state.notes[dk]=text.trim();else delete state.notes[dk];save();cloudQueue("note",dk);render();toast("Note saved")}
function rangeEnd(){return today()}
function compute(filter="all"){let out={attended:0,absent:0,leave:0,notHeld:0,pending:0,total:0,holiday:0,subjects:{}};subjects().forEach(s=>out.subjects[s]={attended:0,absent:0,leave:0,notHeld:0,pending:0,total:0});let cur=new Date(START_DATE),end=rangeEnd();while(cur<=end){if(filter!=="all"&&key(cur).slice(0,7)!==filter){cur=add(cur,1);continue}let dk=key(cur),ss=sessionsFor(cur);if(ss.length){if(state.holidays[dk])out.holiday++;else ss.forEach((x,i)=>{let rec=state.records&&state.records[sessionKey(dk,i)],s=rec&&rec.subject?rec.subject:x[2],st=statusOf(dk,i);if(!out.subjects[s])out.subjects[s]={attended:0,absent:0,leave:0,notHeld:0,pending:0,total:0};out.total++;out.subjects[s].total++;if(st===STATUS.ATTENDED){out.attended++;out.subjects[s].attended++}else if(st===STATUS.ABSENT){out.absent++;out.subjects[s].absent++}else if(st===STATUS.LEAVE){out.leave++;out.subjects[s].leave++}else if(st===STATUS.NOT_HELD){out.notHeld++;out.subjects[s].notHeld++}else{out.pending++;out.subjects[s].pending++}})}cur=add(cur,1)}out.rows=Object.entries(out.subjects).map(([subject,x])=>{let held=x.attended+x.absent+x.leave,pct=held?x.attended/held*100:null;return {subject,...x,held,pct}});out.held=out.attended+out.absent+out.leave;out.percent=out.held?out.attended/out.held*100:null;return out}
function dayProgress(d){let dk=key(d),ss=sessionsFor(d);if(state.holidays[dk])return {total:0,marked:0};let marked=ss.filter((_,i)=>!!statusOf(dk,i)).length;return {total:ss.length,marked}}
function header(){return `<div class="header"><div class="brand">▣ Attendance</div><p class="sub">7 Sep 2026 onwards · ${esc(state.settings.course)}</p><p class="sub">Personal attendance tracker</p></div>`}
function dateControls(){let d=parseKey(state.viewDate),isToday=key(d)===key(today());return `<div class="card datebar"><button class="iconbtn" data-act="prev">‹</button><button data-act="pickDate" style="background:transparent;color:var(--ink);border:0" class="datecenter"><b>${DAYS[d.getDay()]}</b><span>${fmt(d)} · 📅</span></button><button class="iconbtn" data-act="next">›</button></div>${isToday?"":`<div class="todayRow" style="margin-bottom:10px"><button class="btn soft compactBtn" data-act="today">↩ Go to Today</button></div>`}`}
function dailyInfoData(dk){
  const d=parseKey(dk), base=(state.settings.schedule[d.getDay()]||[]).map(x=>clone(x));
  const changes=[];
  const ov=state.overrides&&state.overrides[dk]||{};
  Object.keys(ov).forEach(k=>{
    const i=Number(k), b=base[i]; if(!b)return;
    const actual=sessionsFor(d)[i]; if(!actual)return;
    const original=b.slice(); applyDateBasedEvening(d,original);
    const originalSubject=original[2], originalStart=original[0], originalEnd=original[1];
    const actualSubject=actual[2], actualStart=actual[0], actualEnd=actual[1];
    if(originalSubject===actualSubject && originalStart===actualStart && originalEnd===actualEnd)return;
    changes.push({type:originalSubject===actualSubject?'rescheduled':'replaced',originalSubject,originalStart,originalEnd,actualSubject,actualStart,actualEnd});
  });
  const extras=(state.extraClasses&&state.extraClasses[dk]||[]).map(x=>({start:x[0],end:x[1],subject:x[2]}));
  return {changes,extras,hasSchedule:changes.length>0||extras.length>0,hasNote:!!String(state.notes&&state.notes[dk]||'').trim()};
}
function infoIndicator(dk){
  const info=dailyInfoData(dk); if(!info.hasSchedule&&!info.hasNote)return '';
  const tone=info.hasSchedule&&info.hasNote?'both':info.hasSchedule?'schedule':'note';
  const icon=info.hasSchedule&&info.hasNote?'📝🔄':info.hasSchedule?'🔄':'📝';
  const label=info.hasSchedule&&info.hasNote?'Notes and class changes':info.hasSchedule?'Class changes and extra classes':'Saved note';
  return `<div class="infoIndicatorRow"><button class="dailyInfoIndicator ${tone}" data-act="dailyInfo" aria-label="${label}" title="${label}">${icon}</button></div>`;
}
function dailyInfoPage(){
  const dk=state.viewDate,d=parseKey(dk),info=dailyInfoData(dk),note=String(state.notes&&state.notes[dk]||'').trim();
  let h=`<div class="dailyInfoPage"><button class="btn outline dailyInfoBack" data-act="backFromInfo">‹ Back to Log</button><div class="card formCard dailyInfoHeader"><div class="dailyInfoDate">${DAYS[d.getDay()]}</div><div class="dailyInfoDateSub">${fmt(d)}</div></div>`;
  if(info.hasSchedule){
    h+=`<div class="card formCard dailyInfoCard"><h3>🔄 Class Changes / Schedule Changes</h3>`;
    info.changes.forEach(c=>{
      if(c.type==='rescheduled') h+=`<div class="card infoItem"><b>${esc(c.originalSubject)}</b><div>${time(c.originalStart)} – ${time(c.originalEnd)} → ${time(c.actualStart)} – ${time(c.actualEnd)}</div><span>Rescheduled</span></div>`;
      else h+=`<div class="card infoItem"><b>Originally: ${esc(c.originalSubject)}</b><div>${time(c.originalStart)} – ${time(c.originalEnd)}</div><div><b>Actually held: ${esc(c.actualSubject)}</b> · ${time(c.actualStart)} – ${time(c.actualEnd)}</div><span>Replacement</span></div>`;
    });
    info.extras.forEach(x=>h+=`<div class="card infoItem extraInfoItem"><b>➕ Extra class: ${esc(x.subject)}</b><div>${time(x.start)} – ${time(x.end)}</div></div>`);
    h+=`</div>`;
  }
  if(info.hasNote) h+=`<div class="card formCard dailyInfoCard savedNotesCard"><h3>📝 Saved Note</h3><div class="savedNoteText">${esc(note).replace(/\n/g,'<br>')}</div></div>`;
  h+=`</div>`; return h;
}
function logTab(){let d=parseKey(state.viewDate),dk=key(d),ss=sessionsFor(d),past=d<today(),future=d>today(),can=editable(dk),before=!past&&!future&&!can,isHoliday=!!state.holidays[dk],p=dayProgress(d);let h=dateControls();h+=infoIndicator(dk);if(d<START_DATE)return h+`<div class="banner lock">🔒 Attendance tracking starts on 7 Sep 2026.</div>`;if(ss.length)h+=`<div class="card progressCard"><div class="progressHead"><b>Today's progress</b><span class="progressText">${isHoliday?"Holiday":p.marked+" / "+p.total+" marked"}</span></div><div class="progress"><i style="width:${p.total?p.marked/p.total*100:0}%"></i></div></div>`;if(before)h+=`<div class="banner warn">🕕 Logging opens at 6:00 AM.</div>`;else if(past)h+=`<div class="banner info">🕘 Past date: classes not yet saved can be entered once. Already saved classes are permanently locked.</div>`;else if(future)h+=`<div class="banner lock">🔒 Future date — it becomes editable when that day arrives.</div>`;else h+=`<div class="banner info">✓ Today is editable until midnight.</div>`;
if(!ss.length){h+=`<div class="card formCard" style="text-align:center;color:var(--soft)"><div style="font-weight:850;font-size:17px">No classes scheduled</div><div style="margin-top:6px">You can add an extra class for this date.</div></div>`;h+=`<div class="card noteBox"><h3>📝 Note for this day</h3><textarea id="dayNote" ${can?"":"disabled"} placeholder="Optional note...">${esc(state.notes[dk]||"")}</textarea>${can?`<div style="margin-top:8px"><button class="saveAttendance actionCompact" data-act="saveNote">Save note</button></div>`:""}</div>`;if(can)h+=`<div class="extraBelowNote"><button class="saveAttendance actionCompact" data-act="addExtra">＋ Add extra class</button></div>`;else h+=`<div class="extraBelowNote"><div class="card formCard" style="text-align:center;color:var(--soft)">🔒 Extra classes can be added when this date becomes editable.</div></div>`;return h;}
h+=`<button class="holiday" data-act="holiday" ${can?"":"disabled"}>${isHoliday?"🏖 Marked as holiday"+(can?" — tap to undo":""):can?"🏖 Mark whole day as holiday":"🔒 Not a holiday"}</button>`;if(!isHoliday){ss.forEach((s,i)=>{let cur=draftValue(sessionKey(dk,i)),classCan=attendanceEditable(dk,i),locked=classCan?"":"disabled",changed=s._scheduled&&s._scheduled!==s[2];h+=`<div class="card session"><div class="sessionTop"><div><div class="sessionName">${esc(s[2])}${s[3]?" 📌":""}${changed?" 🔄":""}</div>${changed?`<div class="small">Scheduled: ${esc(s._scheduled)}</div>`:""}<div class="sessionTime">${time(s[0])} – ${time(s[1])}</div></div><div>${classCan?`${s[3]?`<div style="display:flex;gap:6px;justify-content:flex-end"><button class="btn outline" style="padding:7px 9px;font-size:11px" data-act="editClass" data-i="${i}">✏️ Edit</button></div>`:`<button class="btn outline" style="padding:7px 9px;font-size:11px" data-act="editClass" data-i="${i}">✏️ Edit</button>`}`:`<div class="locktag">${past?"🔒 Saved & locked":future?"🔒 Future":"🕕 Opens later"}</div>`}</div></div><div class="statusRow"><button ${locked} data-act="status" data-k="${sessionKey(dk,i)}" data-v="attended" class="status green ${cur==="attended"?"active":""}">✓<br>Present</button><button ${locked} data-act="status" data-k="${sessionKey(dk,i)}" data-v="absent" class="status red ${cur==="absent"?"active":""}">✕<br>Absent</button><button ${locked} data-act="status" data-k="${sessionKey(dk,i)}" data-v="not_held" class="status gray ${cur==="not_held"?"active":""}">⊘<br>Not held</button></div></div>`});if(can)h+=`<div class="attendanceActions"><button class="saveAttendance actionCompact" data-act="saveAttendance">💾 Save attendance</button></div>`;h+=`<div class="card noteBox"><h3>📝 Note for this day</h3><textarea id="dayNote" ${can?"":"disabled"} placeholder="Optional note...">${esc(state.notes[dk]||"")}</textarea>${can?`<div style="margin-top:8px"><button class="saveAttendance actionCompact" data-act="saveNote">Save note</button></div>`:""}</div>`;if(can)h+=`<div class="extraBelowNote"><button class="saveAttendance actionCompact" data-act="addExtra">＋ Add extra class</button></div>`;else h+=`<div class="extraBelowNote"><div class="card formCard" style="text-align:center;color:var(--soft)">🔒 Extra classes can be added when this date becomes editable.</div></div>`;}else h+=`<div class="card formCard" style="text-align:center">🏖 Classes are excluded from attendance calculations for this holiday.</div>`;return h}
function timeParts(v){let m=/^(\d{1,2}):(\d{2})$/.exec(String(v||"09:00"));let h=m?Number(m[1]):9,mi=m?Number(m[2]):0,ap=h>=12?"PM":"AM";h=h%12||12;return {h,mi,ap}}
function timePicker(id,value,extraClass=""){let v=/^\d{2}:\d{2}$/.test(String(value||""))?String(value):"09:00";return `<div class="timePicker ${extraClass}" data-time-id="${id}" data-time-value="${v}"><button type="button" class="timeWheelTrigger" data-act="openTimeWheel">${time(v)}</button></div>`}
function readTimePicker(ref){let box=typeof ref==="string"?document.querySelector(`[data-time-id="${ref}"]`):ref;if(!box)return "";return box.dataset.timeValue||""}
function openTimeWheel(box){let t=timeParts(box.dataset.timeValue||"09:00"),hours=Array.from({length:12},(_,i)=>i+1),mins=Array.from({length:60},(_,i)=>i),aps=["AM","PM"];let items=a=>a.map(x=>`<div class="wheelItem" data-value="${String(x).padStart(a===mins?2:0,"0")}">${a===mins?String(x).padStart(2,"0"):x}</div>`).join("");let overlay=document.createElement("div");overlay.className="wheelTimeOverlay";overlay.innerHTML=`<div class="wheelTimeDialog" role="dialog" aria-modal="true"><div class="wheelTimeTitle">Set time</div><div class="wheelWrap"><div class="wheelCol" data-wheel="hour">${items(hours)}</div><div class="wheelCol" data-wheel="minute">${items(mins)}</div><div class="wheelCol" data-wheel="ampm">${items(aps)}</div></div><div class="wheelActions"><button type="button" class="wheelBtn wheelCancel">Cancel</button><button type="button" class="wheelBtn wheelOk">OK</button></div></div>`;document.body.appendChild(overlay);let cols={hour:overlay.querySelector('[data-wheel="hour"]'),minute:overlay.querySelector('[data-wheel="minute"]'),ampm:overlay.querySelector('[data-wheel="ampm"]')},vals={hour:String(t.h),minute:String(t.mi).padStart(2,"0"),ampm:t.ap};function choose(col){let items=[...col.children],mid=col.scrollTop+col.clientHeight/2,best=items.reduce((a,x)=>Math.abs(x.offsetTop+x.offsetHeight/2-mid)<Math.abs(a.offsetTop+a.offsetHeight/2-mid)?x:a,items[0]);return best}function refresh(col,name){let x=choose(col);if(!x)return;vals[name]=x.dataset.value;[...col.children].forEach(i=>i.classList.toggle("selected",i===x))}Object.entries(cols).forEach(([name,col])=>{let initial=[...col.children].find(i=>i.dataset.value===vals[name]);requestAnimationFrame(()=>{if(initial)col.scrollTop=initial.offsetTop-(col.clientHeight-initial.offsetHeight)/2;refresh(col,name)});col.addEventListener("scroll",()=>refresh(col,name),{passive:true})});overlay.querySelector('.wheelCancel').onclick=()=>overlay.remove();overlay.querySelector('.wheelOk').onclick=()=>{let h=Number(vals.hour),m=vals.minute,ap=vals.ampm,hh=(h%12)+(ap==="PM"?12:0),v=String(hh).padStart(2,"0")+":"+m;box.dataset.timeValue=v;box.querySelector('.timeWheelTrigger').textContent=time(v);overlay.remove()};overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove()})}
function classModal(i){let d=parseKey(state.viewDate),ss=sessionsFor(d),s=ss[i];if(!s)return;let modal=`<div class="modal"><div class="modalBox"><div class="row" style="justify-content:space-between"><b>✏️ Actual class</b><button class="btn outline" data-act="closeModal">Close</button></div><p class="small">The original scheduled class is kept in the record. Select what actually happened.</p><label class="label">Actual subject</label>${subjectOptions(s[2])}<label class="label">Start time</label>${timePicker("actualStart",s[0])}<label class="label">End time</label>${timePicker("actualEnd",s[1])}<div class="row" style="margin-top:14px"><button class="btn grow" data-act="saveClassEdit" data-i="${i}">Save actual class</button>${i<(state.settings.schedule[d.getDay()]||[]).length?`<button class="btn outline" data-act="restoreClass" data-i="${i}">Restore schedule</button>`:`<button class="btn outline" data-act="removeExtra" data-i="${i}">Remove</button>`}</div></div></div>`;document.body.insertAdjacentHTML("beforeend",modal)}
function extraModal(){document.body.insertAdjacentHTML("beforeend",`<div class="modal"><div class="modalBox"><div class="row" style="justify-content:space-between"><b>＋ Add extra class</b><button class="btn outline" data-act="closeModal">Close</button></div><label class="label">Subject</label>${subjectOptions("")}<label class="label">Start time</label>${timePicker("extraStart","15:00")}<label class="label">End time</label>${timePicker("extraEnd","16:00")}<button class="btn" style="width:100%;margin-top:14px" data-act="saveExtra">Add class</button></div></div>`)}
function combinedEveningRows(st,filter="all"){

  const groups=new Map();
  const records=state.records||{};
  Object.entries(records).forEach(([recordKey,rec])=>{
    const dk=String(recordKey).slice(0,10);
    if(filter!=="all" && dk.slice(0,7)!==filter)return;
    const status=state.status[recordKey];

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
function attendanceAdvice(r){
  if(r.held===0)return '<span class="adviceNeutralText">No held classes yet</span>';
  let req=Number(state.settings.required)||75, q=req/100;
  if(q>=1){
    if(r.attended===r.held)return '<span class="adviceGreen">✓ 100% attendance</span><span class="adviceRed"> — do not miss any class</span>';
    return '<span class="adviceRed attendance-message-red" style="color:var(--red)!important">⚠ Need to attend all future classes; 100% can only be reached if no class was missed</span>';
  }
  if(r.pct>=req){
    let canMiss=Math.floor(r.attended/q-r.held+1e-9);if(canMiss<0)canMiss=0;
    if(canMiss===0)return '<span class="adviceGreen attendance-message-green" style="color:var(--green)!important">✓ Attendance is enough,</span><span class="adviceRed attendance-message-red" style="color:var(--red)!important"> ⚠ but you cannot miss the next class</span>';
    return '<span class="adviceGreen attendance-message-green" style="color:var(--green)!important">✓ Attendance is enough, you can miss '+canMiss+' more class'+(canMiss===1?'':'es')+' and still stay at or above '+req+'%</span>';
  }
  let needed=Math.ceil((q*r.held-r.attended)/(1-q));if(needed<0)needed=0;
  return '<span class="adviceRed attendance-message-red" style="color:var(--red)!important">⚠ Need to attend the next '+needed+' class'+(needed===1?'':'es')+' consecutively to reach '+req+'%</span>';
}
function statsCard(r,label=""){let good=r.pct!==null&&r.pct>=state.settings.required;let bad=r.pct!==null&&r.pct<state.settings.required;let tone=good?"statsGood":bad?"statsBad":"statsNeutral";let cancelled=Number(r.notHeld||0);let advice=attendanceAdvice(r);let adviceTone=good?"goodAdvice":bad?"badAdvice":"neutralAdvice";return `<div class="card subject ${tone}" style="--fill:${Math.max(0,Math.min(100,r.pct||0))}%"><div class="subjectHead"><div class="subjectName">${esc(r.subject)}${label}</div><div class="pct">${r.pct===null?"—":r.pct.toFixed(1)+"%"}</div></div><div class="bar"><i style="width:${r.pct||0}%"></i></div><div class="subjectMeta"><span class="metaPresent">Present ${r.attended}</span><span class="metaAbsent">Absent ${r.absent}</span><span class="metaHeld">Held ${r.held}</span><span class="metaCancelled">Cancelled ${cancelled}</span></div><div class="attendanceAdvice ${adviceTone}" style="font-size:11px;margin-top:10px">${advice}</div></div>`}
function statsTab(){let filter=state.statsFilter,st=compute(filter),pct=st.percent===null?0:Math.min(100,st.percent),months=[];let c=new Date(START_DATE.getFullYear(),START_DATE.getMonth(),1),e=new Date(today().getFullYear(),today().getMonth(),1);while(c<=e){months.push(key(c).slice(0,7));c=new Date(c.getFullYear(),c.getMonth()+1,1)}let h=`<div class="tabs"><button class="filter ${filter==="all"?"active":""}" data-act="filter" data-v="all">Overall</button>${months.slice().reverse().map(m=>`<button class="filter ${filter===m?"active":""}" data-act="filter" data-v="${m}">${parseKey(m+"-01").toLocaleDateString("en-GB",{month:"short",year:"2-digit"})}</button>`).join("")}</div><div class="card statsHero ${st.percent!==null&&st.percent>=state.settings.required?"statsGood":"statsBad"}" style="--fill:${pct}%"><div class="ring" style="--p:${pct}%"><div class="ringIn">${st.percent===null?"—":st.percent.toFixed(1)+"%"}</div></div><b>Overall attendance</b><div class="small">${st.attended} present of ${st.held} held classes</div></div><div class="grid4"><div class="card metric presentMetric"><b>${st.attended}</b><span>Present</span></div><div class="card metric absentMetric"><b>${st.absent}</b><span>Absent</span></div><div class="card metric pendingMetric"><b>${st.pending}</b><span>Pending</span></div><div class="card metric totalMetric"><b>${st.held}</b><span>Total Classes</span></div></div><div class="sectionTitle">📚 Subject attendance</div><div class="statsLegend"><span class="legendGood">● At or above required attendance</span><span class="legendBad">● Below required attendance</span></div>`;

const byAttendanceDesc=(a,b)=>{const ap=a.pct===null?-1:a.pct,bp=b.pct===null?-1:b.pct;return bp-ap||a.subject.localeCompare(b.subject)};
st.rows.slice().sort(byAttendanceDesc).forEach(r=>h+=statsCard(r));

let combined=combinedEveningRows(st,filter).slice().sort(byAttendanceDesc);
if(combined.length){h+=`<div class="sectionTitle">🔗 Combined Morning & Evening Attendance</div><div class="small" style="margin:-4px 0 10px">Shown automatically when the same subject has actually been held both in the morning and evening.</div>`;combined.forEach(r=>h+=statsCard(r," 🔗"))}
return h}
function calendarTab(){let m=parseKey(state.calendarMonth),y=m.getFullYear(),mo=m.getMonth(),first=new Date(y,mo,1),start=first.getDay(),days=new Date(y,mo+1,0).getDate();let h=`<div class="card calendar"><div class="row" style="justify-content:space-between;margin-bottom:10px"><button class="btn outline" data-act="calPrev">‹</button><b>${monthFmt(first)}</b><button class="btn outline" data-act="calNext">›</button></div><div class="calGrid">${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(x=>`<div class="calDow">${x}</div>`).join("")}${Array.from({length:start},()=>`<div class="calDay empty"></div>`).join("")}`;for(let n=1;n<=days;n++){let d=new Date(y,mo,n),dk=key(d),ss=sessionsFor(d),dot="";if(d>=START_DATE&&d<=today()){if(state.holidays[dk])dot="holiday";else if(ss.length){let vals=ss.map((_,i)=>statusOf(dk,i));let hasUnmarked=vals.some(v=>!v);let hasPresent=vals.some(v=>v===STATUS.ATTENDED);let hasAbsent=vals.some(v=>v===STATUS.ABSENT||v===STATUS.LEAVE);let hasNotHeld=vals.some(v=>v===STATUS.NOT_HELD);if(hasUnmarked)dot="pending";else if(hasPresent&&hasAbsent)dot="mix";else if(hasPresent)dot="good";else if(hasAbsent)dot="bad";else if(hasNotHeld)dot="notHeld"}}h+=`<button class="calDay ${dk===key(today())?"today":""}" data-act="calPick" data-v="${dk}">${n}${dot?`<i class="dot ${dot}"></i>`:""}</button>`}h+=`</div></div><div class="banner info">🟢 Present · 🔴 Absent · 🟡 Mixed · 🟣 Holiday · 🔵 Pending · 🩷 Not Held. Tap a date to open its log.</div>`;return h}
function settingsTab(){
  let s=state.settings,edition=s.edition||(s.theme==="dark"?"earth-night":"earth-day"),day=edition==="earth-day",night=edition==="earth-night",glass=edition==="nebula-glass",galactic=edition==="galactic-night",blackhole=edition==="black-hole",heart=edition==="heart-nebula",roshni=edition==="roshni",opal=edition==="opal-dream",celestial=edition==="celestial-glass",outerSpace3d=edition==="outer-space-3d",photon3d=edition==="photon-3d";
  const user=cloudSession.user;
  const accountCard=`<div class="card formCard cloudAccountCard"><b>☁️ Account & Cloud</b><div class="cloudIdentity">${user?`<div class="cloudAvatar">${cloudSession.admin?"👑":esc((user.email||"S").slice(0,1).toUpperCase())}</div><div class="grow"><b>${esc(user.email||"")}</b>${cloudStatusMarkup()}<button class="syncTapBtn" data-act="syncNow">↻ Tap to Sync</button></div>`:`<div class="cloudAvatar">☁</div><div class="grow"><b>Not signed in</b><div id="cloudStatusText" class="small syncStatus syncStatusBad">✕ Not signed in · Sign in to save data permanently to Firebase.</div></div>`}</div><div class="cloudActions">${user?`${cloudSession.admin?`<button class="btn soft" data-act="adminDashboard">👑 Admin Dashboard</button>`:``}<button class="btn outline" data-act="logout">Logout</button>`:`<button class="btn" data-act="studentLogin">Student Login</button><button class="btn outline" data-act="adminLogin">Admin Login</button>`}</div>${user?`<div class="cloudActions secondary"><button class="btn outline" data-act="forgotPassword">Forgot Password</button></div>`:`<p class="small">Student and Admin accounts use Firebase Email/Password authentication. Admin access requires an authorized Firebase admin role.</p>`}</div>`;
  return accountCard+`<div class="card formCard"><b>⚙️ Settings</b><label class="label">Name</label><input id="setName" class="input" value="${esc(s.name)}"><label class="label">Course / Academic part</label><input id="setCourse" class="input" value="${esc(s.course)}"><label class="label">Minimum required attendance (%)</label><input id="setRequired" class="input" type="number" min="1" max="100" value="${s.required}"><p class="small" style="margin-top:12px">🔒 Attendance logging time is fixed at 6:00 AM and cannot be changed.</p><label class="label">Clinical Posting Roll Number</label>${s.rollLocked&&s.rollNumber?`<div class="input" style="display:flex;align-items:center;justify-content:space-between"><b>${esc(s.rollNumber)}</b><span>🔒 Permanently locked</span></div><p class="small">Your roll number is permanently saved and cannot be changed.</p>`:`<input id="setRoll" class="input" type="number" min="1" max="100" value="${esc(s.rollNumber||"")}" placeholder="Enter your roll number (1–100)"><p class="small">⚠️ Check carefully. Once saved, your roll number will be permanently locked.</p>`}<p class="small">The app automatically switches to the new roll-number group arrangement from 9 Aug 2027.</p><div style="margin-top:14px"><button class="btn" data-act="saveSettings">Save settings</button></div></div><div class="card editionCard"><b>🌍 App Edition</b><div class="editionChoices"><button class="editionChoice ${day?"selected":""}" data-act="edition" data-v="earth-day">☀️ Earth Day</button><button class="editionChoice ${night?"selected":""}" data-act="edition" data-v="earth-night">🌙 Earth Night</button><button class="editionChoice ${glass?"selected":""}" data-act="edition" data-v="nebula-glass">🌌 Nebula Glass</button><button class="editionChoice ${galactic?"selected":""}" data-act="edition" data-v="galactic-night">🌠 Galactic Night</button><button class="editionChoice ${blackhole?"selected":""}" data-act="edition" data-v="black-hole">🕳️ Black Hole</button><button class="editionChoice ${heart?"selected":""}" data-act="edition" data-v="heart-nebula">❤️ Heart Nebula</button><button class="editionChoice ${roshni?"selected":""}" data-act="edition" data-v="roshni">🪔Roshni</button><button class="editionChoice ${opal?"selected":""}" data-act="edition" data-v="opal-dream">💎 Opal Dream</button><button class="editionChoice ${celestial?"selected":""}" data-act="edition" data-v="celestial-glass">🔭 Celestial Glass</button><button class="editionChoice ${outerSpace3d?"selected":""}" data-act="edition" data-v="outer-space-3d">🌌 Outer Space 3D</button><button class="editionChoice ${photon3d?"selected":""}" data-act="edition" data-v="photon-3d">💡 Photon 3D</button></div></div><div class="card formCard"><b>📚 Schedule</b><p class="small">Schedule changes apply to new/unsaved classes. Saved attendance keeps its original subject permanently for accurate history and statistics.</p><button class="btn scheduleManage" type="button" onclick="openManageSchedule()">Manage schedule</button></div><p class="small" style="text-align:center">Tracking starts on 7 Sep 2026 and continues indefinitely.</p><div class="cosmosEdition">${day?"🌍 EARTH DAY EDITION":night?"🌙 EARTH NIGHT EDITION":glass?"🌌 NEBULA GLASS EDITION":galactic?"🌠 GALACTIC NIGHT EDITION":blackhole?"🕳️ BLACK HOLE EDITION":heart?"❤️ HEART NEBULA EDITION":roshni?"🪔 ROSHNI EDITION":opal?"💎 OPAL DREAM EDITION":outerSpace3d?"🌌 OUTER SPACE 3D EDITION":"🔭 CELESTIAL GLASS EDITION"} • UI VERIFIED</div>`
}
function cloudAuthModal(mode){
  const title=mode==="admin"?"👑 Admin Login":"👤 Student Login";
  document.querySelectorAll('.modal').forEach(m=>m.remove());
  document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="cloudAuthModal"><div class="modalBox cloudAuthBox"><div class="row" style="justify-content:space-between"><b>${title}</b><button class="btn outline" data-act="closeModal">Close</button></div><p class="small">Use your Firebase Email/Password account.</p><label class="label">Email</label><input id="cloudEmail" class="input" type="email" autocomplete="username" placeholder="Enter email"><label class="label">Password</label><input id="cloudPassword" class="input" type="password" autocomplete="current-password" placeholder="Enter password"><div id="cloudAuthError" class="cloudAuthError"></div><div class="cloudActions"><button class="btn grow" data-act="submitCloudLogin" data-mode="${mode}">${mode==="admin"?"Admin Login":"Student Login"}</button><button class="btn outline" data-act="forgotFromLogin">Forgot Password</button></div>${mode==="student"?`<div class="authCreateDivider"><span>New student?</span></div><button class="btn soft authCreateBtn" data-act="createStudentAccount">Create Account</button>`:""}</div></div>`);
  setTimeout(()=>document.getElementById('cloudEmail')?.focus(),0);
}
function studentCreateModal(prefill="") {
  document.querySelectorAll('.modal').forEach(m=>m.remove());
  document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="studentCreateModal"><div class="modalBox cloudAuthBox"><div class="row" style="justify-content:space-between"><b>📝 Create Student Account</b><button class="btn outline" data-act="closeModal">Close</button></div><p class="small">Create your Firebase account. Your attendance data on this phone will remain intact and can be linked to the account after sign-up.</p><label class="label">Name</label><input id="createName" class="input" value="${esc(state.settings?.name||"")}" placeholder="Enter your name"><label class="label">Email</label><input id="createEmail" class="input" type="email" value="${esc(prefill)}" autocomplete="email" placeholder="Enter email"><label class="label">Password</label><input id="createPassword" class="input" type="password" autocomplete="new-password" placeholder="At least 6 characters"><label class="label">Confirm Password</label><input id="createPassword2" class="input" type="password" autocomplete="new-password" placeholder="Re-enter password"><div id="createAccountError" class="cloudAuthError"></div><button class="btn" style="width:100%;margin-top:14px" data-act="submitCreateStudent">Create Account</button></div></div>`);
  setTimeout(()=>document.getElementById('createEmail')?.focus(),0);
}
function cloudForgotModal(prefill=""){
  document.querySelectorAll('.modal').forEach(m=>m.remove());
  document.body.insertAdjacentHTML('beforeend',`<div class="modal"><div class="modalBox cloudAuthBox"><div class="row" style="justify-content:space-between"><b>🔑 Reset Password</b><button class="btn outline" data-act="closeModal">Close</button></div><p class="small">Enter your Firebase account email. A password-reset email will be sent if the account exists.</p><label class="label">Email</label><input id="resetEmail" class="input" type="email" value="${esc(prefill)}" autocomplete="email" placeholder="Enter email"><div id="resetError" class="cloudAuthError"></div><button class="btn" style="width:100%;margin-top:14px" data-act="sendReset">Send Reset Email</button></div></div>`);
}
function formatCloudTime(v){
  if(!v)return "—";
  const d=new Date(v);
  return Number.isNaN(d.getTime())?"—":d.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
}
function adminSyncStatusHtml(){
  if(cloudSession.syncing)return '<span id="adminSyncStatusText" class="syncStatus syncStatusGood">✓ Syncing…</span>';
  if(cloudSession.error)return '<span id="adminSyncStatusText" class="syncStatus syncStatusBad">✕ Sync failed</span>';
  const t=cloudSession.lastSync||readAdminLastSync();
  if(cloudSession.user&&t)return `<span id="adminSyncStatusText" class="syncStatus syncStatusGood">✓ Last synced · ${formatCloudTime(t)}</span>`;
  return '<span id="adminSyncStatusText" class="syncStatus syncStatusBad">✕ Sync status unavailable</span>';
}
function cloudStatusMarkup(){
  if(cloudSession.syncing)return '<span id="cloudStatusText" class="small syncStatus syncStatusGood">✓ Syncing…</span>';
  if(cloudSession.error)return `<span id="cloudStatusText" class="small syncStatus syncStatusBad">✕ Sync failed · ${esc(cloudSession.error)}</span>`;
  const t=cloudSession.admin?(cloudSession.lastSync||readAdminLastSync()):cloudSession.lastSync;
  if(cloudSession.user&&t)return `<span id="cloudStatusText" class="small syncStatus syncStatusGood">✓ Last synced · ${formatCloudTime(t)}</span>`;
  if(cloudSession.user)return '<span id="cloudStatusText" class="small syncStatus syncStatusBad">✕ Sync status unavailable</span>';
  return '<span id="cloudStatusText" class="small syncStatus syncStatusBad">✕ Not signed in</span>';
}
function adminDashboard(){
  if(!cloudSession.admin)return `<div class="card formCard"><b>Admin access required</b><p class="small">Sign in with an authorized Admin account.</p></div>`;
  if(!adminCache.students.length)return `<div class="card formCard"><div class="row" style="justify-content:space-between"><b>👑 Admin Dashboard</b><div class="cloudActions"><button class="btn soft" data-act="refreshAdmin">Refresh</button><button class="btn outline" data-act="backFromAdmin">Back</button></div></div><div class="adminSyncBar"><div class="adminSyncStatusLine">${adminSyncStatusHtml()}<button class="syncTapBtn" data-act="syncNow">↻ Tap to Sync</button></div></div><p class="small">No student profiles have been synced to Firebase yet.</p></div>`;
  let h=`<div class="card formCard adminHero"><div class="row" style="justify-content:space-between"><div><b>👑 Admin Dashboard</b><div class="small">Complete cloud student records</div></div><button class="btn outline" data-act="backFromAdmin">Back</button></div><div class="adminSyncBar"><div class="adminSyncStatusLine">${adminSyncStatusHtml()}<button class="syncTapBtn" data-act="syncNow">↻ Tap to Sync</button></div></div><div class="adminSearch"><input id="adminSearch" class="input" placeholder="Search name, roll or email" oninput="filterAdminStudents(this.value)"></div></div><div id="adminStudentList">${adminStudentCards(adminCache.students)}</div>`;return h;
}
function adminStudentCards(students){return students.map(s=>{
  const sync=s.updatedAt?`<span class="syncStatus syncStatusGood">✓ Last synced · ${formatCloudTime(s.updatedAt)}</span>`:'<span class="syncStatus syncStatusBad">✕ Last sync time unavailable</span>';
  return `<button class="adminStudent card" data-act="adminStudent" data-uid="${esc(s.uid)}"><div class="adminStudentMain"><b>${esc(s.name||"Student")}</b><span>Roll: ${esc(s.rollNumber||"—")}</span></div><div class="small">${esc(s.email||"")}</div><div class="adminStudentMeta"><span>Required ${Number(s.required||75)}%</span><span>${esc(s.course||"")}</span></div><div class="adminStudentSync">${sync}</div></button>`;
}).join('')||`<div class="card formCard"><p class="small">No matching students.</p></div>`}
function filterAdminStudents(q){const v=String(q||'').toLowerCase();const list=adminCache.students.filter(s=>[s.name,s.rollNumber,s.email].some(x=>String(x||'').toLowerCase().includes(v)));const el=document.getElementById('adminStudentList');if(el)el.innerHTML=adminStudentCards(list)}
function adminClassInfo(dateKey,snap,rec,i,sessions){
  const d=parseKey(dateKey), base=(state.settings.schedule[d.getDay()]||[]).map(x=>clone(x));
  const isExtra=!!snap?.extra || i>=base.length;
  const scheduledBase=isExtra?null:base[i];
  if(scheduledBase) applyDateBasedEvening(d,scheduledBase);
  const scheduledSubject=scheduledBase?scheduledBase[2]:(rec?.scheduled||"—");
  const scheduledStart=scheduledBase?scheduledBase[0]:(rec?.scheduledStart||"");
  const scheduledEnd=scheduledBase?scheduledBase[1]:(rec?.scheduledEnd||"");
  const actualSubject=rec?.subject||snap?.subject||(scheduledSubject&&scheduledSubject!=="—"?scheduledSubject:"—");
  const actualStart=rec?.start||snap?.start||"";
  const actualEnd=rec?.end||snap?.end||"";
  if(isExtra){
    return {scheduledSubject:"— No original class —",actualSubject,scheduledStart:"",scheduledEnd:"",actualStart,actualEnd,type:"Extra",relationship:"Extra class — no originally scheduled class"};
  }
  const sameSubject=actualSubject===scheduledSubject;
  const sameTime=actualStart===scheduledStart && actualEnd===scheduledEnd;
  if(sameSubject && sameTime) return {scheduledSubject,actualSubject,scheduledStart,scheduledEnd,actualStart,actualEnd,type:rec?.type||"Regular",relationship:"—"};
  if(sameSubject) return {scheduledSubject,actualSubject,scheduledStart,scheduledEnd,actualStart,actualEnd,type:rec?.type||"Rescheduled",relationship:`Rescheduled: ${time(scheduledStart)}–${time(scheduledEnd)} → ${time(actualStart)}–${time(actualEnd)}`};
  const originalSlots=base.map((x,j)=>{const c=clone(x);applyDateBasedEvening(d,c);return {index:j,subject:c[2],start:c[0],end:c[1]};});
  const other=originalSlots.find(x=>x.index!==i && x.subject===actualSubject);
  if(other){
    return {scheduledSubject,actualSubject,scheduledStart,scheduledEnd,actualStart,actualEnd,type:rec?.type||"Exchange / Replacement",relationship:`${actualSubject} moved from ${time(other.start)}–${time(other.end)} to this slot; ${scheduledSubject} was originally here`};
  }
  return {scheduledSubject,actualSubject,scheduledStart,scheduledEnd,actualStart,actualEnd,type:rec?.type||"Replacement",relationship:`${actualSubject} replaced ${scheduledSubject} in this scheduled slot`};
}
function adminStudentPage(uid){
  const s=adminCache.students.find(x=>x.uid===uid), days=adminCache.days||[];
  if(!s)return `<div class="card formCard"><p>Student not found.</p><button class="btn" data-act="backFromStudent">Back</button></div>`;
  const grouped=[];
  days.slice().sort((a,b)=>String(a.date).localeCompare(String(b.date))).forEach(d=>{
    const rows=[]; const sessions=d.sessions||[]; const max=Math.max(sessions.length,Object.keys(d.records||{}).length,Object.keys(d.status||{}).length);
    for(let i=0;i<max;i++){
      const snap=sessions[i]||{},rec=d.records?.[i]||{},status=d.status?.[i]||"pending",info=adminClassInfo(d.date,snap,rec,i,sessions);
      rows.push({date:d.date,index:i,status,scheduledSubject:info.scheduledSubject,actualSubject:info.actualSubject,scheduledStart:info.scheduledStart,scheduledEnd:info.scheduledEnd,actualStart:info.actualStart,actualEnd:info.actualEnd,note:d.note||"",holiday:d.holiday,type:info.type,relationship:info.relationship});
    }
    if(d.note&&!max)rows.push({date:d.date,index:"",status:"note",scheduledSubject:"—",actualSubject:"Day note",scheduledStart:"",scheduledEnd:"",actualStart:"",actualEnd:"",note:d.note,holiday:d.holiday,type:"Note",relationship:"Day note"});
    if(rows.length)grouped.push({date:d.date,rows});
  });
  const stats=adminCompute(days);
  const months=[...new Set(grouped.map(g=>String(g.date).slice(0,7)))].sort().reverse();
  if(!months.includes(adminCache.studentMonth))adminCache.studentMonth=months[0]||"";
  const selectedMonth=adminCache.studentMonth;
  const filters=[['all','All'],['present','Present'],['absent','Absent'],['not_held','Not Held'],['extra','Extra Classes'],['pending','Pending']];
  const selectedFilter=filters.some(x=>x[0]===adminCache.studentFilter)?adminCache.studentFilter:'all';
  const monthButtons=months.map(m=>{const d=new Date(Number(m.slice(0,4)),Number(m.slice(5,7))-1,1);return `<button class="filter ${m===selectedMonth?'active':''}" data-act="adminMonth" data-v="${m}">${esc(monthFmt(d))}</button>`}).join('')||'<span class="small">No attendance months available.</span>';
  const filteredGroups=grouped.filter(g=>!selectedMonth||String(g.date).slice(0,7)===selectedMonth).map(g=>({date:g.date,rows:g.rows.filter(r=>{
    if(selectedFilter==='all')return true;
    if(selectedFilter==='extra')return r.type==='Extra';
    if(selectedFilter==='present')return r.status==='attended';
    if(selectedFilter==='absent')return r.status==='absent'||r.status==='leave';
    if(selectedFilter==='not_held')return r.status==='not_held';
    if(selectedFilter==='pending')return r.status==='pending';
    return true;
  })})).filter(g=>g.rows.length);
  const detailRows=filteredGroups.map(g=>{
    const d=parseKey(g.date),label=`${DAYS[d.getDay()]}, ${fmt(d)}`;
    return `<tr class="adminDateGroup"><th colspan="6">${esc(label)}</th></tr>${g.rows.map(r=>{
      const scheduledTime=r.scheduledStart&&r.scheduledEnd?time(r.scheduledStart)+'–'+time(r.scheduledEnd):'—';
      const actualTime=r.actualStart&&r.actualEnd?time(r.actualStart)+'–'+time(r.actualEnd):'—';
      const scheduled=r.scheduledSubject?`${esc(r.scheduledSubject)}<small>${esc(scheduledTime)}</small>`:'—';
      const actual=r.actualSubject?`${esc(r.actualSubject)}<small>${esc(actualTime)}</small>`:'—';
      return `<tr><td>${scheduled}</td><td>${actual}</td><td>${esc(r.type||'Regular')}</td><td>${esc(adminStatusLabel(r.status))}</td><td>${esc(r.relationship||'—')}</td><td>${esc(r.note||'—')}</td></tr>`;
    }).join('')}`;
  }).join('')||`<tr><td colspan="6" class="small">No attendance records match this month/filter.</td></tr>`;
  const studentSync=s.updatedAt?`<span class="syncStatus syncStatusGood">✓ Last synced · ${formatCloudTime(s.updatedAt)}</span>`:'<span class="syncStatus syncStatusBad">✕ Last sync time unavailable</span>';
  return `<div class="card formCard adminHero"><div class="row" style="justify-content:space-between"><div><b>👤 ${esc(s.name||"Student")}</b><div class="small">Roll ${esc(s.rollNumber||"—")} · ${esc(s.email||"")}</div></div><button class="btn outline" data-act="backFromStudent">Back</button></div><div class="adminStudentSync detailSync">${studentSync}</div><div class="adminSummaryGrid"><div><b>${stats.present}</b><span>Present</span></div><div><b>${stats.absent}</b><span>Absent</span></div><div><b>${stats.pending}</b><span>Pending</span></div><div><b>${stats.total}</b><span>Total</span></div></div><div class="adminPercent">Overall attendance: <b>${stats.percent===null?'—':stats.percent.toFixed(1)+'%'}</b></div></div><div class="card formCard"><b>📚 Subject-wise attendance</b>${Object.entries(stats.subjects).sort((a,b)=>a[0].localeCompare(b[0])).map(([sub,x])=>`<div class="adminSubjectRow"><b>${esc(sub)}</b><span>${x.held?((x.present/x.held)*100).toFixed(1)+'%':'—'}</span><small>Present ${x.present} · Absent ${x.absent} · Pending ${x.pending} · Not Held ${x.notHeld} · Total ${x.total}</small></div>`).join('')||`<div class="small" style="margin-top:10px">No subject records yet.</div>`}</div><div class="card formCard adminMonthFilterCard"><b>🗓️ Attendance month</b><div class="tabs adminMonthList">${monthButtons}</div><div class="small adminFilterHint">Select a month to view its daily attendance.</div><b class="adminFilterTitle">🔎 Attendance filter</b><div class="tabs adminStatusFilters">${filters.map(([v,l])=>`<button class="filter ${selectedFilter===v?'active':''}" data-act="adminStudentFilter" data-v="${v}">${l}</button>`).join('')}</div></div><div class="card formCard adminDetailsCard"><div class="adminDetailsHead"><b>📋 Detailed attendance${selectedMonth?` · ${esc(monthFmt(parseKey(selectedMonth+'-01')))}`:''}</b><div class="adminReportActions"><button class="btn outline" data-act="printAdminReport">View Full Report</button><button class="btn soft" data-act="exportAdminPdf">Export PDF</button></div></div><details class="adminDetails" open><summary>Show records grouped by date</summary><div class="adminTableWrap"><table class="adminTable adminGroupedTable"><thead><tr><th>Scheduled Class</th><th>Actual Class</th><th>Type</th><th>Status</th><th>What changed?</th><th>Note</th></tr></thead><tbody>${detailRows}</tbody></table></div></details></div>`;
}
function classTypeForSnapshot(snap,rec,i,sessions){if(rec?.type)return rec.type;if(snap?.extra)return "Extra";const scheduled=snap?.scheduledSubject||rec?.scheduled||snap?.subject||rec?.subject||"";const actual=snap?.subject||rec?.subject||scheduled;const st=(snap?.start||rec?.start||"")+(snap?.end||rec?.end||"");const ot=(snap?.start||"")+(snap?.end||"");if(actual===scheduled&&st===ot)return "Regular";if(actual===scheduled)return "Rescheduled";const others=(sessions||[]).filter(x=>!x.extra).map(x=>x.scheduledSubject||x.subject);return others.includes(actual)?"Exchange / Replacement":"Replacement"}
function classTypeForAdmin(rec,d,i){if(rec?.type)return rec.type;if(rec?.scheduled&&rec.subject&&rec.scheduled!==rec.subject){if(rec.scheduledStart&&rec.start&&rec.scheduledStart!==rec.start)return rec.subject===rec.scheduled?"Rescheduled":"Replacement";return "Replacement"}return "Regular"}
function adminStatusLabel(v){return v==="attended"?"Present":v==="absent"?"Absent":v==="leave"?"Absent / Leave":v==="not_held"?"Not Held":v==="pending"?"Pending":v==="note"?"Note":String(v||"")}
function adminCompute(days){const o={present:0,absent:0,pending:0,notHeld:0,total:0,subjects:{}};days.forEach(d=>{const sessions=d.sessions||[],max=Math.max(sessions.length,Object.keys(d.records||{}).length,Object.keys(d.status||{}).length);for(let i=0;i<max;i++){const r=d.records?.[i]||{},snap=sessions[i]||{},sub=r.subject||snap.subject||r.scheduled||snap.scheduledSubject||"Unknown",st=d.status?.[i]||"pending";const x=o.subjects[sub]||(o.subjects[sub]={present:0,absent:0,pending:0,notHeld:0,total:0,held:0});o.total++;x.total++;if(st==="attended"){o.present++;x.present++;x.held++}else if(st==="absent"||st==="leave"){o.absent++;x.absent++;x.held++}else if(st==="not_held"){o.notHeld++;x.notHeld++}else{o.pending++;x.pending++}}});o.percent=o.present+o.absent?o.present/(o.present+o.absent)*100:null;return o}
async function collectAllStudentCloudData(){
  const students=await window.AttendanceCloud.listStudents(),out=[];
  for(const student of students){const days=await window.AttendanceCloud.studentDays(student.uid);out.push({student,days});}
  return out;
}
async function exportAllCSV(){
  try{toast("Preparing all-student export…");const all=await collectAllStudentCloudData();const rows=[["Student Name","Roll","Email","Day","Date","Scheduled Time","Actual Time","Subject","Class Type","Attendance","Note"]];all.forEach(({student,days})=>days.forEach(d=>{const sessions=d.sessions||[],max=Math.max(sessions.length,Object.keys(d.records||{}).length,Object.keys(d.status||{}).length);for(let i=0;i<max;i++){const r=d.records?.[i]||{},snap=sessions[i]||{},subject=r.subject||snap.subject||r.scheduled||snap.scheduledSubject||"Scheduled";rows.push([student.name,student.rollNumber,student.email,DAYS[parseKey(d.date).getDay()],d.date,r.scheduledStart&&r.scheduledEnd?time(r.scheduledStart)+" - "+time(r.scheduledEnd):snap.start&&snap.end?time(snap.start)+" - "+time(snap.end):"",r.start&&r.end?time(r.start)+" - "+time(r.end):snap.start&&snap.end?time(snap.start)+" - "+time(snap.end):"",subject,classTypeForSnapshot(snap,r,i,sessions),adminStatusLabel(d.status?.[i]||"pending"),d.note||""]);}}));const csv=rows.map(row=>row.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`Attendance-All-Students-${key(today())}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast("All-student CSV exported")}catch(e){toast("All-student export failed")}}
async function exportAllJSON(){try{toast("Preparing complete cloud export…");const all=await collectAllStudentCloudData();const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),students:all},null,2)],{type:'application/json;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`Attendance-All-Students-Full-${key(today())}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast("Complete cloud JSON exported")}catch(e){toast("All-student export failed")}}
function adminCsv(){
  const s=adminCache.students.find(x=>x.uid===adminCache.selected),days=adminCache.days||[];
  if(!s)return;
  const rows=[["Student Name","Roll","Email","Day","Date","Scheduled Time","Actual Time","Subject","Class Type","Attendance","Note"]];
  days.forEach(d=>{
    const sessions=d.sessions||[],max=Math.max(sessions.length,Object.keys(d.records||{}).length,Object.keys(d.status||{}).length);
    for(let i=0;i<max;i++){
      const r=d.records?.[i]||{},snap=sessions[i]||{},subject=r.subject||snap.subject||r.scheduled||snap.scheduledSubject||"Scheduled";
      rows.push([s.name,s.rollNumber,s.email,DAYS[parseKey(d.date).getDay()],d.date,r.scheduledStart&&r.scheduledEnd?time(r.scheduledStart)+" - "+time(r.scheduledEnd):snap.start&&snap.end?time(snap.start)+" - "+time(snap.end):"",r.start&&r.end?time(r.start)+" - "+time(r.end):snap.start&&snap.end?time(snap.start)+" - "+time(snap.end):"",subject,classTypeForSnapshot(snap,r,i,sessions),adminStatusLabel(d.status?.[i]||"pending"),d.note||""]);
    }
  });
  const csv=rows.map(row=>row.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=`Attendance-${(s.rollNumber||'student')}-${key(today())}.csv`;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function adminJson(){const s=adminCache.students.find(x=>x.uid===adminCache.selected),days=adminCache.days||[];if(!s)return;const payload={student:s,days};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`Attendance-Full-${(s.rollNumber||"student")}-${key(today())}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function pdfSafe(v){return String(v??"").replace(/[^\x20-\x7E]/g,"?").replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)")}
function wrapPdfText(text,max=88){const words=String(text||"").split(/\s+/);const out=[];let line="";for(const w of words){if(!line){line=w;continue}if((line+" "+w).length<=max)line+=" "+w;else{out.push(line);line=w}}if(line)out.push(line);return out}
function buildAdminPdf(s,days){
  const stats=adminCompute(days), lines=[];
  lines.push("ATTENDANCE REPORT");lines.push(`Student: ${s.name||"Student"}`);lines.push(`Roll: ${s.rollNumber||"-"}`);lines.push(`Email: ${s.email||"-"}`);lines.push(`Required attendance: ${Number(s.required||75)}%`);lines.push(`Overall: ${stats.percent===null?"-":stats.percent.toFixed(1)+"%"}`);lines.push(`Present: ${stats.present}   Absent: ${stats.absent}   Pending: ${stats.pending}   Total: ${stats.total}`);lines.push("");lines.push("SUBJECT-WISE ATTENDANCE");
  Object.entries(stats.subjects).sort((a,b)=>a[0].localeCompare(b[0])).forEach(([sub,x])=>lines.push(`${sub}: ${x.held?((x.present/x.held)*100).toFixed(1)+"%":"-"} | Present ${x.present} | Absent ${x.absent} | Pending ${x.pending} | Not Held ${x.notHeld} | Total ${x.total}`));
  lines.push("");lines.push("DETAILED ATTENDANCE");
  days.slice().sort((a,b)=>String(a.date).localeCompare(String(b.date))).forEach(d=>{
    const dt=parseKey(d.date),label=`${DAYS[dt.getDay()]}, ${fmt(dt)}`;lines.push("");lines.push(label);
    const sessions=d.sessions||[],max=Math.max(sessions.length,Object.keys(d.records||{}).length,Object.keys(d.status||{}).length);
    for(let i=0;i<max;i++){
      const snap=sessions[i]||{},rec=d.records?.[i]||{},status=d.status?.[i]||"pending",subject=rec.subject||snap.subject||rec.scheduled||snap.scheduledSubject||"Scheduled";
      const scheduled=rec.scheduledStart&&rec.scheduledEnd?time(rec.scheduledStart)+"-"+time(rec.scheduledEnd):snap.start&&snap.end?time(snap.start)+"-"+time(snap.end):"-";
      const actual=rec.start&&rec.end?time(rec.start)+"-"+time(rec.end):"";
      const type=rec.type||classTypeForSnapshot(snap,rec,i,sessions);const note=d.note?` | Note: ${d.note}`:"";
      wrapPdfText(`${scheduled}${actual&&actual!==scheduled?` (Actual ${actual})`:""} | ${subject} | ${type} | ${adminStatusLabel(status)}${note}`,105).forEach(x=>lines.push(x));
    }
  });
  const pageW=595,pageH=842,margin=40,lineH=14,maxLines=Math.floor((pageH-70)/lineH),pages=[];for(let i=0;i<lines.length;i+=maxLines)pages.push(lines.slice(i,i+maxLines));
  const objects=[];const addObj=x=>{objects.push(x);return objects.length};const fontObj=addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");const pageObjs=[];
  pages.forEach((pg,pi)=>{let stream="BT\n/F1 10 Tf\n";let y=pageH-45;pg.forEach((ln,idx)=>{const size=(idx===0&&pi===0)?16:10;stream+=`/F1 ${size} Tf\n1 0 0 1 ${margin} ${y} Tm (${pdfSafe(ln)}) Tj\n`;y-=lineH;if(y<45)y=45});stream+="ET";const content=addObj(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);const page=addObj(`<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /Font << /F1 ${fontObj} 0 R >> >> /Contents ${content} 0 R >>`);pageObjs.push(page)});
  const pagesObj=addObj(`<< /Type /Pages /Kids [${pageObjs.map(n=>n+" 0 R").join(" ")}] /Count ${pageObjs.length} >>`);
  pageObjs.forEach(n=>{objects[n-1]=objects[n-1].replace("/Parent 0 0 R",`/Parent ${pagesObj} 0 R`)});
  const catalog=addObj(`<< /Type /Catalog /Pages ${pagesObj} 0 R >>`);let pdf="%PDF-1.4\n";const offsets=[0];objects.forEach((obj,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${obj}\nendobj\n`});const xref=pdf.length;pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;for(let i=1;i<offsets.length;i++)pdf+=String(offsets[i]).padStart(10,"0")+" 00000 n \n";pdf+=`trailer\n<< /Size ${objects.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;return new Blob([pdf],{type:"application/pdf"})
}
function buildAdminReportData(s,days){
  const stats=adminCompute(days),grouped=[];
  days.slice().sort((a,b)=>String(a.date).localeCompare(String(b.date))).forEach(d=>{
    const sessions=d.sessions||[],max=Math.max(sessions.length,Object.keys(d.records||{}).length,Object.keys(d.status||{}).length),rows=[];
    for(let i=0;i<max;i++){
      const r=d.records?.[i]||{},snap=sessions[i]||{},status=d.status?.[i]||"pending",info=adminClassInfo(d.date,snap,r,i,sessions);
      rows.push({scheduledSubject:info.scheduledSubject,actualSubject:info.actualSubject,scheduled:info.scheduledStart&&info.scheduledEnd?time(info.scheduledStart)+'–'+time(info.scheduledEnd):'—',actual:info.actualStart&&info.actualEnd?time(info.actualStart)+'–'+time(info.actualEnd):'—',type:info.type,status:adminStatusLabel(status),relationship:info.relationship,note:d.note||""});
    }
    if(d.note&&!rows.length)rows.push({scheduledSubject:"—",actualSubject:"Day note",scheduled:"—",actual:"—",type:"Note",status:"Note",relationship:"Day note",note:d.note});
    if(rows.length){const dk=parseKey(d.date);grouped.push({label:`${DAYS[dk.getDay()]}, ${fmt(dk)}`,rows})}
  });
  return {stats,grouped};
}
function reportSubjectHtml(stats){
  return Object.entries(stats.subjects).sort((a,b)=>a[0].localeCompare(b[0])).map(([sub,x])=>`<div class="reportSubject"><b>${esc(sub)}</b><span>${x.held?((x.present/x.held)*100).toFixed(1)+"%":"—"}</span><small>Present ${x.present} · Absent ${x.absent} · Pending ${x.pending} · Not Held ${x.notHeld} · Total ${x.total}</small></div>`).join("")||'<div class="small">No subject records yet.</div>';
}
function reportDetailHtml(grouped){
  return grouped.map(g=>`<section class="reportDay"><h3>${esc(g.label)}</h3><div class="reportTable"><div class="reportTableHead"><span>Scheduled Class</span><span>Actual Class</span><span>Type</span><span>Status</span><span>What changed?</span><span>Note</span></div>${g.rows.map(r=>`<div class="reportTableRow"><span><b>${esc(r.scheduledSubject||"—")}</b><small>${esc(r.scheduled)}</small></span><span><b>${esc(r.actualSubject||"—")}</b><small>${esc(r.actual)}</small></span><span>${esc(r.type)}</span><span>${esc(r.status)}</span><span>${esc(r.relationship||"—")}</span><span>${esc(r.note||"—")}</span></div>`).join("")}</div></section>`).join("")||'<div class="small">No attendance records found.</div>';
}
function printAdminReport(){
  const s=adminCache.students.find(x=>x.uid===adminCache.selected),days=adminCache.days||[];
  if(!s){toast("Student report not found");return}
  const {stats,grouped}=buildAdminReportData(s,days);
  const modal=document.createElement("div");modal.className="modal reportModal";
  modal.innerHTML=`<div class="modalBox reportSheet"><div class="reportHead"><div><h2>📋 Attendance Report</h2><div class="small">Complete cloud record</div></div><button class="btn outline" data-act="closeModal">Close</button></div><div class="reportIdentity"><b>${esc(s.name||"Student")}</b><span>Roll ${esc(s.rollNumber||"—")} · ${esc(s.email||"")}</span><span>Required attendance: ${Number(s.required||75)}%</span></div><div class="reportMetrics"><div><b>${stats.present}</b><span>Present</span></div><div><b>${stats.absent}</b><span>Absent</span></div><div><b>${stats.pending}</b><span>Pending</span></div><div><b>${stats.total}</b><span>Total</span></div></div><div class="reportOverall">Overall attendance: <b>${stats.percent===null?"—":stats.percent.toFixed(1)+"%"}</b></div><h3 class="reportSectionTitle">📚 Subject-wise attendance</h3><div class="reportSubjects">${reportSubjectHtml(stats)}</div><h3 class="reportSectionTitle">🗓️ Detailed attendance</h3><div class="reportDetails">${reportDetailHtml(grouped)}</div></div>`;
  document.body.appendChild(modal);
}
function exportAdminPdf(){
  const s=adminCache.students.find(x=>x.uid===adminCache.selected),days=adminCache.days||[];
  if(!s){toast("Student report not found");return}
  const {stats,grouped}=buildAdminReportData(s,days);
  const modal=document.createElement("div");modal.className="modal pdfPreviewModal";
  modal.innerHTML=`<div class="pdfPreviewPage"><div class="pdfPreviewTop"><button class="btn outline" data-act="closeModal">Close</button></div><article class="pdfReport"><h1>Attendance Report</h1><div class="pdfSub">Complete cloud student attendance record</div><div class="pdfMeta"><div><b>Student</b><span>${esc(s.name||"Student")}</span></div><div><b>Roll</b><span>${esc(s.rollNumber||"—")}</span></div><div><b>Email</b><span>${esc(s.email||"—")}</span></div><div><b>Required Attendance</b><span>${Number(s.required||75)}%</span></div></div><div class="pdfSummary"><div><b>${stats.present}</b><span>Present</span></div><div><b>${stats.absent}</b><span>Absent</span></div><div><b>${stats.pending}</b><span>Pending</span></div><div><b>${stats.total}</b><span>Total</span></div><div><b>${stats.percent===null?"—":stats.percent.toFixed(1)+"%"}</b><span>Overall</span></div></div><h2>Subject-wise Attendance</h2><div class="pdfSubjectTable"><div class="pdfSubjectHead"><span>Subject</span><span>Present</span><span>Absent</span><span>Pending</span><span>Not Held</span><span>Total</span><span>%</span></div>${Object.entries(stats.subjects).sort((a,b)=>a[0].localeCompare(b[0])).map(([sub,x])=>`<div class="pdfSubjectRow"><span>${esc(sub)}</span><span>${x.present}</span><span>${x.absent}</span><span>${x.pending}</span><span>${x.notHeld}</span><span>${x.total}</span><span>${x.held?((x.present/x.held)*100).toFixed(1)+"%":"—"}</span></div>`).join("")||'<div class="pdfEmpty">No subject records yet.</div>'}</div><h2>Detailed Attendance</h2>${grouped.map(g=>`<section class="pdfDay"><h3>${esc(g.label)}</h3><table><thead><tr><th>Scheduled Class</th><th>Actual Class</th><th>Type</th><th>Status</th><th>What changed?</th><th>Note</th></tr></thead><tbody>${g.rows.map(r=>`<tr><td><b>${esc(r.scheduledSubject||"—")}</b><br><small>${esc(r.scheduled)}</small></td><td><b>${esc(r.actualSubject||"—")}</b><br><small>${esc(r.actual)}</small></td><td>${esc(r.type)}</td><td>${esc(r.status)}</td><td>${esc(r.relationship||"—")}</td><td>${esc(r.note||"—")}</td></tr>`).join("")}</tbody></table></section>`).join("")||'<div class="pdfEmpty">No attendance records found.</div>'}<div class="pdfFooter">Generated from Firebase cloud student data · Attendance Tracker</div></article></div>`;
  document.body.appendChild(modal);
}

function footer(){return `<div class="madeby">Made by Sharad Sourav 🩺</div>`}
function bottom(){let items=[["log","▣","Log"],["calendar","▦","Calendar"],["stats","▥","Stats"],["settings","⚙","Settings"]];return `<div class="nav">${items.map(x=>`<button class="${state.tab===x[0]?"active":""}" data-act="tab" data-v="${x[0]}"><b>${x[1]}</b>${x[2]}</button>`).join("")}</div>`}
function render(){applyTheme();let content=state.infoPage?dailyInfoPage():state.adminPage==="dashboard"?adminDashboard():state.adminPage==="student"?adminStudentPage(adminCache.selected):state.tab==="log"?logTab():state.tab==="stats"?statsTab():state.tab==="calendar"?calendarTab():settingsTab();let animate=window.__animateNavigation===true;window.__animateNavigation=false;document.getElementById("app").innerHTML=`<div class="app">${header()}<main class="container${animate?" tabTransition":""}">${content}${state.infoPage?"":footer()}</main>${state.infoPage?"":bottom()}</div>`}
function toast(msg){let old=document.querySelector(".toast");if(old)old.remove();let x=document.createElement("div");x.className="toast";x.textContent=msg;document.body.appendChild(x);setTimeout(()=>x.remove(),2200)}
function datePicker(){

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
document.addEventListener("change",e=>{const el=e.target.closest("#subjectSelect");if(!el)return;const wrap=document.getElementById("otherSubjectWrap");if(wrap)wrap.classList.toggle("hidden",el.value!=="__OTHER__")});
document.addEventListener("click",async e=>{let el=e.target.closest("[data-act]");if(!el)return;let a=el.dataset.act;if(a==="studentLogin"){cloudAuthModal("student")}else if(a==="adminLogin"){cloudAuthModal("admin")}else if(a==="submitCloudLogin"){await handleCloudLogin(el.dataset.mode)}else if(a==="createStudentAccount"){studentCreateModal(document.getElementById("cloudEmail")?.value||"")}else if(a==="submitCreateStudent"){await handleCreateStudentAccount()}else if(a==="forgotFromLogin"){cloudForgotModal(document.getElementById("cloudEmail")?.value||"")}else if(a==="forgotPassword"){cloudForgotModal(cloudSession.user?.email||"")}else if(a==="sendReset"){await handlePasswordReset()}else if(a==="logout"){await handleCloudLogout()}else if(a==="syncNow"){cloudQueueFull("manual")}else if(a==="adminDashboard"){await openAdminDashboard()}else if(a==="refreshAdmin"){await openAdminDashboard()}else if(a==="adminStudent"){await openAdminStudent(el.dataset.uid)}else if(a==="adminMonth"){adminCache.studentMonth=el.dataset.v;adminCache.studentFilter="all";render()}else if(a==="adminStudentFilter"){adminCache.studentFilter=el.dataset.v;render()}else if(a==="backFromAdmin"){state.adminPage=null;render()}else if(a==="backFromStudent"){state.adminPage="dashboard";adminCache.selected=null;render()}else if(a==="exportAdminCSV"){adminCsv()}else if(a==="exportAdminJSON"){adminJson()}else if(a==="exportAllCSV"){await exportAllCSV()}else if(a==="exportAllJSON"){await exportAllJSON()}else if(a==="printAdminReport"){printAdminReport()}else if(a==="exportAdminPdf"){exportAdminPdf()}else if(a==="dailyInfo"){state.infoPage=true;render()}else if(a==="backFromInfo"){state.infoPage=false;render()}else if(a==="tab"){window.__animateNavigation=true;draftDate=null;draftStatus={};state.adminPage=null;adminCache.selected=null;adminCache.days=[];state.tab=el.dataset.v;save();render()}else if(a==="prev"){draftDate=null;draftStatus={};let d=add(parseKey(state.viewDate),-1);state.viewDate=key(d<START_DATE?START_DATE:d);save();render()}else if(a==="next"){draftDate=null;draftStatus={};state.viewDate=key(add(parseKey(state.viewDate),1));save();render()}else if(a==="today"){draftDate=null;draftStatus={};state.viewDate=key(today());save();render()}else if(a==="pickDate"||a==="dateInput")datePicker();else if(a==="confirmDate"){let inp=document.getElementById("pickerDate");if(inp&&inp.value){draftDate=null;draftStatus={};state.viewDate=inp.value;window.__animateNavigation=true;state.tab="log";save();document.querySelectorAll(".modal").forEach(m=>m.remove());render()}}else if(a==="status")setStatus(el.dataset.k,el.dataset.v);else if(a==="saveAttendance")saveAttendance(state.viewDate);else if(a==="holiday")toggleHoliday(state.viewDate);else if(a==="saveNote")setNote(state.viewDate,document.getElementById("dayNote").value);else if(a==="editClass")classModal(Number(el.dataset.i));else if(a==="addExtra")extraModal();else if(a==="openTimeWheel"){let box=el.closest(".timePicker");if(box)openTimeWheel(box)}else if(a==="saveClassEdit"){let i=Number(el.dataset.i),dk=state.viewDate,base=(state.settings.schedule[parseKey(dk).getDay()]||[]).length,sub=selectedSubject(),st=readTimePicker("actualStart"),en=readTimePicker("actualEnd");if(!sub||!st||!en){toast("Enter subject and times");return}if(i<base){state.overrides[dk]=state.overrides[dk]||{};state.overrides[dk][i]={subject:sub,start:st,end:en}}else{let j=i-base;state.extraClasses[dk][j]=[st,en,sub]}save();cloudQueue("class",dk);document.querySelectorAll(".modal").forEach(m=>m.remove());render();toast("Actual class saved")}else if(a==="restoreClass"){let dk=state.viewDate,i=Number(el.dataset.i);if(state.overrides[dk])delete state.overrides[dk][i];save();cloudQueue("class",dk);document.querySelectorAll(".modal").forEach(m=>m.remove());render();toast("Scheduled class restored")}else if(a==="saveExtra"){let dk=state.viewDate,sub=selectedSubject(),st=readTimePicker("extraStart"),en=readTimePicker("extraEnd");if(!sub||!st||!en){toast("Enter subject and times");return}state.extraClasses[dk]=state.extraClasses[dk]||[];state.extraClasses[dk].push([st,en,sub]);save();cloudQueue("extra",dk);document.querySelectorAll(".modal").forEach(m=>m.remove());render();toast("Extra class added")}else if(a==="removeExtra"){let dk=state.viewDate,i=Number(el.dataset.i),base=(state.settings.schedule[parseKey(dk).getDay()]||[]).length,j=i-base;if(j<0||!state.extraClasses[dk]||!state.extraClasses[dk][j]){toast("Extra class not found");return}if(!attendanceEditable(dk,i)){toast("Saved past classes are locked");return}if(!await appConfirm("Delete this extra class? This will remove the extra class and its attendance entry for this date.","Delete extra class?"))return;state.extraClasses[dk].splice(j,1);let shiftStore=obj=>{if(!obj)return;let updates=[];Object.keys(obj).forEach(k=>{if(!k.startsWith(dk+"-"))return;let n=Number(k.slice(dk.length+1));if(!Number.isFinite(n)||n<i)return;if(n===i)updates.push([k,null]);else updates.push([k,dk+"-"+(n-1),obj[k]])});updates.forEach(x=>{if(x[1]===null){delete obj[x[0]]}else{delete obj[x[0]];obj[x[1]]=x[2]}})};shiftStore(state.status);shiftStore(state.records);shiftStore(draftStatus);save();cloudQueue("extra",dk);document.querySelectorAll(".modal").forEach(m=>m.remove());render();toast("Extra class deleted");}else if(a==="filter"){state.statsFilter=el.dataset.v;render()}else if(a==="calPrev"){let d=parseKey(state.calendarMonth);state.calendarMonth=key(new Date(d.getFullYear(),d.getMonth()-1,1));save();render()}else if(a==="calNext"){let d=parseKey(state.calendarMonth);state.calendarMonth=key(new Date(d.getFullYear(),d.getMonth()+1,1));save();render()}else if(a==="calPick"){draftDate=null;draftStatus={};state.viewDate=el.dataset.v;window.__animateNavigation=true;state.tab="log";save();render()}else if(a==="edition"){state.settings.edition=el.dataset.v;state.settings.theme=(el.dataset.v==="earth-day"||el.dataset.v==="opal-dream"||el.dataset.v==="celestial-glass"||el.dataset.v==="photon-3d")?"light":"dark";save();cloudQueue("edition");applyTheme();render()}else if(a==="saveSettings"){let rollInput=document.getElementById("setRoll");if(!state.settings.rollLocked){let rn=(rollInput?rollInput.value:"").trim();if(!/^(?:[1-9]|[1-9][0-9]|100)$/.test(rn)){showAppAlert("Please fill your Roll Number first before saving settings.","⚠️ Save Roll Number First");return}if(!await appConfirm("Confirm roll number "+rn+"? Once saved, it cannot be changed.","Save Settings"))return;state.settings.rollNumber=rn;state.settings.rollLocked=true}state.settings.name=document.getElementById("setName").value.trim()||"Student";state.settings.course=document.getElementById("setCourse").value.trim()||"Course";state.settings.required=Math.max(1,Math.min(100,Number(document.getElementById("setRequired").value)||75));state.settings.unlockHour=6;state.settings.edition=state.settings.edition||"earth-day";state.settings.theme=(state.settings.edition==="earth-day"||state.settings.edition==="opal-dream"||state.settings.edition==="celestial-glass"||state.settings.edition==="photon-3d")?"light":"dark";save();cloudQueue("settings");applyTheme();render();toast("Settings saved")}else if(a==="schedule")scheduleModal();else if(a==="closeModal"){document.querySelectorAll(".modal").forEach(m=>m.remove())}else if(a==="addSession"){let box=document.getElementById("sch"+el.dataset.day),i=box.children.length;box.insertAdjacentHTML("beforeend",scheduleRow(el.dataset.day,i,["09:00","10:00","New Subject"]))}else if(a==="removeSession"){el.parentElement.remove()}else if(a==="saveSchedule"){let ns={};for(let day=1;day<=6;day++){ns[day]=[...document.querySelectorAll("#sch"+day+" > .schRow")].map(r=>{let sub=r.querySelector(".schSubject").value;if(sub==="__OTHER__")sub=r.querySelector(".schOther").value.trim();return [readTimePicker(r.querySelector(".schStart")),readTimePicker(r.querySelector(".schEnd")),sub]}).filter(x=>x[0]&&x[1]&&x[2])}state.settings.schedule=ns;save();cloudQueue("schedule");document.querySelectorAll(".modal").forEach(m=>m.remove());render();toast("Schedule saved and will be used for future unsaved classes")}});


async function handleCreateStudentAccount(){
  const name=(document.getElementById('createName')?.value||'').trim();
  const email=(document.getElementById('createEmail')?.value||'').trim();
  const password=document.getElementById('createPassword')?.value||'';
  const password2=document.getElementById('createPassword2')?.value||'';
  const err=document.getElementById('createAccountError');
  if(!name){if(err)err.textContent='Enter your name.';return}
  if(!email){if(err)err.textContent='Enter your email address.';return}
  if(password.length<6){if(err)err.textContent='Password must be at least 6 characters.';return}
  if(password!==password2){if(err)err.textContent='Passwords do not match.';return}
  try{
    if(err)err.textContent='Creating account…';
    await window.AttendanceCloud.createStudentAccount(email,password);
    state.settings.name=name; save();
    document.querySelectorAll('.modal').forEach(m=>m.remove());
    toast('Student account created. Your existing data will now sync.');
  }catch(e){if(err)err.textContent=friendlyAuthError(e)}
}
async function handleCloudLogin(mode){
  const email=(document.getElementById("cloudEmail")?.value||"").trim(),password=document.getElementById("cloudPassword")?.value||"",err=document.getElementById("cloudAuthError");
  if(!email||!password){if(err)err.textContent="Enter email and password.";return}
  if(!window.AttendanceCloud){if(err)err.textContent="Firebase is still loading. Try again in a moment.";return}
  try{
    if(mode==="admin")await window.AttendanceCloud.signInAdmin(email,password);else await window.AttendanceCloud.signIn(email,password);
    document.querySelectorAll('.modal').forEach(m=>m.remove());
  }catch(e){if(err)err.textContent=e?.code==="auth/admin-required"?"This account is not authorized as an Admin.":friendlyAuthError(e)}
}
function friendlyAuthError(e){const c=e?.code||"";if(c.includes("invalid-credential"))return"Incorrect email or password.";if(c.includes("user-not-found"))return"No account was found with this email.";if(c.includes("wrong-password"))return"Incorrect password.";if(c.includes("invalid-email"))return"Enter a valid email address.";if(c.includes("too-many-requests"))return"Too many attempts. Please try again later.";return e?.message||"Sign-in failed."}
async function handlePasswordReset(){const email=(document.getElementById("resetEmail")?.value||"").trim(),err=document.getElementById("resetError");if(!email){if(err)err.textContent="Enter your email address.";return}try{await window.AttendanceCloud.sendPasswordResetEmail(email);if(err)err.className="cloudAuthSuccess";if(err)err.textContent="Password-reset email sent. Check your inbox."}catch(e){if(err)err.textContent=friendlyAuthError(e)}}
async function handleCloudLogout(){
  // Logout must clear account-specific app data, but the user-selected visual theme
  // is a device/UI preference and must survive logout/login.
  const savedTheme=state?.settings?.theme||"light";
  const savedEdition=state?.settings?.edition||"earth-day";
  if(window.AttendanceCloud)await window.AttendanceCloud.signOut();
  state=defaultState();
  state.settings.theme=savedTheme;
  state.settings.edition=savedEdition;
  state.adminPage=null;
  adminCache={students:[],selected:null,days:[],studentMonth:"",studentFilter:"all"};
  save();
  applyTheme();
  render();
  toast("Logged out");
}
async function hydrateAfterLogin(user){
  try{
    const localBefore=clone(state);
    const localHasData=hasMeaningfulLocalData(localBefore);
    const profile=await window.AttendanceCloud.getProfile(user.uid);
    if(profile?.updatedAt){const t=new Date(profile.updatedAt);if(!Number.isNaN(t.getTime()))cloudSession.lastSync=t;}
    const migrated=localStorage.getItem(CLOUD_MIGRATION_KEY+":"+user.uid)==="1" || !!profile?.migrationV105;
    if(!migrated && localHasData){
      // Existing phone data is the migration source on first Firebase login.
      // Never replace it with an empty/new cloud profile.
      localStorage.setItem("attendance-tracker-local-backup-v105:"+user.uid,JSON.stringify(localBefore));
      await window.AttendanceCloud.syncFullState(user.uid,localBefore,user,buildCloudSessionSnapshots(localBefore));
      await window.AttendanceCloud.markMigrationComplete(user.uid);
      localStorage.setItem(CLOUD_MIGRATION_KEY+":"+user.uid,"1");
      localStorage.removeItem(CLOUD_PENDING_KEY);
      cloudSession.lastSync=new Date(); cloudSession.error="";
      updateCloudStatus();
      render();
      toast("Your existing phone data was safely migrated to cloud");
      return;
    }
    if(profile){
      if(localStorage.getItem(CLOUD_PENDING_KEY)==="1"){
        await cloudQueueFull("pending-offline");
        toast("Pending local changes are being synced to cloud");
      }else{
        const remote=await window.AttendanceCloud.readState(user.uid,state);
        if(remote){const ui={tab:state.tab,viewDate:state.viewDate,calendarMonth:state.calendarMonth,statsFilter:state.statsFilter};state=remote;state.tab=ui.tab;state.viewDate=ui.viewDate;state.calendarMonth=ui.calendarMonth;state.statsFilter=ui.statsFilter;save();applyTheme();render();toast("Cloud data loaded")}
      }
    }else{
      await window.AttendanceCloud.syncFullState(user.uid,localBefore,user,buildCloudSessionSnapshots(localBefore));
      await window.AttendanceCloud.markMigrationComplete(user.uid);
      localStorage.setItem(CLOUD_MIGRATION_KEY+":"+user.uid,"1");
      cloudSession.lastSync=new Date();updateCloudStatus();
      toast("Cloud account created from this device's saved data");
    }
  }catch(e){cloudSession.error=cloudErrorText(e);updateCloudStatus();toast("Cloud sync failed — see Account & Cloud for the exact Firebase error")}
}
function hasMeaningfulLocalData(s){
  if(!s)return false;
  const st=s.settings||{};
  return Object.keys(s.status||{}).length||Object.keys(s.records||{}).length||Object.keys(s.notes||{}).length||Object.keys(s.holidays||{}).length||Object.keys(s.overrides||{}).length||Object.keys(s.extraClasses||{}).length||!!st.rollLocked||!!st.rollNumber||!!st.name&&st.name!=="Sharad Sourav";
}

async function openAdminDashboard(){
  if(!cloudSession.admin)return;state.adminPage="dashboard";adminCache.selected=null;render();
  try{adminCache.students=await window.AttendanceCloud.listStudents();cloudSession.lastSync=new Date();cloudSession.error="";localStorage.setItem(ADMIN_CLOUD_SYNC_KEY,cloudSession.lastSync.toISOString());updateCloudStatus();render()}catch(e){cloudSession.error=e?.message||"Admin data could not be loaded";updateCloudStatus();toast("Could not load student data")}
}
async function openAdminStudent(uid){
  state.adminPage="student";adminCache.selected=uid;adminCache.days=[];adminCache.studentMonth="";adminCache.studentFilter="all";render();
  try{adminCache.days=await window.AttendanceCloud.studentDays(uid);render()}catch(e){toast("Could not load student records");state.adminPage="dashboard";render()}
}
function setupFirebaseEvents(){
  const onReady=()=>{cloudSession.ready=true;window.AttendanceCloud?.auth&&updateCloudStatus()};
  window.addEventListener("firebase-cloud-ready",onReady,{once:true});
  window.addEventListener("firebase-auth-state",async e=>{const user=e.detail?.user||null;cloudSession.user=user;cloudSession.admin=!!e.detail?.admin;if(!user){cloudSession.error="";cloudSession.lastSync=null;state.adminPage=null;adminCache={students:[],selected:null,days:[],studentMonth:"",studentFilter:"all"};render();updateCloudStatus();return}if(!cloudSession.admin){cloudSession.error="";await hydrateAfterLogin(user)}else{cloudSession.error="";cloudSession.lastSync=readAdminLastSync();try{await window.AttendanceCloud.listStudents();cloudSession.lastSync=new Date();localStorage.setItem(ADMIN_CLOUD_SYNC_KEY,cloudSession.lastSync.toISOString());}catch(err){cloudSession.error=err?.message||"Admin cloud sync failed";}state.adminPage=null;adminCache={students:[],selected:null,days:[],studentMonth:"",studentFilter:"all"};}updateCloudStatus();render()});
  if(window.AttendanceCloud)onReady();
  setInterval(()=>{if(cloudAvailable() && !document.hidden)cloudQueueFull("interval")},CLOUD_SYNC_INTERVAL);
  window.addEventListener("online",()=>{if(cloudAvailable())cloudQueueFull("reconnect")});
}
setupFirebaseEvents();
function checkDay(){let cur=key(today());if(state.viewDate<key(START_DATE)){state.viewDate=key(START_DATE);save();render()}}document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")checkDay()});window.addEventListener("focus",checkDay);setInterval(checkDay,60000);
const ACTIVATION_KEY="attendance-tracker-activated-v1";
const ACTIVATION_CODE="Med@2026#Sharad!K7p9";
function activateGate(){
  const overlay=document.getElementById("activationOverlay");
  const input=document.getElementById("activationCode");
  const btn=document.getElementById("activationBtn");
  const error=document.getElementById("activationError");

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
load();

state.tab="log";
state.viewDate=key(today());
state.calendarMonth=key(new Date(today().getFullYear(),today().getMonth(),1));
save();
applyTheme();watchSystemTheme();render();document.documentElement.classList.remove("preboot");if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",activateGate,{once:true});}else{activateGate();}if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js?v=128",{updateViaCache:"none"}).catch(()=>{});

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
  save(); cloudQueue("schedule"); closeManageSchedule(); render(); toast('Schedule saved successfully');
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

document.addEventListener('pointerdown', function(e){
  const b=e.target.closest && e.target.closest('.statusRow .status');
  if(b && !b.disabled) b.classList.add('is-pressing');
}, true);
['pointerup','pointercancel','pointerleave'].forEach(function(type){
  document.addEventListener(type,function(e){
    const b=e.target.closest && e.target.closest('.statusRow .status');
    if(b) b.classList.remove('is-pressing');
  }, true);
});
