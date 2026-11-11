/* =========================================================
   订单中心 · 预约 / 兑换 / 领奖 / 服务包
   ========================================================= */

(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const tag = (s, tone) => `<span class="tag ${tone || ""}">${esc(s)}</span>`;
  const money = v => "¥" + Number(v || 0).toLocaleString("zh-CN");
  const setTop = (title, crumb, nav) => {
    $("#topTitle").textContent = title;
    $("#breadcrumb").textContent = crumb;
    $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.nav === nav));
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const openDrawer = html => {
    $("#drawerBody").innerHTML = html;
    $("#drawer").classList.add("open");
    $("#drawer").setAttribute("aria-hidden", "false");
    $("#drawerBackdrop").classList.add("open");
  };
  const toast = text => {
    const t = $("#toast"); if (!t) return;
    t.textContent = text; t.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1900);
  };

  const rows = [
    { id: "BK20261106001", type: "服务预约", name: "林悦", dept: "研发中心", item: "职工年度体检", detail: "2026-11-07 08:30", amount: "积分/权益", channel: "职工健康 H5", status: "已确认", date: "2026-11-06", supplier: "北大医疗健康管理中心", upstream: 0, downstream: 838, invoice: "无需开票" },
    { id: "BK20261106002", type: "服务预约", name: "陈嘉禾", dept: "市场部", item: "深度报告解读", detail: "2026-11-07 14:00", amount: "积分/权益", channel: "职工健康 H5", status: "待处理", date: "2026-11-06", supplier: "北大医疗健康管理中心", upstream: 186, downstream: 454, invoice: "未开票" },
    { id: "BK20261105008", type: "服务预约", name: "周雯", dept: "财务部", item: "无痛胃肠镜检查", detail: "2026-11-08 10:00", amount: "积分/权益", channel: "职工健康 H5", status: "已确认", date: "2026-11-05", supplier: "华大医学检验实验室", upstream: 420, downstream: 756, invoice: "未开票" },
    { id: "BK20261105007", type: "服务预约", name: "徐一鸣", dept: "生产部", item: "五高一重管理服务", detail: "2026-11-09 15:30", amount: "积分/权益", channel: "职工健康 H5", status: "已完成", date: "2026-11-05", supplier: "北大医疗健康管理中心", upstream: 398, downstream: 698, invoice: "已开票" },
    { id: "BK20261104012", type: "服务预约", name: "何雨桐", dept: "人力资源部", item: "职场急救培训服务", detail: "2026-11-10 14:00", amount: "积分/权益", channel: "职工健康 H5", status: "已确认", date: "2026-11-04", supplier: "远健运动康复中心", upstream: 120, downstream: 260, invoice: "未开票" },
    { id: "BK20261104011", type: "服务预约", name: "赵启明", dept: "法务部", item: "专家线上二次诊疗咨询", detail: "2026-11-08 08:30", amount: "积分/权益", channel: "职工健康 H5", status: "已取消", date: "2026-11-04", supplier: "云诊互联网医院", upstream: 0, downstream: 0, invoice: "无需开票" },
    { id: "BK20261103004", type: "服务预约", name: "吴倩", dept: "设计部", item: "心理健康管理服务（EAP）", detail: "2026-11-07 10:00", amount: "积分/权益", channel: "职工健康 H5", status: "已完成", date: "2026-11-03", supplier: "北大医疗健康管理中心", upstream: 210, downstream: 480, invoice: "已开票" },
    { id: "BK20261102003", type: "商品", name: "孙宁", dept: "销售部", item: "深海鱼油 90 粒", detail: "顺丰发货 · 1 件", amount: "200 积分 + ¥9.90", channel: "积分商城", status: "已完成", date: "2026-11-02", supplier: "营养品供应链", upstream: 210, downstream: 268, invoice: "已开票" },
    { id: "BK20261102002", type: "服务包", name: "林悦", dept: "研发中心", item: "五好生活 · 年度会员", detail: "PKG-FG-01 · 5 项服务", amount: "¥6,980", channel: "职工健康 H5", status: "已确认", date: "2026-11-02", supplier: "北大医疗健康管理中心", upstream: 5200, downstream: 6980, invoice: "未开票" },
    { id: "BK20261101001", type: "积分兑换", name: "陈嘉禾", dept: "市场部", item: "乳清蛋白粉 750g", detail: "积分兑换 · 1 件", amount: "200 积分 + ¥9.90", channel: "积分商城", status: "待处理", date: "2026-11-01", supplier: "营养品供应链", upstream: 168, downstream: 328, invoice: "未开票" },
    { id: "BK20261031006", type: "领奖", name: "周雯", dept: "财务部", item: "连续打卡 28 天奖励", detail: "健康礼包 · 1 份", amount: "免费", channel: "打卡活动", status: "已完成", date: "2026-10-31", supplier: "健康商城供应链", upstream: 58, downstream: 0, invoice: "无需开票" },
    { id: "BK20261030005", type: "服务包", name: "徐一鸣", dept: "生产部", item: "五高一重 · 12 周共管", detail: "PKG-CHR-03 · 4 项服务", amount: "¥4,980", channel: "企康顾问", status: "待处理", date: "2026-10-30", supplier: "北大医疗健康管理中心", upstream: 3980, downstream: 4980, invoice: "未开票" }
  ];

  const verification = {
    "BK20261106001": { verify: "已核销", consumed: 838, count: 1 },
    "BK20261106002": { verify: "未核销", consumed: 0, count: 0 },
    "BK20261105008": { verify: "未核销", consumed: 0, count: 0 },
    "BK20261105007": { verify: "已核销", consumed: 698, count: 1 },
    "BK20261104012": { verify: "未核销", consumed: 0, count: 0 },
    "BK20261104011": { verify: "未核销", consumed: 0, count: 0 },
    "BK20261103004": { verify: "已核销", consumed: 480, count: 1 },
    "BK20261102003": { verify: "已核销", consumed: 268, count: 1 },
    "BK20261102002": { verify: "部分核销", consumed: 210, count: 2 },
    "BK20261101001": { verify: "未核销", consumed: 0, count: 0 },
    "BK20261031006": { verify: "已核销", consumed: 0, count: 1 },
    "BK20261030005": { verify: "未核销", consumed: 0, count: 0 }
  };
  rows.forEach(r => Object.assign(r, verification[r.id] || { verify: "未核销", consumed: 0, count: 0 }));

  const tabs = [["全部", 31], ["服务预约", 12], ["商品", 7], ["积分兑换", 5], ["领奖", 4], ["服务包", 3]];
  const statuses = ["全部状态", "待处理", "已确认", "已完成", "已取消"];
  let tab = "全部";
  let status = "全部状态";
  let verifyFilter = "全部核销";
  let q = "";

  function renderOrders() {
    const filtered = rows.filter(r => (tab === "全部" || r.type === tab) && (status === "全部状态" || r.status === status) && (verifyFilter === "全部核销" || r.verify === verifyFilter) && (!q || (r.id + r.name + r.dept + r.item).toLowerCase().includes(q.toLowerCase())));
    const html = `<div class="page-head order-head"><div><p class="page-eyebrow">ORDER CENTER</p><h2>订单中心</h2><p class="order-sub">预约 / 兑换 / 领奖三类订单统一检索与处理</p></div><div class="page-actions"><button class="btn" data-toast="订单已导出">${icon("download")}导出订单</button></div></div>
      <div class="kpi-grid four">${kpiLocal("check", "订单总数", "31", "单", "今日新增 6 单", "#2f6bff")}${kpiLocal("project", "待处理", "11", "单", "超 48h 未处理 2 单", "#e8a13c")}${kpiLocal("chart", "本月成交额", "42.8", "万", "预约类按标准价折算", "#16a394")}${kpiLocal("heart", "取消率", "3.2", "%", "较上月 -0.8pt", "#e15b64")}</div>
      <div class="order-toolbar"><div class="order-tabs">${tabs.map(([t, count]) => `<button class="${tab === t ? "active" : ""}" data-order-tab="${t}">${t}<b>${count}</b></button>`).join("")}</div><label class="filter-search order-search">${icon("search")}<input id="orderSearch" value="${esc(q)}" placeholder="搜索订单号 / 姓名" /></label></div>
      <div class="order-status-tabs">${statuses.map(s => `<button class="${status === s ? "active" : ""}" data-order-status="${s}">${s}</button>`).join("")}<label class="order-verify">核销 <select id="orderVerify">${["全部核销", "已核销", "部分核销", "未核销"].map(v => `<option${verifyFilter === v ? " selected" : ""}>${v}</option>`).join("")}</select></label><span class="tag blue">全渠道订单 · 360 档案 · 服务轨迹</span></div>
      <section class="panel order-panel"><div class="table-wrap"><table class="data-table order-table"><thead><tr><th>订单号</th><th>类型</th><th>客户</th><th>商品 / 服务</th><th>金额</th><th>核销</th><th>来源渠道</th><th>状态</th><th>时间</th><th></th></tr></thead><tbody>${filtered.map(r => `<tr class="clickable" data-order-v5="${r.id}"><td><b class="cell-main">${esc(r.id)}</b></td><td>${tag(r.type, r.type === "服务预约" ? "blue" : r.type === "商品" ? "green" : r.type === "积分兑换" ? "gold" : r.type === "服务包" ? "purple" : "slate")}</td><td><span class="person-cell"><span class="avatar avatar-sm">${esc(r.name.slice(0, 1))}</span><span><b>${esc(r.name)}</b><small>${esc(r.dept)}</small></span></span></td><td><b class="cell-main">${esc(r.item)}</b><span class="cell-sub">${esc(r.detail)}</span></td><td>${esc(r.amount)}</td><td>${tag(r.verify, r.verify === "已核销" ? "green" : r.verify === "部分核销" ? "gold" : "slate")}<span class="cell-sub">${r.count} 笔消费</span></td><td>${esc(r.channel)}</td><td>${tag(r.status, r.status === "已完成" || r.status === "已确认" ? "green" : r.status === "已取消" ? "slate" : "gold")}</td><td>${esc(r.date)}</td><td class="order-arrow">›</td></tr>`).join("")}</tbody></table></div></section>`;
    $("#viewRoot").innerHTML = html;
    setTop("订单中心", "交易管理 / 订单中心", "orders");
    $$("[data-order-tab]").forEach(b => b.addEventListener("click", () => { tab = b.dataset.orderTab; renderOrders(); }));
    $$("[data-order-status]").forEach(b => b.addEventListener("click", () => { status = b.dataset.orderStatus; renderOrders(); }));
    const search = $("#orderSearch");
    if (search) search.addEventListener("input", () => { q = search.value.trim(); renderOrders(); });
    const verify = $("#orderVerify");
    if (verify) verify.addEventListener("change", () => { verifyFilter = verify.value; renderOrders(); });
    $$("[data-order-v5]").forEach(tr => tr.addEventListener("click", () => openOrder(tr.dataset.orderV5)));
  }

  function openOrder(id) {
    const o = rows.find(r => r.id === id); if (!o) return;
    openDrawer(`<p class="page-eyebrow">ORDER DETAIL</p><h2>${esc(o.id)}</h2><p class="drawer-sub">${esc(o.name)} · ${esc(o.dept)} · ${esc(o.type)}</p>
      <div class="drawer-section"><div class="info-list"><div class="info-item"><small>商品 / 服务</small><b>${esc(o.item)}</b></div><div class="info-item"><small>订单金额</small><b>${esc(o.amount)}</b></div><div class="info-item"><small>来源渠道</small><b>${esc(o.channel)}</b></div><div class="info-item"><small>下单时间</small><b>${esc(o.date)}</b></div></div></div>
      <div class="drawer-section"><h3>上下游结算</h3><div class="info-list"><div class="info-item"><small>供应商</small><b>${esc(o.supplier)}</b></div><div class="info-item"><small>上游结算</small><b>${money(o.upstream)}</b></div><div class="info-item"><small>下游结算</small><b>${money(o.downstream)}</b></div><div class="info-item"><small>订单毛利</small><b class="margin-positive">${money(o.downstream - o.upstream)}</b></div><div class="info-item"><small>开票状态</small><b>${esc(o.invoice)}</b></div></div></div>
      <div class="drawer-section"><h3>关联消费与核销</h3><div class="info-list"><div class="info-item"><small>核销状态</small><b>${esc(o.verify)}</b></div><div class="info-item"><small>已核销金额</small><b>${money(o.consumed)}</b></div><div class="info-item"><small>关联消费明细</small><b>${o.count} 笔</b></div><div class="info-item"><small>未核销金额</small><b>${o.downstream > o.consumed ? money(o.downstream - o.consumed) : "—"}</b></div></div><div class="notice" style="margin-top:8px">订单仅代表线上购买或预约，只有服务完成并核销的消费明细才进入结算。</div><a class="btn small" href="#财务结算/消费明细" style="margin-top:8px">查看消费明细 →</a></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>关闭</button><a class="btn primary" href="#财务结算/消费明细">去消费明细 / 结算 →</a></div>`);
  }

  function kpiLocal(iconName, label, value, unit, sub, color) {
    return `<article class="kpi-card" style="--kpi:${color};--kpi-soft:${color}18"><span class="kpi-icon">${icon(iconName)}</span><div class="kpi-label">${label}</div><div class="kpi-num">${value}<small>${unit || ""}</small></div><div class="kpi-sub">${sub}</div></article>`;
  }

  if (window.AdminFiveGood) window.AdminFiveGood.orders = renderOrders;
})();
