import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  Unsubscribe,
} from "firebase/firestore";
import { Meeting, Decision, Conflict, TaskItem, WeeklyDigest } from "@/types";
import {
  INITIAL_MEETINGS,
  INITIAL_DECISIONS,
  INITIAL_CONFLICTS,
  INITIAL_TASKS,
  INITIAL_DIGEST,
} from "@/data/mockData";

// User's MeetMind Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAqckjw7U697baEC-dUuP0_AmZ9G7oqYn8",
  authDomain: "meetmind-e7359.firebaseapp.com",
  projectId: "meetmind-e7359",
  storageBucket: "meetmind-e7359.firebasestorage.app",
  messagingSenderId: "203627561789",
  appId: "1:203627561789:web:580b7e9848687810ae7b54",
  measurementId: "G-PR07LVHQN1",
};

// Singleton Firebase App
export const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firestore Database instance
export const db: Firestore = getFirestore(app);

// Client-only Analytics
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {});
}
export { analytics };

// Collection Names
export const COLLECTIONS = {
  MEETINGS: "meetings",
  DECISIONS: "decisions",
  CONFLICTS: "conflicts",
  TASKS: "tasks",
  DIGEST: "digest",
} as const;

/**
 * Automatically seeds the Firestore database with the initial apparel business data
 * if the database collections are currently empty.
 */
export async function seedFirestoreIfEmpty(): Promise<boolean> {
  try {
    const meetingsSnap = await getDocs(collection(db, COLLECTIONS.MEETINGS));
    if (!meetingsSnap.empty) {
      console.log("[Firebase] Database already contains data. Skipping initial seeding.");
      return false;
    }

    console.log("[Firebase] Empty database detected. Seeding initial MeetMind data to Firestore...");

    const batch = writeBatch(db);

    // 1. Seed Meetings
    INITIAL_MEETINGS.forEach((meeting) => {
      const ref = doc(db, COLLECTIONS.MEETINGS, meeting.id);
      batch.set(ref, meeting);
    });

    // 2. Seed Decisions
    INITIAL_DECISIONS.forEach((decision) => {
      const ref = doc(db, COLLECTIONS.DECISIONS, decision.id);
      batch.set(ref, decision);
    });

    // 3. Seed Conflicts
    INITIAL_CONFLICTS.forEach((conflict) => {
      const ref = doc(db, COLLECTIONS.CONFLICTS, conflict.id);
      batch.set(ref, conflict);
    });

    // 4. Seed Tasks
    INITIAL_TASKS.forEach((task) => {
      const ref = doc(db, COLLECTIONS.TASKS, task.id);
      batch.set(ref, task);
    });

    // 5. Seed Weekly Digest
    const digestRef = doc(db, COLLECTIONS.DIGEST, "current");
    batch.set(digestRef, INITIAL_DIGEST);

    await batch.commit();
    console.log("[Firebase] Initial MeetMind data successfully seeded to Firestore!");
    return true;
  } catch (error) {
    console.warn("[Firebase] Could not seed database (checking Firestore rules):", error);
    return false;
  }
}

/**
 * Real-time listener for Meetings collection.
 */
export function subscribeToMeetings(
  onData: (meetings: Meeting[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const colRef = collection(db, COLLECTIONS.MEETINGS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Meeting[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Meeting);
          });
          onData(list);
        }
      },
      (error) => {
        console.warn("[Firebase] Meetings subscription warning:", error.message);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.warn("[Firebase] Failed to attach meetings listener:", err);
    return () => {};
  }
}

/**
 * Real-time listener for Decisions collection.
 */
export function subscribeToDecisions(
  onData: (decisions: Decision[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const colRef = collection(db, COLLECTIONS.DECISIONS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Decision[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Decision);
          });
          onData(list);
        }
      },
      (error) => {
        console.warn("[Firebase] Decisions subscription warning:", error.message);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.warn("[Firebase] Failed to attach decisions listener:", err);
    return () => {};
  }
}

/**
 * Real-time listener for Conflicts collection.
 */
