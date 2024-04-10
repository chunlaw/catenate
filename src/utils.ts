const NUM_MAP = "๐๑๒๓๔๕๖๗๘๙";

export const replaceNumToThai = (s: string) => {
  return s.split("").map(v => NUM_MAP[parseInt(v,10)] ?? v ).join("")
}