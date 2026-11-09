/* =========================================================
   健康档案 · 独立菜单
   ========================================================= */

(function () {
  "use strict";

  const D = window.ADMIN_DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const escape = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;

  const records = [
    {
      id: "H001", name: "林悦", dept: "研发中心", age: 34, risk: "中", score: 68,
      tags: ["血压偏高", "睡眠不足"], manager: "赵医生", lastContact: "2026-11-06",
      metrics: { bp: ["138/88", "mmHg", "偏高"], glucose: ["5.9", "mmol/L", "偏高"], ldl: ["3.6", "mmol/L", "偏高"], bmi: ["25.8", "", "偏高"], uric: ["356", "μmol/L", "正常"], sleep: ["6.1", "小时", "偏低"], mood: ["6", "/10", "正常"], steps: ["4,260", "步", "偏低"] },
      exam: { date: "2026-09-26", tags: ["血压偏高", "LDL-C 偏高", "睡眠不足"] },
      management: { title: "血压与睡眠改善 · 8 周", progress: 62, week: 5, total: 8, owner: "赵医生", next: "2026-11-18" },
      followups: [{ title: "睡眠随访", date: "2026-11-06", note: "睡眠 6.1 小时，建议固定入睡时间。", status: "待跟进", tone: "gold" }, { title: "血压复测", date: "2026-10-28", note: "家庭自测 138/88，继续生活方式干预。", status: "已完成", tone: "green" }],
      trends: [["收缩压", "142", "138", "<140", "改善中"], ["空腹血糖", "6.2", "5.9", "<6.1", "改善中"], ["LDL-C", "3.9", "3.6", "<3.4", "待改善"]]
    },
    {
      id: "H002", name: "陈嘉禾", dept: "市场部", age: 29, risk: "低", score: 38,
      tags: ["超重", "久坐"], manager: "王琳", lastContact: "2026-11-04",
      metrics: { bp: ["118/76", "mmHg", "正常"], glucose: ["5.1", "mmol/L", "正常"], ldl: ["2.8", "mmol/L", "正常"], bmi: ["24.6", "", "偏高"], uric: ["320", "μmol/L", "正常"], sleep: ["7.1", "小时", "正常"], mood: ["8", "/10", "正常"], steps: ["7,820", "步", "正常"] },
      exam: { date: "2026-09-18", tags: ["BMI 偏高", "建议增加运动"] },
      management: { title: "体重管理 · 8 周", progress: 45, week: 4, total: 8, owner: "王琳", next: "2026-11-20" },
      followups: [{ title: "运动打卡提醒", date: "2026-11-04", note: "本周运动 2 次，建议增加到 3 次。", status: "进行中", tone: "green" }],
      trends: [["体重", "78.2", "76.8", "74.0", "改善中"], ["BMI", "25.1", "24.6", "23.9", "改善中"]]
    },
    {
      id: "H003", name: "周雯", dept: "财务部", age: 38, risk: "低", score: 32,
      tags: ["全维度达标", "健康榜样"], manager: "赵医生", lastContact: "2026-11-05",
      metrics: { bp: ["112/72", "mmHg", "正常"], glucose: ["5.0", "mmol/L", "正常"], ldl: ["2.4", "mmol/L", "正常"], bmi: ["21.8", "", "正常"], uric: ["286", "μmol/L", "正常"], sleep: ["7.6", "小时", "正常"], mood: ["9", "/10", "正常"], steps: ["9,460", "步", "正常"] },
      exam: { date: "2026-09-20", tags: ["全部指标正常", "保持当前生活方式"] },
      management: { title: "年度健康维护", progress: 52, week: 6, total: 12, owner: "赵医生", next: "2027-03-20" },
      followups: [{ title: "年度复查", date: "2026-11-05", note: "指标稳定，按年度计划复查。", status: "已完成", tone: "green" }],
      trends: [["收缩压", "114", "112", "<140", "正常"], ["空腹血糖", "5.1", "5.0", "<6.1", "正常"]]
    },
    {
      id: "H004", name: "徐一鸣", dept: "生产部", age: 45, risk: "高", score: 82,
      tags: ["五高", "肥胖", "睡眠呼吸暂停风险", "复查逾期"], manager: "赵医生", lastContact: "2026-11-07",
      metrics: { bp: ["162/98", "mmHg", "偏高"], glucose: ["7.2", "mmol/L", "偏高"], ldl: ["4.2", "mmol/L", "偏高"], bmi: ["30.4", "", "偏高"], uric: ["486", "μmol/L", "偏高"], sleep: ["5.4", "小时", "偏低"], mood: ["4", "/10", "偏低"], steps: ["3,100", "步", "偏低"] },
      exam: { date: "2026-10-12", tags: ["血压 162/98", "空腹血糖 7.2", "LDL-C 4.2", "BMI 30.4", "尿酸 486"] },
      management: { title: "五高一重 · 12 周共管", progress: 72, week: 7, total: 12, owner: "赵医生", next: "2026-11-12" },
      followups: [{ title: "血压复核", date: "2026-11-08", note: "昨日自测 158/96，需确认服药与复诊安排。", status: "今日到期", tone: "orange" }, { title: "复查预约确认", date: "2026-11-06", note: "已逾期 2 天，复查尚未预约。", status: "已逾期", tone: "red" }, { title: "营养方案调整", date: "2026-11-03", note: "营养师已调整晚餐主食与加餐结构。", status: "已完成", tone: "green" }],
      trends: [["收缩压", "162", "148", "140", "改善中"], ["空腹血糖", "7.2", "6.7", "6.1", "改善中"], ["LDL-C", "4.2", "3.8", "3.4", "改善中"], ["尿酸", "486", "452", "420", "改善中"]]
    },
    {
      id: "H005", name: "何雨桐", dept: "人力资源部", age: 31, risk: "中", score: 64,
      tags: ["睡眠不足", "压力偏高"], manager: "王琳", lastContact: "2026-11-07",
      metrics: { bp: ["126/82", "mmHg", "正常"], glucose: ["5.4", "mmol/L", "正常"], ldl: ["3.2", "mmol/L", "正常"], bmi: ["23.8", "", "正常"], uric: ["310", "μmol/L", "正常"], sleep: ["5.8", "小时", "偏低"], mood: ["5", "/10", "偏低"], steps: ["5,260", "步", "偏低"] },
      exam: { date: "2026-10-02", tags: ["睡眠不足", "压力偏高", "建议心理评估"] },
      management: { title: "睡眠与压力管理 · 8 周", progress: 58, week: 5, total: 8, owner: "王琳", next: "2026-11-15" },
      followups: [{ title: "心理评估邀约", date: "2026-11-07", note: "已发送压力与情绪评估，待完成。", status: "待完成", tone: "gold" }, { title: "睡眠随访", date: "2026-11-02", note: "入睡困难，建议睡眠限制疗法。", status: "进行中", tone: "green" }],
      trends: [["睡眠", "5.2", "5.8", "7.0", "改善中"], ["情绪评分", "4", "5", "7", "改善中"]]
    },
    {
      id: "H006", name: "赵启明", dept: "法务部", age: 42, risk: "中", score: 66,
      tags: ["血压偏高", "血脂异常"], manager: "赵医生", lastContact: "2026-11-03",
      metrics: { bp: ["146/92", "mmHg", "偏高"], glucose: ["5.8", "mmol/L", "正常"], ldl: ["3.9", "mmol/L", "偏高"], bmi: ["26.1", "", "偏高"], uric: ["402", "μmol/L", "正常"], sleep: ["6.8", "小时", "正常"], mood: ["7", "/10", "正常"], steps: ["6,100", "步", "正常"] },
      exam: { date: "2026-09-29", tags: ["血压 146/92", "LDL-C 3.9", "建议心内科复诊"] },
      management: { title: "血压血脂共管 · 12 周", progress: 41, week: 5, total: 12, owner: "赵医生", next: "2026-11-19" },
      followups: [{ title: "心内科复诊", date: "2026-11-03", note: "已完成复诊，调整降压方案。", status: "已完成", tone: "green" }, { title: "家庭血压监测", date: "2026-11-01", note: "连续 7 天平均 142/90。", status: "进行中", tone: "gold" }],
      trends: [["收缩压", "152", "146", "140", "改善中"], ["LDL-C", "4.1", "3.9", "3.4", "待改善"]]
    },
    {
      id: "H007", name: "吴倩", dept: "设计部", age: 28, risk: "高", score: 78,
      tags: ["情绪风险", "EAP 跟进中"], manager: "王琳", lastContact: "2026-11-08",
      metrics: { bp: ["118/78", "mmHg", "正常"], glucose: ["5.2", "mmol/L", "正常"], ldl: ["2.7", "mmol/L", "正常"], bmi: ["22.4", "", "正常"], uric: ["286", "μmol/L", "正常"], sleep: ["6.0", "小时", "偏低"], mood: ["2", "/10", "偏低"], steps: ["4,600", "步", "偏低"] },
      exam: { date: "2026-10-10", tags: ["情绪评分 2/10", "睡眠不足", "EAP 已介入"] },
      management: { title: "心理支持与睡眠 · 8 周", progress: 36, week: 3, total: 8, owner: "王琳", next: "2026-11-14" },
      followups: [{ title: "EAP 咨询", date: "2026-11-08", note: "已完成首次咨询，安排下周复访。", status: "进行中", tone: "gold" }, { title: "高风险复核", date: "2026-11-07", note: "情绪评分低，已纳入重点关怀。", status: "今日到期", tone: "orange" }],
      trends: [["情绪评分", "1", "2", "7", "待改善"], ["睡眠", "5.5", "6.0", "7.0", "改善中"]]
    },
    {
      id: "H008", name: "孙宁", dept: "销售部", age: 36, risk: "中", score: 61,
      tags: ["高尿酸", "饮酒"], manager: "陈晓", lastContact: "2026-11-06",
      metrics: { bp: ["132/86", "mmHg", "偏高"], glucose: ["5.6", "mmol/L", "正常"], ldl: ["3.1", "mmol/L", "正常"], bmi: ["25.2", "", "偏高"], uric: ["468", "μmol/L", "偏高"], sleep: ["6.6", "小时", "正常"], mood: ["7", "/10", "正常"], steps: ["5,900", "步", "偏低"] },
      exam: { date: "2026-09-30", tags: ["尿酸 468", "血压偏高", "建议限酒"] },
      management: { title: "尿酸与体重管理 · 12 周", progress: 55, week: 7, total: 12, owner: "陈晓", next: "2026-11-17" },
      followups: [{ title: "饮食回顾", date: "2026-11-06", note: "本周饮酒 2 次，建议减少频次。", status: "待跟进", tone: "gold" }],
      trends: [["尿酸", "492", "468", "420", "改善中"], ["体重", "78.5", "76.9", "74.0", "改善中"]]
    }
  ];

  let riskFilter = "全部";
  let selectedId = "H004";
  let query = "";

  const riskTone = risk => risk === "高" ? "red" : risk === "中" ? "gold" : "green";
  const riskCount = risk => records.filter(r => r.risk === risk).length;

  function setTop() {
    $("#topTitle").textContent = "健康档案";
    $("#breadcrumb").textContent = "健康数据 / 健康档案";
    $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.nav === "health-records"));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function pageHead() {
    return `<div class="page-head"><div><p class="page-eyebrow">HEALTH RECORDS</p><h2>健康档案</h2></div><div class="page-actions"><span class="tag red">高风险 ${riskCount("高")}</span><span class="tag gold">中风险 ${riskCount("中")}</span><span class="tag green">低风险 ${riskCount("低")}</span></div></div>`;
  }

  function metricCard(label, data) {
    const [value, unit, status] = data;
    const tone = status === "偏高" || status === "偏低" ? "warn" : "normal";
    return `<div class="health-metric ${tone}"><small>${label}</small><b>${value}<em>${unit}</em></b><span class="health-metric-status">${status}</span></div>`;
  }

  function studentRecord(studentId) {
    const s = D.students.find(x => x.id === studentId);
    if (!s) return null;
    const project = D.projects.find(p => p.id === s.projectId);
    const values = D.bodyValues[s.id] || [];
    return {
      id: "ST-" + s.id, studentId: s.id, name: s.name, dept: project ? project.name : "学员", age: 32,
      risk: s.risk, score: Math.max(35, Math.round(s.completion)), tags: s.tags || ["健康档案"],
      manager: s.team || "健管师", lastContact: s.lastCheckin || "—",
      metrics: {
        bp: ["126/82", "mmHg", "正常"], glucose: ["5.2", "mmol/L", "正常"],
        ldl: ["2.9", "mmol/L", "正常"], bmi: ["24.2", "", "偏高"],
        uric: ["332", "μmol/L", "正常"], sleep: ["7.1", "小时", "正常"],
        mood: ["7", "/10", "正常"], steps: ["6,800", "步", "偏低"]
      },
      exam: { date: s.lastCheckin || "2026-09-20", tags: (s.tags || []).concat(["健康档案已同步"]) },
      management: { title: "学员健康管理 · 12 周", progress: s.completion, week: Math.max(1, Math.round(s.completion / 8)), total: 12, owner: s.team || "健管师", next: "2026-11-20" },
      followups: [{ title: "健康档案同步", date: s.lastCheckin || "2026-10-21", note: "来自学员管理与健康档案的合并记录。", status: "已同步", tone: "green" }],
      trends: values.slice(0, 4).map(v => [v.name, v.pre, v.post, v.reference, v.status])
    };
  }

  function checkinRowsFor(selected) {
    if (!selected.studentId) {
      return [
        { date: "2026-10-20", time: "07:40", weight: "72.4", meals: 3, exercise: 30, complete: true },
        { date: "2026-10-22", time: "07:32", weight: "72.1", meals: 2, exercise: 0, complete: false },
        { date: "2026-10-25", time: "07:35", weight: "71.8", meals: 3, exercise: 25, complete: true }
      ];
    }
    return D.checkins.filter(k => k.studentId === selected.studentId).slice(0, 8);
  }

  function bodyRowsFor(selected) {
    if (selected.studentId && D.bodyValues[selected.studentId]) {
      return D.bodyValues[selected.studentId].slice(0, 8).map(v => ({ name: v.name, pre: v.pre, post: v.post, reference: v.reference, status: v.status }));
    }
    return selected.trends.map(t => ({ name: t[0], pre: t[1], post: t[2], reference: t[3], status: t[4] }));
  }

  function extraPanels(selected) {
    const checkins = checkinRowsFor(selected);
    const body = bodyRowsFor(selected);
    return `<div class="health-extra-grid">
      <section class="panel health-extra"><div class="panel-head"><div><h3 class="panel-title">打卡记录</h3><p class="panel-sub">与学员管理打卡记录同步</p></div><span class="tag blue">${checkins.length} 条</span></div><div class="table-wrap">${checkins.length ? `<table class="data-table"><thead><tr><th>日期</th><th>体重</th><th>三餐</th><th>运动</th><th>完成</th></tr></thead><tbody>${checkins.map(k => `<tr><td>${escape(k.date)}<span class="cell-sub">${escape(k.time)}</span></td><td><b class="cell-main">${k.weight} kg</b></td><td>${k.meals}/3</td><td>${k.exercise} 分钟</td><td>${k.complete ? '<span class="tag green">已完成</span>' : '<span class="tag gold">待完成</span>'}</td></tr>`).join("")}</tbody></table>` : `<div class="empty">该档案暂无打卡记录</div>`}</div></section>
      <section class="panel health-extra"><div class="panel-head"><div><h3 class="panel-title">体成分与指标</h3><p class="panel-sub">营前 / 营后及最近一次记录</p></div><span class="tag green">${body.length} 项</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>指标</th><th>基线</th><th>当前</th><th>参考范围</th><th>状态</th></tr></thead><tbody>${body.map(b => `<tr><td><b class="cell-main">${escape(b.name)}</b></td><td>${escape(b.pre)}</td><td><b class="cell-main">${escape(b.post)}</b></td><td class="ref-value">${escape(b.reference)}</td><td><span class="tag ${b.status === "改善" || b.status === "正常" ? "green" : "gold"}">${escape(b.status)}</span></td></tr>`).join("")}</tbody></table></div></section>
    </div>`;
  }

  function render(studentId) {
    if (studentId) {
      const existing = records.find(r => r.studentId === studentId);
      const record = existing || studentRecord(studentId);
      if (record && !existing) records.unshift(record);
      if (record) selectedId = record.id;
      riskFilter = "全部";
      query = "";
    }
    const filtered = records.filter(r => (riskFilter === "全部" || r.risk === riskFilter) && (!query || (r.name + r.dept).includes(query)));
    if (!filtered.some(r => r.id === selectedId) && filtered.length) selectedId = filtered[0].id;
    const selected = records.find(r => r.id === selectedId) || records[0];
    const html = `
      ${pageHead()}
      <div class="health-layout">
        <aside class="health-list-panel">
          <div class="health-filter">${["全部", "高风险", "中风险", "低风险"].map(f => {
            const key = f === "全部" ? "全部" : f.replace("风险", "");
            return `<button class="${riskFilter === f ? "active" : ""}" data-health-filter="${f}">${f}<span>${key === "全部" ? records.length : riskCount(key)}</span></button>`;
          }).join("")}</div>
          <label class="filter-search health-search">${icon("search")}<input id="healthSearch" value="${escape(query)}" placeholder="搜索姓名或部门" /></label>
          <div class="health-people">${filtered.map(r => `<button class="health-person ${r.id === selected.id ? "selected" : ""}" data-health-person="${r.id}">
            <span class="avatar">${escape(r.name.slice(0, 1))}</span>
            <span class="health-person-main"><b>${escape(r.name)}</b><small>${escape(r.dept)} · ${r.age} 岁</small><em>${escape(r.tags.slice(0, 2).join(" / "))}</em></span>
            <span class="tag ${riskTone(r.risk)}">${r.risk}</span>
          </button>`).join("")}</div>
          ${filtered.length ? "" : `<div class="empty">未找到匹配的健康档案</div>`}
        </aside>
        <section class="health-detail">
          <div class="health-hero">
            <div><div class="health-hero-title"><span class="tag ${riskTone(selected.risk)}">${selected.risk}风险</span><span class="tag blue">年度体检 + 五高筛查</span></div><h2>${escape(selected.name)}</h2><p>${escape(selected.dept)} · ${selected.age} 岁 · 健管师 ${escape(selected.manager)} · 最近联系 ${escape(selected.lastContact)}</p><div class="health-tags">${selected.tags.map(t => `<span>${escape(t)}</span>`).join("")}</div></div>
            <div class="health-score"><b>${selected.score}</b><small>风险分</small><span class="tag ${riskTone(selected.risk)}">${selected.risk}风险</span></div>
          </div>
          <div class="health-metrics">${metricCard("血压", selected.metrics.bp)}${metricCard("空腹血糖", selected.metrics.glucose)}${metricCard("LDL-C", selected.metrics.ldl)}${metricCard("BMI", selected.metrics.bmi)}${metricCard("尿酸", selected.metrics.uric)}${metricCard("睡眠", selected.metrics.sleep)}${metricCard("情绪", selected.metrics.mood)}${metricCard("步数", selected.metrics.steps)}</div>
          <div class="health-grid">
            <section class="panel health-exam"><div class="panel-head"><div><h3 class="panel-title">最近体检</h3></div><span class="tag">${escape(selected.exam.date)}</span></div><div class="panel-body"><p class="health-summary">多项代谢指标异常，已纳入五高一重共管，建议尽快完成专科复诊。</p><div class="health-tags">${selected.exam.tags.map(t => `<span class="tag">${escape(t)}</span>`).join("")}</div></div></section>
            <section class="panel health-manage"><div class="panel-head"><div><h3 class="panel-title">当前管理</h3></div><span class="tag green">${selected.management.week}/${selected.management.total} 周</span></div><div class="panel-body"><h3>${escape(selected.management.title)}</h3><p>${selected.management.week} / ${selected.management.total} 周 · 负责人 ${escape(selected.management.owner)}</p><div class="progress health-progress"><i style="width:${selected.management.progress}%"></i></div><div class="health-manage-foot"><span>下次复查 ${escape(selected.management.next)}</span><b>${selected.management.progress}%</b></div></div></section>
            <section class="panel health-followups"><div class="panel-head"><div><h3 class="panel-title">随访记录</h3></div><span class="tag gold">${selected.followups.length} 条</span></div><div class="panel-body">${selected.followups.map(f => `<div class="health-followup"><div><b>${escape(f.title)}</b><small>${escape(f.date)} · ${escape(f.note)}</small></div><span class="tag ${f.tone}">${escape(f.status)}</span></div>`).join("")}</div></section>
            <section class="panel health-trends"><div class="panel-head"><div><h3 class="panel-title">结果趋势</h3></div><span class="tag blue">基线 → 当前</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>指标</th><th>基线</th><th>当前</th><th>目标</th><th>状态</th></tr></thead><tbody>${selected.trends.map(t => `<tr><td><b class="cell-main">${escape(t[0])}</b></td><td>${escape(t[1])}</td><td><b class="cell-main">${escape(t[2])}</b></td><td>${escape(t[3])}</td><td><span class="tag ${t[4] === "正常" ? "green" : "gold"}">${escape(t[4])}</span></td></tr>`).join("")}</tbody></table></div></section>
          </div>
          ${extraPanels(selected)}
        </section>
      </div>
    `;
    $("#viewRoot").innerHTML = html;
    setTop();
    $$("[data-health-filter]").forEach(b => b.addEventListener("click", () => { const v = b.dataset.healthFilter; riskFilter = v === "全部" ? "全部" : v.replace("风险", ""); render(); }));
    $$("[data-health-person]").forEach(b => b.addEventListener("click", () => { selectedId = b.dataset.healthPerson; render(); }));
    const search = $("#healthSearch");
    if (search) search.addEventListener("input", () => { query = search.value.trim(); render(); });
  }

  window.AdminHealth = { records: render };
})();
