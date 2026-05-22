import { useState, useEffect, useMemo, useRef, useCallback } from "react";

// ─── SHARED DATA ──────────────────────────────────────────────────────────────
const DAYS = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];

const SUBJECTS = [
  { id: "bio",    name: "ชีววิทยา",                    teacher: "ครูวิลาวัณย์",  color: "#4ade80", bg: "#052e16", type: "วิทย์",    emoji: "🧬" },
  { id: "chem",   name: "เคมี",                        teacher: "ครูจรัญญา",     color: "#f97316", bg: "#1c0a00", type: "วิทย์",    emoji: "⚗️" },
  { id: "phy",    name: "ฟิสิกส์",                     teacher: "ครูวลัยลักษณ์", color: "#60a5fa", bg: "#0c1a2e", type: "วิทย์",    emoji: "⚡" },
  { id: "astro",  name: "โลก ดาราศาสตร์ และอวกาศ",     teacher: "ครูกนกวรรณ",   color: "#a78bfa", bg: "#1a0a2e", type: "วิทย์",    emoji: "🌌" },
  { id: "math1",  name: "คณิตพื้นฐาน",                 teacher: "ครูวลัยลักษณ์", color: "#60a5fa", bg: "#0c1a2e", type: "คณิต",     emoji: "📐" },
  { id: "math2",  name: "คณิตเพิ่มเติม",               teacher: "ครูวลัยลักษณ์", color: "#38bdf8", bg: "#0a1f2e", type: "คณิต",     emoji: "📊" },
  { id: "social", name: "สังคมศึกษา",                  teacher: "ครูโสรัตน์",   color: "#fbbf24", bg: "#1c1000", type: "สังคม",    emoji: "🌏" },
  { id: "thai",   name: "ภาษาไทย",                     teacher: "ครูวิภารณ์",   color: "#f472b6", bg: "#1f0010", type: "ภาษา",     emoji: "📖" },
  { id: "eng1",   name: "ภาษาอังกฤษ (พื้นฐาน)",        teacher: "ครูชาดา",      color: "#34d399", bg: "#012a1a", type: "ภาษา",     emoji: "🗣️" },
  { id: "eng2",   name: "ภาษาอังกฤษเพื่อความเข้าใจ",   teacher: "ครูชาดา",      color: "#2dd4bf", bg: "#012a22", type: "ภาษา",     emoji: "📝" },
  { id: "career", name: "การงานอาชีพ",                 teacher: "ครูนที",        color: "#fb923c", bg: "#1c0800", type: "ทักษะ",    emoji: "🔧" },
  { id: "comp",   name: "คอมพิวเตอร์",                 teacher: "ครูลัดตาพร",   color: "#818cf8", bg: "#0f0a2e", type: "ทักษะ",    emoji: "💻" },
  { id: "tech",   name: "เทคโนโลยีการออกแบบ",          teacher: "ครูลัดตาพร",   color: "#c084fc", bg: "#1a0a2e", type: "ทักษะ",    emoji: "🎨" },
  { id: "drama",  name: "นาฏศิลป์",                    teacher: "ครูกีรติญา",   color: "#f9a8d4", bg: "#1f0018", type: "ศิลปะ",    emoji: "🎭" },
  { id: "pe",     name: "พลศึกษา (ลีลาศ)",             teacher: "ครูนที",        color: "#86efac", bg: "#032010", type: "ทักษะ",    emoji: "🏃" },
  { id: "hist",   name: "ประวัติศาสตร์ร่วมสมัย",       teacher: "ครูโสรัตน์",   color: "#fcd34d", bg: "#1a1000", type: "สังคม",    emoji: "🏛️" },
  { id: "guide",  name: "แนะแนว",                      teacher: "ครูนที",        color: "#94a3b8", bg: "#0f1520", type: "กิจกรรม", emoji: "🧭" },
  { id: "anti",   name: "ต้านทุจริต", teacher: "ครูวิลาวัณย์", color: "#cbd5e1", bg: "#111827", type: "กิจกรรม", emoji: "🛡️" },
  { id: "nst",   name: "นศท. / ชุมนุม",  teacher: "ครูวิลาวัณย์", color: "#94a3b8", bg: "#0f1520", type: "กิจกรรม", emoji: "🎖️" },
  { id: "home",   name: "โฮมรูม",                      teacher: "ครูประจำชั้น", color: "#e2e8f0", bg: "#1e293b", type: "กิจกรรม", emoji: "🏠" },
];

const subMap = Object.fromEntries(SUBJECTS.map(s => [s.id, s]));

const SLOTS_RAW = [
  { day: 0, s: "08:50", e: "09:00", sid: "home" },
  { day: 0, s: "09:00", e: "09:50", sid: "bio" },
  { day: 0, s: "09:50", e: "10:40", sid: "career" },
  { day: 0, s: "10:50", e: "11:40", sid: "social" },
  { day: 0, s: "11:40", e: "12:30", sid: "drama" },
  { day: 0, s: "13:30", e: "14:20", sid: "chem" },
  { day: 0, s: "14:20", e: "16:00", sid: "math1" },
  
  // วันอังคาร (day: 1)
  { day: 1, s: "08:50", e: "09:00", sid: "home" },
  { day: 1, s: "09:00", e: "09:50", sid: "social" },
  { day: 1, s: "09:50", e: "10:40", sid: "chem" },
  { day: 1, s: "10:50", e: "11:40", sid: "chem" },
  { day: 1, s: "11:40", e: "12:30", sid: "thai" },
  { day: 1, s: "13:30", e: "15:10", sid: "math2" }, 
  { day: 1, s: "15:10", e: "16:00", sid: "comp" },  
  
  // วันพุธ (day: 2)
  { day: 2, s: "08:50", e: "09:00", sid: "home" },
  { day: 2, s: "09:00", e: "09:50", sid: "astro" },
  { day: 2, s: "09:50", e: "10:40", sid: "tech" },
  { day: 2, s: "10:50", e: "12:30", sid: "bio" },
  { day: 2, s: "13:30", e: "14:20", sid: "math2" },
  { day: 2, s: "14:20", e: "16:00", sid: "eng1" },
  
  // วันพฤหัสบดี (day: 3)
  { day: 3, s: "08:50", e: "09:00", sid: "home" },
  { day: 3, s: "09:00", e: "10:40", sid: "phy" },
  { day: 3, s: "10:50", e: "11:40", sid: "astro" },
  { day: 3, s: "11:40", e: "12:30", sid: "thai" },
  { day: 3, s: "13:30", e: "14:20", sid: "guide" },
  { day: 3, s: "14:20", e: "15:10", sid: "anti" },  // 🛡️ กล่องต้านทุจริต
  { day: 3, s: "14:20", e: "16:00", sid: "nst" },   // 🎖️ เพิ่มกล่อง นศท. / ชุมนุม แยกกันเรียนในเวลาเดียวกันตรงนี้ครับ!
  
  // วันศุกร์ (day: 4)
  { day: 4, s: "08:50", e: "09:00", sid: "home" },
  { day: 4, s: "09:00", e: "10:40", sid: "eng2" },
  { day: 4, s: "10:50", e: "11:40", sid: "hist" },
  { day: 4, s: "11:40", e: "12:30", sid: "pe" },
  { day: 4, s: "13:30", e: "14:20", sid: "comp" },
  { day: 4, s: "14:20", e: "16:00", sid: "phy" },
];



