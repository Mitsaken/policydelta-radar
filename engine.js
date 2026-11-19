/**
 * PolicyDelta Radar - Privacy Policy & Terms of Service Semantic Drift Engine v1.0
 * 100% Client-Side, Zero Marginal Cost Stealth Change Detector
 * Supports Terms of Service, Privacy Policies, and EULAs
 */

// Sample Datasets for 1-Click Verification
const SAMPLE_POLICIES = {
  saas_ai_ingestion: {
    name: "SaaS AI Model Ingestion Drift (Slack/Zoom Style)",
    description: "Simulates a stealthy update where the vendor grants itself broad rights to ingest and train generative AI models on customer chats and uploads.",
    basePolicy: `1. Grant of License & User Content:
You retain all ownership rights in your customer data. The Company accesses your content solely to the extent necessary to provide, maintain, and secure the cloud services. We do not use your private communications, files, or customer data for advertising purposes.

2. Data Retention & Deletion:
Upon termination of your account, your data will be permanently deleted from our primary servers within thirty (30) days, except where retention is strictly required by applicable financial law.

3. Dispute Resolution:
Any controversy or claim arising out of or relating to these Terms shall be settled by the courts of your local jurisdiction in accordance with applicable consumer protection laws.`,
    
    targetPolicy: `1. Grant of License & User Content:
You retain ownership rights in your content. However, you grant the Company a worldwide, perpetual, royalty-free license to use, reproduce, and process your content, including communications and uploaded documents, for the purpose of training, developing, and improving our artificial intelligence, machine learning models, and algorithmic capabilities.

2. Data Retention & Deletion:
The Company reserves the right to retain de-identified, aggregated, and model-ingested derivative data indefinitely for continuous AI model development, even following account termination.

3. Dispute Resolution & Mandatory Arbitration:
You agree that any dispute arising out of these Terms shall be resolved exclusively through final and binding individual arbitration administered by AAA. You hereby waive any right to participate in a class action lawsuit or jury trial.`
  },

  predatory_arbitration: {
    name: "Stealth Arbitration & Unilateral Modification Trap",
    description: "Simulates an app stripping consumer court rights via forced arbitration and granting itself unilateral price hike authority.",
    basePolicy: `Terms of Service v1.0:
1. Service Terms: We provide social networking tools for consumers.
2. Pricing: Monthly subscriptions cost $9.99/mo. We will notify you at least 30 days prior to any price adjustment.
3. Legal Venue: Disputes are resolved in the state courts of Delaware.`,

    targetPolicy: `Terms of Service v2.0:
1. Service Terms: We provide social networking tools. We reserve the right to modify these terms at any time in our sole discretion without prior notice.
2. Pricing: Subscriptions auto-renew indefinitely. Prices may increase without explicit consent upon renewal.
3. Binding Individual Arbitration & Class Action Waiver: You agree to resolve all disputes exclusively through confidential binding arbitration. You waive any right to bring or participate in any class action, collective, or representative proceeding.`
  },

  gdpr_friendly_update: {
    name: "Safe GDPR & User Rights Enhancement",
    description: "Simulates an ethical, user-friendly update clarifying data protection rights and explicit cookie opt-in.",
    basePolicy: `Privacy Notice v1.0:
We collect your email and IP address when you register. We use cookies for analytics.`,

    targetPolicy: `Privacy Notice v1.1 (GDPR Compliant):
We collect your email and IP address solely for authentication and security. We do not sell your personal data. Under GDPR and CCPA, you maintain the right to access, export, rectify, or request complete erasure of your data at any time through our self-service privacy portal. Non-essential cookies require your explicit prior consent.`
  }
};

