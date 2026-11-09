(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const money = v => "¥" + Number(v || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pad = n => String(n).padStart(2, "0");
  const listState = {};
  const roleRoutes = {
    finance: null,
    ops: ["工作台", "企业合约", "企业资金账户", "员工额度账户", "结余处理", "机构合约", "消费明细", "异常消费池", "机构对账", "差错工单", "机构结算单", "打款管理", "企业账单", "发票管理", "报表看板", "审计日志"],
    enterprise: ["工作台", "企业合约", "企业资金账户", "员工额度账户", "结余处理", "企业账单", "发票管理", "报表看板"],
    institution: ["工作台", "机构合约", "消费明细", "异常消费池", "机构对账", "差错工单", "机构结算单", "打款管理", "报表看板"]
  };
  const roleNames = { finance: "财务管理员", ops: "运营督导", enterprise: "企业 HR", institution: "机构用户" };
  let role = "finance";
  let currentBase = "工作台";
  let renderToken = 0;

  const companies = [
    ["中石油华北分公司", "中国石油天然气股份有限公司华北分公司"],
    ["金融街控股", "金融街控股股份有限公司"],
    ["望京科技园", "北京望京科技园有限公司"],
    ["方园中心", "北京方园中心有限公司"],
    ["北京北大医疗康复医院", "北京北大医疗康复医院有限公司"],
    ["中化能源", "中化能源股份有限公司"],
    ["中国建投", "中国建银投资有限责任公司"],
    ["京东方集团", "京东方科技集团股份有限公司"],
    ["北汽集团", "北京汽车集团有限公司"],
    ["同仁堂集团", "中国北京同仁堂（集团）有限责任公司"]
  ];
  const institutions = [
    ["北大医疗健康管理中心", "健管机构"], ["华大医学检验实验室", "检验机构"], ["云诊互联网医院", "互联网医院"],
    ["远健运动康复中心", "康复机构"], ["北京协和体检中心", "体检机构"], ["同仁堂大药房", "药房"],
    ["美年大健康望京分院", "体检机构"], ["北大国际医院", "医院"], ["安心营养科技", "营养机构"], ["康复医院健康管理部", "健管机构"]
  ];
  const employeeNames = ["林悦", "陈嘉禾", "周雯", "徐一鸣", "何雨桐", "赵启明", "吴倩", "孙宁", "王凯", "李雪", "张晨", "陈思远"];

  const contracts = companies.map(([name, legal], i) => ({
    id: `企康合约-2026-${String(i + 1).padStart(4, "0")}`,
    name, legal,
    amount: [1250000, 860000, 300000, 800000, 200000, 680000, 920000, 1500000, 1100000, 760000][i],
    projects: ["体检", "购药", "直付医疗", "健管服务"].slice(0, 2 + (i % 3)).join("、"),
    people: i % 3 === 0 ? "员工本人 + 家属" : "员工本人",
    period: i === 4 ? "2026-03-01 至 2026-11-30" : "2026-01-01 至 2026-12-31",
    feeRate: ["3.5%", "4.0%", "3.8%", "4.2%", "3.0%", "3.6%", "4.5%", "3.2%", "3.9%", "4.1%"][i],
    balanceRule: i % 3 === 0 ? "退回企业" : i % 3 === 1 ? "滚存至下期" : "按 7:3 分配",
    status: i === 1 ? "待审核" : i === 3 ? "冻结" : i === 7 ? "已关闭" : "生效",
    enterpriseId: `ENT-${String(i + 1).padStart(3, "0")}`
  }));

  const accounts = companies.map(([name], i) => {
    const contract = contracts[i];
    const received = contract.amount - (i % 2 ? 80000 : 0);
    const consumed = [286400, 198600, 96400, 142800, 86500, 116000, 174000, 248000, 168000, 92000][i];
    const frozen = [12000, 8000, 5000, 10000, 0, 16000, 9000, 21000, 13000, 7000][i];
    return {
      id: contract.id, name, contract: contract.amount, received, consumed, frozen,
      available: received - consumed - frozen, balance: contract.amount - consumed,
      status: i === 2 ? "待补充" : i === 4 ? "临近到期" : "资金正常",
      rule: contract.balanceRule, expiry: contract.period.split(" 至 ")[1]
    };
  });

  const quotas = employeeNames.slice(0, 10).map((name, i) => {
    const annual = [12000, 8000, 18000, 10000, 6000, 20000, 5000, 12000, 9000, 15000][i];
    const used = [3280, 2450, 5120, 7800, 1860, 9600, 900, 3800, 7200, 4100][i];
    const frozen = [0, 300, 0, 1000, 0, 0, 0, 0, 500, 0][i];
    return {
      id: `员工额度-2026-${String(i + 1).padStart(4, "0")}`, name,
      enterprise: companies[i % companies.length][0],
      level: ["P6 / 5 年", "P5 / 2 年", "P7 / 8 年", "P5 / 12 年", "P4 / 3 年", "P8 / 15 年", "P4 / 1 年", "P6 / 6 年", "P5 / 4 年", "P7 / 10 年"][i],
      annual, categories: `体检 ${Math.round(annual * .35)} / 购药 ${Math.round(annual * .25)} / 直付 ${Math.round(annual * .4)}`,
      used, frozen, available: annual - used - frozen,
      family: i % 4 === 0 ? "共享 1 人" : "不共享",
      status: used / annual > .72 ? "额度预警" : i === 3 ? "冻结" : "生效"
    };
  });

  const institutionContracts = institutions.map(([name, type], i) => ({
    id: `机构合约-2026-${String(i + 1).padStart(4, "0")}`, name, type,
    cycle: i % 3 === 0 ? "月结" : i % 3 === 1 ? "周结" : "季结",
    term: i < 4 ? "T+3" : i < 7 ? "T+7" : "T+15",
    fee: ["3.0%", "2.5%", "4.0%", "3.2%", "2.8%", "3.5%", "3.0%", "2.0%", "3.8%", "2.6%"][i],
    account: `招商银行北京分行 · 6225 **** ${String(1200 + i * 37).slice(-4)}`,
    status: i === 6 ? "待审核" : i === 9 ? "冻结" : "生效",
    scope: ["体检、报告解读", "医学检验、专项筛查", "线上问诊、复诊", "运动康复、体测", "年度体检、深度筛查", "药品、营养补剂", "体检、报告解读", "直付医疗、住院", "营养咨询、食谱", "健管服务、随访"][i]
  }));

  const consumptions = Array.from({ length: 12 }).map((_, i) => {
    const employee = employeeNames[i % employeeNames.length];
    const institution = institutions[i % institutions.length][0];
    const amount = [680, 1280, 328, 4600, 899, 268, 756, 1980, 560, 1240, 96, 3200][i];
    return {
      id: `消费明细-2026-1109-${String(i + 1).padStart(3, "0")}`,
      employee, institution,
      service: ["年度体检", "报告解读", "购药", "专项筛查", "睡眠监测", "营养补剂", "胃肠镜", "康复评估", "线上问诊", "体成分复测", "健康食品", "五高一重管理"][i],
      amount, date: `2026-11-${pad(9 - (i % 7))} ${pad(9 + (i % 8))}:${pad(10 + i)}`,
      verify: i === 2 || i === 8 ? "异常" : i === 5 ? "待校验" : "已校验",
      anomaly: i === 2 ? "额度不足" : i === 8 ? "非保障项目" : i === 5 ? "待复核" : "—",
      status: i === 2 || i === 8 ? "异常" : i === 5 ? "待审核" : "成功"
    };
  });

  const anomalies = Array.from({ length: 10 }).map((_, i) => ({
    id: `异常消费-2026-${String(i + 1).padStart(4, "0")}`,
    type: ["额度不足", "重复上传", "非保障项目", "跨机构并发", "额度不足"][i % 5],
    employee: employeeNames[(i + 2) % employeeNames.length],
    institution: institutions[i % institutions.length][0],
    amount: [1280, 7560, 460, 3200, 680, 1980, 960, 2400, 560, 1240][i],
    date: `2026-11-${pad(8 - (i % 6))} ${pad(10 + i % 6)}:${pad(10 + i)}`,
    status: i < 4 ? "待处理" : i < 7 ? "处理中" : "已关闭",
    owner: ["王琳", "陈晓"][i % 2]
  }));

  const reconciliations = Array.from({ length: 10 }).map((_, i) => ({
    id: `对账批次-2026-11-09-${String(i + 1).padStart(3, "0")}`,
    institution: institutions[i % institutions.length][0],
    period: `2026-11-${pad(9 - (i % 5))}`,
    internal: [128, 86, 42, 36, 93, 58, 112, 76, 64, 88][i],
    external: [130, 86, 42, 35, 93, 58, 112, 74, 64, 88][i],
    matched: [126, 86, 42, 34, 93, 58, 110, 74, 64, 88][i],
    difference: i === 0 ? 2 : i === 3 ? 1 : i === 7 ? 2 : 0,
    diffType: i === 0 ? "金额不符 / 短款" : i === 3 ? "长款" : i === 7 ? "状态不一致" : "—",
    status: i === 0 || i === 3 || i === 7 ? "有差异" : i < 4 ? "待对账" : "已平账"
  }));

  const tickets = Array.from({ length: 10 }).map((_, i) => ({
    id: `差错工单-2026-${String(i + 1).padStart(4, "0")}`,
    source: ["对账批次", "异常消费", "机构申诉", "打款失败"][i % 4],
    institution: institutions[i % institutions.length][0],
    type: ["金额不符", "重复上传", "状态不一致", "退票"][i % 4],
    amount: [1280, 7560, 4600, 3200, 680, 1980, 960, 2400, 560, 1240][i],
    assignee: ["王琳", "陈晓", "赵敏"][i % 3],
    status: i < 3 ? "待处理" : i < 6 ? "处理中" : i < 8 ? "待复核" : "已关闭",
    created: `2026-11-${pad(9 - (i % 6))} 09:${pad(10 + i)}`
  }));

  const settlementOrders = Array.from({ length: 10 }).map((_, i) => ({
    id: `机构结算-2026-1109-${String(i + 1).padStart(3, "0")}`,
    institution: institutions[i % institutions.length][0],
    period: i < 4 ? "2026-10-01 至 2026-10-31" : "2026-11-01 至 2026-11-09",
    count: [128, 86, 42, 36, 93, 58, 112, 76, 64, 88][i],
    amount: [300720, 208520, 110040, 65520, 216400, 128900, 278600, 174800, 151200, 196600][i],
    status: i === 0 ? "待机构确认" : i === 1 ? "待打款" : i === 3 ? "挂起" : i === 7 ? "已关闭" : i < 3 ? "待打款" : "成功",
    term: i < 4 ? "T+3" : "T+7",
    due: `2026-11-${pad(12 + (i % 8))}`,
    invoice: i < 2 ? "未开票" : "已开票"
  }));

  const payments = Array.from({ length: 10 }).map((_, i) => ({
    id: `打款单-2026-1109-${String(i + 1).padStart(3, "0")}`,
    statement: settlementOrders[i].id,
    institution: settlementOrders[i].institution,
    amount: settlementOrders[i].amount,
    method: i % 3 === 0 ? "银行转账" : "网银代付",
    status: i === 0 ? "打款失败" : i === 1 ? "失败" : i === 3 ? "退票" : i === 4 ? "打款中" : i < 3 ? "待打款" : "成功",
    date: `2026-11-${pad(9 - (i % 5))} ${pad(10 + i % 5)}:${pad(12 + i)}`
  }));

  const bills = Array.from({ length: 10 }).map((_, i) => ({
    id: `企业账单-2026-10-${String(i + 1).padStart(3, "0")}`,
    enterprise: companies[i % companies.length][0],
    costCenter: ["总部 / 人力", "华北一区 / 销售", "研发中心", "财务共享", "生产一厂", "集团总部", "华东分公司", "技术中心", "市场部", "客户服务"][i],
    period: "2026-10",
    amount: [286400, 198600, 96400, 142800, 86500, 116000, 174000, 248000, 168000, 92000][i],
    status: i === 3 ? "回款逾期" : i === 5 ? "争议" : i < 3 ? "待确认" : "已确认",
    due: `2026-11-${pad(15 + (i % 8))}`,
    services: ["体检 / 购药", "体检 / 健管", "直付 / 健管", "体检 / 购药 / 直付", "健管 / 体检", "购药 / 直付", "体检 / 健管", "体检 / 购药", "直付 / 健管", "体检 / 购药"][i]
  }));

  const invoices = Array.from({ length: 10 }).map((_, i) => ({
    id: `发票-2026-1109-${String(i + 1).padStart(3, "0")}`,
    enterprise: companies[i % companies.length][0],
    statement: settlementOrders[i].id,
    bill: bills[i].id,
    amount: [128000, 86000, 76000, 142800, 86500, 116000, 174000, 248000, 168000, 92000][i],
    match: i === 2 ? "不匹配" : i === 5 ? "待匹配" : "三单匹配",
    status: i === 2 ? "红冲" : i === 5 ? "待开票" : i === 7 ? "重开" : "已开票",
    date: `2026-11-${pad(9 - (i % 6))}`
  }));

  const balances = Array.from({ length: 10 }).map((_, i) => ({
    id: `结余处理-2026-${String(i + 1).padStart(5, "0")}`,
    enterprise: companies[i % companies.length][0],
    amount: [50160, 84200, 33500, 78600, 12000, 63800, 45800, 102000, 52900, 28100][i],
    rule: ["退回企业", "滚存至下期", "按 7:3 分配"][i % 3],
    status: i < 2 ? "待复核" : i < 5 ? "已退回" : i < 8 ? "已滚存" : "已关闭",
    handler: ["王琳", "陈晓"][i % 2],
    created: `2026-11-${pad(9 - (i % 6))} 10:${pad(10 + i)}`
  }));

  const auditLogs = Array.from({ length: 12 }).map((_, i) => ({
    id: `审计-2026-${String(i + 1).padStart(5, "0")}`,
    time: `2026-11-${pad(9 - (i % 6))} ${pad(9 + (i % 8))}:${pad(10 + i)}`,
    user: ["王琳", "陈晓", "赵敏", "李明"][i % 4],
    module: ["企业资金", "员工额度", "机构对账", "打款管理", "企业账单", "发票管理"][i % 6],
    action: ["到账登记", "额度调额", "差异处理", "打款重试", "账单确认", "发票红冲"][i % 6],
    before: ["可用余额 ¥501,600.00", "额度 ¥12,000.00", "差异 2笔", "待打款", "待确认", "已开票"][i % 6],
    after: ["已到账 ¥800,000.00", "额度 ¥14,000.00", "已处理", "成功", "已确认", "红冲完成"][i % 6],
    reason: ["企业银行回单", "员工职级调整", "机构回执确认", "失败原因排查", "企业财务确认", "企业开票信息变更"][i % 6]
  }));

  const reports = {
    enterprise: [["中石油华北分公司", "96.8%", "¥1,286.40", "11.2%", "98.2%"], ["金融街控股", "91.4%", "¥1,102.80", "8.6%", "96.8%"], ["望京科技园", "88.7%", "¥986.20", "14.8%", "92.1%"], ["方园中心", "94.2%", "¥1,140.60", "9.4%", "97.5%"]],
    institution: [["北大医疗健康管理中心", "99.1%", "0.4%", "99.8%", "T+3"], ["华大医学检验实验室", "98.6%", "1.2%", "99.2%", "T+3"], ["云诊互联网医院", "97.8%", "0.8%", "98.9%", "T+7"], ["远健运动康复中心", "96.4%", "2.1%", "97.6%", "T+5"]],
    funds: [["委托资金池余额", money(8243000)], ["在途结算资金", money(684800)], ["已打款未核销", money(326400)], ["待处理差异金额", money(12860)]]
  };

  const statusClass = s => {
    if (["生效", "成功", "已确认", "已开票", "已平账", "资金正常", "已校验", "三单匹配"].includes(s)) return "green";
    if (["待审核", "待确认", "待对账", "待打款", "待机构确认", "待校验", "待匹配", "待复核", "待开票", "处理中", "打款中", "有差异"].includes(s)) return "gold";
    if (["冻结", "已关闭", "已取消"].includes(s)) return "slate";
    if (["异常", "失败", "打款失败", "退票", "回款逾期", "额度不足", "不匹配", "红冲", "争议"].includes(s)) return "red";
    if (["重开", "挂起", "转人工"].includes(s)) return "purple";
    if (["待处理", "待复核", "待补充", "临近到期"].includes(s)) return "orange";
    return "blue";
  };
  const badge = s => `<span class="status ${statusClass(s)}">${esc(s)}</span>`;

  function toast(message) {
    const t = $("#toast"); t.textContent = message; t.classList.add("show");
    clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove("show"), 2100);
  }
  function openDrawer(title, sub, body, actions) {
    $("#drawerBody").innerHTML = `<p class="eyebrow">SETTLEMENT DETAIL</p><h2>${esc(title)}</h2><p class="drawer-sub">${esc(sub)}</p>${body}${actions || ""}`;
    $("#drawer").classList.add("show"); $("#drawer").setAttribute("aria-hidden", "false");
    $("#overlay").classList.add("show");
  }
  function openModal(title, sub, body, actions) {
    $("#modalBody").innerHTML = `<h2>${esc(title)}</h2><p class="modal-sub">${esc(sub)}</p>${body}${actions || ""}`;
    $("#modalWrap").classList.add("show"); $("#modalWrap").setAttribute("aria-hidden", "false");
  }
  function closeOverlays() {
    $("#drawer").classList.remove("show"); $("#drawer").setAttribute("aria-hidden", "true");
    $("#modalWrap").classList.remove("show"); $("#modalWrap").setAttribute("aria-hidden", "true");
    $("#overlay").classList.remove("show");
  }
  function modalActions(submitText, message, extra) {
    return `<div class="modal-actions"><button class="btn" data-close-overlay>取消</button>${extra || ""}<button class="btn primary" data-submit-message="${esc(message)}">${esc(submitText)}</button></div>`;
  }
  function drawerActions(submitText, message, extra) {
    return `<div class="drawer-actions"><button class="btn" data-close-overlay>关闭</button>${extra || ""}<button class="btn primary" data-submit-message="${esc(message)}">${esc(submitText)}</button></div>`;
  }
  const inputField = (label, key, value, type, options) => {
    if (options) return `<label class="field"><span>${label}</span><select id="field-${key}">${options.map(o => `<option${o === value ? " selected" : ""}>${esc(o)}</option>`).join("")}</select></label>`;
    return `<label class="field"><span>${label}</span><input id="field-${key}" type="${type || "text"}" value="${esc(value)}" /></label>`;
  };
  function modalForm(title, sub, fields, submit, message) {
    openModal(title, sub, `<div class="form-grid">${fields.map(f => inputField(f[0], f[1], f[2] || "", f[3], f[4])).join("")}</div>`, modalActions(submit, message));
  }
  function pageHead(title, desc, actions) {
    return `<div class="page-head"><div><p class="eyebrow">B2B HEALTH SETTLEMENT</p><h1>${esc(title)}</h1><p class="desc">${esc(desc)}</p></div><div class="page-actions">${actions || ""}</div></div>`;
  }
  function kpi(icon, label, value, sub, color) {
    return `<article class="kpi-card ${color}"><span class="ki">${icon}</span><div class="kpi-label">${esc(label)}</div><div class="kpi-num">${value}</div><div class="kpi-sub">${esc(sub)}</div></article>`;
  }

  function getRoute() {
    const raw = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    return raw.split("/").filter(Boolean);
  }
  function go(route) {
    if (decodeURIComponent(location.hash.replace(/^#\/?/, "")) === route) render();
    else location.hash = "#/" + route;
  }
  function canAccess(base) {
    return !roleRoutes[role] || roleRoutes[role].includes(base);
  }
  function applyMenuRole() {
    $$(".menu a").forEach(a => {
      const allowed = !roleRoutes[role] || roleRoutes[role].includes(a.dataset.route);
      a.style.display = allowed ? "" : "none";
    });
    $$(".menu-group").forEach(g => {
      const visible = $$("a", g).some(a => a.style.display !== "none");
      g.style.display = visible ? "" : "none";
    });
  }
  function setActive(base) {
    $$(".menu a").forEach(a => a.classList.toggle("active", a.dataset.route === base));
    const names = { "工作台": "工作台", "企业合约": "企业合约", "企业资金账户": "企业资金账户", "员工额度账户": "员工额度账户", "机构合约": "机构合约", "消费明细": "消费明细", "异常消费池": "异常消费池", "机构对账": "机构对账", "差错工单": "差错工单", "机构结算单": "机构结算单", "打款管理": "打款管理", "企业账单": "企业账单", "发票管理": "发票管理", "结余处理": "结余处理", "报表看板": "报表看板", "审计日志": "审计日志", "系统管理": "系统管理" };
    $("#crumb").textContent = "企康结算中心 / " + (names[base] || base);
  }
  function skeleton() {
    return `<div class="page"><div class="loading-state"><div class="skeleton" style="height:32px;width:230px"></div><div class="skeleton"></div><div class="skeleton tall"></div></div></div>`;
  }

  function getListState(base) {
    if (!listState[base]) listState[base] = { page: 1, filters: {} };
    return listState[base];
  }
  function matches(row, filters) {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value.startsWith("全部")) return true;
      return String(row[key] || "").includes(value) || Object.values(row).some(v => String(v).includes(value));
    });
  }
  function statusOptions(rows, key) {
    return ["全部" + (key === "status" ? "状态" : ""), ...new Set(rows.map(r => r[key]))];
  }

  function renderList(base) {
    const def = listDefs[base];
    if (!def) return renderWorkbench();
    const st = getListState(base);
    const filtered = def.rows.filter(r => matches(r, st.filters));
    const size = def.pageSize || 6;
    const pages = Math.max(1, Math.ceil(filtered.length / size));
    if (st.page > pages) st.page = pages;
    const pageRows = filtered.slice((st.page - 1) * size, st.page * size);
    const cols = def.columns;
    const filterHtml = def.filters.map(f => {
      if (f.type === "select") {
        const opts = typeof f.options === "function" ? f.options() : f.options;
        return `<label class="field"><span>${f.label}</span><select id="filter-${f.key}"><option>全部</option>${opts.filter(o => o !== "全部").map(o => `<option${st.filters[f.key] === o ? " selected" : ""}>${esc(o)}</option>`).join("")}</select></label>`;
      }
      return `<label class="field ${f.wide ? "wide" : ""}"><span>${f.label}</span><input id="filter-${f.key}" value="${esc(st.filters[f.key] || "")}" placeholder="${esc(f.placeholder || "请输入")}" /></label>`;
    }).join("");
    const topActions = (def.actions || []).map((a, i) => `<button class="btn ${a.primary ? "primary" : ""}" data-page-action="${i}">${esc(a.label)}</button>`).join("");
    const table = `<div class="table-wrap"><table><thead><tr>${cols.map(c => `<th>${c.label}</th>`).join("")}<th>操作</th></tr></thead><tbody>${pageRows.length ? pageRows.map((row, idx) => `<tr>${cols.map(c => `<td>${renderCell(c, row)}</td>`).join("")}<td><div class="row-actions"><button class="link-btn" data-row-view="${row.id}">查看</button><button class="link-btn" data-row-process="${row.id}">处理</button><button class="link-btn gray" data-row-more="${row.id}">更多</button></div></td></tr>`).join("") : `<tr><td colspan="${cols.length + 1}"><div class="empty-state"><span class="empty-icon">◌</span><b>没有匹配的数据</b><span>调整筛选条件或重置后重试</span><button class="btn small" data-reset-empty>1 重置筛选</button></div></td></tr>`}</tbody></table></div>`;
    const pager = `<div class="pager"><span class="pager-info">共 ${filtered.length} 条 · 每页 ${size} 条 · 第 ${st.page} / ${pages} 页</span><div class="pager-btns"><button data-page="${st.page - 1}" ${st.page <= 1 ? "disabled" : ""}>‹</button>${Array.from({ length: pages }).map((_, i) => `<button class="${st.page === i + 1 ? "active" : ""}" data-page="${i + 1}">${i + 1}</button>`).join("")}<button data-page="${st.page + 1}" ${st.page >= pages ? "disabled" : ""}>›</button></div></div>`;
    const kpis = def.kpis ? `<div class="kpi-grid">${def.kpis.map(k => kpi(k[0], k[1], k[2], k[3], k[4])).join("")}</div>` : "";
    $("#viewRoot").innerHTML = `<div class="page">${pageHead(def.title, def.desc, topActions)}${kpis}<div class="filter-panel">${filterHtml}<div class="filter-actions"><button class="btn primary" data-apply-filter>查询</button><button class="btn" data-reset-filter>重置</button></div></div><section class="panel table-panel">${table}${pager}</section></div>`;
    const refresh = () => renderList(base);
    $$("#viewRoot [id^='filter-']").forEach(el => el.addEventListener("keydown", e => { if (e.key === "Enter") apply(); }));
    function apply() {
      def.filters.forEach(f => { const el = $("#filter-" + f.key); if (!el) return; const v = el.value; if (!v || v === "全部" || v === "全部状态") delete st.filters[f.key]; else st.filters[f.key] = v; });
      st.page = 1; refresh();
    }
    $("[data-apply-filter]")?.addEventListener("click", apply);
    $("[data-reset-filter]")?.addEventListener("click", () => { st.filters = {}; st.page = 1; refresh(); toast("筛选条件已重置"); });
    $("[data-reset-empty]")?.addEventListener("click", () => { st.filters = {}; st.page = 1; refresh(); });
    $$("[data-page]").forEach(b => b.addEventListener("click", () => { const p = Number(b.dataset.page); if (p >= 1 && p <= pages) { st.page = p; refresh(); } }));
    $$("[data-page-action]").forEach(b => b.addEventListener("click", () => runPageAction(def, def.actions[Number(b.dataset.pageAction)])));
    $$("[data-row-view]").forEach(b => b.addEventListener("click", () => { const row = def.rows.find(x => x.id === b.dataset.rowView); if (def.detailRoute) go(def.detailRoute(row)); else openRowDrawer(base, row); }));
    $$("[data-row-process]").forEach(b => b.addEventListener("click", () => { const row = def.rows.find(x => x.id === b.dataset.rowProcess); openProcess(base, row); }));
    $$("[data-row-more]").forEach(b => b.addEventListener("click", () => { const row = def.rows.find(x => x.id === b.dataset.rowMore); openMore(base, row); }));
    setCrumb(def.title);
  }

  function renderCell(col, row) {
    const v = typeof col.render === "function" ? col.render(row) : row[col.key];
    if (col.type === "status") return badge(v);
    if (col.type === "money") return `<span class="money ${col.green ? "green" : ""} ${col.red ? "red" : ""}">${money(v)}</span>`;
    if (col.type === "main") return `<div class="main-cell"><b>${esc(v)}</b>${col.sub ? `<span class="cell-sub">${esc(row[col.sub])}</span>` : ""}</div>`;
    return esc(v == null ? "—" : v);
  }

  function setCrumb(title) { $("#crumb").textContent = "企康结算中心 / " + title; }

  function runPageAction(def, action) {
    if (!action) return;
    if (action.type === "toast") { toast(action.message || "操作完成"); return; }
    if (action.type === "export") { toast("导出任务已创建，请稍后在下载中心查看"); return; }
    modalForm(action.label, action.desc || `${def.title} · 新增/编辑操作`, action.fields || [["操作说明", "note", "", "text"]], "提交", `${action.label}已保存`);
  }

  function openProcess(base, row) {
    const def = listDefs[base];
    const fields = def.processFields || [["处理结果", "result", "", "select", ["处理通过", "补充材料", "退回修改", "挂起待查"]], ["处理说明", "note", "", "text"]];
    modalForm("处理 · " + (row.id || ""), (def.title || "") + " · " + (row.status || ""), fields, "提交处理", "处理已提交，中文提示已记录");
  }

  function openMore(base, row) {
    openModal("更多操作", row.id || "", `<div class="info-list"><div class="info-item"><small>当前模块</small><b>${esc(listDefs[base]?.title || base)}</b></div><div class="info-item"><small>当前状态</small><b>${esc(row.status || "—")}</b></div></div><div class="drawer-section"><div class="notice">以下操作为交互示例，提交后会显示中文 Toast。</div><div class="row-actions" style="flex-wrap:wrap"><button class="btn small" data-submit-message="已复制编号">复制编号</button><button class="btn small" data-submit-message="已生成操作快照">生成快照</button><button class="btn small danger" data-submit-message="已标记关注">标记关注</button></div></div>`, `<div class="modal-actions"><button class="btn" data-close-overlay>关闭</button></div>`);
  }

  function openRowDrawer(base, row) {
    const def = listDefs[base];
    const entries = Object.entries(row).filter(([k]) => !["id"].includes(k)).slice(0, 10);
    openDrawer(row.id || def.title, def.title + " · 明细抽屉", `<div class="drawer-section"><div class="info-list">${entries.map(([k, v]) => `<div class="info-item"><small>${esc(k)}</small><b>${k === "amount" || k === "contract" ? money(v) : esc(v)}</b></div>`).join("")}</div></div><div class="drawer-section"><h3>操作</h3><div class="row-actions"><button class="btn small" data-submit-message="已打开处理流程">处理</button><button class="btn small" data-submit-message="已导出明细">导出明细</button></div></div>`, drawerActions("关闭", "已记录查看日志", `<button class="btn danger" data-submit-message="已发起退款/冲正示例">退款 / 冲正</button>`));
  }

  function render() {
    const parts = getRoute();
    let base = parts[0] || "工作台";
    if (!canAccess(base)) {
      toast("当前角色无权访问「" + base + "」，已返回工作台");
      base = "工作台";
      location.hash = "#/工作台";
      return;
    }
    currentBase = base;
    setActive(base);
    $("#viewRoot").innerHTML = skeleton();
    const token = ++renderToken;
    setTimeout(() => {
      if (token !== renderToken) return;
      if (base === "工作台") renderWorkbench();
      else if (base === "报表看板") renderReports();
      else if (base === "系统管理") renderSystem();
      else if (base === "企业合约" && parts[1]) renderEnterpriseDetail(parts[1]);
      else if (base === "机构合约" && parts[1]) renderInstitutionDetail(parts[1]);
      else if (base === "机构结算单" && parts[1]) renderSettlementDetail(parts[1]);
      else renderList(base);
    }, 160);
  }

  /* ---------------- 工作台 ---------------- */
  function renderWorkbench() {
    const todo = [
      ["待确认企业账单", "3", "含 1 家已回款逾期", "企业账单", "warn"],
      ["待对账机构", "4", "其中 2 个批次有差异", "机构对账", "warn"],
      ["异常消费", "6", "额度不足 / 重复上传", "异常消费池", "danger"],
      ["待打款结算单", "5", "T+3 账期优先", "机构结算单", "green"],
      ["账期预警", "2", "距账期不足 1 天", "机构合约", "danger"]
    ];
    const html = `<div class="page">${pageHead("工作台", "企康结算中心 · 企业委托资金、员工额度与机构直付清算总览", `<button class="btn" data-export-report>↓ 导出日报</button>`)}
      <div class="kpi-grid">${kpi("￥", "委托资金池总额", money(12500000), "覆盖 10 家企业", "blue")}${kpi("◈", "可用余额", money(8243000), "企业未使用资金", "green")}${kpi("≡", "本月消费", money(2860000), "较上月 +12.4%", "purple")}${kpi("¥", "待结算金额", money(1842000), "机构待打款", "orange")}</div>
      <div class="workbench-grid">${todo.map(([l, v, s, r, t]) => `<article class="work-card ${t}" data-work-route="${r}"><div class="wc-top"><span class="wc-icon">${t === "danger" ? "!" : t === "green" ? "¥" : "◷"}</span><span>待办</span></div><b>${v}</b><small>${l} · ${s}</small><span class="wc-link">查看详情 →</span></article>`).join("")}</div>
      <div class="workbench-main">
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">待对账机构</h3><p class="panel-sub">按机构账期自动生成，差异批次优先</p></div><a class="link-btn" href="#/机构对账">全部对账 →</a></div><div class="dash-list">${reconciliations.slice(0, 4).map(r => `<div class="dash-row"><div class="dr-main"><b>${esc(r.institution)}</b><small>${esc(r.period)} · 内部 ${r.internal} 笔 / 外部 ${r.external} 笔 · ${esc(r.diffType)}</small></div>${badge(r.status)}</div>`).join("")}</div></section>
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">异常消费</h3><p class="panel-sub">进入异常池，禁止结算</p></div><a class="link-btn" href="#/异常消费池">查看全部 →</a></div><div class="dash-list">${anomalies.slice(0, 4).map(a => `<div class="dash-row"><div class="dr-main"><b>${esc(a.type)} · ${esc(a.employee)}</b><small>${esc(a.institution)} · ${esc(a.date)}</small></div><span class="money red">${money(a.amount)}</span></div>`).join("")}</div></section>
      </div>
      <div class="workbench-main">
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">待打款结算单</h3><p class="panel-sub">医院类机构优先保障 T+3</p></div><a class="link-btn" href="#/打款管理">去打款 →</a></div><div class="dash-list">${settlementOrders.filter(s => s.status !== "成功").slice(0, 4).map(s => `<div class="dash-row"><div class="dr-main"><b>${esc(s.id)} · ${esc(s.institution)}</b><small>账期 ${esc(s.term)} · 应付 ${esc(s.due)}</small></div><span class="money">${money(s.amount)}</span>${badge(s.status)}</div>`).join("")}</div></section>
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">账期预警</h3><p class="panel-sub">T+3 / T+7 硬性账期</p></div><a class="link-btn" href="#/机构合约">机构合约 →</a></div><div class="dash-list">${[["北大医疗健康管理中心","T+3 剩余 1 天"],["华大医学检验实验室","T+3 剩余 2 天"],["北京协和体检中心","T+7 剩余 1 天"]].map(([n,d]) => `<div class="dash-row"><div class="dr-main"><b>${n}</b><small>${d}</small></div><span class="status red">预警</span></div>`).join("")}</div></section>
      </div>
      <section class="panel" style="margin-top:11px"><div class="panel-head"><div><h3 class="panel-title">最近动态</h3></div><a class="link-btn" href="#/审计日志">审计日志 →</a></div><div class="recent-list">${auditLogs.slice(0, 4).map(a => `<div class="recent-item"><span class="recent-dot"></span><div><b>${esc(a.user)} · ${esc(a.module)} · ${esc(a.action)}</b><small>${esc(a.time)} · ${esc(a.reason)}</small></div></div>`).join("")}</div></section>
    </div>`;
    $("#viewRoot").innerHTML = html;
    setCrumb("工作台");
    $$("[data-work-route]").forEach(c => c.addEventListener("click", () => go(c.dataset.workRoute)));
    $("[data-export-report]")?.addEventListener("click", () => toast("日报导出任务已创建"));
  }

  /* ---------------- 企业合约详情 ---------------- */
  function renderEnterpriseDetail(id) {
    const c = contracts.find(x => x.id === id) || contracts[0];
    const timeline = [
      ["合约创建", "王琳 创建企业合约并提交审核", "2026-01-02 10:12"],
      ["审核通过", "财务管理员 李明 审核通过，合约生效", "2026-01-03 09:30"],
      ["资金到账", "企业首期委托资金到账 ¥800,000.00", "2026-01-05 14:20"],
      ["额度下发", "按职位 / 工龄方案下发员工额度", "2026-01-06 11:08"]
    ];
    $("#viewRoot").innerHTML = `<div class="page detail-page"><div class="detail-crumb"><a href="#/企业合约">企业合约</a> / ${esc(c.id)}</div><div class="detail-head"><div><div class="detail-title-row"><h1>${esc(c.name)}</h1>${badge(c.status)}</div><p>${esc(c.id)} · ${esc(c.legal)}</p></div><div class="page-actions"><button class="btn" data-detail-action="返回列表">返回列表</button><button class="btn" data-detail-action="编辑合约">编辑合约</button><button class="btn primary" data-detail-action="提交审核">提交审核</button></div></div>
      <div class="detail-cards">${[["合约总额", money(c.amount), "委托资金"], ["保障项目", c.projects, "合约锁定"], ["保障人群", c.people, "员工及家属"], ["费率 / 结余", c.feeRate + " · " + c.balanceRule, "服务费与结余"]].map(x => `<div class="detail-card"><small>${x[0]}</small><b>${esc(x[1])}</b><span>${x[2]}</span></div>`).join("")}</div>
      <div class="detail-tabs">${["合约信息","保障范围","资金方案","审计记录"].map((t, i) => `<button class="${i === 0 ? "active" : ""}" data-detail-tab="${i}">${t}</button>`).join("")}</div>
      <div class="detail-tab-content active" data-tab-panel="0"><div class="detail-split"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">合约信息</h3></div></div><div class="panel-body"><div class="info-list"><div class="info-item"><small>合约编号</small><b>${esc(c.id)}</b></div><div class="info-item"><small>企业名称</small><b>${esc(c.name)}</b></div><div class="info-item"><small>法人主体</small><b>${esc(c.legal)}</b></div><div class="info-item"><small>有效期</small><b>${esc(c.period)}</b></div><div class="info-item"><small>管理费 / 服务费</small><b>${esc(c.feeRate)}</b></div><div class="info-item"><small>结余规则</small><b>${esc(c.balanceRule)}</b></div></div></div></section><section class="panel"><div class="panel-head"><div><h3 class="panel-title">审计时间线</h3></div></div><div class="panel-body"><div class="timeline">${timeline.map(t => `<div class="timeline-item"><b>${t[0]}</b><small>${t[1]}</small><time>${t[2]}</time></div>`).join("")}</div></div></section></div></div>
      <div class="detail-tab-content" data-tab-panel="1"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">保障范围</h3><p class="panel-sub">合约层锁定，订单不临时判断</p></div></div><div class="table-wrap"><table><thead><tr><th>保障项目</th><th>保障人群</th><th>是否可列支</th><th>员工自付</th><th>备注</th></tr></thead><tbody>${c.projects.split("、").map(p => `<tr><td><div class="main-cell"><b>${esc(p)}</b></div></td><td>${esc(c.people)}</td><td>${badge("生效")}</td><td>超出额度自付</td><td>按合约服务范围执行</td></tr>`).join("")}</tbody></table></div></section></div>
      <div class="detail-tab-content" data-tab-panel="2"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">资金方案</h3></div></div><div class="panel-body"><div class="info-list"><div class="info-item"><small>委托资金总额</small><b>${money(c.amount)}</b></div><div class="info-item"><small>管理费 / 服务费</small><b>${esc(c.feeRate)}</b></div><div class="info-item"><small>结余处理</small><b>${esc(c.balanceRule)}</b></div><div class="info-item"><small>消费规则</small><b>体检 / 购药 / 直付医疗 / 健管服务</b></div></div></div></section></div>
      <div class="detail-tab-content" data-tab-panel="3"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">全部审计记录</h3></div></div><div class="table-wrap"><table><thead><tr><th>时间</th><th>操作人</th><th>模块</th><th>操作</th><th>原因</th></tr></thead><tbody>${auditLogs.slice(0, 6).map(a => `<tr><td>${esc(a.time)}</td><td>${esc(a.user)}</td><td>${esc(a.module)}</td><td>${esc(a.action)}</td><td>${esc(a.reason)}</td></tr>`).join("")}</tbody></table></div></section></div></div>`;
    setCrumb("企业合约 / " + c.id);
    bindDetail(c, "企业合约");
  }

  function renderInstitutionDetail(id) {
    const c = institutionContracts.find(x => x.id === id) || institutionContracts[0];
    const timeline = [["合约签署", "王琳 创建机构合约", "2026-01-08 10:20"], ["资质审核", "运营督导 审核资质通过", "2026-01-09 15:10"], ["结算规则生效", "账期 " + c.term + "，费率 " + c.fee + " 生效", "2026-01-10 09:00"], ["最近对账", "2026-11-09 对账批次已生成", "2026-11-09 06:02"]];
    $("#viewRoot").innerHTML = `<div class="page detail-page"><div class="detail-crumb"><a href="#/机构合约">机构合约</a> / ${esc(c.id)}</div><div class="detail-head"><div><div class="detail-title-row"><h1>${esc(c.name)}</h1>${badge(c.status)}</div><p>${esc(c.id)} · ${esc(c.type)} · 结算周期 ${esc(c.cycle)}</p></div><div class="page-actions"><button class="btn" data-detail-action="返回列表">返回列表</button><button class="btn" data-detail-action="编辑机构合约">编辑合约</button><button class="btn primary" data-detail-action="发起对账">发起对账</button></div></div>
      <div class="detail-cards">${[["结算周期", c.cycle, "账期规则"], ["账期", c.term, "医院类优先"], ["费率", c.fee, "平台服务费"], ["收款账户", c.account, "打款校验"]].map(x => `<div class="detail-card"><small>${x[0]}</small><b>${esc(x[1])}</b><span>${x[2]}</span></div>`).join("")}</div>
      <div class="detail-tabs">${["合约信息","结算规则","收款账户","审计记录"].map((t, i) => `<button class="${i === 0 ? "active" : ""}" data-detail-tab="${i}">${t}</button>`).join("")}</div>
      <div class="detail-tab-content active" data-tab-panel="0"><div class="detail-split"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">机构合约信息</h3></div></div><div class="panel-body"><div class="info-list"><div class="info-item"><small>机构名称</small><b>${esc(c.name)}</b></div><div class="info-item"><small>机构类型</small><b>${esc(c.type)}</b></div><div class="info-item"><small>服务范围</small><b>${esc(c.scope)}</b></div><div class="info-item"><small>合约状态</small><b>${esc(c.status)}</b></div></div></div></section><section class="panel"><div class="panel-head"><div><h3 class="panel-title">审计时间线</h3></div></div><div class="panel-body"><div class="timeline">${timeline.map(t => `<div class="timeline-item"><b>${t[0]}</b><small>${t[1]}</small><time>${t[2]}</time></div>`).join("")}</div></div></section></div></div>
      <div class="detail-tab-content" data-tab-panel="1"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">结算规则</h3></div></div><div class="panel-body"><div class="info-list"><div class="info-item"><small>结算周期</small><b>${esc(c.cycle)}</b></div><div class="info-item"><small>账期</small><b>${esc(c.term)}</b></div><div class="info-item"><small>平台服务费</small><b>${esc(c.fee)}</b></div><div class="info-item"><small>分账口径</small><b>企业承担 + 员工自付 + 服务费</b></div></div></div></section></div>
      <div class="detail-tab-content" data-tab-panel="2"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">收款账户</h3></div></div><div class="panel-body"><div class="info-list"><div class="info-item"><small>开户行</small><b>${esc(c.account.split(" · ")[0])}</b></div><div class="info-item"><small>账号</small><b>${esc(c.account.split(" · ")[1] || c.account)}</b></div><div class="info-item"><small>账户校验</small><b class="money green">有效</b></div><div class="info-item"><small>打款前置</small><b>无未关闭差错工单</b></div></div></div></section></div>
      <div class="detail-tab-content" data-tab-panel="3"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">审计记录</h3></div></div><div class="table-wrap"><table><thead><tr><th>时间</th><th>操作人</th><th>操作</th><th>原因</th></tr></thead><tbody>${auditLogs.slice(0, 5).map(a => `<tr><td>${esc(a.time)}</td><td>${esc(a.user)}</td><td>${esc(a.action)}</td><td>${esc(a.reason)}</td></tr>`).join("")}</tbody></table></div></section></div></div>`;
    setCrumb("机构合约 / " + c.id);
    bindDetail(c, "机构合约");
  }

  function bindDetail(item, kind) {
    $$("[data-detail-tab]").forEach(b => b.addEventListener("click", () => {
      $$("[data-detail-tab]").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      $$("[data-tab-panel]").forEach(p => p.classList.toggle("active", p.dataset.tabPanel === b.dataset.detailTab));
    }));
    $$("[data-detail-action]").forEach(b => b.addEventListener("click", () => {
      const a = b.dataset.detailAction;
      if (a === "返回列表") go(kind);
      else if (a === "编辑合约" || a === "编辑机构合约") modalForm(a, item.id, [["名称", "name", item.name], ["状态", "status", item.status, "select", ["生效", "待审核", "冻结", "已关闭"]]], "保存修改", "合约已保存");
      else if (a === "提交审核") openModal("提交审核", item.id, `<div class="notice">请确认合约信息、资金方案与保障范围完整有效。</div>`, modalActions("确认提交", "合约已提交审核"));
      else if (a === "发起对账") { toast("已创建对账批次"); go("机构对账"); }
      else toast("操作已记录");
    }));
  }

  /* ---------------- 机构结算单详情 ---------------- */
  function renderSettlementDetail(id) {
    const s = settlementOrders.find(x => x.id === id) || settlementOrders[0];
    $("#viewRoot").innerHTML = `<div class="page detail-page"><div class="detail-crumb"><a href="#/机构结算单">机构结算单</a> / ${esc(s.id)}</div><div class="detail-head"><div><div class="detail-title-row"><h1>${esc(s.id)}</h1>${badge(s.status)}</div><p>${esc(s.institution)} · ${esc(s.period)}</p></div><div class="page-actions"><button class="btn" data-settlement-action="返回列表">返回列表</button><button class="btn" data-settlement-action="挂起">挂起</button><button class="btn primary" data-settlement-action="生成打款单">生成打款单</button></div></div><div class="detail-cards"><div class="detail-card"><small>机构应结</small><b>${money(s.amount)}</b><span>结算周期 ${esc(s.term)}</span></div><div class="detail-card"><small>消费笔数</small><b>${s.count} 笔</b><span>本期明细</span></div><div class="detail-card"><small>应付日期</small><b>${esc(s.due)}</b><span>账期驱动</span></div><div class="detail-card"><small>开票状态</small><b>${esc(s.invoice)}</b><span>三单匹配</span></div></div><div class="panel"><div class="panel-head"><div><h3 class="panel-title">结算明细</h3></div><span class="status blue">审核轨迹</span></div><div class="table-wrap"><table><thead><tr><th>消费日期</th><th>员工</th><th>服务</th><th>企业承担</th><th>员工自付</th><th>服务费</th><th>机构应结</th></tr></thead><tbody>${consumptions.slice(0, 6).map(c => `<tr><td>${esc(c.date)}</td><td>${esc(c.employee)}</td><td>${esc(c.service)}</td><td>${money(c.amount * .8)}</td><td>${money(c.amount * .1)}</td><td>${money(c.amount * .1)}</td><td>${money(c.amount)}</td></tr>`).join("")}</tbody></table></div></div><section class="panel" style="margin-top:11px"><div class="panel-head"><div><h3 class="panel-title">审计时间线</h3></div></div><div class="panel-body"><div class="timeline"><div class="timeline-item"><b>结算单生成</b><small>按机构合约账期自动生成</small><time>2026-11-09 06:01</time></div><div class="timeline-item"><b>机构确认</b><small>机构在线确认结算明细</small><time>2026-11-09 10:12</time></div><div class="timeline-item"><b>打款前置校验</b><small>账户有效 · 无差错工单</small><time>2026-11-09 10:15</time></div></div></div></section></div>`;
    setCrumb("机构结算单 / " + s.id);
    $$("[data-settlement-action]").forEach(b => b.addEventListener("click", () => {
      if (b.dataset.settlementAction === "返回列表") go("机构结算单");
      else if (b.dataset.settlementAction === "生成打款单") { toast("打款单已生成"); go("打款管理"); }
      else openModal("挂起结算单", s.id, `<div class="notice">挂起后不会进入打款队列，需填写原因。</div><label class="field"><span>挂起原因</span><textarea rows="3"></textarea></label>`, modalActions("确认挂起", "结算单已挂起"));
    }));
  }

  /* ---------------- 报表 ---------------- */
  function renderReports() {
    $("#viewRoot").innerHTML = `<div class="page">${pageHead("报表看板", "企业 / 机构 / 资金三个维度的核心结算指标", `<button class="btn" data-export-report>↓ 导出报表</button>`)}
      <div class="kpi-grid">${kpi("▥", "账期达成率", "97.6%", "T+3 达成 99.1%", "green")}${kpi("⇄", "对账差异率", "1.8%", "较上月 -0.4pt", "orange")}${kpi("¥", "打款成功率", "99.2%", "失败重试后 99.8%", "blue")}${kpi("◷", "资金池余额", money(8243000), "10 家企业", "purple")}</div>
      <div class="report-grid"><section class="report-card"><h3>企业维度</h3><div class="metric-line"><span>额度使用率</span><b>38.4%</b></div><div class="metric-line"><span>人均消费</span><b>¥1,286.40</b></div><div class="metric-line"><span>结余率</span><b>11.8%</b></div><div class="metric-line"><span>回款率</span><b>96.2%</b></div></section><section class="report-card"><h3>机构维度</h3><div class="metric-line"><span>结算及时率</span><b>98.1%</b></div><div class="metric-line"><span>对账差异率</span><b>1.8%</b></div><div class="metric-line"><span>打款成功率</span><b>99.2%</b></div><div class="metric-line"><span>平均账龄</span><b>4.2 天</b></div></section><section class="report-card"><h3>资金维度</h3><div class="metric-line"><span>委托资金池余额</span><b>${money(8243000)}</b></div><div class="metric-line"><span>在途结算资金</span><b>${money(684800)}</b></div><div class="metric-line"><span>已打款未核销</span><b>${money(326400)}</b></div><div class="metric-line"><span>待处理差异</span><b>${money(12860)}</b></div></section></div>
      <div class="detail-split" style="margin-top:11px"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">企业结算指标</h3></div><span class="status blue">TOP 4</span></div><div class="table-wrap"><table><thead><tr><th>企业</th><th>额度使用率</th><th>人均消费</th><th>结余率</th><th>回款率</th></tr></thead><tbody>${reports.enterprise.map(r => `<tr><td><b>${esc(r[0])}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td><span class="money green">${r[4]}</span></td></tr>`).join("")}</tbody></table></div></section><section class="panel"><div class="panel-head"><div><h3 class="panel-title">机构结算指标</h3></div><span class="status gold">账期监控</span></div><div class="table-wrap"><table><thead><tr><th>机构</th><th>结算及时率</th><th>差异率</th><th>打款成功率</th><th>账期</th></tr></thead><tbody>${reports.institution.map(r => `<tr><td><b>${esc(r[0])}</b></td><td>${r[1]}</td><td>${r[2]}</td><td><span class="money green">${r[3]}</span></td><td>${badge(r[4])}</td></tr>`).join("")}</tbody></table></div></section></div></div>`;
    setCrumb("报表看板");
    $("[data-export-report]")?.addEventListener("click", () => toast("报表导出任务已创建"));
  }

  /* ---------------- 系统管理 ---------------- */
  let systemTab = 0;
  function renderSystem() {
    const tabs = ["角色权限矩阵", "审批流配置", "参数配置"];
    const matrix = `<section class="panel"><div class="panel-head"><div><h3 class="panel-title">角色权限矩阵</h3><p class="panel-sub">企业 HR 仅见本企业，机构仅见本机构数据</p></div></div><div class="table-wrap"><table class="matrix"><thead><tr><th>角色 / 权限</th><th>企业资金</th><th>员工额度</th><th>机构对账</th><th>结算单</th><th>开票</th><th>系统配置</th></tr></thead><tbody><tr><td>财务管理员</td>${[1,1,1,1,1,1].map(v=>`<td><span class="check${v?'':' no'}">${v?'✓':'—'}</span></td>`).join("")}</tr><tr><td>运营督导</td>${[1,1,1,1,0,0].map(v=>`<td><span class="check${v?'':' no'}">${v?'✓':'—'}</span></td>`).join("")}</tr><tr><td>企业 HR</td>${[1,1,0,0,1,0].map(v=>`<td><span class="check${v?'':' no'}">${v?'✓':'—'}</span></td>`).join("")}</tr><tr><td>机构用户</td>${[0,0,1,1,0,0].map(v=>`<td><span class="check${v?'':' no'}">${v?'✓':'—'}</span></td>`).join("")}</tr></tbody></table></div></section>`;
    const flow = `<div class="notice">审批流用于企业合约、结余退回、打款大额复核等关键节点。</div><section class="panel"><div class="panel-head"><div><h3 class="panel-title">审批流配置</h3></div><button class="btn small" data-toast="审批流已新增">新增审批流</button></div><div class="table-wrap"><table><thead><tr><th>审批流</th><th>触发场景</th><th>节点</th><th>审批人</th><th>状态</th><th>操作</th></tr></thead><tbody>${[["企业合约审批","合约金额 ≥ ¥500,000","运营督导 → 财务管理员","李明 / 王琳","生效"],["结余退回审批","退回企业 / 按比例分配","财务复核 → 财务负责人","王琳 / 陈晓","生效"],["大额打款复核","单笔 ≥ ¥100,000","财务复核 → 财务负责人","李明 / 王琳","生效"]].map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${badge(r[4])}</td><td><button class="link-btn" data-toast="审批流已打开">编辑</button></td></tr>`).join("")}</tbody></table></div></section>`;
    const params = `<div class="notice">企康结算参数：T+3 硬账期、额度不可提现、专款专用校验均默认开启。</div><section class="panel"><div class="panel-head"><div><h3 class="panel-title">参数配置</h3></div></div><div class="panel-body"><div class="form-grid">${[["打款失败重试次数","3 次"],["账期预警提前量","1 天"],["对账差异阈值","¥0.00"],["额度预警阈值","80%"],["结余退回复核","开启"],["额度提现通道","关闭"]].map(([l,v])=>`<label class="field"><span>${l}</span><input value="${v}" /></label>`).join("")}</div><div class="drawer-actions"><button class="btn primary" data-toast="参数已保存">保存参数</button></div></div></section>`;
    $("#viewRoot").innerHTML = `<div class="page">${pageHead("系统管理", "角色权限矩阵、审批流与结算参数配置", "")}<div class="tab-row">${tabs.map((t,i)=>`<button class="${systemTab===i?"active":""}" data-system-tab="${i}">${t}</button>`).join("")}</div>${[matrix,flow,params][systemTab]}</div>`;
    setCrumb("系统管理");
    $$("[data-system-tab]").forEach(b => b.addEventListener("click", () => { systemTab = Number(b.dataset.systemTab); renderSystem(); }));
    $$("[data-toast]").forEach(b => b.addEventListener("click", () => toast(b.dataset.toast)));
  }

  /* ---------------- 列表配置 ---------------- */
  const listDefs = {
    "企业合约": {
      title: "企业合约", desc: "企业委托资金、保障范围与结余规则", pageSize: 6,
      kpis: [["▤", "企业合约", "10", "生效 7 家", "blue"], ["◈", "合约总额", money(8460000), "委托资金", "green"], ["◷", "待审核", "1", "需要审批", "orange"], ["¥", "平均费率", "3.8%", "管理费 / 服务费", "purple"]],
      filters: [{ key: "keyword", label: "企业名称 / 合约编号", placeholder: "搜索企业或合约编号", wide: true }, { key: "status", label: "合约状态", type: "select", options: () => [...new Set(contracts.map(c => c.status))] }],
      actions: [{ label: "新建企业合约", primary: true, fields: [["企业名称", "name"], ["法人主体", "legal"], ["合约总额", "amount", "", "number"], ["保障项目", "projects"], ["结余规则", "balance", "", "select", ["退回企业", "滚存至下期", "按比例分配"]]] }, { label: "导出合约", type: "export" }],
      columns: [
        { key: "id", label: "合约编号", type: "main", sub: "period" }, { key: "name", label: "企业名称" }, { key: "legal", label: "法人主体" },
        { key: "amount", label: "合约总额", type: "money" }, { key: "projects", label: "保障项目" }, { key: "people", label: "保障人群" },
        { key: "feeRate", label: "费率" }, { key: "balanceRule", label: "结余规则" }, { key: "status", label: "状态", type: "status" }
      ],
      rows: contracts, detailRoute: row => "企业合约/" + row.id
    },
    "企业资金账户": {
      title: "企业资金账户", desc: "企业委托资金池、到账登记与结余处理", pageSize: 6,
      filters: [{ key: "keyword", label: "企业名称", placeholder: "搜索企业", wide: true }, { key: "status", label: "账户状态", type: "select", options: () => [...new Set(accounts.map(a => a.status))] }],
      actions: [{ label: "到账登记", primary: true, fields: [["企业", "name"], ["到账金额", "amount", "", "number"], ["到账日期", "date", "2026-11-09", "date"], ["银行流水号", "serial"]] }, { label: "结余处理", fields: [["企业", "name"], ["处理方式", "rule", "", "select", ["退回企业", "滚存至下期", "按比例分配"]]] }],
      columns: [{ key: "name", label: "企业", type: "main", sub: "id" }, { key: "contract", label: "合约总额", type: "money" }, { key: "received", label: "累计到账", type: "money" }, { key: "consumed", label: "已消费", type: "money" }, { key: "frozen", label: "冻结中", type: "money" }, { key: "available", label: "可用余额", type: "money", green: true }, { key: "balance", label: "结余", type: "money" }, { key: "status", label: "状态", type: "status" }],
      rows: accounts
    },
    "员工额度账户": {
      title: "员工额度账户", desc: "按企业方案下发的健康管理直付额度，不可提现", pageSize: 6,
      filters: [{ key: "keyword", label: "员工 / 企业", placeholder: "搜索员工或企业", wide: true }, { key: "status", label: "账户状态", type: "select", options: () => [...new Set(quotas.map(q => q.status))] }],
      actions: [{ label: "额度下发", primary: true, fields: [["企业", "enterprise"], ["下发批次", "batch", "2026 年度额度"], ["覆盖人数", "count", "286", "number"], ["额度模板", "template", "", "select", ["按职级差异化", "统一额度", "按工龄"]]] }, { label: "导出额度表", type: "export" }],
      columns: [{ key: "name", label: "员工", type: "main", sub: "id" }, { key: "enterprise", label: "企业" }, { key: "level", label: "职级 / 工龄" }, { key: "annual", label: "年度额度", type: "money" }, { key: "categories", label: "分项额度" }, { key: "used", label: "已用 / 冻结" }, { key: "available", label: "可用", type: "money", green: true }, { key: "family", label: "家属共享" }, { key: "status", label: "状态", type: "status" }],
      rows: quotas, processFields: [["调整类型", "type", "", "select", ["升额", "降额", "冻结", "结转"]], ["调整金额", "amount", "", "number"], ["调整原因", "reason"]] 
    },
    "机构合约": {
      title: "机构合约", desc: "机构账期、结算规则与收款账户", pageSize: 6,
      kpis: [["▥", "合作机构", "10", "生效 8 家", "blue"], ["◷", "T+3 机构", "4", "医院 / 体检优先", "orange"], ["¥", "平均服务费率", "3.0%", "按合约", "green"], ["!", "待审核", "1", "资质审核", "red"]],
      filters: [{ key: "keyword", label: "机构名称 / 合约编号", placeholder: "搜索机构", wide: true }, { key: "status", label: "状态", type: "select", options: () => [...new Set(institutionContracts.map(i => i.status))] }],
      actions: [{ label: "新建机构合约", primary: true, fields: [["机构名称", "name"], ["机构类型", "type"], ["结算周期", "cycle", "", "select", ["月结", "周结", "季结"]], ["账期", "term", "", "select", ["T+3", "T+7", "T+15"]], ["费率", "fee"]] }, { label: "导出机构合约", type: "export" }],
      columns: [{ key: "id", label: "机构合约", type: "main", sub: "type" }, { key: "name", label: "机构名称" }, { key: "cycle", label: "结算周期" }, { key: "term", label: "账期" }, { key: "fee", label: "费率" }, { key: "account", label: "收款账户" }, { key: "scope", label: "服务范围" }, { key: "status", label: "状态", type: "status" }],
      rows: institutionContracts, detailRoute: row => "机构合约/" + row.id
    },
    "消费明细": {
      title: "消费明细", desc: "机构上传 / 同步的员工消费，经过额度与企业合约校验", pageSize: 6,
      filters: [{ key: "keyword", label: "员工 / 机构 / 单号", placeholder: "搜索消费明细", wide: true }, { key: "verify", label: "校验状态", type: "select", options: () => [...new Set(consumptions.map(c => c.verify))] }, { key: "status", label: "结算状态", type: "select", options: () => [...new Set(consumptions.map(c => c.status))] }],
      actions: [{ label: "导出消费明细", type: "export" }, { label: "重新校验", fields: [["校验批次", "batch", "2026-11-09"], ["校验范围", "scope", "", "select", ["当日全部", "仅待校验", "异常重试"]]] }],
      columns: [{ key: "id", label: "消费单号", type: "main", sub: "date" }, { key: "employee", label: "员工" }, { key: "institution", label: "机构" }, { key: "service", label: "服务" }, { key: "amount", label: "消费金额", type: "money" }, { key: "verify", label: "校验状态", type: "status" }, { key: "anomaly", label: "异常标记" }, { key: "status", label: "结算状态", type: "status" }],
      rows: consumptions, processFields: [["处理方式", "action", "", "select", ["通过校验", "标记异常", "退款", "冲正"]], ["处理说明", "note"]]
    },
    "异常消费池": {
      title: "异常消费池", desc: "额度不足、重复上传、非保障项目等异常不进入结算", pageSize: 6,
      filters: [{ key: "keyword", label: "员工 / 机构 / 单号", placeholder: "搜索异常消费", wide: true }, { key: "type", label: "异常类型", type: "select", options: () => [...new Set(anomalies.map(a => a.type))] }, { key: "status", label: "工单状态", type: "select", options: () => [...new Set(anomalies.map(a => a.status))] }],
      actions: [{ label: "批量指派", fields: [["负责人", "owner", "", "select", ["王琳", "陈晓", "赵敏"]], ["处理说明", "note"]] }, { label: "导出异常清单", type: "export" }],
      columns: [{ key: "id", label: "异常单号", type: "main", sub: "date" }, { key: "type", label: "异常类型", type: "status" }, { key: "employee", label: "员工" }, { key: "institution", label: "机构" }, { key: "amount", label: "涉及金额", type: "money" }, { key: "status", label: "工单状态", type: "status" }, { key: "owner", label: "负责人" }],
      rows: anomalies
    },
    "机构对账": {
      title: "机构对账", desc: "平台清算明细与机构消费明细逐笔核对", pageSize: 6,
      filters: [{ key: "keyword", label: "机构 / 对账批次", placeholder: "搜索机构或对账批次", wide: true }, { key: "status", label: "对账状态", type: "select", options: () => [...new Set(reconciliations.map(r => r.status))] }],
      actions: [{ label: "重跑对账", primary: true, fields: [["对账日期", "date", "2026-11-09", "date"], ["机构范围", "scope", "", "select", ["全部机构", "仅待对账", "仅有差异"]]] }, { label: "导出对账单", type: "export" }],
      columns: [{ key: "id", label: "对账批次", type: "main", sub: "period" }, { key: "institution", label: "机构" }, { key: "internal", label: "内部明细" }, { key: "external", label: "机构明细" }, { key: "matched", label: "匹配" }, { key: "difference", label: "差异" }, { key: "diffType", label: "差异类型" }, { key: "status", label: "对账状态", type: "status" }],
      rows: reconciliations, processFields: [["差异处理", "action", "", "select", ["补单", "冲正", "挂账", "人工核销"]], ["处理说明", "note"]]
    },
    "差错工单": {
      title: "差错工单", desc: "差异自动转工单，支持指派、处理、复核、关闭", pageSize: 6,
      filters: [{ key: "keyword", label: "工单号 / 机构", placeholder: "搜索工单", wide: true }, { key: "status", label: "工单状态", type: "select", options: () => [...new Set(tickets.map(t => t.status))] }],
      actions: [{ label: "新建差错工单", primary: true, fields: [["来源", "source", "", "select", ["对账批次", "异常消费", "机构申诉", "打款失败"]], ["机构", "institution"], ["差错类型", "type"], ["涉及金额", "amount", "", "number"]] }],
      columns: [{ key: "id", label: "工单号", type: "main", sub: "created" }, { key: "source", label: "来源" }, { key: "institution", label: "机构" }, { key: "type", label: "差错类型" }, { key: "amount", label: "涉及金额", type: "money" }, { key: "assignee", label: "处理人" }, { key: "status", label: "状态", type: "status" }],
      rows: tickets
    },
    "机构结算单": {
      title: "机构结算单", desc: "按合约账期生成，机构确认后进入打款", pageSize: 6,
      filters: [{ key: "keyword", label: "结算单号 / 机构", placeholder: "搜索结算单", wide: true }, { key: "status", label: "结算状态", type: "select", options: () => [...new Set(settlementOrders.map(s => s.status))] }],
      actions: [{ label: "生成结算单", primary: true, fields: [["机构", "institution"], ["结算周期", "cycle", "", "select", ["本期", "上期", "自定义"]], ["账期", "term", "", "select", ["T+3", "T+7", "T+15"]]] }, { label: "批量确认", fields: [["选中范围", "scope", "", "select", ["全部待确认", "仅 T+3 机构"]]] }],
      columns: [{ key: "id", label: "结算单号", type: "main", sub: "period" }, { key: "institution", label: "机构" }, { key: "count", label: "消费笔数" }, { key: "amount", label: "机构应结", type: "money" }, { key: "status", label: "结算状态", type: "status" }, { key: "term", label: "账期" }, { key: "due", label: "应付日期" }, { key: "invoice", label: "发票" }],
      rows: settlementOrders, detailRoute: row => "机构结算单/" + row.id,
      processFields: [["处理动作", "action", "", "select", ["调整金额", "挂起", "撤销", "机构确认", "生成打款单"]], ["处理说明", "note"]]
    },
    "打款管理": {
      title: "打款管理", desc: "批量打款、失败重试、退票处理与回单上传", pageSize: 6,
      filters: [{ key: "keyword", label: "打款单 / 机构", placeholder: "搜索打款单", wide: true }, { key: "status", label: "打款状态", type: "select", options: () => [...new Set(payments.map(p => p.status))] }],
      actions: [{ label: "批量打款", primary: true, fields: [["打款范围", "scope", "", "select", ["全部待打款", "仅 T+3 机构"]], ["打款方式", "method", "", "select", ["银行转账", "网银代付"]], ["预约时间", "date", "2026-11-09", "date"]] }, { label: "导出回单", type: "export" }],
      columns: [{ key: "id", label: "打款单", type: "main", sub: "date" }, { key: "institution", label: "机构" }, { key: "statement", label: "结算单" }, { key: "amount", label: "打款金额", type: "money" }, { key: "method", label: "打款方式" }, { key: "status", label: "状态", type: "status" }],
      rows: payments, processFields: [["处理动作", "action", "", "select", ["失败重试", "上传回单", "退票处理", "确认成功"]], ["处理说明", "note"]]
    },
    "企业账单": {
      title: "企业账单", desc: "按企业、成本中心与服务类型汇总，支持确认与争议", pageSize: 6,
      filters: [{ key: "keyword", label: "企业 / 账单号", placeholder: "搜索企业或账单号", wide: true }, { key: "status", label: "确认状态", type: "select", options: () => [...new Set(bills.map(b => b.status))] }],
      actions: [{ label: "导出企业账单", type: "export" }, { label: "发起账单", primary: true, fields: [["企业", "enterprise"], ["账期", "period", "2026-11"], ["成本中心", "costCenter"]] }],
      columns: [{ key: "id", label: "账单号", type: "main", sub: "period" }, { key: "enterprise", label: "企业" }, { key: "costCenter", label: "成本中心" }, { key: "services", label: "服务类型" }, { key: "amount", label: "账单金额", type: "money" }, { key: "status", label: "确认状态", type: "status" }, { key: "due", label: "应收日期" }],
      rows: bills, processFields: [["处理动作", "action", "", "select", ["企业确认", "标记争议", "导出账单", "催收回款"]], ["处理说明", "note"]]
    },
    "发票管理": {
      title: "发票管理", desc: "发票列表、三单匹配、查验、红冲与重开", pageSize: 6,
      filters: [{ key: "keyword", label: "发票号 / 企业", placeholder: "搜索发票", wide: true }, { key: "status", label: "发票状态", type: "select", options: () => [...new Set(invoices.map(i => i.status))] }],
      actions: [{ label: "发票查验", fields: [["发票号", "invoice"], ["查验方式", "way", "", "select", ["税务平台", "人工核验"]]] }, { label: "发票查重", fields: [["企业", "enterprise"], ["金额", "amount", "", "number"]] }],
      columns: [{ key: "id", label: "发票号", type: "main", sub: "date" }, { key: "enterprise", label: "企业" }, { key: "statement", label: "结算单" }, { key: "bill", label: "企业账单" }, { key: "amount", label: "开票金额", type: "money" }, { key: "match", label: "三单匹配", type: "status" }, { key: "status", label: "发票状态", type: "status" }],
      rows: invoices, processFields: [["处理动作", "action", "", "select", ["查验", "查重", "红冲", "重开"]], ["处理说明", "note"]]
    },
    "结余处理": {
      title: "结余处理", desc: "企业委托资金到期结余：退回、滚存或按比例分配", pageSize: 6,
      filters: [{ key: "keyword", label: "企业 / 处理单", placeholder: "搜索企业或处理单", wide: true }, { key: "status", label: "处理状态", type: "select", options: () => [...new Set(balances.map(b => b.status))] }],
      actions: [{ label: "新建结余处理", primary: true, fields: [["企业", "enterprise"], ["结余金额", "amount", "", "number"], ["处理方式", "rule", "", "select", ["退回企业", "滚存至下期", "按比例分配"]], ["计算依据", "basis"]] }],
      columns: [{ key: "id", label: "处理单", type: "main", sub: "created" }, { key: "enterprise", label: "企业" }, { key: "amount", label: "结余金额", type: "money" }, { key: "rule", label: "处理方式" }, { key: "status", label: "状态", type: "status" }, { key: "handler", label: "经办人" }],
      rows: balances, processFields: [["复核结果", "result", "", "select", ["复核通过", "退回补充材料", "挂起待查"]], ["复核意见", "note"]]
    },
    "审计日志": {
      title: "审计日志", desc: "资金到账、额度下发、对账、结算、打款全链路留痕", pageSize: 7,
      filters: [{ key: "keyword", label: "操作人 / 模块 / 对象", placeholder: "搜索审计日志", wide: true }, { key: "module", label: "模块", type: "select", options: () => [...new Set(auditLogs.map(a => a.module))] }],
      actions: [{ label: "导出审计日志", type: "export" }],
      columns: [{ key: "time", label: "时间", type: "main", sub: "id" }, { key: "user", label: "操作人" }, { key: "module", label: "模块" }, { key: "action", label: "操作" }, { key: "before", label: "变更前" }, { key: "after", label: "变更后" }, { key: "reason", label: "原因" }],
      rows: auditLogs
    }
  };

  /* ---------------- 初始化 ---------------- */
  document.addEventListener("click", e => {
    if (e.target.closest("[data-close-overlay]")) { closeOverlays(); return; }
    if (e.target.closest("[data-submit-message]")) { const m = e.target.closest("[data-submit-message]").dataset.submitMessage; closeOverlays(); toast(m); return; }
    if (e.target.closest("[data-toast]")) { toast(e.target.closest("[data-toast]").dataset.toast); return; }
  });
  $("#overlay").addEventListener("click", closeOverlays);
  $("#drawerClose").addEventListener("click", closeOverlays);
  $("#modalClose").addEventListener("click", closeOverlays);
  $("#roleSwitch").addEventListener("change", e => {
    role = e.target.value;
    applyMenuRole();
    toast("已切换为「" + roleNames[role] + "」，菜单已按角色调整");
    if (!canAccess(currentBase)) { location.hash = "#/工作台"; render(); }
  });
  window.addEventListener("hashchange", render);
  window.addEventListener("keydown", e => { if (e.key === "Escape") closeOverlays(); });
  applyMenuRole();
  if (!location.hash) location.hash = "#/工作台";
  render();
})();