function toMins(t) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function pad2(n) { return String(n).padStart(2, "0"); }

function thaiDate(d) {
  const days = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];
  const months = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const dt = new Date(d);
  return `${days[dt.getDay()]} ${dt.getDate()} ${months[dt.getMonth()]}`;
}

// Fixed Date Logic for accurate Timezone comparison
function getLocalMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function isOverdue(due) { return new Date(due + "T00:00:00") < getLocalMidnight(); }
function daysLeft(due) { return Math.ceil((new Date(due + "T00:00:00") - getLocalMidnight()) / 86400000); }

const STORAGE_KEY = "m61-homework-wiki-v2";

const STATUS = {
  pending:  { label: "ยังไม่ส่ง",  color: "#f97316", icon: "🕐" },
  done:     { label: "ส่งแล้ว",    color: "#4ade80", icon: "✅" },
  unclear:  { label: "ยังไม่ชัด",  color: "#a78bfa", icon: "❓" },
};

// ─── LIVE NOTIFICATION BANNER ────────────────────────────────────────────────
function LiveNotificationBanner() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const nowDay = now.getDay() >= 1 && now.getDay() <= 5 ? now.getDay() - 1 : 0;
  const nowMins = now.getHours() * 60 + now.getMinutes();

  // ดึงคาบเรียนของวันนี้
  const todaySlots = SLOTS_RAW.filter(s => s.day === nowDay);
  const current = todaySlots.find(s => nowMins >= toMins(s.s) && nowMins < toMins(s.e));
  const next = todaySlots.find(s => toMins(s.s) > nowMins);

  const sub = current ? subMap[current.sid] : null;
  const nextSub = next ? subMap[next.sid] : null;
  const remaining = current ? toMins(current.e) - nowMins : 0;

  // ถ้าเป็นวันเสาร์-อาทิตย์ หรือตอนกลางคืนที่ไม่มีเรียนแล้ว ให้ซ่อนแถบไปเลย
  if (!sub && !nextSub) return null;

  return (
    <div style={{
      background: sub ? "linear-gradient(90deg, #ef4444, #b91c1c)" : "linear-gradient(90deg, #1e293b, #0f172a)",
      color: "#fff",
      padding: "10px 20px",
      fontSize: 13,
      fontWeight: "bold",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      flexWrap: "wrap",
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
      fontFamily: "'Sarabun', sans-serif"
    }}>
      <span style={{
        background: "#fff",
        color: sub ? "#ef4444" : "#64748b",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 800
      }}>
        {sub ? "LIVE" : "NEXT SLOT"}
      </span>
      
      <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
        {sub ? (
          <span>ตอนนี้กำลังเรียน: <strong style={{ fontSize: 14, textDecoration: "underline" }}>{sub.name}</strong> (ครู{sub.teacher}) ⏱️ เหลืออีก {remaining} นาที</span>
        ) : (
          <span>ตอนนี้ว่าง/พักอยู่</span>
        )}
        
        {nextSub && (
          <span style={{ opacity: 0.85, fontSize: 12, borderLeft: "1px solid rgba(255,255,255,0.3)", paddingLeft: 10 }}>
            🔔 คาบถัดไป: {nextSub.name} ({next.s} น.)
          </span>
        )}
      </div>
    </div>
  );
}

