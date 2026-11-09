/* =========================================================
   五好生活 / 项目工作区 / 公共模块
   ========================================================= */

(function () {
  "use strict";

  const D = window.ADMIN_DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const escape = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = name => `<svg class="ic"><use href="#i-${name}"/></svg>`;
  const statusTag = status => {
    const map = { "进行中": "green", "启用": "green", "上架": "green", "已发布": "green", "已完成": "green", "已结束": "slate", "草稿": "gold", "待发布": "gold", "停用": "slate", "下架": "slate", "待发货": "gold", "待预约": "gold", "已取消": "slate" };
    return `<span class="tag ${map[status] || "slate"}">${escape(status)}</span>`;
  };
  const kpi = (iconName, label, value, unit, sub, color) => `<article class="kpi-card" style="--kpi:${color};--kpi-soft:${color}18">
    <span class="kpi-icon">${icon(iconName)}</span><div class="kpi-label">${label}</div>
    <div class="kpi-num">${value}<small>${unit || ""}</small></div><div class="kpi-sub">${sub || ""}</div></article>`;
  const pageHead = (title, eyebrow, desc, actions) => `<div class="page-head"><div><p class="page-eyebrow">${eyebrow}</p><h2>${title}</h2></div><div class="page-actions">${actions || ""}</div></div>`;
  const setTop = (title, breadcrumb, nav) => {
    $("#topTitle").textContent = title;
    $("#breadcrumb").textContent = breadcrumb;
    $$(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.nav === nav));
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const showToast = text => {
    const t = $("#toast");
    if (!t) return;
    t.textContent = text; t.classList.add("show");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => t.classList.remove("show"), 1900);
  };
  const openDrawer = html => {
    $("#drawerBody").innerHTML = html;
    $("#drawer").classList.add("open");
    $("#drawer").setAttribute("aria-hidden", "false");
    $("#drawerBackdrop").classList.add("open");
  };

  let wsProject = "FG001";
  let recipeMeal = "全部";
  let foodCat = "全部";
  let lifeTab = "全部";
  let lifeDay = "today";
  let taskTab = "打卡任务";

  const projectName = () => wsProject === "FG001" ? "五好生活" : "减重营";
  const workspaceBar = () => {
    const options = [{ id: "FG001", name: D.fiveGood.name }, { id: "P001", name: D.projects.find(p => p.id === "P001").name }];
    return `<div class="workspace-bar"><div class="workspace-title"><small>项目工作区</small><b>${escape(options.find(o => o.id === wsProject).name)}</b></div>
      <select class="workspace-select" id="wsProject">${options.map(o => `<option value="${o.id}"${o.id === wsProject ? " selected" : ""}>${escape(o.name)}</option>`).join("")}</select></div>`;
  };
  const bindWorkspace = rerender => {
    const sel = $("#wsProject");
    if (sel) sel.addEventListener("change", () => { wsProject = sel.value; rerender(); });
  };

  function renderFiveGood() {
    const fg = D.fiveGood;
    const today = D.lifeCheckins.filter(c => c.date === "2026-10-21").slice(0, 4);
    const html = `
      ${pageHead("五好生活工作台", "FIVE GOOD WELLNESS", "", `<a class="btn primary" href="#recipes">${icon("check")}配置本周食谱</a>`)}
      <section class="fg-hero"><div class="fg-hero-main"><span class="fg-mark">五好生活</span><h3>${escape(fg.name)}</h3><div class="fg-meta"><span>全员健康福利</span><span>${escape(fg.start)} — ${escape(fg.end)}</span>${statusTag(fg.status)}</div></div>
        <div class="fg-hero-stats"><div><small>参与员工</small><b>${fg.employees}</b></div><div><small>服务人次</small><b>${fg.monthlyServices}</b></div><div><small>饮食打卡</small><b>${fg.dietRate}%</b></div></div></section>
      <div class="service-grid">${fg.services.map(s => `<a class="service-card ${s.tone}" href="${s.key === "eat" ? "#recipes" : s.key === "move" ? "#exercise" : s.key === "sleep" ? "#health-records" : s.key === "relax" ? "#psych" : "#indicators"}"><span class="service-icon">${icon(s.icon)}</span><div><b>${escape(s.title)}</b><small>服务 ${s.count} 人</small></div><span class="service-status">${escape(s.status)}</span></a>`).join("")}</div>
      <div class="dash-grid"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">本周食谱</h3></div><a class="panel-link" href="#recipes">食谱配置 →</a></div><div class="table-wrap"><table class="data-table"><thead><tr><th>日期</th><th>早餐</th><th>中餐</th><th>晚餐</th><th>加餐</th><th>热量</th></tr></thead><tbody>${D.recipePlans.slice(0, 4).map(r => `<tr><td><span class="cell-main">${escape(r.weekday)}</span><span class="cell-sub">${escape(r.date)}</span></td><td>${escape(r.breakfast.name)}</td><td>${escape(r.lunch.name)}</td><td>${escape(r.dinner.name)}</td><td>${escape(r.snack.name)}</td><td>${r.calories} kcal</td></tr>`).join("")}</tbody></table></div></section>
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">参与员工</h3></div><a class="panel-link" href="#health-records">健康档案 →</a></div><div class="table-wrap"><table class="data-table"><thead><tr><th>员工</th><th>部门</th><th>饮食</th><th>睡眠</th><th>运动</th></tr></thead><tbody>${today.map(c => `<tr><td><span class="person-cell"><span class="avatar avatar-sm">${escape(c.name.slice(0, 1))}</span><span><b>${escape(c.name)}</b><small>${escape(c.dept)}</small></span></span></td><td>${escape(c.dept)}</td><td>${escape(c.diet)}</td><td>${escape(c.sleep)}</td><td>${escape(c.exercise)}</td></tr>`).join("")}</tbody></table></div></section></div>
      <div class="dash-bottom"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">心理评估</h3></div><a class="panel-link" href="#psych">查看评估 →</a></div><div class="panel-body"><div class="risk-summary"><div><small>已完成</small><b>186</b></div><div><small>中风险</small><b>24</b></div><div><small>高风险</small><b>8</b></div></div><div class="metric-bars" style="margin-top:13px">${[["低风险", 82, "82%"], ["中风险", 13, "13%"], ["高风险", 5, "5%"]].map(([l, v, d]) => `<div class="metric-bar"><span>${l}</span><div class="bar"><i style="width:${v}%"></i></div><b>${d}</b></div>`).join("")}</div></div></section>
        <section class="panel"><div class="panel-head"><div><h3 class="panel-title">服务配置</h3></div></div><div class="panel-body quick-links"><a href="#foods">${icon("grid")}<span>食品库</span><b>${D.foods.length}</b></a><a href="#meal-templates">${icon("dept")}<span>餐次配置</span><b>${D.mealTemplates.length}</b></a><a href="#exercise">${icon("chart")}<span>运动处方</span><b>${D.exercisePrescriptions.length}</b></a><a href="#psych">${icon("heart")}<span>心理评估</span><b>${D.psychAssessments.length}</b></a></div></section></div>`;
    $("#viewRoot").innerHTML = html;
    setTop("五好生活工作台", "概览 / 五好生活", "fivegood");
  }

  function renderRecipes() {
    const mealKey = { "早餐": "breakfast", "中餐": "lunch", "晚餐": "dinner", "加餐": "snack" };
    const html = `
      ${pageHead("食谱配置", "PROJECT WORKSPACE / RECIPES", "", `<button class="btn" data-publish-type="食谱" data-publish-name="本周食谱">发布</button><button class="btn primary" data-toast="原型演示：新增食谱">${icon("plus")}新增食谱</button>`)}
      ${workspaceBar()}
      <div class="filter-bar"><span class="tag blue">2026-10-19 — 2026-10-25</span><span class="tag">本周 7 天</span><a class="btn small" href="#foods">食品库</a><a class="btn small" href="#meal-templates">餐次模板</a></div>
      <div class="recipe-layout"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">每周食谱</h3></div><span class="tag green">已发布</span></div><div class="tabs recipe-tabs">${["全部", "早餐", "中餐", "晚餐", "加餐"].map(m => `<button class="tab${recipeMeal === m ? " active" : ""}" data-recipe-meal="${m}">${m}</button>`).join("")}</div>
        ${recipeMeal === "全部" ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>日期</th><th>早餐</th><th>中餐</th><th>晚餐</th><th>加餐</th><th>热量</th><th>蛋白质</th></tr></thead><tbody>${D.recipePlans.map(r => `<tr><td><span class="cell-main">${escape(r.weekday)}</span><span class="cell-sub">${escape(r.date)}</span></td>${["breakfast", "lunch", "dinner", "snack"].map(k => `<td><span class="meal-name">${escape(r[k].name)}</span><span class="meal-kcal">${r[k].kcal} kcal · ${r[k].protein}g</span></td>`).join("")}<td><b class="cell-main">${r.calories}</b> kcal</td><td>${r.protein}g</td></tr>`).join("")}</tbody></table></div>` : `<div class="meal-day-grid">${D.recipePlans.map(r => { const m = r[mealKey[recipeMeal]]; return `<div class="meal-day-card"><div class="meal-day-head"><span>${escape(r.weekday)}</span><small>${escape(r.date)}</small></div><b>${escape(m.name)}</b><div class="meal-day-meta"><span>${m.kcal} kcal</span><span>${m.protein}g 蛋白质</span></div><button class="panel-link" data-toast="原型演示：编辑食谱">编辑 →</button></div>`; }).join("")}</div>`}
      </section><aside class="form-aside"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">营养目标</h3></div></div><div class="panel-body"><div class="metric-bars">${[["热量", 93, "1680 / 1800"], ["蛋白质", 86, "86 / 90g"], ["碳水", 88, "210 / 240g"], ["脂肪", 72, "48 / 67g"]].map(([l, v, d]) => `<div class="metric-bar"><span>${l}</span><div class="bar"><i style="width:${v}%"></i></div><b>${d}</b></div>`).join("")}</div></div></section><section class="panel"><div class="panel-head"><div><h3 class="panel-title">餐次分布</h3></div></div><div class="panel-body"><div class="info-list"><div class="info-item"><small>早餐</small><b>25%</b></div><div class="info-item"><small>中餐</small><b>35%</b></div><div class="info-item"><small>晚餐</small><b>31%</b></div><div class="info-item"><small>加餐</small><b>9%</b></div></div></div></section></aside></div>`;
    $("#viewRoot").innerHTML = html;
    setTop("食谱配置", "项目工作区 / 食谱配置", "recipes");
    bindWorkspace(renderRecipes);
    $$("[data-recipe-meal]").forEach(btn => btn.addEventListener("click", () => { recipeMeal = btn.dataset.recipeMeal; renderRecipes(); }));
  }

  function renderFoods() {
    const cats = ["全部", ...new Set(D.foods.map(f => f.category))];
    const list = D.foods.filter(f => foodCat === "全部" || f.category === foodCat);
    const html = `
      ${pageHead("食品库", "PROJECT WORKSPACE / FOOD LIBRARY", "", `<button class="btn primary" data-new-module="food">${icon("plus")}新增食品</button>`)}
      <div class="filter-bar"><label class="filter-search">${icon("search")}<input id="foodSearch" placeholder="搜索食品名称、分类或过敏原" /></label><span class="tag blue">${D.foods.length} 项食品</span><a class="btn small" href="#meal-templates">餐次模板 →</a></div>
      <div class="indicator-category">${cats.map(c => `<button class="${foodCat === c ? "active" : ""}" data-food-cat="${c}">${c}</button>`).join("")}</div>
      <section class="panel"><div class="panel-head"><div><h3 class="panel-title">食品营养库</h3></div><span class="tag green">启用 ${D.foods.filter(f => f.status === "启用").length}</span></div><div class="table-wrap"><table class="data-table" id="foodTable"><thead><tr><th>食品</th><th>分类</th><th>热量 / 100g</th><th>蛋白质</th><th>碳水</th><th>脂肪</th><th>膳食纤维</th><th>过敏原</th><th>状态</th><th></th></tr></thead><tbody>${list.map(f => `<tr><td><span class="cell-main">${escape(f.name)}</span><span class="cell-sub">${escape(f.id)}</span></td><td><span class="tag">${escape(f.category)}</span></td><td><b class="cell-main">${f.kcal}</b> kcal</td><td>${f.protein}g</td><td>${f.carb}g</td><td>${f.fat}g</td><td>${f.fiber}g</td><td>${f.allergens === "—" ? "—" : `<span class="tag gold">${escape(f.allergens)}</span>`}</td><td>${statusTag(f.status)}</td><td><button class="panel-link" data-edit-module="food" data-id="${f.id}">编辑 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    $("#viewRoot").innerHTML = html;
    setTop("食品库", "项目工作区 / 食品库", "foods");
    $$("[data-food-cat]").forEach(btn => btn.addEventListener("click", () => { foodCat = btn.dataset.foodCat; renderFoods(); }));
    const input = $("#foodSearch");
    input.addEventListener("input", () => { const q = input.value.trim(); $$("#foodTable tbody tr").forEach(tr => tr.style.display = !q || tr.innerText.includes(q) ? "" : "none"); });
  }

  function renderMealTemplates() {
    const list = D.mealTemplates.filter(t => t.projects.includes(projectName()));
    const html = `
      ${pageHead("餐次模板", "PROJECT WORKSPACE / MEAL TEMPLATES", "", `<button class="btn primary" data-new-module="template">${icon("plus")}新建模板</button>`)}
      ${workspaceBar()}
      <div class="filter-bar"><span class="tag blue">${projectName()} · ${list.length} 个模板</span><span class="tag">早餐 / 中餐 / 晚餐 / 加餐</span></div>
      <div class="template-grid">${list.map(t => `<article class="template-card"><div class="template-head"><span class="tag ${t.meal === "早餐" ? "gold" : t.meal === "中餐" ? "blue" : t.meal === "晚餐" ? "green" : "slate"}">${escape(t.meal)}</span>${statusTag(t.status)}</div><h3>${escape(t.name)}</h3><div class="template-meta"><div><small>热量</small><b>${t.kcal} kcal</b></div><div><small>蛋白质</small><b>${t.protein}g</b></div><div><small>使用</small><b>${t.uses} 次</b></div></div><div class="template-foot"><span>${t.projects.map(p => `<i>${escape(p)}</i>`).join("")}</span><span style="display:flex;gap:8px"><button class="panel-link" data-edit-module="template" data-id="${t.id}">编辑</button><button class="panel-link" data-toast="原型演示：应用模板">应用 →</button></span></div></article>`).join("")}</div>`;
    $("#viewRoot").innerHTML = html;
    setTop("餐次模板", "项目工作区 / 餐次模板", "meal-templates");
    bindWorkspace(renderMealTemplates);
  }

  function renderExercise() {
    const list = D.exercisePrescriptions.filter(x => x.projects.includes(projectName()));
    const html = `
      ${pageHead("运动处方", "PROJECT WORKSPACE / EXERCISE", "", `<button class="btn" data-publish-type="运动处方">发布</button><button class="btn primary" data-new-module="exercise">${icon("plus")}新建处方</button>`)}
      ${workspaceBar()}
      <div class="kpi-grid four">${kpi("chart", "处方总数", D.exercisePrescriptions.length, "个", "含启用与草稿", "#2f6bff")}${kpi("check", "当前适用", list.length, "个", projectName(), "#16a394")}${kpi("users", "本周执行", 218, "人", "运动打卡人数", "#8b5cf6")}${kpi("heart", "运动达标", projectName() === "五好生活" ? "74.2" : "68.6", "%", "本周达标率", "#f0a23a")}</div>
      <div class="rx-grid">${list.map(r => `<article class="rx-card"><div class="rx-head"><span class="rx-icon">${icon("chart")}</span><div><h3>${escape(r.name)}</h3><p>${escape(r.audience)}</p></div>${statusTag(r.status)}</div><div class="rx-meta"><div><small>运动类型</small><b>${escape(r.type)}</b></div><div><small>频次</small><b>${escape(r.frequency)}</b></div><div><small>时长</small><b>${escape(r.duration)}</b></div><div><small>强度</small><b>${escape(r.intensity)}</b></div></div><div class="template-foot"><span>${r.projects.map(p => `<i>${escape(p)}</i>`).join("")}</span><button class="panel-link" data-edit-module="exercise" data-id="${r.id}">编辑 →</button></div></article>`).join("")}</div>`;
    $("#viewRoot").innerHTML = html;
    setTop("运动处方", "项目工作区 / 运动处方", "exercise");
    bindWorkspace(renderExercise);
  }

  function renderPsych() {
    const list = D.psychAssessments.filter(p => p.projects.includes(projectName()));
    const html = `
      ${pageHead("心理评估", "PROJECT WORKSPACE / PSYCHOLOGY", "", `<button class="btn" data-publish-type="心理评估">发布</button><button class="btn primary" data-new-module="psych">${icon("plus")}新建评估</button>`)}
      ${workspaceBar()}
      <div class="kpi-grid four">${kpi("heart", "评估工具", list.length, "个", projectName(), "#8b5cf6")}${kpi("users", "已完成评估", list.reduce((n, p) => n + p.submissions, 0), "人", "累计提交", "#2f6bff")}${kpi("chart", "中高风险", list.reduce((n, p) => n + p.riskHigh, 0), "人", "需跟进", "#f0a23a")}${kpi("check", "高风险", 8, "人", "优先干预", "#e15b64")}</div>
      <div class="split-layout"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">评估工具</h3></div><span class="tag green">启用中</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>评估名称</th><th>量表</th><th>题量</th><th>已完成</th><th>高风险</th><th>状态</th><th></th></tr></thead><tbody>${list.map(p => `<tr><td><span class="cell-main">${escape(p.name)}</span><span class="cell-sub">${p.projects.map(escape).join(" · ")}</span></td><td>${escape(p.scale)}</td><td>${p.questions}</td><td>${p.submissions}</td><td><span class="tag red">${p.riskHigh}</span></td><td>${statusTag(p.status)}</td><td><button class="panel-link" data-edit-module="psych" data-id="${p.id}">编辑 →</button></td></tr>`).join("")}</tbody></table></div></section><section class="panel"><div class="panel-head"><div><h3 class="panel-title">风险分布</h3></div></div><div class="panel-body"><div class="risk-summary"><div><small>低风险</small><b>82%</b></div><div><small>中风险</small><b>13%</b></div><div><small>高风险</small><b>5%</b></div></div><div class="metric-bars" style="margin-top:16px">${[["情绪压力", 68, "68%"], ["睡眠困扰", 54, "54%"], ["职场倦怠", 32, "32%"]].map(([l, v, d]) => `<div class="metric-bar"><span>${l}</span><div class="bar"><i style="width:${v}%"></i></div><b>${d}</b></div>`).join("")}</div></div></section></div>`;
    $("#viewRoot").innerHTML = html;
    setTop("心理评估", "项目工作区 / 心理评估", "psych");
    bindWorkspace(renderPsych);
  }

  function renderLifeCheckins() {
    const rows = D.lifeCheckins.filter(c => c.date === (lifeDay === "today" ? "2026-10-21" : "2026-10-20"));
    const tabs = ["全部", "饮食", "睡眠", "运动"];
    const table = lifeTab === "全部" ? `<table class="data-table"><thead><tr><th>员工</th><th>饮食</th><th>睡眠</th><th>运动</th><th>完成</th></tr></thead><tbody>${rows.map(c => `<tr><td><span class="person-cell"><span class="avatar avatar-sm">${escape(c.name.slice(0, 1))}</span><span><b>${escape(c.name)}</b><small>${escape(c.dept)}</small></span></span></td><td>${escape(c.diet)} · ${c.dietScore}分</td><td>${escape(c.sleep)} · ${c.sleepScore}分</td><td>${escape(c.exercise)} · ${escape(c.exerciseType)}</td><td><span class="tag ${c.completion === "全部完成" ? "green" : "gold"}">${escape(c.completion)}</span></td></tr>`).join("")}</tbody></table>` : lifeTab === "饮食" ? `<table class="data-table"><thead><tr><th>员工</th><th>三餐</th><th>营养评分</th><th>状态</th></tr></thead><tbody>${rows.map(c => `<tr><td><b>${escape(c.name)}</b><small class="cell-sub">${escape(c.dept)}</small></td><td>${escape(c.diet)}</td><td>${c.dietScore} 分</td><td><span class="tag ${c.diet === "3/3" ? "green" : "gold"}">${c.diet === "3/3" ? "已完成" : "待完成"}</span></td></tr>`).join("")}</tbody></table>` : lifeTab === "睡眠" ? `<table class="data-table"><thead><tr><th>员工</th><th>睡眠时长</th><th>睡眠评分</th><th>状态</th></tr></thead><tbody>${rows.map(c => `<tr><td><b>${escape(c.name)}</b><small class="cell-sub">${escape(c.dept)}</small></td><td>${escape(c.sleep)}</td><td>${c.sleepScore} 分</td><td><span class="tag ${c.sleepScore >= 7 ? "green" : "gold"}">${c.sleepScore >= 7 ? "达标" : "待改善"}</span></td></tr>`).join("")}</tbody></table>` : `<table class="data-table"><thead><tr><th>员工</th><th>运动时长</th><th>运动类型</th><th>状态</th></tr></thead><tbody>${rows.map(c => `<tr><td><b>${escape(c.name)}</b><small class="cell-sub">${escape(c.dept)}</small></td><td>${escape(c.exercise)}</td><td>${escape(c.exerciseType)}</td><td><span class="tag ${c.exercise === "0 分钟" ? "slate" : "green"}">${c.exercise === "0 分钟" ? "未完成" : "已完成"}</span></td></tr>`).join("")}</tbody></table>`;
    const html = `
      ${pageHead("生活打卡", "FIVE GOOD / DAILY CHECK-IN", "", `<button class="btn primary" data-toast="原型演示：导出打卡">${icon("chart")}导出数据</button>`)}
      <div class="filter-bar"><div class="segmented"><button class="${lifeDay === "today" ? "active" : ""}" data-life-day="today">今天</button><button class="${lifeDay === "yesterday" ? "active" : ""}" data-life-day="yesterday">昨天</button></div><span class="tag blue">${lifeDay === "today" ? "2026-10-21" : "2026-10-20"}</span><span class="tag green">饮食、睡眠、运动</span></div>
      <div class="kpi-grid four">${kpi("check", "饮食完成", 3, "人", "三餐完整", "#16a394")}${kpi("heart", "睡眠达标", 3, "人", "≥7 小时", "#8b5cf6")}${kpi("chart", "运动完成", 3, "人", "≥30 分钟", "#2f6bff")}${kpi("users", "参与员工", rows.length, "人", "当前查看", "#f0a23a")}</div>
      <div class="tabs">${tabs.map(t => `<button class="tab${lifeTab === t ? " active" : ""}" data-life-tab="${t}">${t}</button>`).join("")}</div><section class="panel"><div class="table-wrap">${table}</div></section>`;
    $("#viewRoot").innerHTML = html;
    setTop("生活打卡", "项目工作区 / 生活打卡", "life-checkins");
    $$("[data-life-day]").forEach(btn => btn.addEventListener("click", () => { lifeDay = btn.dataset.lifeDay; renderLifeCheckins(); }));
    $$("[data-life-tab]").forEach(btn => btn.addEventListener("click", () => { lifeTab = btn.dataset.lifeTab; renderLifeCheckins(); }));
  }

  function renderTasks() {
    const tasks = D.campTasks.filter(t => t.projects.includes(projectName()));
    const rewards = D.streakRewards.filter(r => r.projects.includes(projectName()));
    const rankings = D.rankings.filter(r => r.project === projectName());
    const html = `
      ${pageHead("任务与奖励", "PROJECT WORKSPACE / TASKS", "", `<button class="btn primary" data-new-module="task">${icon("plus")}新增任务</button>`)}
      ${workspaceBar()}
      <div class="kpi-grid four">${kpi("check", "启用任务", tasks.filter(t => t.status === "启用").length, "个", projectName(), "#2f6bff")}${kpi("users", "今日打卡", 94, "人", "体重 / 饮食 / 运动", "#16a394")}${kpi("chart", "连续奖励", rewards.length, "档", "3 / 7 / 14 天", "#f0a23a")}${kpi("heart", "积分发放", 18620, "分", "本月累计", "#8b5cf6")}</div>
      <div class="tabs">${["打卡任务", "连续奖励", "积分排行"].map(t => `<button class="tab${taskTab === t ? " active" : ""}" data-task-tab="${t}">${t}</button>`).join("")}</div>
      ${taskTab === "打卡任务" ? `<section class="panel"><div class="panel-head"><div><h3 class="panel-title">每日打卡任务</h3></div><span class="tag green">${tasks.length} 项</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>任务</th><th>类型</th><th>打卡时间窗</th><th>积分</th><th>适用项目</th><th>状态</th><th></th></tr></thead><tbody>${tasks.map(t => `<tr><td><span class="cell-main">${escape(t.name)}</span></td><td><span class="tag blue">${escape(t.type)}</span></td><td>${escape(t.window)}</td><td><b class="cell-main">+${t.points}</b></td><td>${t.projects.map(x => `<span class="tag">${escape(x)}</span>`).join(" ")}</td><td>${statusTag(t.status)}</td><td><button class="panel-link" data-edit-module="task" data-id="${t.id}">编辑 →</button></td></tr>`).join("")}</tbody></table></div></section>` : taskTab === "连续奖励" ? `<div class="reward-grid">${rewards.map(r => `<article class="reward-card"><div class="reward-days"><b>${r.days}</b><small>天</small></div><div class="reward-body"><h3>${escape(r.name)}</h3><span>${escape(r.reward)}</span><div class="metric-bar" style="margin-top:12px"><span>已领取 ${r.claimed}</span><div class="bar"><i style="width:${Math.round(r.claimed / r.stock * 100)}%"></i></div><b>${r.stock}</b></div></div><button class="panel-link" data-edit-module="reward" data-id="${r.id}">编辑 →</button></article>`).join("")}</div>` : `<section class="panel"><div class="panel-head"><div><h3 class="panel-title">积分排行</h3></div><span class="tag blue">${projectName()}</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>排名</th><th>学员</th><th>项目</th><th>积分</th><th>连续打卡</th></tr></thead><tbody>${rankings.map(r => `<tr><td><b class="rank-no">${r.rank}</b></td><td><span class="person-cell"><span class="avatar avatar-sm">${escape(r.name.slice(0, 1))}</span><b>${escape(r.name)}</b></span></td><td>${escape(r.project)}</td><td><b class="cell-main">${r.points}</b></td><td>${r.streak} 天</td></tr>`).join("")}</tbody></table></div></section>`}`;
    $("#viewRoot").innerHTML = html;
    setTop("任务与奖励", "项目工作区 / 任务与奖励", "tasks");
    bindWorkspace(renderTasks);
    $$("[data-task-tab]").forEach(btn => btn.addEventListener("click", () => { taskTab = btn.dataset.taskTab; renderTasks(); }));
  }

  function renderMall() {
    const html = `
      ${pageHead("商城", "PUBLIC MODULE / MALL", "", `<button class="btn primary" data-toast="原型演示：新增商品">${icon("plus")}新增商品</button>`)}
      <div class="kpi-grid four">${kpi("project", "在售商品", 5, "个", "全部项目共用", "#2f6bff")}${kpi("check", "本月兑换", 469, "单", "五好 + 减重营", "#16a394")}${kpi("chart", "库存预警", 2, "个", "低于 50 件", "#f0a23a")}${kpi("users", "本月销售额", "¥ 12.8", "万", "含个人补差", "#8b5cf6")}</div>
      <div class="filter-bar"><label class="filter-search">${icon("search")}<input id="mallSearch" placeholder="搜索商品、分类或项目" /></label><span class="tag blue">公共模块 · 全项目</span></div>
      <div class="product-grid">${D.mallProducts.map(p => `<article class="product-card"><div class="product-thumb"><span>${escape(p.category)}</span>${statusTag(p.status)}</div><div class="product-body"><div class="tag-row">${p.projects.map(x => `<span class="tag">${escape(x)}</span>`).join("")}</div><h3>${escape(p.name)}</h3><div class="product-price"><b>¥${p.price.toLocaleString("zh-CN")}</b><small>库存 ${p.stock} · 已兑 ${p.sales}</small></div><button class="btn small" data-toast="原型演示：编辑商品">编辑商品</button></div></article>`).join("")}</div>`;
    $("#viewRoot").innerHTML = html;
    setTop("商城", "公共模块 / 商城", "mall");
    const input = $("#mallSearch");
    input.addEventListener("input", () => { const q = input.value.trim(); $$(".product-card").forEach(card => card.style.display = !q || card.innerText.includes(q) ? "" : "none"); });
  }

  function renderOrders() {
    const html = `
      ${pageHead("订单中心", "PUBLIC MODULE / ORDERS", "", `<button class="btn" data-toast="原型演示：导出订单">${icon("chart")}导出订单</button>`)}
      <div class="kpi-grid four">${kpi("check", "今日订单", 3, "单", "全部项目", "#2f6bff")}${kpi("project", "待处理", 2, "单", "待发货 / 待预约", "#f0a23a")}${kpi("users", "已完成", 4, "单", "本月累计", "#16a394")}${kpi("chart", "本月订单额", "¥ 5.2", "万", "含权益兑换", "#8b5cf6")}</div>
      <div class="filter-bar"><label class="filter-search">${icon("search")}<input id="orderSearch" placeholder="搜索订单号、员工、商品或项目" /></label><select class="filter-select" id="orderStatus"><option>全部状态</option><option>待发货</option><option>待预约</option><option>已完成</option><option>已取消</option></select><span class="tag blue">公共模块 · 全项目</span></div>
      <section class="panel"><div class="table-wrap"><table class="data-table" id="orderTable"><thead><tr><th>订单号</th><th>员工</th><th>商品 / 服务</th><th>所属项目</th><th>金额</th><th>状态</th><th>下单时间</th></tr></thead><tbody>${D.orders.map(o => `<tr><td><span class="cell-main">${escape(o.id)}</span></td><td>${escape(o.user)}</td><td>${escape(o.item)}</td><td><span class="tag">${escape(o.project)}</span></td><td><b class="cell-main">¥${o.amount.toLocaleString("zh-CN")}</b></td><td><span class="tag ${o.status === "已完成" ? "green" : o.status === "已取消" ? "slate" : "gold"}">${escape(o.status)}</span></td><td>${escape(o.date)}</td></tr>`).join("")}</tbody></table></div></section>`;
    $("#viewRoot").innerHTML = html;
    setTop("订单中心", "公共模块 / 订单中心", "orders");
    const q = $("#orderSearch"), s = $("#orderStatus");
    const filter = () => { $$("#orderTable tbody tr").forEach(tr => tr.style.display = (!q.value.trim() || tr.innerText.includes(q.value.trim())) && (s.value === "全部状态" || tr.innerText.includes(s.value)) ? "" : "none"); };
    q.addEventListener("input", filter); s.addEventListener("change", filter);
  }

  function renderArticles() {
    const html = `
      ${pageHead("内容发布", "PUBLIC MODULE / CONTENT", "", `<button class="btn" data-publish-type="文章">发布</button><button class="btn primary" data-new-module="article">${icon("plus")}新建文章</button>`)}
      <div class="kpi-grid four">${kpi("edit", "已发布", 3, "篇", "五好刊物 + 减重营", "#2f6bff")}${kpi("calendar", "待发布", 1, "篇", "待审核", "#f0a23a")}${kpi("chart", "累计阅读", 2996, "次", "全项目", "#8b5cf6")}${kpi("users", "覆盖项目", 2, "个", "五好生活 / 减重营", "#16a394")}</div>
      <div class="filter-bar"><label class="filter-search">${icon("search")}<input id="articleSearch" placeholder="搜索文章或栏目" /></label><span class="tag blue">公共模块 · 全项目</span></div>
      <section class="panel"><div class="table-wrap"><table class="data-table" id="articleTable"><thead><tr><th>文章标题</th><th>栏目</th><th>适用项目</th><th>状态</th><th>发布日期</th><th>阅读</th><th></th></tr></thead><tbody>${D.articles.map(a => `<tr><td><span class="cell-main">${escape(a.title)}</span></td><td>${escape(a.channel)}</td><td><div class="tag-row">${a.projects.map(p => `<span class="tag">${escape(p)}</span>`).join("")}</div></td><td><span class="tag ${a.status === "已发布" ? "green" : a.status === "待发布" ? "gold" : "slate"}">${escape(a.status)}</span></td><td>${escape(a.date)}</td><td>${a.views.toLocaleString("zh-CN")}</td><td><span class="panel-link" data-edit-module="article" data-id="${a.id}">编辑 →</span></td></tr>`).join("")}</tbody></table></div></section>`;
    $("#viewRoot").innerHTML = html;
    setTop("内容发布", "公共模块 / 内容发布", "articles");
    const input = $("#articleSearch");
    input.addEventListener("input", () => { const q = input.value.trim(); $$("#articleTable tbody tr").forEach(tr => tr.style.display = !q || tr.innerText.includes(q) ? "" : "none"); });
  }

  function renderSurveys() {
    const html = `
      ${pageHead("问卷", "PUBLIC MODULE / SURVEYS", "", `<button class="btn" data-publish-type="问卷">发布</button><button class="btn primary" data-new-module="survey">${icon("plus")}新建问卷</button>`)}
      <div class="kpi-grid four">${kpi("check", "进行中", 2, "份", "全部项目", "#2f6bff")}${kpi("users", "累计回收", 682, "份", "五好 + 减重营", "#16a394")}${kpi("chart", "平均完成率", 68.4, "%", "当前问卷", "#8b5cf6")}${kpi("edit", "草稿", 1, "份", "待配置", "#f0a23a")}</div>
      <section class="panel"><div class="panel-head"><div><h3 class="panel-title">问卷列表</h3></div><span class="tag blue">公共模块 · 全项目</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>问卷名称</th><th>适用项目</th><th>题目</th><th>回收 / 目标</th><th>状态</th><th></th></tr></thead><tbody>${D.surveys.map(s => `<tr><td><span class="cell-main">${escape(s.name)}</span></td><td><div class="tag-row">${s.projects.map(p => `<span class="tag">${escape(p)}</span>`).join("")}</div></td><td>${s.questions}</td><td><b class="cell-main">${s.responses}</b> / ${s.target}</td><td><span class="tag ${s.status === "进行中" ? "green" : s.status === "已结束" ? "slate" : "gold"}">${escape(s.status)}</span></td><td><span class="panel-link" data-edit-module="survey" data-id="${s.id}">查看 →</span></td></tr>`).join("")}</tbody></table></div></section>`;
    $("#viewRoot").innerHTML = html;
    setTop("问卷", "公共模块 / 问卷", "surveys");
  }

  function renderAssessments() {
    const html = `
      ${pageHead("测评", "PUBLIC MODULE / ASSESSMENTS", "", `<button class="btn" data-publish-type="测评">发布</button><button class="btn primary" data-toast="原型演示：新建测评">${icon("plus")}新建测评</button>`)}
      <div class="kpi-grid four">${kpi("chart", "测评工具", D.assessmentLibrary.length, "个", "五好 + 减重营", "#2f6bff")}${kpi("users", "累计完成", 896, "人次", "全部项目", "#16a394")}${kpi("heart", "高风险", 31, "人", "待跟进", "#e15b64")}${kpi("check", "启用中", 4, "个", "公共测评库", "#8b5cf6")}</div>
      <section class="panel"><div class="panel-head"><div><h3 class="panel-title">测评工具</h3></div><span class="tag blue">公共模块 · 全项目</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>测评名称</th><th>类型</th><th>适用项目</th><th>题量</th><th>已完成</th><th>状态</th><th></th></tr></thead><tbody>${D.assessmentLibrary.map(a => `<tr><td><span class="cell-main">${escape(a.name)}</span></td><td>${escape(a.type)}</td><td><div class="tag-row">${a.projects.map(p => `<span class="tag">${escape(p)}</span>`).join("")}</div></td><td>${a.questions}</td><td>${a.completed}</td><td>${statusTag(a.status)}</td><td><span class="panel-link" data-toast="原型演示：查看测评">查看 →</span></td></tr>`).join("")}</tbody></table></div></section>`;
    $("#viewRoot").innerHTML = html;
    setTop("测评", "公共模块 / 测评", "assessments");
  }

  function renderPublish() {
    const html = `
      ${pageHead("发布与投放", "PUBLIC MODULE / DELIVERY", "", `<button class="btn primary" data-publish-new="1">${icon("plus")}新建投放</button>`)}
      <div class="kpi-grid four">${kpi("check", "已发布", 5, "条", "全项目", "#16a394")}${kpi("edit", "草稿", 1, "条", "待发布", "#f0a23a")}${kpi("project", "覆盖项目", 2, "个", "五好生活 / 减重营", "#2f6bff")}${kpi("users", "覆盖人数", 471, "人", "按目标去重", "#8b5cf6")}</div>
      <section class="panel" style="margin-bottom:13px"><div class="panel-head"><div><h3 class="panel-title">投放路径</h3></div><span class="tag blue">公共能力</span></div><div class="panel-body"><div class="publish-flow"><div><small>内容</small><b>食谱 / 运动 / 文章 / 问卷</b></div><i>→</i><div><small>项目</small><b>五好生活 / 减重营</b></div><i>→</i><div><small>范围</small><b>全员 / 营期 / 学员</b></div><i>→</i><div><small>触达</small><b>H5 首页 / 任务</b></div></div></div></section>
      <section class="panel"><div class="panel-head"><div><h3 class="panel-title">投放记录</h3></div><span class="tag blue">全项目</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>内容</th><th>类型</th><th>项目</th><th>投放对象</th><th>覆盖</th><th>状态</th><th>发布时间</th><th></th></tr></thead><tbody>${D.publications.map(p => `<tr><td><span class="cell-main">${escape(p.content)}</span><span class="cell-sub">${escape(p.publisher)}</span></td><td><span class="tag">${escape(p.type)}</span></td><td>${escape(p.project)}</td><td>${escape(p.target)}</td><td>${p.audience} 人</td><td><span class="tag ${p.status === "已发布" ? "green" : "gold"}">${escape(p.status)}</span></td><td>${escape(p.date)}</td><td><button class="panel-link" data-publish-type="${escape(p.type)}" data-publish-name="${escape(p.content)}">再次投放 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    $("#viewRoot").innerHTML = html;
    setTop("发布与投放", "公共模块 / 发布与投放", "publish");
  }

  function openPublishDrawer(type, name) {
    const projectOptions = [{ id: "FG001", name: D.fiveGood.name }, ...D.projects.map(p => ({ id: p.id, name: p.name }))];
    openDrawer(`
      <p class="page-eyebrow">DELIVERY SETUP</p><h2>发布与投放</h2><p class="drawer-sub">内容 → 项目 / 营期 / 学员 → H5</p>
      <div class="drawer-section"><div class="publish-form">
        <label class="field"><span>内容类型</span><select>${["食谱", "运动处方", "心理评估", "文章", "问卷", "测评", "商品", "活动"].map(t => `<option${t === type ? " selected" : ""}>${t}</option>`).join("")}</select></label>
        <label class="field"><span>内容名称</span><input value="${escape(name || "")}" placeholder="选择或输入内容" /></label>
        <label class="field"><span>投放项目</span><select id="publishProject">${projectOptions.map(p => `<option value="${p.id}">${escape(p.name)}</option>`).join("")}</select></label>
        <label class="field"><span>投放范围</span><select id="publishScope"><option>项目全员</option><option>指定营期</option><option>指定学员</option><option>指定人群</option></select></label>
        <label class="field"><span>指定营期</span><select id="publishCamp"></select></label>
        <label class="field"><span>指定学员</span><select id="publishStudent"></select></label>
        <label class="field"><span>发布时间</span><input type="datetime-local" value="2026-10-21T09:00" /></label>
        <label class="field"><span>触达渠道</span><select><option>H5 首页</option><option>任务中心</option><option>消息中心</option><option>商城</option></select></label>
      </div></div>
      <div class="drawer-section"><div class="target-path"><span>投放路径</span><b>项目</b><i>→</i><b>指定范围</b><i>→</i><b>目标学员</b></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn" data-toast="已保存草稿">保存草稿</button><button class="btn primary" data-toast="已发布到目标项目">立即发布</button></div>`);
    const project = $("#publishProject");
    const camp = $("#publishCamp");
    const student = $("#publishStudent");
    const scope = $("#publishScope");
    const updateTarget = () => {
      if (!project || !camp || !student) return;
      if (project.value === "FG001") {
        camp.innerHTML = `<option>五好生活 · 全周期</option>`;
        const names = [...new Set(D.lifeCheckins.map(x => x.name))];
        student.innerHTML = names.map(n => `<option>${escape(n)}</option>`).join("");
      } else {
        const p = D.projects.find(x => x.id === project.value);
        const campList = D.camps.filter(x => x.projectId === project.value);
        camp.innerHTML = campList.map(c => `<option>${escape(c.name)}</option>`).join("") || `<option>${escape(p.name)}</option>`;
        const students = D.students.filter(s => s.projectId === project.value);
        student.innerHTML = students.map(s => `<option>${escape(s.name)} · ${escape(s.phone)}</option>`).join("") || `<option>暂无学员</option>`;
      }
      const isTargeted = scope.value === "指定营期" || scope.value === "指定学员";
      camp.disabled = !(scope.value === "指定营期");
      student.disabled = !(scope.value === "指定学员");
      camp.closest(".field").style.opacity = scope.value === "指定营期" ? "1" : ".5";
      student.closest(".field").style.opacity = scope.value === "指定学员" ? "1" : ".5";
    };
    if (project) project.addEventListener("change", updateTarget);
    if (scope) scope.addEventListener("change", updateTarget);
    updateTarget();
  }

  document.addEventListener("click", event => {
    const publish = event.target.closest("[data-publish-type]");
    if (publish) { event.preventDefault(); openPublishDrawer(publish.dataset.publishType, publish.dataset.publishName || ""); return; }
    if (event.target.closest("[data-publish-new]")) { event.preventDefault(); openPublishDrawer("食谱", ""); return; }
  });

  window.AdminFiveGood = {
    fivegood: renderFiveGood,
    recipes: renderRecipes,
    foods: renderFoods,
    "meal-templates": renderMealTemplates,
    exercise: renderExercise,
    psych: renderPsych,
    tasks: renderTasks,
    mall: renderMall,
    orders: renderOrders,
    articles: renderArticles,
    surveys: renderSurveys,
    assessments: renderAssessments,
    publish: renderPublish
  };
})();
