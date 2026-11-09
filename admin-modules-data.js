window.ADMIN_DATA = window.ADMIN_DATA || {};

Object.assign(window.ADMIN_DATA, {
  fiveGood: {
    id: "FG001",
    name: "星河科技五好生活",
    enterprise: "星河科技",
    institutionId: "I003",
    status: "进行中",
    start: "2026-09-01",
    end: "2027-08-31",
    employees: 286,
    serviceUsers: 186,
    monthlyServices: 1248,
    dietRate: 82.4,
    sleepRate: 68.0,
    exerciseRate: 74.2,
    services: [
      { key: "screen", title: "好好早筛", count: 186, status: "进行中", tone: "blue", icon: "heart" },
      { key: "eat", title: "好好吃饭", count: 242, status: "进行中", tone: "gold", icon: "check" },
      { key: "move", title: "好好运动", count: 218, status: "进行中", tone: "green", icon: "chart" },
      { key: "sleep", title: "好好睡觉", count: 164, status: "进行中", tone: "indigo", icon: "calendar" },
      { key: "relax", title: "好好放松", count: 128, status: "进行中", tone: "purple", icon: "users" }
    ]
  },

  recipePlans: [
    { date: "10-21", weekday: "周三", calories: 1680, protein: 86, breakfast: { name: "燕麦鸡蛋能量碗", kcal: 420, protein: 24 }, lunch: { name: "糙米鸡胸彩蔬饭", kcal: 560, protein: 38 }, dinner: { name: "清蒸鲈鱼豆腐", kcal: 520, protein: 32 }, snack: { name: "无糖酸奶坚果杯", kcal: 180, protein: 9 } },
    { date: "10-22", weekday: "周四", calories: 1650, protein: 84, breakfast: { name: "全麦牛油果蛋卷", kcal: 390, protein: 21 }, lunch: { name: "藜麦牛肉时蔬碗", kcal: 570, protein: 36 }, dinner: { name: "菌菇豆腐荞麦面", kcal: 510, protein: 27 }, snack: { name: "蓝莓奇亚籽杯", kcal: 180, protein: 7 } },
    { date: "10-23", weekday: "周五", calories: 1720, protein: 88, breakfast: { name: "紫薯豆浆早餐盘", kcal: 410, protein: 19 }, lunch: { name: "香煎三文鱼沙拉", kcal: 610, protein: 42 }, dinner: { name: "番茄牛肉杂粮饭", kcal: 520, protein: 34 }, snack: { name: "低糖水果拼盘", kcal: 180, protein: 4 } },
    { date: "10-24", weekday: "周六", calories: 1600, protein: 80, breakfast: { name: "南瓜小米粥配蛋", kcal: 360, protein: 18 }, lunch: { name: "虾仁芦笋意面", kcal: 540, protein: 35 }, dinner: { name: "冬瓜鸡肉菌菇汤", kcal: 520, protein: 31 }, snack: { name: "无糖酸奶", kcal: 180, protein: 10 } },
    { date: "10-25", weekday: "周日", calories: 1580, protein: 78, breakfast: { name: "香蕉燕麦松饼", kcal: 380, protein: 17 }, lunch: { name: "烤鸡腿藜麦沙拉", kcal: 560, protein: 40 }, dinner: { name: "清蒸鳕鱼蔬菜", kcal: 460, protein: 32 }, snack: { name: "杏仁小袋", kcal: 180, protein: 6 } },
    { date: "10-26", weekday: "周一", calories: 1700, protein: 87, breakfast: { name: "鸡蛋牛油果吐司", kcal: 400, protein: 22 }, lunch: { name: "黑椒牛肉糙米饭", kcal: 600, protein: 39 }, dinner: { name: "虾仁豆腐蒸蛋", kcal: 500, protein: 28 }, snack: { name: "低脂奶酪杯", kcal: 200, protein: 12 } },
    { date: "10-27", weekday: "周二", calories: 1660, protein: 85, breakfast: { name: "杂粮粥配水煮蛋", kcal: 370, protein: 20 }, lunch: { name: "照烧鸡胸杂粮碗", kcal: 590, protein: 38 }, dinner: { name: "海带豆腐鱼片汤", kcal: 500, protein: 30 }, snack: { name: "奇异果酸奶", kcal: 200, protein: 8 } }
  ],

  foods: [
    { id: "F001", name: "燕麦片", category: "谷物", kcal: 377, protein: 15, carb: 66, fat: 6.7, fiber: 10.6, allergens: "麸质", status: "启用" },
    { id: "F002", name: "糙米", category: "谷物", kcal: 348, protein: 7.7, carb: 75, fat: 2.7, fiber: 3.5, allergens: "—", status: "启用" },
    { id: "F003", name: "鸡胸肉", category: "肉禽", kcal: 165, protein: 31, carb: 0, fat: 3.6, fiber: 0, allergens: "—", status: "启用" },
    { id: "F004", name: "三文鱼", category: "水产", kcal: 208, protein: 20, carb: 0, fat: 13, fiber: 0, allergens: "鱼类", status: "启用" },
    { id: "F005", name: "北豆腐", category: "豆制品", kcal: 116, protein: 12.2, carb: 3, fat: 6.5, fiber: 0.5, allergens: "大豆", status: "启用" },
    { id: "F006", name: "西兰花", category: "蔬菜", kcal: 34, protein: 2.8, carb: 7, fat: 0.4, fiber: 2.6, allergens: "—", status: "启用" },
    { id: "F007", name: "牛油果", category: "水果", kcal: 160, protein: 2, carb: 9, fat: 15, fiber: 6.7, allergens: "—", status: "启用" },
    { id: "F008", name: "无糖酸奶", category: "乳制品", kcal: 72, protein: 3.5, carb: 5, fat: 4, fiber: 0, allergens: "乳制品", status: "启用" },
    { id: "F009", name: "鸡蛋", category: "蛋类", kcal: 143, protein: 12.6, carb: 0.7, fat: 9.5, fiber: 0, allergens: "蛋类", status: "启用" },
    { id: "F010", name: "蓝莓", category: "水果", kcal: 57, protein: 0.7, carb: 14, fat: 0.3, fiber: 2.4, allergens: "—", status: "启用" },
    { id: "F011", name: "藜麦", category: "谷物", kcal: 368, protein: 14, carb: 64, fat: 6, fiber: 7, allergens: "—", status: "启用" },
    { id: "F012", name: "杏仁", category: "坚果", kcal: 579, protein: 21, carb: 22, fat: 50, fiber: 12.5, allergens: "坚果", status: "停用" }
  ],

  mealTemplates: [
    { id: "T001", name: "五好轻盈早餐 A", meal: "早餐", kcal: 420, protein: 24, projects: ["五好生活", "减重营"], uses: 24, status: "启用" },
    { id: "T002", name: "五好均衡午餐 B", meal: "中餐", kcal: 560, protein: 38, projects: ["五好生活", "减重营"], uses: 31, status: "启用" },
    { id: "T003", name: "减重低脂晚餐 C", meal: "晚餐", kcal: 460, protein: 30, projects: ["减重营"], uses: 18, status: "启用" },
    { id: "T004", name: "办公室加餐 D", meal: "加餐", kcal: 180, protein: 9, projects: ["五好生活", "减重营"], uses: 26, status: "启用" },
    { id: "T005", name: "周末轻断食模板", meal: "全天", kcal: 1200, protein: 72, projects: ["五好生活"], uses: 7, status: "草稿" }
  ],

  exercisePrescriptions: [
    { id: "RX001", name: "久坐激活 30 分钟", audience: "久坐办公人群", type: "快走 + 拉伸", frequency: "每周 3 次", duration: "30 分钟", intensity: "中低", projects: ["五好生活"], status: "启用" },
    { id: "RX002", name: "减重有氧基础", audience: "减重营学员", type: "快走 / 骑行", frequency: "每周 5 次", duration: "45 分钟", intensity: "中等", projects: ["减重营"], status: "启用" },
    { id: "RX003", name: "下肢力量进阶", audience: "体能基础良好", type: "力量训练", frequency: "每周 2 次", duration: "40 分钟", intensity: "中高", projects: ["减重营"], status: "启用" },
    { id: "RX004", name: "睡前放松序列", audience: "睡眠困扰人群", type: "呼吸 + 瑜伽", frequency: "每晚", duration: "15 分钟", intensity: "低", projects: ["五好生活"], status: "启用" },
    { id: "RX005", name: "膝关节友好有氧", audience: "膝关节风险人群", type: "游泳 / 椭圆机", frequency: "每周 3 次", duration: "30 分钟", intensity: "低", projects: ["五好生活", "减重营"], status: "草稿" }
  ],

  psychAssessments: [
    { id: "PSY001", name: "压力与情绪评估", scale: "PHQ-9 / GAD-7", questions: 16, projects: ["五好生活", "减重营"], submissions: 186, riskHigh: 8, status: "启用" },
    { id: "PSY002", name: "睡眠质量评估", scale: "PSQI", questions: 19, projects: ["五好生活"], submissions: 142, riskHigh: 12, status: "启用" },
    { id: "PSY003", name: "职场倦怠评估", scale: "MBI-GS", questions: 15, projects: ["五好生活"], submissions: 96, riskHigh: 5, status: "启用" },
    { id: "PSY004", name: "减重心理支持评估", scale: "DEBQ", questions: 33, projects: ["减重营"], submissions: 74, riskHigh: 6, status: "草稿" }
  ],

  lifeCheckins: [
    { id: "LC001", date: "2026-10-21", name: "林小满", dept: "产品设计部", diet: "3/3", dietScore: 9, sleep: "7.2h", sleepScore: 8, exercise: "40 分钟", exerciseType: "快走", completion: "全部完成" },
    { id: "LC002", date: "2026-10-21", name: "陈思远", dept: "研发中心", diet: "3/3", dietScore: 8, sleep: "6.4h", sleepScore: 6, exercise: "30 分钟", exerciseType: "拉伸", completion: "已完成" },
    { id: "LC003", date: "2026-10-21", name: "赵一诺", dept: "市场部", diet: "2/3", dietScore: 6, sleep: "7.8h", sleepScore: 9, exercise: "0 分钟", exerciseType: "—", completion: "待完成" },
    { id: "LC004", date: "2026-10-21", name: "王嘉禾", dept: "人力资源部", diet: "3/3", dietScore: 9, sleep: "7.0h", sleepScore: 8, exercise: "45 分钟", exerciseType: "瑜伽", completion: "全部完成" },
    { id: "LC005", date: "2026-10-20", name: "林小满", dept: "产品设计部", diet: "3/3", dietScore: 8, sleep: "6.9h", sleepScore: 7, exercise: "35 分钟", exerciseType: "快走", completion: "全部完成" },
    { id: "LC006", date: "2026-10-20", name: "陈思远", dept: "研发中心", diet: "3/3", dietScore: 8, sleep: "7.4h", sleepScore: 8, exercise: "25 分钟", exerciseType: "骑行", completion: "已完成" },
    { id: "LC007", date: "2026-10-20", name: "赵一诺", dept: "市场部", diet: "3/3", dietScore: 7, sleep: "6.2h", sleepScore: 5, exercise: "20 分钟", exerciseType: "散步", completion: "已完成" },
    { id: "LC008", date: "2026-10-20", name: "王嘉禾", dept: "人力资源部", diet: "2/3", dietScore: 6, sleep: "7.6h", sleepScore: 9, exercise: "40 分钟", exerciseType: "普拉提", completion: "待完成" }
  ],

  mallProducts: [
    { id: "SP001", name: "北大医疗定制体检卡", category: "体检", price: 1699, stock: 120, sales: 86, projects: ["五好生活", "减重营"], status: "上架" },
    { id: "SP002", name: "无痛胃肠镜专项", category: "筛查", price: 1299, stock: 80, sales: 42, projects: ["五好生活"], status: "上架" },
    { id: "SP003", name: "功能营养组合包", category: "营养", price: 399, stock: 260, sales: 164, projects: ["五好生活", "减重营"], status: "上架" },
    { id: "SP004", name: "健康厨房基础食材包", category: "食品", price: 299, stock: 180, sales: 128, projects: ["五好生活"], status: "上架" },
    { id: "SP005", name: "智能运动手环", category: "运动", price: 499, stock: 64, sales: 37, projects: ["减重营"], status: "上架" },
    { id: "SP006", name: "多导睡眠监测", category: "睡眠", price: 899, stock: 30, sales: 12, projects: ["五好生活"], status: "下架" }
  ],

  orders: [
    { id: "SO20261021001", user: "林小满", item: "北大医疗定制体检卡", project: "五好生活", amount: 1699, status: "已完成", date: "2026-10-21 09:20" },
    { id: "SO20261021002", user: "陈思远", item: "功能营养组合包", project: "五好生活", amount: 399, status: "待发货", date: "2026-10-21 08:46" },
    { id: "SO20261020008", user: "张晨", item: "减重营体成分复测", project: "减重营", amount: 0, status: "已完成", date: "2026-10-20 18:12" },
    { id: "SO20261020007", user: "王嘉禾", item: "多导睡眠监测", project: "五好生活", amount: 899, status: "待预约", date: "2026-10-20 16:35" },
    { id: "SO20261020006", user: "李雪", item: "健康厨房基础食材包", project: "减重营", amount: 299, status: "待发货", date: "2026-10-20 14:22" },
    { id: "SO20261019003", user: "赵一诺", item: "智能运动手环", project: "五好生活", amount: 499, status: "已完成", date: "2026-10-19 20:08" },
    { id: "SO20261019002", user: "王凯", item: "功能营养组合包", project: "减重营", amount: 399, status: "已取消", date: "2026-10-19 17:41" },
    { id: "SO20261018001", user: "孙悦", item: "北大医疗定制体检卡", project: "五好生活", amount: 1699, status: "已完成", date: "2026-10-18 10:26" }
  ],

  articles: [
    { id: "A001", title: "从凌晨两点到十一点入睡，我只做了三件事", channel: "五好刊物", projects: ["五好生活"], status: "已发布", date: "2026-10-20", views: 1286 },
    { id: "A002", title: "食堂新窗口，治好了我的午餐选择困难", channel: "五好刊物", projects: ["五好生活"], status: "已发布", date: "2026-10-18", views: 968 },
    { id: "A003", title: "我把午休变成了十分钟的肩颈仪式", channel: "五好刊物", projects: ["五好生活", "减重营"], status: "已发布", date: "2026-10-16", views: 742 },
    { id: "A004", title: "体检报告上的箭头，让我开始认真吃早餐", channel: "五好刊物", projects: ["五好生活", "减重营"], status: "待发布", date: "2026-10-21", views: 0 },
    { id: "A005", title: "减重营第 4 周：如何跨过平台期", channel: "减重营", projects: ["减重营"], status: "草稿", date: "2026-10-21", views: 0 }
  ],

  surveys: [
    { id: "Q001", name: "五好生活服务满意度", questions: 12, projects: ["五好生活"], responses: 186, target: 286, status: "进行中" },
    { id: "Q002", name: "员工健康需求调研", questions: 18, projects: ["五好生活", "减重营"], responses: 324, target: 500, status: "进行中" },
    { id: "Q003", name: "减重营阶段反馈", questions: 9, projects: ["减重营"], responses: 108, target: 120, status: "已结束" },
    { id: "Q004", name: "睡眠改善课程报名", questions: 6, projects: ["五好生活"], responses: 64, target: 100, status: "草稿" }
  ],

  assessmentLibrary: [
    { id: "AS001", name: "健康风险综合测评", type: "健康测评", questions: 24, projects: ["五好生活", "减重营"], completed: 268, status: "启用" },
    { id: "AS002", name: "压力与情绪评估", type: "心理测评", questions: 16, projects: ["五好生活", "减重营"], completed: 186, status: "启用" },
    { id: "AS003", name: "睡眠质量评估", type: "睡眠测评", questions: 19, projects: ["五好生活"], completed: 142, status: "启用" },
    { id: "AS004", name: "减重依从性评估", type: "行为测评", questions: 14, projects: ["减重营"], completed: 96, status: "启用" },
    { id: "AS005", name: "饮食结构测评", type: "营养测评", questions: 20, projects: ["五好生活", "减重营"], completed: 204, status: "草稿" }
  ]
});

