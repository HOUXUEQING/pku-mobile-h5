/* 活动管理基础版：配置、报名订单、核销、活动结算 */
(function () {
  "use strict";
  const D = window.ADMIN_DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const tag = (s, tone) => `<span class="tag ${tone || ""}">${esc(s)}</span>`;
  const money = n => "¥" + Number(n || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const moneyInt = n => "¥" + Number(n || 0).toLocaleString("zh-CN");
  let section = "活动配置";
  const sectionToKey = { "活动配置": "config", "报名订单": "orders", "核销台": "checkin", "活动结算": "settlement" };
  const keyToSection = { config: "活动配置", orders: "报名订单", checkin: "核销台", settlement: "活动结算" };
  const sectionDesc = {
    "活动配置": "活动基础信息、参与范围与资金依据",
    "报名订单": "报名即生成活动订单，记录支付来源与支付明细",
    "核销台": "服务完成并核销后，企业预算和员工权益才正式扣减",
    "活动结算": "只汇总已核销订单，分列三类资金并计算应付承办方"
  };
  let mode = "项目活动";
  let status = "全部状态";
  let query = "";

  const budgets = {
    "预算-中石油-01": { enterprise: "中石油华北分公司", total: 50000, reserved: 0, used: 0, valid: "2026-12-31" },
    "预算-金融街-01": { enterprise: "金融街控股", total: 30000, reserved: 0, used: 0, valid: "2026-12-31" },
    "预算-望京-01": { enterprise: "望京科技园", total: 20000, reserved: 0, used: 0, valid: "2026-12-31" }
  };
  const equities = {
    "权益-活动通用": { name: "活动通用权益", enterprise: "中石油华北分公司", total: 500, used: 0, frozen: 0, valid: "2026-12-31" },
    "权益-营养讲座": { name: "营养讲座权益", enterprise: "金融街控股", total: 100, used: 0, frozen: 0, valid: "2026-12-31" },
    "权益-公开课": { name: "公开课权益", enterprise: "方园中心", total: 80, used: 0, frozen: 0, valid: "2026-12-31" }
  };
  const activities = [
    { id: "活动-2026-001", name: "五好生活 · 控糖训练营", mode: "项目活动", type: "训练营", project: "五好生活", start: "2026-11-15", end: "2026-12-15", signupEnd: "2026-11-12", joined: 86, capacity: 120, price: 300, source: "企业公共资金", budgetId: "预算-中石油-01", equityId: "", status: "报名中" },
    { id: "活动-2026-002", name: "中石油华北 · 健康跑挑战", mode: "项目活动", type: "运动挑战", project: "中石油华北员工减重健康营", start: "2026-11-18", end: "2026-12-08", signupEnd: "2026-11-16", joined: 64, capacity: 100, price: 200, source: "企业公共资金", budgetId: "预算-中石油-01", equityId: "", status: "进行中" },
    { id: "活动-2026-003", name: "金融街 · 营养早餐课", mode: "项目活动", type: "健康讲座", project: "金融街企业减重健康营", start: "2026-11-20", end: "2026-11-20", signupEnd: "2026-11-19", joined: 42, capacity: 60, price: 0, source: "员工活动权益", budgetId: "", equityId: "权益-营养讲座", status: "待开始" },
    { id: "活动-2026-004", name: "望京园区 · 午间拉伸", mode: "项目活动", type: "运动课程", project: "望京科技园减重健康营", start: "2026-11-10", end: "2026-11-10", signupEnd: "2026-11-09", joined: 28, capacity: 40, price: 200, source: "企业公共资金", budgetId: "预算-望京-01", equityId: "", status: "已结束" },
    { id: "活动-2026-005", name: "方园中心 · 体重管理公开课", mode: "项目活动", type: "健康讲座", project: "五好生活", start: "2026-11-22", end: "2026-11-22", signupEnd: "2026-11-21", joined: 51, capacity: 80, price: 0, source: "员工活动权益", budgetId: "", equityId: "权益-活动通用", status: "待开始" },
    { id: "活动-2026-006", name: "康复医院 · 职工义诊", mode: "项目活动", type: "义诊", project: "康复医院员工减重营", start: "2026-11-25", end: "2026-11-25", signupEnd: "2026-11-23", joined: 73, capacity: 100, price: 200, source: "企业公共资金", budgetId: "预算-中石油-01", equityId: "", status: "报名中" },
    { id: "活动-2026-007", name: "城市健康公开课 · 科学减脂", mode: "公开活动", type: "公开课", project: "公开活动", start: "2026-11-30", end: "2026-11-30", signupEnd: "2026-11-28", joined: 136, capacity: 200, price: 99, source: "个人自费", budgetId: "", equityId: "", status: "报名中" },
    { id: "活动-2026-008", name: "21 天睡眠改善计划", mode: "公开活动", type: "线上训练营", project: "公开活动", start: "2026-12-01", end: "2026-12-21", signupEnd: "2026-11-29", joined: 208, capacity: 300, price: 199, source: "个人自费", budgetId: "", equityId: "", status: "报名中" },
    { id: "活动-2026-009", name: "企业健康管理沙龙", mode: "公开活动", type: "线下沙龙", project: "公开活动", start: "2026-12-05", end: "2026-12-05", signupEnd: "2026-12-03", joined: 46, capacity: 80, price: 0, source: "个人自费", budgetId: "", equityId: "", status: "待审核" },
    { id: "活动-2026-010", name: "冬日健康市集", mode: "公开活动", type: "健康市集", project: "公开活动", start: "2026-12-12", end: "2026-12-13", signupEnd: "2026-12-10", joined: 0, capacity: 500, price: 0, source: "个人自费", budgetId: "", equityId: "", status: "草稿" }
  ];
  const orders = [
    { id: "AO-2026-00101", activityId: "活动-2026-001", name: "林悦", enterprise: "中石油华北分公司", source: "企业公共资金", publicFund: 300, equity: 0, selfPay: 0, status: "已核销", date: "2026-11-10 09:12" },
    { id: "AO-2026-00102", activityId: "活动-2026-001", name: "陈嘉禾", enterprise: "中石油华北分公司", source: "企业公共资金", publicFund: 300, equity: 0, selfPay: 0, status: "已支付", date: "2026-11-10 09:40" },
    { id: "AO-2026-00103", activityId: "活动-2026-001", name: "周雯", enterprise: "中石油华北分公司", source: "企业公共资金", publicFund: 300, equity: 0, selfPay: 0, status: "已支付", date: "2026-11-10 10:05" },
    { id: "AO-2026-00301", activityId: "活动-2026-003", name: "徐一鸣", enterprise: "金融街控股", source: "员工活动权益", publicFund: 0, equity: 1, selfPay: 0, status: "已核销", date: "2026-11-11 09:20" },
    { id: "AO-2026-00302", activityId: "活动-2026-003", name: "吴倩", enterprise: "金融街控股", source: "员工活动权益", publicFund: 0, equity: 1, selfPay: 0, status: "已支付", date: "2026-11-11 09:35" },
    { id: "AO-2026-00401", activityId: "活动-2026-004", name: "何雨桐", enterprise: "望京科技园", source: "企业公共资金", publicFund: 200, equity: 0, selfPay: 0, status: "已核销", date: "2026-11-10 12:10" },
    { id: "AO-2026-00402", activityId: "活动-2026-004", name: "赵启明", enterprise: "望京科技园", source: "企业公共资金", publicFund: 200, equity: 0, selfPay: 0, status: "已取消", date: "2026-11-10 12:20" },
    { id: "AO-2026-00701", activityId: "活动-2026-007", name: "孙宁", enterprise: "公开报名", source: "个人自费", publicFund: 0, equity: 0, selfPay: 99, status: "已核销", date: "2026-11-09 15:30" },
    { id: "AO-2026-00702", activityId: "活动-2026-007", name: "刘洋", enterprise: "公开报名", source: "个人自费", publicFund: 0, equity: 0, selfPay: 99, status: "已支付", date: "2026-11-09 16:10" },
    { id: "AO-2026-00801", activityId: "活动-2026-008", name: "王琳", enterprise: "公开报名", source: "个人自费", publicFund: 0, equity: 0, selfPay: 199, status: "已核销", date: "2026-11-08 11:05" }
  ];
  const settlements = [];
  const coverOptions = [["blue", "健康蓝"], ["green", "运动绿"], ["orange", "活力橙"], ["purple", "营养紫"]];
  activities.forEach((a, i) => {
    a.cover = a.cover || coverOptions[i % coverOptions.length][0];
    a.coverImage = a.coverImage || "";
    a.description = a.description || "围绕企业员工健康需求开展的活动，完成报名、核销后按活动结算规则与承办方结算。";
    a.highlights = a.highlights || "专家授课,现场互动,健康礼包";
    a.agenda = a.agenda || "09:00 签到\n09:30 主题分享\n10:30 互动答疑\n11:00 活动结束";
    a.speakers = a.speakers || "北大医疗健康管理中心专家团队";
    a.notice = a.notice || "请提前 10 分钟签到；活动名额有限，报名后请按时参加。";
    a.detailImages = a.detailImages || [];
    a.detailVideo = a.detailVideo || "";
  });

  function activityName(id) { return activities.find(a => a.id === id)?.name || id; }
  function coverLabel(key) { return coverOptions.find(x => x[0] === key)?.[1] || "健康蓝"; }
  function getBudget(a) { return a.budgetId ? budgets[a.budgetId] : null; }
  function getEquity(a) { return a.equityId ? equities[a.equityId] : null; }
  function statusTone(s) { return s === "报名中" || s === "进行中" || s === "已核销" || s === "已结算" ? "green" : s === "待审核" || s === "待支付" ? "gold" : s === "已结束" || s === "已取消" ? "slate" : "blue"; }
  function pageHead() {
    return `<div class="page-head"><div><p class="page-eyebrow">ACTIVITY MANAGEMENT</p><h2>${section}</h2><p class="checkin-sub">${sectionDesc[section]}</p></div><div class="page-actions">${section === "活动配置" ? `<button class="btn primary" data-activity-new>${icon("plus")}新建活动</button>` : `<button class="btn" data-activity-export>${icon("download")}导出</button>`}</div></div>`;
  }
  function setTop() {
    $("#topTitle").textContent = section;
    $("#breadcrumb").textContent = "活动管理 / " + section;
    const nav = "activities-" + (sectionToKey[section] || "config");
    $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.nav === nav));
  }
  function open(html) {
    $("#drawerBody").innerHTML = html;
    $("#drawer").classList.add("open");
    $("#drawer").setAttribute("aria-hidden", "false");
    $("#drawerBackdrop").classList.add("open");
  }
  function toast(text) {
    const t = $("#toast"); t.textContent = text; t.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2200);
  }
  function sectionTabs() {
    return `<div class="activity-section-tabs">${["活动配置", "报名订单", "核销台", "活动结算"].map(s => `<button class="${section === s ? "active" : ""}" data-activity-section="${s}">${s}${s === "报名订单" ? `<b>${orders.length}</b>` : s === "核销台" ? `<b>${orders.filter(o => o.status === "已支付").length}</b>` : s === "活动结算" ? `<b>${settlements.length}</b>` : ""}</button>`).join("")}</div>`;
  }
  function renderConfig() {
    const list = activities.filter(a => (mode === "项目活动" ? a.mode === "项目活动" : a.mode === "公开活动") && (status === "全部状态" || a.status === status) && (!query || (a.name + a.project + a.type).includes(query)));
    return `<div class="filter-bar"><div class="recipe-mode-tabs"><button class="${mode === "项目活动" ? "active" : ""}" data-activity-mode="项目活动">项目活动<b>${activities.filter(a => a.mode === "项目活动").length}</b></button><button class="${mode === "公开活动" ? "active" : ""}" data-activity-mode="公开活动">公开活动<b>${activities.filter(a => a.mode === "公开活动").length}</b></button></div><label class="filter-search"><svg class="ic"><use href="#i-search"/></svg><input id="activitySearch" value="${esc(query)}" placeholder="搜索活动、项目或类型" /></label><select class="filter-select" id="activityStatus"><option>全部状态</option>${[...new Set(activities.map(a => a.status))].map(s => `<option${status === s ? " selected" : ""}>${s}</option>`).join("")}</select></div>
      <div class="activity-card-grid">${list.map(a => { const b = getBudget(a); const e = getEquity(a); return `<article class="activity-card"><div class="activity-card-cover ${esc(a.cover)}"${a.coverImage ? ` style="background-image:linear-gradient(180deg,rgba(7,27,52,.06),rgba(7,27,52,.78)),url('${esc(a.coverImage)}');background-size:cover;background-position:center"` : ""}><div class="activity-card-cover-top">${tag(a.mode, a.mode === "项目活动" ? "blue" : "purple")}${tag(a.status, statusTone(a.status))}</div><div class="activity-card-cover-bottom"><span>${esc(a.type)}</span><b>${esc(a.name)}</b><small>${esc(a.id)}</small></div></div><div class="activity-card-body"><div class="activity-card-project">${esc(a.project)}</div><div class="activity-card-meta"><span>${esc(a.start)} — ${esc(a.end)}</span><span>报名截止 ${esc(a.signupEnd)}</span></div><div class="activity-card-stats"><div><small>报名 / 上限</small><b>${a.joined} / ${a.capacity}</b></div><div><small>支付来源</small><b>${esc(a.source)}</b></div><div><small>${b ? "预算可用" : e ? "权益剩余" : "支付方式"}</small><b>${b ? moneyInt(b.total - b.reserved - b.used) : e ? e.total - e.used - e.frozen + " 次" : "个人自费"}</b></div></div><div class="activity-card-foot"><span>${b ? `预算 ${moneyInt(b.total)}` : e ? esc(e.name) : "公开自费活动"}</span><button class="panel-link" data-activity-view="${a.id}">查看详情 →</button></div></div></article>`; }).join("")}</div>`;
  }
  function renderOrders() {
    const list = orders.filter(o => !query || (o.id + o.name + activityName(o.activityId)).includes(query));
    return `<div class="filter-bar"><label class="filter-search"><svg class="ic"><use href="#i-search"/></svg><input id="activityOrderSearch" value="${esc(query)}" placeholder="搜索订单、报名人、活动" /></label><span class="tag blue">报名即生成活动订单 · 支付明细独立记录</span></div>
      <section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>活动订单</th><th>活动</th><th>报名人</th><th>企业</th><th>支付来源</th><th>支付明细</th><th>状态</th><th>报名时间</th><th></th></tr></thead><tbody>${list.map(o => `<tr><td><b class="cell-main">${esc(o.id)}</b></td><td>${esc(activityName(o.activityId))}</td><td>${esc(o.name)}</td><td>${esc(o.enterprise)}</td><td>${tag(o.source, o.source === "企业公共资金" ? "green" : o.source === "员工活动权益" ? "purple" : "gold")}</td><td>${o.publicFund ? `公共 ${money(o.publicFund)}` : ""}${o.equity ? `权益 ${o.equity} 次` : ""}${o.selfPay ? `自费 ${money(o.selfPay)}` : ""}</td><td>${tag(o.status, statusTone(o.status))}</td><td>${esc(o.date)}</td><td>${o.status === "已支付" ? `<button class="panel-link" data-verify-one="${o.id}">核销</button>` : ""}</td></tr>`).join("")}</tbody></table></div></section>`;
  }
  function renderVerify() {
    const pending = orders.filter(o => o.status === "已支付");
    return `<div class="activity-note"><b>待核销 ${pending.length} 笔</b><span>核销后企业公共预算转为已核销、员工权益扣减，只有已核销订单进入活动结算。</span></div>
      <section class="panel"><div class="panel-head"><div><h3 class="panel-title">待核销名单</h3><p class="panel-sub">勾选订单后批量核销</p></div><button class="btn primary" data-verify-selected>核销选中</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th><input type="checkbox" id="verifyAll" /></th><th>订单</th><th>活动</th><th>报名人</th><th>支付来源</th><th>金额</th><th>状态</th><th></th></tr></thead><tbody>${pending.map(o => `<tr><td><input type="checkbox" data-verify-pick="${o.id}" /></td><td><b class="cell-main">${esc(o.id)}</b></td><td>${esc(activityName(o.activityId))}</td><td>${esc(o.name)}</td><td>${esc(o.source)}</td><td>${o.publicFund ? money(o.publicFund) : o.selfPay ? money(o.selfPay) : o.equity + " 次权益"}</td><td>${tag(o.status, "gold")}</td><td><button class="panel-link" data-verify-one="${o.id}">核销 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
  }
  function settlementData() {
    return activities.map(a => {
      const done = orders.filter(o => o.activityId === a.id && o.status === "已核销");
      const publicFund = done.reduce((n, o) => n + o.publicFund, 0);
      const equity = done.reduce((n, o) => n + o.equity, 0);
      const selfPay = done.reduce((n, o) => n + o.selfPay, 0);
      const total = publicFund + selfPay;
      const fee = Math.round(total * 0.05 * 100) / 100;
      return { a, done, publicFund, equity, selfPay, total, fee, payable: total - fee };
    }).filter(x => x.done.length);
  }
  function renderSettlement() {
    const rows = settlementData();
    return `<div class="activity-note"><b>活动结算只做活动维度汇总</b><span>结算单、财务复核、打款和差错工单统一在财务结算处理，本页不重复维护一套付款流程。差异进入 <a href="#财务结算/差错工单">差错工单 →</a>，<a href="#财务结算/机构结算单">财务结算 →</a></span></div>
      <div class="kpi-grid four">${kpi("check", "已核销订单", orders.filter(o => o.status === "已核销").length, "笔", "可进入结算", "#2f6bff")}${kpi("project", "活动公共资金", moneyInt(rows.reduce((n, r) => n + r.publicFund, 0)), "元", "已核销汇总", "#16a394")}${kpi("heart", "个人自费", moneyInt(rows.reduce((n, r) => n + r.selfPay, 0)), "元", "已核销汇总", "#8b5cf6")}${kpi("chart", "应付承办方", moneyInt(rows.reduce((n, r) => n + r.payable, 0)), "元", "扣除平台服务费", "#e8a13c")}</div>
      <section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>活动</th><th>已核销</th><th>企业公共资金</th><th>员工权益</th><th>个人自费</th><th>平台服务费</th><th>应付承办方</th><th>结算状态</th><th></th></tr></thead><tbody>${rows.map(r => { const st = settlements.find(s => s.activityId === r.a.id); return `<tr><td><b class="cell-main">${esc(r.a.name)}</b><span class="cell-sub">${esc(r.a.id)}</span></td><td>${r.done.length} 笔</td><td>${money(r.publicFund)}</td><td>${r.equity ? r.equity + " 次" : "—"}</td><td>${money(r.selfPay)}</td><td>${money(r.fee)}</td><td><b class="money">${money(r.payable)}</b></td><td>${tag(st ? st.status : "待生成", st ? "green" : "gold")}</td><td>${st ? `<button class="panel-link" data-settlement-view="${st.id}">查看</button>` : `<button class="panel-link" data-settlement-create="${r.a.id}">生成结算单 →</button>`}</td></tr>`; }).join("")}</tbody></table></div></section>`;
  }
  function render(sub) {
    if (sub && keyToSection[sub]) section = keyToSection[sub];
    $("#viewRoot").innerHTML = `<div class="page">${pageHead()}${section === "活动配置" ? renderConfig() : section === "报名订单" ? renderOrders() : section === "核销台" ? renderVerify() : renderSettlement()}</div>`;
    setTop();
    if (section === "活动配置") {
      $$("[data-activity-mode]").forEach(b => b.addEventListener("click", () => { mode = b.dataset.activityMode; render(); }));
      $("#activitySearch")?.addEventListener("input", e => { query = e.target.value.trim(); render(); });
      $("#activityStatus")?.addEventListener("change", e => { status = e.target.value; render(); });
      $$("[data-activity-view]").forEach(b => b.addEventListener("click", () => viewActivity(activities.find(a => a.id === b.dataset.activityView))));
      $$("[data-activity-new]").forEach(b => b.addEventListener("click", () => editActivity(null)));
    } else if (section === "报名订单") {
      $("#activityOrderSearch")?.addEventListener("input", e => { query = e.target.value.trim(); render(); });
      $$("[data-verify-one]").forEach(b => b.addEventListener("click", () => verifyOrder(b.dataset.verifyOne)));
    } else if (section === "核销台") {
      $("#verifyAll")?.addEventListener("change", e => { $$("[data-verify-pick]").forEach(c => c.checked = e.target.checked); });
      $$("[data-verify-one]").forEach(b => b.addEventListener("click", () => verifyOrder(b.dataset.verifyOne)));
      $("[data-verify-selected]")?.addEventListener("click", () => {
        const ids = $$("[data-verify-pick]:checked").map(c => c.dataset.verifyPick);
        if (!ids.length) { toast("请选择待核销订单"); return; }
        ids.forEach(id => verifyOrder(id, true)); toast(`已核销 ${ids.length} 笔订单`); render();
      });
    } else if (section === "活动结算") {
      $$("[data-settlement-create]").forEach(b => b.addEventListener("click", () => createSettlement(b.dataset.settlementCreate)));
      $$("[data-settlement-view]").forEach(b => b.addEventListener("click", () => viewSettlement(settlements.find(s => s.id === b.dataset.settlementView))));
    }
    $$("[data-activity-export]").forEach(b => b.addEventListener("click", () => toast("导出任务已创建")));
  }
  function kpi(iconName, label, value, unit, sub, color) {
    return `<article class="kpi-card" style="--kpi:${color};--kpi-soft:${color}18"><span class="kpi-icon">${icon(iconName)}</span><div class="kpi-label">${label}</div><div class="kpi-num">${value}<small>${unit}</small></div><div class="kpi-sub">${sub}</div></article>`;
  }
  function verifyOrder(id, silent) {
    const o = orders.find(x => x.id === id); if (!o || o.status !== "已支付") return;
    o.status = "已核销";
    if (o.publicFund) {
      const a = activities.find(x => x.id === o.activityId); const b = a && getBudget(a);
      if (b) { b.used += o.publicFund; b.reserved = Math.max(0, b.reserved - o.publicFund); }
    }
    if (o.equity) { const a = activities.find(x => x.id === o.activityId); const e = a && getEquity(a); if (e) { e.frozen = Math.max(0, e.frozen - o.equity); e.used += o.equity; } }
    if (!silent) { toast("订单已核销"); render(); }
  }
  function viewActivity(a) {
    if (!a) return;
    const b = getBudget(a); const e = getEquity(a);
    open(`<p class="page-eyebrow">ACTIVITY DETAIL</p><h2>${esc(a.name)}</h2><p class="drawer-sub">${esc(a.id)} · ${esc(a.mode)} · ${esc(a.status)}</p>
      <div class="activity-detail-cover ${esc(a.cover)}"${a.coverImage ? ` style="background-image:linear-gradient(180deg,rgba(8,29,55,.05),rgba(8,29,55,.72)),url('${esc(a.coverImage)}');background-size:cover;background-position:center"` : ""}><span>${esc(a.type)}</span><b>${esc(a.name)}</b><small>${esc(a.project)}</small></div>
      <div class="drawer-section"><h3>活动简介</h3><p class="activity-detail-desc">${esc(a.description)}</p>${a.highlights ? `<div class="activity-highlights">${a.highlights.split(",").filter(Boolean).map(h => `<span>${esc(h)}</span>`).join("")}</div>` : ""}</div>
      <div class="drawer-section"><h3>活动详情</h3>${a.detailImages && a.detailImages.length ? `<div class="activity-detail-gallery">${a.detailImages.map(src => `<img src="${esc(src)}" alt="活动图片" />`).join("")}</div>` : ""}${a.detailVideo ? `<video class="activity-detail-video" src="${esc(a.detailVideo)}" controls></video>` : ""}<div class="activity-detail-copy"><div><small>活动议程</small><p>${esc(a.agenda || "—").replace(/\n/g, "<br/>")}</p></div><div><small>嘉宾 / 讲师</small><p>${esc(a.speakers || "—")}</p></div><div><small>参与须知</small><p>${esc(a.notice || "—")}</p></div></div></div>
      <div class="drawer-section"><div class="info-list"><div class="info-item"><small>所属项目</small><b>${esc(a.project)}</b></div><div class="info-item"><small>活动时间</small><b>${esc(a.start)} — ${esc(a.end)}</b></div><div class="info-item"><small>报名 / 上限</small><b>${a.joined} / ${a.capacity}</b></div><div class="info-item"><small>支付来源</small><b>${esc(a.source)}</b></div></div></div>
      <div class="drawer-section"><h3>资金依据</h3><div class="info-list">${b ? `<div class="info-item"><small>活动公共预算</small><b>${esc(a.budgetId)}</b></div><div class="info-item"><small>预算总额 / 可用</small><b>${moneyInt(b.total)} / ${moneyInt(b.total - b.used - b.reserved)}</b></div>` : e ? `<div class="info-item"><small>员工活动权益</small><b>${esc(e.name)}</b></div><div class="info-item"><small>权益剩余</small><b>${e.total - e.used - e.frozen} 次</b></div>` : `<div class="info-item"><small>支付方式</small><b>个人自费</b></div>`}</div><div class="notice" style="margin-top:7px">报名预占，核销后进入结算；公开活动不允许使用企业公共资金或员工权益。</div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>关闭</button><button class="btn primary" data-activity-edit="${a.id}">编辑活动</button></div>`);
    $("[data-activity-edit]")?.addEventListener("click", () => editActivity(a));
  }
  function editActivity(a) {
    const activity = a || { name: "", mode: mode, type: "健康讲座", project: "五好生活", start: "2026-12-01", end: "2026-12-01", signupEnd: "2026-11-28", capacity: 100, price: 0, source: "企业公共资金", budgetId: "预算-中石油-01", equityId: "", status: "草稿", cover: "blue", coverImage: "", description: "", highlights: "", agenda: "", speakers: "", notice: "", detailImages: [], detailVideo: "" };
    const publicMode = activity.mode === "公开活动";
    let coverImageData = activity.coverImage || "";
    let detailImagesData = Array.isArray(activity.detailImages) ? activity.detailImages.slice() : [];
    let detailVideoData = activity.detailVideo || "";
    open(`<p class="page-eyebrow">ACTIVITY EDITOR</p><h2>${a ? "编辑活动" : "新建活动"}</h2><p class="drawer-sub">基础配置 · 资金依据 · 报名与核销规则</p>
      <div class="drawer-section"><div class="publish-form"><label class="field"><span>活动名称</span><input id="activityName" value="${esc(activity.name)}" /></label><label class="field"><span>活动模式</span><select id="activityMode"><option${activity.mode === "项目活动" ? " selected" : ""}>项目活动</option><option${activity.mode === "公开活动" ? " selected" : ""}>公开活动</option></select></label><label class="field"><span>活动类型</span><input id="activityType" value="${esc(activity.type)}" /></label><label class="field"><span>所属项目</span><select id="activityProject"><option>五好生活</option>${D.projects.map(p => `<option${activity.project === p.name ? " selected" : ""}>${esc(p.name)}</option>`).join("")}<option${activity.project === "公开活动" ? " selected" : ""}>公开活动</option></select></label><label class="field"><span>开始日期</span><input id="activityStart" type="date" value="${esc(activity.start)}" /></label><label class="field"><span>结束日期</span><input id="activityEnd" type="date" value="${esc(activity.end)}" /></label><label class="field"><span>报名截止</span><input id="activitySignup" type="date" value="${esc(activity.signupEnd)}" /></label><label class="field"><span>人数上限</span><input id="activityCapacity" type="number" value="${activity.capacity}" /></label><label class="field"><span>报名价格</span><input id="activityPrice" type="number" value="${activity.price}" /></label>
        <label class="field full"><span>活动简介</span><textarea id="activityDescription" rows="3">${esc(activity.description)}</textarea></label>
        <div class="field full"><span>活动封面</span><div class="activity-cover-editor"><select id="activityCover">${coverOptions.map(([k, v]) => `<option value="${k}"${activity.cover === k ? " selected" : ""}>${v}</option>`).join("")}</select><div class="activity-cover-preview ${esc(activity.cover || "blue")}"${coverImageData ? ` style="background-image:linear-gradient(180deg,rgba(8,29,55,.04),rgba(8,29,55,.54)),url('${esc(coverImageData)}');background-size:cover;background-position:center"` : ""}><span>${esc(activity.type)}</span><b>${esc(activity.name || "活动名称")}</b></div><label class="activity-cover-upload">上传封面<input type="file" id="activityCoverFile" accept="image/*" /></label></div></div>
      </div></div>
      <div class="drawer-section"><h3>活动详情</h3><div class="publish-form">
        <label class="field full"><span>活动亮点</span><input id="activityHighlights" value="${esc(activity.highlights || "")}" placeholder="用逗号分隔，例如：专家授课,现场互动,健康礼包" /></label>
        <label class="field full"><span>活动议程</span><textarea id="activityAgenda" rows="4" placeholder="每行一个环节">${esc(activity.agenda || "")}</textarea></label>
        <label class="field"><span>嘉宾 / 讲师</span><input id="activitySpeakers" value="${esc(activity.speakers || "")}" /></label>
        <div class="field full"><span>活动详情图片</span><div class="activity-media-uploader"><label class="activity-upload-tile"><input id="activityDetailImageFile" type="file" accept="image/*" multiple /><i>＋</i><b>上传详情图片</b><small>支持多图，JPG / PNG</small></label><div class="activity-edit-gallery" id="activityDetailGallery"></div></div></div>
        <div class="field full"><span>活动详情视频</span><div class="activity-media-uploader"><label class="activity-upload-tile video"><input id="activityDetailVideoFile" type="file" accept="video/*" /><i>▶</i><b>上传活动视频</b><small>MP4 / MOV，建议 60 秒内</small></label><div class="activity-edit-video" id="activityDetailVideoPreview"></div></div></div>
        <label class="field full"><span>参与须知</span><textarea id="activityNotice" rows="3" placeholder="报名、签到、取消规则等">${esc(activity.notice || "")}</textarea></label>
      </div></div>
      <div class="drawer-section"><h3>资金依据</h3><div class="publish-form"><label class="field"><span>支付来源</span><select id="activitySource"><option${activity.source === "企业公共资金" ? " selected" : ""}>企业公共资金</option><option${activity.source === "员工活动权益" ? " selected" : ""}>员工活动权益</option><option${activity.source === "个人自费" ? " selected" : ""}>个人自费</option></select></label><label class="field"><span>活动公共预算</span><select id="activityBudget"><option value="">不绑定</option>${Object.entries(budgets).map(([id, b]) => `<option value="${id}"${activity.budgetId === id ? " selected" : ""}>${id} · 可用 ${moneyInt(b.total - b.used - b.reserved)}</option>`).join("")}</select></label><label class="field"><span>员工活动权益</span><select id="activityEquity"><option value="">不绑定</option>${Object.entries(equities).map(([id, e]) => `<option value="${id}"${activity.equityId === id ? " selected" : ""}>${id} · 剩余 ${e.total - e.used - e.frozen} 次</option>`).join("")}</select></label><label class="field"><span>状态</span><select id="activityStatusEdit">${["草稿", "报名中", "进行中", "已结束", "已取消"].map(s => `<option${activity.status === s ? " selected" : ""}>${s}</option>`).join("")}</select></label></div><div class="notice" style="margin-top:7px">公开活动保存时强制改为个人自费，不能绑定企业公共预算或员工权益。</div></div>
      <div class="drawer-section"><h3>核销规则</h3><div class="publish-form"><label class="field"><span>核销方式</span><select><option>名单勾选</option><option>扫码核销</option></select></label><label class="field"><span>未核销处理</span><select><option>释放预占，不进入结算</option><option>活动结束自动关闭</option></select></label></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-activity-save="${a ? a.id : ""}">保存活动</button></div>`);
    const modeSelect = $("#activityMode");
    const sourceSelect = $("#activitySource");
    const syncPublic = () => {
      if (modeSelect.value === "公开活动") {
        sourceSelect.value = "个人自费";
        Array.from(sourceSelect.options).forEach(o => { if (o.value !== "个人自费") o.disabled = true; });
      } else {
        Array.from(sourceSelect.options).forEach(o => o.disabled = false);
      }
    };
    modeSelect.addEventListener("change", syncPublic);
    if (publicMode) syncPublic();
    const coverSelect = $("#activityCover");
    const coverPreview = $(".activity-cover-preview");
    coverSelect?.addEventListener("change", () => { if (coverPreview) coverPreview.className = "activity-cover-preview " + coverSelect.value; });
    $("#activityCoverFile")?.addEventListener("change", e => {
      const file = e.target.files && e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        coverImageData = String(reader.result || "");
        if (coverPreview) coverPreview.style.cssText = `background-image:linear-gradient(180deg,rgba(8,29,55,.04),rgba(8,29,55,.54)),url('${coverImageData}');background-size:cover;background-position:center`;
      };
      reader.readAsDataURL(file);
    });
    const gallery = $("#activityDetailGallery");
    const videoPreview = $("#activityDetailVideoPreview");
    const renderDetailMedia = () => {
      if (gallery) {
        gallery.innerHTML = detailImagesData.length ? detailImagesData.map((src, i) => `<div class="activity-edit-media"><img src="${esc(src)}" alt="详情图片" /><button type="button" data-remove-detail-image="${i}">×</button></div>`).join("") : `<span class="activity-media-empty">暂无详情图片</span>`;
      }
      if (videoPreview) videoPreview.innerHTML = detailVideoData ? `<video src="${esc(detailVideoData)}" controls></video><button type="button" data-remove-detail-video>移除视频</button>` : `<span class="activity-media-empty">暂无详情视频</span>`;
      gallery?.querySelectorAll("[data-remove-detail-image]").forEach(b => b.addEventListener("click", () => { detailImagesData.splice(Number(b.dataset.removeDetailImage), 1); renderDetailMedia(); }));
      videoPreview?.querySelector("[data-remove-detail-video]")?.addEventListener("click", () => { detailVideoData = ""; renderDetailMedia(); });
    };
    renderDetailMedia();
    $("#activityDetailImageFile")?.addEventListener("change", e => {
      Array.from(e.target.files || []).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => { detailImagesData.push(String(reader.result || "")); renderDetailMedia(); };
        reader.readAsDataURL(file);
      });
    });
    $("#activityDetailVideoFile")?.addEventListener("change", e => {
      const file = e.target.files && e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { detailVideoData = String(reader.result || ""); renderDetailMedia(); };
      reader.readAsDataURL(file);
    });
    $("[data-activity-save]")?.addEventListener("click", () => {
      const isPublic = modeSelect.value === "公开活动";
      if (isPublic && sourceSelect.value !== "个人自费") { toast("公开活动只能个人自费"); return; }
      const payload = { name: $("#activityName").value.trim() || "未命名活动", mode: modeSelect.value, type: $("#activityType").value, project: $("#activityProject").value, start: $("#activityStart").value, end: $("#activityEnd").value, signupEnd: $("#activitySignup").value, capacity: Number($("#activityCapacity").value || 0), price: Number($("#activityPrice").value || 0), source: isPublic ? "个人自费" : sourceSelect.value, budgetId: $("#activityBudget").value, equityId: $("#activityEquity").value, status: $("#activityStatusEdit").value, cover: coverSelect?.value || "blue", coverImage: coverImageData, description: $("#activityDescription").value.trim(), highlights: $("#activityHighlights").value.trim(), agenda: $("#activityAgenda").value.trim(), speakers: $("#activitySpeakers").value.trim(), notice: $("#activityNotice").value.trim(), detailImages: detailImagesData.slice(), detailVideo: detailVideoData };
      if (a) Object.assign(a, payload);
      else activities.unshift({ id: "活动-2026-" + String(activities.length + 1).padStart(3, "0"), joined: 0, ...payload });
      toast(a ? "活动已更新" : "活动已创建");
      $("#drawer").classList.remove("open"); $("#drawerBackdrop").classList.remove("open");
      render(sectionToKey[section] || "config");
    });
  }
  function createSettlement(activityId) {
    const r = settlementData().find(x => x.a.id === activityId); if (!r) return;
    const no = String(settlements.length + 1).padStart(3, "0");
    const s = { id: "AS-2026-" + no, financeNo: "JS-2026-" + no, activityId, publicFund: r.publicFund, equity: r.equity, selfPay: r.selfPay, fee: r.fee, payable: r.payable, count: r.done.length, status: "待财务复核" };
    settlements.push(s); toast("活动结算单已生成并提交财务结算"); render();
  }
  function viewSettlement(s) {
    if (!s) return;
    open(`<p class="page-eyebrow">ACTIVITY SETTLEMENT</p><h2>${esc(s.id)}</h2><p class="drawer-sub">${esc(activityName(s.activityId))} · ${esc(s.status)}</p>
      <div class="drawer-section"><h3>金额构成</h3><div class="info-list"><div class="info-item"><small>财务结算单号</small><b>${esc(s.financeNo || "—")}</b></div><div class="info-item"><small>已核销订单</small><b>${s.count} 笔</b></div><div class="info-item"><small>企业公共资金</small><b>${money(s.publicFund)}</b></div><div class="info-item"><small>员工活动权益</small><b>${s.equity ? s.equity + " 次" : "—"}</b></div><div class="info-item"><small>个人自费</small><b>${money(s.selfPay)}</b></div><div class="info-item"><small>平台服务费</small><b>-${money(s.fee)}</b></div><div class="info-item"><small>应付承办方</small><b class="money">${money(s.payable)}</b></div></div></div>
      <div class="drawer-section"><h3>结算依据</h3><div class="notice">本页仅做活动维度汇总。正式结算单、财务复核、打款和差错工单统一在财务结算处理，不在此页重复发起打款。</div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>关闭</button><button class="btn primary" data-submit-message="已提交复核">提交财务复核</button></div>`);
  }
  window.AdminActivity = { render };
})();
