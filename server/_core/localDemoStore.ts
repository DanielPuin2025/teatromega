import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AttendanceRecord, AttendanceSession, Student } from "../../drizzle/schema";

type LocalDemoState = {
  students: Student[];
  sessions: AttendanceSession[];
  records: AttendanceRecord[];
  nextStudentId: number;
  nextSessionId: number;
  nextRecordId: number;
};

const dataPath = path.resolve(process.cwd(), ".local-demo-data.json");

function emptyState(): LocalDemoState {
  return {
    students: [],
    sessions: [],
    records: [],
    nextStudentId: 1,
    nextSessionId: 1,
    nextRecordId: 1,
  };
}

let statePromise: Promise<LocalDemoState> | undefined;
let saveQueue: Promise<void> = Promise.resolve();

async function loadState(): Promise<LocalDemoState> {
  try {
    const contents = await readFile(dataPath, "utf8");
    return JSON.parse(contents, (key, value: unknown) => {
      if (
        (key === "createdAt" || key === "updatedAt") &&
        typeof value === "string"
      ) {
        return new Date(value);
      }
      return value;
    }) as LocalDemoState;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return emptyState();
    }
    throw error;
  }
}

export function getLocalDemoState(): Promise<LocalDemoState> {
  statePromise ??= loadState();
  return statePromise;
}

export async function saveLocalDemoState(state: LocalDemoState): Promise<void> {
  const contents = JSON.stringify(state, null, 2);
  const write = saveQueue.then(() => writeFile(dataPath, contents, "utf8"));
  saveQueue = write.catch(error => {
    console.error("[Local demo] Failed to save local data:", error);
  });
  await write;
}