Object.assign(window.ADMIN_DATA, {
  publications: [
    { id: "PUB001", content: "五好轻盈早餐 A", type: "食谱", project: "五好生活", target: "项目全员", audience: 286, status: "已发布", date: "2026-10-20 09:00", publisher: "王倩" },
    { id: "PUB002", content: "久坐激活 30 分钟", type: "运动处方", project: "五好生活", target: "指定人群", audience: 86, status: "已发布", date: "2026-10-20 10:20", publisher: "刘洋" },
    { id: "PUB003", content: "压力与情绪评估", type: "心理评估", project: "五好生活", target: "项目全员", audience: 286, status: "已发布", date: "2026-10-19 14:00", publisher: "王倩" },
    { id: "PUB004", content: "减重有氧基础", type: "运动处方", project: "减重营", target: "指定营期", audience: 120, status: "已发布", date: "2026-10-21 08:30", publisher: "王琳" },
    { id: "PUB005", content: "第 4 周平台期指南", type: "文章", project: "减重营", target: "项目全员", audience: 120, status: "草稿", date: "2026-10-21 11:10", publisher: "王倩" },
    { id: "PUB006", content: "入营健康问卷", type: "问卷", project: "减重营", target: "指定学员", audience: 1, status: "已发布", date: "2026-10-21 09:45", publisher: "周明" }
  ],
  campTasks: [
    { id: "TASK001", name: "每日体重打卡", type: "体重", window: "06:00 — 10:00", points: 10, projects: ["减重营"], status: "启用" },
    { id: "TASK002", name: "三餐饮食记录", type: "饮食", window: "07:00 — 21:30", points: 15, projects: ["减重营", "五好生活"], status: "启用" },
    { id: "TASK003", name: "每日运动 30 分钟", type: "运动", window: "06:00 — 22:00", points: 15, projects: ["减重营", "五好生活"], status: "启用" },
    { id: "TASK004", name: "睡眠记录", type: "睡眠", window: "22:00 — 次日 09:00", points: 10, projects: ["五好生活"], status: "启用" },
    { id: "TASK005", name: "每周体成分复测", type: "体重", window: "每周日 08:00 — 12:00", points: 20, projects: ["减重营"], status: "草稿" }
  ],
  streakRewards: [
    { id: "R001", days: 3, name: "连续打卡 3 天", reward: "100 积分", stock: 120, claimed: 86, projects: ["减重营", "五好生活"], status: "启用" },
    { id: "R002", days: 7, name: "连续打卡 7 天", reward: "运动水杯", stock: 80, claimed: 42, projects: ["减重营"], status: "启用" },
    { id: "R003", days: 14, name: "连续打卡 14 天", reward: "营养组合包", stock: 40, claimed: 18, projects: ["减重营", "五好生活"], status: "启用" }
  ],
  rankings: [
    { rank: 1, name: "赵倩", project: "减重营", points: 1280, streak: 18 },
    { rank: 2, name: "林小满", project: "五好生活", points: 1160, streak: 15 },
    { rank: 3, name: "王嘉禾", project: "五好生活", points: 1080, streak: 13 },
    { rank: 4, name: "张晨", project: "减重营", points: 980, streak: 12 },
    { rank: 5, name: "陈思远", project: "五好生活", points: 920, streak: 10 }
  ]
});