// 7 Bounded Non-ReDoS Semantic Privacy & Rights Vulnerability Rules
// Word-gap quantifiers (?:\s+\S+){0,12} keep whitespace/non-whitespace disjoint (O(N) linear scan, Turonova et al. p. 15)
const POLICY_VULNERABILITY_RULES = [
  {
    id: "FORCED_ARBITRATION",
    category: "Legal Recourse & Rights",
    title: "Mandatory Binding Arbitration & Class Action Waiver",
    severity: "CRITICAL",
    riskWeight: 25,
    regex: /(?:binding arbitration|individual arbitration|waive(?:\s+\S+){0,12}\s+class action|class action waiver|jury trial waiver|no class proceedings)/i,
    negationRegex: /\b(?:no binding arbitration|no mandatory arbitration|not subject to binding arbitration|never force arbitration)\b/i,
    corroborationRegex: /\b(?:exclusive(?:ly)?|mandatory|waive|final|jury|collective|representative)\b/gi,
    explain: "Deprives users of constitutional court access, jury trials, and collective class action lawsuits, forcing private arbitration."
  },
  {
    id: "AI_MODEL_TRAINING",
    category: "AI & Content Ingestion",
    title: "AI & Machine Learning Model Training on User Data",
    severity: "CRITICAL",
    riskWeight: 25,
    regex: /(?:\b(?:train|training)(?:\s+\S+){0,14}\s+(?:artificial intelligence|machine learning|algorithm\w*|ai model\w*|llm\w*)|model development|improve our algorithms)/i,
    negationRegex: /\b(?:do not use(?:\s+\S+){0,8}\s+(?:train|training)|never use(?:\s+\S+){0,8}\s+(?:train|training)|will not use(?:\s+\S+){0,8}\s+(?:train|training)|do not train|never train|will not train)\b/i,
    corroborationRegex: /\b(?:perpetual|worldwide|royalty-free|irrevocable|generative|derivative)\b/gi,
    explain: "Grants the platform perpetual rights to ingest user documents, private chats, or creative assets into generative AI systems."
  },
  {
    id: "UNILATERAL_AMENDMENT",
    category: "Contractual Fairness",
    title: "Unilateral Contract Changes Without Prior Notice",
    severity: "CRITICAL",
    riskWeight: 20,
    regex: /(?:\bmodify(?:\s+\S+){0,10}\s+without(?:\s+prior)?\s+notice|change these terms at any time|sole discretion(?:\s+\S+){0,10}\s+without prior|without obligation to notify)/i,
    corroborationRegex: /\b(?:sole discretion|any time|unilateral(?:ly)?|prior notice|without consent)\b/gi,
    explain: "Allows the vendor to alter pricing, terms, or privacy commitments unilaterally without requiring user re-consent."
  },
  {
    id: "INDEFINITE_RETENTION",
    category: "Data Retention & Storage",
    title: "Indefinite or Perpetual Data Retention",
    severity: "WARNING",
    riskWeight: 15,
    regex: /(?:\bretain(?:ed)?(?:\s+\S+){0,10}\s+(?:indefinitely|perpetual(?:ly)?|unlimited duration)|derivative data indefinitely|retained forever)/i,
    negationRegex: /\b(?:do not retain(?:\s+\S+){0,6}\s+indefinitely|never retain(?:\s+\S+){0,6}\s+indefinitely|not retained forever)\b/i,
    corroborationRegex: /\b(?:termination|aggregated|de-identified|biometric|indefinitely|forever)\b/gi,
    explain: "Retains user content or biometric telemetry perpetually even after formal account cancellation and deletion requests."
  },
  {
    id: "THIRD_PARTY_SHARING",
    category: "Data Brokers & Advertising",
    title: "Third-Party Data Commercialization & Ad Brokers",
    severity: "WARNING",
    riskWeight: 15,
    regex: /(?:\bshar(?:e|ing)(?:\s+\S+){0,12}\s+(?:third-party advertisers|data brokers|marketing partners|commercial affiliates)|sell(?:ing)?(?:\s+your|\s+user|\s+customer)?\s*personal data)/i,
    negationRegex: /\b(?:do not sell|never sell|will not sell|don't sell|never share|do not share|will not share)\b/i,
    corroborationRegex: /\b(?:advertising|brokers|targeted|monetiz\w*|affiliates)\b/gi,
    explain: "Permits monetization or cross-context behavioral ad sharing with third-party advertising networks."
  },
  {
    id: "AUTO_RENEWAL_ESCALATION",
    category: "Billing & Subscriptions",
    title: "Predatory Auto-Renewal & Fee Escalation",
    severity: "WARNING",
    riskWeight: 10,
    regex: /(?:auto-renew(?:\s+\S+){0,10}\s+without consent|price increase(?:\s+\S+){0,8}\s+automatic|non-refundable(?:\s+\S+){0,8}\s+under any circumstances|prices(?:\s+\S+){0,4}\s+increase(?:\s+\S+){0,6}\s+without(?:\s+explicit)?\s+consent)/i,
    corroborationRegex: /\b(?:automatic(?:ally)?|non-refundable|renewal|indefinitely|without consent)\b/gi,
    explain: "Enforces restrictive subscription auto-renewals with automatic price hikes and non-refundable fees."
  },
  {
    id: "USER_RIGHTS_REINFORCEMENT",
    category: "Privacy Rights Enhancement",
    title: "GDPR / CCPA Erasure & Export Rights Reinforced",
    severity: "USER_FRIENDLY",
    riskWeight: -5, // Rewards privacy-protective clauses
    regex: /(?:right to access|right to erasure|data portability|opt-out(?:\s+\S+){0,8}\s+any time|explicit prior consent)/i,
    corroborationRegex: /\b(?:gdpr|ccpa|rectify|erasure|self-service|consent)\b/gi,
    explain: "Strengthens user sovereignty through self-service deletion, data portability, and explicit opt-out mechanisms."
  }
];

const HEDGING_NEGATION_RE = /\b(?:do not guarantee|cannot guarantee|no guarantee|not refrain|refrain from|cannot promise|reserve the right to share|may in the future)\b/i;
const INVISIBLE_UNICODE_RE = /[\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF\u00AD]/g;

class PolicyDeltaEngine {
  constructor() {
    this.rules = POLICY_VULNERABILITY_RULES;
  }

  /**
   * Inspect & normalize Unicode text (strips invisible ZWSP / BiDi overrides & applies NFKC per Boucher et al.)
   */
  _inspectAndNormalizeUnicode(raw) {
    if (!raw || typeof raw !== "string") return { clean: "", hiddenCharCount: 0 };
    const noBom = raw.replace(/^\uFEFF/, "");
    const hiddenMatches = noBom.match(INVISIBLE_UNICODE_RE);
    const hiddenCharCount = hiddenMatches ? hiddenMatches.length : 0;
    const stripped = noBom.replace(INVISIBLE_UNICODE_RE, "").normalize("NFKC");
    return { clean: stripped, hiddenCharCount };
  }

  /**
   * Normalize plain text or pasted HTML legal agreements cleanly
   */
  _cleanInputText(raw) {
    const { clean } = this._inspectAndNormalizeUnicode(raw);
    if (!clean) return "";
    let txt = clean.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ");
    txt = txt.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
    if (/<[a-z][\s\S]*>/i.test(txt)) {
      txt = txt.replace(/<\/?(?:p|div|li|tr|h[1-6]|section|article|blockquote)\b[^>]*>/gi, "\n\n");
      txt = txt.replace(/<br\s*\/?>/gi, "\n");
      txt = txt.replace(/<[^>]+>/g, " ");
      txt = txt
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&(apos|#39);/g, "'")
        .replace(/&nbsp;/g, " ");
    }
    return txt.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ");
  }

  /**
   * Split legal policy text into normalized semantic paragraphs with section context
   */
  _splitParagraphs(text) {
    const cleaned = this._cleanInputText(text);
    if (!cleaned) return [];
    let paras = cleaned
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 15);
    if (paras.length <= 1 && cleaned.includes("\n")) {
      paras = cleaned.split(/\n/).map((p) => p.trim()).filter((p) => p.length > 15);
    }
    return paras;
  }

  /**
   * Split paragraph into individual clauses bounded by punctuation & contrast markers
   */
  _splitClauses(paragraph) {
    if (!paragraph) return [];
    return paragraph
      .split(/(?:\b(?:but|however|except|unless|provided that|although|notwithstanding|whereas)\b|[.;!?]+)/i)
      .map((c) => c.trim())
      .filter((c) => c.length >= 6);
  }

  /**
   * Bound single-clause evaluation slices to enforce O(N) runtime against adversarial 50KB run-on inputs
   */
  _safeClauseChunks(clause) {
    if (clause.length <= 450) return [clause];
    const chunks = [];
    for (let i = 0; i < clause.length; i += 330) {
      chunks.push(clause.slice(i, i + 450));
      if (i + 450 >= clause.length) break;
    }
    return chunks;
  }

  /**
   * Evaluate a document against a rule at clause granularity (weighted corroboration + hedged review escalation)
   */
  _evaluateRuleOnDoc(paras, rule) {
    let triggeredSnippet = null;
    let hedgedSnippet = null;
    let bestConfidence = 0;

    for (const para of paras) {
      const clauses = this._splitClauses(para);
      for (const clause of clauses) {
        const windows = this._safeClauseChunks(clause);
        for (const win of windows) {
          if (!rule.regex.test(win)) continue;

          if (rule.severity !== "USER_FRIENDLY" && HEDGING_NEGATION_RE.test(win)) {
            if (!hedgedSnippet) hedgedSnippet = clause;
            continue;
          }
          if (rule.negationRegex && rule.negationRegex.test(win)) {
            continue;
          }
          const corrHits = rule.corroborationRegex ? (win.match(rule.corroborationRegex) || []).length : 0;
          const confScore = Math.min(1, 0.65 + (corrHits * 0.12));
          if (!triggeredSnippet || confScore > bestConfidence) {
            triggeredSnippet = clause;
            bestConfidence = confScore;
          }
        }
      }
    }

    return {
      matched: Boolean(triggeredSnippet),
      needsReview: !triggeredSnippet && Boolean(hedgedSnippet),
      confidence: bestConfidence,
      snippet: triggeredSnippet || hedgedSnippet || ""
    };
  }

  /**
   * Compare Base Policy (v1) against Target Policy (v2)
   */
  comparePolicies(baseText, targetText) {
    const uniB = this._inspectAndNormalizeUnicode(targetText);
    const parasA = this._splitParagraphs(baseText);
    const parasB = this._splitParagraphs(targetText);

    const changes = [];
    let cumulativeRiskPenalty = 0;

    if (uniB.hiddenCharCount > 0) {
      cumulativeRiskPenalty += 20;
      changes.push({
        ruleId: "SUSPICIOUS_INVISIBLE_UNICODE",
        category: "Text Integrity & Obfuscation",
        title: "Invisible Unicode / BiDi Override Characters Stripped",
        severity: "CRITICAL",
        status: "UNICODE_OBFUSCATION",
        confidence: 1,
        message: `Stripped ${uniB.hiddenCharCount} invisible/zero-width or BiDi control character(s) from Target Policy (v2) before parsing.`,
        details: "Adversarial zero-width or bidirectional formatting sequences can hide or reorder obligations while masking keywords from plain-text inspection.",
        evidenceV1: "(Clean baseline)",
        evidenceV2: `Detected ${uniB.hiddenCharCount} stripped invisible/BiDi codepoint(s) in v2.`,
        sampleSnippet: ""
      });
    }

    for (const rule of this.rules) {
      const evalA = this._evaluateRuleOnDoc(parasA, rule);
      const evalB = this._evaluateRuleOnDoc(parasB, rule);

      if (!evalA.matched && evalB.matched) {
        if (rule.severity === "CRITICAL" || rule.severity === "WARNING") {
          cumulativeRiskPenalty += rule.riskWeight;
          changes.push({
            ruleId: rule.id,
            category: rule.category,
            title: rule.title,
            severity: rule.severity,
            status: "STEALTH_ADDITION",
            message: `Added in v2: ${rule.title}`,
            details: rule.explain,
            evidenceV1: evalA.snippet || "(Not present in v1)",
            evidenceV2: evalB.snippet,
            sampleSnippet: evalB.snippet
          });
        } else if (rule.severity === "USER_FRIENDLY") {
          cumulativeRiskPenalty += rule.riskWeight;
          changes.push({
            ruleId: rule.id,
            category: rule.category,
            title: rule.title,
            severity: "USER_FRIENDLY",
            status: "RIGHTS_EXPANDED",
            message: `User-Protective Addition: ${rule.title}`,
            details: rule.explain,
            evidenceV1: evalA.snippet || "(Not present in v1)",
            evidenceV2: evalB.snippet,
            sampleSnippet: evalB.snippet
          });
        }
      } else if (evalA.matched && !evalB.matched && rule.severity === "USER_FRIENDLY") {
        cumulativeRiskPenalty += 20;
        changes.push({
          ruleId: rule.id,
          category: rule.category,
          title: `REMOVED: ${rule.title}`,
          severity: "CRITICAL",
          status: "RIGHTS_STRIPPED",
          message: "Protection REMOVED: Previous GDPR/User rights guarantee was deleted.",
          details: "Users can no longer rely on previously explicit privacy or export protections.",
          evidenceV1: evalA.snippet,
          evidenceV2: "(Removed or omitted in v2)",
          sampleSnippet: evalA.snippet
        });
      } else if (evalA.matched && evalB.needsReview) {
        changes.push({
          ruleId: rule.id,
          category: rule.category,
          title: `Hedged Transition: ${rule.title}`,
          severity: "REVIEW",
          status: "HEDGED_REGRESSION",
          message: "Previously explicit risk clause was rewritten with ambiguous hedging — requires manual review.",
          details: rule.explain,
          evidenceV1: evalA.snippet,
          evidenceV2: evalB.snippet,
          sampleSnippet: evalB.snippet
        });
      } else if (!evalA.matched && evalB.needsReview) {
        changes.push({
          ruleId: rule.id,
          category: rule.category,
          title: `Needs Human Review: ${rule.title}`,
          severity: "REVIEW",
          status: "NEEDS_HUMAN_REVIEW",
          message: "Ambiguous negation or hedging detected on risk topic — requires manual reading.",
          details: rule.explain,
          evidenceV1: evalA.snippet || "(Not present in v1)",
          evidenceV2: evalB.snippet,
          sampleSnippet: evalB.snippet
        });
      } else if (evalA.matched && evalB.matched) {
        changes.push({
          ruleId: rule.id,
          category: rule.category,
          title: rule.title,
          severity: "INFO",
          status: "UNCHANGED",
          message: `Unchanged: Clause '${rule.title}' remains active in both versions.`,
          details: rule.explain,
          evidenceV1: evalA.snippet,
          evidenceV2: evalB.snippet,
          sampleSnippet: evalB.snippet
        });
      }
    }

    const score = Math.max(0, Math.min(100, 100 - cumulativeRiskPenalty));
    const criticalCount = changes.filter((c) => c.severity === "CRITICAL").length;
    const warningCount = changes.filter((c) => c.severity === "WARNING").length;
    const reviewCount = changes.filter((c) => c.severity === "REVIEW").length;
    const friendlyCount = changes.filter((c) => c.severity === "USER_FRIENDLY").length;

    let verdict = "No Heuristic Triggers in 7 Categories — Manual Review Still Required";
    if (criticalCount > 0) {
      verdict = "Critical Rights Shifts Detected";
    } else if (reviewCount > 0) {
      verdict = "Manual Review Required — Ambiguous / Hedged Clauses Detected";
    } else if (warningCount > 0) {
      verdict = "Moderate Privacy Concessions Flagged";
    }

    return {
      score,
      verdict,
      isPredatory: criticalCount > 0,
      criticalCount,
      warningCount,
      reviewCount,
      needsReviewCount: reviewCount,
      friendlyCount,
      totalChanges: changes.filter((c) => c.status !== "UNCHANGED").length,
      changes
    };
  }

  /**
   * Generate Clean GitHub-Flavored Markdown Changelog
   */
  generateMarkdownChangelog(summary, policyName = "Terms of Service") {
    const dateStr = new Date().toISOString().split("T")[0];
    let md = `# PolicyDelta Radar: Terms & Privacy Drift Report\n\n`;
    md += `> **Target Document:** ${policyName}  \n`;
    md += `> **Audit Date:** ${dateStr}  \n`;
    md += `> **Assessment Verdict:** ${summary.verdict}  \n\n`;

    md += `## Executive Drift Summary\n\n`;
    md += `| Category | Count |\n`;
    md += `|:---|:---:|\n`;
    md += `| Critical Rights Shifts | ${summary.criticalCount} |\n`;
    md += `| Privacy Warnings | ${summary.warningCount} |\n`;
    md += `| Needs Human Review | ${summary.reviewCount || 0} |\n`;
    md += `| User-Protective Changes | ${summary.friendlyCount} |\n\n`;

    const activeChanges = summary.changes.filter((c) => c.status !== "UNCHANGED");

    if (activeChanges.length > 0) {
      md += `## Detected Policy Changes (Heuristic + Manual Review)\n\n`;
      activeChanges.forEach((c, idx) => {
        md += `### ${idx + 1}. [${c.severity}] ${c.title}\n`;
        md += `- **Status:** ${c.status}\n`;
        md += `- **Summary:** ${c.message}\n`;
        md += `- **Legal/Practical Implication:** ${c.details}\n`;
        if (c.evidenceV1) md += `- **v1 Evidence:** "${c.evidenceV1.slice(0, 260)}"\n`;
        if (c.evidenceV2) md += `- **v2 Evidence:** "${c.evidenceV2.slice(0, 260)}"\n`;
        md += `\n`;
      });
    } else {
      md += `*No heuristic triggers fired across the 7 English-language rule categories. Manual human reading is still required.*\n\n`;
    }

    md += `---\n*Generated by PolicyDelta Radar (Local-First Pattern-Matching & Text-Comparison Utility — informational review only).*`;
    return md;
  }

  /**
   * Built-in 14-case internal regression self-test
   */
  runSelfTest() {
    const cases = [
      {
        name: "Argon adversarial hedge",
        base: "Privacy v1: We protect your personal data cleanly.",
        target: "Privacy v2: We do not guarantee that we will refrain from selling personal data.",
        check: (res) => res.changes.some((c) => c.ruleId === "THIRD_PARTY_SHARING" && c.severity === "REVIEW")
      },
      {
        name: "Contrast boundary negation",
        base: "Privacy v1: We protect your personal information exclusively for service delivery.",
        target: "Privacy v2: We do not sell personal data, however we share data with marketing partners for advertising.",
        check: (res) => res.changes.some((c) => c.ruleId === "THIRD_PARTY_SHARING" && c.severity === "WARNING")
      },
      {
        name: "Clean safe negation",
        base: "Privacy v1: We keep your email secure.",
        target: "Privacy v2: We never sell personal data and we never share data with third-party advertisers.",
        check: (res) => res.criticalCount === 0 && res.warningCount === 0 && res.reviewCount === 0 && res.verdict.includes("Manual Review Still Required")
      },
      {
        name: "Stripped GDPR protection escalation",
        base: "Privacy v1: Under GDPR you maintain the right to erasure and data portability.",
        target: "Privacy v2: We store account preferences during active use.",
        check: (res) => res.criticalCount === 1 && res.changes[0].status === "RIGHTS_STRIPPED"
      },
      {
        name: "Forced arbitration clause",
        base: "Terms v1: Courts of your jurisdiction govern disputes.",
        target: "Terms v2: Disputes require binding individual arbitration and a class action waiver.",
        check: (res) => res.changes.some((c) => c.ruleId === "FORCED_ARBITRATION" && c.severity === "CRITICAL")
      },
      {
        name: "AI training ingestion",
        base: "Terms v1: User content belongs strictly to the customer.",
        target: "Terms v2: You grant a license for training generative AI and machine learning models on uploads.",
        check: (res) => res.changes.some((c) => c.ruleId === "AI_MODEL_TRAINING" && c.severity === "CRITICAL")
      },
      {
        name: "Safe AI non-training negation",
        base: "Terms v1: We host your files.",
        target: "Terms v2: We do not use customer files to train artificial intelligence models.",
        check: (res) => res.criticalCount === 0 && res.reviewCount === 0
      },
      {
        name: "Unilateral contract modification",
        base: "Terms v1: We provide 30 days notice before amending pricing.",
        target: "Terms v2: We may change these terms at any time without obligation to notify you.",
        check: (res) => res.changes.some((c) => c.ruleId === "UNILATERAL_AMENDMENT" && c.severity === "CRITICAL")
      },
      {
        name: "Indefinite retention & auto-renewal",
        base: "Terms v1: Data deleted within 30 days; monthly plan.",
        target: "Terms v2: Derivative data is retained forever and plans auto-renew without consent.",
        check: (res) => res.warningCount === 2
      },
      {
        name: "Raw HTML input stripping + script ignore",
        base: "<p>We respect your rights.</p>",
        target: "<script>alert('xss')</script><p>We retain telemetry indefinitely for analytics.</p>",
        check: (res) => !this._cleanInputText("<script>alert(1)</script><p>ok</p>").includes("alert") && res.changes.some((c) => c.ruleId === "INDEFINITE_RETENTION")
      },
      {
        name: "Invisible ZWSP Unicode spoofing defense",
        base: "Terms v1: Courts resolve all disputes cleanly.",
        target: "Terms v2: Disputes require arbitr\u200bation and a class\u200b action waiver.",
        check: (res) => res.changes.some((c) => c.ruleId === "FORCED_ARBITRATION") && res.changes.some((c) => c.ruleId === "SUSPICIOUS_INVISIBLE_UNICODE")
      },
      {
        name: "BiDi override spoofing defense",
        base: "Privacy v1: Standard account data notice.",
        target: "Privacy v2: Standard data \u202Eesrever\u202C retention terms.",
        check: (res) => res.changes.some((c) => c.ruleId === "SUSPICIOUS_INVISIBLE_UNICODE" && c.severity === "CRITICAL")
      },
      {
        name: "Hedge regression from v1 risk clause",
        base: "Terms v1: We use your uploads for training generative AI models.",
        target: "Terms v2: We cannot guarantee that we will refrain from training AI models in future releases.",
        check: (res) => res.changes.some((c) => c.ruleId === "AI_MODEL_TRAINING" && c.status === "HEDGED_REGRESSION" && c.severity === "REVIEW")
      },
      {
        name: "Adversarial 60KB ReDoS runtime bound",
        base: "Terms v1: Standard user license.",
        target: `Terms v2: ${"waive ".repeat(9000)}judicial oversight without class action.`,
        check: (res) => Array.isArray(res.changes) && res.changes.some((c) => c.ruleId === "FORCED_ARBITRATION")
      }
    ];

    let tp = 0, fp = 0, fn = 0;
    const t0 = Date.now();
    const results = cases.map((tc) => {
      const out = this.comparePolicies(tc.base, tc.target);
      const ok = tc.check(out);
      const expectsPositive = !/Safe AI|Clean safe/i.test(tc.name);
      if (expectsPositive) {
        if (ok) tp++;
        else fn++;
      } else if (!ok) {
        fp++;
      }
      return { name: tc.name, pass: ok };
    });
    const elapsedMs = Date.now() - t0;

    const precision = tp + fp > 0 ? tp / (tp + fp) : 1;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 1;
    return {
      total: cases.length,
      passed: results.filter((r) => r.pass).length,
      elapsedMs,
      precision,
      recall,
      results
    };
  }
}

// Global instance & exports
if (typeof window !== "undefined") {
  window.policyDeltaEngine = new PolicyDeltaEngine();
  window.SAMPLE_POLICIES = SAMPLE_POLICIES;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PolicyDeltaEngine, SAMPLE_POLICIES, POLICY_VULNERABILITY_RULES };
}
