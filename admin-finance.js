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

  const businessContracts = [
    { id: "企康合约-2026-0001", name: "中石油华北分公司", legal: "中国石油天然气股份有限公司华北分公司", amount: 1250000, projects: "体检、购药、直付医疗", people: "员工本人 + 家属", period: "2026-01-01 — 2026-12-31", fee: "3.5%", balance: "退回企业", status: "生效" },
    { id: "企康合约-2026-0002", name: "金融街控股", legal: "金融街控股股份有限公司", amount: 860000, projects: "体检、健管服务", people: "员工本人", period: "2026-01-01 — 2026-12-31", fee: "4.0%", balance: "滚存至下期", status: "生效" },
    { id: "企康合约-2026-0003", name: "望京科技园", legal: "北京望京科技园有限公司", amount: 300000, projects: "体检、购药", people: "员工本人", period: "2026-01-01 — 2026-12-31", fee: "3.8%", balance: "按 7:3 分配", status: "待审核" },
    { id: "企康合约-2026-0004", name: "方园中心", legal: "北京方园中心有限公司", amount: 800000, projects: "体检、购药、直付医疗", people: "员工本人 + 家属", period: "2026-01-01 — 2026-12-31", fee: "4.2%", balance: "退回企业", status: "生效" },
    { id: "企康合约-2026-0005", name: "北京北大医疗康复医院", legal: "北京北大医疗康复医院有限公司", amount: 200000, projects: "体检、健管服务", people: "员工本人", period: "2026-03-01 — 2026-11-30", fee: "3.0%", balance: "滚存至下期", status: "冻结" },
    { id: "企康合约-2026-0006", name: "中化能源", legal: "中化能源股份有限公司", amount: 680000, projects: "体检、购药、健管服务", people: "员工本人", period: "2026-01-01 — 2026-12-31", fee: "3.6%", balance: "按 7:3 分配", status: "生效" },
    { id: "企康合约-2026-0007", name: "中国建投", legal: "中国建银投资有限责任公司", amount: 920000, projects: "体检、直付医疗", people: "员工本人 + 家属", period: "2026-01-01 — 2026-12-31", fee: "4.5%", balance: "退回企业", status: "生效" },
    { id: "企康合约-2026-0008", name: "京东方集团", legal: "京东方科技集团股份有限公司", amount: 1500000, projects: "体检、购药、直付医疗、健管服务", people: "员工本人 + 家属", period: "2026-01-01 — 2026-12-31", fee: "3.2%", balance: "滚存至下期", status: "生效" },
    { id: "企康合约-2026-0009", name: "北汽集团", legal: "北京汽车集团有限公司", amount: 1100000, projects: "体检、购药、健管服务", people: "员工本人", period: "2026-01-01 — 2026-12-31", fee: "3.9%", balance: "按 7:3 分配", status: "生效" },
    { id: "企康合约-2026-0010", name: "同仁堂集团", legal: "中国北京同仁堂（集团）有限责任公司", amount: 760000, projects: "体检、购药", people: "员工本人", period: "2026-01-01 — 2026-12-31", fee: "4.1%", balance: "退回企业", status: "生效" }
  ];

  const providerContracts = [
    { id: "机构合约-2026-0001", name: "北大医疗健康管理中心", type: "健管机构", cycle: "月结", term: "T+3", fee: "3.0%", account: "招商银行北京分行 · 6225****1200", scope: "体检、报告解读", status: "生效" },
    { id: "机构合约-2026-0002", name: "华大医学检验实验室", type: "检验机构", cycle: "周结", term: "T+3", fee: "2.5%", account: "中国银行北京分行 · 6225****1237", scope: "医学检验、专项筛查", status: "生效" },
    { id: "机构合约-2026-0003", name: "云诊互联网医院", type: "互联网医院", cycle: "季结", term: "T+7", fee: "4.0%", account: "工商银行北京分行 · 6225****1274", scope: "线上问诊、复诊", status: "生效" },
    { id: "机构合约-2026-0004", name: "远健运动康复中心", type: "康复机构", cycle: "月结", term: "T+3", fee: "3.2%", account: "建设银行北京分行 · 6225****1311", scope: "运动康复、体测", status: "生效" },
    { id: "机构合约-2026-0005", name: "北京协和体检中心", type: "体检机构", cycle: "周结", term: "T+3", fee: "2.8%", account: "招商银行北京分行 · 6225****1348", scope: "年度体检、深度筛查", status: "生效" },
    { id: "机构合约-2026-0006", name: "同仁堂大药房", type: "药房", cycle: "季结", term: "T+7", fee: "3.5%", account: "北京银行 · 6225****1385", scope: "药品、营养补剂", status: "生效" },
    { id: "机构合约-2026-0007", name: "美年大健康望京分院", type: "体检机构", cycle: "月结", term: "T+7", fee: "3.0%", account: "中信银行北京分行 · 6225****1422", scope: "体检、报告解读", status: "待审核" },
    { id: "机构合约-2026-0008", name: "北大国际医院", type: "医院", cycle: "周结", term: "T+3", fee: "2.0%", account: "中国银行北京分行 · 6225****1459", scope: "直付医疗、住院", status: "生效" },
    { id: "机构合约-2026-0009", name: "安心营养科技", type: "营养机构", cycle: "季结", term: "T+15", fee: "3.8%", account: "招商银行北京分行 · 6225****1496", scope: "营养咨询、食谱", status: "生效" },
    { id: "机构合约-2026-0010", name: "康复医院健康管理部", type: "健管机构", cycle: "月结", term: "T+15", fee: "2.6%", account: "建设银行北京分行 · 6225****1533", scope: "健管服务、随访", status: "冻结" }
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

  const enterpriseFunds = [
    { id: "ENT001", name: "中石油华北分公司", contract: 1200000, received: 800000, consumed: 286400, frozen: 12000, available: 501600, expiry: "2026-12-31", status: "资金正常" },
    { id: "ENT002", name: "金融街控股", contract: 600000, received: 450000, consumed: 198600, frozen: 8000, available: 243400, expiry: "2027-02-28", status: "资金正常" },
    { id: "ENT003", name: "望京科技园", contract: 300000, received: 180000, consumed: 96400, frozen: 5000, available: 78600, expiry: "2027-05-31", status: "待补充" },
    { id: "ENT004", name: "方园中心", contract: 800000, received: 620000, consumed: 142800, frozen: 10000, available: 467200, expiry: "2027-08-31", status: "资金正常" },
    { id: "ENT005", name: "北京北大医疗康复医院", contract: 200000, received: 120000, consumed: 86500, frozen: 0, available: 33500, expiry: "2026-11-30", status: "临近到期" }
  ];

  const employeeQuotas = [
    { id: "EQ001", name: "林悦", enterprise: "中石油华北分公司", level: "P6 / 5 年", annual: 12000, categories: "体检 4,000 / 购药 3,000 / 直付 5,000", used: 3280, frozen: 0, available: 8720, status: "正常" },
    { id: "EQ002", name: "陈嘉禾", enterprise: "中石油华北分公司", level: "P5 / 2 年", annual: 8000, categories: "体检 3,000 / 购药 2,000 / 直付 3,000", used: 2450, frozen: 300, available: 5250, status: "正常" },
    { id: "EQ003", name: "周雯", enterprise: "中石油华北分公司", level: "P7 / 8 年", annual: 18000, categories: "体检 6,000 / 购药 4,000 / 直付 8,000", used: 5120, frozen: 0, available: 12880, status: "正常" },
    { id: "EQ004", name: "徐一鸣", enterprise: "中石油华北分公司", level: "P5 / 12 年", annual: 10000, categories: "体检 4,000 / 购药 3,000 / 直付 3,000", used: 7800, frozen: 1000, available: 1200, status: "额度预警" },
    { id: "EQ005", name: "何雨桐", enterprise: "金融街控股", level: "P4 / 3 年", annual: 6000, categories: "体检 2,000 / 购药 2,000 / 直付 2,000", used: 1860, frozen: 0, available: 4140, status: "正常" },
    { id: "EQ006", name: "赵启明", enterprise: "金融街控股", level: "P8 / 15 年", annual: 20000, categories: "体检 8,000 / 购药 4,000 / 直付 8,000", used: 9600, frozen: 0, available: 10400, status: "正常" },
    { id: "EQ007", name: "吴倩", enterprise: "望京科技园", level: "P4 / 1 年", annual: 5000, categories: "体检 2,000 / 购药 1,500 / 直付 1,500", used: 900, frozen: 0, available: 4100, status: "正常" },
    { id: "EQ008", name: "孙宁", enterprise: "方园中心", level: "P6 / 6 年", annual: 12000, categories: "体检 4,000 / 购药 4,000 / 直付 4,000", used: 3800, frozen: 0, available: 8200, status: "正常" }
  ];

  const enterpriseBills = [
    { id: "EB202610001", enterprise: "中石油华北分公司", period: "2026-10", orders: 128, amount: 286400, status: "待企业确认", due: "2026-10-31" },
    { id: "EB202610002", enterprise: "金融街控股", period: "2026-10", orders: 86, amount: 198600, status: "待企业确认", due: "2026-10-31" },
    { id: "EB202610003", enterprise: "望京科技园", period: "2026-10", orders: 42, amount: 96400, status: "已确认", due: "2026-10-25" },
    { id: "EB202610004", enterprise: "方园中心", period: "2026-10", orders: 63, amount: 142800, status: "待企业确认", due: "2026-11-05" }
  ];

  const institutionSettlements = [
    { id: "IS202610001", name: "北大医疗健康管理中心", type: "健管机构", term: "T+3", count: 128, enterprise: 268400, employee: 18000, fee: 14320, payable: 300720, status: "待机构确认", due: "2026-10-24" },
    { id: "IS202610002", name: "华大医学检验实验室", type: "检验机构", term: "T+3", count: 86, enterprise: 186000, employee: 12600, fee: 9920, payable: 208520, status: "待打款", due: "2026-10-23" },
    { id: "IS202610003", name: "云诊互联网医院", type: "互联网医院", term: "T+7", count: 42, enterprise: 98400, employee: 6400, fee: 5240, payable: 110040, status: "已打款", due: "2026-10-20" },
    { id: "IS202610004", name: "远健运动康复中心", type: "康复机构", term: "T+5", count: 36, enterprise: 58200, employee: 4200, fee: 3120, payable: 65520, status: "对账中", due: "2026-10-26" }
  ];

  const kaBills = [
    { id: "KA001", enterprise: "中石油华北分公司", split: "总部 / 分公司 / 部门", fields: "合同号、成本中心编码、项目编码", cycle: "月结", merge: "分法人独立结算", status: "已启用" },
    { id: "KA002", enterprise: "金融街控股", split: "法人 / 成本中心", fields: "合同号、项目编码、员工编号", cycle: "月结", merge: "集团合并账单", status: "已启用" },
    { id: "KA003", enterprise: "望京科技园", split: "园区 / 企业 / 部门", fields: "合同号、成本中心编码", cycle: "季结", merge: "独立结算", status: "配置中" }
  ];

  const riskAlerts = [
    { id: "RK202610001", type: "额度异常", subject: "徐一鸣", detail: "短时间内在 3 家机构并发消费，额度已用 78%", amount: 1280, level: "高", status: "待处理", owner: "王琳" },
    { id: "RK202610002", type: "机构重复上传", subject: "华大医学检验实验室", detail: "同一消费明细重复上传 2 次", amount: 7560, level: "高", status: "待核查", owner: "陈晓" },
    { id: "RK202610003", type: "企业资金敞口", subject: "望京科技园", detail: "已消费金额接近到账金额，可用余额偏低", amount: 78600, level: "中", status: "跟进中", owner: "王琳" },
    { id: "RK202610004", type: "合规校验", subject: "方园中心", detail: "结余退回申请缺少结余计算依据", amount: 142800, level: "中", status: "待处理", owner: "陈晓" }
  ];

  let settlementModule = "企业资金";
  let businessTab = "业务方档案";
  let providerTab = "服务商档案";

  function renderBusiness() {
    const archive = businessTab === "业务方档案";
    const action = archive ? `<button class="btn primary" data-party-new="1">${icon("plus")}新增业务方</button>` : `<button class="btn primary" data-contract-new="business">${icon("plus")}新增企业合约</button>`;
    const archiveTable = `<section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>业务方</th><th>类型</th><th>联系人</th><th>合作项目</th><th>合同周期</th><th>结算方式</th><th>状态</th><th></th></tr></thead><tbody>${businessParties.map(p => `<tr><td><span class="cell-main">${esc(p.name)}</span><span class="cell-sub">${esc(p.id)}</span></td><td>${tag(p.type, "blue")}</td><td>${esc(p.contact)}<span class="cell-sub">${esc(p.phone)}</span></td><td>${p.projects.map(x => tag(x, "green")).join(" ")}</td><td>${esc(p.period)}</td><td>${esc(p.settle)}</td><td>${tag(p.status, p.status === "合作中" ? "green" : "gold")}</td><td><button class="panel-link" data-party-edit="${p.id}">编辑 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    const contractTable = `<section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>合约编号</th><th>企业 / 法人主体</th><th>合约总额</th><th>保障项目</th><th>保障人群</th><th>有效期</th><th>费率</th><th>结余规则</th><th>状态</th><th></th></tr></thead><tbody>${businessContracts.map(c => `<tr><td><b class="cell-main">${esc(c.id)}</b></td><td><b class="cell-main">${esc(c.name)}</b><span class="cell-sub">${esc(c.legal)}</span></td><td>${money(c.amount)}</td><td>${esc(c.projects)}</td><td>${esc(c.people)}</td><td>${esc(c.period)}</td><td>${esc(c.fee)}</td><td>${esc(c.balance)}</td><td>${tag(c.status, c.status === "生效" ? "green" : c.status === "冻结" ? "slate" : "gold")}</td><td><button class="panel-link" data-contract-view="business" data-id="${c.id}">查看 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    const html = `${pageHead("业务方管理", "BUSINESS PARTNERS", action)}
      <div class="filter-bar"><span class="tag blue">业务方 ${businessParties.length}</span><span class="tag green">企业合约 ${businessContracts.length}</span><span class="tag gold">待审核 1</span></div>
      <div class="checkin-tabs"><button class="${archive ? "active" : ""}" data-business-tab="业务方档案">业务方档案<b>${businessParties.length}</b></button><button class="${!archive ? "active" : ""}" data-business-tab="企业合约">企业合约<b>${businessContracts.length}</b></button></div>
      ${archive ? archiveTable : contractTable}`;
    $("#viewRoot").innerHTML = html;
    setTop("业务方管理", "合作方管理 / 业务方管理", "business-parties");
    $$("[data-business-tab]").forEach(b => b.addEventListener("click", () => { businessTab = b.dataset.businessTab; renderBusiness(); }));
    $$("[data-party-edit]").forEach(b => b.addEventListener("click", () => openPartyEditor(b.dataset.partyEdit)));
    $$("[data-party-new]").forEach(b => b.addEventListener("click", () => openPartyEditor("")));
    $$("[data-contract-view]").forEach(b => b.addEventListener("click", () => openContractView(b.dataset.contractView, b.dataset.id)));
    $$("[data-contract-new]").forEach(b => b.addEventListener("click", () => openContractEditor(b.dataset.contractNew)));
  }

  function openContractView(kind, id) {
    const c = (kind === "business" ? businessContracts : providerContracts).find(x => x.id === id); if (!c) return;
    const isBusiness = kind === "business";
    openDrawer(`<p class="page-eyebrow">${isBusiness ? "ENTERPRISE CONTRACT" : "INSTITUTION CONTRACT"}</p><h2>${esc(c.name)}</h2><p class="drawer-sub">${esc(c.id)} · ${esc(c.status)}</p>
      <div class="drawer-section"><div class="info-list">${isBusiness ? `<div class="info-item"><small>法人主体</small><b>${esc(c.legal)}</b></div><div class="info-item"><small>合约总额</small><b>${money(c.amount)}</b></div><div class="info-item"><small>保障项目</small><b>${esc(c.projects)}</b></div><div class="info-item"><small>保障人群</small><b>${esc(c.people)}</b></div><div class="info-item"><small>有效期</small><b>${esc(c.period)}</b></div><div class="info-item"><small>费率 / 结余</small><b>${esc(c.fee)} · ${esc(c.balance)}</b></div>` : `<div class="info-item"><small>机构类型</small><b>${esc(c.type)}</b></div><div class="info-item"><small>结算周期 / 账期</small><b>${esc(c.cycle)} · ${esc(c.term)}</b></div><div class="info-item"><small>费率</small><b>${esc(c.fee)}</b></div><div class="info-item"><small>收款账户</small><b>${esc(c.account)}</b></div><div class="info-item"><small>服务范围</small><b>${esc(c.scope)}</b></div>`}</div></div>
      <div class="drawer-section"><h3>合约审计</h3><div class="info-list"><div class="info-item"><small>创建人</small><b>李明</b></div><div class="info-item"><small>更新时间</small><b>2026-11-09 14:30</b></div></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>关闭</button><button class="btn primary" data-toast="合约已进入编辑状态">编辑合约</button></div>`);
  }

  function openContractEditor(kind) {
    const isBusiness = kind === "business";
    openDrawer(`<p class="page-eyebrow">${isBusiness ? "ENTERPRISE CONTRACT" : "INSTITUTION CONTRACT"}</p><h2>新增${isBusiness ? "企业合约" : "机构合约"}</h2><p class="drawer-sub">${isBusiness ? "保障范围、资金方案与结余规则" : "结算周期、账期与收款账户"}</p>
      <div class="drawer-section"><div class="publish-form"><label class="field"><span>${isBusiness ? "企业名称" : "机构名称"}</span><input /></label><label class="field"><span>${isBusiness ? "法人主体" : "机构类型"}</span><input /></label><label class="field"><span>${isBusiness ? "合约总额" : "结算周期"}</span><input /></label><label class="field"><span>${isBusiness ? "费率" : "账期"}</span><input /></label><label class="field full"><span>${isBusiness ? "保障项目" : "服务范围"}</span><input /></label></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-toast="合约已保存">保存</button></div>`);
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
    const archive = providerTab === "服务商档案";
    const action = archive ? `<button class="btn primary" data-provider-new="1">${icon("plus")}新增服务商</button>` : `<button class="btn primary" data-contract-new="provider">${icon("plus")}新增机构合约</button>`;
    const archiveTable = `<section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>服务商</th><th>服务类别</th><th>联系人</th><th>资质</th><th>结算周期</th><th>上游结算</th><th>下游结算</th><th>状态</th><th></th></tr></thead><tbody>${providers.map(p => `<tr><td><span class="cell-main">${esc(p.name)}</span><span class="cell-sub">${esc(p.id)}</span></td><td>${tag(p.category, "blue")}</td><td>${esc(p.contact)}<span class="cell-sub">${esc(p.phone)}</span></td><td>${tag(p.license, "green")}</td><td>${esc(p.cycle)}</td><td>${esc(p.upstream)}</td><td>${esc(p.downstream)}</td><td>${tag(p.status, p.status === "合作中" ? "green" : "gold")}</td><td><button class="panel-link" data-provider-edit="${p.id}">编辑 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    const contractTable = `<section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>机构合约</th><th>机构名称</th><th>类型</th><th>结算周期</th><th>账期</th><th>费率</th><th>收款账户</th><th>服务范围</th><th>状态</th><th></th></tr></thead><tbody>${providerContracts.map(c => `<tr><td><b class="cell-main">${esc(c.id)}</b></td><td><b class="cell-main">${esc(c.name)}</b></td><td>${tag(c.type, "blue")}</td><td>${esc(c.cycle)}</td><td>${tag(c.term, c.term === "T+3" ? "red" : "blue")}</td><td>${esc(c.fee)}</td><td>${esc(c.account)}</td><td>${esc(c.scope)}</td><td>${tag(c.status, c.status === "生效" ? "green" : c.status === "冻结" ? "slate" : "gold")}</td><td><button class="panel-link" data-contract-view="provider" data-id="${c.id}">查看 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    const html = `${pageHead("服务商管理", "SERVICE PROVIDERS", action)}
      <div class="filter-bar"><span class="tag blue">服务商 ${providers.length}</span><span class="tag green">机构合约 ${providerContracts.length}</span><span class="tag gold">T+3 机构 4 家</span></div>
      <div class="checkin-tabs"><button class="${archive ? "active" : ""}" data-provider-tab="服务商档案">服务商档案<b>${providers.length}</b></button><button class="${!archive ? "active" : ""}" data-provider-tab="机构合约">机构合约<b>${providerContracts.length}</b></button></div>
      ${archive ? archiveTable : contractTable}`;
    $("#viewRoot").innerHTML = html;
    setTop("服务商管理", "合作方管理 / 服务商管理", "providers");
    $$("[data-provider-tab]").forEach(b => b.addEventListener("click", () => { providerTab = b.dataset.providerTab; renderProviders(); }));
    $$("[data-provider-edit]").forEach(b => b.addEventListener("click", () => openProviderEditor(b.dataset.providerEdit)));
    $$("[data-provider-new]").forEach(b => b.addEventListener("click", () => openProviderEditor("")));
    $$("[data-contract-view]").forEach(b => b.addEventListener("click", () => openContractView(b.dataset.contractView, b.dataset.id)));
    $$("[data-contract-new]").forEach(b => b.addEventListener("click", () => openContractEditor(b.dataset.contractNew)));
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
    const modules = ["企业资金", "员工额度", "机构清算", "对账管理", "差异处理", "结算单", "开票记录", "KA结算", "风控稽核", "报表分析", "规则配置"];
    let content = "";

    if (settlementModule === "企业资金") {
      content = `<div class="settlement-note"><span class="tag blue">委托资金池</span> 企业先划拨委托资金，员工在额度内消费，平台按机构账期直付结算</div>
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">企业资金账户</h3><p class="panel-sub">合约总额 / 到账 / 消费 / 冻结 / 可用 / 结余</p></div><div class="page-actions"><button class="btn small" data-enterprise-receive="1">到账登记</button><button class="btn small" data-enterprise-balance="1">结余处理</button></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>企业</th><th>合约总额</th><th>已到账</th><th>已消费</th><th>冻结中</th><th>可用余额</th><th>结余规则</th><th>状态</th><th></th></tr></thead><tbody>${enterpriseFunds.map(f => `<tr><td><b class="cell-main">${esc(f.name)}</b><span class="cell-sub">${esc(f.id)} · 到期 ${esc(f.expiry)}</span></td><td>${money(f.contract)}</td><td>${money(f.received)}</td><td>${money(f.consumed)}</td><td>${money(f.frozen)}</td><td><b class="cell-main">${money(f.available)}</b></td><td>${tag("退回企业 / 可滚存", "blue")}</td><td>${tag(f.status, f.status === "资金正常" ? "green" : "gold")}</td><td><button class="panel-link" data-enterprise-view="${f.id}">资金台账 →</button></td></tr>`).join("")}</tbody></table></div></section>
        <section class="panel" style="margin-top:12px"><div class="panel-head"><div><h3 class="panel-title">企业账单与对账</h3></div><span class="tag gold">待确认 ${enterpriseBills.filter(b => b.status === "待企业确认").length}</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>账单号</th><th>企业</th><th>账期</th><th>订单数</th><th>账单金额</th><th>确认状态</th><th>应收日期</th><th></th></tr></thead><tbody>${enterpriseBills.map(b => `<tr><td><b class="cell-main">${esc(b.id)}</b></td><td>${esc(b.enterprise)}</td><td>${esc(b.period)}</td><td>${b.orders}</td><td><b class="cell-main">${money(b.amount)}</b></td><td>${tag(b.status, b.status === "已确认" ? "green" : "gold")}</td><td>${esc(b.due)}</td><td><button class="panel-link" data-enterprise-bill="${b.id}">${b.status === "已确认" ? "查看 →" : "确认对账 →"}</button></td></tr>`).join("")}</tbody></table></div></section>`;
    } else if (settlementModule === "员工额度") {
      const totalQuota = employeeQuotas.reduce((n, q) => n + q.annual, 0);
      const usedQuota = employeeQuotas.reduce((n, q) => n + q.used, 0);
      content = `<div class="kpi-grid four">${kpiLocal("users", "已开立额度账户", employeeQuotas.length, "个", "员工 + 家属", "#2f6bff")}${kpiLocal("chart", "额度总额", money(totalQuota), "年度额度", "#8b5cf6")}${kpiLocal("check", "已使用额度", money(usedQuota), "分项目扣减", "#16a394")}${kpiLocal("heart", "额度预警", employeeQuotas.filter(q => q.status === "额度预警").length, "人", "可用额度不足", "#e8a13c")}</div>
        <div class="settlement-note"><span class="tag blue">健康管理直付账户</span> 额度按职位 / 工龄 / 企业方案差异化设定 · 不可提现 · 支持分项目限额</div>
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">员工额度账户</h3></div><button class="btn small" data-quota-grant="1">额度下发</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>员工</th><th>企业</th><th>职级 / 工龄</th><th>年度额度</th><th>分项额度</th><th>已用 / 冻结</th><th>可用</th><th>状态</th><th></th></tr></thead><tbody>${employeeQuotas.map(q => `<tr><td><b class="cell-main">${esc(q.name)}</b><span class="cell-sub">${esc(q.id)}</span></td><td>${esc(q.enterprise)}</td><td>${esc(q.level)}</td><td>${money(q.annual)}</td><td><span class="cell-sub">${esc(q.categories)}</span></td><td>${money(q.used)}<span class="cell-sub">冻结 ${money(q.frozen)}</span></td><td><b class="cell-main">${money(q.available)}</b></td><td>${tag(q.status, q.status === "正常" ? "green" : "gold")}</td><td><button class="panel-link" data-quota-view="${q.id}">调额 / 流水 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    } else if (settlementModule === "机构清算") {
      const payable = institutionSettlements.reduce((n, i) => n + i.payable, 0);
      content = `<div class="settlement-note"><span class="tag green">机构直付清算</span> 按机构合约账期生成结算单 · 医院类机构优先保障 T+3 以内</div>
        <div class="settlement-report-grid"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">机构结算单</h3><p class="panel-sub">本期应结 ${money(payable)}</p></div><span class="tag blue">${institutionSettlements.length} 家机构</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>机构</th><th>类型</th><th>账期</th><th>消费笔数</th><th>企业承担</th><th>员工自付</th><th>平台服务费</th><th>机构应结</th><th>状态</th><th></th></tr></thead><tbody>${institutionSettlements.map(i => `<tr><td><b class="cell-main">${esc(i.name)}</b><span class="cell-sub">${esc(i.id)}</span></td><td>${esc(i.type)}</td><td>${tag(i.term, i.term === "T+3" ? "red" : "blue")}</td><td>${i.count}</td><td>${money(i.enterprise)}</td><td>${money(i.employee)}</td><td>${money(i.fee)}</td><td><b class="cell-main">${money(i.payable)}</b></td><td>${tag(i.status, i.status === "已打款" ? "green" : i.status === "待打款" ? "gold" : "blue")}</td><td><button class="panel-link" data-institution-view="${i.id}">${i.status === "已打款" ? "查看 →" : "清算 / 打款 →"}</button></td></tr>`).join("")}</tbody></table></div></section>
          <section class="panel"><div class="panel-head"><div><h3 class="panel-title">机构合约与规则</h3></div></div><div class="panel-body"><div class="info-list"><div class="info-item"><small>医院类账期</small><b>T+3 硬性保障</b></div><div class="info-item"><small>体检 / 健管</small><b>按合约月结</b></div><div class="info-item"><small>药房 / 线上</small><b>T+7 / 周结</b></div><div class="info-item"><small>分账方式</small><b>企业承担 + 员工自付 + 服务费</b></div></div><div class="settlement-note" style="margin-top:11px">打款前置：机构账户有效 · 无未关闭差错工单 · 风控检查通过</div></div></section></div>`;
    } else if (settlementModule === "对账管理") {
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
    } else if (settlementModule === "KA结算") {
      content = `<div class="settlement-report-grid"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">KA 账单定制</h3><p class="panel-sub">组织拆分 · 字段映射 · 合并 / 拆分结算</p></div><button class="btn small" data-ka-config="1">新增配置</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>企业</th><th>账单拆分维度</th><th>财务字段</th><th>结算周期</th><th>合并规则</th><th>状态</th><th></th></tr></thead><tbody>${kaBills.map(k => `<tr><td><b class="cell-main">${esc(k.enterprise)}</b><span class="cell-sub">${esc(k.id)}</span></td><td>${esc(k.split)}</td><td>${esc(k.fields)}</td><td>${esc(k.cycle)}</td><td>${esc(k.merge)}</td><td>${tag(k.status, k.status === "已启用" ? "green" : "gold")}</td><td><button class="panel-link" data-ka-edit="${k.id}">配置 →</button></td></tr>`).join("")}</tbody></table></div></section><section class="panel"><div class="panel-head"><div><h3 class="panel-title">企业结算服务</h3></div></div><div class="panel-body"><div class="role-grid"><div class="role-card" style="--role:#2f6bff;--role-soft:#eef4ff"><h3>企业 HR 自助</h3><p>消费汇总 / 额度使用率 / 结余 / 待结算与已结算金额</p></div><div class="role-card" style="--role:#16a394;--role-soft:#eefbf6"><h3>企业财务开票</h3><p>按企业合并或拆分开票，关联结算单与账单，支持红冲重开</p></div><div class="role-card" style="--role:#8b5cf6;--role-soft:#f8f0ff"><h3>集团多法人</h3><p>集团客户多法人合并账单或独立结算，按合约执行</p></div></div></div></section></div>`;
    } else if (settlementModule === "风控稽核") {
      content = `<div class="settlement-note"><span class="tag red">企康专项合规</span> 委托资金专款专用 · 额度不可提现 · 机构消费真实性校验 · 全链路审计留痕</div>
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">风险与异常</h3></div><span class="tag gold">待处理 ${riskAlerts.filter(r => r.status === "待处理").length}</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>风险号</th><th>类型</th><th>对象</th><th>风险详情</th><th>涉及金额</th><th>等级</th><th>状态</th><th>负责人</th><th></th></tr></thead><tbody>${riskAlerts.map(r => `<tr><td><b class="cell-main">${esc(r.id)}</b></td><td>${tag(r.type, r.level === "高" ? "red" : "gold")}</td><td>${esc(r.subject)}</td><td>${esc(r.detail)}</td><td>${money(r.amount)}</td><td>${tag(r.level, r.level === "高" ? "red" : "gold")}</td><td>${tag(r.status, r.status === "待处理" ? "gold" : "blue")}</td><td>${esc(r.owner)}</td><td><button class="panel-link" data-risk-open="${r.id}">处理 →</button></td></tr>`).join("")}</tbody></table></div></section>
        <section class="panel" style="margin-top:12px"><div class="panel-head"><div><h3 class="panel-title">全链路审计</h3></div><span class="tag blue">最近操作</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>时间</th><th>环节</th><th>操作人</th><th>对象</th><th>金额 / 依据</th></tr></thead><tbody><tr><td>2026-10-21 10:12</td><td>企业到账登记</td><td>王琳</td><td>ENT001</td><td>¥500,000 · 银行回单</td></tr><tr><td>2026-10-21 09:40</td><td>额度下发</td><td>陈晓</td><td>EQ001-EQ120</td><td>年度额度方案 v3</td></tr><tr><td>2026-10-21 09:18</td><td>机构清算</td><td>王琳</td><td>IS202610001</td><td>¥300,720 · T+3</td></tr><tr><td>2026-10-20 17:42</td><td>差异处理</td><td>陈晓</td><td>DIF2026101901</td><td>挂起待查</td></tr></tbody></table></div></section>`;
    } else if (settlementModule === "报表分析") {
      content = `<div class="settlement-report-grid"><section class="panel report-kpis"><div class="panel-head"><div><h3 class="panel-title">核心指标</h3></div><button class="panel-link" data-toast="对账报表已导出">导出报表 →</button></div><div class="panel-body"><div class="report-kpi-grid"><div><small>总笔数匹配率</small><b>99.2%</b><span class="tag green">达标</span></div><div><small>总金额匹配率</small><b>99.8%</b><span class="tag green">达标</span></div><div><small>差异处理时效</small><b>2.4h</b><span class="tag gold">待优化</span></div><div><small>本期结算金额</small><b>${money(totalAmount)}</b></div></div></div></section><section class="panel"><div class="panel-head"><div><h3 class="panel-title">渠道匹配情况</h3></div></div><div class="panel-body metric-bars">${[["职工健康 H5", 99, "99.0%"], ["积分商城", 100, "100%"], ["企业支付", 96, "96.0%"], ["线下转账", 92, "92.0%"]].map(([l, v, d]) => `<div class="metric-bar"><span>${l}</span><div class="bar"><i style="width:${v}%"></i></div><b>${d}</b></div>`).join("")}</div></section></div><section class="panel" style="margin-top:12px"><div class="panel-head"><div><h3 class="panel-title">审计追溯</h3></div><span class="tag blue">最近操作</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>操作时间</th><th>操作人</th><th>操作类型</th><th>对象</th><th>备注</th></tr></thead><tbody><tr><td>2026-10-21 09:18</td><td>王琳</td><td>自动对账</td><td>REC20261021</td><td>匹配 126 笔，2 笔差异</td></tr><tr><td>2026-10-20 17:42</td><td>陈晓</td><td>差异处理</td><td>DIF2026101901</td><td>挂起待查，等待渠道回执</td></tr><tr><td>2026-10-18 16:06</td><td>王琳</td><td>确认收款</td><td>JS202610003</td><td>已收款并归档</td></tr></tbody></table></div></section>`;
    } else {
      content = `<div class="settlement-report-grid"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">对账规则</h3></div><button class="btn small" data-toast="规则已新增">${icon("plus")}新增规则</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>规则名称</th><th>匹配字段</th><th>执行周期</th><th>差异阈值</th><th>状态</th></tr></thead><tbody><tr><td><b class="cell-main">订单号 + 金额</b></td><td>订单号、支付金额</td><td>每日 06:00</td><td>¥0</td><td><span class="tag green">启用</span></td></tr><tr><td><b class="cell-main">渠道流水号</b></td><td>流水号、渠道</td><td>每日 06:00</td><td>¥100</td><td><span class="tag green">启用</span></td></tr><tr><td><b class="cell-main">企业转账</b></td><td>付款方、金额</td><td>每周一</td><td>¥500</td><td><span class="tag gold">暂停</span></td></tr></tbody></table></div></section><section class="panel"><div class="panel-head"><div><h3 class="panel-title">角色权限</h3></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>角色</th><th>对账</th><th>差异处理</th><th>结算</th><th>开票</th></tr></thead><tbody><tr><td>财务管理员</td><td><span class="tag green">可操作</span></td><td><span class="tag green">可操作</span></td><td><span class="tag green">可操作</span></td><td><span class="tag green">可操作</span></td></tr><tr><td>运营督导</td><td><span class="tag blue">只读</span></td><td><span class="tag green">可操作</span></td><td><span class="tag blue">只读</span></td><td><span class="tag blue">只读</span></td></tr><tr><td>业务方</td><td><span class="tag blue">只读</span></td><td><span class="tag blue">只读</span></td><td><span class="tag blue">只读</span></td><td><span class="tag gold">受限</span></td></tr></tbody></table></div></section></div>`;
    }

    const fundPool = enterpriseFunds.reduce((n, f) => n + f.available, 0);
    const quotaTotal = employeeQuotas.reduce((n, q) => n + q.annual, 0);
    const quotaUsed = employeeQuotas.reduce((n, q) => n + q.used, 0);
    const instPayable = institutionSettlements.reduce((n, i) => n + i.payable, 0);
    const todoCount = enterpriseBills.filter(b => b.status === "待企业确认").length + institutionSettlements.filter(i => i.status !== "已打款").length + riskAlerts.filter(r => r.status === "待处理").length;
    const moduleCount = t => t === "企业资金" ? enterpriseFunds.length : t === "员工额度" ? employeeQuotas.length : t === "机构清算" ? institutionSettlements.length : t === "对账管理" ? reconciliations.length : t === "差异处理" ? differences.length : t === "结算单" ? settlements.length : t === "开票记录" ? invoices.length : t === "KA结算" ? kaBills.length : t === "风控稽核" ? riskAlerts.length : "";
    const html = `${pageHead("企康结算中心", "ENTERPRISE HEALTH SETTLEMENT", `<button class="btn" data-toast="企康结算报表已导出">${icon("download")}导出报表</button>`)}
      <div class="kpi-grid four">${kpiLocal("chart", "委托资金池余额", money(fundPool), "企业未使用资金", "#2f6bff")}${kpiLocal("users", "员工额度使用率", Math.round(quotaUsed / quotaTotal * 100) + "%", `${money(quotaUsed)} / ${money(quotaTotal)}`, "#8b5cf6")}${kpiLocal("check", "本期机构应结", money(instPayable), "按机构账期直付", "#16a394")}${kpiLocal("heart", "待处理事项", todoCount, "账单 / 机构 / 风险", "#e8a13c")}</div>
      <div class="checkin-tabs settlement-tabs">${modules.map(t => `<button class="${settlementModule === t ? "active" : ""}" data-settlement-module="${t}">${t}<b>${moduleCount(t)}</b></button>`).join("")}</div>
      ${content}`;
    $("#viewRoot").innerHTML = html;
    setTop("企康结算中心", "财务结算 / 企康结算", "settlements");
    const legacyRolePanel = $$(".panel").find(p => p.querySelector(".panel-title")?.innerText === "角色权限");
    if (legacyRolePanel) { const parent = legacyRolePanel.parentElement; legacyRolePanel.remove(); if (parent) parent.style.gridTemplateColumns = "1fr"; }
    $$("[data-settlement-module]").forEach(b => b.addEventListener("click", () => { settlementModule = b.dataset.settlementModule; renderSettlements(); }));
    $$("[data-invoice-open]").forEach(b => b.addEventListener("click", () => openInvoice(b.dataset.invoiceOpen)));
    $$("[data-invoice-view]").forEach(b => b.addEventListener("click", () => { settlementModule = "开票记录"; renderSettlements(); }));
    $$("[data-diff-open]").forEach(b => b.addEventListener("click", () => openDifference(b.dataset.diffOpen)));
    $$("[data-recon-view]").forEach(b => b.addEventListener("click", () => openReconciliation(b.dataset.reconView)));
    $$("[data-auto-recon]").forEach(b => b.addEventListener("click", () => { toast("自动对账完成：匹配 126 笔，发现 2 笔差异"); }));
    $$("[data-settlement-confirm]").forEach(b => b.addEventListener("click", () => { const s = settlements.find(x => x.id === b.dataset.settlementConfirm); if (s) s.status = "已结算"; toast("收付款已确认"); renderSettlements(); }));
    $$("[data-enterprise-view]").forEach(b => b.addEventListener("click", () => openEnterprise(b.dataset.enterpriseView)));
    $$("[data-enterprise-bill]").forEach(b => b.addEventListener("click", () => confirmEnterpriseBill(b.dataset.enterpriseBill)));
    $$("[data-enterprise-receive]").forEach(b => b.addEventListener("click", openEnterpriseReceive));
    $$("[data-enterprise-balance]").forEach(b => b.addEventListener("click", openEnterpriseBalance));
    $$("[data-quota-view]").forEach(b => b.addEventListener("click", () => openQuota(b.dataset.quotaView)));
    $$("[data-quota-grant]").forEach(b => b.addEventListener("click", openQuotaGrant));
    $$("[data-institution-view]").forEach(b => b.addEventListener("click", () => openInstitution(b.dataset.institutionView)));
    $$("[data-ka-config]").forEach(b => b.addEventListener("click", () => openKaConfig("")));
    $$("[data-ka-edit]").forEach(b => b.addEventListener("click", () => openKaConfig(b.dataset.kaEdit)));
    $$("[data-risk-open]").forEach(b => b.addEventListener("click", () => openRisk(b.dataset.riskOpen)));
  }

  function openEnterprise(id) {
    const f = enterpriseFunds.find(x => x.id === id); if (!f) return;
    const bills = enterpriseBills.filter(b => b.enterprise === f.name);
    openDrawer(`<p class="page-eyebrow">ENTERPRISE FUND LEDGER</p><h2>${esc(f.name)}</h2><p class="drawer-sub">${esc(f.id)} · 合约到期 ${esc(f.expiry)}</p>
      <div class="drawer-section"><div class="info-list"><div class="info-item"><small>合约总额</small><b>${money(f.contract)}</b></div><div class="info-item"><small>已到账</small><b>${money(f.received)}</b></div><div class="info-item"><small>已消费</small><b>${money(f.consumed)}</b></div><div class="info-item"><small>冻结中</small><b>${money(f.frozen)}</b></div><div class="info-item"><small>可用余额</small><b>${money(f.available)}</b></div><div class="info-item"><small>结余处理</small><b>退回企业 / 滚存</b></div></div></div>
      <div class="drawer-section"><h3>企业账单</h3>${bills.map(b => `<div class="package-service-line"><div><b>${esc(b.id)}</b><small>${esc(b.period)} · ${b.orders} 笔</small></div><span>${money(b.amount)} · ${esc(b.status)}</span></div>`).join("")}</div>
      <div class="drawer-actions"><button class="btn primary" data-close-drawer>知道了</button></div>`);
  }

  function confirmEnterpriseBill(id) {
    const b = enterpriseBills.find(x => x.id === id); if (!b) return;
    if (b.status !== "已确认") { b.status = "已确认"; toast("企业账单已确认，进入开票环节"); renderSettlements(); }
    else toast("企业账单已确认");
  }

  function openEnterpriseReceive() {
    openDrawer(`<p class="page-eyebrow">FUND RECEIPT</p><h2>企业到账登记</h2><p class="drawer-sub">按合约 / 批次核销，未核销资金挂账</p>
      <div class="drawer-section"><div class="publish-form"><label class="field"><span>企业</span><select>${enterpriseFunds.map(f => `<option>${esc(f.name)}</option>`).join("")}</select></label><label class="field"><span>到账金额</span><input type="number" placeholder="0.00" /></label><label class="field"><span>到账日期</span><input type="date" value="2026-10-21" /></label><label class="field"><span>银行流水号</span><input placeholder="银行回单 / 流水号" /></label><label class="field full"><span>核销合约</span><input value="2026 年度委托资金合约" /></label></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-toast="到账已登记，待核销">登记到账</button></div>`);
  }

  function openEnterpriseBalance() {
    openDrawer(`<p class="page-eyebrow">BALANCE HANDLING</p><h2>结余处理</h2><p class="drawer-sub">到期 / 约定节点按规则执行，需附结余计算依据</p>
      <div class="drawer-section"><div class="publish-form"><label class="field"><span>企业</span><select>${enterpriseFunds.map(f => `<option>${esc(f.name)}</option>`).join("")}</select></label><label class="field"><span>处理方式</span><select><option>退回企业</option><option>滚存至下期</option><option>按约定比例分配</option></select></label><label class="field"><span>结余金额</span><input type="number" value="501600" /></label><label class="field full"><span>结余计算依据</span><textarea rows="3" placeholder="填写对账周期、已消费、冻结及可退金额"></textarea></label></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-toast="结余处理单已生成，待复核">生成处理单</button></div>`);
  }

  function openQuota(id) {
    const q = employeeQuotas.find(x => x.id === id); if (!q) return;
    openDrawer(`<p class="page-eyebrow">EMPLOYEE QUOTA</p><h2>${esc(q.name)} · 健康管理直付账户</h2><p class="drawer-sub">${esc(q.enterprise)} · ${esc(q.level)}</p>
      <div class="drawer-section"><div class="info-list"><div class="info-item"><small>年度额度</small><b>${money(q.annual)}</b></div><div class="info-item"><small>已用 / 冻结</small><b>${money(q.used)} / ${money(q.frozen)}</b></div><div class="info-item"><small>可用额度</small><b>${money(q.available)}</b></div><div class="info-item"><small>分项额度</small><b>${esc(q.categories)}</b></div></div></div>
      <div class="drawer-section"><h3>额度调整</h3><div class="publish-form"><label class="field"><span>调整类型</span><select><option>升额</option><option>降额</option><option>冻结</option><option>结转</option></select></label><label class="field"><span>调整金额</span><input type="number" placeholder="0.00" /></label><label class="field full"><span>调整原因</span><input placeholder="填写审批依据" /></label></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-toast="额度调整已记录">保存调整</button></div>`);
  }

  function openQuotaGrant() {
    openDrawer(`<p class="page-eyebrow">QUOTA GRANT</p><h2>额度下发</h2><p class="drawer-sub">按企业方案批量下发，额度不可提现</p>
      <div class="drawer-section"><div class="publish-form"><label class="field"><span>企业</span><select>${enterpriseFunds.map(f => `<option>${esc(f.name)}</option>`).join("")}</select></label><label class="field"><span>下发批次</span><input value="2026 年度额度" /></label><label class="field"><span>覆盖人数</span><input type="number" value="286" /></label><label class="field"><span>额度模板</span><select><option>按职级差异化</option><option>统一额度</option><option>按工龄</option></select></label></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-toast="额度下发任务已创建">确认下发</button></div>`);
  }

  function openInstitution(id) {
    const i = institutionSettlements.find(x => x.id === id); if (!i) return;
    openDrawer(`<p class="page-eyebrow">INSTITUTION DIRECT SETTLEMENT</p><h2>${esc(i.name)}</h2><p class="drawer-sub">${esc(i.id)} · 账期 ${esc(i.term)} · ${esc(i.status)}</p>
      <div class="drawer-section"><div class="info-list"><div class="info-item"><small>消费笔数</small><b>${i.count} 笔</b></div><div class="info-item"><small>企业承担</small><b>${money(i.enterprise)}</b></div><div class="info-item"><small>员工自付</small><b>${money(i.employee)}</b></div><div class="info-item"><small>平台服务费</small><b>${money(i.fee)}</b></div><div class="info-item"><small>机构应结</small><b>${money(i.payable)}</b></div><div class="info-item"><small>应付日期</small><b>${esc(i.due)}</b></div></div></div>
      <div class="drawer-section"><h3>打款前置校验</h3><div class="info-list"><div class="info-item"><small>机构账户</small><b class="margin-positive">有效</b></div><div class="info-item"><small>差错工单</small><b class="margin-positive">无未关闭工单</b></div><div class="info-item"><small>风控检查</small><b class="margin-positive">通过</b></div></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button>${i.status !== "已打款" ? `<button class="btn primary" data-institution-pay="${i.id}">确认打款</button>` : ""}</div>`);
    const pay = $("[data-institution-pay]");
    if (pay) pay.addEventListener("click", () => { i.status = "已打款"; closeDrawer(); toast("机构打款已提交"); renderSettlements(); });
  }

  function openKaConfig(id) {
    const k = kaBills.find(x => x.id === id);
    openDrawer(`<p class="page-eyebrow">KA BILL CONFIG</p><h2>${k ? "编辑 KA 账单配置" : "新增 KA 账单配置"}</h2><p class="drawer-sub">组织拆分 / 财务字段映射 / 合并结算</p>
      <div class="drawer-section"><div class="publish-form"><label class="field"><span>企业</span><input value="${esc(k ? k.enterprise : "")}" /></label><label class="field"><span>拆分维度</span><input value="${esc(k ? k.split : "")}" /></label><label class="field"><span>结算周期</span><input value="${esc(k ? k.cycle : "")}" /></label><label class="field"><span>合并规则</span><input value="${esc(k ? k.merge : "")}" /></label><label class="field full"><span>财务字段</span><input value="${esc(k ? k.fields : "")}" /></label></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-toast="KA 账单配置已保存">保存</button></div>`);
  }

  function openRisk(id) {
    const r = riskAlerts.find(x => x.id === id); if (!r) return;
    openDrawer(`<p class="page-eyebrow">RISK & AUDIT</p><h2>${esc(r.type)} · ${esc(r.subject)}</h2><p class="drawer-sub">${esc(r.id)} · 风险等级 ${esc(r.level)} · ${esc(r.status)}</p>
      <div class="drawer-section"><p class="health-summary">${esc(r.detail)}</p><div class="info-list"><div class="info-item"><small>涉及金额</small><b>${money(r.amount)}</b></div><div class="info-item"><small>负责人</small><b>${esc(r.owner)}</b></div></div></div>
      <div class="drawer-section"><div class="publish-form"><label class="field"><span>处理方式</span><select><option>核实并解冻</option><option>拦截消费</option><option>转人工稽核</option><option>通知企业</option></select></label><label class="field full"><span>处理说明</span><textarea rows="3" placeholder="填写核查结果与处理依据"></textarea></label></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-risk-save="${r.id}">提交处理</button></div>`);
    const save = $("[data-risk-save]");
    if (save) save.addEventListener("click", () => { r.status = "已处理"; closeDrawer(); toast("风险已处理并记录审计日志"); renderSettlements(); });
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
