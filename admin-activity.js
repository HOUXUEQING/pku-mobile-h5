/* 简化版活动管理：项目活动 / 公开活动，一套活动模型 */
(function () {
  "use strict";
  const D = window.ADMIN_DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const tag = (s, tone) => `<span class="tag ${tone || ""}">${esc(s)}</span>`;
  let mode = "项目活动";
  let status = "全部状态";
  let query = "";

  const activities = [
    { id: "活动-2026-001", name: "五好生活 · 控糖训练营", mode: "项目活动", type: "训练营", project: "五好生活", start: "2026-11-15", end: "2026-12-15", signupEnd: "2026-11-12", joined: 86, capacity: 120, fund: "企业公共资金", budget: 25800, used: 0, perCap: 300, personalFund: true, selfPay: false, rights: "", status: "报名中" },
    { id: "活动-2026-002", name: "中石油华北 · 健康跑挑战", mode: "项目活动", type: "运动挑战", project: "中石油华北员工减重健康营", start: "2026-11-18", end: "2026-12-08", signupEnd: "2026-11-16", joined: 64, capacity: 100, fund: "企业公共资金", budget: 12800, used: 3200, perCap: 200, personalFund: true, selfPay: true, rights: "", status: "进行中" },
    { id: "活动-2026-003", name: "金融街 · 营养早餐课", mode: "项目活动", type: "健康讲座", project: "金融街企业减重健康营", start: "2026-11-20", end: "2026-11-20", signupEnd: "2026-11-19", joined: 42, capacity: 60, fund: "企业权益", budget: 0, used: 0, perCap: 0, personalFund: false, selfPay: false, rights: "营养讲座 2 场", status: "待开始" },
    { id: "活动-2026-004", name: "望京园区 · 午间拉伸", mode: "项目活动", type: "运动课程", project: "望京科技园减重健康营", start: "2026-11-10", end: "2026-11-10", signupEnd: "2026-11-09", joined: 28, capacity: 40, fund: "企业公共资金", budget: 5600, used: 5600, perCap: 200, personalFund: false, selfPay: false, rights: "", status: "已结束" },
    { id: "活动-2026-005", name: "方园中心 · 体重管理公开课", mode: "项目活动", type: "健康讲座", project: "五好生活", start: "2026-11-22", end: "2026-11-22", signupEnd: "2026-11-21", joined: 51, capacity: 80, fund: "企业权益", budget: 0, used: 0, perCap: 0, personalFund: false, selfPay: false, rights: "专家公开课 1 场", status: "待开始" },
    { id: "活动-2026-006", name: "康复医院 · 职工义诊", mode: "项目活动", type: "义诊", project: "康复医院员工减重营", start: "2026-11-25", end: "2026-11-25", signupEnd: "2026-11-23", joined: 73, capacity: 100, fund: "企业公共资金", budget: 14600, used: 0, perCap: 200, personalFund: true, selfPay: true, rights: "", status: "报名中" },
    { id: "活动-2026-007", name: "城市健康公开课 · 科学减脂", mode: "公开活动", type: "公开课", project: "公开活动", start: "2026-11-30", end: "2026-11-30", signupEnd: "2026-11-28", joined: 136, capacity: 200, fund: "个人自费", budget: 0, used: 0, perCap: 0, personalFund: false, selfPay: true, rights: "", status: "报名中" },
    { id: "活动-2026-008", name: "21 天睡眠改善计划", mode: "公开活动", type: "线上训练营", project: "公开活动", start: "2026-12-01", end: "2026-12-21", signupEnd: "2026-11-29", joined: 208, capacity: 300, fund: "个人自费", budget: 0, used: 0, perCap: 0, personalFund: false, selfPay: true, rights: "", status: "报名中" },
    { id: "活动-2026-009", name: "企业健康管理沙龙", mode: "公开活动", type: "线下沙龙", project: "公开活动", start: "2026-12-05", end: "2026-12-05", signupEnd: "2026-12-03", joined: 46, capacity: 80, fund: "企业权益", budget: 0, used: 0, perCap: 0, personalFund: false, selfPay: false, rights: "企业沙龙 1 场", status: "待审核" },
    { id: "活动-2026-010", name: "冬日健康市集", mode: "公开活动", type: "健康市集", project: "公开活动", start: "2026-12-12", end: "2026-12-13", signupEnd: "2026-12-10", joined: 0, capacity: 500, fund: "个人自费", budget: 0, used: 0, perCap: 0, personalFund: false, selfPay: true, rights: "", status: "草稿" }
  ];

  function head() {
    return `<div class="page-head"><div><p class="page-eyebrow">ACTIVITY MANAGEMENT</p><h2>活动管理</h2><p class="checkin-sub">项目活动面向企康学员，公开活动支持独立报名；活动资金可选企业公共资金、个人额度或自费</p></div><div class="page-actions"><button class="btn" data-activity-export>${icon("download")}导出活动</button><button class="btn primary" data-activity-new>${icon("plus")}新建活动</button></div></div>`;
  }
  function setTop() {
    $("#topTitle").textContent = "活动管理";
    $("#breadcrumb").textContent = "内容管理 / 活动管理";
    $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.nav === "activities"));
  }
  function open(html) {
    $("#drawerBody").innerHTML = html;
    $("#drawer").classList.add("open");
    $("#drawer").setAttribute("aria-hidden", "false");
    $("#drawerBackdrop").classList.add("open");
  }
  function toast(text) {
    const t = $("#toast"); t.textContent = text; t.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2100);
  }
  function statusTone(s) { return s === "报名中" || s === "进行中" ? "green" : s === "待审核" ? "gold" : s === "已结束" || s === "已取消" ? "slate" : "blue"; }
  function filterList() {
    return activities.filter(a => (mode === "项目活动" ? a.mode === "项目活动" : a.mode === "公开活动") && (status === "全部状态" || a.status === status) && (!query || (a.name + a.project + a.type).includes(query)));
  }
  function render() {
    const list = filterList();
    $("#viewRoot").innerHTML = `<div class="page">${head()}
      <div class="kpi-grid four">${kpi("calendar", "项目活动", activities.filter(a => a.mode === "项目活动").length, "场", "面向企康学员", "#2f6bff")}${kpi("users", "公开活动", activities.filter(a => a.mode === "公开活动").length, "场", "独立公开报名", "#16a394")}${kpi("check", "累计报名", activities.reduce((n, a) => n + a.joined, 0), "人", "全部活动", "#8b5cf6")}${kpi("chart", "公共资金预算", "¥58,800", "元", "企业公共资金活动", "#e8a13c")}</div>
      <div class="filter-bar"><div class="recipe-mode-tabs"><button class="${mode === "项目活动" ? "active" : ""}" data-activity-mode="项目活动">项目活动<b>${activities.filter(a => a.mode === "项目活动").length}</b></button><button class="${mode === "公开活动" ? "active" : ""}" data-activity-mode="公开活动">公开活动<b>${activities.filter(a => a.mode === "公开活动").length}</b></button></div><label class="filter-search"><svg class="ic"><use href="#i-search"/></svg><input id="activitySearch" value="${esc(query)}" placeholder="搜索活动、项目或类型" /></label><select class="filter-select" id="activityStatus"><option>全部状态</option>${[...new Set(activities.map(a => a.status))].map(s => `<option${status === s ? " selected" : ""}>${s}</option>`).join("")}</select></div>
      <section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>活动</th><th>模式</th><th>所属项目</th><th>活动时间</th><th>报名 / 上限</th><th>资金来源</th><th>预算 / 已用</th><th>状态</th><th></th></tr></thead><tbody>${list.map(a => `<tr><td><b class="cell-main">${esc(a.name)}</b><span class="cell-sub">${esc(a.id)} · ${esc(a.type)}</span></td><td>${tag(a.mode, a.mode === "项目活动" ? "blue" : "purple")}</td><td>${esc(a.project)}</td><td>${esc(a.start)} — ${esc(a.end)}<span class="cell-sub">报名截止 ${esc(a.signupEnd)}</span></td><td><b class="cell-main">${a.joined}</b> / ${a.capacity}</td><td>${tag(a.fund, a.fund === "企业公共资金" ? "green" : a.fund === "企业权益" ? "purple" : a.fund === "个人自费" ? "gold" : "blue")}</td><td>${a.budget ? "¥" + a.budget.toLocaleString("zh-CN") + " / ¥" + a.used.toLocaleString("zh-CN") : "权益 / 自费"}</td><td>${tag(a.status, statusTone(a.status))}</td><td><button class="panel-link" data-activity-view="${a.id}">查看 →</button></td></tr>`).join("")}</tbody></table></div></section></div>`;
    setTop();
    $$("[data-activity-mode]").forEach(b => b.addEventListener("click", () => { mode = b.dataset.activityMode; render(); }));
    $("#activitySearch").addEventListener("input", e => { query = e.target.value.trim(); render(); });
    $("#activityStatus").addEventListener("change", e => { status = e.target.value; render(); });
    $$("[data-activity-view]").forEach(b => b.addEventListener("click", () => viewActivity(activities.find(a => a.id === b.dataset.activityView))));
    $$("[data-activity-new]").forEach(b => b.addEventListener("click", () => editActivity(null)));
    $$("[data-activity-export]").forEach(b => b.addEventListener("click", () => toast("活动清单导出任务已创建")));
  }
  function kpi(iconName, label, value, unit, sub, color) {
    return `<article class="kpi-card" style="--kpi:${color};--kpi-soft:${color}18"><span class="kpi-icon">${icon(iconName)}</span><div class="kpi-label">${label}</div><div class="kpi-num">${value}<small>${unit}</small></div><div class="kpi-sub">${sub}</div></article>`;
  }
  function viewActivity(a) {
    if (!a) return;
    open(`<p class="page-eyebrow">ACTIVITY DETAIL</p><h2>${esc(a.name)}</h2><p class="drawer-sub">${esc(a.id)} · ${esc(a.mode)} · ${esc(a.status)}</p>
      <div class="drawer-section"><div class="info-list"><div class="info-item"><small>所属项目</small><b>${esc(a.project)}</b></div><div class="info-item"><small>活动类型</small><b>${esc(a.type)}</b></div><div class="info-item"><small>活动时间</small><b>${esc(a.start)} — ${esc(a.end)}</b></div><div class="info-item"><small>报名截止</small><b>${esc(a.signupEnd)}</b></div><div class="info-item"><small>报名 / 上限</small><b>${a.joined} / ${a.capacity}</b></div><div class="info-item"><small>活动状态</small><b>${esc(a.status)}</b></div></div></div>
      <div class="drawer-section"><h3>资金方案</h3><div class="info-list"><div class="info-item"><small>资金来源</small><b>${esc(a.fund)}</b></div><div class="info-item"><small>活动预算</small><b>${a.budget ? "¥" + a.budget.toLocaleString("zh-CN") : "—"}</b></div><div class="info-item"><small>已使用</small><b>${a.used ? "¥" + a.used.toLocaleString("zh-CN") : "—"}</b></div><div class="info-item"><small>单人限额</small><b>${a.perCap ? "¥" + a.perCap : "—"}</b></div><div class="info-item"><small>个人企康额度</small><b>${a.personalFund ? "可使用" : "不可用"}</b></div><div class="info-item"><small>个人自费</small><b>${a.selfPay ? "可补差" : "不支持"}</b></div></div></div>
      <div class="drawer-section"><h3>报名与参与</h3><div class="simple-recipe-products"><div class="package-service-line"><div><b>报名人数</b><small>已报名 ${a.joined} 人</small></div><span>${a.joined}/${a.capacity}</span></div><div class="package-service-line"><div><b>公开链接</b><small>${a.mode === "公开活动" ? "生成独立 H5 活动页" : "项目内可见，不对外公开"}</small></div><span>${a.mode === "公开活动" ? "复制链接" : "项目内"}</span></div></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>关闭</button><button class="btn primary" data-activity-edit="${a.id}">编辑活动</button></div>`);
    $("[data-activity-edit]")?.addEventListener("click", () => editActivity(a));
  }
  function editActivity(a) {
    const activity = a || { name: "", mode: mode, type: "健康讲座", project: "五好生活", start: "2026-12-01", end: "2026-12-01", signupEnd: "2026-11-28", joined: 0, capacity: 100, fund: "企业公共资金", budget: 0, used: 0, perCap: 200, personalFund: true, selfPay: true, rights: "", status: "草稿" };
    open(`<p class="page-eyebrow">ACTIVITY EDITOR</p><h2>${a ? "编辑活动" : "新建活动"}</h2><p class="drawer-sub">项目活动或公开活动 · 简单配置即可运营</p>
      <div class="drawer-section"><div class="publish-form"><label class="field"><span>活动名称</span><input id="activityName" value="${esc(activity.name)}" /></label><label class="field"><span>活动模式</span><select id="activityMode"><option${activity.mode === "项目活动" ? " selected" : ""}>项目活动</option><option${activity.mode === "公开活动" ? " selected" : ""}>公开活动</option></select></label><label class="field"><span>活动类型</span><input id="activityType" value="${esc(activity.type)}" /></label><label class="field"><span>所属项目</span><select id="activityProject"><option${activity.project === "五好生活" ? " selected" : ""}>五好生活</option>${D.projects.map(p => `<option${activity.project === p.name ? " selected" : ""}>${esc(p.name)}</option>`).join("")}<option${activity.project === "公开活动" ? " selected" : ""}>公开活动</option></select></label><label class="field"><span>开始日期</span><input id="activityStart" type="date" value="${esc(activity.start)}" /></label><label class="field"><span>结束日期</span><input id="activityEnd" type="date" value="${esc(activity.end)}" /></label><label class="field"><span>报名截止</span><input id="activitySignup" type="date" value="${esc(activity.signupEnd)}" /></label><label class="field"><span>人数上限</span><input id="activityCapacity" type="number" value="${activity.capacity}" /></label></div></div>
      <div class="drawer-section"><h3>资金方案</h3><div class="publish-form"><label class="field"><span>资金来源</span><select id="activityFund">${["企业公共资金", "企业权益", "员工个人额度", "个人自费"].map(f => `<option${activity.fund === f ? " selected" : ""}>${f}</option>`).join("")}</select></label><label class="field"><span>活动预算</span><input id="activityBudget" type="number" value="${activity.budget || ""}" placeholder="企业公共资金预算" /></label><label class="field"><span>单人限额</span><input id="activityPerCap" type="number" value="${activity.perCap || ""}" /></label><label class="field"><span>权益包</span><input id="activityRights" value="${esc(activity.rights || "")}" placeholder="例如：专家公开课 1 场" /></label><label class="field"><span>个人企康额度</span><select id="activityPersonal"><option${activity.personalFund ? " selected" : ""}>允许使用</option><option${!activity.personalFund ? " selected" : ""}>不可用</option></select></label><label class="field"><span>个人自费</span><select id="activitySelf"><option${activity.selfPay ? " selected" : ""}>允许补差</option><option${!activity.selfPay ? " selected" : ""}>不支持</option></select></label></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-activity-save="${a ? a.id : ""}">保存活动</button></div>`);
    $("[data-activity-save]")?.addEventListener("click", () => { toast(a ? "活动已更新" : "活动已创建"); $("#drawer").classList.remove("open"); $("#drawerBackdrop").classList.remove("open"); });
  }
  window.AdminActivity = { render };
})();
