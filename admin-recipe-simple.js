/* 简化版饮食推荐：只说明吃什么，并关联商城商品 */
(function () {
  "use strict";
  const D = window.ADMIN_DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const tag = (s, tone) => `<span class="tag ${tone || ""}">${esc(s)}</span>`;
  let audience = "全部";
  const recipes = [
    { id: "R001", name: "控糖早餐", audience: "控糖", meal: "早餐", advice: "燕麦片 + 水煮蛋 + 无糖酸奶，先吃蛋白质再吃主食。", note: "少喝果汁，避免甜面包。", products: ["即食燕麦片", "无糖酸奶", "鸡蛋"], status: "已发布" },
    { id: "R002", name: "减脂午餐", audience: "减脂", meal: "中餐", advice: "糙米饭半碗 + 鸡胸肉 + 西兰花，少油少盐。", note: "先吃蔬菜和蛋白质，主食最后吃。", products: ["糙米", "鸡胸肉", "西兰花"], status: "已发布" },
    { id: "R003", name: "高蛋白早餐", audience: "增肌", meal: "早餐", advice: "全麦吐司 + 鸡蛋 + 牛油果沙拉，搭配一杯牛奶。", note: "训练日可加一份酸奶。", products: ["全麦吐司", "鸡蛋", "牛油果沙拉"], status: "已发布" },
    { id: "R004", name: "轻食晚餐", audience: "减脂", meal: "晚餐", advice: "三文鱼 + 北豆腐 + 西兰花，晚餐七分饱。", note: "避免夜间高糖水果。", products: ["三文鱼", "北豆腐", "西兰花"], status: "已发布" },
    { id: "R005", name: "控尿酸加餐", audience: "高尿酸", meal: "加餐", advice: "无糖酸奶 + 蓝莓 + 少量杏仁，避免浓肉汤。", note: "多喝水，少饮酒。", products: ["无糖酸奶", "蓝莓", "杏仁"], status: "已发布" },
    { id: "R006", name: "高纤维早餐", audience: "通用", meal: "早餐", advice: "燕麦粥 + 苹果 + 水煮蛋，补充膳食纤维。", note: "肠胃敏感时减少燕麦量。", products: ["即食燕麦片", "苹果酸奶杯", "鸡蛋"], status: "草稿" },
    { id: "R007", name: "均衡午餐", audience: "通用", meal: "中餐", advice: "藜麦糙米饭 + 鸡胸肉 + 时蔬，保证一荤两素。", note: "外卖少选油炸和勾芡。", products: ["藜麦糙米饭", "鸡胸肉", "西兰花"], status: "已发布" },
    { id: "R008", name: "控盐晚餐", audience: "控盐", meal: "晚餐", advice: "清蒸鱼 + 豆腐 + 绿叶菜，少放酱油和盐。", note: "避免腌制食品。", products: ["三文鱼", "北豆腐", "西兰花"], status: "已发布" }
  ];
  const audiences = ["全部", ...new Set(recipes.map(r => r.audience))];

  function head(title, sub, action) {
    return `<div class="page-head"><div><p class="page-eyebrow">FOOD RECOMMENDATION</p><h2>${title}</h2><p class="checkin-sub">${sub}</p></div><div class="page-actions">${action || ""}</div></div>`;
  }
  function setTop() {
    $("#topTitle").textContent = "饮食推荐";
    $("#breadcrumb").textContent = "内容管理 / 饮食推荐";
    $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.nav === "recipes"));
  }
  function open(html) {
    $("#drawerBody").innerHTML = html;
    $("#drawer").classList.add("open");
    $("#drawer").setAttribute("aria-hidden", "false");
    $("#drawerBackdrop").classList.add("open");
  }
  function toast(text) {
    const t = $("#toast"); t.textContent = text; t.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2000);
  }
  function productOptions(selected) {
    return D.mallCatalog.filter(p => p.kind === "实物").slice(0, 18).map(p => `<label class="ingredient-item"><input type="checkbox" data-recipe-product="${esc(p.name)}"${selected.includes(p.name) ? " checked" : ""}/><span><b>${esc(p.name)}</b><small>${esc(p.category || p.subCategory || "商城商品")} · ${esc(typeof p.price === "number" ? "¥" + p.price : p.price)}</small></span></label>`).join("");
  }
  function editor(recipe) {
    const r = recipe || { name: "", audience: "通用", meal: "早餐", advice: "", note: "", products: [], status: "草稿" };
    open(`<p class="page-eyebrow">RECIPE EDITOR</p><h2>${recipe ? "编辑饮食推荐" : "新增饮食推荐"}</h2><p class="drawer-sub">只填写简单饮食建议，并关联商城商品</p>
      <div class="drawer-section"><div class="publish-form">
        <label class="field"><span>推荐名称</span><input id="simpleRecipeName" value="${esc(r.name)}" placeholder="例如：控糖早餐" /></label>
        <label class="field"><span>适用人群</span><select id="simpleRecipeAudience">${["通用", "减脂", "控糖", "高尿酸", "增肌", "控盐"].map(a => `<option${r.audience === a ? " selected" : ""}>${a}</option>`).join("")}</select></label>
        <label class="field"><span>餐次</span><select id="simpleRecipeMeal">${["早餐", "中餐", "晚餐", "加餐"].map(m => `<option${r.meal === m ? " selected" : ""}>${m}</option>`).join("")}</select></label>
        <label class="field"><span>状态</span><select id="simpleRecipeStatus"><option${r.status === "已发布" ? " selected" : ""}>已发布</option><option${r.status !== "已发布" ? " selected" : ""}>草稿</option></select></label>
        <label class="field full"><span>吃什么</span><textarea id="simpleRecipeAdvice" rows="3" placeholder="例如：燕麦片 + 水煮蛋 + 无糖酸奶">${esc(r.advice)}</textarea></label>
        <label class="field full"><span>注意事项</span><input id="simpleRecipeNote" value="${esc(r.note)}" placeholder="例如：少喝果汁，避免甜面包" /></label>
        <div class="field full"><span>关联商城商品</span><div class="ingredient-picker">${productOptions(r.products)}</div></div>
      </div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-simple-recipe-save="${recipe ? recipe.id : ""}">保存</button></div>`);
    const save = $("[data-simple-recipe-save]");
    if (save) save.addEventListener("click", () => {
      toast(recipe ? "饮食推荐已更新" : "饮食推荐已创建");
      $("#drawer").classList.remove("open"); $("#drawerBackdrop").classList.remove("open");
    });
  }
  function render() {
    const list = recipes.filter(r => audience === "全部" || r.audience === audience);
    $("#viewRoot").innerHTML = `<div class="simple-recipe-page">${head("饮食推荐", "简单说明需要吃什么，并关联商城商品；不做热量和营养素计算", `<button class="btn primary" data-simple-recipe-new="1">${icon("plus")}新增推荐</button>`)}
      <div class="kpi-grid four">${kpi("check", "已发布推荐", recipes.filter(r => r.status === "已发布").length, "条", "可直接展示", "#2f6bff")}${kpi("users", "适用人群", audiences.length - 1, "类", "减脂 / 控糖 / 高尿酸等", "#16a394")}${kpi("project", "关联商品", new Set(recipes.flatMap(r => r.products)).size, "个", "来自商城商品库", "#8b5cf6")}${kpi("edit", "草稿", recipes.filter(r => r.status === "草稿").length, "条", "待完善", "#e8a13c")}</div>
      <div class="recipe-mode-tabs">${audiences.map(a => `<button class="${audience === a ? "active" : ""}" data-simple-audience="${a}">${a}</button>`).join("")}</div>
      <div class="simple-recipe-grid">${list.map(r => `<article class="simple-recipe-card"><div class="simple-recipe-top"><div>${tag(r.meal, r.meal === "早餐" ? "gold" : r.meal === "中餐" ? "blue" : r.meal === "晚餐" ? "green" : "slate")}${tag(r.audience)}</div>${tag(r.status, r.status === "已发布" ? "green" : "gold")}</div><h3>${esc(r.name)}</h3><p class="simple-recipe-advice">${esc(r.advice)}</p><p class="simple-recipe-note">${esc(r.note)}</p><div class="simple-recipe-products">${r.products.map(p => `<a href="#mall">${esc(p)}<span>去商城 →</span></a>`).join("")}</div><div class="simple-recipe-foot"><span>${r.products.length} 个推荐商品</span><button class="panel-link" data-simple-recipe-edit="${r.id}">编辑 →</button></div></article>`).join("")}</div>
    </div>`;
    setTop();
    $$("[data-simple-audience]").forEach(b => b.addEventListener("click", () => { audience = b.dataset.simpleAudience; render(); }));
    $$("[data-simple-recipe-edit]").forEach(b => b.addEventListener("click", () => editor(recipes.find(r => r.id === b.dataset.simpleRecipeEdit))));
    $$("[data-simple-recipe-new]").forEach(b => b.addEventListener("click", () => editor(null)));
  }
  function kpi(iconName, label, value, unit, sub, color) {
    return `<article class="kpi-card" style="--kpi:${color};--kpi-soft:${color}18"><span class="kpi-icon">${icon(iconName)}</span><div class="kpi-label">${label}</div><div class="kpi-num">${value}<small>${unit}</small></div><div class="kpi-sub">${sub}</div></article>`;
  }
  if (window.AdminFiveGood) window.AdminFiveGood.recipes = render;
  window.AdminSimpleRecipes = { render };
})();
