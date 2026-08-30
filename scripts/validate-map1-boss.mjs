import fs from "node:fs";

const source = fs.readFileSync(new URL("../client/src/game/gameData.ts", import.meta.url), "utf8");
const samples = [
  { id: "MAP1-SAMPLE-SEQ", difficulty: "M", answer: "answer: 210" },
  { id: "MAP1-SAMPLE-AREA", difficulty: "H", answer: "answer: 308" },
  { id: "MAP1-SAMPLE-SUMDIFF", difficulty: "H", answer: "answer: 187" },
  { id: "MAP1-SAMPLE-MULTI", difficulty: "M", answer: "answer: 32" },
];

const missing = samples.flatMap(({ id, difficulty, answer }) => {
  const start = source.indexOf(`id: "${id}"`);
  if (start < 0) return [id];
  const end = source.indexOf("\n  },", start);
  const record = source.slice(start, end < 0 ? source.length : end);
  return record.includes('source: "Luyện Boss Map 1 · câu mẫu kiểm thử') && record.includes(`difficulty: "${difficulty}"`) && record.includes(answer) && record.includes('pool: "boss"') ? [] : [id];
});

if (missing.length) {
  console.error(JSON.stringify({ ok: false, missing }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, sampleQuestions: samples.length, mix: { M: 2, H: 2 }, source: "Luyện Boss Map 1 · câu mẫu kiểm thử" }, null, 2));
