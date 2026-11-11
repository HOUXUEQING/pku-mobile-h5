/* 简化版饮食推荐：标准食谱 + 我的食谱库，支持按项目或指定学员发布 */
(function () {
  "use strict";
  const D = window.ADMIN_DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const tag = (s, tone) => `<span class="tag ${tone || ""}">${esc(s)}</span>`;
  const projects = D.projects || [];
  const students = D.students || [];
  let audience = "全部";
  let libraryMode = "标准推荐";

  const recipes = [
    { id: "R001", owner: "平台", name: "控糖早餐", audience: "控糖", meal: "早餐", advice: "燕麦片 + 水煮蛋 + 无糖酸奶，先吃蛋白质再吃主食。", note: "少喝果汁，避免甜面包。", products: ["即食燕麦片 400g", "无糖酸奶 200g×4", "鸡蛋 10 枚"], status: "已发布", scopeType: "指定项目", project: "五好生活", students: [] },
    { id: "R002", owner: "平台", name: "减脂午餐", audience: "减脂", meal: "中餐", advice: "糙米饭半碗 + 鸡胸肉 + 西兰花，少油少盐。", note: "先吃蔬菜和蛋白质，主食最后吃。", products: ["糙米 1kg", "鸡胸肉 500g", "西兰花 300g", "藜麦糙米饭"], status: "已发布", scopeType: "指定学员", project: "中石油华北员工减重健康营", students: ["林悦", "陈嘉禾"] },
    { id: "R003", owner: "平台", name: "高蛋白早餐", audience: "增肌", meal: "早餐", advice: "全麦吐司 + 鸡蛋 + 牛油果沙拉，搭配一杯牛奶。", note: "训练日可加一份酸奶。", products: ["全麦吐司 400g", "鸡蛋 10 枚", "牛油果沙拉", "低脂牛奶 250ml×12"], status: "已发布", scopeType: "全项目", project: "", students: [] },
    { id: "R004", owner: "平台", name: "轻食晚餐", audience: "减脂", meal: "晚餐", advice: "三文鱼 + 北豆腐 + 西兰花，晚餐七分饱。", note: "避免夜间高糖水果。", products: ["三文鱼 200g", "北豆腐 400g", "西兰花 300g"], status: "已发布", scopeType: "全项目", project: "", students: [] },
    { id: "R005", owner: "平台", name: "控尿酸加餐", audience: "高尿酸", meal: "加餐", advice: "无糖酸奶 + 蓝莓 + 少量杏仁，避免浓肉汤。", note: "多喝水，少饮酒。", products: ["无糖酸奶 200g×4", "蓝莓 125g", "原味杏仁 150g"], status: "已发布", scopeType: "指定项目", project: "金融街企业减重健康营", students: [] },
    { id: "R006", owner: "平台", name: "高纤维早餐", audience: "通用", meal: "早餐", advice: "燕麦粥 + 苹果 + 水煮蛋，补充膳食纤维。", note: "肠胃敏感时减少燕麦量。", products: ["即食燕麦片 400g", "苹果酸奶杯", "鸡蛋 10 枚"], status: "草稿", scopeType: "全项目", project: "", students: [] },
    { id: "R007", owner: "平台", name: "均衡午餐", audience: "通用", meal: "中餐", advice: "藜麦糙米饭 + 鸡胸肉 + 时蔬，保证一荤两素。", note: "外卖少选油炸和勾芡。", products: ["藜麦糙米饭", "鸡胸肉 500g", "西兰花 300g"], status: "已发布", scopeType: "指定项目", project: "望京科技园减重健康营", students: [] },
    { id: "R008", owner: "平台", name: "控盐晚餐", audience: "控盐", meal: "晚餐", advice: "清蒸鱼 + 豆腐 + 绿叶菜，少放酱油和盐。", note: "避免腌制食品。", products: ["三文鱼 200g", "北豆腐 400g", "西兰花 300g"], status: "已发布", scopeType: "指定学员", project: "五好生活", students: ["周雯", "徐一鸣", "吴倩"] },
    { id: "R101", owner: "我的", name: "我的控糖早餐", audience: "控糖", meal: "早餐", advice: "无糖豆浆 + 鸡蛋 + 半根玉米，简单方便。", note: "不要加糖。", products: ["无糖酸奶 200g×4", "鸡蛋 10 枚", "甜玉米 2 根"], status: "已发布", scopeType: "指定学员", project: "五好生活", students: ["林悦", "周雯"] },
    { id: "R102", owner: "我的", name: "我的训练后加餐", audience: "增肌", meal: "加餐", advice: "乳清蛋白粉 + 香蕉 + 少量坚果。", note: "训练后 30 分钟内补充。", products: ["乳清蛋白粉", "香蕉 1kg", "原味杏仁 150g"], status: "草稿", scopeType: "全项目", project: "", students: [] }
  ];
  const audiences = ["全部", ...new Set(recipes.map(r => r.audience))];

  function projectNameOf(s) {
    if (!s) return "";
    if (typeof s.project === "string") return s.project;
    const id = s.projectId || s.project;
    return projects.find(p => p.id === id)?.name || s.projectName || "";
  }
  function scopeText(r) {
    if (r.scopeType === "指定学员") return `指定学员 ${r.students.length} 人${r.project ? " · " + r.project : ""}`;
    if (r.scopeType === "指定项目") return `项目 · ${r.project}`;
    return "全项目";
  }
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
  function productTone(p) {
    if (!p) return "unmapped";
    const kind = p.kind || "";
    if (kind === "服务项目" || kind === "服务") return "blue";
    return "green";
  }
  function productMark(p) {
    if (!p) return "?";
    const category = p.category || "";
    if (category.includes("食品") || p.subCategory === "营养补充") return "食";
    if (p.kind === "服务项目" || p.kind === "服务") return "服";
    return "物";
  }
  function productOptions(selected) {
    return (D.mallCatalog || []).map(p => `<label class="ingredient-item recipe-product-item"><input type="checkbox" data-recipe-product="${esc(p.name)}"${selected.includes(p.name) ? " checked" : ""}/><i class="recipe-option-thumb ${productTone(p)}">${productMark(p)}</i><span><b>${esc(p.name)}</b><small>${esc(p.kind || "商城商品")} · ${esc(p.category || p.subCategory || "未分类")} · ${esc(typeof p.price === "number" && p.price ? "¥" + p.price : p.priceType || "权益商品")}</small></span></label>`).join("");
  }
  function catalogProduct(name) {
    return (D.mallCatalog || []).find(p => p.name === name);
  }
  function productPriceText(p) {
    if (!p) return "待关联商城商品";
    if (p.price) return "¥" + Number(p.price).toLocaleString("zh-CN");
    if (p.personalPay) return "个人自费 ¥" + Number(p.personalPay).toLocaleString("zh-CN");
    if (p.points) return Number(p.points).toLocaleString("zh-CN") + " 积分";
    return p.priceType || "商城商品";
  }
  function productDetailCard(name) {
    const p = catalogProduct(name);
    if (!p) return `<div class="recipe-product-card unmatched"><div class="recipe-product-visual unmapped">?</div><div class="recipe-product-content"><b>${esc(name)}</b><small>商城暂未找到该商品，请重新关联</small><span class="tag gold">待关联</span></div></div>`;
    return `<div class="recipe-product-card"><div class="recipe-product-visual ${productTone(p)}">${productMark(p)}<small>${esc(p.kind || "商品")}</small></div><div class="recipe-product-content"><b>${esc(p.name)}</b><small>${esc(p.category || "未分类")}${p.subCategory ? " · " + esc(p.subCategory) : ""}</small><div class="recipe-product-meta"><strong>${esc(productPriceText(p))}</strong>${p.priceType === "个人企康资金" ? `<em>企康 ${p.fundRatio || 70}%</em>` : ""}</div><span>${p.status || "上架"}</span></div><a class="recipe-product-go" href="#mall">去商城 →</a></div>`;
  }
  function openRecipeDetail(r) {
    if (!r) return;
    open(`<p class="page-eyebrow">RECIPE DETAIL</p><h2>${esc(r.name)}</h2><p class="drawer-sub">${esc(r.owner)}食谱 · ${esc(r.meal)} · ${esc(r.audience)}</p>
      <div class="drawer-section"><div class="recipe-detail-tags">${tag(r.meal, "gold")}${tag(r.audience)}${tag(scopeText(r), r.scopeType === "指定学员" ? "purple" : r.scopeType === "指定项目" ? "blue" : "slate")}</div><h3>吃什么</h3><p class="activity-detail-desc">${esc(r.advice)}</p><p class="recipe-detail-note">${esc(r.note || "暂无注意事项")}</p></div>
      <div class="drawer-section"><h3>推荐商城商品 · ${r.products.length} 个</h3><div class="recipe-detail-products">${r.products.length ? r.products.map(productDetailCard).join("") : `<div class="activity-media-empty">暂未关联商城商品</div>`}</div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>关闭</button><button class="btn primary" data-simple-recipe-edit="${r.id}">编辑食谱</button></div>`);
    $("[data-simple-recipe-edit]")?.addEventListener("click", () => editor(recipes.find(x => x.id === r.id)));
  }
  function studentOptions(selected) {
    return students.slice(0, 16).map(s => `<label class="ingredient-item"><input type="checkbox" data-recipe-student="${esc(s.name)}"${selected.includes(s.name) ? " checked" : ""}/><span><b>${esc(s.name)}</b><small>${esc(projectNameOf(s))}</small></span></label>`).join("");
  }
  function editor(recipe) {
    const r = recipe || { name: "", audience: "通用", meal: "早餐", advice: "", note: "", products: [], status: "草稿", scopeType: "全项目", project: "", students: [] };
    open(`<p class="page-eyebrow">RECIPE EDITOR</p><h2>${recipe ? "编辑饮食推荐" : (libraryMode === "我的食谱库" ? "新增我的食谱" : "新增推荐")}</h2><p class="drawer-sub">填写饮食建议并关联商城商品；可发布到项目或指定学员</p>
      <div class="drawer-section"><div class="publish-form">
        <label class="field"><span>推荐名称</span><input id="simpleRecipeName" value="${esc(r.name)}" placeholder="例如：控糖早餐" /></label>
        <label class="field"><span>适用人群</span><select id="simpleRecipeAudience">${["通用", "减脂", "控糖", "高尿酸", "增肌", "控盐"].map(a => `<option${r.audience === a ? " selected" : ""}>${a}</option>`).join("")}</select></label>
        <label class="field"><span>餐次</span><select id="simpleRecipeMeal">${["早餐", "中餐", "晚餐", "加餐"].map(m => `<option${r.meal === m ? " selected" : ""}>${m}</option>`).join("")}</select></label>
        <label class="field"><span>状态</span><select id="simpleRecipeStatus"><option${r.status === "已发布" ? " selected" : ""}>已发布</option><option${r.status !== "已发布" ? " selected" : ""}>草稿</option></select></label>
        <label class="field full"><span>吃什么</span><textarea id="simpleRecipeAdvice" rows="3" placeholder="例如：燕麦片 + 水煮蛋 + 无糖酸奶">${esc(r.advice)}</textarea></label>
        <label class="field full"><span>注意事项</span><input id="simpleRecipeNote" value="${esc(r.note)}" placeholder="例如：少喝果汁，避免甜面包" /></label>
      </div></div>
      <div class="drawer-section"><h3>发布范围</h3><div class="publish-form">
        <label class="field"><span>发布到</span><select id="recipeScopeType">${["全项目", "指定项目", "指定学员"].map(t => `<option${r.scopeType === t ? " selected" : ""}>${t}</option>`).join("")}</select></label>
        <label class="field"><span>指定项目</span><select id="recipeProject"><option value="">不指定</option>${projects.map(p => `<option${r.project === p.name ? " selected" : ""}>${esc(p.name)}</option>`).join("")}</select></label>
        <div class="field full"><span>指定学员（可多选）</span><div class="student-picker">${studentOptions(r.students || [])}</div></div>
      </div></div>
      <div class="drawer-section"><h3>关联商城商品</h3><label class="filter-search recipe-product-search"><svg class="ic"><use href="#i-search"/></svg><input id="recipeProductSearch" placeholder="搜索商品名称、类型或分类" /></label><div class="recipe-product-toolbar"><span id="recipeProductCount">已选 ${r.products.length} 个商品</span><span>可搜索全部商城商品</span></div><div class="ingredient-picker recipe-product-picker" id="recipeProductPicker">${productOptions(r.products)}</div><div class="recipe-product-empty" id="recipeProductEmpty" style="display:none">没有匹配的商城商品</div></div>
      <div class="drawer-actions"><button class="btn" data-close-drawer>取消</button><button class="btn primary" data-simple-recipe-save="${recipe ? recipe.id : ""}">保存</button></div>`);
    const productSearch = $("#recipeProductSearch");
    const productCount = $("#recipeProductCount");
    const productEmpty = $("#recipeProductEmpty");
    const updateProductCount = () => {
      if (productCount) productCount.textContent = `已选 ${$$("[data-recipe-product]:checked").length} 个商品`;
    };
    $$("[data-recipe-product]").forEach(input => input.addEventListener("change", updateProductCount));
    productSearch?.addEventListener("input", () => {
      const q = productSearch.value.trim().toLowerCase();
      let visible = 0;
      $$("[data-recipe-product]").forEach(input => {
        const label = input.closest(".ingredient-item");
        const match = !q || label.innerText.toLowerCase().includes(q);
        if (label) label.style.display = match ? "" : "none";
        if (match) visible += 1;
      });
      if (productEmpty) productEmpty.style.display = visible ? "none" : "block";
    });
    const save = $("[data-simple-recipe-save]");
    if (save) save.addEventListener("click", () => {
      const name = $("#simpleRecipeName").value.trim();
      if (!name) { toast("请填写推荐名称"); return; }
      const scopeType = $("#recipeScopeType").value;
      const project = $("#recipeProject").value;
      const targetStudents = $$("[data-recipe-student]:checked").map(i => i.dataset.recipeStudent);
      const products = $$("[data-recipe-product]:checked").map(i => i.dataset.recipeProduct);
      if (scopeType === "指定学员" && !targetStudents.length) { toast("请选择至少一名学员"); return; }
      if (scopeType === "指定项目" && !project) { toast("请选择发布项目"); return; }
      const data = { name, audience: $("#simpleRecipeAudience").value, meal: $("#simpleRecipeMeal").value, advice: $("#simpleRecipeAdvice").value.trim(), note: $("#simpleRecipeNote").value.trim(), products, status: $("#simpleRecipeStatus").value, scopeType, project: scopeType === "全项目" ? "" : project, students: scopeType === "指定学员" ? targetStudents : [] };
      const existing = recipes.find(x => x.id === (recipe && recipe.id));
      if (existing) Object.assign(existing, data);
      else {
        const owner = libraryMode === "我的食谱库" ? "我的" : "平台";
        recipes.unshift({ id: "R" + Date.now(), owner, ...data });
        libraryMode = owner === "我的" ? "我的食谱库" : libraryMode;
      }
      toast(existing ? "饮食推荐已更新" : "饮食推荐已创建");
      $("#drawer").classList.remove("open"); $("#drawerBackdrop").classList.remove("open");
      render();
    });
  }
  function kpi(iconName, label, value, unit, sub, color) {
    return `<article class="kpi-card" style="--kpi:${color};--kpi-soft:${color}18"><span class="kpi-icon">${icon(iconName)}</span><div class="kpi-label">${label}</div><div class="kpi-num">${value}<small>${unit}</small></div><div class="kpi-sub">${sub}</div></article>`;
  }
  function render() {
    const ownerRecipes = recipes.filter(r => r.owner === (libraryMode === "我的食谱库" ? "我的" : "平台"));
    const list = ownerRecipes.filter(r => audience === "全部" || r.audience === audience);
    const newLabel = libraryMode === "我的食谱库" ? "新增我的食谱" : "新增推荐";
    $("#viewRoot").innerHTML = `<div class="simple-recipe-page">${head("饮食推荐", "简单说明吃什么并关联商城商品；可发布到项目或指定学员", `<button class="btn primary" data-simple-recipe-new="1">${icon("plus")}${newLabel}</button>`)}
      <div class="kpi-grid four">${kpi("check", libraryMode === "我的食谱库" ? "我的食谱" : "已发布推荐", ownerRecipes.filter(r => r.status === "已发布").length, "条", libraryMode === "我的食谱库" ? "我的食谱库" : "平台标准推荐", "#2f6bff")}${kpi("users", "适用人群", audiences.length - 1, "类", "减脂 / 控糖 / 高尿酸等", "#16a394")}${kpi("project", "指定发布", ownerRecipes.filter(r => r.scopeType !== "全项目").length, "条", "指定项目或学员", "#8b5cf6")}${kpi("edit", "草稿", ownerRecipes.filter(r => r.status === "草稿").length, "条", "待完善", "#e8a13c")}</div>
      <div class="recipe-library-tabs"><button class="${libraryMode === "标准推荐" ? "active" : ""}" data-recipe-library="标准推荐">标准推荐<b>${recipes.filter(r => r.owner === "平台").length}</b></button><button class="${libraryMode === "我的食谱库" ? "active" : ""}" data-recipe-library="我的食谱库">我的食谱库<b>${recipes.filter(r => r.owner === "我的").length}</b></button></div>
      <div class="recipe-mode-tabs">${audiences.map(a => `<button class="${audience === a ? "active" : ""}" data-simple-audience="${a}">${a}</button>`).join("")}</div>
      <div class="simple-recipe-grid">${list.map(r => `<article class="simple-recipe-card"><div class="simple-recipe-top"><div>${tag(r.meal, r.meal === "早餐" ? "gold" : r.meal === "中餐" ? "blue" : r.meal === "晚餐" ? "green" : "slate")}${tag(r.audience)}</div>${tag(r.status, r.status === "已发布" ? "green" : "gold")}</div><h3>${esc(r.name)}</h3><p class="simple-recipe-scope">${tag(scopeText(r), r.scopeType === "指定学员" ? "purple" : r.scopeType === "指定项目" ? "blue" : "slate")}</p><p class="simple-recipe-advice">${esc(r.advice)}</p><p class="simple-recipe-note">${esc(r.note)}</p><div class="simple-recipe-products">${r.products.map(p => { const item = catalogProduct(p); return `<a class="simple-product-chip" href="#mall"><span class="simple-product-chip-icon ${productTone(item)}">${productMark(item)}</span><span class="simple-product-chip-copy"><b>${esc(p)}</b><small>${item ? esc(productPriceText(item)) : "待关联"}</small></span><em>›</em></a>`; }).join("")}</div><div class="simple-recipe-foot"><span>${r.products.length} 个推荐商品</span><div class="simple-recipe-actions"><button class="panel-link" data-simple-recipe-view="${r.id}">详情</button><button class="panel-link" data-simple-recipe-edit="${r.id}">编辑 →</button></div></div></article>`).join("")}</div>
    </div>`;
    setTop();
    $$("[data-recipe-library]").forEach(b => b.addEventListener("click", () => { libraryMode = b.dataset.recipeLibrary; audience = "全部"; render(); }));
    $$("[data-simple-audience]").forEach(b => b.addEventListener("click", () => { audience = b.dataset.simpleAudience; render(); }));
    $$("[data-simple-recipe-edit]").forEach(b => b.addEventListener("click", () => editor(recipes.find(r => r.id === b.dataset.simpleRecipeEdit))));
    $$("[data-simple-recipe-view]").forEach(b => b.addEventListener("click", () => openRecipeDetail(recipes.find(r => r.id === b.dataset.simpleRecipeView))));
    $$("[data-simple-recipe-new]").forEach(b => b.addEventListener("click", () => editor(null)));
  }
  if (window.AdminFiveGood) window.AdminFiveGood.recipes = render;
  window.AdminSimpleRecipes = { render };
})();
