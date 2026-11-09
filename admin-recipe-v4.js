/* =========================================================
   食谱库 · 标准模版库 / 我的食谱模版
   ========================================================= */

(function () {
  "use strict";

  const D = window.ADMIN_DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const tag = (s, tone) => `<span class="tag ${tone || ""}">${esc(s)}</span>`;
  const pageHead = (title, action) => `<div class="page-head"><div><p class="page-eyebrow">RECIPE LIBRARY</p><h2>${title}</h2></div><div class="page-actions">${action || ""}</div></div>`;
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
  const emoji = category => ({ "谷物": "🌾", "主食": "🍚", "肉禽": "🍗", "水产": "🐟", "豆制品": "🫘", "蔬菜": "🥦", "水果": "🍎", "乳制品": "🥛", "蛋类": "🥚", "坚果": "🌰", "蔬果": "🥗" }[category] || "🥣");

  let mode = "标准模版库";
  let meal = "早餐";

  function templates() {
    return D.recipeTemplates.filter(t => t.owner === (mode === "标准模版库" ? "标准" : "我的"));
  }
  const meals = ["早餐", "中餐", "晚餐", "加餐"];

  function renderRecipes() {
    const list = templates();
    const mealList = list.filter(t => t.meal === meal);
    const html = `
      ${pageHead("食谱库", `<button class="btn primary" data-new-template="1">${icon("plus")}新建模版</button>`)}
      <div class="recipe-mode-tabs">${["标准模版库", "我的食谱模版"].map(m => `<button class="${mode === m ? "active" : ""}" data-recipe-mode="${m}">${m}<b>${D.recipeTemplates.filter(t => t.owner === (m === "标准模版库" ? "标准" : "我的")).length}</b></button>`).join("")}</div>
      <div class="template-count-grid">${meals.map(m => `<button class="template-count ${meal === m ? "active" : ""}" data-template-meal="${m}"><span>${m}</span><b>${list.filter(t => t.meal === m).length}</b><small>个模版</small></button>`).join("")}</div>
      <div class="recipe-template-grid">${mealList.map(t => `<article class="recipe-template-card" data-view-template="${t.id}">
        <div class="recipe-template-top"><div>${tag(t.meal, t.meal === "早餐" ? "gold" : t.meal === "中餐" ? "blue" : t.meal === "晚餐" ? "green" : "slate")}${tag(t.owner === "我的" ? "我的模版" : "标准模版", t.owner === "我的" ? "green" : "blue")}</div>${tag(t.status, t.status === "启用" ? "green" : "gold")}</div>
        <h3>${esc(t.name)}</h3><p>${t.dishes.length} 道菜品 · ${esc(t.tags.join(" · "))}</p>
        <div class="template-dishes">${t.dishes.map(d => `<span>${emoji((D.foods.find(f => f.name === d) || {}).category)} ${esc(d)}</span>`).join("")}</div>
        <div class="recipe-template-meta"><div><small>热量</small><b>${t.kcal} kcal</b></div><div><small>蛋白质</small><b>${t.protein}g</b></div><div><small>碳水</small><b>${t.carbs}g</b></div><div><small>脂肪</small><b>${t.fat}g</b></div></div>
        <div class="recipe-template-foot"><span>点击查看详情</span><button class="panel-link" data-edit-template="${t.id}">编辑模版 →</button></div>
      </article>`).join("")}</div>
      ${mealList.length ? "" : `<div class="panel"><div class="empty">暂无${esc(meal)}${mode === "我的食谱模版" ? "的自定义模版" : "标准模版"}</div></div>`}
    `;
    $("#viewRoot").innerHTML = html;
    setTop("食谱库", "项目工作区 / 食谱库", "recipes");
    $$("[data-recipe-mode]").forEach(b => b.addEventListener("click", () => { mode = b.dataset.recipeMode; meal = "早餐"; renderRecipes(); }));
    $$("[data-template-meal]").forEach(b => b.addEventListener("click", () => { meal = b.dataset.templateMeal; renderRecipes(); }));
    $$("[data-view-template]").forEach(card => card.addEventListener("click", event => {
      if (event.target.closest("[data-edit-template]")) return;
      openTemplateDetail(card.dataset.viewTemplate);
    }));
    $$("[data-edit-template]").forEach(b => b.addEventListener("click", event => { event.stopPropagation(); openTemplateEditor(b.dataset.editTemplate); }));
    $$("[data-new-template]").forEach(b => b.addEventListener("click", () => openTemplateEditor("")));
  }

  function openTemplateDetail(id) {
    const t = D.recipeTemplates.find(x => x.id === id); if (!t) return;
    openDrawer(`
      <p class="page-eyebrow">RECIPE TEMPLATE</p><h2>${esc(t.name)}</h2><p class="drawer-sub">${esc(t.meal)} · ${esc(t.owner === "我的" ? "我的食谱模版" : "标准模版库")}</p>
      <div class="template-detail-hero"><div><span>${esc(t.meal)}</span><b>${t.kcal} kcal</b><small>${esc(t.tags.join(" · "))}</small></div><div class="template-detail-macros"><div><b>${t.protein}g</b><small>蛋白质</small></div><div><b>${t.carbs}g</b><small>碳水</small></div><div><b>${t.fat}g</b><small>脂肪</small></div></div></div>
      <div class="drawer-section"><h3>食材清单</h3><div class="template-ingredient-list">${t.dishes.map(d => { const f = D.foods.find(x => x.name === d); return `<div class="template-ingredient"><span class="food-thumb">${emoji(f ? f.category : "食材")}</span><span><b>${esc(d)}</b><small>${f ? `${esc(f.category)} · ${f.kcal} kcal · 蛋白 ${f.protein}g` : "来自食品库"}</small></span></div>`; }).join("")}</div></div>
      <div class="drawer-section"><div class="info-list"><div class="info-item"><small>模版类型</small><b>${esc(t.owner)}</b></div><div class="info-item"><small>状态</small><b>${esc(t.status)}</b></div></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>关闭</button><button class="btn primary" data-edit-template="${t.id}">编辑模版</button></div>`);
    const edit = $("[data-edit-template]");
    if (edit) edit.addEventListener("click", () => openTemplateEditor(t.id));
  }

  function openTemplateEditor(id) {
    const t = id ? D.recipeTemplates.find(x => x.id === id) : null;
    const selected = t ? t.dishes : [];
    const title = t ? "编辑食谱模版" : "新建食谱模版";
    openDrawer(`
      <p class="page-eyebrow">RECIPE TEMPLATE EDITOR</p><h2>${title}</h2><p class="drawer-sub">标准模版 / 我的食谱模版</p>
      <div class="drawer-section"><div class="publish-form">
        <label class="field"><span>模版名称</span><input id="templateName" value="${esc(t ? t.name : "")}" placeholder="例如：减脂午餐" /></label>
        <label class="field"><span>餐次</span><select id="templateMeal">${meals.map(m => `<option${t && t.meal === m ? " selected" : ""}>${m}</option>`).join("")}</select></label>
        <label class="field"><span>热量</span><input id="templateKcal" type="number" value="${t ? t.kcal : ""}" /></label>
        <label class="field"><span>蛋白质</span><input id="templateProtein" type="number" value="${t ? t.protein : ""}" /></label>
        <label class="field"><span>归属</span><select id="templateOwner"><option${t && t.owner === "标准" ? " selected" : ""}>标准</option><option${!t || t.owner === "我的" ? " selected" : ""}>我的</option></select></label>
        <label class="field"><span>状态</span><select><option${t && t.status === "启用" ? " selected" : ""}>启用</option><option${t && t.status === "草稿" ? " selected" : ""}>草稿</option></select></label>
        <div class="field full"><span>选择食材（来自食品库，可搜索）</span><input class="ingredient-search" id="templateIngredientSearch" placeholder="搜索食材名称或分类" /><div class="ingredient-picker">${D.foods.map(f => `<label class="ingredient-item"><input type="checkbox" data-template-dish="${esc(f.name)}"${selected.includes(f.name) ? " checked" : ""}/><span><b>${esc(f.name)}</b><small>${esc(f.category)} · ${f.kcal} kcal</small></span></label>`).join("")}</div></div>
      </div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn" data-toast="模版已保存">保存</button><button class="btn primary" data-toast="模版已发布">保存并发布</button></div>`);
    const search = $("#templateIngredientSearch");
    if (search) search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      $$(".ingredient-item").forEach(el => el.style.display = !q || el.innerText.toLowerCase().includes(q) ? "" : "none");
    });
    if ($("[data-template-dish]")) {
      $$("[data-template-dish]").forEach(el => el.addEventListener("change", () => {
        const n = $$("[data-template-dish]:checked").length;
        const name = $("#templateName");
        if (name && !name.value) name.placeholder = `已选 ${n} 项食材`;
      }));
    }
  }

  if (window.AdminFiveGood) window.AdminFiveGood.recipes = renderRecipes;
})();
