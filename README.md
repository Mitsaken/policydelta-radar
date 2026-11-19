# PolicyDelta Radar — Terms & Privacy Policy Semantic Drift Detector 🛡️

> **Zero-Marginal-Cost Semantic Policy Diff Engine:** Catch stealthy additions of AI model training, forced arbitration, indefinite data retention, and ad broker sharing between Privacy Policies and Terms of Service versions.

[![Live Demo](https://img.shields.io/badge/Live_Demo-PolicyDelta%20Radar-4A2C5A?style=for-the-badge&logo=github)](https://mitsaken.github.io/policydelta-radar/)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald?style=flat-square)
![Hosting Cost](https://img.shields.io/badge/Hosting-0%E2%82%AC%20(GitHub%20Pages)-emerald?style=flat-square)

---

## 🌟 Why PolicyDelta Radar?

SaaS platforms, AI vendors, and consumer apps constantly update their legal agreements to ingest your creative data, train proprietary generative models, strip class-action rights, and enforce auto-renewals. 

Because these changes are buried inside 40-page legalese documents, consumers and enterprise IT teams unknowingly accept predatory terms.

**PolicyDelta Radar** runs 100% in client-side memory, sanitizes pasted HTML/scripts, segments clauses across contrast markers, and alerts you with tiered clause verdicts (`HIGH RISK`, `MODERATE`, `HUMAN REVIEW`, `PROTECTIVE`) before you click "Agree".

> **Scope & Language Coverage:** Clause classification rules target **English-language** Terms of Service and Privacy Policies (`Scope & Verification`). Non-English policies and hedged/negated clauses (`NEEDS_HUMAN_REVIEW`) require manual human verification.

---

## 🚨 Key Vulnerability Detectors & Engine Features

1. **AI Model Training Ingestion:** Detects licenses granting vendors perpetual rights to train AI/ML models on customer content.
2. **Mandatory Binding Arbitration & Class Action Waiver:** Identifies clauses stripping constitutional court and jury trial rights.
3. **Unilateral Contract Modifications:** Flags clauses giving vendors authority to alter terms without notice.
4. **Indefinite Data Retention:** Catches clauses retaining biometric or chat telemetry forever after account termination.
5. **Data Brokers & Ad Networks:** Alerts on cross-device ad tracking and data sharing.
6. **Auto-Renewal Traps & Price Escalation:** Detects non-refundable billing terms and unconsented price increases.
7. **GDPR / CCPA Rights Expansion:** Rewards platforms that strengthen erasure, data portability, and explicit opt-out.
8. **HTML Normalization & Contrast Segmentation:** Safely strips `<script>`/`<style>` markup, splits clauses at contrast pivots (`but`, `however`, `except`, `unless`, `provided that`, `although`, `notwithstanding`, `whereas`), surfaces exact `v1`/`v2` evidence quotes, and escalates negated/hedged clauses to `HUMAN REVIEW`.

---

## 💻 CLI Usage (Automated Scrapers & CI/CD)

```bash
# Compare two policy text files and output Markdown changelog
node cli.js --base policy-v1.txt --target policy-v2.txt

# Exit with code 1 if critical predatory changes are detected
node cli.js --base policy-v1.txt --target policy-v2.txt --fail-on-critical

# Output structured JSON
node cli.js --base policy-v1.txt --target policy-v2.txt --json

# Run built-in 14-case internal regression self-test
node cli.js --selftest
```

---

## ⏸️ Early Access Roadmap & Open-Source vs Pro Boundaries (0€ Validation Mode)

- **Open-Source Web & CLI Workbench (Validation Phase):** Free client-side semantic redline diffing, local 3-state clause risk breakdown, Markdown/JSON export, and single-file Node CLI (`cli.js`).
- **Planned PolicyDelta Radar Pro Toolkit (`Planned launch price: 19 € one-time, VAT incl.` · currently `0 € today — Priority Waitlist`):**
  - Custom YAML Rule-Pack CLI (`legalops-cli.js`) merging your organization's custom clause rules alongside the core 7 detectors (`--fail-on-critical`).
  - Three ready-to-edit YAML rule packs: `saas_enterprise_pack.yaml`, `gdpr_eu_strict_pack.yaml`, and `ai_ip_protection_pack.yaml`.
  - Standalone printable HTML redline memo exporter (`--format html`) + git-tracked vendor snapshot diff GitHub Actions workflow template (`.github/workflows/policydelta-snapshot.yml`).
- 👉 Checkout is paused during `0€ Validation Mode` (`CHECKOUT_ENABLED = false`). Join the in-app **Priority Waitlist** (explicit GDPR consent, see [`privacy.html`](privacy.html)) for launch updates.

---

## 📄 License

MIT License — see [`LICENSE`](LICENSE) (`Copyright (c) 2026 Conversionlogic`).