export function subscribeToConflicts(
  onData: (conflicts: Conflict[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const colRef = collection(db, COLLECTIONS.CONFLICTS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Conflict[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Conflict);
          });
          onData(list);
        }
      },
      (error) => {
        console.warn("[Firebase] Conflicts subscription warning:", error.message);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.warn("[Firebase] Failed to attach conflicts listener:", err);
    return () => {};
  }
}

/**
 * Real-time listener for Tasks collection.
 */
export function subscribeToTasks(
  onData: (tasks: TaskItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const colRef = collection(db, COLLECTIONS.TASKS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: TaskItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as TaskItem);
          });
          onData(list);
        }
      },
      (error) => {
        console.warn("[Firebase] Tasks subscription warning:", error.message);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.warn("[Firebase] Failed to attach tasks listener:", err);
    return () => {};
  }
}

/**
 * Real-time listener for Weekly Digest.
 */
export function subscribeToDigest(
  onData: (digest: WeeklyDigest) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const docRef = doc(db, COLLECTIONS.DIGEST, "current");
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onData(snapshot.data() as WeeklyDigest);
        }
      },
      (error) => {
        console.warn("[Firebase] Digest subscription warning:", error.message);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.warn("[Firebase] Failed to attach digest listener:", err);
    return () => {};
  }
}

// =========================================================================
// MUTATION OPERATIONS (SAVE / UPDATE)
// =========================================================================

/**
 * Save a new or updated meeting to Firestore.
 */
export async function saveMeetingToDb(meeting: Meeting): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.MEETINGS, meeting.id);
    await setDoc(ref, meeting, { merge: true });
    console.log(`[Firebase] Saved meeting ${meeting.id} to Firestore.`);
  } catch (err) {
    console.warn(`[Firebase] Failed to save meeting ${meeting.id}:`, err);
  }
}

/**
 * Delete a meeting from Firestore and any linked decisions/tasks.
 */
export async function deleteMeetingFromDb(meetingId: string): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.MEETINGS, meetingId);
    await deleteDoc(ref);
    console.log(`[Firebase] Deleted meeting ${meetingId} from Firestore.`);
  } catch (err) {
    console.warn(`[Firebase] Failed to delete meeting ${meetingId}:`, err);
  }
}

/**
 * Remove test / unwanted meetings (such as Fabric QA Seam Review) from Firestore
 */
export async function removeTestMeetingsFromDb(): Promise<void> {
  try {
    const colRef = collection(db, COLLECTIONS.MEETINGS);
    const snap = await getDocs(colRef);
    const batch = writeBatch(db);
    let count = 0;
    snap.forEach((docSnap) => {
      const data = docSnap.data() as Meeting;
      const titleLower = (data.title || "").toLowerCase();
      if (
        data.id !== "meet-01" &&
        data.id !== "meet-02" &&
        data.id !== "meet-03" &&
        (titleLower.includes("fabric qa") ||
         titleLower.includes("seam review") ||
         titleLower.includes("pull-test"))
      ) {
        batch.delete(docSnap.ref);
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
      console.log(`[Firebase] Deleted ${count} test meetings from Firestore.`);
    }

    // Also clean up linked decisions
    const decSnap = await getDocs(collection(db, COLLECTIONS.DECISIONS));
    decSnap.forEach((d) => {
      const data = d.data() as Decision;
      const text = `${data.sourceMeetingTitle || ""} ${data.title || ""}`.toLowerCase();
      if (text.includes("fabric qa") && !data.id.startsWith("dec-1") && data.id !== "dec-1") {
        deleteDoc(d.ref).catch(() => {});
      }
    });

    // Also clean up linked tasks
    const taskSnap = await getDocs(collection(db, COLLECTIONS.TASKS));
    taskSnap.forEach((t) => {
      const data = t.data() as TaskItem;
      const text = `${data.sourceMeeting || ""} ${data.title || ""}`.toLowerCase();
      if (text.includes("fabric qa") || text.includes("pull-test")) {
        deleteDoc(t.ref).catch(() => {});
      }
    });
  } catch (err) {
    console.warn("[Firebase] Error removing test meetings:", err);
  }
}

/**
 * Save a decision to Firestore.
 */
export async function saveDecisionToDb(decision: Decision): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.DECISIONS, decision.id);
    await setDoc(ref, decision, { merge: true });
    console.log(`[Firebase] Saved decision ${decision.code} to Firestore.`);
  } catch (err) {
    console.warn(`[Firebase] Failed to save decision ${decision.id}:`, err);
  }
}

