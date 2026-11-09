/* =========================================================
   食谱工程 · 食品库 / 餐次配置
   ========================================================= */

(function () {
  "use strict";

  const D = window.ADMIN_DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const tag = (s, tone) => `<span class="tag ${tone || ""}">${esc(s)}</span>`;
  const pageHead = (title, action) => `<div class="page-head"><div><p class="page-eyebrow">RECIPE ENGINE</p><h2>${title}</h2></div><div class="page-actions">${action || ""}</div></div>`;
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

  const emoji = category => ({
    "谷物": "🌾", "主食": "🍚", "肉禽": "🍗", "水产": "🐟", "豆制品": "🫘",
    "蔬菜": "🥦", "水果": "🍎", "乳制品": "🥛", "蛋类": "🥚", "坚果": "🌰",
    "蔬果": "🥗", "坚果": "🌰", "蛋白补充": "💪", "基础营养": "💊", "心血管": "❤️",
    "肠道": "🌿", "骨骼": "🦴", "女性营养": "🌸", "睡眠": "🌙", "眼部营养": "👁️",
    "免疫营养": "🛡️", "运动营养": "⚡"
  }[category] || "🥣");
  const foodThumb = (name, category, kind) => `<span class="food-thumb ${kind === "supp" ? "supp" : ""}">${emoji(category)}</span>`;

  let foodTab = "食材库";
  let configMeal = "早餐";
  const config = { "早餐": ["藜麦糙米饭", "全麦吐司", "希腊酸奶碗"], "午餐": [], "晚餐": [], "加餐": [] };

  function renderFoods() {
    const tabs = [
      { key: "全天食谱", count: D.recipePlans.length },
      { key: "餐次配置", count: D.recipeTemplates.length },
      { key: "菜品库", count: D.recipeLibrary.length },
      { key: "食材库", count: D.foods.length }
    ];
    const action = foodTab === "营养补剂" ? `<button class="btn primary" data-food-new="supp">${icon("plus")}新增补剂</button>` : `<button class="btn primary" data-food-new="food">${icon("plus")}新增食材</button>`;
    let body = "";

    if (foodTab === "营养补剂") {
      body = `<section class="panel"><div class="panel-head"><div><h3 class="panel-title">营养补剂</h3></div><span class="tag blue">${D.supplements.length} 项</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>补剂</th><th>适用</th><th>禁忌</th><th>售价 / 结算</th><th>库存</th><th>已售</th><th>挂载位</th><th>上架</th><th></th></tr></thead><tbody>${D.supplements.map(s => `<tr><td><span class="food-cell">${foodThumb(s.name, s.category, "supp")}<span><b>${esc(s.name)}</b><small>${esc(s.category)}</small></span></span></td><td>${esc(s.suitable)}</td><td><span class="${s.taboo === "无" ? "muted" : "danger-text"}">${esc(s.taboo)}</span></td><td><b class="cell-main">¥${s.price}</b><span class="cell-sub">结算 ¥${s.settle}</span></td><td class="${s.stock === 0 ? "danger-text" : ""}">${s.stock}</td><td>${s.sold}</td><td>${esc(s.mount)}</td><td><span class="toggle ${s.active ? "on" : ""}"></span></td><td><button class="panel-link" data-food-edit="supp" data-id="${s.id}">编辑 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    } else if (foodTab === "食材库") {
      body = `<section class="panel"><div class="panel-head"><div><h3 class="panel-title">食材库</h3></div><span class="tag green">${D.foods.filter(f => f.status === "启用").length} 项启用</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>食材</th><th>分类</th><th>热量 / 100g</th><th>蛋白质</th><th>碳水</th><th>脂肪</th><th>膳食纤维</th><th>过敏原</th><th>状态</th><th></th></tr></thead><tbody>${D.foods.map(f => `<tr><td><span class="food-cell">${foodThumb(f.name, f.category, "food")}<span><b>${esc(f.name)}</b><small>${esc(f.id)}</small></span></span></td><td>${tag(f.category)}</td><td><b class="cell-main">${f.kcal}</b> kcal</td><td>${f.protein}g</td><td>${f.carb}g</td><td>${f.fat}g</td><td>${f.fiber}g</td><td>${f.allergens === "—" ? "—" : tag(f.allergens, "gold")}</td><td>${tag(f.status, f.status === "启用" ? "green" : "slate")}</td><td><button class="panel-link" data-food-edit="food" data-id="${f.id}">编辑 →</button></td></tr>`).join("")}</tbody></table></div></section>`;
    } else if (foodTab === "菜品库") {
      body = `<div class="dish-grid">${D.recipeLibrary.map(r => `<article class="dish-card"><div class="dish-top">${tag(r.meal, r.meal === "早餐" ? "gold" : r.meal === "中餐" ? "blue" : r.meal === "晚餐" ? "green" : "slate")}${tag(r.status, r.status === "启用" ? "green" : "gold")}</div><h3>${esc(r.name)}</h3><p>${esc(r.ingredients)}</p><div class="dish-meta"><span><b>${r.kcal}</b> kcal</span><span><b>${r.protein}g</b> 蛋白质</span></div><button class="panel-link" data-food-edit="recipe" data-id="${r.id}">编辑 →</button></article>`).join("")}</div>`;
    } else if (foodTab === "餐次配置") {
      body = `<div class="template-summary">${["早餐", "中餐", "晚餐", "加餐"].map(m => `<a href="#meal-templates" class="template-summary-card"><span>${m}</span><b>${D.recipeTemplates.filter(t => t.meal === m).length}</b><small>查看餐次配置 →</small></a>`).join("")}</div><section class="panel" style="margin-top:12px"><div class="panel-head"><div><h3 class="panel-title">餐次配置</h3></div><span class="tag blue">${D.recipeTemplates.length} 个</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>名称</th><th>餐次</th><th>菜品</th><th>热量</th><th>蛋白质</th><th>来源</th><th></th></tr></thead><tbody>${D.recipeTemplates.map(t => `<tr><td><b class="cell-main">${esc(t.name)}</b></td><td>${esc(t.meal)}</td><td>${t.dishes.map(d => `<span class="tag">${esc(d)}</span>`).join(" ")}</td><td>${t.kcal} kcal</td><td>${t.protein}g</td><td>${esc(t.owner)}</td><td><a class="panel-link" href="#meal-templates">配置 →</a></td></tr>`).join("")}</tbody></table></div></section>`;
    } else {
      body = `<section class="panel"><div class="panel-head"><div><h3 class="panel-title">全天食谱</h3></div><span class="tag green">本周</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>日期</th><th>早餐</th><th>中餐</th><th>晚餐</th><th>加餐</th><th>热量</th><th>蛋白质</th></tr></thead><tbody>${D.recipePlans.map(r => `<tr><td><span class="cell-main">${r.weekday}</span><span class="cell-sub">${r.date}</span></td><td>${esc(r.breakfast.name)}</td><td>${esc(r.lunch.name)}</td><td>${esc(r.dinner.name)}</td><td>${esc(r.snack.name)}</td><td>${r.calories} kcal</td><td>${r.protein}g</td></tr>`).join("")}</tbody></table></div></section>`;
    }

    $("#viewRoot").innerHTML = `${pageHead("食品库", action)}<div class="food-tabs">${tabs.map(t => `<button class="${foodTab === t.key ? "active" : ""}" data-food-tab="${t.key}"><span>${t.key}</span><b>${t.count}</b></button>`).join("")}</div>${body}`;
    setTop("食品库", "项目工作区 / 食品库", "foods");
    $$("[data-food-tab]").forEach(b => b.addEventListener("click", () => { foodTab = b.dataset.foodTab; renderFoods(); }));
    $$("[data-food-edit]").forEach(b => b.addEventListener("click", () => openFoodEditor(b.dataset.foodEdit, b.dataset.id)));
    $$("[data-food-new]").forEach(b => b.addEventListener("click", () => openFoodEditor(b.dataset.foodNew, "")));
  }

  function openFoodEditor(kind, id) {
    const food = kind === "food" ? D.foods.find(f => f.id === id) : kind === "supp" ? D.supplements.find(s => s.id === id) : kind === "recipe" ? D.recipeLibrary.find(r => r.id === id) : null;
    const title = `${food ? "编辑" : "新增"}${kind === "supp" ? "补剂" : kind === "recipe" ? "菜品" : "食材"}`;
    let fields = "";
    if (kind === "supp") {
      fields = `<label class="field"><span>补剂名称</span><input value="${esc(food?.name)}" /></label><label class="field"><span>分类</span><input value="${esc(food?.category)}" /></label><label class="field"><span>适用人群</span><input value="${esc(food?.suitable)}" /></label><label class="field"><span>禁忌</span><input value="${esc(food?.taboo)}" /></label><label class="field"><span>售价</span><input type="number" value="${food?.price || ""}" /></label><label class="field"><span>结算价</span><input type="number" value="${food?.settle || ""}" /></label><label class="field"><span>库存</span><input type="number" value="${food?.stock ?? ""}" /></label><label class="field"><span>已售</span><input type="number" value="${food?.sold || ""}" /></label><label class="field"><span>挂载位</span><input value="${esc(food?.mount)}" /></label><label class="field"><span>状态</span><select><option${food?.active ? " selected" : ""}>上架</option><option${food && !food.active ? " selected" : ""}>下架</option></select></label>`;
    } else if (kind === "recipe") {
      fields = `<label class="field"><span>菜品名称</span><input value="${esc(food?.name)}" /></label><label class="field"><span>餐次</span><select>${["早餐", "中餐", "晚餐", "加餐"].map(m => `<option${food?.meal === m ? " selected" : ""}>${m}</option>`).join("")}</select></label><label class="field"><span>热量</span><input type="number" value="${food?.kcal || ""}" /></label><label class="field"><span>蛋白质</span><input type="number" value="${food?.protein || ""}" /></label><label class="field full"><span>食材</span><input value="${esc(food?.ingredients)}" /></label>`;
    } else {
      fields = `<label class="field"><span>食材名称</span><input value="${esc(food?.name)}" /></label><label class="field"><span>分类</span><input value="${esc(food?.category)}" /></label><label class="field"><span>热量 / 100g</span><input type="number" value="${food?.kcal || ""}" /></label><label class="field"><span>蛋白质</span><input type="number" value="${food?.protein || ""}" /></label><label class="field"><span>碳水</span><input type="number" value="${food?.carb || ""}" /></label><label class="field"><span>脂肪</span><input type="number" value="${food?.fat || ""}" /></label><label class="field"><span>膳食纤维</span><input type="number" value="${food?.fiber || ""}" /></label><label class="field"><span>过敏原</span><input value="${esc(food?.allergens)}" /></label>`;
    }
    openDrawer(`<p class="page-eyebrow">FOOD EDITOR</p><h2>${title}</h2><p class="drawer-sub">${kind === "supp" ? "营养补剂" : kind === "recipe" ? "菜品库" : "食材库"}</p>
      <div class="drawer-section"><div class="publish-form">${fields}<label class="field full"><span>图片</span><div class="media-upload-grid"><label class="media-upload"><input type="file" accept="image/*" /><b>上传图片</b><small>JPG / PNG</small></label><div class="food-preview">${foodThumb(food?.name || "新食材", food?.category || "食材", kind === "supp" ? "supp" : "food")}</div></div></label></div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-toast="${title}已保存">保存</button></div>`);
  }

  function selectedFoods() {
    return config[configMeal].map(name => D.foods.find(f => f.name === name)).filter(Boolean);
  }

  function nutrition() {
    const all = Object.values(config).flat().map(name => D.foods.find(f => f.name === name)).filter(Boolean);
    return {
      kcal: all.reduce((n, f) => n + f.kcal, 0),
      protein: all.reduce((n, f) => n + f.protein, 0),
      carb: all.reduce((n, f) => n + f.carb, 0),
      fat: all.reduce((n, f) => n + f.fat, 0)
    };
  }

  function renderMealConfig() {
    const total = nutrition();
    const selected = selectedFoods();
    const allDishes = D.foods;
    const html = `
      <div class="back-link-row"><a class="back-link" href="#recipes">${icon("back")}返回食谱库</a><span class="tag blue">餐次配置</span></div>
      <div class="config-title"><div><p class="page-eyebrow">MEAL BUILDER</p><h1>我的搭配</h1><p>总热量 ${total.kcal} kcal · 蛋白 ${total.protein}g · 碳水 ${total.carb}g · 脂肪 ${total.fat}g</p></div><div class="page-actions"><button class="btn" data-save-config="1">${icon("check")}保存为我的食谱</button></div></div>
      <div class="config-layout">
        <section class="config-left">
          ${["早餐", "午餐", "晚餐", "加餐"].map(m => { const items = config[m].map(n => D.foods.find(f => f.name === n)).filter(Boolean); const kcal = items.reduce((n, f) => n + f.kcal, 0); return `<div class="config-meal ${configMeal === m ? "active" : ""}" data-config-meal="${m}"><div class="config-meal-head"><b>${m}</b><span>${kcal} kcal</span><em>${items.length ? items.length + " 项" : "未选择"}</em></div>${items.length ? `<div class="config-chips">${items.map(f => `<span>${esc(f.name)}</span>`).join("")}</div>` : `<p>点此选择餐次，再点右侧菜品</p>`}</div>`; }).join("")}
          <div class="nutrition-box"><div><b>营养结构</b><span>目标 1800 kcal</span></div><div class="config-progress"><i style="width:${Math.min(100, Math.round(total.kcal / 1800 * 100))}%"></i></div><div class="nutrition-foot"><span>${total.kcal} kcal</span><b>${Math.round(total.kcal / 1800 * 100)}%</b></div><div class="nutrition-macros"><span>蛋白 ${total.protein}g</span><span>碳水 ${total.carb}g</span><span>脂肪 ${total.fat}g</span></div></div>
        </section>
        <section class="config-right">
          <div class="config-options-head"><div><h3>可选菜品 · ${configMeal}</h3><p>点击加入 / 再次点击移除</p></div><span class="tag blue">${selected.length} 项已选</span></div>
          <div class="config-options">${allDishes.map(f => { const on = config[configMeal].includes(f.name); return `<button class="config-option ${on ? "selected" : ""}" data-config-dish="${esc(f.name)}">${foodThumb(f.name, f.category, "food")}<span class="config-option-copy"><b>${esc(f.name)}</b><small>${esc(f.category)} · ${f.kcal} kcal · 蛋白 ${f.protein}g</small></span><span class="config-option-tag">${f.category === "蔬菜" || f.category === "水果" ? "高纤" : f.protein > 15 ? "高蛋白" : "均衡"}</span></button>`; }).join("")}</div>
        </section>
      </div>`;
    $("#viewRoot").innerHTML = html;
    setTop("餐次配置", "项目工作区 / 餐次配置", "meal-templates");
    $$("[data-config-meal]").forEach(b => b.addEventListener("click", () => { configMeal = b.dataset.configMeal; renderMealConfig(); }));
    $$("[data-config-dish]").forEach(b => b.addEventListener("click", () => {
      const name = b.dataset.configDish;
      const list = config[configMeal];
      const idx = list.indexOf(name);
      if (idx >= 0) list.splice(idx, 1); else list.push(name);
      renderMealConfig();
    }));
    const save = $("[data-save-config]");
    if (save) save.addEventListener("click", () => {
      const n = nutrition();
      D.recipeTemplates.unshift({
        id: "RT" + Date.now(),
        name: configMeal === "早餐" ? "低脂人群早餐" : configMeal === "午餐" ? "控糖人群午餐" : configMeal === "晚餐" ? "控盐人群晚餐" : "高蛋白人群加餐",
        meal: configMeal,
        kcal: n.kcal,
        protein: n.protein,
        carbs: n.carb,
        fat: n.fat,
        dishes: Object.values(config).flat(),
        tags: ["我的搭配"],
        owner: "我的",
        status: "草稿"
      });
      toast("已保存为我的食谱模版");
    });
  }

  if (window.AdminFiveGood) {
    window.AdminFiveGood.foods = renderFoods;
    window.AdminFiveGood["meal-templates"] = renderMealConfig;
  }
})();
