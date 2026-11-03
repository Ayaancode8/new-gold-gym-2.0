/** Admin-only motion; the public website keeps its existing interaction timings. */
export const adminMotion = {
  fade: 0.16,
  reducedFade: 0.12,
  spring: { type: "spring" as const, bounce: 0, visualDuration: 0.3 },
};
