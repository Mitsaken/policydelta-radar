/**
 * PolicyDelta Radar UI Controller
 * Opens cleanly at top (zero auto-scroll), Externalized CSP-Safe JS, 0-EUR Validation Mode
 */

const CHECKOUT_ENABLED = false;
const WAITLIST_ENDPOINT = "https://conversionlogic-waitlist.conversionlogic.workers.dev";

let lastSummary = null;
let isSampleMode = false;

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
});

function setupEventListeners() {
  const baseEl = document.getElementById("basePolicyInput");
  const targetEl = document.getElementById("targetPolicyInput");

  baseEl?.addEventListener("input", () => { isSampleMode = false; });
  targetEl?.addEventListener("input", () => { isSampleMode = false; });

  document.getElementById("fileBasePolicy")?.addEventListener("change", (e) => loadFile(e, baseEl));
  document.getElementById("fileTargetPolicy")?.addEventListener("change", (e) => loadFile(e, targetEl));

  document.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => loadPreset(btn.dataset.preset));
  });

  document.getElementById("runCompareBtn")?.addEventListener("click", compareCurrentPolicies);
  document.getElementById("clearPoliciesBtn")?.addEventListener("click", clearPolicies);
  document.getElementById("btn-copy-md")?.addEventListener("click", copyMarkdownChangelog);
  document.getElementById("btn-dl-json")?.addEventListener("click", downloadJsonReport);
  document.getElementById("btn-print-memo")?.addEventListener("click", () => window.print());

  setupWaitlistForm();
}

function loadFile(event, textarea) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    alert("File exceeds 5MB limit.");
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    textarea.value = String(ev.target.result || "");
    isSampleMode = false;
  };
  reader.readAsText(file);
}

function loadPreset(key) {
  const preset = window.SAMPLE_POLICIES && window.SAMPLE_POLICIES[key];
  if (!preset) return;
  document.getElementById("basePolicyInput").value = preset.basePolicy;
  document.getElementById("targetPolicyInput").value = preset.targetPolicy;
  isSampleMode = true;
}

function clearPolicies() {
  document.getElementById("basePolicyInput").value = "";
  document.getElementById("targetPolicyInput").value = "";
  isSampleMode = false;
  lastSummary = null;
  document.getElementById("resultsSection").hidden = true;
  document.getElementById("emptyStateBanner").hidden = false;
}

function compareCurrentPolicies() {
  const baseText = document.getElementById("basePolicyInput").value;
  const targetText = document.getElementById("targetPolicyInput").value;

  if (!baseText.trim() || !targetText.trim()) {
    alert("Please paste both Base Policy (v1) and Target Policy (v2) before generating a redline memo.");
    return;
  }

  lastSummary = window.policyDeltaEngine.comparePolicies(baseText, targetText);

  document.getElementById("emptyStateBanner").hidden = true;
  document.getElementById("resultsSection").hidden = false;
  document.getElementById("sampleDemoBanner").hidden = !isSampleMode;

  document.getElementById("memoDateValue").textContent = new Date().toISOString().split("T")[0];
  document.getElementById("statCriticalCount").textContent = lastSummary.criticalCount;
  document.getElementById("statWarningCount").textContent = lastSummary.warningCount;
  document.getElementById("statReviewCount").textContent = lastSummary.reviewCount || 0;
  document.getElementById("statFriendlyCount").textContent = lastSummary.friendlyCount;

  const heading = document.getElementById("memoVerdictHeading");
  heading.textContent = lastSummary.verdict;

  renderFindings(lastSummary.changes);
  renderRedlineExcerpts(baseText, targetText);
}

