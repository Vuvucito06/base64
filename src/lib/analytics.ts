import fs from "fs/promises";
import path from "path";
import "server-only";

const DATA_FILE = path.join(process.cwd(), "data", "analytics.json");
const LOCK_FILE = path.join(process.cwd(), "data", "analytics.lock");

interface DailyView {
  date: string; // "YYYY-MM-DD"
  views: number;
}

/** Acquires a lock by creating a lock file, retrying if it exists */
async function acquireLock(maxRetries = 10, retryDelay = 100): Promise<void> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await fs.writeFile(LOCK_FILE, "", { flag: "wx" }); // 'wx' fails if file exists
      return;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST") {
        await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Wait and retry
      } else {
        throw error;
      }
    }
  }
  throw new Error("Failed to acquire lock after maximum retries");
}

/** Releases the lock by deleting the lock file */
async function releaseLock(): Promise<void> {
  try {
    await fs.unlink(LOCK_FILE);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error; // Ignore if lock file is already gone
    }
  }
}

/** Reads the analytics data from analytics.json, creating the file if it doesn’t exist */
async function readAnalyticsData(): Promise<DailyView[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data) as DailyView[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      const initialData: DailyView[] = [];
      await fs.writeFile(
        DATA_FILE,
        JSON.stringify(initialData, null, 2),
        "utf8",
      );
      return initialData;
    }
    throw error;
  }
}

/** Writes the analytics data to analytics.json with locking */
async function writeAnalyticsData(data: DailyView[]): Promise<void> {
  await acquireLock();
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } finally {
    await releaseLock();
  }
}

/** Registers a page view by incrementing today’s count or adding a new entry */
export async function registerPageView(): Promise<void> {
  const data = await readAnalyticsData();
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const todayEntry = data.find((entry) => entry.date === today);

  if (todayEntry) {
    todayEntry.views += 1;
  } else {
    data.push({ date: today, views: 1 });
  }

  await writeAnalyticsData(data);
}

/** Calculates various analytics metrics from the data */
export async function getAnalyticsMetrics(): Promise<{
  totalViews: number;
  viewsToday: number;
  viewsThisMonth: number;
  viewsThisYear: number;
  averageDailyViews: number;
  averageMonthlyViews: number;
}> {
  const data = await readAnalyticsData();
  if (data.length === 0) {
    return {
      totalViews: 0,
      viewsToday: 0,
      viewsThisMonth: 0,
      viewsThisYear: 0,
      averageDailyViews: 0,
      averageMonthlyViews: 0,
    };
  }

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const currentMonth = todayStr.slice(0, 7); // "YYYY-MM"
  const currentYear = todayStr.slice(0, 4); // "YYYY"

  let totalViews = 0;
  let viewsToday = 0;
  let viewsThisMonth = 0;
  let viewsThisYear = 0;
  let earliestDate = data[0].date;

  for (const entry of data) {
    totalViews += entry.views;
    if (entry.date === todayStr) viewsToday = entry.views;
    if (entry.date.startsWith(currentMonth)) viewsThisMonth += entry.views;
    if (entry.date.startsWith(currentYear)) viewsThisYear += entry.views;
    if (entry.date < earliestDate) earliestDate = entry.date;
  }

  // Calculate days from earliest date to today (inclusive)
  const earliest = new Date(earliestDate);
  const diffTime = today.getTime() - earliest.getTime();

  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24)) + 1;

  const averageDailyViews = totalViews / diffDays;
  const averageMonthlyViews = averageDailyViews * 30.44; // Approximation

  return {
    totalViews,
    viewsToday,
    viewsThisMonth,
    viewsThisYear,
    averageDailyViews,
    averageMonthlyViews,
  };
}