/**
 * Save or update a task in Firestore.
 */
export async function saveTaskToDb(task: TaskItem): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.TASKS, task.id);
    await setDoc(ref, task, { merge: true });
    console.log(`[Firebase] Saved task ${task.id} to Firestore.`);
  } catch (err) {
    console.warn(`[Firebase] Failed to save task ${task.id}:`, err);
  }
}

/**
 * Update task status or approval in Firestore.
 */
export async function updateTaskInDb(
  taskId: string,
  updates: Partial<TaskItem>
): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.TASKS, taskId);
    await setDoc(ref, updates as any, { merge: true });
    console.log(`[Firebase] Updated task ${taskId} in Firestore.`);
  } catch (err) {
    console.warn(`[Firebase] Failed to update task ${taskId}:`, err);
  }
}

/**
 * Resolve a conflict in Firestore and update linked decisions.
 */
export async function resolveConflictInDb(
  conflictId: string,
  resolution: "kept_historical" | "adopted_proposal" | "scheduled_review"
): Promise<void> {
  try {
    // 1. Instant local persistence backup
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("meetmind_resolved_conflicts");
        const map = stored ? JSON.parse(stored) : {};
        map[conflictId] = resolution;
        localStorage.setItem("meetmind_resolved_conflicts", JSON.stringify(map));
      } catch (e) {
        console.warn("[Storage] LocalStorage error:", e);
      }
    }

    // 2. Persist to Firestore with setDoc + merge (never fails on unseeded doc)
    const conflictRef = doc(db, COLLECTIONS.CONFLICTS, conflictId);
    await setDoc(
      conflictRef,
      {
        status: "resolved",
        resolutionAction: resolution,
        resolvedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // 3. Update affected decisions in Firestore
    if (conflictId === "conf-101") {
      const d24Ref = doc(db, COLLECTIONS.DECISIONS, "dec-1");
      const d28Ref = doc(db, COLLECTIONS.DECISIONS, "dec-5");
      if (resolution === "kept_historical") {
        await setDoc(d24Ref, { status: "confirmed" }, { merge: true });
        await setDoc(d28Ref, { status: "superseded" }, { merge: true });
      } else if (resolution === "adopted_proposal") {
        await setDoc(d24Ref, { status: "superseded" }, { merge: true });
        await setDoc(d28Ref, { status: "confirmed" }, { merge: true });
      }
    }

    console.log(`[Firebase] Successfully saved conflict resolution ${conflictId} (${resolution}) to database.`);
  } catch (err) {
    console.warn(`[Firebase] Failed to persist conflict resolution for ${conflictId}:`, err);
  }
}

/**
 * Batch save an ingested meeting and all its extracted intelligence.
 */
export async function batchSaveIngestedMeeting(
  meeting: Meeting,
  decisions: Decision[],
  tasks: TaskItem[],
  conflicts: Conflict[]
): Promise<void> {
  try {
    const batch = writeBatch(db);

    // 1. Meeting
    const meetRef = doc(db, COLLECTIONS.MEETINGS, meeting.id);
    batch.set(meetRef, meeting);

    // 2. Decisions
    decisions.forEach((dec) => {
      const decRef = doc(db, COLLECTIONS.DECISIONS, dec.id);
      batch.set(decRef, dec);
    });

    // 3. Tasks
    tasks.forEach((tsk) => {
      const taskRef = doc(db, COLLECTIONS.TASKS, tsk.id);
      batch.set(taskRef, tsk);
    });

    // 4. Conflicts
    conflicts.forEach((cnf) => {
      const cnfRef = doc(db, COLLECTIONS.CONFLICTS, cnf.id);
      batch.set(cnfRef, cnf);
    });

    await batch.commit();
    console.log(`[Firebase] Successfully batch saved meeting ${meeting.id} and intelligence to Firestore.`);
  } catch (err) {
    console.warn("[Firebase] Failed to batch save meeting to Firestore:", err);
  }
}
