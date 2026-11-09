/* =========================================================
   北大医疗企康运营管理后台
   ========================================================= */

(function () {
  "use strict";

  const D = window.ADMIN_DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const instById = id => D.institutions.find(x => x.id === id);
  const memberById = id => D.members.find(x => x.id === id);
  const projectById = id => D.projects.find(x => x.id === id);
  const studentById = id => D.students.find(x => x.id === id);
  const campById = id => D.camps.find(x => x.id === id);
  const escape = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const money = v => v;

  let projectTab = "overview";
  let studentTab = "profile";
  let lastProject = "";
  let lastStudent = "";
  let indicatorCat = "全部";
  let memberRole = "全部";
  let projectStatus = "全部";
  let boardCamp = "C001";
  let boardDay = "today";

  function icon(name, cls) {
    return `<svg class="ic ${cls || ""}"><use href="#i-${name}"/></svg>`;
  }

  function avatar(person, size) {
    const src = person && person.photo;
    const initial = person && person.name ? person.name.slice(0, 1) : "·";
    return `<span class="avatar ${size || ""}">${src ? `<img src="${escape(src)}" alt="${escape(person.name)}" onerror="this.style.display='none';this.parentNode.textContent='${initial}'" />` : initial}</span>`;
  }

  function memberLink(m) {
    return `<span class="person-cell">${avatar(m)}<span><b>${escape(m.name)}</b><small>${escape(m.title || m.role)}</small></span></span>`;
  }

  function statusTag(status) {
    const map = { "进行中": "green", "报名中": "blue", "已结营": "slate", "启用": "green", "在营": "green", "已完成": "blue", "待入营": "orange", "低": "green", "中": "orange", "高": "red" };
    return `<span class="tag ${map[status] || "slate"}"><i class="status-dot ${map[status] || ""}"></i>${escape(status)}</span>`;
  }

  function roleTag(role) {
    const map = { "运营督导": "blue", "运营管理": "blue", "医师": "gold", "健管师": "green", "营养师": "gold", "康复师": "slate", "超级管理员": "slate" };
    return `<span class="tag ${map[role] || ""}">${escape(role)}</span>`;
  }

  function pageHead(title, eyebrow, desc, actions) {
    return `<div class="page-head"><div><p class="page-eyebrow">${eyebrow}</p><h2>${title}</h2></div><div class="page-actions">${actions || ""}</div></div>`;
  }

  function kpi(iconName, label, value, unit, sub, color) {
    return `<article class="kpi-card" style="--kpi:${color};--kpi-soft:${color}18">
      <span class="kpi-icon">${icon(iconName)}</span>
      <div class="kpi-label">${label}</div>
      <div class="kpi-num">${value}<small>${unit || ""}</small></div>
      <div class="kpi-sub">${sub || ""}</div>
    </article>`;
  }

  function lineChart(labels, values, opts) {
    const o = opts || {};
    const w = 760, h = o.height || 205, pad = { l: 34, r: 12, t: 14, b: 24 };
    const min = o.min != null ? o.min : Math.min(...values) * 0.94;
    const max = o.max != null ? o.max : Math.max(...values) * 1.04;
    const span = max - min || 1;
    const x = i => pad.l + i * (w - pad.l - pad.r) / Math.max(1, values.length - 1);
    const y = v => pad.t + (max - v) * (h - pad.t - pad.b) / span;
    const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
    const line = `M${points.join(" L")}`;
    const area = `${line} L${x(values.length - 1)},${h - pad.b} L${x(0)},${h - pad.b} Z`;
    let grid = "";
    for (let i = 0; i < 4; i++) {
      const gy = pad.t + i * (h - pad.t - pad.b) / 3;
      const val = Math.round(max - i * span / 3);
      grid += `<line x1="${pad.l}" y1="${gy}" x2="${w - pad.r}" y2="${gy}" stroke="#edf3ff" stroke-width="1"/><text x="${pad.l - 8}" y="${gy + 3}" text-anchor="end" fill="#91a1b8" font-size="8">${val}${o.suffix || ""}</text>`;
    }
    const dots = values.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="${i === values.length - 1 ? 3.5 : 2.5}" fill="#fff" stroke="${o.color || "#2f6bff"}" stroke-width="1.7"/>`).join("");
    const xlabels = labels.map((l, i) => i % Math.ceil(labels.length / 7) === 0 || i === labels.length - 1 ? `<text x="${x(i)}" y="${h - 7}" text-anchor="middle" fill="#91a1b8" font-size="8">${escape(l)}</text>` : "").join("");
    return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="height:${h}px">
      <defs><linearGradient id="area-${o.id || "a"}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.color || "#2f6bff"}" stop-opacity=".18"/><stop offset="1" stop-color="${o.color || "#2f6bff"}" stop-opacity="0"/></linearGradient></defs>
      ${grid}<path d="${area}" fill="url(#area-${o.id || "a"})"/><path d="${line}" fill="none" stroke="${o.color || "#2f6bff"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>${dots}${xlabels}
    </svg>`;
  }

  function getBodyValues(s) {
    if (D.bodyValues[s.id]) return D.bodyValues[s.id];
    return [
      { name: "体重", category: "体成分", unit: "kg", pre: s.startWeight, post: s.weight, reference: `目标 ${s.target}`, status: Number(s.weightChange) < 0 ? "改善" : "稳定" },
      { name: "体脂率", category: "体成分", unit: "%", pre: s.startBodyFat, post: s.bodyFat, reference: "男 15–20，女 20–28", status: Number(s.bodyFat) < Number(s.startBodyFat) ? "改善" : "稳定" },
      { name: "内脏脂肪等级", category: "体成分", unit: "级", pre: "—", post: "—", reference: "1–9", status: "待录入" },
      { name: "空腹血糖", category: "血糖相关", unit: "mmol/L", pre: "—", post: "—", reference: "3.9 – 6.1", status: "待录入" },
      { name: "总胆固醇", category: "血脂相关", unit: "mmol/L", pre: "—", post: "—", reference: "< 5.2", status: "待录入" },
      { name: "甘油三酯", category: "血脂相关", unit: "mmol/L", pre: "—", post: "—", reference: "< 1.7", status: "待录入" },
      { name: "尿酸", category: "肾功能相关", unit: "μmol/L", pre: "—", post: "—", reference: "男 < 420；女 < 360", status: "待录入" }
    ];
  }

  function setTop(title, breadcrumb) {
    $("#topTitle").textContent = title;
    $("#breadcrumb").textContent = breadcrumb;
    const active = (location.hash.split("/")[0] || "#dashboard").slice(1);
    const navMap = { project: "projects", student: "students", member: "members", department: "departments", institution: "institutions" };
    const nav = navMap[active] || active || "dashboard";
    $$(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.nav === nav));
  }

  function showToast(text) {
    const t = $("#toast");
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => t.classList.remove("show"), 1900);
  }

  function openDrawer(html) {
    $("#drawerBody").innerHTML = html;
    $("#drawer").classList.add("open");
    $("#drawer").setAttribute("aria-hidden", "false");
    $("#drawerBackdrop").classList.add("open");
  }

  function closeDrawer() {
    $("#drawer").classList.remove("open");
    $("#drawer").setAttribute("aria-hidden", "true");
    $("#drawerBackdrop").classList.remove("open");
  }

  /* ---------------------------------------------------------
     Dashboard
     --------------------------------------------------------- */

  function renderDashboard() {
    const activeProjects = D.projects.filter(p => p.status === "进行中");
    const risks = D.students.filter(s => s.risk !== "低");
    const followups = [
      { id: "S005", name: "陈浩", meta: "中石油华北员工减重营", project: "减重营", reason: "连续 3 天未完整打卡", risk: "高", owner: "王琳", action: "电话跟进", tone: "red" },
      { id: "S003", name: "王凯", meta: "中石油华北员工减重营", project: "减重营", reason: "完成率 64% · 饮食记录缺失", risk: "中", owner: "陈晓", action: "营养师批注", tone: "orange" },
      { id: "S009", name: "何佳", meta: "中石油华北员工减重营", project: "减重营", reason: "完成率 57% · 饮食不规律", risk: "中", owner: "王琳", action: "健管师随访", tone: "orange" },
      { id: "S007", name: "刘洋", meta: "金融街企业减重营", project: "减重营", reason: "脂肪肝 · 运动不足", risk: "中", owner: "王琳", action: "运动处方", tone: "orange" },
      { id: "", name: "赵一诺", meta: "五好生活 · 市场部", project: "五好生活", reason: "饮食 2/3 · 今日未运动", risk: "中", owner: "王琳", action: "营养师跟进", tone: "gold" },
      { id: "", name: "陈思远", meta: "五好生活 · 研发中心", project: "五好生活", reason: "睡眠 6.4h · 睡眠未达标", risk: "中", owner: "陈晓", action: "睡眠关怀", tone: "purple" }
    ];
    const completion = 78.6;
    const board = D.checkinBoards[boardCamp] || D.checkinBoards.C001;
    const boardToday = board[boardDay] || board.today;
    const boardCampInfo = campById(boardCamp) || D.camps[0];
    const boardTrend = board.trend || [];
    const boardMin = Math.max(0, Math.min(...boardTrend) - 5);
    const boardMax = Math.min(100, Math.max(...boardTrend) + 5);
    const boardDateText = boardDay === "today" ? "今天" : "昨天";
    const html = `
      ${pageHead("运营工作台", "OPERATIONS OVERVIEW", "", `<button class="btn primary" type="button" data-go="project/new">${icon("plus")}新建项目</button>`)}
      <div class="kpi-grid">
        ${kpi("project", "负责项目", activeProjects.length + 1, "个", "减重营 2 · 五好生活 1", "#2f6bff")}
        ${kpi("users", "负责学员", 451, "人", "参营 165 · 五好员工 286", "#6a5bd4")}
        ${kpi("check", "今日完成", 94, "人", "达到完成标准", "#16a394")}
        ${kpi("chart", "打卡完成率", completion, "%", "完成成员 ÷ 参营学员", "#e8a13c")}
        ${kpi("heart", "风险成员", 12, "人", "减重 4 · 五好生活 8", "#e15b64")}
      </div>
      <div class="overview-projects">
        <a class="overview-card" href="#projects">
          <div class="overview-card-head"><span class="tag blue">减重营</span><b>减重营数据统计</b><span class="overview-badge">进行中</span></div>
          <div class="overview-card-stats"><div><small>在营项目</small><b>${activeProjects.length}</b></div><div><small>参营学员</small><b>165</b></div><div><small>打卡完成率</small><b>78.6%</b></div></div>
          <div class="overview-lines"><span><i style="width:78.6%"></i></span><em>平均减重 -4.8kg · 今日完成 94 人</em></div>
          <span class="overview-card-link">进入项目管理 →</span>
        </a>
        <a class="overview-card five" href="#recipes">
          <div class="overview-card-head"><span class="tag green">五好生活</span><b>五好生活数据统计</b><span class="overview-badge green">全员服务</span></div>
          <div class="overview-card-stats"><div><small>参与员工</small><b>${D.fiveGood.employees}</b></div><div><small>服务人次</small><b>${D.fiveGood.monthlyServices}</b></div><div><small>饮食打卡</small><b>${D.fiveGood.dietRate}%</b></div></div>
          <div class="overview-lines"><span><i style="width:${D.fiveGood.dietRate}%"></i></span><em>睡眠达标 ${D.fiveGood.sleepRate}% · 运动达标 ${D.fiveGood.exerciseRate}%</em></div>
          <span class="overview-card-link">进入五好工作区 →</span>
        </a>
      </div>
      <div class="dash-grid">
        <section class="panel article-board">
          <div class="panel-head"><div><h3 class="panel-title">文章浏览数据</h3></div><a class="panel-link" href="#articles">内容发布 →</a></div>
          <div class="panel-body">
            <div class="article-kpis">
              <div><small>累计阅读</small><b>2,996</b></div>
              <div><small>已发布</small><b>3</b></div>
              <div><small>今日阅读</small><b>286</b></div>
            </div>
            <div class="article-list">
              ${D.articles.filter(a => a.status === "已发布").sort((a, b) => b.views - a.views).slice(0, 4).map((a, i) => {
                const max = Math.max(...D.articles.map(x => x.views));
                return `<div class="article-row">
                  <span class="article-rank">${String(i + 1).padStart(2, "0")}</span>
                  <div class="article-info"><b>${escape(a.title)}</b><small>${escape(a.channel)} · ${a.projects.map(escape).join(" / ")}</small></div>
                  <div class="article-views"><b>${a.views.toLocaleString("zh-CN")}</b><small>阅读</small></div>
                  <div class="article-bar"><i style="width:${Math.max(8, Math.round(a.views / max * 100))}%"></i></div>
                </div>`;
              }).join("")}
            </div>
          </div>
        </section>
        <section class="panel board-panel">
          <div class="panel-head board-head">
            <div><h3 class="panel-title">营期打卡看板</h3></div>
            <select class="board-camp-select" id="boardCamp">
              ${D.camps.map(c => `<option value="${c.id}"${c.id === boardCamp ? " selected" : ""}>${escape(c.name)}</option>`).join("")}
            </select>
          </div>
          <div class="panel-body board-body">
            <div class="board-toolbar">
              <div class="segmented">
                <button class="${boardDay === "today" ? "active" : ""}" data-board-day="today">今天</button>
                <button class="${boardDay === "yesterday" ? "active" : ""}" data-board-day="yesterday">昨天</button>
              </div>
              <span class="board-date">${boardDateText} ${boardToday.date}</span>
            </div>
            <div class="board-stats">
              <div class="board-stat"><small>打卡学员</small><b>${boardToday.checked}</b></div>
              <div class="board-stat"><small>参营学员</small><b>${board.total}</b></div>
              <div class="board-stat"><small>完成学员</small><b>${boardToday.completed}</b></div>
            </div>
            <div class="board-rate">
              <div class="board-rate-head"><span>完成率</span><b>${boardToday.rate}%</b></div>
              <div class="board-progress"><i style="width:${Math.min(100, boardToday.rate)}%"></i></div>
            </div>
            <div class="board-breakdown">
              <div class="board-breakdown-head"><span>今日完成构成</span><em>${boardToday.checked} / ${board.total} 人打卡</em></div>
              ${[["体重", 112, 120, "#2f6bff"], ["三餐", 108, 120, "#16a394"], ["运动", 101, 120, "#e8a13c"]].map(([l, v, total, c]) => `<div class="board-breakdown-row"><span>${l}</span><div><i style="width:${Math.round(v / total * 100)}%;background:${c}"></i></div><b>${v}/${total}</b></div>`).join("")}
            </div>
          </div>
        </section>
      </div>
      <div class="dash-bottom">
        <section class="panel">
          <div class="panel-head"><div><h3 class="panel-title">待跟进</h3></div><div class="followup-summary"><span class="tag red">高 1</span><span class="tag gold">中 5</span><a class="panel-link" href="#students">全部学员 →</a></div></div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>成员</th><th>项目归属</th><th>待跟进原因</th><th>风险</th><th>负责人</th><th>动作</th></tr></thead>
              <tbody>${followups.map(s => `<tr class="${s.id ? "clickable" : ""}"${s.id ? ` data-student="${s.id}"` : ""}>
                <td><span class="person-cell"><span class="avatar avatar-sm">${escape(s.name.slice(0, 1))}</span><span><b>${escape(s.name)}</b><small>${escape(s.meta)}</small></span></span></td>
                <td><span class="tag ${s.project === "五好生活" ? "green" : "blue"}">${escape(s.project)}</span></td>
                <td><span class="cell-main">${escape(s.reason)}</span></td>
                <td>${statusTag(s.risk)}</td><td>${escape(s.owner)}</td>
                <td><span class="priority ${s.tone}">${escape(s.action)}</span></td>
              </tr>`).join("")}</tbody>
            </table>
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div><h3 class="panel-title">风险成员</h3></div><div class="risk-total"><span class="tag red">减重营 4</span><span class="tag green">五好生活 8</span></div></div>
          <div class="panel-body">
            ${risks.slice(0, 3).map(s => `<div class="project-mini clickable risk-item" data-student="${s.id}" style="margin-bottom:7px">
              <div class="project-mini-top"><span>${escape(s.name)} ${statusTag(s.risk)}</span><span>${s.completion}%</span></div>
              <small><span class="tag blue">减重营</span> ${escape(s.tags.join(" · "))} · ${escape(s.team)}</small>
            </div>`).join("")}
            <div class="project-mini risk-item five-risk" style="margin-bottom:7px">
              <div class="project-mini-top"><span>五好生活 · 高风险 8</span><span>心理/睡眠</span></div>
              <small><span class="tag green">五好生活</span> 情绪压力 8 · 睡眠困扰 12 · 待分配跟进</small>
            </div>
          </div>
        </section>
      </div>
    `;
    $("#viewRoot").innerHTML = html;
    setTop("运营工作台", "企康运营 / 工作台");
    const campSelect = $("#boardCamp");
    if (campSelect) campSelect.addEventListener("change", () => { boardCamp = campSelect.value; renderDashboard(); });
    $$("[data-board-day]").forEach(btn => btn.addEventListener("click", () => { boardDay = btn.dataset.boardDay; renderDashboard(); }));
  }

  /* ---------------------------------------------------------
     Institutions
     --------------------------------------------------------- */

  function renderInstitutions() {
    const html = `
      ${pageHead("机构管理", "MEMBER INSTITUTIONS", "北大医疗集团成员机构，机构下可维护成员、科室与企康项目", `<a class="btn primary" href="#institution/new">${icon("plus")}新增机构</a>`)}
      <div class="filter-bar">
        <label class="filter-search">${icon("search")}<input id="instSearch" placeholder="搜索机构名称、地区或类型" /></label>
        <select class="filter-select" id="instRegion"><option>全部地区</option>${[...new Set(D.institutions.map(i => i.region))].map(r => `<option>${r}</option>`).join("")}</select>
        <span class="tag blue">共 ${D.institutions.length} 家成员机构</span>
      </div>
      <section class="panel"><div class="table-wrap"><table class="data-table" id="instTable">
        <thead><tr><th>机构</th><th>地区 / 城市</th><th>机构类型</th><th>负责人</th><th>成员</th><th>科室</th><th>企康项目</th><th>状态</th><th></th></tr></thead>
        <tbody>${D.institutions.map(i => `<tr class="clickable" data-inst="${i.id}">
          <td><span class="person-cell"><span class="avatar avatar-sm" style="background:#edf8fd;color:#3188aa">${icon("building")}</span><span><b>${escape(i.name)}</b><small>${escape(i.address)}</small></span></span></td>
          <td>${escape(i.region)}<span class="cell-sub">${escape(i.city)}</span></td>
          <td><span class="tag blue">${escape(i.type)}</span></td>
          <td>${escape(i.manager)}</td>
          <td><b class="cell-main">${i.members}</b></td>
          <td>${i.departments}</td>
          <td>${i.projects ? `<span class="tag green">${i.projects} 个</span>` : '<span style="color:#a4b2ba">—</span>'}</td>
          <td>${statusTag(i.status)}</td><td><div class="row-actions"><a class="panel-link" href="#institution/${i.id}/edit" data-edit-inst="${i.id}">编辑</a><span class="panel-link" data-inst="${i.id}">详情 →</span></div></td>
        </tr>`).join("")}</tbody>
      </table></div></section>
    `;
    $("#viewRoot").innerHTML = html;
    setTop("机构管理", "内容管理 / 机构管理");
    const input = $("#instSearch");
    const region = $("#instRegion");
    const filter = () => {
      const q = input.value.trim();
      const r = region.value;
      $$("#instTable tbody tr").forEach(tr => {
        tr.style.display = (!q || tr.innerText.includes(q)) && (r === "全部地区" || tr.innerText.includes(r)) ? "" : "none";
      });
    };
    input.addEventListener("input", filter);
    region.addEventListener("change", filter);
  }

  function institutionDrawer(id) {
    const i = instById(id);
    const depts = D.departments.filter(d => d.institutionId === id);
    const members = D.members.filter(m => m.institutionId === id);
    openDrawer(`
      <a class="btn small drawer-edit" data-close-drawer href="#institution/${i.id}/edit">编辑机构</a>
      <p class="page-eyebrow">INSTITUTION PROFILE</p><h2>${escape(i.name)}</h2><p class="drawer-sub">${escape(i.city)} · ${escape(i.type)}</p>
      <div class="drawer-section"><div class="info-list">
        <div class="info-item"><small>负责人</small><b>${escape(i.manager)}</b></div>
        <div class="info-item"><small>联系电话</small><b>${escape(i.phone)}</b></div>
        <div class="info-item full"><small>地址</small><b>${escape(i.address)}</b></div>
      </div></div>
      <div class="drawer-section"><div class="detail-stats" style="grid-template-columns:repeat(3,1fr)">
        <div class="detail-stat"><small>机构成员</small><b>${i.members}</b></div>
        <div class="detail-stat"><small>科室</small><b>${i.departments}</b></div>
        <div class="detail-stat"><small>企康项目</small><b>${i.projects}</b></div>
      </div></div>
      <div class="drawer-section"><h3>下属科室</h3><div class="people-list">${depts.length ? depts.map(d => `<div class="person-card"><span><b>${escape(d.name)}</b><small>${escape(d.category)} · ${escape(d.leader)}</small></span></div>`).join("") : '<span class="drawer-sub">暂无科室</span>'}</div></div>
      <div class="drawer-section"><h3>机构成员</h3><div class="people-list">${members.length ? members.slice(0, 6).map(m => `<div class="person-card">${avatar(m)}<span><b>${escape(m.name)}</b><small>${escape(m.role)} · ${escape(m.dept)}</small></span></div>`).join("") : '<span class="drawer-sub">暂无成员</span>'}</div></div>
      <div class="drawer-section"><h3>参与项目</h3>${D.projects.filter(p => p.institutionId === id).map(p => `<div class="person-card" style="margin-bottom:6px"><span><b>${escape(p.name)}</b><small>${escape(p.enterprise)} · ${p.enrolled}/${p.target} 人</small></span></div>`).join("") || '<span class="drawer-sub">暂无企康项目</span>'}</div>
    `);
  }

  /* ---------------------------------------------------------
     Members
     --------------------------------------------------------- */

  function renderMembers() {
    const roles = ["全部", ...new Set(D.members.map(m => m.role))];
    const html = `
      ${pageHead("机构成员", "PEOPLE LIBRARY", "成员可属于不同机构、不同科室，并可同时服务多个企康项目", `<a class="btn primary" href="#member/new">${icon("plus")}新增成员</a>`)}
      <div class="filter-bar">
        <label class="filter-search">${icon("search")}<input id="memberSearch" placeholder="搜索姓名、机构、科室或角色" /></label>
        <select class="filter-select" id="memberRole">${roles.map(r => `<option>${r}</option>`).join("")}</select>
        <span class="tag blue">成员库 ${D.members.length} 人</span>
      </div>
      <section class="panel"><div class="table-wrap"><table class="data-table" id="memberTable">
        <thead><tr><th>成员</th><th>所属机构</th><th>科室</th><th>角色</th><th>职称 / 资质</th><th>服务项目</th><th>状态</th><th></th></tr></thead>
        <tbody>${D.members.map(m => `<tr class="clickable" data-member="${m.id}">
          <td>${memberLink(m)}</td>
          <td>${escape(instById(m.institutionId).name)}</td>
          <td>${escape(m.dept)}</td>
          <td>${roleTag(m.role)}</td>
          <td><span class="cell-main">${escape(m.title)}</span><span class="cell-sub">${escape(m.qualification)}</span></td>
          <td><div class="tag-row">${m.projects.map(p => `<span class="tag">${escape(projectById(p).name)}</span>`).join("")}</div></td>
          <td>${statusTag("启用")}</td><td><span class="panel-link">查看介绍 →</span></td>
        </tr>`).join("")}</tbody>
      </table></div></section>
    `;
    $("#viewRoot").innerHTML = html;
    setTop("机构成员", "内容管理 / 机构成员");
    const input = $("#memberSearch");
    const role = $("#memberRole");
    const filter = () => {
      const q = input.value.trim();
      $$("#memberTable tbody tr").forEach(tr => {
        tr.style.display = (!q || tr.innerText.includes(q)) && (role.value === "全部" || tr.innerText.includes(role.value)) ? "" : "none";
      });
    };
    input.addEventListener("input", filter);
    role.addEventListener("change", filter);
  }

  function memberDrawer(id) {
    const m = memberById(id);
    openDrawer(`
      <a class="btn small drawer-edit" data-close-drawer href="#member/${m.id}/edit">编辑成员介绍</a>
      <div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:14px">${avatar(m, "avatar-lg")}<div><p class="page-eyebrow">MEMBER PROFILE</p><h2 style="margin-bottom:3px">${escape(m.name)}</h2><p class="drawer-sub">${escape(m.title)} · ${escape(m.role)}</p><div class="tag-row" style="margin-top:7px">${roleTag(m.role)}<span class="tag">${escape(m.gender)}</span></div></div></div>
      <div class="info-list">
        <div class="info-item"><small>所属机构</small><b>${escape(instById(m.institutionId).name)}</b></div>
        <div class="info-item"><small>所在科室</small><b>${escape(m.dept)}</b></div>
        <div class="info-item"><small>联系电话</small><b>${escape(m.phone)}</b></div>
        <div class="info-item"><small>专业资质</small><b>${escape(m.qualification)}</b></div>
      </div>
      <div class="drawer-section"><h3>成员介绍</h3><p style="margin-bottom:0;color:#5d7a8a;font-size:10px;line-height:1.9">${escape(m.intro)}</p></div>
      <div class="drawer-section"><h3>擅长方向</h3><p style="margin-bottom:0;color:#315f79;font-size:10px">${escape(m.specialty)}</p></div>
      <div class="drawer-section"><h3>服务机构与项目</h3><div class="people-list">
        <div class="person-card"><span><b>${escape(instById(m.institutionId).name)}</b><small>所属机构</small></span></div>
        ${m.projects.map(p => { const pr = projectById(p); return `<div class="person-card"><span><b>${escape(pr.name)}</b><small>${escape(pr.enterprise)} · ${escape(pr.status)}</small></span></div>`; }).join("")}
      </div></div>
    `);
  }

  /* ---------------------------------------------------------
     Departments
     --------------------------------------------------------- */

  function renderDepartments() {
    const cats = ["全部", "科室中心", "特色中心", "特色门诊"];
    const html = `
      ${pageHead("科室管理", "CLINICAL DEPARTMENTS", "科室归属于具体机构，不同机构可存在同名但不同介绍的科室", `<a class="btn primary" href="#department/new">${icon("plus")}新增科室</a>`)}
      <div class="filter-bar">
        <label class="filter-search">${icon("search")}<input id="deptSearch" placeholder="搜索科室、机构或负责人" /></label>
        <select class="filter-select" id="deptCategory">${cats.map(c => `<option>${c}</option>`).join("")}</select>
        <span class="tag blue">${D.departments.length} 个科室</span>
      </div>
      <section class="panel"><div class="table-wrap"><table class="data-table" id="deptTable">
        <thead><tr><th>科室</th><th>所属机构</th><th>分类</th><th>学科带头人</th><th>科室特色</th><th>医生团队</th><th></th></tr></thead>
        <tbody>${D.departments.map(d => `<tr class="clickable" data-dept="${d.id}">
          <td><span class="cell-main">${escape(d.name)}</span><span class="cell-sub">${escape(d.intro)}</span></td>
          <td>${escape(instById(d.institutionId).name)}</td>
          <td><span class="tag ${d.category === "特色中心" ? "gold" : d.category === "特色门诊" ? "green" : "blue"}">${escape(d.category)}</span></td>
          <td>${escape(d.leader)}</td><td><b class="cell-main">${d.features}</b></td><td>${d.doctors} 人</td>
          <td><span class="panel-link">查看介绍 →</span></td>
        </tr>`).join("")}</tbody>
      </table></div></section>
    `;
    $("#viewRoot").innerHTML = html;
    setTop("科室管理", "内容管理 / 科室管理");
    const input = $("#deptSearch");
    const cat = $("#deptCategory");
    const filter = () => {
      const q = input.value.trim();
      $$("#deptTable tbody tr").forEach(tr => {
        tr.style.display = (!q || tr.innerText.includes(q)) && (cat.value === "全部" || tr.innerText.includes(cat.value)) ? "" : "none";
      });
    };
    input.addEventListener("input", filter);
    cat.addEventListener("change", filter);
  }

  function departmentDrawer(id) {
    const d = D.departments.find(x => x.id === id);
    openDrawer(`
      <a class="btn small drawer-edit" data-close-drawer href="#department/${d.id}/edit">编辑科室</a>
      <p class="page-eyebrow">DEPARTMENT PROFILE</p><h2>${escape(d.name)}</h2><p class="drawer-sub">${escape(instById(d.institutionId).name)} · ${escape(d.category)}</p>
      <div class="drawer-section"><div class="info-list"><div class="info-item"><small>学科带头人</small><b>${escape(d.leader)}</b></div><div class="info-item"><small>医生团队</small><b>${d.doctors} 人</b></div></div></div>
      <div class="drawer-section"><h3>科室介绍</h3><p style="margin-bottom:0;color:#5d7a8a;font-size:10px;line-height:1.9">${escape(d.intro)}</p></div>
      <div class="drawer-section"><h3>科室特色</h3><div class="people-list">${d.featureList.map((f, i) => `<div class="person-card"><span><b>${String(i + 1).padStart(2, "0")} ${escape(f)}</b><small>特色项目</small></span></div>`).join("")}</div></div>
      <div class="drawer-section"><h3>医生团队</h3><div class="people-list">${d.team.map(name => { const m = D.members.find(x => x.name === name); return `<div class="person-card">${m ? avatar(m) : `<span class="avatar">${escape(name.slice(0, 1))}</span>`}<span><b>${escape(name)}</b><small>${m ? escape(m.title) : "医师"}</small></span></div>`; }).join("")}</div></div>
    `);
  }

  /* ---------------------------------------------------------
     Projects
     --------------------------------------------------------- */

  function projectTeamInfo(p) {
    const camp = campById(p.campId);
    const team = camp.team.map(memberById).filter(Boolean);
    const supervisor = team.find(m => m.role === "运营督导");
    const manager = team.find(m => m.role === "运营管理");
    return { camp, team, supervisor, manager };
  }

  function renderProjects() {
    const html = `
      ${pageHead("企康项目", "ENTERPRISE HEALTH PROGRAMS", "", `<a class="btn primary" href="#project/new">${icon("plus")}新建项目</a>`)}
      <div class="filter-bar"><span class="tag blue">全部项目 ${D.projects.length}</span>${["全部", "进行中", "报名中", "已结营"].map(s => `<button class="filter-chip${projectStatus === s ? " active" : ""}" data-project-status="${s}">${s}</button>`).join("")}</div>
      <div class="project-grid">
        ${D.projects.filter(p => projectStatus === "全部" || p.status === projectStatus).map(p => {
          const info = projectTeamInfo(p);
          return `
          <article class="project-card" data-project="${p.id}">
            <div class="project-card-top">
              <div><p class="project-code">${escape(p.id)}</p><h3>${escape(p.name)}</h3><p class="enterprise">${escape(p.enterprise)} · ${escape(instById(p.institutionId).name)}</p></div>
              ${statusTag(p.status)}
            </div>
            <div class="project-meta-grid">
              <div class="project-meta-item"><small>营期时间</small><b>${escape(info.camp.start)} — ${escape(info.camp.end)}</b></div>
              <div class="project-meta-item"><small>运营督导</small><b>${escape(info.supervisor ? info.supervisor.name : "—")}</b></div>
              <div class="project-meta-item"><small>运营管理</small><b>${escape(info.manager ? info.manager.name : "—")}</b></div>
              <div class="project-meta-item"><small>服务成员</small><b>${info.team.length} 人</b></div>
              <div class="project-meta-item"><small>学员数量</small><b>${p.enrolled} <em>/ ${p.target} 人</em></b></div>
              <div class="project-meta-item"><small>打卡完成率</small><b>${p.status === "报名中" ? "—" : p.completion + "%"}</b></div>
            </div>
            <div class="project-card-foot"><span>负责人 ${escape(p.manager)}</span><span>查看项目 →</span></div>
          </article>
        `; }).join("")}
      </div>
    `;
    $("#viewRoot").innerHTML = html;
    setTop("企康项目", "企康项目 / 项目管理");
    $$("[data-project-status]").forEach(btn => btn.addEventListener("click", () => { projectStatus = btn.dataset.projectStatus; renderProjects(); }));
  }

  function renderProjectDetail(id) {
    const p = projectById(id);
    if (!p) return renderProjects();
    const camp = campById(p.campId);
    const students = D.students.filter(s => s.projectId === p.id);
    const teamMembers = camp.team.map(memberById).filter(Boolean);
    const supervisor = teamMembers.find(m => m.role === "运营督导");
    const manager = teamMembers.find(m => m.role === "运营管理");
    const projTabs = [["overview", "概览"], ["team", "服务团队"], ["students", "学员"], ["checkins", "打卡"], ["data", "数据"]];
    let content = "";
    if (projectTab === "overview") {
      content = `
        <div class="detail-stats">
          <div class="detail-stat"><small>参营学员</small><b>${p.enrolled}</b><span>目标 ${p.target} 人</span></div>
          <div class="detail-stat"><small>打卡学员</small><b>${p.checkinUsers}</b><span>至少完成 1 次有效打卡</span></div>
          <div class="detail-stat"><small>打卡完成率</small><b>${p.completion}%</b><span>完成成员 ÷ 参营学员</span></div>
          <div class="detail-stat"><small>平均减重</small><b>${p.weightLoss ? "-" + p.weightLoss : "—"}</b><span>kg / 人</span></div>
        </div>
        <div class="split-layout">
          <section class="panel"><div class="panel-head"><div><h3 class="panel-title">项目信息</h3></div></div><div class="panel-body"><div class="info-list">
            <div class="info-item"><small>企业客户</small><b>${escape(p.enterprise)}</b></div>
            <div class="info-item"><small>项目周期</small><b>${escape(p.start)} — ${escape(p.end)}</b></div>
            <div class="info-item"><small>运营管理</small><b>${escape(manager ? manager.name : "—")}</b></div>
            <div class="info-item"><small>运营督导</small><b>${escape(supervisor ? supervisor.name : "—")}</b></div>
            <div class="info-item"><small>当前营期</small><b>${escape(camp.name)}</b></div>
            <div class="info-item"><small>服务团队人员数量</small><b>${teamMembers.length} 人</b></div>
          </div></div></section>
          <section class="panel"><div class="panel-head"><div><h3 class="panel-title">营期服务团队</h3></div><button class="panel-link" data-project-tab="team">查看全部 →</button></div><div class="panel-body people-list">
            ${teamMembers.slice(0, 6).map(m => `<div class="person-card">${avatar(m)}<span><b>${escape(m.name)}</b><small>${escape(m.role)} · ${escape(instById(m.institutionId).short)}</small></span></div>`).join("")}
          </div></section>
        </div>
        <div class="dash-bottom"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">完成率趋势</h3><p class="panel-sub">近 14 天 · 按完成成员 / 参营学员</p></div></div><div class="chart-wrap">${lineChart(D.chart.labels, D.chart.completion, { min: 60, max: 90, suffix: "%", color: "#2f6bff", id: "p" + p.id })}</div></section>
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">风险与待跟进</h3></div></div><div class="panel-body">${students.filter(s => s.risk !== "低").slice(0, 4).map(s => `<div class="project-mini clickable" data-student="${s.id}" style="margin-bottom:7px"><div class="project-mini-top"><span>${escape(s.name)} ${statusTag(s.risk)}</span><span>${s.completion}%</span></div><small>${escape(s.tags.join(" · "))}</small></div>`).join("") || '<div class="empty">暂无风险学员</div>'}</div></section></div>
      `;
    } else if (projectTab === "team") {
      const groups = ["运营督导", "运营管理", "运营管家", "医师", "健管师", "营养师", "康复师"];
      content = `
        <div class="filter-bar"><span class="tag blue">当前营期：${escape(camp.name)}</span></div>
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">营期服务团队</h3><p class="panel-sub">${escape(camp.start)} — ${escape(camp.end)} · 营期负责人 ${escape(camp.manager)}</p></div><button class="btn small" data-toast="原型演示：分配服务团队">分配成员</button></div><div class="panel-body"><div class="role-grid">
          ${groups.map(role => {
            const people = teamMembers.filter(m => m && (m.role === role || (role === "运营管家" && m.role === "运营管家")));
            return `<div class="role-card" style="--role:#2f6bff;--role-soft:#e9f8ff"><div class="role-card-head"><span class="role-mark">${icon("users")}</span><div><h3>${role}</h3><span class="role-scope">${people.length} 人</span></div></div><div class="people-list" style="margin-top:8px">${people.length ? people.map(m => `<div class="person-card">${avatar(m)}<span><b>${escape(m.name)}</b><small>${escape(m.title)} · ${escape(instById(m.institutionId).short)}</small></span></div>`).join("") : '<span class="drawer-sub" style="font-size:9px;color:#9aaab4">待分配</span>'}</div></div>`;
          }).join("")}
        </div></div></section>
      `;
    } else if (projectTab === "students") {
      content = `<section class="panel"><div class="panel-head"><div><h3 class="panel-title">学员名单</h3><p class="panel-sub">${escape(camp.name)} · ${students.length} 位学员</p></div><button class="btn small" data-toast="原型演示：批量导入学员">导入学员</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>学员</th><th>来源医师</th><th>服务团队</th><th>完成率</th><th>体重变化</th><th>风险</th><th>最近打卡</th></tr></thead><tbody>${students.map(s => `<tr class="clickable" data-student="${s.id}"><td><span class="person-cell"><span class="avatar avatar-sm">${escape(s.name.slice(0, 1))}</span><span><b>${escape(s.name)}</b><small>${escape(s.phone)}</small></span></span></td><td>${escape(s.sourceDoctor)}</td><td>${escape(s.team)}</td><td><b class="cell-main">${s.completion}%</b></td><td>${escape(s.weightChange)} kg</td><td>${statusTag(s.risk)}</td><td>${escape(s.lastCheckin)}</td></tr>`).join("")}</tbody></table></div></section>`;
    } else if (projectTab === "checkins") {
      const ids = new Set(students.map(s => s.id));
      const rows = D.checkins.filter(k => ids.has(k.studentId));
      content = `<section class="panel"><div class="panel-head"><div><h3 class="panel-title">最近打卡</h3><p class="panel-sub">体重 + 三餐 + 运动为完成；加餐不纳入完成统计</p></div><a class="panel-link" href="#checkins">打卡记录 →</a></div><div class="table-wrap"><table class="data-table"><thead><tr><th>日期</th><th>学员</th><th>体重</th><th>三餐</th><th>加餐</th><th>运动</th><th>完成</th><th>健管师批注</th><th>营养师批注</th></tr></thead><tbody>${rows.map(k => { const s = studentById(k.studentId); return `<tr class="clickable" data-checkin="${k.id}"><td>${escape(k.date)}</td><td>${escape(s.name)}</td><td>${k.weight} kg</td><td>${k.meals}/3</td><td>${k.snacks}</td><td>${k.exercise} 分钟</td><td>${k.complete ? '<span class="tag green">已完成</span>' : '<span class="tag red">未完成</span>'}</td><td>${escape(k.healthComment).slice(0, 18)}…</td><td>${escape(k.nutritionComment).slice(0, 18)}…</td></tr>`; }).join("")}</tbody></table></div></section>`;
    } else {
      content = `<div class="detail-stats"><div class="detail-stat"><small>完成率</small><b>${p.completion}%</b><span>完成成员 / 参营学员</span></div><div class="detail-stat"><small>平均减重</small><b>${p.weightLoss ? "-" + p.weightLoss : "—"}</b><span>kg</span></div><div class="detail-stat"><small>打卡学员</small><b>${p.checkinUsers}</b><span>人</span></div><div class="detail-stat"><small>风险学员</small><b>${students.filter(s => s.risk !== "低").length}</b><span>人</span></div></div>
      <div class="split-layout"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">打卡完成率趋势</h3></div></div><div class="chart-wrap">${lineChart(D.chart.labels, D.chart.completion, { min: 60, max: 90, suffix: "%", color: "#2f8f83", id: "pd" + p.id })}</div></section><section class="panel"><div class="panel-head"><div><h3 class="panel-title">体重变化分布</h3></div></div><div class="panel-body metric-bars">${[["下降 ≥5%", 28, "28人"], ["下降 3–5%", 42, "42人"], ["下降 1–3%", 36, "36人"], ["基本持平", 12, "12人"]].map(([l, v, d]) => `<div class="metric-bar"><span>${l}</span><div class="bar"><i style="width:${v}%"></i></div><b>${d}</b></div>`).join("")}</div></section></div>`;
    }
    $("#viewRoot").innerHTML = `
      <button class="back-link" data-back="projects">${icon("back")}返回项目列表</button>
      <div class="detail-head"><div><p class="page-eyebrow">PROGRAM DETAIL · ${escape(p.id)}</p><h2>${escape(p.name)}</h2><p>${escape(p.enterprise)} · ${escape(instById(p.institutionId).name)} · ${escape(camp.name)}</p></div><div class="detail-actions">${statusTag(p.status)}<a class="btn" href="#project/${p.id}/edit">${icon("edit")}编辑项目</a></div></div>
      <div class="tabs">${projTabs.map(([k, l]) => `<button class="tab${projectTab === k ? " active" : ""}" data-project-tab="${k}">${l}</button>`).join("")}</div>
      ${content}
    `;
    setTop(p.name, "企康项目 / 项目详情");
  }

  /* ---------------------------------------------------------
     Students
     --------------------------------------------------------- */

  function renderStudents() {
    const html = `
      ${pageHead("学员管理", "PROGRAM PARTICIPANTS", "企业客户学员由负责企康项目的机构医师成员录入，账号为手机号 + 姓名", `<button class="btn primary" data-toast="原型演示：进入新增学员">${icon("plus")}新增学员</button>`)}
      <div class="filter-bar">
        <label class="filter-search">${icon("search")}<input id="studentSearch" placeholder="搜索姓名、手机号、项目或来源医师" /></label>
        <select class="filter-select" id="studentStatus"><option>全部状态</option><option>在营</option><option>待入营</option><option>已完成</option></select>
        <span class="tag blue">学员 ${D.students.length} 人</span>
      </div>
      <section class="panel"><div class="table-wrap"><table class="data-table" id="studentTable">
        <thead><tr><th>学员</th><th>项目 / 营期</th><th>来源医师</th><th>服务团队</th><th>打卡完成率</th><th>体重变化</th><th>风险</th><th>最近打卡</th></tr></thead>
        <tbody>${D.students.map(s => `<tr class="clickable" data-student="${s.id}">
          <td><span class="person-cell"><span class="avatar avatar-sm">${escape(s.name.slice(0, 1))}</span><span><b>${escape(s.name)}</b><small>${escape(s.phone)}</small></span></span></td>
          <td><span class="cell-main">${escape(projectById(s.projectId).name)}</span><span class="cell-sub">${escape(campById(s.campId).name)}</span></td>
          <td>${escape(s.sourceDoctor)}</td><td>${escape(s.team)}</td>
          <td><b class="cell-main">${s.completion}%</b></td><td>${escape(s.weightChange)} kg</td><td>${statusTag(s.risk)}</td><td>${escape(s.lastCheckin)}</td>
        </tr>`).join("")}</tbody>
      </table></div></section>
    `;
    $("#viewRoot").innerHTML = html;
    setTop("学员管理", "企康项目 / 学员管理");
    const input = $("#studentSearch");
    const status = $("#studentStatus");
    const filter = () => {
      const q = input.value.trim();
      $$("#studentTable tbody tr").forEach(tr => {
        tr.style.display = (!q || tr.innerText.includes(q)) && (status.value === "全部状态" || tr.innerText.includes(status.value)) ? "" : "none";
      });
    };
    input.addEventListener("input", filter);
    status.addEventListener("change", filter);
  }

  function weightSeries(s) {
    const list = D.checkins.filter(k => k.studentId === s.id).slice().sort((a, b) => a.date.localeCompare(b.date));
    const labels = ["入营", ...list.map(k => k.date.slice(5))];
    const values = [Number(s.startWeight), ...list.map(k => Number(k.weight))];
    if (values.length < 2) return { labels: ["入营", "当前"], values: [Number(s.startWeight), Number(s.weight)] };
    return { labels, values };
  }

  function renderStudentDetail(id) {
    const s = studentById(id);
    if (!s) return renderStudents();
    const p = projectById(s.projectId);
    const tabs = [["profile", "学员档案"], ["checkins", "打卡记录"], ["body", "体成分与指标"], ["notes", "服务记录"]];
    let content = "";
    if (studentTab === "profile") {
      content = `<div class="split-layout">
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">基本信息</h3><p class="panel-sub">后台运营人员可见完整健康档案</p></div></div><div class="panel-body"><div class="info-list">
          <div class="info-item"><small>姓名</small><b>${escape(s.name)}</b></div><div class="info-item"><small>性别 / 年龄</small><b>${escape(s.gender)} / ${s.age} 岁</b></div>
          <div class="info-item"><small>手机号</small><b>${escape(s.phone)}</b></div><div class="info-item"><small>身高</small><b>${s.height} cm</b></div>
          <div class="info-item"><small>入营体重</small><b>${s.startWeight} kg</b></div><div class="info-item"><small>当前体重</small><b>${s.weight} kg</b></div>
          <div class="info-item"><small>目标体重</small><b>${s.target} kg</b></div><div class="info-item"><small>体脂率</small><b>${s.startBodyFat}% → ${s.bodyFat}%</b></div>
          <div class="info-item"><small>来源医师</small><b>${escape(s.sourceDoctor)}</b></div><div class="info-item"><small>服务团队</small><b>${escape(s.team)}</b></div>
          <div class="info-item full"><small>标签</small><div class="tag-row">${s.tags.map(t => `<span class="tag">${escape(t)}</span>`).join("")}</div></div>
        </div></div></section>
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">项目信息</h3></div></div><div class="panel-body"><div class="info-list">
          <div class="info-item"><small>所属项目</small><b>${escape(p.name)}</b></div><div class="info-item"><small>企业客户</small><b>${escape(p.enterprise)}</b></div>
          <div class="info-item"><small>营期</small><b>${escape(campById(s.campId).name)}</b></div><div class="info-item"><small>状态</small><b>${statusTag(s.status)}</b></div>
          <div class="info-item"><small>学员账号</small><b>手机号 + 姓名</b></div><div class="info-item"><small>入营问卷</small><b>已完成</b></div>
        </div><div class="note-box" style="margin-top:12px">学员账号由机构医师成员在录入学员时生成，后台仅面向运营人员使用。</div></div></section>
      </div>`;
    } else if (studentTab === "checkins") {
      const rows = D.checkins.filter(k => k.studentId === s.id);
      content = `<section class="panel"><div class="panel-head"><div><h3 class="panel-title">打卡记录</h3><p class="panel-sub">每日体重 + 三餐 + 运动计为完成；加餐单独记录，不纳入完成率</p></div><span class="tag blue">完成率 ${s.completion}%</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>日期</th><th>体重</th><th>三餐</th><th>加餐</th><th>运动</th><th>完成</th><th>健管师批注 / 评分</th><th>营养师批注 / 评分</th></tr></thead><tbody>${rows.map(k => `<tr><td><span class="cell-main">${escape(k.date)}</span><span class="cell-sub">${escape(k.time)}</span></td><td>${k.weight} kg</td><td>${k.meals}/3</td><td>${k.snacks}</td><td>${escape(k.exerciseType)} · ${k.exercise} 分钟</td><td>${k.complete ? '<span class="tag green">已完成</span>' : '<span class="tag red">未完成</span>'}</td><td><span class="cell-sub" style="display:block;max-width:210px">${escape(k.healthComment)}</span><span class="tag gold">${k.healthScore} 分</span></td><td><span class="cell-sub" style="display:block;max-width:210px">${escape(k.nutritionComment)}</span><span class="tag green">${k.nutritionScore} 分</span></td></tr>`).join("") || '<tr><td colspan="8"><div class="empty">暂无打卡记录</div></td></tr>'}</tbody></table></div></section>`;
    } else if (studentTab === "body") {
      const series = weightSeries(s);
      const values = getBodyValues(s);
      const bfStart = Number(s.startBodyFat);
      const bfEnd = Number(s.bodyFat);
      const bfValues = [bfStart, +(bfStart * 0.66 + bfEnd * 0.34).toFixed(1), +(bfStart * 0.31 + bfEnd * 0.69).toFixed(1), bfEnd];
      content = `<div class="split-layout"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">体重趋势</h3><p class="panel-sub">入营至最近一次有效打卡</p></div></div><div class="chart-wrap">${lineChart(series.labels, series.values, { min: Math.min(...series.values) - 1, max: Math.max(...series.values) + 1, suffix: "", color: "#2f6bff", id: "w" + s.id })}</div></section><section class="panel"><div class="panel-head"><div><h3 class="panel-title">关键变化</h3></div></div><div class="panel-body"><div class="detail-stats" style="grid-template-columns:repeat(2,1fr)"><div class="detail-stat"><small>体重变化</small><b>${escape(s.weightChange)}</b><span>kg</span></div><div class="detail-stat"><small>体脂率变化</small><b>${(Number(s.bodyFat) - Number(s.startBodyFat)).toFixed(1)}</b><span>%</span></div></div><div class="note-box" style="margin-top:12px">营前 / 营后体成分与健康指标由营养师录入；医师成员可维护指标名称、单位、参考范围和分类。</div></div></section></div>
      <section class="panel" style="margin-top:12px"><div class="panel-head"><div><h3 class="panel-title">体脂率趋势</h3><p class="panel-sub">营前、阶段测量与最近一次体成分记录</p></div><span class="tag gold">下降 ${Math.abs(bfEnd - bfStart).toFixed(1)} 个百分点</span></div><div class="chart-wrap">${lineChart(["入营", "第 2 周", "第 4 周", "最近"], bfValues, { min: Math.min(...bfValues) - 1, max: Math.max(...bfValues) + 1, suffix: "%", color: "#8b5cf6", id: "bf" + s.id })}</div></section>
      <section class="panel" style="margin-top:12px"><div class="panel-head"><div><h3 class="panel-title">营前 / 营后指标</h3><p class="panel-sub">指标字典由后台初始化，支持分类管理</p></div><span class="tag blue">${values.length} 项</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>指标</th><th>分类</th><th>单位</th><th>营前</th><th>营后</th><th>参考范围</th><th>状态</th></tr></thead><tbody>${values.map(v => `<tr><td><span class="cell-main">${escape(v.name)}</span></td><td>${escape(v.category)}</td><td>${escape(v.unit)}</td><td>${escape(v.pre)}</td><td><b class="cell-main">${escape(v.post)}</b></td><td class="ref-value">${escape(v.reference)}</td><td><span class="tag ${v.status === "改善" || v.status === "正常" ? "green" : v.status === "待录入" ? "slate" : "gold"}">${escape(v.status)}</span></td></tr>`).join("")}</tbody></table></div></section>`;
    } else {
      content = `<section class="panel"><div class="panel-head"><div><h3 class="panel-title">服务记录</h3><p class="panel-sub">医师、健管师、营养师围绕学员的服务动作</p></div></div><div class="panel-body">
        <div class="people-list">
          <div class="person-card"><span><b>入营评估</b><small>${escape(s.sourceDoctor)} · 2026-09-01</small></span></div>
          <div class="person-card"><span><b>营养方案</b><small>陈晓 · 2026-09-03</small></span></div>
          <div class="person-card"><span><b>运动方案</b><small>刘洋 · 2026-09-04</small></span></div>
          <div class="person-card"><span><b>阶段随访</b><small>王琳 · 2026-10-19</small></span></div>
        </div>
        <div class="note-box" style="margin-top:12px">健康档案字段对后台运营人员全部可见；不区分字段权限。</div>
      </div></section>`;
    }
    $("#viewRoot").innerHTML = `
      <button class="back-link" data-back="students">${icon("back")}返回学员列表</button>
      <div class="detail-head"><div><p class="page-eyebrow">PARTICIPANT PROFILE · ${escape(s.id)}</p><h2>${escape(s.name)}</h2><p>${escape(p.name)} · ${escape(campById(s.campId).name)} · 来源医师 ${escape(s.sourceDoctor)}</p></div><div class="detail-actions">${statusTag(s.status)}<button class="btn" data-toast="原型演示：编辑学员档案">${icon("edit")}编辑档案</button></div></div>
      <div class="detail-stats"><div class="detail-stat"><small>打卡完成率</small><b>${s.completion}%</b><span>完成成员 / 参营学员</span></div><div class="detail-stat"><small>体重变化</small><b>${escape(s.weightChange)}</b><span>kg</span></div><div class="detail-stat"><small>体脂率</small><b>${s.bodyFat}%</b><span>入营 ${s.startBodyFat}%</span></div><div class="detail-stat"><small>风险等级</small><b style="font-size:19px">${statusTag(s.risk)}</b><span>${escape(s.tags.join(" · "))}</span></div></div>
      <div class="tabs">${tabs.map(([k, l]) => `<button class="tab${studentTab === k ? " active" : ""}" data-student-tab="${k}">${l}</button>`).join("")}</div>
      ${content}
    `;
    setTop(s.name, "企康项目 / 学员详情");
  }

  /* ---------------------------------------------------------
     Checkins
     --------------------------------------------------------- */

  function renderCheckins() {
    const html = `
      ${pageHead("打卡记录", "DAILY CHECK-INS", "", "")}
      <div class="filter-bar"><label class="filter-search">${icon("search")}<input id="checkinSearch" placeholder="搜索学员、项目或日期" /></label></div>
      <section class="panel"><div class="table-wrap"><table class="data-table" id="checkinTable"><thead><tr><th>日期</th><th>学员</th><th>项目</th><th>体重</th><th>三餐</th><th>加餐</th><th>运动</th><th>完成</th><th>健管师评分</th><th>营养师评分</th></tr></thead><tbody>
        ${D.checkins.map(k => { const s = studentById(k.studentId); return `<tr class="clickable" data-checkin="${k.id}"><td>${escape(k.date)}<span class="cell-sub">${escape(k.time)}</span></td><td><span class="person-cell"><span class="avatar avatar-sm">${escape(s.name.slice(0, 1))}</span><span><b>${escape(s.name)}</b><small>${escape(s.phone)}</small></span></span></td><td>${escape(projectById(s.projectId).name)}</td><td>${k.weight} kg</td><td>${k.meals}/3</td><td>${k.snacks}</td><td>${k.exercise} 分钟</td><td>${k.complete ? '<span class="tag green">已完成</span>' : '<span class="tag red">未完成</span>'}</td><td><span class="tag gold">${k.healthScore}</span></td><td><span class="tag green">${k.nutritionScore}</span></td></tr>`; }).join("")}
      </tbody></table></div></section>
    `;
    $("#viewRoot").innerHTML = html;
    setTop("打卡记录", "企康项目 / 打卡记录");
    const input = $("#checkinSearch");
    input.addEventListener("input", () => {
      const q = input.value.trim();
      $$("#checkinTable tbody tr").forEach(tr => tr.style.display = !q || tr.innerText.includes(q) ? "" : "none");
    });
  }

  function checkinDrawer(id) {
    const k = D.checkins.find(x => x.id === id);
    const s = studentById(k.studentId);
    openDrawer(`
      <p class="page-eyebrow">CHECK-IN DETAIL</p><h2>${escape(s.name)} · ${escape(k.date)}</h2><p class="drawer-sub">${escape(projectById(s.projectId).name)} · ${k.complete ? "已完成" : "未完成"}</p>
      <div class="drawer-section"><div class="info-list"><div class="info-item"><small>体重</small><b>${k.weight} kg</b></div><div class="info-item"><small>三餐</small><b>${k.meals}/3</b></div><div class="info-item"><small>加餐</small><b>${k.snacks} 次（不计入完成）</b></div><div class="info-item"><small>运动</small><b>${escape(k.exerciseType)} · ${k.exercise} 分钟</b></div></div></div>
      <div class="drawer-section"><h3>健管师批注 · 运动</h3><p style="margin:0;color:#5d7a8a;font-size:10px;line-height:1.8">${escape(k.healthComment)}</p><span class="tag gold" style="margin-top:7px;display:inline-flex">评分 ${k.healthScore}</span></div>
      <div class="drawer-section"><h3>营养师批注 · 体重 / 饮食</h3><p style="margin:0;color:#5d7a8a;font-size:10px;line-height:1.8">${escape(k.nutritionComment)}</p><span class="tag green" style="margin-top:7px;display:inline-flex">评分 ${k.nutritionScore}</span></div>
    `);
  }

  /* ---------------------------------------------------------
     Indicators
     --------------------------------------------------------- */

  function renderIndicators() {
    const cats = ["全部", "体成分", "血糖相关", "血脂相关", "肝功能相关", "肾功能相关"];
    const list = D.indicators.filter(i => indicatorCat === "全部" || i.category === indicatorCat);
    const html = `
      ${pageHead("体成分指标", "HEALTH INDICATORS", "指标由后台初始化；营前 / 营后数据由营养师录入，医师成员可维护指标字典", `<button class="btn primary" data-toast="原型演示：新增指标">${icon("plus")}新增指标</button>`)}
      <div class="note-box" style="margin-bottom:12px;display:flex;gap:8px;align-items:center"><span class="tag blue">录入规则</span> 营养师填写营前 / 营后数据 · 医师成员维护指标名称、单位、参考范围、分类 · 不支持设备接口</div>
      <div class="indicator-category">${cats.map(c => `<button class="${indicatorCat === c ? "active" : ""}" data-indicator-cat="${c}">${c}</button>`).join("")}</div>
      <section class="panel"><div class="panel-head"><div><h3 class="panel-title">指标字典</h3><p class="panel-sub">${list.length} 项 · 分类来源于健康指标参考</p></div><span class="tag green">启用</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>指标名称</th><th>分类</th><th>单位</th><th>参考值 / 范围</th><th>录入角色</th><th>状态</th></tr></thead><tbody>${list.map(i => `<tr><td><span class="cell-main">${escape(i.name)}</span></td><td><span class="tag ${i.category === "肾功能相关" ? "green" : i.category === "肝功能相关" ? "gold" : "blue"}">${escape(i.category)}</span></td><td>${escape(i.unit)}</td><td class="ref-value">${escape(i.reference)}</td><td>${escape(i.inputRole)}</td><td><span class="tag green">启用</span></td></tr>`).join("")}</tbody></table></div></section>
    `;
    $("#viewRoot").innerHTML = html;
    setTop("体成分指标", "健康数据 / 体成分指标");
    $$("[data-indicator-cat]").forEach(btn => btn.addEventListener("click", () => { indicatorCat = btn.dataset.indicatorCat; renderIndicators(); }));
  }

  /* ---------------------------------------------------------
     Accounts / roles
     --------------------------------------------------------- */

  function renderAccounts() {
    const html = `
      ${pageHead("账号管理", "OPERATIONS ACCOUNTS", "按角色、项目与营期授权数据范围，不按机构隔离", `<button class="btn primary" data-toast="原型演示：新增账号">${icon("plus")}新增账号</button>`)}
      <div class="filter-bar"><label class="filter-search">${icon("search")}<input id="accountSearch" placeholder="搜索姓名、手机号或角色" /></label></div>
      <section class="panel"><div class="table-wrap"><table class="data-table" id="accountTable"><thead><tr><th>账号</th><th>手机号</th><th>角色</th><th>数据范围</th><th>负责项目</th><th>状态</th><th>最近登录</th></tr></thead><tbody>${D.accounts.map(a => `<tr><td><span class="person-cell"><span class="avatar avatar-sm">${escape(a.name.slice(0, 1))}</span><span><b>${escape(a.name)}</b><small>${escape(a.id)}</small></span></span></td><td>${escape(a.phone)}</td><td>${roleTag(a.role)}</td><td><span class="cell-main">${escape(a.scope)}</span></td><td><div class="tag-row">${a.projects.length ? a.projects.map(p => `<span class="tag">${escape(projectById(p).name)}</span>`).join("") : '<span class="tag slate">全部项目</span>'}</div></td><td>${statusTag(a.status)}</td><td>${escape(a.lastLogin)}</td></tr>`).join("")}</tbody></table></div></section>
    `;
    $("#viewRoot").innerHTML = html;
    setTop("账号管理", "系统管理 / 账号管理");
    const input = $("#accountSearch");
    input.addEventListener("input", () => {
      const q = input.value.trim();
      $$("#accountTable tbody tr").forEach(tr => tr.style.display = !q || tr.innerText.includes(q) ? "" : "none");
    });
  }

  function renderRoles() {
    const html = `
      ${pageHead("角色权限", "ROLE & DATA SCOPE", "数据按角色所赋予的项目、营期权限隔离，不按机构隔离", `<span class="tag blue">7 个角色</span>`)}
      <div class="role-grid">
        ${D.roles.map(r => `<article class="role-card" style="--role:${r.key === "super" ? "#315d78" : r.key === "supervisor" ? "#466c9e" : r.key === "operation" ? "#1e8fbf" : r.key === "doctor" ? "#8a6d3b" : r.key === "health" ? "#2f8f83" : r.key === "nutrition" ? "#8b5cf6" : "#6e8296"};--role-soft:#f1f8fb">
          <div class="role-card-head"><span class="role-mark">${icon(r.key === "super" ? "settings" : r.key === "supervisor" ? "chart" : r.key === "operation" ? "project" : "users")}</span><div><h3>${escape(r.name)}</h3><span class="role-scope">${escape(r.scope)}</span></div></div>
          <p>${escape(r.desc)}</p><div class="permission-tags">${r.permissions.map(p => `<span>${escape(p)}</span>`).join("")}</div>
        </article>`).join("")}
      </div>
    `;
    $("#viewRoot").innerHTML = html;
    setTop("角色权限", "系统管理 / 角色权限");
  }

  /* ---------------------------------------------------------
     Edit / create pages
     --------------------------------------------------------- */

  function field(label, control, full) {
    return `<label class="field${full ? " full" : ""}"><span>${label}</span>${control}</label>`;
  }

  function institutionOptions(selected) {
    return D.institutions.map(i => `<option value="${i.id}"${i.id === selected ? " selected" : ""}>${escape(i.name)}</option>`).join("");
  }

  function projectMemberGroups(selectedIds) {
    const ids = new Set(selectedIds || []);
    return D.institutions.map(inst => {
      const people = D.members.filter(m => m.institutionId === inst.id);
      if (!people.length) return "";
      return `<div class="picker-hospital">
        <div class="picker-hospital-head"><b>${escape(inst.name)}</b><span>${people.length} 人</span></div>
        <div class="picker-members">
          ${people.map(m => `<label class="picker-member${ids.has(m.id) ? " selected" : ""}">
            <input type="checkbox" data-pick="${m.id}"${ids.has(m.id) ? " checked" : ""} />
            ${avatar(m)}
            <span class="picker-member-info"><b>${escape(m.name)}</b><small>${escape(m.role)} · ${escape(m.dept)}</small></span>
          </label>`).join("")}
        </div>
      </div>`;
    }).join("");
  }

  function renderProjectForm(id) {
    const editing = !!id;
    const p = editing ? projectById(id) : null;
    const camp = editing ? campById(p.campId) : null;
    const title = editing ? "编辑项目" : "新建项目";
    const back = editing ? `#project/${p.id}` : "#projects";
    const team = camp ? camp.team : [];
    const supervisor = camp ? camp.team.map(memberById).find(m => m && m.role === "运营督导") : null;
    const manager = camp ? camp.team.map(memberById).find(m => m && m.role === "运营管理") : null;
    const selected = new Set(team);
    const supervisors = D.members.filter(m => m.role === "运营督导");
    const managers = D.members.filter(m => m.role === "运营管理");
    const html = `
      <button class="back-link" data-back="${editing ? "project/" + p.id : "projects"}">${icon("back")}${editing ? "返回项目详情" : "返回项目列表"}</button>
      <div class="detail-head"><div><h2>${title}</h2></div></div>
      <form class="entity-form" onsubmit="return false">
        <div class="form-layout">
          <div class="form-main">
            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">项目基本信息</h3></div>
              <div class="panel-body form-grid">
                ${field("项目名称", `<input value="${escape(p ? p.name : "")}" placeholder="请输入项目名称" />`, true)}
                ${field("企业客户", `<input value="${escape(p ? p.enterprise : "")}" placeholder="请输入企业客户名称" />`)}
                ${field("服务主体机构", `<select>${institutionOptions(p ? p.institutionId : "I001")}</select>`)}
                ${field("项目周期开始", `<input type="date" value="${escape(p ? p.start : "2026-11-20")}" />`)}
                ${field("项目周期结束", `<input type="date" value="${escape(p ? p.end : "2027-02-20")}" />`)}
                ${field("项目负责人", `<input value="${escape(p ? p.manager : "王倩")}" />`)}
              </div>
            </section>

            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">营期信息</h3></div>
              <div class="panel-body form-grid">
                ${field("当前营期", `<input value="${escape(camp ? camp.name : "")}" placeholder="例如：中石油华北员工减重营" />`, true)}
                ${field("计划学员数", `<input type="number" value="${p ? p.target : 60}" />`)}
                ${field("营期开始", `<input type="date" value="${escape(camp ? camp.start : "2026-11-20")}" />`)}
                ${field("营期结束", `<input type="date" value="${escape(camp ? camp.end : "2027-02-20")}" />`)}
              </div>
            </section>

            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">运营团队</h3></div>
              <div class="panel-body">
                <div class="form-grid">
                  ${field("运营督导", `<select>${supervisors.map(m => `<option value="${m.id}"${supervisor && supervisor.id === m.id ? " selected" : ""}>${escape(m.name)} · ${escape(instById(m.institutionId).short)}</option>`).join("")}</select>`)}
                  ${field("运营管理", `<select>${managers.map(m => `<option value="${m.id}"${manager && manager.id === m.id ? " selected" : ""}>${escape(m.name)} · ${escape(instById(m.institutionId).short)}</option>`).join("")}</select>`)}
                </div>
                <div class="field full" style="margin-top:14px"><span>服务成员</span>
                  <div class="member-picker" id="memberPicker">${projectMemberGroups(team)}</div>
                </div>
              </div>
            </section>

            <div class="form-actions">
              <a class="btn" href="${back}">取消</a>
              <button class="btn primary" type="button" data-save-form="project" data-back="${back}">保存项目</button>
            </div>
          </div>

          <aside class="form-aside">
            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">已选服务成员</h3></div>
              <div class="panel-body">
                <div class="picker-summary"><span>服务成员</span><b id="pickerCount">${team.length} 人</b></div>
                <div class="selected-member-list" id="selectedMembers"></div>
              </div>
            </section>
            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">项目摘要</h3></div>
              <div class="panel-body">
                <div class="info-list">
                  <div class="info-item"><small>企业客户</small><b>${escape(p ? p.enterprise : "—")}</b></div>
                  <div class="info-item"><small>当前营期</small><b>${escape(camp ? camp.name : "—")}</b></div>
                  <div class="info-item"><small>项目状态</small><b>${statusTag(p ? p.status : "报名中")}</b></div>
                  <div class="info-item"><small>计划学员</small><b>${p ? p.target : 60} 人</b></div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </form>
    `;
    $("#viewRoot").innerHTML = html;
    setTop(title, `企康项目 / ${title}`);

    const picker = $("#memberPicker");
    const count = $("#pickerCount");
    const selectedBox = $("#selectedMembers");
    const updateSelected = () => {
      const picked = $$("[data-pick]:checked", picker).map(input => memberById(input.dataset.pick)).filter(Boolean);
      count.textContent = `${picked.length} 人`;
      $$(".picker-member", picker).forEach(label => label.classList.toggle("selected", !!$("input:checked", label)));
      selectedBox.innerHTML = picked.length ? picked.map(m => `<div class="selected-member">${avatar(m)}<span><b>${escape(m.name)}</b><small>${escape(instById(m.institutionId).short)} · ${escape(m.role)}</small></span></div>`).join("") : `<div class="empty">未选择</div>`;
    };
    if (picker) {
      picker.addEventListener("change", updateSelected);
      updateSelected();
    }
  }

  function renderMemberForm(id) {
    const editing = !!id;
    const m = editing ? memberById(id) : null;
    const title = editing ? "编辑成员介绍" : "新增成员";
    const back = "#members";
    const projects = new Set(m ? m.projects : []);
    const html = `
      <button class="back-link" data-back="members">${icon("back")}返回机构成员</button>
      <div class="detail-head"><div><h2>${title}</h2></div></div>
      <form class="entity-form" onsubmit="return false">
        <div class="form-layout">
          <div class="form-main">
            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">基本信息</h3></div>
              <div class="panel-body form-grid">
                ${field("姓名", `<input value="${escape(m ? m.name : "")}" placeholder="请输入姓名" />`)}
                ${field("性别", `<select>${["男", "女"].map(g => `<option${m && m.gender === g ? " selected" : ""}>${g}</option>`).join("")}</select>`)}
                ${field("手机号", `<input value="${escape(m ? m.phone : "")}" placeholder="请输入手机号" />`)}
                ${field("所属机构", `<select>${institutionOptions(m ? m.institutionId : "I001")}</select>`)}
                ${field("所在科室", `<input value="${escape(m ? m.dept : "")}" placeholder="请输入科室" />`)}
                ${field("角色", `<select>${["医师", "健管师", "营养师", "康复师", "运营督导", "运营管理", "运营管家"].map(r => `<option${m && m.role === r ? " selected" : ""}>${r}</option>`).join("")}</select>`)}
                ${field("职称", `<input value="${escape(m ? m.title : "")}" placeholder="请输入职称" />`)}
                ${field("专业资质", `<input value="${escape(m ? m.qualification : "")}" placeholder="请输入专业资质" />`)}
              </div>
            </section>

            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">成员介绍</h3></div>
              <div class="panel-body form-grid">
                ${field("成员介绍", `<textarea rows="6" placeholder="请输入成员介绍">${escape(m ? m.intro : "")}</textarea>`, true)}
                ${field("擅长方向", `<input value="${escape(m ? m.specialty : "")}" placeholder="请输入擅长方向" />`, true)}
                <div class="field full"><span>服务项目</span><div class="check-grid">${D.projects.map(p => `<label class="check-item"><input type="checkbox"${projects.has(p.id) ? " checked" : ""} /><span>${escape(p.name)}</span></label>`).join("")}</div></div>
              </div>
            </section>

            <div class="form-actions">
              <a class="btn" href="${back}">取消</a>
              <button class="btn primary" type="button" data-save-form="member" data-back="${back}">保存成员</button>
            </div>
          </div>

          <aside class="form-aside">
            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">成员头像</h3></div>
              <div class="panel-body">
                <div class="avatar-upload">${avatar(m || { name: "新" }, "avatar-xl")}<span>上传头像</span></div>
                <div class="info-list" style="margin-top:14px">
                  <div class="info-item"><small>所属机构</small><b>${escape(m ? instById(m.institutionId).name : "待选择")}</b></div>
                  <div class="info-item"><small>角色</small><b>${escape(m ? m.role : "待选择")}</b></div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </form>
    `;
    $("#viewRoot").innerHTML = html;
    setTop(title, `内容管理 / ${title}`);
  }

  function doctorPickerHtml(institutionId, selectedNames) {
    return D.members.filter(m => m.institutionId === institutionId).map(m => `<label class="picker-member${selectedNames.has(m.name) ? " selected" : ""}">
      <input type="checkbox" data-doctor-pick="${m.id}"${selectedNames.has(m.name) ? " checked" : ""} />
      ${avatar(m)}
      <span class="picker-member-info"><b>${escape(m.name)}</b><small>${escape(m.title)} · ${escape(instById(m.institutionId).short)}</small></span>
    </label>`).join("");
  }

  function renderDepartmentForm(id) {
    const editing = !!id;
    const d = editing ? D.departments.find(x => x.id === id) : null;
    const title = editing ? "编辑科室" : "新增科室";
    const back = "#departments";
    const institutionId = d ? d.institutionId : "I001";
    const doctors = D.members.filter(m => m.institutionId === institutionId);
    const selectedNames = new Set(d ? d.team : []);
    const features = Array.from({ length: 4 }, (_, i) => d && d.featureList[i] ? d.featureList[i] : "");
    const html = `
      <button class="back-link" data-back="departments">${icon("back")}返回科室列表</button>
      <div class="detail-head"><div><h2>${title}</h2></div></div>
      <form class="entity-form" onsubmit="return false">
        <div class="form-layout">
          <div class="form-main">
            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">科室信息</h3></div>
              <div class="panel-body form-grid">
                ${field("科室名称", `<input value="${escape(d ? d.name : "")}" placeholder="请输入科室名称" />`)}
                ${field("所属机构", `<select id="deptInstitution">${institutionOptions(institutionId)}</select>`)}
                ${field("科室分类", `<select>${["科室中心", "特色中心", "特色门诊"].map(c => `<option${d && d.category === c ? " selected" : ""}>${c}</option>`).join("")}</select>`)}
                ${field("学科带头人", `<input value="${escape(d ? d.leader : "")}" placeholder="请输入学科带头人" />`)}
                ${field("医生数量", `<input type="number" value="${d ? d.doctors : 0}" />`)}
              </div>
            </section>

            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">科室介绍</h3></div>
              <div class="panel-body">
                ${field("科室介绍", `<textarea rows="5" placeholder="请输入科室介绍">${escape(d ? d.intro : "")}</textarea>`, true)}
                <div class="form-grid" style="margin-top:14px">
                  ${features.map((f, i) => field(`科室特色 ${i + 1}`, `<input value="${escape(f)}" placeholder="请输入科室特色" />`)).join("")}
                </div>
                <button class="btn small" type="button" style="margin-top:10px" data-toast="原型演示：新增科室特色">${icon("plus")}新增特色</button>
              </div>
            </section>

            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">医生团队</h3></div>
              <div class="panel-body">
                <div class="doctor-picker" id="doctorPicker">${doctorPickerHtml(institutionId, selectedNames)}</div>
              </div>
            </section>

            <div class="form-actions">
              <a class="btn" href="${back}">取消</a>
              <button class="btn primary" type="button" data-save-form="department" data-back="${back}">保存科室</button>
            </div>
          </div>

          <aside class="form-aside">
            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">所属机构</h3></div>
              <div class="panel-body">
                <div class="info-list">
                  <div class="info-item full"><small>机构</small><b>${escape(instById(institutionId).name)}</b></div>
                  <div class="info-item"><small>科室分类</small><b>${escape(d ? d.category : "科室中心")}</b></div>
                  <div class="info-item"><small>医生团队</small><b id="doctorCount">${d ? d.team.length : 0} 人</b></div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </form>
    `;
    $("#viewRoot").innerHTML = html;
    setTop(title, `内容管理 / ${title}`);

    const deptInst = $("#deptInstitution");
    const doctorPicker = $("#doctorPicker");
    const doctorCount = $("#doctorCount");
    const updateDoctorCount = () => {
      if (!doctorPicker || !doctorCount) return;
      const picked = $$("[data-doctor-pick]:checked", doctorPicker).length;
      doctorCount.textContent = `${picked} 人`;
    };
    if (doctorPicker) {
      doctorPicker.addEventListener("change", updateDoctorCount);
      updateDoctorCount();
    }
    if (deptInst && doctorPicker) {
      deptInst.addEventListener("change", () => {
        doctorPicker.innerHTML = doctorPickerHtml(deptInst.value, new Set());
        updateDoctorCount();
      });
    }
  }

  function renderInstitutionForm(id) {
    const editing = !!id;
    const i = editing ? instById(id) : null;
    const title = editing ? "编辑机构" : "新增机构";
    const intro = i ? `${i.name}是北大医疗集团成员机构，位于${i.city}。` : "";
    const html = `
      <button class="back-link" data-back="institutions">${icon("back")}返回机构列表</button>
      <div class="detail-head"><div><h2>${title}</h2></div></div>
      <form class="entity-form" onsubmit="return false">
        <div class="form-layout">
          <div class="form-main">
            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">机构信息</h3></div>
              <div class="panel-body form-grid">
                ${field("机构名称", `<input value="${escape(i ? i.name : "")}" placeholder="请输入机构名称" />`, true)}
                ${field("机构简称", `<input value="${escape(i ? i.short : "")}" placeholder="请输入机构简称" />`)}
                ${field("所属地区", `<input value="${escape(i ? i.region : "")}" placeholder="请输入所属地区" />`)}
                ${field("城市", `<input value="${escape(i ? i.city : "")}" placeholder="请输入城市" />`)}
                ${field("机构类型", `<select>${["综合医院", "康复医院", "健康管理中心", "专科医院"].map(t => `<option${i && i.type === t ? " selected" : ""}>${t}</option>`).join("")}</select>`)}
                ${field("负责人", `<input value="${escape(i ? i.manager : "")}" placeholder="请输入负责人" />`)}
                ${field("联系电话", `<input value="${escape(i ? i.phone : "")}" placeholder="请输入联系电话" />`)}
                ${field("机构状态", `<select>${["启用", "停用"].map(s => `<option${i && i.status === s ? " selected" : ""}>${s}</option>`).join("")}</select>`)}
                ${field("机构地址", `<input value="${escape(i ? i.address : "")}" placeholder="请输入机构地址" />`, true)}
              </div>
            </section>

            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">机构介绍</h3></div>
              <div class="panel-body">
                ${field("机构介绍", `<textarea rows="6" placeholder="请输入机构介绍">${escape(intro)}</textarea>`, true)}
              </div>
            </section>

            <div class="form-actions">
              <a class="btn" href="#institutions">取消</a>
              <button class="btn primary" type="button" data-save-form="institution" data-back="institutions">保存机构</button>
            </div>
          </div>

          <aside class="form-aside">
            <section class="panel">
              <div class="panel-head"><h3 class="panel-title">机构数据</h3></div>
              <div class="panel-body">
                <div class="detail-stats" style="grid-template-columns:repeat(3,1fr);gap:7px">
                  <div class="detail-stat"><small>成员</small><b>${i ? i.members : 0}</b></div>
                  <div class="detail-stat"><small>科室</small><b>${i ? i.departments : 0}</b></div>
                  <div class="detail-stat"><small>项目</small><b>${i ? i.projects : 0}</b></div>
                </div>
                <div class="info-list" style="margin-top:14px">
                  <div class="info-item full"><small>所属集团</small><b>北大医疗集团</b></div>
                  <div class="info-item full"><small>机构状态</small><b>${statusTag(i ? i.status : "启用")}</b></div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </form>
    `;
    $("#viewRoot").innerHTML = html;
    setTop(title, `内容管理 / ${title}`);
  }

  /* ---------------------------------------------------------
     Router
     --------------------------------------------------------- */

  function renderRoute() {
    const raw = location.hash.replace(/^#/, "") || "dashboard";
    const parts = raw.split("/");
    const view = parts[0];
    if (view === "project") {
      if (parts[1] === "new") { renderProjectForm(null); return; }
      if (parts[2] === "edit") { renderProjectForm(parts[1]); return; }
      if (lastProject !== parts[1]) { projectTab = "overview"; lastProject = parts[1]; }
      renderProjectDetail(parts[1]);
      return;
    }
    if (view === "member") {
      if (parts[1] === "new") { renderMemberForm(null); return; }
      if (parts[2] === "edit") { renderMemberForm(parts[1]); return; }
      return renderMembers();
    }
    if (view === "department") {
      if (parts[1] === "new") { renderDepartmentForm(null); return; }
      if (parts[2] === "edit") { renderDepartmentForm(parts[1]); return; }
      return renderDepartments();
    }
    if (view === "institution") {
      if (parts[1] === "new") { renderInstitutionForm(null); return; }
      if (parts[2] === "edit") { renderInstitutionForm(parts[1]); return; }
      return renderInstitutions();
    }
    if (view === "student") {
      if (lastStudent !== parts[1]) { studentTab = "profile"; lastStudent = parts[1]; }
      renderStudentDetail(parts[1]);
      return;
    }
    if (view === "institutions") renderInstitutions();
    else if (view === "members") renderMembers();
    else if (view === "departments") renderDepartments();
    else if (view === "projects") renderProjects();
    else if (view === "students") renderStudents();
    else if (view === "checkins") renderCheckins();
    else if (view === "indicators") renderIndicators();
    else if (view === "accounts") renderAccounts();
    else if (view === "roles") renderRoles();
    else if (view === "health-records" && window.AdminHealth) window.AdminHealth.records();
    else if (window.AdminFiveGood && window.AdminFiveGood[view]) window.AdminFiveGood[view]();
    else renderDashboard();
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  /* ---------------------------------------------------------
     Events
     --------------------------------------------------------- */

  document.addEventListener("click", event => {
    const save = event.target.closest("[data-save-form]");
    if (save) {
      event.preventDefault();
      showToast("已保存");
      const target = save.dataset.back || "#projects";
      setTimeout(() => { location.hash = target; }, 450);
      return;
    }

    if (event.target.closest("[data-close-drawer]")) closeDrawer();

    const toast = event.target.closest("[data-toast]");
    if (toast) { event.preventDefault(); showToast(toast.dataset.toast); return; }

    const project = event.target.closest("[data-project]");
    if (project) { location.hash = "project/" + project.dataset.project; return; }

    const student = event.target.closest("[data-student]");
    if (student) { location.hash = "student/" + student.dataset.student; return; }

    const go = event.target.closest("[data-go]");
    if (go) { location.hash = go.dataset.go; return; }

    const editInst = event.target.closest("[data-edit-inst]");
    if (editInst) { event.stopPropagation(); location.hash = "institution/" + editInst.dataset.editInst + "/edit"; return; }

    const inst = event.target.closest("[data-inst]");
    if (inst) { institutionDrawer(inst.dataset.inst); return; }

    const member = event.target.closest("[data-member]");
    if (member) { memberDrawer(member.dataset.member); return; }

    const dept = event.target.closest("[data-dept]");
    if (dept) { departmentDrawer(dept.dataset.dept); return; }

    const checkin = event.target.closest("[data-checkin]");
    if (checkin) { checkinDrawer(checkin.dataset.checkin); return; }

    const back = event.target.closest("[data-back]");
    if (back) { location.hash = back.dataset.back; return; }

    const ptab = event.target.closest("[data-project-tab]");
    if (ptab) { projectTab = ptab.dataset.projectTab; renderProjectDetail(lastProject); return; }

    const stab = event.target.closest("[data-student-tab]");
    if (stab) { studentTab = stab.dataset.studentTab; renderStudentDetail(lastStudent); return; }

    if (event.target.closest("#drawerClose") || event.target.closest("#drawerBackdrop")) closeDrawer();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeDrawer();
  });

  window.addEventListener("hashchange", renderRoute);
  renderRoute();
})();
