export const motionTokens = {
  tabFade: 0.12,
  dialogFade: 0.2,
  reducedFade: 0.12,
  sheetResponse: 0.3,
  dismissDistance: 100,
  dismissVelocity: 500,
} as const;

export const springs = {
  sheet: { type: "spring" as const, bounce: 0, visualDuration: motionTokens.sheetResponse },
  release: { type: "spring" as const, stiffness: 350, damping: 36 },
};