// ─── HOLD BUTTON ──────────────────────────────────────────────────────────────
function HoldButton({ sub, onClick, children, size = "normal" }) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);
  const startRef = useRef(null);
  const HOLD_DURATION = 900;

  const startHold = useCallback((e) => {
    e.preventDefault();
    if (done) return;
    setHolding(true);
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(elapsed / HOLD_DURATION, 1);
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(intervalRef.current);
        setDone(true);
        setHolding(false);
        setTimeout(() => { onClick(); setProgress(0); setDone(false); }, 200);
      }
    }, 16);
  }, [done, onClick]);

  const stopHold = useCallback(() => {
    if (!holding) return;
    clearInterval(intervalRef.current);
    setHolding(false);
    setProgress(0);
  }, [holding]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const radius = size === "small" ? 18 : 22;
  const circ = 2 * Math.PI * radius;
  const dash = circ * progress;
  const color = sub?.color || "#6366f1";
  const isSmall = size === "small";

  return (
    <button
      onMouseDown={startHold} onMouseUp={stopHold} onMouseLeave={stopHold}
      onTouchStart={startHold} onTouchEnd={stopHold}
      style={{
        position: "relative",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: isSmall ? 5 : 6,
        padding: isSmall ? "6px 12px 6px 8px" : "9px 18px 9px 12px",
        borderRadius: 99,
        border: `1px solid ${done ? color : holding ? color + "80" : color + "30"}`,
        background: done ? color + "25" : holding ? color + "12" : color + "08",
        color: done ? color : holding ? color : color + "bb",
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.15s",
        fontFamily: "'Sarabun', sans-serif",
        fontSize: isSmall ? 11 : 13,
        fontWeight: 700,
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <svg width={isSmall ? 28 : 34} height={isSmall ? 28 : 34} style={{ flexShrink: 0 }}
        viewBox={`0 0 ${(radius+6)*2} ${(radius+6)*2}`}>
        <circle
          cx={radius+6} cy={radius+6} r={radius}
          fill="none" stroke={color + "20"} strokeWidth={isSmall ? 2.5 : 3}
        />
        {progress > 0 && (
          <circle
            cx={radius+6} cy={radius+6} r={radius}
            fill="none"
            stroke={done ? color : color}
            strokeWidth={isSmall ? 2.5 : 3}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${radius+6} ${radius+6})`}
            style={{ filter: `drop-shadow(0 0 4px ${color}80)`, transition: done ? "none" : undefined }}
          />
        )}
        <text x={radius+6} y={radius+6}
          textAnchor="middle" dominantBaseline="central"
          fontSize={isSmall ? 11 : 13}
          style={{ userSelect: "none" }}>
          {done ? "✓" : "📋"}
        </text>
      </svg>
      <span>{done ? "กำลังเข้า..." : children}</span>
    </button>
  );
}

// ─── TIMETABLE COMPONENTS ────────────────────────────────────────────────────
function FocusMode({ nowDay, nowMins, thaiTime }) {
  const todaySlots = SLOTS_RAW.filter(s => s.day === nowDay);
  const current = todaySlots.find(s => nowMins >= toMins(s.s) && nowMins < toMins(s.e));
  const next = todaySlots.find(s => toMins(s.s) > nowMins);
  const sub = current ? subMap[current.sid] : null;
  const nextSub = next ? subMap[next.sid] : null;
  const endMins = current ? toMins(current.e) : null;
  const remaining = endMins ? endMins - nowMins : null;
  const pct = current ? ((nowMins - toMins(current.s)) / (toMins(current.e) - toMins(current.s))) * 100 : 0;

  return (
    <div style={{ minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "2rem 1rem" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "clamp(44px,10vw,76px)", fontWeight: 800, fontFamily: "monospace", color: "#f1f5f9", letterSpacing: "0.05em", textShadow: "0 0 40px #6366f140" }}>
          {thaiTime}
        </div>
        {/* แก้ไขระยะห่างตรงนี้เรียบร้อยแล้วครับ */}
        <div style={{ fontSize: 13, color: "#475569", fontFamily: "'Sarabun', sans-serif", marginTop: 15 }}>
          เวลาไทย • วัน{DAYS[nowDay]}
        </div>
      </div>
      {sub ? (
        <div style={{ width: "100%", maxWidth: 400, background: `linear-gradient(135deg, ${sub.bg}ee, #0f172a)`, border: `1px solid ${sub.color}50`, borderRadius: 20, padding: "1.5rem 2rem", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: sub.color, marginBottom: 6, letterSpacing: "0.1em" }}>▶ กำลังเรียนอยู่ตอนนี้</div>
          <div style={{ fontSize: "clamp(18px,5vw,26px)", fontWeight: 800, color: "#f8fafc", fontFamily: "'Sarabun', sans-serif", lineHeight: 1.3 }}>{sub.name}</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>👤 {sub.teacher}</div>
          <div style={{ margin: "14px 0 6px", background: "#1e293b", borderRadius: 999, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${sub.color}80, ${sub.color})`, borderRadius: 999, transition: "width 1s linear" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>
            <span>{current.s}</span>
            <span style={{ color: sub.color, fontWeight: 700 }}>เหลือ {remaining} นาที</span>
            <span>{current.e}</span>
          </div>
        </div>
      ) : (
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 20, padding: "1.5rem 2rem", textAlign: "center", maxWidth: 400, width: "100%" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>☕</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#94a3b8" }}>ไม่มีคาบเรียนตอนนี้</div>
        </div>
      )}
      {nextSub && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#1e293b", border: `1px solid ${nextSub.color}30`, borderRadius: 14, padding: "10px 18px", maxWidth: 400, width: "100%" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: nextSub.color, boxShadow: `0 0 8px ${nextSub.color}80` }} />
          <div>
            <div style={{ fontSize: 10, color: "#475569" }}>คาบถัดไป • {next.s} น.</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: nextSub.color }}>{nextSub.name}</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 12, color: "#475569", fontFamily: "monospace" }}>อีก {toMins(next.s) - nowMins} นาที</div>
        </div>
      )}
    </div>
  );
}

// ─── HOLDABLE CELL (grid) ────────────────────────────────────────────────────
function HoldableCell({ sub, slot, trE, onGoHomework }) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);
  const startRef = useRef(null);
  const HOLD_DURATION = 900;
  const isHoldable = sub && sub.type !== "กิจกรรม"; // Updated condition

  const startHold = useCallback((e) => {
    if (!isHoldable || done) return;
    e.preventDefault();
    setHolding(true);
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(elapsed / HOLD_DURATION, 1);
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(intervalRef.current);
        setDone(true);
        setHolding(false);
        setTimeout(() => { onGoHomework(slot.sid); setProgress(0); setDone(false); }, 200);
      }
    }, 16);
  }, [isHoldable, done, onGoHomework, slot]);

  const stopHold = useCallback(() => {
    if (!holding) return;
    clearInterval(intervalRef.current);
    setHolding(false);
    setProgress(0);
  }, [holding]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const circ = 2 * Math.PI * 10;
  const dash = circ * progress;

  return (
    <div
      onMouseDown={startHold} onMouseUp={stopHold} onMouseLeave={stopHold}
      onTouchStart={startHold} onTouchEnd={stopHold}
      style={{
        background: done ? sub.color + "40" : holding ? sub.color + "25" : sub.bg + "cc",
        border: `1px solid ${holding || done ? sub.color + "90" : sub.color + "40"}`,
        borderTop: `2px solid ${sub.color}`,
        borderRadius: 7, padding: "5px 7px",
        cursor: isHoldable ? "pointer" : "default",
        userSelect: "none", WebkitTapHighlightColor: "transparent",
        position: "relative", transition: "background 0.15s, border-color 0.15s",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: sub.color, fontFamily: "'Sarabun', sans-serif", lineHeight: 1.3 }}>{sub.name}</div>
      <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 1 }}>{sub.teacher}</div>
      {toMins(slot.e) > trE && <div style={{ fontSize: 8, color: sub.color + "80", marginTop: 2 }}>({slot.s}–{slot.e})</div>}
      {isHoldable && progress > 0 && (
        <svg width="18" height="18" style={{ position: "absolute", top: 3, right: 3 }}
          viewBox="0 0 26 26">
          <circle cx="13" cy="13" r="10" fill="none" stroke={sub.color + "30"} strokeWidth="2.5"/>
          <circle cx="13" cy="13" r="10" fill="none" stroke={done ? sub.color : sub.color}
            strokeWidth="2.5" strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round" transform="rotate(-90 13 13)"
            style={{ filter: `drop-shadow(0 0 3px ${sub.color})` }}
          />
        </svg>
      )}
    </div>
  );
}

// ─── HOLDABLE LIST CARD ───────────────────────────────────────────────────────
function HoldableCard({ slot, isNow, sub, expanded, onToggleExpand, onGoHomework }) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);
  const startRef = useRef(null);
  const HOLD_DURATION = 900;
  const isHoldable = sub.type !== "กิจกรรม"; // Updated condition

  const startHold = useCallback((e) => {
    if (!isHoldable || done) return;
    setHolding(true);
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(elapsed / HOLD_DURATION, 1);
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(intervalRef.current);
        setDone(true);
        setHolding(false);
        setTimeout(() => { onGoHomework(slot.sid); setProgress(0); setDone(false); }, 200);
      }
    }, 16);
  }, [isHoldable, done, onGoHomework, slot]);

  const stopHold = useCallback((e) => {
    if (!holding) return;
    clearInterval(intervalRef.current);
    setHolding(false);
    if (progress < 0.1) onToggleExpand();
    setProgress(0);
  }, [holding, progress, onToggleExpand]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const circ = 2 * Math.PI * 16;
  const dash = circ * progress;
  const DAYS_LOCAL = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];

  return (
    <div
      onMouseDown={startHold} onMouseUp={stopHold} onMouseLeave={() => { if (holding) { clearInterval(intervalRef.current); setHolding(false); setProgress(0); } }}
      onTouchStart={startHold} onTouchEnd={stopHold}
      style={{
        background: done ? `linear-gradient(135deg, ${sub.color}30, #1a2236)` : isNow ? `linear-gradient(135deg, ${sub.bg}, #1a2236)` : sub.bg + "cc",
        border: `1px solid ${done || holding ? sub.color + "90" : isNow ? sub.color + "60" : sub.color + "25"}`,
        borderLeft: `4px solid ${sub.color}`, borderRadius: 12, padding: "12px 16px",
        cursor: isHoldable ? "pointer" : "default",
        transition: "all 0.2s", boxShadow: isNow ? `0 0 20px ${sub.color}20` : "none",
        userSelect: "none", WebkitTapHighlightColor: "transparent", position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ minWidth: 70 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: sub.color, fontFamily: "monospace" }}>{slot.s}</div>
          <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>– {slot.e}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc", fontFamily: "'Sarabun', sans-serif" }}>{sub.name}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>👤 {sub.teacher}</div>
          <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: sub.color + "20", color: sub.color, border: `1px solid ${sub.color}30` }}>{sub.type}</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#1e293b", color: "#64748b" }}>{toMins(slot.e) - toMins(slot.s)} นาที</span>
            {isHoldable && holding && <span style={{ fontSize: 10, color: sub.color, fontFamily: "'Sarabun',sans-serif" }}>กำลังเข้าดูงาน...</span>}
          </div>
        </div>
        {isHoldable && progress > 0 ? (
          <svg width="26" height="26" style={{ flexShrink: 0 }} viewBox="0 0 38 38">
            <circle cx="19" cy="19" r="16" fill="none" stroke={sub.color + "25"} strokeWidth="3"/>
            <circle cx="19" cy="19" r="16" fill="none" stroke={sub.color}
              strokeWidth="3" strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round" transform="rotate(-90 19 19)"
              style={{ filter: `drop-shadow(0 0 4px ${sub.color}80)` }}
            />
            <text x="19" y="19" textAnchor="middle" dominantBaseline="central" fontSize="9" fill={sub.color}>📋</text>
          </svg>
        ) : (
          <div style={{ fontSize: 12, color: "#334155", flexShrink: 0 }}>{expanded ? "▲" : "▼"}</div>
        )}
      </div>

      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${sub.color}20`, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[["วิชา", sub.name],["ครูผู้สอน", sub.teacher],["เวลา", `${slot.s} – ${slot.e} น.`],["ระยะเวลา", `${toMins(slot.e) - toMins(slot.s)} นาที`],["ประเภท", sub.type],["วัน", `วัน${DAYS_LOCAL[slot.day]}`]].map(([k, v]) => (
              <div key={k} style={{ fontSize: 12 }}>
                <div style={{ color: "#475569", fontSize: 10 }}>{k}</div>
                <div style={{ color: "#e2e8f0", fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
          {isHoldable && <div style={{ fontSize: 11, color: sub.color + "80", fontFamily: "'Sarabun',sans-serif" }}>💡 กดค้างที่การ์ดนี้เพื่อดูงาน {sub.name}</div>}
        </div>
      )}
    </div>
  );
}

function GridView({ slots, nowDay, nowMins, onGoHomework }) {
 const TIME_RANGES = [
    { s: "08:50", e: "09:00" }, { s: "09:00", e: "09:50" }, { s: "09:50", e: "10:40" },
    { s: "10:40", e: "10:50", brk: true },
    { s: "10:50", e: "11:40" }, { s: "11:40", e: "12:30" },
    { s: "12:30", e: "13:30", brk: true },
    { s: "13:30", e: "14:20" }, { s: "14:20", e: "15:10" },
    { s: "15:10", e: "16:00" }, // 🌟 เพิ่มแถวเวลาคาบสุดท้าย 15:10 - 16:00 น. ตรงนี้

  ];
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 600, fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ padding: "10px 14px", textAlign: "left", color: "#64748b", background: "#0f172a", borderBottom: "1px solid #1e293b", width: 60, fontFamily: "'Sarabun', sans-serif", fontSize: 11 }}>เวลา</th>
            {DAYS.map((d, i) => (
              <th key={i} style={{ padding: "10px 8px", textAlign: "center", color: i === nowDay ? "#f8fafc" : "#64748b", background: i === nowDay ? "#1e293b" : "#0f172a", borderBottom: `2px solid ${i === nowDay ? "#6366f1" : "#1e293b"}`, minWidth: 100, fontFamily: "'Sarabun', sans-serif", fontWeight: 700 }}>
                {d}{i === nowDay && <div style={{ fontSize: 9, color: "#6366f1", marginTop: 1 }}>▶ วันนี้</div>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_RANGES.map((tr, ri) => {
            const isActive = nowMins >= toMins(tr.s) && nowMins < toMins(tr.e);
            if (tr.brk) return (
              <tr key={ri}><td colSpan={6} style={{ padding: "5px 14px", textAlign: "center", color: "#475569", fontSize: 11, background: "#0a0f1a", borderBottom: "1px solid #1e293b", fontFamily: "'Sarabun', sans-serif" }}>☕ พัก {tr.s} – {tr.e}</td></tr>
            );
            return (
              <tr key={ri} style={{ background: isActive ? "#1a2236" : "transparent" }}>
                <td style={{ padding: "8px 14px", verticalAlign: "top", borderBottom: "1px solid #1e293b", color: isActive ? "#a5b4fc" : "#475569", fontFamily: "monospace", fontSize: 11, whiteSpace: "nowrap" }}>
                  {tr.s}<br /><span style={{ fontSize: 9 }}>{tr.e}</span>
                  {isActive && <div style={{ marginTop: 2, fontSize: 9, color: "#6366f1" }}>⏱ NOW</div>}
                </td>
                {DAYS.map((_, di) => {
                  const trS = toMins(tr.s);
                  const trE = toMins(tr.e);
                  const slot = slots.find(s => s.day === di && toMins(s.s) <= trS && toMins(s.e) >= trE);
                  const sub = slot ? subMap[slot.sid] : null;
                  const isFirstRow = slot && toMins(slot.s) === trS;
                  return (
                    <td key={di} style={{ padding: 4, verticalAlign: "top", borderBottom: "1px solid #1e293b", background: di === nowDay && isActive ? "#1e2d45" : sub && !isFirstRow ? sub.bg + "55" : "transparent" }}>
                      {sub && isFirstRow ? (
                        <HoldableCell sub={sub} slot={slot} trE={trE} onGoHomework={onGoHomework} />
                      ) : sub && !isFirstRow ? (
                        <div style={{ height: "100%", minHeight: 16, borderLeft: `2px solid ${sub.color}50`, marginLeft: 4, paddingLeft: 5 }}>
                          <div style={{ fontSize: 9, color: sub.color + "70", fontFamily: "'Sarabun', sans-serif" }}>↑ {sub.name}</div>
                        </div>
                      ) : <div style={{ height: 16 }} />}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── TIMETABLE APP ────────────────────────────────────────────────────────────
function TimetableApp({ onGoHomework }) {
  const [view, setView] = useState("list");
  const [activeDay, setActiveDay] = useState(0);
  const [filterTeacher, setFilterTeacher] = useState("ทั้งหมด");
  const [filterSubject, setFilterSubject] = useState("ทั้งหมด");
  const [thaiTime, setThaiTime] = useState("");
  const [nowDay, setNowDay] = useState(0);
  const [nowMins, setNowMins] = useState(0);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    function tick() {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
      setThaiTime(`${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`);
      const wd = now.getDay();
      setNowDay(wd >= 1 && wd <= 5 ? wd - 1 : 0);
      setNowMins(now.getHours() * 60 + now.getMinutes());
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Updated Filters: Not including activities/homeroom
  const ALL_TEACHERS = useMemo(() => [...new Set(SUBJECTS.filter(s => s.type !== "กิจกรรม").map(s => s.teacher))].sort(), []);
  const ALL_SUBJECTS_NAMES = useMemo(() => [...new Set(SUBJECTS.filter(s => s.type !== "กิจกรรม").map(s => s.name))].sort(), []);

  const filteredSlots = useMemo(() => SLOTS_RAW.filter(slot => {
    const sub = subMap[slot.sid];
    if (filterTeacher !== "ทั้งหมด" && sub.teacher !== filterTeacher) return false;
    if (filterSubject !== "ทั้งหมด" && sub.name !== filterSubject) return false;
    return true;
  }), [filterTeacher, filterSubject]);

  const displayedSlots = view === "list" ? filteredSlots.filter(s => s.day === activeDay) : filteredSlots;
  const hasFilter = filterTeacher !== "ทั้งหมด" || filterSubject !== "ทั้งหมด";

  const SEL = { background: "#0f172a", border: "1px solid #334155", color: "#94a3b8", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontFamily: "'Sarabun', sans-serif", outline: "none", cursor: "pointer" };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        {[{ key: "list", label: "📋 รายการ" }, { key: "grid", label: "🗓 ตาราง" }, { key: "focus", label: "⚡ โฟกัส" }].map(v => (
          <button key={v.key} onClick={() => setView(v.key)} style={{
            padding: "7px 16px", borderRadius: 20, border: "1px solid",
            borderColor: view === v.key ? "#6366f1" : "#1e293b",
            background: view === v.key ? "#6366f120" : "transparent",
            color: view === v.key ? "#a5b4fc" : "#475569",
            fontFamily: "'Sarabun', sans-serif", fontSize: 13, cursor: "pointer", fontWeight: view === v.key ? 700 : 400, transition: "all 0.15s",
          }}>{v.label}</button>
        ))}
        {view !== "focus" && (
          <div style={{ marginLeft: "auto", fontSize: 12, color: "#6366f1", background: "#6366f110", border: "1px solid #6366f130", borderRadius: 20, padding: "4px 12px" }}>
            📍 วันนี้คือวัน{DAYS[nowDay]}
          </div>
        )}
      </div>

      {view !== "focus" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "12px 16px", marginBottom: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#475569" }}>🔍 กรอง</span>
          <select value={filterTeacher} onChange={e => setFilterTeacher(e.target.value)} style={SEL}>
            <option value="ทั้งหมด">ทุกครู</option>
            {ALL_TEACHERS.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={SEL}>
            <option value="ทั้งหมด">ทุกวิชา</option>
            {ALL_SUBJECTS_NAMES.map(s => <option key={s}>{s}</option>)}
          </select>
          {hasFilter && (
            <button onClick={() => { setFilterTeacher("ทั้งหมด"); setFilterSubject("ทั้งหมด"); }} style={{ padding: "5px 12px", borderRadius: 20, border: "1px solid #ef4444", background: "#ef444410", color: "#ef4444", fontSize: 11, cursor: "pointer" }}>
              ✕ ล้างตัวกรอง
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#475569" }}>{filteredSlots.length} คาบ</span>
        </div>
      )}

      {view === "list" && (
        <div style={{ display: "flex", gap: 5, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
          {DAYS.map((d, i) => {
            const count = filteredSlots.filter(s => s.day === i).length;
            const isToday = i === nowDay;
            return (
              <button key={i} onClick={() => setActiveDay(i)} style={{
                padding: "7px 14px", borderRadius: 20, border: "1px solid",
                borderColor: activeDay === i ? "#6366f1" : isToday ? "#334155" : "#1e293b",
                background: activeDay === i ? "#6366f1" : "transparent",
                color: activeDay === i ? "#fff" : isToday ? "#94a3b8" : "#475569",
                fontFamily: "'Sarabun', sans-serif", fontSize: 13, cursor: "pointer", fontWeight: activeDay === i ? 700 : 400, flexShrink: 0, transition: "all 0.15s",
              }}>
                วัน{d}
                {count > 0 && <span style={{ marginLeft: 6, fontSize: 10, background: activeDay === i ? "#ffffff30" : "#1e293b", borderRadius: 99, padding: "1px 6px", color: activeDay === i ? "#fff" : "#64748b" }}>{count}</span>}
                {isToday && activeDay !== i && <span style={{ marginLeft: 4, fontSize: 9, color: "#6366f1" }}>●</span>}
              </button>
            );
          })}
        </div>
      )}

      {view === "focus" ? <FocusMode nowDay={nowDay} nowMins={nowMins} thaiTime={thaiTime} /> :
       view === "grid" ? <GridView slots={filteredSlots} nowDay={nowDay} nowMins={nowMins} onGoHomework={onGoHomework} /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {displayedSlots.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#334155", background: "#0f172a", borderRadius: 12, border: "1px solid #1e293b" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <div style={{ fontFamily: "'Sarabun', sans-serif", fontSize: 14 }}>ไม่พบคาบเรียนตามที่กรอง</div>
            </div>
          ) : displayedSlots.map((slot, i) => {
            const isNow = slot.day === nowDay && nowMins >= toMins(slot.s) && nowMins < toMins(slot.e);
            const sub = subMap[slot.sid];
            return (
              <div key={i}>
                {isNow && <div style={{ fontSize: 11, color: "#6366f1", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block", boxShadow: "0 0 8px #6366f1", animation: "puls 1.5s infinite" }} />
                  กำลังเรียนอยู่ตอนนี้
                </div>}
                <HoldableCard
                  slot={slot} isNow={isNow} sub={sub}
                  expanded={expanded === i}
                  onToggleExpand={() => setExpanded(expanded === i ? null : i)}
                  onGoHomework={onGoHomework}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── HOMEWORK COMPONENTS ──────────────────────────────────────────────────────
function Badge({ label, color }) {
  return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: color + "18", color, border: `1px solid ${color}30`, fontFamily: "'Sarabun',sans-serif", fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>;
}

function btnStyleHW(color, ghost = false) {
  return { padding: "6px 14px", borderRadius: 8, border: `1px solid ${color}40`, background: ghost ? "transparent" : color + "18", color, fontSize: 12, cursor: "pointer", fontFamily: "'Sarabun',sans-serif", fontWeight: 700 };
}
const labelStyle = { display: "block", fontSize: 11, color: "#64748b", marginBottom: 5, fontFamily: "'Sarabun',sans-serif", fontWeight: 600 };
function inputStyleHW(color) {
  return { width: "100%", background: "#070d1a", border: "1px solid #1e293b", borderRadius: 8, padding: "9px 12px", color: "#f1f5f9", fontSize: 13, fontFamily: "'Sarabun',sans-serif", outline: "none", boxSizing: "border-box" };
}

function HWCard({ hw, sub, onEdit, onDelete, onToggleDone }) {
  const [expanded, setExpanded] = useState(false);
  const over = isOverdue(hw.due);
  const days = daysLeft(hw.due);
  const st = STATUS[hw.status] || STATUS.pending;

  return (
    <div style={{ background: "#0d1626", border: `1px solid ${over && hw.status !== "done" ? "#ef444440" : sub.color + "20"}`, borderLeft: `3px solid ${hw.status === "done" ? "#4ade80" : over ? "#ef4444" : sub.color}`, borderRadius: 12, overflow: "hidden" }}>
      <div onClick={() => setExpanded(e => !e)} style={{ padding: "12px 14px", cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <button onClick={e => { e.stopPropagation(); onToggleDone(hw.id); }} style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, border: `2px solid ${hw.status === "done" ? "#4ade80" : "#334155"}`, background: hw.status === "done" ? "#4ade8020" : "transparent", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80" }}>
          {hw.status === "done" ? "✓" : ""}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: hw.status === "done" ? "#475569" : "#f1f5f9", textDecoration: hw.status === "done" ? "line-through" : "none", fontFamily: "'Sarabun',sans-serif", lineHeight: 1.4 }}>{hw.title}</span>
            <Badge label={st.icon + " " + st.label} color={st.color} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: over && hw.status !== "done" ? "#ef4444" : days <= 2 ? "#fbbf24" : "#64748b", fontWeight: over ? 700 : 400 }}>
              {over && hw.status !== "done" ? "⚠️ เลยกำหนด!" : days === 0 ? "🔥 ส่งวันนี้!" : days === 1 ? "⏰ พรุ่งนี้!" : `📅 ${thaiDate(hw.due)}`}
            </span>
            <span style={{ fontSize: 10, color: "#334155" }}>•</span>
            <span style={{ fontSize: 11, color: "#475569" }}>✏️ {hw.author}</span>
          </div>
        </div>
        <span style={{ color: "#334155", fontSize: 12, flexShrink: 0 }}>{expanded ? "▲" : "▼"}</span>
      </div>
      {expanded && (
        <div style={{ borderTop: "1px solid #1e293b", padding: "14px 16px" }}>
          {hw.detail ? (
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8, fontFamily: "'Sarabun',sans-serif", whiteSpace: "pre-wrap", background: "#0a1020", borderRadius: 8, padding: "10px 14px", border: "1px solid #1e293b" }}>{hw.detail}</div>
          ) : (
            <div style={{ fontSize: 12, color: "#334155", fontStyle: "italic" }}>ยังไม่มีรายละเอียด — กด แก้ไข เพื่อเพิ่ม</div>
          )}
          {hw.history?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, color: "#334155", marginBottom: 6, letterSpacing: "0.08em" }}>📜 ประวัติการแก้ไข</div>
              {hw.history.slice().reverse().map((h, i) => (
                <div key={i} style={{ fontSize: 11, color: "#475569", display: "flex", gap: 8, marginBottom: 2 }}>
                  <span style={{ color: "#334155" }}>{h.time}</span>
                  <span style={{ color: sub.color }}>{h.by}</span>
                  <span>{h.action}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={() => onEdit(hw)} style={btnStyleHW(sub.color)}>✏️ แก้ไข</button>
            <button onClick={() => onDelete(hw.id)} style={btnStyleHW("#ef4444", true)}>🗑 ลบ</button>
          </div>
        </div>
      )}
    </div>
  );
}

function HWModal({ subjectId, editing, onClose, onSave, authorName }) {
  const sub = subMap[subjectId];
  // Calculate local date correctly instead of UTC
  const tzOffset = (new Date()).getTimezoneOffset() * 60000;
  const today = (new Date(Date.now() - tzOffset)).toISOString().split("T")[0];
  
  const [form, setForm] = useState(editing ? { title: editing.title, due: editing.due, detail: editing.detail || "", status: editing.status || "pending" } : { title: "", due: today, detail: "", status: "pending" });
  function setF(k, v) { setForm(f => ({ ...f, [k]: v })); }
  
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16, backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0d1626", border: `1px solid ${sub.color}30`, borderTop: `3px solid ${sub.color}`, borderRadius: 16, width: "100%", maxWidth: 480, padding: "20px 22px", boxShadow: "0 20px 60px #000a" }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#f8fafc", fontFamily: "'Sarabun',sans-serif" }}>{editing ? "✏️ แก้ไขงาน" : "➕ เพิ่มงานใหม่"}</div>
          <div style={{ fontSize: 12, color: sub.color, marginTop: 2, fontFamily: "'Sarabun',sans-serif" }}>{sub.emoji} {sub.name} • {sub.teacher}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><label style={labelStyle}>📌 ชื่องาน *</label>
            <input value={form.title} onChange={e => setF("title", e.target.value)} placeholder="เช่น ทำแบบฝึกหัดหน้า 45-48" style={inputStyleHW(sub.color)} autoFocus />
          </div>
          <div><label style={labelStyle}>📅 กำหนดส่ง *</label>
            <input type="date" value={form.due} onChange={e => setF("due", e.target.value)} style={inputStyleHW(sub.color)} />
          </div>
          <div><label style={labelStyle}>📊 สถานะ</label>
            <div style={{ display: "flex", gap: 6 }}>
              {Object.entries(STATUS).map(([k, v]) => (
                <button key={k} onClick={() => setF("status", k)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, cursor: "pointer", border: `1px solid ${form.status === k ? v.color : "#1e293b"}`, background: form.status === k ? v.color + "20" : "transparent", color: form.status === k ? v.color : "#475569", fontSize: 11, fontFamily: "'Sarabun',sans-serif", fontWeight: 700 }}>{v.icon} {v.label}</button>
              ))}
            </div>
          </div>
          <div><label style={labelStyle}>📝 รายละเอียด (wiki)</label>
            <textarea value={form.detail} onChange={e => setF("detail", e.target.value)} placeholder="อธิบายงาน บอกว่าต้องทำอะไรบ้าง เพื่อนที่พลาดไปจะได้เข้าใจ..." rows={4} style={{ ...inputStyleHW(sub.color), resize: "vertical", lineHeight: 1.7 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={btnStyleHW("#64748b")}>ยกเลิก</button>
          <button onClick={() => form.title && form.due && onSave(form)} style={{ ...btnStyleHW(sub.color), background: sub.color, color: "#000", fontWeight: 800, opacity: form.title && form.due ? 1 : 0.4 }}>💾 บันทึก</button>
        </div>
      </div>
    </div>
  );
}

function NameModal({ onSet }) {
  const [name, setName] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "#070d1aee", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 20 }}>
      <div style={{ background: "#0d1626", border: "1px solid #6366f130", borderTop: "3px solid #6366f1", borderRadius: 16, padding: "28px 26px", maxWidth: 360, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>👋</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc", fontFamily: "'Sarabun',sans-serif" }}>สวัสดี! คุณชื่ออะไร?</div>
        <div style={{ fontSize: 12, color: "#475569", marginTop: 6, marginBottom: 20, fontFamily: "'Sarabun',sans-serif" }}>ชื่อจะแสดงเมื่อกรอกหรือแก้ไขงาน</div>
        <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && name.trim() && onSet(name.trim())} placeholder="ชื่อเล่นของคุณ เช่น ไอซ์, กล้วย, มิ้น" style={{ ...inputStyleHW("#6366f1"), marginBottom: 12, textAlign: "center" }} autoFocus />
        <button onClick={() => name.trim() && onSet(name.trim())} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: name.trim() ? "#6366f1" : "#1e293b", color: name.trim() ? "#fff" : "#334155", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Sarabun',sans-serif" }}>เข้าใช้งาน →</button>
      </div>
    </div>
  );
}

function SubjectPage({ subId, allHW, authorName, onBack, onAdd, onEdit, onDelete, onToggleDone }) {
  const sub = subMap[subId];
  const hws = allHW.filter(h => h.subjectId === subId);
  const [filterStatus, setFilterStatus] = useState("all");
  const shown = filterStatus === "all" ? hws : hws.filter(h => h.status === filterStatus);
  const pendingCount = hws.filter(h => h.status !== "done").length;
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13, fontFamily: "'Sarabun',sans-serif", padding: "4px 0", display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}>← กลับ</button>
        <div style={{ background: `linear-gradient(135deg, ${sub.color}12, #0d1626)`, border: `1px solid ${sub.color}30`, borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>{sub.emoji}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc", fontFamily: "'Sarabun',sans-serif" }}>{sub.name}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>👤 {sub.teacher}</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: pendingCount > 0 ? "#f97316" : "#4ade80", fontFamily: "monospace" }}>{pendingCount}</div>
              <div style={{ fontSize: 10, color: "#475569" }}>งานค้าง</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[["all","ทั้งหมด"],...Object.entries(STATUS).map(([k,v]) => [k,v.label])].map(([k,label]) => (
            <button key={k} onClick={() => setFilterStatus(k)} style={{ padding: "5px 12px", borderRadius: 20, border: "1px solid", borderColor: filterStatus === k ? sub.color : "#1e293b", background: filterStatus === k ? sub.color + "20" : "transparent", color: filterStatus === k ? sub.color : "#475569", fontSize: 11, cursor: "pointer", fontFamily: "'Sarabun',sans-serif" }}>{label}</button>
          ))}
        </div>
        <button onClick={() => onAdd(subId)} style={{ marginLeft: "auto", padding: "7px 16px", borderRadius: 20, border: `1px solid ${sub.color}`, background: sub.color, color: "#000", fontSize: 12, cursor: "pointer", fontFamily: "'Sarabun',sans-serif", fontWeight: 800 }}>+ เพิ่มงาน</button>
      </div>
      {shown.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#334155", background: "#0d1626", borderRadius: 12, border: "1px solid #1e293b" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 14 }}>ไม่มีงานค้างอยู่!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {shown.map(hw => <HWCard key={hw.id} hw={hw} sub={sub} onEdit={onEdit} onDelete={onDelete} onToggleDone={onToggleDone} />)}
        </div>
      )}
    </div>
  );
}

// ─── HOMEWORK APP ─────────────────────────────────────────────────────────────
function HomeworkApp({ authorName, setAuthorName, initialSubject, onBack }) {
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSub, setActiveSub] = useState(initialSubject || null);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // 1. เปลี่ยนจุดโหลดข้อมูล (ลบของเก่าแล้ววางก้อนนี้)
  useEffect(() => {
    try {
      const result = localStorage.getItem(STORAGE_KEY);
      if (result) setHomework(JSON.parse(result));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  // จุดนี้คงไว้เหมือนเดิมครับ
  useEffect(() => {
    if (initialSubject) setActiveSub(initialSubject);
  }, [initialSubject]);

  // 2. เปลี่ยนจุดเซฟข้อมูล (ลบของเก่าแล้ววางก้อนนี้)
  function save(newHW) {
    setHomework(newHW);
    try { 
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHW)); 
    } catch (e) {
      console.error(e);
    }
  }

  function handleSave(form) {
    const now = new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" });
    if (modal.editing) {
      save(homework.map(h => h.id === modal.editing.id ? { ...h, ...form, edited: true, editedBy: authorName, history: [...(h.history||[]), { by: authorName, time: now, action: "แก้ไขรายละเอียด" }] } : h));
    } else {
      save([...homework, { id: Date.now()+Math.random(), subjectId: modal.subjectId, ...form, author: authorName, createdAt: now, history: [{ by: authorName, time: now, action: "สร้างงานใหม่" }] }]);
    }
    setModal(null);
  }
  function handleDelete(id) { if (!confirm("ลบงานนี้จริงๆ?")) return; save(homework.filter(h => h.id !== id)); }
  function handleToggleDone(id) {
    const now = new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" });
    save(homework.map(h => h.id === id ? { ...h, status: h.status === "done" ? "pending" : "done", history: [...(h.history||[]), { by: authorName, time: now, action: h.status === "done" ? "ยกเลิกทำเครื่องหมายส่ง" : "ทำเครื่องหมายว่าส่งแล้ว" }] } : h));
  }

  const totalPending = homework.filter(h => h.status !== "done").length;
  const todayDue = homework.filter(h => daysLeft(h.due) === 0 && h.status !== "done").length;
  const filteredHW = homework.filter(h => {
    const sub = subMap[h.subjectId];
    const q = search.toLowerCase();
    return (!q || h.title.toLowerCase().includes(q) || sub?.name.toLowerCase().includes(q)) && (filterStatus === "all" || h.status === filterStatus);
  });

  // Fixed HW_SUBJECTS typo where "home" was listed twice
  const HW_SUBJECTS = SUBJECTS.filter(s => s.type !== "กิจกรรม");

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #334155", color: "#64748b", cursor: "pointer", fontSize: 13, fontFamily: "'Sarabun',sans-serif", padding: "6px 14px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 4 }}>← กลับตารางเรียน</button>
      </div>

      {activeSub ? (
        <SubjectPage subId={activeSub} allHW={homework} authorName={authorName} onBack={() => setActiveSub(null)} onAdd={(sid) => setModal({ subjectId: sid })} onEdit={(hw) => setModal({ subjectId: hw.subjectId, editing: hw })} onDelete={handleDelete} onToggleDone={handleToggleDone} />
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
            {[{ label: "งานทั้งหมด", val: homework.length, color: "#64748b", icon: "📋" },{ label: "ค้างอยู่", val: totalPending, color: "#f97316", icon: "🕐" },{ label: "ส่งวันนี้", val: todayDue, color: "#ef4444", icon: "🔥" }].map(({ label, val, color, icon }) => (
              <div key={label} style={{ background: "#0d1626", border: `1px solid ${color}20`, borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 20 }}>{icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "monospace" }}>{val}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 ค้นหางาน วิชา หรือครู..." style={{ flex: 1, minWidth: 180, background: "#0d1626", border: "1px solid #1e293b", borderRadius: 10, padding: "9px 14px", color: "#f1f5f9", fontSize: 13, fontFamily: "'Sarabun',sans-serif", outline: "none" }} />
            <div style={{ display: "flex", gap: 4 }}>
              {[["all","ทั้งหมด"],["pending","ค้าง"],["done","ส่งแล้ว"],["unclear","ไม่ชัด"]].map(([k,l]) => (
                <button key={k} onClick={() => setFilterStatus(k)} style={{ padding: "7px 12px", borderRadius: 10, border: "1px solid", borderColor: filterStatus === k ? "#6366f1" : "#1e293b", background: filterStatus === k ? "#6366f120" : "transparent", color: filterStatus === k ? "#a5b4fc" : "#475569", fontSize: 11, cursor: "pointer", fontFamily: "'Sarabun',sans-serif" }}>{l}</button>
              ))}
            </div>
          </div>

          {(search || filterStatus !== "all") ? (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 10 }}>🔍 ผลการค้นหา — {filteredHW.length} รายการ</div>
              {filteredHW.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#334155", background: "#0d1626", borderRadius: 12, border: "1px solid #1e293b" }}>ไม่พบงานที่ค้นหา</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredHW.map(hw => {
                    const sub = subMap[hw.subjectId];
                    return (
                      <div key={hw.id} style={{ position: "relative" }}>
                        <div style={{ position: "absolute", top: 10, right: 12, zIndex: 1, fontSize: 10, color: sub.color }}>{sub.emoji} {sub.name}</div>
                        <HWCard hw={hw} sub={sub} onEdit={(hw) => setModal({ subjectId: hw.subjectId, editing: hw })} onDelete={handleDelete} onToggleDone={handleToggleDone} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 10 }}>เลือกวิชาที่ต้องการดู</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 9 }}>
                {HW_SUBJECTS.map(sub => {
                  const hws = homework.filter(h => h.subjectId === sub.id);
                  const pending = hws.filter(h => h.status !== "done").length;
                  const overdue = hws.filter(h => h.status !== "done" && isOverdue(h.due)).length;
                  return (
                    <button key={sub.id} onClick={() => setActiveSub(sub.id)} style={{ background: "#0d1626", border: `1px solid ${overdue > 0 ? "#ef444440" : pending > 0 ? sub.color + "25" : "#1e293b"}`, borderTop: `2px solid ${overdue > 0 ? "#ef4444" : pending > 0 ? sub.color : "#1e293b"}`, borderRadius: 12, padding: "13px 13px", textAlign: "left", cursor: "pointer", transition: "all 0.2s", position: "relative" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${sub.color}15`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                      <div style={{ fontSize: 22, marginBottom: 7 }}>{sub.emoji}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Sarabun',sans-serif", lineHeight: 1.3, marginBottom: 2 }}>{sub.name}</div>
                      <div style={{ fontSize: 10, color: "#475569", marginBottom: 8 }}>{sub.teacher}</div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {pending > 0 && <Badge label={`${pending} ค้าง`} color={overdue > 0 ? "#ef4444" : sub.color} />}
                        {overdue > 0 && <Badge label={`${overdue} เลย!`} color="#ef4444" />}
                        {pending === 0 && hws.length > 0 && <Badge label="✓ เสร็จ" color="#4ade80" />}
                        {hws.length === 0 && <Badge label="ว่าง" color="#334155" />}
                      </div>
                      <div style={{ position: "absolute", top: 9, right: 11, fontSize: 10, color: "#334155" }}>{hws.length > 0 ? `${hws.length} งาน` : ""}</div>
                    </button>
                  );
                })}
              </div>
              {homework.length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 10 }}>🕐 อัพเดทล่าสุด</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[...homework].sort((a,b) => b.id - a.id).slice(0,5).map(hw => {
                      const sub = subMap[hw.subjectId];
                      return (
                        <div key={hw.id} onClick={() => setActiveSub(hw.subjectId)} style={{ background: "#0d1626", border: "1px solid #1e293b", borderLeft: `3px solid ${sub.color}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{ fontSize: 18 }}>{sub.emoji}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{hw.title}</div>
                            <div style={{ fontSize: 11, color: "#475569" }}>{sub.name} • โดย {hw.author}</div>
                          </div>
                          <Badge label={STATUS[hw.status]?.icon + " " + STATUS[hw.status]?.label} color={STATUS[hw.status]?.color} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
          {loading && <div style={{ textAlign: "center", padding: "3rem", color: "#334155" }}>⏳ กำลังโหลด...</div>}
        </>
      )}
      {modal && <HWModal subjectId={modal.subjectId} editing={modal.editing} authorName={authorName} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("timetable"); // timetable | homework
  const [targetSubject, setTargetSubject] = useState(null);
  const [thaiTime, setThaiTime] = useState("");
  const [nowDay, setNowDay] = useState(0);
  const [authorName, setAuthorName] = useState(() => {
    try { return localStorage.getItem("hw-wiki-name") || ""; } catch { return ""; }
  });

  useEffect(() => {
    function tick() {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
      setThaiTime(`${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`);
      const wd = now.getDay();
      setNowDay(wd >= 1 && wd <= 5 ? wd - 1 : 0);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  function setName(n) {
    setAuthorName(n);
    try { localStorage.setItem("hw-wiki-name", n); } catch {}
  }

  function goHomework(subjectId) {
    setTargetSubject(subjectId || null);
    setPage("homework");
  }
  function goTimetable() {
    setTargetSubject(null);
    setPage("timetable");
  }

  if (!authorName) return <NameModal onSet={setName} />;

  return (
    <div style={{ minHeight: "100vh", background: "#070d1a", color: "#f1f5f9", fontFamily: "'Sarabun', sans-serif" }}>
      <div style={{ background: "#0b1322", borderBottom: "1px solid #1e293b", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", background: "#0f172a", borderRadius: 12, padding: 3, gap: 2, border: "1px solid #1e293b" }}>
          {[{ key: "timetable", icon: "📅", label: "ตารางเรียน" }, { key: "homework", icon: "📚", label: "งาน Wiki" }].map(tab => (
            <button key={tab.key} onClick={() => tab.key === "homework" ? goHomework(null) : goTimetable()} style={{
              padding: "6px 14px", borderRadius: 9, border: "none",
              background: page === tab.key ? "#6366f1" : "transparent",
              color: page === tab.key ? "#fff" : "#475569",
              fontSize: 12, fontWeight: page === tab.key ? 700 : 400, cursor: "pointer",
              fontFamily: "'Sarabun', sans-serif", transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <span>{tab.icon}</span> <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc" }}>
            {page === "timetable" ? "ม.6/1 สว่างวิทยา" : "Wiki งาน ม.6/1"}
          </div>
          <div style={{ fontSize: 10, color: "#475569" }}>ภาค 1/2569</div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 800, color: "#6366f1", textShadow: "0 0 20px #6366f160", letterSpacing: "0.03em" }}>{thaiTime}</div>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#6366f120", border: "1px solid #6366f140", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#a5b4fc", fontWeight: 700 }}>{authorName[0]?.toUpperCase()}</div>
          <button onClick={() => setName("")} style={{ fontSize: 10, color: "#334155", background: "none", border: "none", cursor: "pointer" }}>เปลี่ยน</button>
        </div>
      </div>

      {page === "timetable" && (
        <div style={{ background: "#6366f108", borderBottom: "1px solid #6366f115", padding: "7px 20px" }}>
          <span style={{ fontSize: 11, color: "#6366f180", fontFamily: "'Sarabun',sans-serif" }}>กดค้างที่ช่องวิชาเพื่อเข้าหน้างาน Wiki</span>
        </div>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 16px 60px" }}>
        {page === "timetable" ? (
          <TimetableApp onGoHomework={goHomework} />
        ) : (
          <HomeworkApp authorName={authorName} setAuthorName={setName} initialSubject={targetSubject} onBack={goTimetable} />
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700;800&display=swap');
        @keyframes puls { 0%,100%{opacity:1} 50%{opacity:.3} }
        select option { background: #0f172a; color: #94a3b8; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 99px; }
        * { box-sizing: border-box; }
        input,textarea,select { color-scheme: dark; }
      `}</style>
    </div>
  );
}