function renderFindings(changes) {
  const tbody = document.getElementById("findingsTableBody");
  tbody.innerHTML = "";

  const active = changes.filter((c) => c.status !== "UNCHANGED");
  document.getElementById("findingsCountBadge").textContent = `${active.length} substantive ${active.length === 1 ? "change" : "changes"}`;

  if (!active.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-table-cell">No heuristic rule triggers across 7 English categories. Manual legal reading is still required.</td></tr>`;
    return;
  }

  const labelMap = {
    CRITICAL: "HIGH RISK",
    WARNING: "MODERATE",
    REVIEW: "HUMAN REVIEW",
    USER_FRIENDLY: "PROTECTIVE"
  };

  active.forEach((c, idx) => {
    const tr = document.createElement("tr");
    const ev1 = c.evidenceV1 ? `<div class="evidence-quote"><strong>v1:</strong> ${escapeHtml(c.evidenceV1.slice(0, 180))}</div>` : "";
    const ev2 = c.evidenceV2 ? `<div class="evidence-quote"><strong>v2:</strong> ${escapeHtml(c.evidenceV2.slice(0, 180))}</div>` : "";
    const evidenceBlock = (ev1 || ev2) ? `<div class="evidence-pair">${ev1}${ev2}</div>` : "";

    tr.innerHTML = `
      <td class="tnum" data-label="Item">#${idx + 1}</td>
      <td data-label="Severity"><span class="sev-badge ${escapeHtml(c.severity)}">${labelMap[c.severity] || escapeHtml(c.severity)}</span></td>
      <td data-label="Category">${escapeHtml(c.category)}</td>
      <td data-label="Clause Finding"><strong>${escapeHtml(c.title)}</strong>${evidenceBlock}</td>
      <td data-label="Practical Implication">${escapeHtml(c.details)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderRedlineExcerpts(baseText, targetText) {
  const container = document.getElementById("redlineContainer");
  container.innerHTML = "";

  const engine = window.policyDeltaEngine;
  const norm = (t) => (engine?._cleanInputText ? engine._cleanInputText(t) : t)
    .split(/\n+/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 0 && !/^(?:\d+\.|#+)\s*$/.test(s));

  const baseLines = norm(baseText);
  const targetLines = norm(targetText);
  const baseSet = new Set(baseLines);
  const targetSet = new Set(targetLines);

  const removed = baseLines.filter((l) => !targetSet.has(l));
  const added = targetLines.filter((l) => !baseSet.has(l));

  if (!removed.length && !added.length) {
    container.innerHTML = `<div class="redline-excerpt">No line-level textual differences detected.</div>`;
    return;
  }

  const box = document.createElement("div");
  box.className = "redline-excerpt";

  removed.forEach((line) => {
    const row = document.createElement("div");
    const prefix = document.createElement("strong");
    prefix.textContent = "− Removed / Replaced (v1): ";
    const span = document.createElement("span");
    span.className = "redline-del";
    span.textContent = line;
    row.append(prefix, span);
    box.appendChild(row);
  });

  added.forEach((line) => {
    const row = document.createElement("div");
    const prefix = document.createElement("strong");
    prefix.textContent = "+ Added / Updated (v2): ";
    const span = document.createElement("span");
    span.className = "redline-add";
    span.textContent = line;
    row.append(prefix, span);
    box.appendChild(row);
  });

  container.appendChild(box);
}

function copyMarkdownChangelog() {
  if (!lastSummary) return;
  const md = window.policyDeltaEngine.generateMarkdownChangelog(lastSummary);
  const triggerDownload = () => {
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `policydelta-changelog-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    navigator.clipboard.writeText(md)
      .then(() => {
        const btn = document.getElementById("btn-copy-md");
        if (!btn) return;
        btn.textContent = "Copied";
        setTimeout(() => { btn.textContent = "Copy Changelog"; }, 1800);
      })
      .catch(triggerDownload);
  } else {
    triggerDownload();
  }
}

function downloadJsonReport() {
  if (!lastSummary) return;
  const blob = new Blob([JSON.stringify(lastSummary, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `policydelta-report-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

function setupWaitlistForm() {
  const form = document.getElementById("proWaitlistForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (CHECKOUT_ENABLED) return;

    const emailEl = document.getElementById("proWaitlistEmail");
    const consentEl = document.getElementById("proWaitlistConsent");
    const adviceEl = document.getElementById("proWaitlistAdvice");
    const msgEl = document.getElementById("proWaitlistMsg");
    const btn = document.getElementById("proWaitlistSubmit");

    const email = (emailEl.value || "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      msgEl.className = "waitlist-msg is-err";
      msgEl.textContent = "Please enter a valid email address.";
      emailEl.focus();
      return;
    }
    if (!consentEl.checked) {
      msgEl.className = "waitlist-msg is-err";
      msgEl.textContent = "Explicit GDPR consent is required before submitting.";
      consentEl.focus();
      return;
    }

    const adviceFocus = (adviceEl && adviceEl.value ? adviceEl.value : "").trim();
    const consentText = (consentEl.closest("label")?.textContent || "Explicit GDPR consent for one-time launch notification.").replace(/\s+/g, " ").trim().slice(0, 500);
    const consentTs = new Date().toISOString();

    btn.disabled = true;
    msgEl.className = "waitlist-msg";
    msgEl.textContent = "Registering...";

    try {
      const resp = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          email,
          project: form.dataset.project || "policydelta-radar",
          advice_focus: adviceFocus,
          consent: true,
          consent_text: consentText,
          consent_ts: consentTs
        })
      });
      const data = await resp.json();
      if (resp.ok && data.ok) {
        msgEl.className = "waitlist-msg is-ok";
        msgEl.textContent = "Registered on the Priority Waitlist (0 EUR today).";
        form.reset();
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (err) {
      msgEl.className = "waitlist-msg is-err";
      msgEl.textContent = `Connection error: ${err.message}. Please retry.`;
    } finally {
      btn.disabled = false;
    }
  });
}
