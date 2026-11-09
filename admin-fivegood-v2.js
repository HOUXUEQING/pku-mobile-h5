/* =========================================================
   五好生活细化：食谱库 / 商城目录 / 测评筛选 / 编辑抽屉
   ========================================================= */

(function () {
  "use strict";

  const D = window.ADMIN_DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const tag = s => {
    const m = { "上架": "green", "启用": "green", "已发布": "green", "进行中": "green", "已完成": "green", "草稿": "gold", "待发布": "gold", "下架": "slate", "停用": "slate", "已结束": "slate", "待发货": "gold", "待预约": "gold", "已取消": "slate" };
    return `<span class="tag ${m[s] || "slate"}">${esc(s)}</span>`;
  };
  const head = (title, eyebrow, actions) => `<div class="page-head"><div><p class="page-eyebrow">${eyebrow}</p><h2>${title}</h2></div><div class="page-actions">${actions || ""}</div></div>`;
  const kpi = (ic, label, value, unit, foot, color) => `<article class="kpi-card" style="--kpi:${color};--kpi-soft:${color}18"><span class="kpi-icon">${icon(ic)}</span><div class="kpi-label">${label}</div><div class="kpi-num">${value}<small>${unit || ""}</small></div><div class="kpi-sub">${foot || ""}</div></article>`;
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
  const notify = text => {
    const t = $("#toast"); if (!t) return;
    t.textContent = text; t.classList.add("show");
    clearTimeout(notify.t); notify.t = setTimeout(() => t.classList.remove("show"), 1900);
  };

  let wsProject = "FG001";
  let recipeMeal = "早餐";
  let mallKind = "全部";
  let mallCat = "全部";
  let mallSubCat = "全部";
  let assessmentType = "全部";

  const projectName = () => wsProject === "FG001" ? "五好生活" : "减重营";
  const workspaceBar = () => {
    const opts = [{ id: "FG001", name: "五好生活" }, { id: "P001", name: D.projects.find(p => p.id === "P001").name }];
    return `<div class="workspace-bar"><div class="workspace-title"><small>项目工作区</small><b>${esc(opts.find(o => o.id === wsProject).name)}</b></div><select class="workspace-select" id="wsProject">${opts.map(o => `<option value="${o.id}"${o.id === wsProject ? " selected" : ""}>${esc(o.name)}</option>`).join("")}</select></div>`;
  };
  const bindWs = rerender => {
    const s = $("#wsProject"); if (s) s.addEventListener("change", () => { wsProject = s.value; rerender(); });
  };

  function renderRecipes() {
    const meals = ["早餐", "中餐", "晚餐", "加餐"];
    const recipes = D.recipeLibrary.filter(r => r.meal === recipeMeal);
    const html = `
      ${head("食谱库", "PROJECT WORKSPACE / RECIPE LIBRARY", `<button class="btn" data-publish-type="食谱" data-publish-name="${esc(recipeMeal)}食谱">发布</button><button class="btn primary" data-new-module="recipe">${icon("plus")}新建食谱</button>`)}
      ${workspaceBar()}
      <div class="meal-count-grid">${meals.map(m => { const count = D.recipeLibrary.filter(r => r.meal === m).length; return `<button class="meal-count${recipeMeal === m ? " active" : ""}" data-recipe-meal="${m}"><span>${m}</span><b>${count}</b><small>个模板</small></button>`; }).join("")}</div>
      <div class="recipe-card-grid">${recipes.map(r => `<article class="recipe-card"><div class="recipe-card-top"><span class="tag ${r.meal === "早餐" ? "gold" : r.meal === "中餐" ? "blue" : r.meal === "晚餐" ? "green" : "slate"}">${esc(r.meal)}</span>${tag(r.status)}</div><h3>${esc(r.name)}</h3><p>${esc(r.ingredients)}</p><div class="recipe-card-meta"><span><b>${r.kcal}</b> kcal</span><span><b>${r.protein}g</b> 蛋白质</span></div><div class="recipe-card-foot"><div>${(r.tags || []).map(t => `<i>${esc(t)}</i>`).join("")}</div><button class="panel-link" data-edit-module="recipe" data-id="${r.id}">编辑 →</button></div></article>`).join("")}</div>
      <div class="recipe-layout" style="margin-top:13px"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">本周排餐</h3></div><span class="tag green">2026-10-19 — 2026-10-25</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>日期</th><th>早餐</th><th>中餐</th><th>晚餐</th><th>加餐</th><th>热量</th></tr></thead><tbody>${D.recipePlans.map(r => `<tr><td><span class="cell-main">${esc(r.weekday)}</span><span class="cell-sub">${esc(r.date)}</span></td>${["breakfast", "lunch", "dinner", "snack"].map(k => `<td><span class="meal-name">${esc(r[k].name)}</span><span class="meal-kcal">${r[k].kcal} kcal</span></td>`).join("")}<td>${r.calories} kcal</td></tr>`).join("")}</tbody></table></div></section><aside class="form-aside"><section class="panel"><div class="panel-head"><div><h3 class="panel-title">营养目标</h3></div></div><div class="panel-body"><div class="metric-bars">${[["热量", 93, "1680 / 1800"], ["蛋白质", 86, "86 / 90g"], ["碳水", 88, "210 / 240g"], ["脂肪", 72, "48 / 67g"]].map(([l, v, d]) => `<div class="metric-bar"><span>${l}</span><div class="bar"><i style="width:${v}%"></i></div><b>${d}</b></div>`).join("")}</div></div></section></aside></div>`;
    $("#viewRoot").innerHTML = html;
    setTop("食谱库", "项目工作区 / 食谱库", "recipes");
    bindWs(renderRecipes);
    $$("[data-recipe-meal]").forEach(b => b.addEventListener("click", () => { recipeMeal = b.dataset.recipeMeal; renderRecipes(); }));
  }

  function mallMoney(v) {
    return "¥" + Number(v || 0).toLocaleString("zh-CN", { maximumFractionDigits: 2 });
  }

  function mallPrice(p) {
    if (p.priceType === "积分+自费") return `<b class="mall-mixed-price">${Number(p.points || 0)} 积分 <em>+</em> ¥${Number(p.personalPay || 0).toFixed(2)}</b><small>个人自费部分</small>`;
    if (p.priceType === "企业权益") return `<b>企业权益</b><small>${esc(p.fulfillment)}</small>`;
    if (p.priceType === "积分兑换") return `<b>${p.price} 积分</b><small>${esc(p.fulfillment)}</small>`;
    return `<b>¥${Number(p.price).toLocaleString("zh-CN")}</b><small>${esc(p.fulfillment)}</small>`;
  }

  function renderMall() {
    const catalog = D.mallCatalog;
    D.supplements.forEach(s => {
      if (catalog.some(p => p.id === "M-" + s.id)) return;
      catalog.push({
        id: "M-" + s.id, kind: "实物", major: "实物商品", category: "营养补剂", subCategory: s.category,
        name: s.name, price: s.price, priceType: "个人补差", stock: s.stock, sales: s.sold,
        status: s.active ? "上架" : "下架", fulfillment: "快递发货",
        desc: "适用：" + s.suitable + "；禁忌：" + s.taboo,
        supplierName: "营养品供应链", upstreamSettle: Math.round(s.settle * 0.7), downstreamSettle: s.settle
      });
    });
    const setPay = (id, points, personalPay) => {
      const item = catalog.find(p => p.id === id);
      if (item && !item.priceType.includes("自费")) { item.priceType = "积分+自费"; item.points = points; item.personalPay = personalPay; }
    };
    setPay("M-G06", 200, 9.9);
    setPay("M-G01", 500, 29.9);
    setPay("M-S05", 800, 99);
    catalog.forEach(p => {
      p.supplierName = p.supplierName || (p.major === "服务" ? "北大医疗健康管理中心" : "健康商城供应链");
      const base = Number(p.price || p.personalPay || 50);
      if (!p.upstreamSettle) p.upstreamSettle = Math.max(8, Math.round(base * 0.6));
      if (!p.downstreamSettle) p.downstreamSettle = Math.max(12, Math.round(base * 0.82));
    });
    const majorItems = catalog.filter(p => mallKind === "全部" || p.major === mallKind);
    const categories = ["全部", ...new Set(majorItems.map(p => p.category))];
    const catItems = majorItems.filter(p => mallCat === "全部" || p.category === mallCat);
    const subCategories = ["全部", ...new Set(catItems.map(p => p.subCategory))];
    const list = catItems.filter(p => mallSubCat === "全部" || p.subCategory === mallSubCat);
    const html = `
      ${head("商城", "PUBLIC MODULE / MALL", `<button class="btn" data-new-supplement="1">${icon("plus")}新增营养补剂</button><button class="btn primary" data-new-module="mall">${icon("plus")}新增商品</button>`)}
      <div class="kpi-grid four">${kpi("project", "服务目录", catalog.filter(p => p.kind === "服务").length, "项", "可预约履约", "#2f6bff")}${kpi("check", "实物商品", catalog.filter(p => p.kind === "实物").length, "件", "积分 / 补差兑换", "#16a394")}${kpi("chart", "库存预警", catalog.filter(p => p.kind === "实物" && Number(p.stock) < 30).length, "件", "低于 30 件", "#f0a23a")}${kpi("users", "本月兑换", 469, "单", "服务 + 实物", "#8b5cf6")}</div>
      <div class="filter-bar"><label class="filter-search">${icon("search")}<input id="mallSearch" placeholder="搜索商品、服务、大类或小类" /></label><span class="tag blue">公共模块 · 全项目</span></div>
      <div class="mall-tabs">${["全部", "服务目录", "实物商品"].map(k => `<button class="${mallKind === k ? "active" : ""}" data-mall-kind="${k}">${k}</button>`).join("")}</div>
      <div class="mall-cats">${categories.map(c => `<button class="${mallCat === c ? "active" : ""}" data-mall-cat="${c}">${c}</button>`).join("")}</div>
      ${mallCat !== "全部" ? `<div class="mall-subcats"><span>小类</span>${subCategories.map(c => `<button class="${mallSubCat === c ? "active" : ""}" data-mall-subcat="${c}">${c}</button>`).join("")}</div>` : ""}
      <div class="product-grid catalog-grid">${list.map(p => `<article class="product-card catalog-card"><div class="product-thumb"><span>${esc(p.major)}</span>${tag(p.status)}</div><div class="product-body"><div class="tag-row"><span class="tag ${p.kind === "服务" ? "blue" : "green"}">${esc(p.kind)}</span><span class="tag">${esc(p.category)}</span><span class="tag">${esc(p.subCategory)}</span></div><h3>${esc(p.name)}</h3><p class="product-desc">${esc(p.desc)}</p><div class="product-supply"><span>供应商：${esc(p.supplierName)}</span><span>上游 ${mallMoney(p.upstreamSettle)} / 下游 ${mallMoney(p.downstreamSettle)}</span></div><div class="product-price">${mallPrice(p)}</div><div class="product-card-foot"><span>库存 ${esc(p.stock)} · 已兑 ${p.sales}</span><button class="panel-link" data-edit-module="mall" data-id="${p.id}">编辑 →</button></div></div></article>`).join("")}</div>`;
    $("#viewRoot").innerHTML = html;
    setTop("商城", "公共模块 / 商城", "mall");
    $$("[data-mall-kind]").forEach(b => b.addEventListener("click", () => { mallKind = b.dataset.mallKind; mallCat = "全部"; mallSubCat = "全部"; renderMall(); }));
    $$("[data-mall-cat]").forEach(b => b.addEventListener("click", () => { mallCat = b.dataset.mallCat; mallSubCat = "全部"; renderMall(); }));
    $$("[data-mall-subcat]").forEach(b => b.addEventListener("click", () => { mallSubCat = b.dataset.mallSubcat; renderMall(); }));
    $("#mallSearch").addEventListener("input", e => { const q = e.target.value.trim(); $$(".catalog-card").forEach(c => c.style.display = !q || c.innerText.includes(q) ? "" : "none"); });
  }

  function renderAssessments() {
    const types = ["全部", "健康测评", "心理测评", "睡眠测评", "行为测评", "营养测评"];
    const list = D.assessmentLibrary.filter(a => assessmentType === "全部" || a.type === assessmentType);
    const html = `
      ${head("测评", "PUBLIC MODULE / ASSESSMENTS", `<button class="btn primary" data-new-module="assessment">${icon("plus")}新建测评</button>`)}
      <div class="kpi-grid four">${kpi("chart", "测评工具", D.assessmentLibrary.length, "个", "五好 + 减重营", "#2f6bff")}${kpi("users", "累计完成", 896, "人次", "全部项目", "#16a394")}${kpi("heart", "高风险", 31, "人", "待跟进", "#e15b64")}${kpi("check", "启用中", D.assessmentLibrary.filter(a => a.status === "启用").length, "个", "公共测评库", "#8b5cf6")}</div>
      <div class="assessment-tabs">${types.map(t => `<button class="${assessmentType === t ? "active" : ""}" data-assessment-type="${t}">${t}</button>`).join("")}</div>
      <section class="panel"><div class="panel-head"><div><h3 class="panel-title">测评工具</h3></div><span class="tag blue">${assessmentType === "全部" ? "全部类型" : assessmentType}</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>测评名称</th><th>类型</th><th>适用项目</th><th>题量</th><th>已完成</th><th>状态</th><th></th></tr></thead><tbody>${list.map(a => `<tr><td><span class="cell-main">${esc(a.name)}</span></td><td><span class="tag blue">${esc(a.type)}</span></td><td><div class="tag-row">${a.projects.map(p => `<span class="tag">${esc(p)}</span>`).join("")}</div></td><td>${a.questions}</td><td>${a.completed}</td><td>${tag(a.status)}</td><td><button class="panel-link" data-edit-module="assessment" data-id="${a.id}">编辑 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    $("#viewRoot").innerHTML = html;
    setTop("测评", "公共模块 / 测评", "assessments");
    $$("[data-assessment-type]").forEach(b => b.addEventListener("click", () => { assessmentType = b.dataset.assessmentType; renderAssessments(); }));
  }

  const moduleConfig = {
    mall: { label: "商品", data: () => D.mallCatalog, fields: [
      ["kind", "商品类型", "select", ["服务", "实物"]], ["major", "大类", "select", ["服务目录", "实物商品"]],
      ["category", "中类", "text"], ["subCategory", "小类", "text"], ["name", "商品名称", "text"],
      ["priceType", "价格类型", "select", ["企业权益", "个人补差", "积分兑换", "积分+自费"]], ["price", "价格 / 企业价", "number"], ["points", "所需积分", "number"], ["personalPay", "个人自费金额（元）", "number"],
      ["supplierName", "供应商来源", "text"], ["upstreamSettle", "上游结算价", "number"], ["downstreamSettle", "下游结算价", "number"],
      ["stock", "库存", "text"], ["fulfillment", "履约方式", "text"], ["desc", "商品说明", "textarea", null, true]
    ] },
    recipe: { label: "食谱", data: () => D.recipeLibrary, fields: [
      ["meal", "餐次", "select", ["早餐", "中餐", "晚餐", "加餐"]], ["name", "食谱名称", "text"],
      ["kcal", "热量", "number"], ["protein", "蛋白质", "number"],
      ["tags", "标签", "text"], ["status", "状态", "select", ["启用", "草稿"]]
    ] },
    food: { label: "食品", data: () => D.foods, fields: [
      ["category", "分类", "text"], ["name", "食品名称", "text"], ["kcal", "热量", "number"],
      ["protein", "蛋白质", "number"], ["carb", "碳水", "number"], ["fat", "脂肪", "number"],
      ["fiber", "膳食纤维", "number"], ["allergens", "过敏原", "text"], ["status", "状态", "select", ["启用", "停用"]]
    ] },
    template: { label: "模板", data: () => D.mealTemplates, fields: [
      ["meal", "餐次", "select", ["早餐", "中餐", "晚餐", "加餐", "全天"]], ["name", "模板名称", "text"],
      ["kcal", "热量", "number"], ["protein", "蛋白质", "number"], ["status", "状态", "select", ["启用", "草稿"]]
    ] },
    exercise: { label: "运动处方", data: () => D.exercisePrescriptions, fields: [
      ["name", "处方名称", "text"], ["audience", "适用人群", "text"], ["type", "运动类型", "text"],
      ["frequency", "频次", "text"], ["duration", "时长", "text"], ["intensity", "强度", "text"], ["status", "状态", "select", ["启用", "草稿"]]
    ] },
    psych: { label: "心理评估", data: () => D.psychAssessments, fields: [
      ["name", "评估名称", "text"], ["scale", "量表", "text"], ["questions", "题量", "number"], ["status", "状态", "select", ["启用", "草稿"]]
    ] },
    assessment: { label: "测评", data: () => D.assessmentLibrary, fields: [
      ["name", "测评名称", "text"], ["type", "类型", "select", ["健康测评", "心理测评", "睡眠测评", "行为测评", "营养测评"]],
      ["questions", "题量", "number"], ["status", "状态", "select", ["启用", "草稿"]]
    ] },
    survey: { label: "问卷", data: () => D.surveys, fields: [
      ["name", "问卷名称", "text"], ["questions", "题量", "number"], ["target", "目标份数", "number"], ["status", "状态", "select", ["进行中", "已结束", "草稿"]]
    ] },
    article: { label: "文章", data: () => D.articles, fields: [
      ["title", "文章标题", "text"], ["channel", "栏目", "text"], ["status", "状态", "select", ["已发布", "待发布", "草稿"]]
    ] },
    task: { label: "打卡任务", data: () => D.campTasks, fields: [
      ["name", "任务名称", "text"], ["type", "类型", "select", ["体重", "饮食", "运动", "睡眠"]], ["window", "打卡时间窗", "text"], ["points", "积分", "number"], ["status", "状态", "select", ["启用", "草稿"]]
    ] },
    reward: { label: "连续奖励", data: () => D.streakRewards, fields: [
      ["name", "奖励名称", "text"], ["days", "连续天数", "number"], ["reward", "奖励内容", "text"], ["stock", "库存", "number"], ["status", "状态", "select", ["启用", "草稿"]]
    ] }
  };

  function openEditor(module, id, preset) {
    const cfg = moduleConfig[module]; if (!cfg) return;
    const isEdit = !!id;
    const item = isEdit ? cfg.data().find(x => x.id === id) : (preset || null);
    const isSupplement = !isEdit && preset && preset.category === "营养补剂";
    const title = isEdit ? "编辑商品" : isSupplement ? "新增营养补剂" : `新建${cfg.label}`;
    const projects = item && item.projects ? item.projects : [];
    const selectedIngredients = item && item.ingredients ? item.ingredients.split("、") : [];
    const recipeExtra = module === "recipe" ? `<div class="field full"><span>食材（搜索食品库并勾选）</span><input id="ingredientSearch" placeholder="搜索食品名称或分类" /><div class="ingredient-picker" id="ingredientPicker">${D.foods.map(f => `<label class="ingredient-item"><input type="checkbox" data-ingredient="${esc(f.name)}"${selectedIngredients.includes(f.name) ? " checked" : ""}/><span><b>${esc(f.name)}</b><small>${esc(f.category)} · ${f.kcal} kcal/100g</small></span></label>`).join("")}</div><div class="ingredient-count" id="ingredientCount">已选 ${selectedIngredients.length} 项食材</div></div>` : "";
    const exerciseExtra = module === "exercise" ? `<div class="field full"><span>图文 / 视频素材</span><div class="media-upload-grid"><label class="media-upload"><input type="file" accept="image/*" multiple /><b>上传图文</b><small>JPG / PNG，支持多图</small></label><label class="media-upload"><input type="file" accept="video/*" /><b>上传视频</b><small>MP4 / MOV，建议 60 秒内</small></label></div></div>` : "";
    const mallExtra = module === "mall" ? `<div class="field full"><span>个人部分付费配置</span><div class="payment-config-note">价格类型选择“积分+自费”时，可同时配置所需积分与个人自费金额，例如：<b>200 积分 + ¥9.90</b>。企业承担部分继续使用企业价 / 结算价。</div></div>` : "";
    const fields = cfg.fields.map(([key, label, type, options, full]) => {
      const value = item ? item[key] : "";
      let control;
      if (type === "select") control = `<select>${options.map(o => `<option${String(value) === o ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
      else if (type === "textarea") control = `<textarea rows="3">${esc(value)}</textarea>`;
      else control = `<input type="${type === "number" ? "number" : "text"}" value="${esc(value)}" />`;
      return `<label class="field${full ? " full" : ""}"><span>${label}</span>${control}</label>`;
    }).join("");
    openDrawer(`
      <p class="page-eyebrow">EDITOR</p><h2>${title}</h2><p class="drawer-sub">${cfg.label}配置</p>
      <div class="drawer-section"><div class="publish-form">${fields}${recipeExtra}${exerciseExtra}${mallExtra}<div class="field full"><span>适用项目</span><div class="check-grid">${["五好生活", "减重营"].map(p => `<label class="check-item"><input type="checkbox"${projects.includes(p) ? " checked" : ""}/><span>${p}</span></label>`).join("")}</div></div></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn" data-toast="${title}已保存">保存</button><button class="btn primary" data-toast="${title}已发布">保存并发布</button></div>`);
    const foodSearch = $("#ingredientSearch");
    if (foodSearch) {
      foodSearch.addEventListener("input", () => {
        const q = foodSearch.value.trim().toLowerCase();
        $$(".ingredient-item").forEach(el => el.style.display = !q || el.innerText.toLowerCase().includes(q) ? "" : "none");
      });
      $$("[data-ingredient]").forEach(el => el.addEventListener("change", () => {
        const count = $$("[data-ingredient]:checked").length;
        const countEl = $("#ingredientCount");
        if (countEl) countEl.textContent = `已选 ${count} 项食材`;
      }));
    }
  }

  document.addEventListener("click", event => {
    const addSupp = event.target.closest("[data-new-supplement]");
    if (addSupp) { event.preventDefault(); openEditor("mall", "", { kind: "实物", major: "实物商品", category: "营养补剂", subCategory: "蛋白补充", priceType: "个人补差", fulfillment: "快递发货", status: "上架", supplierName: "营养品供应链" }); return; }
    const add = event.target.closest("[data-new-module]");
    if (add) { event.preventDefault(); openEditor(add.dataset.newModule, ""); return; }
    const edit = event.target.closest("[data-edit-module]");
    if (edit) { event.preventDefault(); openEditor(edit.dataset.editModule, edit.dataset.id); return; }
  });

  if (window.AdminFiveGood) {
    window.AdminFiveGood.recipes = renderRecipes;
    window.AdminFiveGood.mall = renderMall;
    window.AdminFiveGood.assessments = renderAssessments;
  }
})();
