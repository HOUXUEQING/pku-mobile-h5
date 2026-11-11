/* 企康权益与个人企康资金展示模块 */
(function () {
  "use strict";
  const D = window.ADMIN_DATA || {};
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const money = n => "¥" + Number(n || 0).toLocaleString("zh-CN");
  const rightSets = [
    [{ name: "年度体检", total: 1, used: 1, unit: "次" }, { name: "专家咨询", total: 3, used: 1, unit: "次" }, { name: "运动课程", total: 4, used: 2, unit: "次" }],
    [{ name: "年度体检", total: 1, used: 0, unit: "次" }, { name: "在线问诊", total: 5, used: 2, unit: "次" }, { name: "健康商城", total: 2000, used: 680, unit: "元" }],
    [{ name: "年度体检", total: 1, used: 1, unit: "次" }, { name: "营养咨询", total: 2, used: 1, unit: "次" }, { name: "体成分检测", total: 4, used: 3, unit: "次" }],
    [{ name: "年度体检", total: 1, used: 0, unit: "次" }, { name: "专家咨询", total: 2, used: 0, unit: "次" }, { name: "运动课程", total: 6, used: 1, unit: "次" }]
  ];
  const fundCache = new Map();

  function indexFor(person) {
    const list = D.students || [];
    const byId = list.findIndex(s => s.id === (person.studentId || person.id));
    if (byId >= 0) return byId;
    const byName = list.findIndex(s => s.name === person.name);
    if (byName >= 0) return byName;
    let hash = 0;
    String(person.name || "客户").split("").forEach(ch => { hash = (hash * 31 + ch.charCodeAt(0)) % 97; });
    return hash % 4;
  }
  function benefitFor(person) {
    const key = person.studentId || person.id || person.name;
    if (fundCache.has(key)) return fundCache.get(key);
    const i = indexFor(person);
    const rights = rightSets[i % rightSets.length].map(r => ({ ...r, remain: Math.max(0, r.total - r.used) }));
    const total = 3000 + (i % 4) * 500;
    const used = 620 + (i % 3) * 280;
    const frozen = i % 3 === 0 ? 200 : 0;
    const student = (D.students || []).find(s => s.id === (person.studentId || person.id) || s.name === person.name);
    const project = (D.projects || []).find(p => p.id === (person.projectId || (student && student.projectId)));
    const data = {
      rights,
      fund: { total, used, frozen, available: Math.max(0, total - used - frozen), year: "2026" },
      enterprise: project ? project.enterprise || project.name : "企康企业客户",
      contract: project ? "企康合约-2026" : "企康权益合约"
    };
    fundCache.set(key, data);
    return data;
  }
  function summaryHTML() {
    const students = D.students || [];
    const all = students.map(s => benefitFor(s));
    const totalFund = all.reduce((n, x) => n + x.fund.total, 0);
    const available = all.reduce((n, x) => n + x.fund.available, 0);
    const rightsCount = all.reduce((n, x) => n + x.rights.length, 0);
    return `<section class="panel benefit-overview"><div class="panel-head"><div><h3 class="panel-title">企康权益与个人资金</h3><p class="panel-sub">客户当前拥有的企康权益及个人企康资金余额</p></div><span class="tag blue">${students.length} 位客户</span></div><div class="benefit-overview-grid"><div class="benefit-kpi"><small>个人企康资金总额</small><b>${money(totalFund)}</b><span>企业已分配</span></div><div class="benefit-kpi green"><small>可用余额</small><b>${money(available)}</b><span>可直接用于商城和服务</span></div><div class="benefit-kpi purple"><small>权益项</small><b>${rightsCount}<em>项</em></b><span>体检 / 咨询 / 课程 / 商城</span></div><div class="benefit-kpi gold"><small>权益覆盖客户</small><b>${all.filter(x => x.rights.some(r => r.remain > 0)).length}<em>人</em></b><span>仍有可用权益</span></div></div></section>`;
  }
  function rightsCell(person) {
    const data = benefitFor(person);
    return `<div class="benefit-right-tags">${data.rights.slice(0, 2).map(r => `<span>${esc(r.name)} <b>${r.remain}</b>${esc(r.unit)}</span>`).join("")}${data.rights.length > 2 ? `<i>+${data.rights.length - 2}</i>` : ""}</div>`;
  }
  function fundCell(person) {
    const f = benefitFor(person).fund;
    const pct = Math.round((f.available / f.total) * 100);
    return `<div class="benefit-fund-cell"><b>${money(f.available)}</b><span>可用 / 总额 ${money(f.total)}</span><div class="benefit-mini-bar"><i style="width:${pct}%"></i></div></div>`;
  }
  function profileHTML(person) {
    const data = benefitFor(person);
    return `<section class="benefit-profile panel"><div class="panel-head"><div><h3 class="panel-title">企康权益与个人资金</h3><p class="panel-sub">${esc(data.enterprise)} · ${esc(data.contract)} · ${data.fund.year} 年度</p></div><span class="tag green">企业权益</span></div><div class="benefit-profile-grid"><div class="benefit-rights-box"><div class="benefit-subhead"><h4>拥有的企康权益</h4><span>剩余可用</span></div><div class="benefit-right-list">${data.rights.map(r => `<div class="benefit-right-row"><div><b>${esc(r.name)}</b><small>总量 ${r.total}${esc(r.unit)} · 已用 ${r.used}${esc(r.unit)}</small></div><strong>${r.remain}<em>${esc(r.unit)}</em></strong></div>`).join("")}</div></div><div class="benefit-fund-box"><div class="benefit-subhead"><h4>个人企康资金</h4><span>${data.fund.year} 年度</span></div><div class="benefit-fund-number">${money(data.fund.available)}<small>可用余额</small></div><div class="benefit-fund-line"><span>总额 ${money(data.fund.total)}</span><span>已用 ${money(data.fund.used)}</span><span>冻结 ${money(data.fund.frozen)}</span></div><div class="benefit-fund-progress"><i style="width:${Math.round((data.fund.used / data.fund.total) * 100)}%"></i></div><div class="benefit-fund-hint">可用于商城商品、健康服务和活动，不可提现或转账。</div></div></div></section>`;
  }
  window.AdminBenefits = { summaryHTML, rightsCell, fundCell, profileHTML, benefitFor };
})();
