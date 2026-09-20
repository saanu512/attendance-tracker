import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { initializeFirestore, doc, getDoc, setDoc, collection, getDocs, writeBatch, deleteDoc } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDZhX50Yk41BiWULZjlr5vq9NG4cVztA7A",
  authDomain: "attendance-tracker-3379f.firebaseapp.com",
  projectId: "attendance-tracker-3379f",
  storageBucket: "attendance-tracker-3379f.firebasestorage.app",
  messagingSenderId: "72499909390",
  appId: "1:72499909390:web:0359565becb704ac4bbd5f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, { ignoreUndefinedProperties: true });
const USERS = "attendanceUsers";

// Firestore does not allow arrays nested inside arrays. The attendance state can
// legitimately contain nested arrays in schedule/session configuration, so the
// cloud layer stores every array through a small marker object and restores the
// original arrays when reading. This keeps the app's in-memory data unchanged.
const ARRAY_MARKER = "$attendance_tracker_array";

function toFirestoreSafe(value, seen = new WeakSet()) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "object") return value;

  if (Array.isArray(value)) {
    return {
      [ARRAY_MARKER]: value.map(item => toFirestoreSafe(item, seen))
    };
  }

  if (value instanceof Date) return value.toISOString();
  if (typeof value.toDate === "function" && typeof value.toMillis === "function") return value;

  if (seen.has(value)) throw new Error("Circular data cannot be synchronized to Firestore");
  seen.add(value);
  const out = {};
  Object.entries(value).forEach(([key, item]) => {
    const encoded = toFirestoreSafe(item, seen);
    if (encoded !== undefined) out[key] = encoded;
  });
  seen.delete(value);
  return out;
}

function fromFirestoreSafe(value, seen = new WeakSet()) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(item => fromFirestoreSafe(item, seen));

  if (Object.prototype.hasOwnProperty.call(value, ARRAY_MARKER)) {
    const encoded = value[ARRAY_MARKER];
    return Array.isArray(encoded) ? encoded.map(item => fromFirestoreSafe(item, seen)) : [];
  }

  // Preserve Firestore Timestamp / GeoPoint / other SDK value objects.
  if (typeof value.toDate === "function" || typeof value.toMillis === "function" || typeof value.latitude === "number" && typeof value.longitude === "number") {
    return value;
  }

  if (seen.has(value)) return value;
  seen.add(value);
  const out = {};
  Object.entries(value).forEach(([key, item]) => {
    out[key] = fromFirestoreSafe(item, seen);
  });
  seen.delete(value);
  return out;
}

function userRef(uid){ return doc(db, USERS, uid); }
function daysRef(uid){ return collection(db, USERS, uid, "days"); }
function dayRef(uid,date){ return doc(db, USERS, uid, "days", date); }

function stateToProfile(state, user){
  return {
    uid: user?.uid || "",
    email: user?.email || "",
    name: state.settings?.name || "Student",
    rollNumber: String(state.settings?.rollNumber || ""),
    course: state.settings?.course || "Course",
    required: Number(state.settings?.required || 75),
    rollLocked: !!state.settings?.rollLocked,
    edition: state.settings?.edition || "earth-day",
    theme: state.settings?.theme || "light",
    schedule: state.settings?.schedule || {},
    updatedAt: new Date().toISOString()
  };
}

function dayPayload(date,state,sessions=[]){
  const prefix=date+"-";
  const status={},records={};
  Object.keys(state.status||{}).forEach(k=>{if(k.startsWith(prefix))status[k.slice(prefix.length)]=state.status[k]});
  Object.keys(state.records||{}).forEach(k=>{if(k.startsWith(prefix))records[k.slice(prefix.length)]=state.records[k]});
  return {
    date,
    status,
    records,
    note: state.notes?.[date] || "",
    holiday: !!state.holidays?.[date],
    overrides: state.overrides?.[date] || {},
    extraClasses: state.extraClasses?.[date] || [],
    sessions: sessions || [],
    updatedAt: new Date().toISOString()
  };
}

function hasDayData(p){
  return (p.sessions||[]).length || Object.keys(p.status||{}).length || Object.keys(p.records||{}).length || p.note || p.holiday || Object.keys(p.overrides||{}).length || (p.extraClasses||[]).length;
}

function applyDay(state,p){
  const date=p.date;if(!date)return;
  Object.keys(state.status||{}).forEach(k=>{if(k.startsWith(date+"-"))delete state.status[k]});
  Object.keys(state.records||{}).forEach(k=>{if(k.startsWith(date+"-"))delete state.records[k]});
  if(p.status)Object.entries(p.status).forEach(([i,v])=>{if(v)state.status[date+"-"+i]=v});
  if(p.records)Object.entries(p.records).forEach(([i,v])=>{state.records[date+"-"+i]=v});
  if(p.note)state.notes[date]=p.note;else delete state.notes[date];
  if(p.holiday)state.holidays[date]=true;else delete state.holidays[date];
  if(p.overrides&&Object.keys(p.overrides).length)state.overrides[date]=p.overrides;else delete state.overrides[date];
  if(p.extraClasses&&p.extraClasses.length)state.extraClasses[date]=p.extraClasses;else delete state.extraClasses[date];
}

async function getProfile(uid){const snap=await getDoc(userRef(uid));return snap.exists()?fromFirestoreSafe(snap.data()):null;}
async function getDays(uid){const snap=await getDocs(daysRef(uid));return snap.docs.map(d=>fromFirestoreSafe(d.data()));}

