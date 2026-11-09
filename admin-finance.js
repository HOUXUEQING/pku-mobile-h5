/* =========================================================
   合作方管理 / 结算管理 / 开票记录
   ========================================================= */

(function () {
  "use strict";

  const D = window.ADMIN_DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const tag = (s, tone) => `<span class="tag ${tone || ""}">${esc(s)}</span>`;
  const money = v => "¥" + Number(v || 0).toLocaleString("zh-CN", { maximumFractionDigits: 2 });
  const pageHead = (title, eyebrow, actions) => `<div class="page-head"><div><p class="page-eyebrow">${eyebrow}</p><h2>${title}</h2></div><div class="page-actions">${actions || ""}</div></div>`;
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

  const businessParties = [
    { id: "BP001", name: "中石油华北分公司", type: "企业客户", contact: "刘经理", phone: "138****2190", projects: ["中石油华北员工减重健康营"], period: "2026-01-01 — 2026-12-31", settle: "月结 30 天", status: "合作中" },
    { id: "BP002", name: "金融街控股", type: "企业客户", contact: "周经理", phone: "139****7621", projects: ["金融街企业减重健康营"], period: "2026-03-01 — 2027-02-28", settle: "月结 30 天", status: "合作中" },
    { id: "BP003", name: "望京科技园", type: "园区客户", contact: "陈女士", phone: "137****8820", projects: ["望京科技园减重健康营"], period: "2026-06-01 — 2027-05-31", settle: "季结", status: "合作中" },
    { id: "BP004", name: "北京北大医疗康复医院", type: "机构客户", contact: "王主任", phone: "136****3308", projects: ["康复医院员工减重营"], period: "2026-05-01 — 2027-04-30", settle: "月结 45 天", status: "合作中" },
    { id: "BP005", name: "方园中心", type: "园区客户", contact: "赵老师", phone: "135****9012", projects: ["五好生活"], period: "2026-09-01 — 2027-08-31", settle: "季结", status: "合作中" }
  ];

  const providers = [
    { id: "SP001", name: "北大医疗健康管理中心", category: "健康管理", contact: "赵医生", phone: "138****1102", license: "医疗机构执业许可证", cycle: "月结", upstream: "按项目协议价", downstream: "按服务人次", status: "合作中" },
    { id: "SP002", name: "华大医学检验实验室", category: "医学检验", contact: "李经理", phone: "139****2218", license: "医学检验实验室资质", cycle: "月结", upstream: "检验项目成本价", downstream: "项目打包价", status: "合作中" },
    { id: "SP003", name: "安心营养科技", category: "营养服务", contact: "陈营养师", phone: "137****6721", license: "食品经营许可证", cycle: "月结", upstream: "营养师工时", downstream: "按人次结算", status: "合作中" },
    { id: "SP004", name: "远健运动康复中心", category: "运动康复", contact: "王教练", phone: "136****2210", license: "运动康复服务资质", cycle: "季结", upstream: "课程成本", downstream: "课程包价格", status: "合作中" },
    { id: "SP005", name: "云诊互联网医院", category: "互联网医疗", contact: "周医生", phone: "135****8802", license: "互联网医院执业许可", cycle: "月结", upstream: "问诊成本", downstream: "服务包价格", status: "暂停合作" }
  ];

  const settlements = [
    { id: "JS202610001", party: "中石油华北分公司", orders: 128, amount: 286400, upstream: 172000, downstream: 228000, margin: 58400, status: "待结算", invoice: "未开票", date: "2026-10-21" },
    { id: "JS202610002", party: "金融街控股", orders: 86, amount: 198600, upstream: 118000, downstream: 159000, margin: 39600, status: "待结算", invoice: "部分开票", date: "2026-10-20" },
    { id: "JS202610003", party: "望京科技园", orders: 42, amount: 96400, upstream: 58000, downstream: 76000, margin: 20400, status: "已结算", invoice: "已开票", date: "2026-10-18" },
    { id: "JS202610004", party: "方园中心", orders: 63, amount: 142800, upstream: 86000, downstream: 114000, margin: 28800, status: "待结算", invoice: "未开票", date: "2026-10-17" }
  ];

  const invoices = [
    { id: "INV202610001", settlement: "JS202609001", party: "金融街控股", title: "金融街控股股份有限公司", taxNo: "91110102MA01****8X", amount: 128000, date: "2026-10-08", status: "已开票" },
    { id: "INV202610002", settlement: "JS202609002", party: "中石油华北分公司", title: "中国石油天然气股份有限公司华北分公司", taxNo: "91120116MA0****21K", amount: 86000, date: "2026-10-12", status: "已开票" },
    { id: "INV202610003", settlement: "JS202610003", party: "望京科技园", title: "北京望京科技园有限公司", taxNo: "91110105MA0****62T", amount: 76000, date: "2026-10-18", status: "已开票" }
  ];

  const reconciliations = [
    { id: "REC20261021", date: "2026-10-21", channel: "职工健康 H5", internal: 128, internalAmount: 286400, external: 130, externalAmount: 286500, matched: 126, matchedAmount: 285800, diff: 2, status: "有差异", owner: "王琳" },
    { id: "REC20261020", date: "2026-10-20", channel: "积分商城", internal: 86, internalAmount: 198600, external: 86, externalAmount: 198600, matched: 86, matchedAmount: 198600, diff: 0, status: "已平账", owner: "王琳" },
    { id: "REC20261019", date: "2026-10-19", channel: "企业支付", internal: 42, internalAmount: 96400, external: 41, externalAmount: 95200, matched: 40, matchedAmount: 94800, diff: 1, status: "有差异", owner: "陈晓" },
    { id: "REC20261018", date: "2026-10-18", channel: "职工健康 H5", internal: 63, internalAmount: 142800, external: 63, externalAmount: 142800, matched: 63, matchedAmount: 142800, diff: 0, status: "已平账", owner: "王琳" }
  ];

  const differences = [
    { id: "DIF2026102101", type: "金额不符", order: "BK20261105008", channel: "职工健康 H5", internal: 7560, external: 7420, diff: -140, status: "待处理", owner: "王琳" },
    { id: "DIF2026102102", type: "长款", order: "BK20261106002", channel: "积分商城", internal: 4540, external: 4720, diff: 180, status: "待处理", owner: "陈晓" },
    { id: "DIF2026101901", type: "悬挂", order: "BK20261031006", channel: "企业支付", internal: 0, external: 1200, diff: 1200, status: "挂起待查", owner: "王琳" },
    { id: "DIF2026101801", type: "短款", order: "BK20261019003", channel: "职工健康 H5", internal: 499, external: 0, diff: -499, status: "处理中", owner: "陈晓" }
  ];

  let settlementModule = "对账管理";

  function renderBusiness() {
    const html = `${pageHead("业务方管理", "BUSINESS PARTNERS", `<button class="btn primary" data-party-new="1">${icon("plus")}新增业务方</button>`)}
      <div class="filter-bar"><span class="tag blue">业务方 ${businessParties.length}</span><span class="tag green">合作中 ${businessParties.filter(p => p.status === "合作中").length}</span></div>
      <section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>业务方</th><th>类型</th><th>联系人</th><th>合作项目</th><th>合同周期</th><th>结算方式</th><th>状态</th><th></th></tr></thead><tbody>${businessParties.map(p => `<tr><td><span class="cell-main">${esc(p.name)}</span><span class="cell-sub">${esc(p.id)}</span></td><td>${tag(p.type, "blue")}</td><td>${esc(p.contact)}<span class="cell-sub">${esc(p.phone)}</span></td><td>${p.projects.map(x => tag(x, "green")).join(" ")}</td><td>${esc(p.period)}</td><td>${esc(p.settle)}</td><td>${tag(p.status, p.status === "合作中" ? "green" : "gold")}</td><td><button class="panel-link" data-party-edit="${p.id}">编辑 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    $("#viewRoot").innerHTML = html;
    setTop("业务方管理", "合作方管理 / 业务方管理", "business-parties");
    $$("[data-party-edit]").forEach(b => b.addEventListener("click", () => openPartyEditor(b.dataset.partyEdit)));
    $$("[data-party-new]").forEach(b => b.addEventListener("click", () => openPartyEditor("")));
  }

  function openPartyEditor(id) {
    const p = businessParties.find(x => x.id === id);
    openDrawer(`<p class="page-eyebrow">BUSINESS PARTNER</p><h2>${p ? "编辑业务方" : "新增业务方"}</h2><p class="drawer-sub">业务方档案与合作协议</p>
      <div class="drawer-section"><div class="publish-form">
        <label class="field"><span>业务方名称</span><input value="${esc(p ? p.name : "")}" /></label><label class="field"><span>业务方类型</span><select><option>企业客户</option><option>园区客户</option><option>机构客户</option></select></label>
        <label class="field"><span>联系人</span><input value="${esc(p ? p.contact : "")}" /></label><label class="field"><span>联系电话</span><input value="${esc(p ? p.phone : "")}" /></label>
        <label class="field"><span>合同周期</span><input value="${esc(p ? p.period : "")}" /></label><label class="field"><span>结算方式</span><input value="${esc(p ? p.settle : "")}" /></label>
        <label class="field full"><span>合作项目</span><input value="${esc(p ? p.projects.join("、") : "")}" /></label>
      </div></div><div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-toast="业务方已保存">保存</button></div>`);
  }

  function renderProviders() {
    const html = `${pageHead("服务商管理", "SERVICE PROVIDERS", `<button class="btn primary" data-provider-new="1">${icon("plus")}新增服务商</button>`)}
      <div class="filter-bar"><span class="tag blue">服务商 ${providers.length}</span><span class="tag green">合作中 ${providers.filter(p => p.status === "合作中").length}</span><span class="tag gold">资质审核</span></div>
      <section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>服务商</th><th>服务类别</th><th>联系人</th><th>资质</th><th>结算周期</th><th>上游结算</th><th>下游结算</th><th>状态</th><th></th></tr></thead><tbody>${providers.map(p => `<tr><td><span class="cell-main">${esc(p.name)}</span><span class="cell-sub">${esc(p.id)}</span></td><td>${tag(p.category, "blue")}</td><td>${esc(p.contact)}<span class="cell-sub">${esc(p.phone)}</span></td><td>${tag(p.license, "green")}</td><td>${esc(p.cycle)}</td><td>${esc(p.upstream)}</td><td>${esc(p.downstream)}</td><td>${tag(p.status, p.status === "合作中" ? "green" : "gold")}</td><td><button class="panel-link" data-provider-edit="${p.id}">编辑 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    $("#viewRoot").innerHTML = html;
    setTop("服务商管理", "合作方管理 / 服务商管理", "providers");
    $$("[data-provider-edit]").forEach(b => b.addEventListener("click", () => openProviderEditor(b.dataset.providerEdit)));
    $$("[data-provider-new]").forEach(b => b.addEventListener("click", () => openProviderEditor("")));
  }

  function openProviderEditor(id) {
    const p = providers.find(x => x.id === id);
    openDrawer(`<p class="page-eyebrow">SERVICE PROVIDER</p><h2>${p ? "编辑服务商" : "新增服务商"}</h2><p class="drawer-sub">服务资质、结算口径与供应商来源</p>
      <div class="drawer-section"><div class="publish-form">
        <label class="field"><span>服务商名称</span><input value="${esc(p ? p.name : "")}" /></label><label class="field"><span>服务类别</span><input value="${esc(p ? p.category : "")}" /></label>
        <label class="field"><span>联系人</span><input value="${esc(p ? p.contact : "")}" /></label><label class="field"><span>联系电话</span><input value="${esc(p ? p.phone : "")}" /></label>
        <label class="field"><span>资质</span><input value="${esc(p ? p.license : "")}" /></label><label class="field"><span>结算周期</span><input value="${esc(p ? p.cycle : "")}" /></label>
        <label class="field"><span>上游结算方式</span><input value="${esc(p ? p.upstream : "")}" /></label><label class="field"><span>下游结算方式</span><input value="${esc(p ? p.downstream : "")}" /></label>
      </div></div><div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-toast="服务商已保存">保存</button></div>`);
  }

  function renderSettlements() {
    const totalAmount = settlements.reduce((n, s) => n + s.amount, 0);
    const totalMargin = settlements.reduce((n, s) => n + s.margin, 0);
    const pending = settlements.filter(s => s.status === "待结算").length;
    const modules = ["对账管理", "差异处理", "结算单", "开票记录", "报表分析", "规则配置"];
    let content = "";

    if (settlementModule === "对账管理") {
      content = `<div class="settlement-note"><span class="tag blue">自动对账引擎</span> 按渠道流水与订单数据自动匹配 · 最近对账 2026-10-21 06:00</div>
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">对账单</h3><p class="panel-sub">日对账 · 支持按渠道、状态和日期筛选</p></div><button class="btn small" data-auto-recon="1">${icon("check")}执行自动对账</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>账单日期</th><th>渠道</th><th>内部订单</th><th>外部流水</th><th>匹配</th><th>差异</th><th>匹配率</th><th>状态</th><th></th></tr></thead><tbody>${reconciliations.map(r => `<tr><td><b class="cell-main">${esc(r.date)}</b><span class="cell-sub">${esc(r.id)}</span></td><td>${esc(r.channel)}</td><td>${r.internal} 笔<span class="cell-sub">${money(r.internalAmount)}</span></td><td>${r.external} 笔<span class="cell-sub">${money(r.externalAmount)}</span></td><td>${r.matched} 笔<span class="cell-sub">${money(r.matchedAmount)}</span></td><td class="${r.diff ? "danger-text" : ""}">${r.diff} 笔</td><td><b class="cell-main">${(r.matched / r.internal * 100).toFixed(1)}%</b></td><td>${tag(r.status, r.status === "已平账" ? "green" : "gold")}</td><td><button class="panel-link" data-recon-view="${r.id}">查看明细 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    } else if (settlementModule === "差异处理") {
      content = `<div class="settlement-note"><span class="tag red">差异处理工作流</span> 长款 / 短款 / 金额不符 / 悬挂 · 处理后自动留痕</div>
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">差异记录</h3><p class="panel-sub">支持人工处理、挂起待查、发起退款</p></div><span class="tag gold">待处理 ${differences.filter(d => d.status === "待处理").length}</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>差异号</th><th>类型</th><th>订单号</th><th>渠道</th><th>内部金额</th><th>外部金额</th><th>差异</th><th>状态</th><th>负责人</th><th></th></tr></thead><tbody>${differences.map(d => `<tr><td><b class="cell-main">${esc(d.id)}</b></td><td>${tag(d.type, d.type === "长款" ? "green" : d.type === "短款" ? "red" : "gold")}</td><td>${esc(d.order)}</td><td>${esc(d.channel)}</td><td>${money(d.internal)}</td><td>${money(d.external)}</td><td class="${d.diff < 0 ? "danger-text" : "margin-positive"}">${money(d.diff)}</td><td>${tag(d.status, d.status === "已处理" ? "green" : d.status === "挂起待查" ? "slate" : "gold")}</td><td>${esc(d.owner)}</td><td><button class="panel-link" data-diff-open="${d.id}">处理 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    } else if (settlementModule === "结算单") {
      content = `<div class="settlement-note"><span class="tag green">结算状态流转</span> 对账完成 → 生成结算单 → 确认收付款 → 开票归档</div>
        <section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>结算单号</th><th>业务方</th><th>订单数</th><th>订单金额</th><th>上游成本</th><th>下游结算</th><th>毛利</th><th>状态</th><th>开票状态</th><th></th></tr></thead><tbody>${settlements.map(s => `<tr><td><span class="cell-main">${esc(s.id)}</span><span class="cell-sub">${esc(s.date)}</span></td><td>${esc(s.party)}</td><td>${s.orders}</td><td><b class="cell-main">${money(s.amount)}</b></td><td>${money(s.upstream)}</td><td>${money(s.downstream)}</td><td><b class="margin-positive">${money(s.margin)}</b></td><td>${tag(s.status, s.status === "已结算" ? "green" : "gold")}</td><td>${tag(s.invoice, s.invoice === "已开票" ? "green" : s.invoice === "部分开票" ? "gold" : "slate")}</td><td>${s.status !== "已结算" ? `<button class="panel-link" data-settlement-confirm="${s.id}">确认收付款 →</button>` : s.invoice !== "已开票" ? `<button class="panel-link" data-invoice-open="${s.id}">开发票 →</button>` : `<button class="panel-link" data-invoice-view="${s.id}">查看发票 →</button>`}</td></tr>`).join("")}</tbody></table></div></section>`;
    } else if (settlementModule === "开票记录") {
      content = `<section class="panel"><div class="panel-head"><div><h3 class="panel-title">开票记录</h3></div><span class="tag green">${invoices.length} 张</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>发票号</th><th>结算单</th><th>业务方</th><th>发票抬头</th><th>税号</th><th>开票金额</th><th>开票日期</th><th>状态</th></tr></thead><tbody>${invoices.map(i => `<tr><td><b class="cell-main">${esc(i.id)}</b></td><td>${esc(i.settlement)}</td><td>${esc(i.party)}</td><td>${esc(i.title)}</td><td>${esc(i.taxNo)}</td><td><b class="cell-main">${money(i.amount)}</b></td><td>${esc(i.date)}</td><td>${tag(i.status, "green")}</td></tr>`).join("")}</tbody></table></div></section>`;
    } else if (settlementModule === "报表分析") {
      content = `<div class="settlement-report-grid"><section class="panel report-kpis"><div class="panel-head"><div><h3 class="panel-title">核心指标</h3></div><button class="panel-link" data-toast="对账报表已导出">导出报表 →</button></div><div class="panel-body"><div class="report-kpi-grid"><div><small>总笔数匹配率</small><b>99.2%</b><span class="tag green">达标</span></div><div><small>总金额匹配率</small><b>99.8%</b><span class="tag green">达标</span></div><div><small>差异处理时效</small><b>2.4h</b><span class="tag gold">待优化</span></div><div><small>本期结算金额</small><b>${money(totalAmount)}</b></div></div></div></section><section class="panel"><div class="panel-head"><div><h3 class="panel-title">渠道匹配情况</h3></div></div><div class="panel-body metric-bars">${[["职工健康 H5", 99, "99.0%"], ["积分商城", 100, "100%"], ["企业支付", 96, "96.0%"], ["线下转账", 92, "92.0%"]].map(([l, v, d]) => `<div class="metric-bar"><span>${l}</span><div class="bar"><i style="width:${v}%"></i></div><b>${d}</b></div>`).join("")}</div></section></div><section class="panel" style="margin-top:12px"><div class="panel-head"><div><h3 class="panel-title">审计追溯</h3></div><span class="tag blue">最近操作</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>操作时间</th><th>操作人</th><th>操作类型</th><th>对象</th><th>备注</th></tr></thead><tbody><tr><td>2026-10-21 09:18</td><td>王琳</td><td>自动对账</td><td>REC20261021</td><td>匹配 126 笔，2 笔差异</td></tr><tr><td>2026-10-20 17:42</td><td>陈晓</td><td>差异处理</td><td>DIF2026101901</td><td>挂起待查，等待渠道回执</td></tr><tr><td>2026-10-18 16:06</td><td>王琳</td><td>确认收款</td><td>JS202610003</td><td>已收款并归档</td></tr></tbody></table></div></section>`;
    } else {
      content = `<div class="settlement-report-grid"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">对账规则</h3></div><button class="btn small" data-toast="规则已新增">${icon("plus")}新增规则</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>规则名称</th><th>匹配字段</th><th>执行周期</th><th>差异阈值</th><th>状态</th></tr></thead><tbody><tr><td><b class="cell-main">订单号 + 金额</b></td><td>订单号、支付金额</td><td>每日 06:00</td><td>¥0</td><td><span class="tag green">启用</span></td></tr><tr><td><b class="cell-main">渠道流水号</b></td><td>流水号、渠道</td><td>每日 06:00</td><td>¥100</td><td><span class="tag green">启用</span></td></tr><tr><td><b class="cell-main">企业转账</b></td><td>付款方、金额</td><td>每周一</td><td>¥500</td><td><span class="tag gold">暂停</span></td></tr></tbody></table></div></section><section class="panel"><div class="panel-head"><div><h3 class="panel-title">角色权限</h3></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>角色</th><th>对账</th><th>差异处理</th><th>结算</th><th>开票</th></tr></thead><tbody><tr><td>财务管理员</td><td><span class="tag green">可操作</span></td><td><span class="tag green">可操作</span></td><td><span class="tag green">可操作</span></td><td><span class="tag green">可操作</span></td></tr><tr><td>运营督导</td><td><span class="tag blue">只读</span></td><td><span class="tag green">可操作</span></td><td><span class="tag blue">只读</span></td><td><span class="tag blue">只读</span></td></tr><tr><td>业务方</td><td><span class="tag blue">只读</span></td><td><span class="tag blue">只读</span></td><td><span class="tag blue">只读</span></td><td><span class="tag gold">受限</span></td></tr></tbody></table></div></section></div>`;
    }

    const html = `${pageHead("结算管理", "SETTLEMENT & RECONCILIATION", `<button class="btn" data-toast="结算数据已导出">${icon("download")}导出报表</button>`)}
      <div class="kpi-grid four">${kpiLocal("chart", "本期结算金额", money(totalAmount), "全部业务方", "#2f6bff")}${kpiLocal("check", "预计毛利", money(totalMargin), "下游 - 上游", "#16a394")}${kpiLocal("users", "待结算", pending, "笔", "#e8a13c")}${kpiLocal("heart", "待开票", settlements.filter(s => s.invoice !== "已开票").length, "笔", "#e15b64")}</div>
      <div class="checkin-tabs settlement-tabs">${modules.map(t => `<button class="${settlementModule === t ? "active" : ""}" data-settlement-module="${t}">${t}<b>${t === "对账管理" ? reconciliations.length : t === "差异处理" ? differences.length : t === "结算单" ? settlements.length : t === "开票记录" ? invoices.length : ""}</b></button>`).join("")}</div>
      ${content}`;
    $("#viewRoot").innerHTML = html;
    setTop("结算管理", "财务结算 / 结算管理", "settlements");
    const legacyRolePanel = $$(".panel").find(p => p.querySelector(".panel-title")?.innerText === "角色权限");
    if (legacyRolePanel) { const parent = legacyRolePanel.parentElement; legacyRolePanel.remove(); if (parent) parent.style.gridTemplateColumns = "1fr"; }
    $$("[data-settlement-module]").forEach(b => b.addEventListener("click", () => { settlementModule = b.dataset.settlementModule; renderSettlements(); }));
    $$("[data-invoice-open]").forEach(b => b.addEventListener("click", () => openInvoice(b.dataset.invoiceOpen)));
    $$("[data-invoice-view]").forEach(b => b.addEventListener("click", () => { settlementModule = "开票记录"; renderSettlements(); }));
    $$("[data-diff-open]").forEach(b => b.addEventListener("click", () => openDifference(b.dataset.diffOpen)));
    $$("[data-recon-view]").forEach(b => b.addEventListener("click", () => openReconciliation(b.dataset.reconView)));
    $$("[data-auto-recon]").forEach(b => b.addEventListener("click", () => { toast("自动对账完成：匹配 126 笔，发现 2 笔差异"); }));
    $$("[data-settlement-confirm]").forEach(b => b.addEventListener("click", () => { const s = settlements.find(x => x.id === b.dataset.settlementConfirm); if (s) s.status = "已结算"; toast("收付款已确认"); renderSettlements(); }));
  }

  function openReconciliation(id) {
    const r = reconciliations.find(x => x.id === id); if (!r) return;
    openDrawer(`<p class="page-eyebrow">RECONCILIATION DETAIL</p><h2>${esc(r.id)}</h2><p class="drawer-sub">${esc(r.date)} · ${esc(r.channel)} · ${esc(r.status)}</p>
      <div class="drawer-section"><div class="info-list"><div class="info-item"><small>内部订单</small><b>${r.internal} 笔 · ${money(r.internalAmount)}</b></div><div class="info-item"><small>外部流水</small><b>${r.external} 笔 · ${money(r.externalAmount)}</b></div><div class="info-item"><small>匹配成功</small><b>${r.matched} 笔 · ${money(r.matchedAmount)}</b></div><div class="info-item"><small>差异</small><b class="danger-text">${r.diff} 笔</b></div></div></div>
      <div class="drawer-section"><h3>对账说明</h3><p class="drawer-sub">按订单号 + 支付金额自动匹配；差异记录已进入差异处理流程。</p></div>
      <div class="drawer-actions"><button class="btn primary" data-close-drawer>知道了</button></div>`);
  }

  function openDifference(id) {
    const d = differences.find(x => x.id === id); if (!d) return;
    openDrawer(`<p class="page-eyebrow">DIFFERENCE REVIEW</p><h2>处理差异</h2><p class="drawer-sub">${esc(d.id)} · ${esc(d.type)} · ${esc(d.order)}</p>
      <div class="drawer-section"><div class="info-list"><div class="info-item"><small>内部金额</small><b>${money(d.internal)}</b></div><div class="info-item"><small>外部金额</small><b>${money(d.external)}</b></div><div class="info-item"><small>差异金额</small><b class="${d.diff < 0 ? "danger-text" : "margin-positive"}">${money(d.diff)}</b></div><div class="info-item"><small>当前状态</small><b>${esc(d.status)}</b></div></div></div>
      <div class="drawer-section"><div class="publish-form"><label class="field"><span>处理方式</span><select id="diffAction"><option>人工处理</option><option>挂起待查</option><option>发起退款</option></select></label><label class="field full"><span>处理说明</span><textarea id="diffNote" rows="3" placeholder="填写处理说明与协同记录"></textarea></label></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-diff-save="${d.id}">提交处理</button></div>`);
    const save = $("[data-diff-save]");
    if (save) save.addEventListener("click", () => {
      d.status = "已处理";
      d.owner = "王琳";
      closeDrawer();
      toast("差异已处理并记录审计日志");
      renderSettlements();
    });
  }

  function kpiLocal(iconName, label, value, sub, color) {
    return `<article class="kpi-card" style="--kpi:${color};--kpi-soft:${color}18"><span class="kpi-icon">${icon(iconName)}</span><div class="kpi-label">${label}</div><div class="kpi-num">${value}</div><div class="kpi-sub">${sub}</div></article>`;
  }

  function openInvoice(id) {
    const s = settlements.find(x => x.id === id); if (!s) return;
    openDrawer(`<p class="page-eyebrow">INVOICE</p><h2>开发票</h2><p class="drawer-sub">${esc(s.id)} · ${esc(s.party)} · 订单金额 ${money(s.amount)}</p>
      <div class="drawer-section"><div class="publish-form">
        <label class="field full"><span>发票抬头</span><input id="invoiceTitle" value="${esc(s.party)}" /></label>
        <label class="field"><span>纳税人识别号</span><input id="invoiceTaxNo" placeholder="请输入税号" /></label><label class="field"><span>开票金额</span><input id="invoiceAmount" type="number" value="${s.amount}" /></label>
        <label class="field"><span>发票类型</span><select><option>增值税普通发票</option><option>增值税专用发票</option></select></label><label class="field"><span>开票日期</span><input type="date" value="2026-10-21" /></label>
      </div></div><div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-invoice-save="${s.id}">确认开票</button></div>`);
    const save = $("[data-invoice-save]");
    if (save) save.addEventListener("click", () => {
      const title = $("#invoiceTitle")?.value || s.party;
      const amount = Number($("#invoiceAmount")?.value || s.amount);
      invoices.unshift({ id: "INV" + Date.now().toString().slice(-9), settlement: s.id, party: s.party, title, taxNo: $("#invoiceTaxNo")?.value || "待补充", amount, date: "2026-10-21", status: "已开票" });
      s.invoice = "已开票";
      closeDrawer();
      toast("发票已开具，开票记录已保存");
      renderSettlements();
    });
  }

  window.AdminFinance = {
    business: renderBusiness,
    providers: renderProviders,
    settlements: renderSettlements
  };
})();
