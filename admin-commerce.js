/* =========================================================
   服务包与组合 / 价格与政策
   ========================================================= */

(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const tag = (s, tone) => `<span class="tag ${tone || ""}">${esc(s)}</span>`;
  const money = v => "¥" + Number(v || 0).toLocaleString("zh-CN", { maximumFractionDigits: 0 });
  const setTop = (title, crumb, nav) => {
    $("#topTitle").textContent = title;
    $("#breadcrumb").textContent = crumb;
    $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.nav === nav));
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const toast = text => {
    const t = $("#toast"); if (!t) return;
    t.textContent = text; t.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1900);
  };
  const openDrawer = html => {
    $("#drawerBody").innerHTML = html;
    $("#drawer").classList.add("open");
    $("#drawer").setAttribute("aria-hidden", "false");
    $("#drawerBackdrop").classList.add("open");
  };
  const closeDrawer = () => {
    $("#drawer").classList.remove("open");
    $("#drawer").setAttribute("aria-hidden", "true");
    $("#drawerBackdrop").classList.remove("open");
  };
  const pageHead = (title, eyebrow, actions) => `<div class="page-head"><div><p class="page-eyebrow">${eyebrow}</p><h2>${title}</h2></div><div class="page-actions">${actions || ""}</div></div>`;

  const services = [
    { name: "职工年度体检", category: "健康筛查", cost: 3190, settle: 6140, list: 8380, agreement: 5650, margin: 48, unitCost: 720 },
    { name: "检后管理 · 深度报告解读", category: "健康筛查", cost: 1860, settle: 3410, list: 4540, agreement: 3140, margin: 45, unitCost: 860 },
    { name: "健康风险调研问卷", category: "健康筛查", cost: 3320, settle: 6980, list: 8660, agreement: 6420, margin: 52, unitCost: 620 },
    { name: "住院体检服务", category: "健康筛查", cost: 3350, settle: 5220, list: 6990, agreement: 4800, margin: 36, unitCost: 1120 },
    { name: "重症筛查服务", category: "健康筛查", cost: 2150, settle: 3790, list: 4620, agreement: 3490, margin: 43, unitCost: 640 },
    { name: "心肺运动 CPET 筛查", category: "健康筛查", cost: 3450, settle: 5190, list: 7100, agreement: 4770, margin: 34, unitCost: 980 },
    { name: "医疗级多导睡眠监测", category: "睡眠筛查", cost: 2880, settle: 4600, list: 5900, agreement: 4230, margin: 37, unitCost: 760 },
    { name: "无痛胃肠镜检查", category: "专项筛查", cost: 4200, settle: 6500, list: 7560, agreement: 5980, margin: 42, unitCost: 1280 }
  ];

  const packages = [
    { id: "PKG-FG-01", name: "五好生活 · 年度会员", audience: "企业员工 / 个人", serviceCount: 5, price: 6980, settle: 5200, margin: 40, status: "在售", desc: "吃好、睡好、动好、心好、查好，一年期全维度健康管理会员。", members: 186, includes: [["职工年度体检", "健康筛查 · 标准版", 8380, "1 次"], ["检后管理 · 深度报告解读", "健康筛查 · 标准版", 4540, "1 次"], ["健康风险调研问卷", "健康筛查 · 标准版", 8660, "1 次"], ["住院体检服务", "健康筛查 · 标准版", 6990, "1 次"], ["无痛胃肠镜检查", "健康筛查 · 标准版", 7560, "1 次"]] },
    { id: "PKG-SCR-02", name: "职工年度体检 + 检后管理", audience: "企业团检", serviceCount: 3, price: 1680, settle: 1280, margin: 44, status: "在售", desc: "体检 + 报告解读 + 异常复查转诊，企业团检主力包。", members: 1240, includes: [["职工年度体检", "健康筛查 · 标准版", 8380, "1 次"], ["检后管理 · 深度报告解读", "健康筛查 · 标准版", 4540, "1 次"], ["异常复查转诊", "就医服务", 1200, "1 次"]] },
    { id: "PKG-CHR-03", name: "五高一重 · 12 周共管", audience: "高风险人群", serviceCount: 4, price: 4980, settle: 3980, margin: 46, status: "在售", desc: "评估 + 12 周干预 + 复测 + 结营报告。", members: 86, includes: [["五高一重风险评估", "慢病管理", 980, "1 次"], ["12 周营养与运动干预", "慢病管理", 3200, "12 周"], ["体成分复测", "健康监测", 680, "2 次"], ["结营健康报告", "健康管理", 800, "1 次"]] },
    { id: "PKG-VIP-04", name: "企业家尊享年度", audience: "企业家 / 高管", serviceCount: 7, price: 28800, settle: 23800, margin: 39, status: "草稿", desc: "专属管家 + 深度体检 + 全球就医协助。", members: 18, includes: [["深度体检", "健康筛查", 12800, "1 次"], ["专属健康管家", "健康管理", 9800, "全年"], ["全球就医协助", "就医服务", 6800, "1 次"], ["睡眠与心理评估", "睡眠 / 心理", 3200, "各 1 次"]] }
  ];

  function margin(price, settle) {
    return Math.round((price - settle) / price * 100);
  }

  function renderPackages() {
    const active = packages.filter(p => p.status === "在售");
    const html = `${pageHead("服务包与组合", "SERVICE PACKAGES", `<button class="btn primary" data-new-package="1">${icon("plus")}新建服务包</button>`)}
      <div class="kpi-grid four">
        ${kpiLocal("grid", "在售服务包", active.length, "个", `共 ${packages.length} 个服务包`, "#2f6bff")}
        ${kpiLocal("chart", "平均毛利", "43", "%", "高于单品约 6pt", "#16a394")}
        ${kpiLocal("users", "五好生活会员", "186", "人", "进阶版占 62%", "#8b5cf6")}
      </div>
      <div class="package-grid">${packages.map(p => `<article class="package-card"><div class="package-card-head"><div><div class="package-title-row"><h3>${esc(p.name)}</h3>${tag(p.status, p.status === "在售" ? "green" : "gold")}</div><p>${esc(p.id)} · ${esc(p.audience)} · 含 ${p.serviceCount} 项服务</p></div><button class="package-edit" data-edit-package="${p.id}" aria-label="编辑服务包">${icon("edit")}</button></div><p class="package-desc">${esc(p.desc)}</p><div class="package-price-row"><div><small>售价</small><b>${money(p.price)}</b></div><div><small>结算价</small><b>${money(p.settle)}</b></div><div class="package-margin"><small>毛利</small><b>${p.margin || margin(p.price, p.settle)}%</b></div></div><div class="package-card-foot"><button class="btn small" data-view-package="${p.id}">查看组成</button>${p.name.includes("五好") ? `<a class="panel-link" href="#mall">五好运营 →</a>` : ""}</div></article>`).join("")}</div>`;
    $("#viewRoot").innerHTML = html;
    setTop("服务包与组合", "交易管理 / 服务包与组合", "packages");
    $$("[data-view-package]").forEach(b => b.addEventListener("click", () => showPackage(b.dataset.viewPackage)));
    $$("[data-edit-package]").forEach(b => b.addEventListener("click", () => editPackage(b.dataset.editPackage)));
    $$("[data-new-package]").forEach(b => b.addEventListener("click", () => editPackage("")));
  }

  function showPackage(id) {
    const p = packages.find(x => x.id === id); if (!p) return;
    const total = p.includes.reduce((n, s) => n + s[2], 0);
    openDrawer(`<p class="page-eyebrow">PACKAGE COMPOSITION</p><h2>${esc(p.name)}</h2><p class="drawer-sub">${esc(p.id)} · 含 ${p.serviceCount} 项服务</p>
      <div class="package-composition">${p.includes.map(s => `<div class="package-service-line"><div><b>${esc(s[0])}</b><small>${esc(s[1])} · 标准价 ${money(s[2])}</small></div><span>含 ${esc(s[3])}</span></div>`).join("")}</div>
      <div class="package-note">套餐价按结算价打包，单买合计 ${money(total)}，套餐价 ${money(p.price)}，为单买价的 ${Math.round(p.price / total * 100)}%。</div>
      <div class="drawer-actions"><button class="btn primary" data-close-drawer>知道了</button></div>`);
  }

  function editPackage(id) {
    const p = packages.find(x => x.id === id);
    openDrawer(`<p class="page-eyebrow">PACKAGE EDITOR</p><h2>${p ? "编辑服务包" : "新建服务包"}</h2><p class="drawer-sub">服务包组合与价格</p>
      <div class="drawer-section"><div class="publish-form"><label class="field"><span>服务包名称</span><input value="${esc(p ? p.name : "")}" /></label><label class="field"><span>适用人群</span><input value="${esc(p ? p.audience : "")}" /></label><label class="field"><span>售价</span><input type="number" value="${p ? p.price : ""}" /></label><label class="field"><span>结算价</span><input type="number" value="${p ? p.settle : ""}" /></label><label class="field full"><span>服务包说明</span><textarea rows="3">${esc(p ? p.desc : "")}</textarea></label><label class="field full"><span>包含服务</span><input value="${esc(p ? p.includes.map(x => x[0]).join("、") : "")}" placeholder="选择或填写服务" /></label></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-toast="服务包已保存">保存</button></div>`);
  }

  function renderPricing() {
    const rows = services.map(s => ({ ...s, margin: s.margin || margin(s.list, s.cost) }));
    const html = `${pageHead("价格与政策", "PRICING & POLICY", `<button class="btn" data-toast="价格表已导出">${icon("download")}导出价格表</button><button class="btn primary" data-toast="调价申请已发起">${icon("chart")}发起调价</button>`)}
      <div class="kpi-grid four">${kpiLocal("chart", "平均毛利率", "40", "%", "目标 ≥30%", "#2f6bff")}${kpiLocal("check", "低毛利商品", "0", "个", "低于 25%，建议复核成本", "#16a394")}${kpiLocal("users", "协议价客户", "3", "家", "平均折扣 92 折", "#8b5cf6")}${kpiLocal("calendar", "年度调价", "2", "次", "最近 2026-09-01", "#e8a13c")}</div>
      <div class="pricing-layout"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">价格总表</h3><p class="panel-sub">标准版口径</p></div><span class="tag blue">${rows.length} 项服务</span></div><div class="table-wrap"><table class="data-table pricing-table"><thead><tr><th>服务</th><th>成本</th><th>结算价</th><th>挂牌价</th><th>协议价</th><th>毛利率</th></tr></thead><tbody>${rows.map(s => `<tr><td><b class="cell-main">${esc(s.name)}</b><span class="cell-sub">${esc(s.category)}</span></td><td>${money(s.cost)}</td><td>${money(s.settle)}</td><td><b class="cell-main">${money(s.list)}</b></td><td>${money(s.agreement)}</td><td><span class="tag ${s.margin >= 40 ? "green" : "gold"}">${s.margin}%</span></td></tr>`).join("")}</tbody></table></div></section>
        <aside class="panel pricing-calculator"><div class="panel-head"><div><h3 class="panel-title">毛利测算</h3><p class="panel-sub">快速试算</p></div></div><div class="panel-body"><label class="field"><span>服务</span><select id="priceService">${services.map((s, i) => `<option value="${i}">${esc(s.name)}</option>`).join("")}</select></label><label class="field"><span>成交价</span><input id="priceDeal" type="number" value="1280" /></label><label class="field"><span>数量</span><input id="priceQty" type="number" value="200" /></label><div class="price-calc-result"><div><span>单笔成本</span><b id="priceCost">¥720</b></div><div><span>单笔毛利</span><b class="margin-positive" id="priceUnitMargin">¥560</b></div><div><span>合计毛利</span><b id="priceTotalMargin">¥112,000</b></div></div><div class="price-calc-note">毛利率 <b id="priceMargin">43.8%</b>，高于同类目均值 32%</div></div></aside></div>`;
    $("#viewRoot").innerHTML = html;
    setTop("价格与政策", "交易管理 / 价格与政策", "pricing");
    const calculate = () => {
      const s = services[Number($("#priceService").value)] || services[0];
      const deal = Number($("#priceDeal").value || 0);
      const qty = Number($("#priceQty").value || 0);
      const cost = s.unitCost || Math.round(s.cost / 4);
      const unitMargin = deal - cost;
      const total = unitMargin * qty;
      $("#priceCost").textContent = money(cost);
      $("#priceUnitMargin").textContent = money(unitMargin);
      $("#priceTotalMargin").textContent = money(total);
      $("#priceMargin").textContent = deal ? (unitMargin / deal * 100).toFixed(1) + "%" : "—";
    };
    ["#priceService", "#priceDeal", "#priceQty"].forEach(sel => $(sel).addEventListener("input", calculate));
    calculate();
  }

  function kpiLocal(iconName, label, value, unit, sub, color) {
    return `<article class="kpi-card" style="--kpi:${color};--kpi-soft:${color}18"><span class="kpi-icon">${icon(iconName)}</span><div class="kpi-label">${label}</div><div class="kpi-num">${value}<small>${unit || ""}</small></div><div class="kpi-sub">${sub}</div></article>`;
  }

  window.AdminCommerce = { packages: renderPackages, pricing: renderPricing };
})();
