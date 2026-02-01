"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

const getLevelFromXP = (xp: number) => Math.floor(xp / 500) + 1;

const getWeeklyInsight = (weekly: number[], streak: number) => {
  const activeDays = weekly.reduce((a, b) => a + b, 0);

  if (streak >= 5) return "🔥 Strong streak — keep it alive!";
  if (activeDays >= 5) return "📈 Active most days this week!";
  if (activeDays >= 3) return "👍 Solid consistency.";
  return "💡 New week, new chance!";
};

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weekly, setWeekly] = useState<number[]>([]);

  const isDark = theme === "dark";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
      }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!user) return;

    const loadUserStats = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const today = new Date().toISOString().slice(0, 10);

      if (!snap.exists()) {
        await setDoc(ref, {
          xp: 50,
          streak: 1,
          lastActive: today,
          weeklyActivity: [0, 0, 0, 0, 0, 0, 1],
        });
        setXp(50);
        setStreak(1);
        setWeekly([0, 0, 0, 0, 0, 0, 1]);
        return;
      }

      const data = snap.data();
      let newStreak = data.streak || 0;
      let weeklyActivity: number[] = data.weeklyActivity || [0, 0, 0, 0, 0, 0, 0];

      if (data.lastActive !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const y = yesterday.toISOString().slice(0, 10);

        newStreak = data.lastActive === y ? data.streak + 1 : 1;

        weeklyActivity = [...weeklyActivity.slice(1), 1];

        await updateDoc(ref, {
          streak: newStreak,
          lastActive: today,
          weeklyActivity,
          xp: (data.xp || 0) + 50,
        });
      }

      setXp(data.xp || 0);
      setStreak(newStreak);
      setWeekly(weeklyActivity);
    };

    loadUserStats();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: isDark ? "#1f1f2e" : "#f7f7f7", // off-white bg
        paddingTop: "80px",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "80px",
          backgroundColor: isDark ? "#2e2e44" : "#fff",
          boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          padding: "0 30px",
          zIndex: 1000,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            backgroundColor: isDark ? "#5065e8" : "#e4ecff",
            color: isDark ? "white" : "#3a3a72",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(80,101,232,0.4)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? "#4353d8" : "#c9dbff")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = isDark ? "#5065e8" : "#e4ecff")}
        >
          ← Back
        </button>

        <h1
          style={{
            marginLeft: "24px",
            fontSize: "30px",
            fontWeight: "700",
            color: isDark ? "#d6d6ff" : "#5577cc",
          }}
        >
          Account
        </h1>

        {mounted && (
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            style={{
              marginLeft: "auto",
              padding: "10px",
              borderRadius: "50%",
              backgroundColor: isDark ? "#171724" : "#d0d9ff",
              border: "1px solid rgba(0,0,0,0.1)",
              cursor: "pointer",
              fontSize: "20px",
              color: isDark ? "#a0a0d5" : "#36469f",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? "#1a1a34" : "#bac9ff")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = isDark ? "#171724" : "#d0d9ff")}
            aria-label="Toggle theme"
            title="Toggle light/dark mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        )}
      </header>

      {/* CONTENT */}
      <main
        style={{
          maxWidth: "600px",
          margin: "80px auto 60px",
          borderRadius: "24px",
          padding: "36px 32px",
          boxShadow: "0 4px 18px rgba(60, 70, 150, 0.15)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: isDark ? "#d6d6ff" : "#2c3a72",
          lineHeight: 1.4,
        }}
      >
        {/* Your Account - off-white bg */}
        <section
          style={{
            backgroundColor: isDark ? "#292a38" : "#fafafa", // off-white for your account
            borderRadius: "20px",
            padding: "30px",
            marginBottom: "32px",
            boxShadow: isDark
              ? "0 2px 10px rgba(100, 100, 150, 0.3)"
              : "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              marginBottom: "24px",
              fontSize: "26px",
              fontWeight: "700",
              borderBottom: `3px solid ${isDark ? "#5055aa" : "#aac6ff"}`,
              paddingBottom: "8px",
              color: isDark ? "#d6d6ff" : "#5577cc",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>👤</span> Your Account
          </h2>

          <div style={{ marginBottom: "16px" }}>
            <strong>Email:</strong>
            <div style={{ color: isDark ? "#a8a8cc" : "#4662a6" }}>{user.email}</div>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <strong>User ID:</strong>
            <div
              style={{
                color: isDark ? "#a8a8cc" : "#4662a6",
                wordBreak: "break-word",
                fontSize: "14px",
                userSelect: "all",
              }}
              title="User UID"
            >
              {user.uid}
            </div>
          </div>
          <div>
            <strong>Account Created:</strong>
            <div style={{ color: isDark ? "#a8a8cc" : "#4662a6" }}>
              {new Date(user.metadata.creationTime || "").toLocaleDateString()}
            </div>
          </div>
        </section>

        {/* Your Progress - pastel blue bg */}
        <section
          style={{
            backgroundColor: isDark ? "#434466" : "#dbe8ff",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: isDark
              ? "0 2px 8px rgba(100, 100, 150, 0.5)"
              : "0 2px 10px rgba(90, 110, 190, 0.15)",
          }}
        >
          <h3
            style={{
              marginBottom: "16px",
              fontSize: "22px",
              fontWeight: "700",
              color: isDark ? "#ccd5ff" : "#2a4f94",
            }}
          >
            📊 Your Progress
          </h3>
          <div style={{ marginBottom: "12px" }}>
            🔥 <strong>Streak:</strong> {streak} day{streak !== 1 ? "s" : ""}
          </div>
          <div style={{ marginBottom: "12px" }}>
            ⭐ <strong>Level:</strong> {getLevelFromXP(xp)}
          </div>
          <div style={{ marginBottom: "12px" }}>
            📈 <strong>XP:</strong> {xp}
          </div>
          <div style={{ fontStyle: "italic", color: isDark ? "#b0b6db" : "#2a4f94" }}>
            {getWeeklyInsight(weekly, streak)}
          </div>
        </section>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#f9a8b7", // pastel pink
            color: "#3a1a2e",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(249, 168, 183, 0.6)",
            transition: "background-color 0.3s ease",
            marginTop: "32px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f48ca2")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f9a8b7")}
        >
           Log out
        </button>
      </main>
    </div>
  );
}


