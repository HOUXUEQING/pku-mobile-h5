/* 基础资金台账：活动公共预算、员工活动权益、统一流水、支付分摊 */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const tag = (s, t) => `<span class="tag ${t || ""}">${esc(s)}</span>`;
  const money = n => "¥" + Number(n || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const moneyInt = n => "¥" + Number(n || 0).toLocaleString("zh-CN");
  let tab = "企业活动预算";
  let ledgerFilter = "全部动作";
  let query = "";

  const budgets = [
    { id: "预算-中石油-2026", enterprise: "中石油华北分公司", contract: "企康合约-2026-0001", total: 50000, reserved: 600, verified: 600, settled: 300, valid: "2026-12-31", status: "生效", activities: 3 },
    { id: "预算-金融街-2026", enterprise: "金融街控股", contract: "企康合约-2026-0002", total: 30000, reserved: 0, verified: 0, settled: 0, valid: "2026-12-31", status: "生效", activities: 1 },
    { id: "预算-望京-2026", enterprise: "望京科技园", contract: "企康合约-2026-0003", total: 20000, reserved: 0, verified: 200, settled: 200, valid: "2026-12-31", status: "生效", activities: 1 }
  ];
  const equities = [
    { id: "权益-活动通用", name: "活动通用权益", enterprise: "中石油华北分公司", total: 500, issued: 300, claimed: 260, frozen: 0, consumed: 120, expired: 0, valid: "2026-12-31", scope: "五好生活训练营", status: "生效" },
    { id: "权益-营养讲座", name: "营养讲座权益", enterprise: "金融街控股", total: 100, issued: 80, claimed: 68, frozen: 0, consumed: 12, expired: 0, valid: "2026-12-31", scope: "营养早餐课", status: "生效" },
    { id: "权益-公开课", name: "公开课权益", enterprise: "方园中心", total: 80, issued: 40, claimed: 32, frozen: 0, consumed: 20, expired: 0, valid: "2026-11-30", scope: "体重管理公开课", status: "即将过期" }
  ];
  const ledger = [
    { id: "FL-2026-0001", time: "2026-11-10 09:12", account: "企业公共资金", enterprise: "中石油华北分公司", biz: "活动报名", bizNo: "AO-2026-00101", target: "五好生活 · 控糖训练营", action: "预占", amount: 300, before: 50000, after: 49700, operator: "系统" },
    { id: "FL-2026-0002", time: "2026-11-10 09:45", account: "企业公共资金", enterprise: "中石油华北分公司", biz: "活动核销", bizNo: "AO-2026-00101", target: "五好生活 · 控糖训练营", action: "核销", amount: 300, before: 49700, after: 49700, operator: "王琳" },
    { id: "FL-2026-0003", time: "2026-11-11 09:20", account: "员工活动权益", enterprise: "金融街控股", biz: "权益冻结", bizNo: "AO-2026-00301", target: "金融街 · 营养早餐课", action: "冻结", amount: 1, before: 80, after: 79, operator: "系统" },
    { id: "FL-2026-0004", time: "2026-11-11 10:10", account: "员工活动权益", enterprise: "金融街控股", biz: "权益核销", bizNo: "AO-2026-00301", target: "金融街 · 营养早餐课", action: "核销", amount: 1, before: 79, after: 79, operator: "张敏" },
    { id: "FL-2026-0005", time: "2026-11-09 15:30", account: "个人企康额度", enterprise: "中石油华北分公司", biz: "商城订单", bizNo: "MALL-2026-0082", target: "乳清蛋白粉 750g", action: "冻结", amount: 200, before: 820, after: 620, operator: "系统" },
    { id: "FL-2026-0006", time: "2026-11-10 11:20", account: "个人企康额度", enterprise: "中石油华北分公司", biz: "商城订单", bizNo: "MALL-2026-0082", target: "乳清蛋白粉 750g", action: "扣减", amount: 200, before: 620, after: 420, operator: "系统" },
    { id: "FL-2026-0007", time: "2026-11-11 14:05", account: "个人企康额度", enterprise: "中石油华北分公司", biz: "商城退款", bizNo: "REF-2026-0012", target: "乳清蛋白粉 750g", action: "退回", amount: 200, before: 420, after: 620, operator: "财务-赵敏" },
    { id: "FL-2026-0008", time: "2026-11-09 18:20", account: "机构结算", enterprise: "北大医疗健康管理中心", biz: "机构结算", bizNo: "JS-2026-1109-001", target: "10 月机构结算", action: "实扣", amount: 300720, before: 300720, after: 0, operator: "财务-李明" },
    { id: "FL-2026-0009", time: "2026-11-10 16:10", account: "企业公共资金", enterprise: "望京科技园", biz: "活动核销", bizNo: "AO-2026-00401", target: "望京园区 · 午间拉伸", action: "实扣", amount: 200, before: 20000, after: 19800, operator: "系统" }
  ];
  const splits = [
    { id: "AO-2026-00101", biz: "活动报名", title: "五好生活 · 控糖训练营", payee: "北大医疗健康管理中心", publicFund: 300, equity: 0, selfPay: 0, status: "已核销", settle: "待结算" },
    { id: "AO-2026-00301", biz: "活动报名", title: "金融街 · 营养早餐课", payee: "金融街健康中心", publicFund: 0, equity: 1, selfPay: 0, status: "已核销", settle: "待结算" },
    { id: "AO-2026-00701", biz: "活动报名", title: "城市健康公开课 · 科学减脂", payee: "城市健康学院", publicFund: 0, equity: 0, selfPay: 99, status: "已核销", settle: "待结算" },
    { id: "MALL-2026-0082", biz: "商城订单", title: "乳清蛋白粉 750g", payee: "健康商城供应链", publicFund: 0, equity: 0, selfPay: 128, status: "已扣减", settle: "已退款" }
  ];

  function head() {
    const action = tab === "企业活动预算" ? `<button class="btn primary" data-fund-add-budget>${icon("plus")}新增预算</button>` : tab === "员工活动权益" ? `<button class="btn primary" data-fund-issue>${icon("plus")}发放权益</button>` : `<button class="btn" data-fund-export>${icon("download")}导出</button>`;
    return `<div class="page-head"><div><p class="page-eyebrow">FUND LEDGER</p><h2>资金台账</h2><p class="checkin-sub">活动公共预算、员工活动权益、统一资金流水与支付分摊；所有资金动作可追溯</p></div><div class="page-actions">${action}</div></div>`;
  }
  function setTop() {
    $("#topTitle").textContent = "资金台账";
    $("#breadcrumb").textContent = "财务结算 / 资金台账";
    $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.settlement === "资金台账"));
  }
  function open(html) {
    $("#drawerBody").innerHTML = html; $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden", "false"); $("#drawerBackdrop").classList.add("open");
  }
  function toast(text) {
    const t = $("#toast"); t.textContent = text; t.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2200);
  }
  function tabs() {
    return `<div class="activity-section-tabs">${["企业活动预算", "员工活动权益", "资金流水", "支付分摊"].map(t => `<button class="${tab === t ? "active" : ""}" data-fund-tab="${t}">${t}</button>`).join("")}</div>`;
  }
  function render() {
    $("#viewRoot").innerHTML = `<div class="page">${head()}${tabs()}<div class="kpi-grid four">${kpi("chart", "预算可用余额", moneyInt(budgets.reduce((n, b) => n + b.total - b.reserved - b.verified - b.settled, 0)), "元", "企业活动公共预算", "#2f6bff")}${kpi("users", "权益可用", equities.reduce((n, e) => n + e.total - e.issued, 0), "次", "员工活动权益", "#16a394")}${kpi("check", "待结算/已结算", ledger.filter(l => ["核销", "实扣"].includes(l.action)).length, "笔", "资金动作", "#8b5cf6")}${kpi("heart", "流水记录", ledger.length, "条", "全量可追溯", "#e8a13c")}</div>${tab === "企业活动预算" ? renderBudgets() : tab === "员工活动权益" ? renderEquities() : tab === "资金流水" ? renderLedger() : renderSplits()}</div>`;
    setTop();
    $$("[data-fund-tab]").forEach(b => b.addEventListener("click", () => { tab = b.dataset.fundTab; query = ""; render(); }));
    $("[data-fund-add-budget]")?.addEventListener("click", addBudget);
    $("[data-fund-issue]")?.addEventListener("click", issueEquity);
    $("[data-fund-export]")?.addEventListener("click", () => toast("台账导出任务已创建"));
    $$("[data-fund-budget]").forEach(b => b.addEventListener("click", () => viewBudget(budgets.find(x => x.id === b.dataset.fundBudget))));
    $$("[data-fund-equity]").forEach(b => b.addEventListener("click", () => viewEquity(equities.find(x => x.id === b.dataset.fundEquity))));
    $("#ledgerAction")?.addEventListener("change", e => { ledgerFilter = e.target.value; render(); });
    $("#fundSearch")?.addEventListener("input", e => { query = e.target.value.trim(); render(); });
  }
  function kpi(iconName, label, value, unit, sub, color) {
    return `<article class="kpi-card" style="--kpi:${color};--kpi-soft:${color}18"><span class="kpi-icon">${icon(iconName)}</span><div class="kpi-label">${label}</div><div class="kpi-num">${value}<small>${unit}</small></div><div class="kpi-sub">${sub}</div></article>`;
  }
  function renderBudgets() {
    return `<div class="filter-bar"><label class="filter-search"><svg class="ic"><use href="#i-search"/></svg><input placeholder="搜索预算编号、企业" /></label><span class="tag blue">预算只能用于活动，不能用于普通商品</span></div><section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>预算子池</th><th>企业 / 合约</th><th>预算总额</th><th>已预占</th><th>已核销</th><th>已实扣</th><th>可用余额</th><th>有效期</th><th></th></tr></thead><tbody>${budgets.map(b => `<tr><td><b class="cell-main">${esc(b.id)}</b><span class="cell-sub">${b.activities} 个关联活动</span></td><td>${esc(b.enterprise)}<span class="cell-sub">${esc(b.contract)}</span></td><td>${moneyInt(b.total)}</td><td>${moneyInt(b.reserved)}</td><td>${moneyInt(b.verified)}</td><td>${moneyInt(b.settled)}</td><td><b class="money">${moneyInt(b.total - b.reserved - b.verified - b.settled)}</b></td><td>${esc(b.valid)}</td><td><button class="panel-link" data-fund-budget="${b.id}">查看 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
  }
  function renderEquities() {
    return `<div class="filter-bar"><span class="tag blue">活动权益不可提现、不可转账，仅用于活动报名和核销</span></div><section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>权益类型</th><th>企业</th><th>发放 / 领取</th><th>冻结</th><th>已核销</th><th>可用</th><th>有效期</th><th>状态</th><th></th></tr></thead><tbody>${equities.map(e => `<tr><td><b class="cell-main">${esc(e.name)}</b><span class="cell-sub">${esc(e.id)} · ${esc(e.scope)}</span></td><td>${esc(e.enterprise)}</td><td>${e.issued} / ${e.claimed}</td><td>${e.frozen}</td><td>${e.consumed}</td><td><b class="money">${e.total - e.issued + (e.claimed - e.consumed - e.frozen)}</b></td><td>${esc(e.valid)}</td><td>${tag(e.status, e.status === "即将过期" ? "gold" : "green")}</td><td><button class="panel-link" data-fund-equity="${e.id}">查看 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
  }
  function renderLedger() {
    const rows = ledger.filter(l => (ledgerFilter === "全部动作" || l.action === ledgerFilter) && (!query || (l.id + l.enterprise + l.bizNo + l.target).includes(query)));
    return `<div class="filter-bar"><label class="filter-search"><svg class="ic"><use href="#i-search"/></svg><input id="fundSearch" value="${esc(query)}" placeholder="搜索流水、业务单号、企业" /></label><select class="filter-select" id="ledgerAction"><option>全部动作</option>${[...new Set(ledger.map(l => l.action))].map(a => `<option${ledgerFilter === a ? " selected" : ""}>${a}</option>`).join("")}</select><span class="tag blue">流水只追加，不允许修改</span></div><section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>流水号</th><th>时间</th><th>资金类型</th><th>业务</th><th>业务单号</th><th>动作</th><th>金额</th><th>变动后余额</th><th>操作人</th></tr></thead><tbody>${rows.map(l => `<tr><td><b class="cell-main">${esc(l.id)}</b></td><td>${esc(l.time)}</td><td>${esc(l.account)}</td><td>${esc(l.biz)}<span class="cell-sub">${esc(l.target)}</span></td><td>${esc(l.bizNo)}</td><td>${tag(l.action, ["冻结", "预占"].includes(l.action) ? "gold" : ["退回", "释放"].includes(l.action) ? "blue" : "green")}</td><td>${l.account === "员工活动权益" ? l.amount + " 次" : money(l.amount)}</td><td>${l.account === "员工活动权益" ? l.after + " 次" : money(l.after)}</td><td>${esc(l.operator)}</td></tr>`).join("")}</tbody></table></div></section>`;
  }
  function renderSplits() {
    return `<div class="filter-bar"><span class="tag blue">支付分摊是订单/核销与资金流水之间的依据</span></div><section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>业务单号</th><th>业务类型</th><th>业务内容</th><th>收款方</th><th>企业公共资金</th><th>员工权益</th><th>个人自费</th><th>业务状态</th><th>结算状态</th></tr></thead><tbody>${splits.map(s => `<tr><td><b class="cell-main">${esc(s.id)}</b></td><td>${esc(s.biz)}</td><td>${esc(s.title)}</td><td>${esc(s.payee)}</td><td>${s.publicFund ? money(s.publicFund) : "—"}</td><td>${s.equity ? s.equity + " 次" : "—"}</td><td>${s.selfPay ? money(s.selfPay) : "—"}</td><td>${tag(s.status, "green")}</td><td>${tag(s.settle, s.settle === "已退款" ? "slate" : "gold")}</td></tr>`).join("")}</tbody></table></div></section>`;
  }
  function viewBudget(b) {
    if (!b) return;
    open(`<p class="page-eyebrow">ACTIVITY BUDGET</p><h2>${esc(b.id)}</h2><p class="drawer-sub">${esc(b.enterprise)} · ${esc(b.contract)}</p>
      <div class="drawer-section"><div class="info-list"><div class="info-item"><small>预算总额</small><b>${moneyInt(b.total)}</b></div><div class="info-item"><small>可用余额</small><b class="money">${moneyInt(b.total - b.reserved - b.verified - b.settled)}</b></div><div class="info-item"><small>已预占</small><b>${moneyInt(b.reserved)}</b></div><div class="info-item"><small>已核销</small><b>${moneyInt(b.verified)}</b></div><div class="info-item"><small>已实扣</small><b>${moneyInt(b.settled)}</b></div><div class="info-item"><small>有效期</small><b>${esc(b.valid)}</b></div></div></div>
      <div class="drawer-section"><h3>资金动作</h3><div class="row-actions"><button class="btn small" data-budget-action="预占">预占 300</button><button class="btn small" data-budget-action="核销">核销 300</button><button class="btn small" data-budget-action="实扣">实扣 300</button></div><p class="drawer-sub" style="margin-top:6px">演示用：预占→核销→实扣，每步都会写入资金流水。</p></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>关闭</button><button class="btn primary" data-budget-add>追加预算</button></div>`);
    $$("[data-budget-action]").forEach(btn => btn.addEventListener("click", () => budgetAction(b, btn.dataset.budgetAction)));
    $("[data-budget-add]")?.addEventListener("click", addBudget);
  }
  function budgetAction(b, action) {
    const amount = 300;
    if (action === "预占") { b.reserved += amount; addLedger("企业公共资金", b.enterprise, "活动报名", "BUDGET-" + Date.now(), "活动预算演示", "预占", amount, b.total - b.reserved + amount, b.total - b.reserved); }
    if (action === "核销") { if (!b.reserved) { toast("没有可核销的预占"); return; } b.reserved -= amount; b.verified += amount; addLedger("企业公共资金", b.enterprise, "活动核销", "VERIFY-" + Date.now(), "活动预算演示", "核销", amount, b.total - b.reserved - b.verified + amount, b.total - b.reserved - b.verified); }
    if (action === "实扣") { if (!b.verified) { toast("没有已核销金额"); return; } b.verified -= amount; b.settled += amount; addLedger("企业公共资金", b.enterprise, "活动结算", "SETTLE-" + Date.now(), "活动预算演示", "实扣", amount, b.total - b.reserved - b.verified - b.settled + amount, b.total - b.reserved - b.verified - b.settled); }
    toast("资金动作已记录"); render(); viewBudget(b);
  }
  function viewEquity(e) {
    if (!e) return;
    open(`<p class="page-eyebrow">ACTIVITY EQUITY</p><h2>${esc(e.name)}</h2><p class="drawer-sub">${esc(e.enterprise)} · ${esc(e.scope)}</p>
      <div class="drawer-section"><div class="info-list"><div class="info-item"><small>权益总量</small><b>${e.total} 次</b></div><div class="info-item"><small>已发放</small><b>${e.issued} 次</b></div><div class="info-item"><small>已领取</small><b>${e.claimed} 次</b></div><div class="info-item"><small>已冻结</small><b>${e.frozen} 次</b></div><div class="info-item"><small>已核销</small><b>${e.consumed} 次</b></div><div class="info-item"><small>有效期</small><b>${esc(e.valid)}</b></div></div></div>
      <div class="drawer-section"><h3>权益动作</h3><div class="row-actions"><button class="btn small" data-equity-action="冻结">冻结</button><button class="btn small" data-equity-action="核销">核销</button><button class="btn small" data-equity-action="释放">释放</button></div><p class="drawer-sub" style="margin-top:6px">演示用：冻结→核销，取消时释放。</p></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>关闭</button><button class="btn primary" data-fund-issue>发放权益</button></div>`);
    $$("[data-equity-action]").forEach(btn => btn.addEventListener("click", () => equityAction(e, btn.dataset.equityAction)));
    $("[data-fund-issue]")?.addEventListener("click", issueEquity);
  }
  function equityAction(e, action) {
    if (action === "冻结") { e.frozen += 1; addLedger("员工活动权益", e.enterprise, "权益冻结", "EQ-" + Date.now(), e.name, "冻结", 1, e.total - e.issued, e.total - e.issued - 1); }
    if (action === "核销") { if (!e.frozen) { toast("没有冻结权益"); return; } e.frozen -= 1; e.consumed += 1; addLedger("员工活动权益", e.enterprise, "权益核销", "EQ-" + Date.now(), e.name, "核销", 1, e.total - e.consumed + 1, e.total - e.consumed); }
    if (action === "释放") { if (!e.frozen) { toast("没有冻结权益"); return; } e.frozen -= 1; addLedger("员工活动权益", e.enterprise, "权益释放", "EQ-" + Date.now(), e.name, "释放", 1, e.total - e.issued, e.total - e.issued + 1); }
    toast("权益动作已记录"); render(); viewEquity(e);
  }
  function addBudget() {
    open(`<p class="page-eyebrow">NEW BUDGET</p><h2>新增活动公共预算</h2><p class="drawer-sub">企业活动专用预算，不进入普通商城</p><div class="drawer-section"><div class="publish-form"><label class="field"><span>企业</span><input id="newBudgetEnterprise" placeholder="企业名称" /></label><label class="field"><span>预算金额</span><input id="newBudgetAmount" type="number" placeholder="0.00" /></label><label class="field"><span>有效期</span><input id="newBudgetValid" type="date" value="2026-12-31" /></label></div></div><div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-budget-create>创建预算</button></div>`);
    $("[data-budget-create]")?.addEventListener("click", () => {
      const enterprise = $("#newBudgetEnterprise").value.trim(); const amount = Number($("#newBudgetAmount").value || 0);
      if (!enterprise || !amount) { toast("请填写企业和预算金额"); return; }
      const b = { id: "预算-" + Date.now(), enterprise, contract: "待关联合约", total: amount, reserved: 0, verified: 0, settled: 0, valid: $("#newBudgetValid").value, status: "生效", activities: 0 };
      budgets.unshift(b); addLedger("企业公共资金", enterprise, "预算新增", b.id, "活动公共预算", "调整", amount, 0, amount); toast("活动预算已创建"); render();
      $("#drawer").classList.remove("open"); $("#drawerBackdrop").classList.remove("open");
    });
  }
  function issueEquity() {
    open(`<p class="page-eyebrow">ISSUE EQUITY</p><h2>发放活动权益</h2><p class="drawer-sub">按企业名单发放，不进入个人现金账户</p><div class="drawer-section"><div class="publish-form"><label class="field"><span>权益名称</span><input id="newEquityName" placeholder="例如：活动通用权益" /></label><label class="field"><span>企业</span><input id="newEquityEnterprise" placeholder="企业名称" /></label><label class="field"><span>发放数量</span><input id="newEquityCount" type="number" placeholder="0" /></label><label class="field"><span>有效期</span><input id="newEquityValid" type="date" value="2026-12-31" /></label></div></div><div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-equity-create>确认发放</button></div>`);
    $("[data-equity-create]")?.addEventListener("click", () => {
      const name = $("#newEquityName").value.trim(); const enterprise = $("#newEquityEnterprise").value.trim(); const count = Number($("#newEquityCount").value || 0);
      if (!name || !enterprise || !count) { toast("请填写权益名称、企业和数量"); return; }
      const e = { id: "权益-" + Date.now(), name, enterprise, total: count, issued: count, claimed: count, frozen: 0, consumed: 0, expired: 0, valid: $("#newEquityValid").value, scope: "活动通用", status: "生效" };
      equities.unshift(e); addLedger("员工活动权益", enterprise, "权益发放", e.id, name, "发放", count, 0, count); toast("活动权益已发放"); render();
      $("#drawer").classList.remove("open"); $("#drawerBackdrop").classList.remove("open");
    });
  }
  function addLedger(account, enterprise, biz, bizNo, target, action, amount, before, after) {
    ledger.unshift({ id: "FL-" + Date.now(), time: new Date().toLocaleString("zh-CN", { hour12: false }), account, enterprise, biz, bizNo, target, action, amount, before, after, operator: "当前用户" });
  }
  window.AdminFunds = { render, addLedger };
})();
