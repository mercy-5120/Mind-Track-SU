// src/server/generate-hashes.js
import bcrypt from "bcrypt";

async function generateHashes() {
  const passwords = ["sumc123", "peer123", "dean123"];

  console.log("🔑 Generating password hashes...\n");

  for (const password of passwords) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log("---");
  }
}

generateHashes();
