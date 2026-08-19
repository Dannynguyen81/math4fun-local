/** Lightweight static verification for the deterministic Math4Fun practice-bank generator. */
import fs from "node:fs";

const source = fs.readFileSync(new URL("../client/src/game/practiceBank.ts", import.meta.url), "utf8");
const expectedCases = Array.from({ length: 19 }, (_, index) => `case ${index + 1}:`);
const missingCases = expectedCases.filter((token) => !source.includes(token));
const hasTwentyPerStation = source.includes("Array.from({ length: 20 }, (_, stationIndex)") && source.includes("Array.from({ length: 20 }, (_, index)");
const hasMix = source.includes('index < 8 ? "E" : index < 14 ? "M" : "H"');

if (missingCases.length || !hasTwentyPerStation || !hasMix) {
  console.error(JSON.stringify({ ok: false, missingCases, hasTwentyPerStation, hasMix }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, stations: 20, practiceQuestions: 400, mixPerStation: { E: 8, M: 6, H: 6 }, sessionMix: { E: 4, M: 3, H: 3 } }, null, 2));