async function readState(uid,localState){
  const profile=await getProfile(uid);
  if(!profile)return null;
  const days=await getDays(uid);
  const state=JSON.parse(JSON.stringify(localState));
  if(profile.name!=null)state.settings.name=profile.name;
  if(profile.rollNumber!=null)state.settings.rollNumber=String(profile.rollNumber);
  if(profile.course!=null)state.settings.course=profile.course;
  if(profile.required!=null)state.settings.required=Number(profile.required);
  if(profile.rollLocked!=null)state.settings.rollLocked=!!profile.rollLocked;
  if(profile.edition)state.settings.edition=profile.edition;
  if(profile.theme)state.settings.theme=profile.theme;
  if(profile.schedule)state.settings.schedule=profile.schedule;
  state.status={};state.records={};state.notes={};state.holidays={};state.overrides={};state.extraClasses={};
  days.forEach(p=>applyDay(state,p));
  return state;
}

async function syncProfile(uid,state,user){
  try{await setDoc(userRef(uid),toFirestoreSafe(stateToProfile(state,user)),{merge:true});}
  catch(e){e.operation="syncProfile";throw e;}
}

async function syncDay(uid,date,state,sessions=[]){
  const payload=dayPayload(date,state,sessions);
  // Replace the complete logical day record. This is intentional: merge:true
  // would leave deleted/changed fields behind in Firestore.
  try{
    if(hasDayData(payload)) await setDoc(dayRef(uid,date),toFirestoreSafe(payload),{merge:false});
    else await deleteDoc(dayRef(uid,date));
  }catch(e){e.operation="syncDay";e.date=date;throw e;}
}

async function syncFullState(uid,state,user,sessionSnapshots={}){
  await syncProfile(uid,state,user);
  const localDates=new Set();
  Object.keys(state.status||{}).forEach(k=>localDates.add(k.slice(0,10)));
  Object.keys(state.records||{}).forEach(k=>localDates.add(k.slice(0,10)));
  Object.keys(state.notes||{}).forEach(d=>localDates.add(d));
  Object.keys(state.holidays||{}).forEach(d=>localDates.add(d));
  Object.keys(state.overrides||{}).forEach(d=>localDates.add(d));
  Object.keys(state.extraClasses||{}).forEach(d=>localDates.add(d));
  Object.keys(sessionSnapshots||{}).forEach(d=>localDates.add(d));
  let remoteSnap;
  try{remoteSnap=await getDocs(daysRef(uid));}catch(e){e.operation="listStudentDays";throw e;}
  const remoteDates=new Set(remoteSnap.docs.map(d=>d.id));
  const allDates=new Set([...localDates,...remoteDates]);
  const list=[...allDates].filter(Boolean);
  for(let i=0;i<list.length;i+=400){
    const batch=writeBatch(db);
    list.slice(i,i+400).forEach(date=>{
      const payload=dayPayload(date,state,sessionSnapshots[date]||[]);
      const ref=dayRef(uid,date);
      if(localDates.has(date) && hasDayData(payload)) batch.set(ref,toFirestoreSafe(payload),{merge:false});
      else if(remoteDates.has(date)) batch.delete(ref);
    });
    try{await batch.commit();}catch(e){e.operation="writeBatch";throw e;}
  }
}

async function markMigrationComplete(uid){ try{await setDoc(userRef(uid),{migrationV105:true,migrationCompletedAt:new Date().toISOString()},{merge:true});}catch(e){e.operation="markMigrationComplete";throw e;} }

async function signIn(email,password){return signInWithEmailAndPassword(auth,email,password);}
async function createStudentAccount(email,password){return createUserWithEmailAndPassword(auth,email,password);}
async function signInAdmin(email,password){
  const cred=await signInWithEmailAndPassword(auth,email,password);
  const token=await cred.user.getIdTokenResult(true);
  if(token.claims?.admin!==true){await signOut(auth);const e=new Error("ADMIN_REQUIRED");e.code="auth/admin-required";throw e;}
  return cred;
}
async function currentAdmin(){
  if(!auth.currentUser)return false;
  // Use the already-cached ID token during startup. A forced refresh here was
  // making every app launch wait for an extra network round-trip. Admin login
  // itself still performs the explicit forced refresh in signInAdmin().
  const token=await auth.currentUser.getIdTokenResult(false);return token.claims?.admin===true;
}

async function listStudents(){
  if(!(await currentAdmin())){const e=new Error("ADMIN_REQUIRED");e.code="auth/admin-required";throw e;}
  const snap=await getDocs(collection(db,USERS));
  return snap.docs.map(d=>fromFirestoreSafe(d.data())).sort((a,b)=>String(a.name||a.email||"").localeCompare(String(b.name||b.email||"")));
}
async function studentDays(uid){
  if(!(await currentAdmin())){const e=new Error("ADMIN_REQUIRED");e.code="auth/admin-required";throw e;}
  return getDays(uid);
}

onAuthStateChanged(auth,async user=>{
  let admin=false;
  if(user){try{admin=await currentAdmin()}catch(e){admin=false}}
  window.dispatchEvent(new CustomEvent("firebase-auth-state",{detail:{user,admin}}));
});

window.AttendanceCloud={
  auth,db,
  signIn,createStudentAccount,signInAdmin,signOut:()=>signOut(auth),sendPasswordResetEmail:(email)=>sendPasswordResetEmail(auth,email),
  getProfile,getDays,readState,syncProfile,syncDay,syncFullState,markMigrationComplete,listStudents,studentDays,currentAdmin
};
window.dispatchEvent(new Event("firebase-cloud-ready"));
