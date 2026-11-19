#!/usr/bin/env node
/**
 * PolicyDelta Radar CLI
 * Usage:
 *   node cli.js --base basePolicy.txt --target targetPolicy.txt [--fail-on-critical] [--json]
 *   node cli.js --selftest
 */

const fs = require("fs");
const path = require("path");
const { PolicyDeltaEngine } = require("./engine.js");

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.includes("--selftest")) return { selftest: true };
  const options = {
    base: null,
    target: null,
    failOnCritical: false,
    format: "markdown"
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--base" && args[i + 1]) {
      options.base = args[++i];
    } else if (args[i] === "--target" && args[i + 1]) {
      options.target = args[++i];
    } else if (args[i] === "--fail-on-critical") {
      options.failOnCritical = true;
    } else if (args[i] === "--json") {
      options.format = "json";
    }
  }
  return options;
}

function run() {
  const opts = parseArgs();
  const engine = new PolicyDeltaEngine();

  if (opts.selftest) {
    const res = engine.runSelfTest();
    res.results.forEach((r) => {
      if (!r.pass) console.error(`  FAIL: ${r.name}`);
    });
    if (res.passed !== res.total) {
      console.error(`PolicyDelta selftest FAILED (${res.passed}/${res.total} passed).`);
      process.exit(1);
    }
    console.log(`PolicyDelta Radar CLI selftest PASS (${res.passed}/${res.total} internal regression test cases).`);
    process.exit(0);
  }

  if (!opts.base || !opts.target) {
    console.error("Error: Missing required arguments.\nUsage: node cli.js --base <base.txt|html> --target <target.txt|html> [--fail-on-critical] [--json]");
    process.exit(2);
  }

  let baseContent, targetContent;
  try {
    baseContent = fs.readFileSync(path.resolve(opts.base), "utf8");
    targetContent = fs.readFileSync(path.resolve(opts.target), "utf8");
  } catch (err) {
    console.error(`Error reading policy files: ${err.message}`);
    process.exit(2);
  }

  const summary = engine.comparePolicies(baseContent, targetContent);

  if (opts.format === "json") {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(engine.generateMarkdownChangelog(summary));
  }

  if (opts.failOnCritical && summary.isPredatory) {
    console.error(`\n🚨 AUDIT FAILED: ${summary.criticalCount} critical rights shift(s) detected!`);
    process.exit(1);
  }

  process.exit(0);
}

run();
