import type { DateOnly, Member } from "./types";

export const TIMEZONE = "Asia/Karachi";
export function localToday(now = new Date()): DateOnly {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function localTime(now = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
}
export function validDate(value: unknown): value is DateOnly {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + "T00:00:00Z")) && new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value;
}
export function addDays(date: DateOnly, days: number): DateOnly {
  const d = new Date(date + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10);
}
export function daysBetween(from: DateOnly, to: DateOnly): number { return Math.round((Date.parse(to + "T12:00:00Z") - Date.parse(from + "T12:00:00Z")) / 86400000); }
export function inMonth(month: string, day: number): DateOnly {
  const [y, m] = month.split("-").map(Number);
  return `${month}-${String(Math.min(day, new Date(Date.UTC(y, m, 0)).getUTCDate())).padStart(2, "0")}`;
}
export function shiftMonth(date: DateOnly, offset: number, anchor = Number(date.slice(8))): DateOnly {
  const d = new Date(date + "T12:00:00Z"); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + offset); return inMonth(d.toISOString().slice(0, 7), anchor);
}
export function formatDate(date: DateOnly, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }): string {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(new Date(date + "T12:00:00Z"));
}
export function formatTime(time: string): string { const [h,m] = time.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`; }
export function money(paisa: number): string { return `Rs. ${(paisa / 100).toLocaleString("en-PK", { maximumFractionDigits: 2 })}`; }
export function isMembershipDate(member: Member, date: string): boolean {
  return member.intervals.some(i => date >= i.from && (!i.through || date <= i.through));
}
export function scheduleOn(member: Member, date: DateOnly) {
  return [...member.schedules].reverse().find(s => s.from <= date) ?? member.schedules[0];
}
export function renewalMatches(member: Member, date: DateOnly): boolean { return inMonth(date.slice(0,7), scheduleOn(member,date).day) === date; }
