window.ADMIN_DATA = {
  institutions: [
    { id: "I001", name: "北京大学国际医院", short: "北大国际", region: "北京", city: "北京市", type: "综合医院", address: "昌平区中关村生命科学园生命园路1号", phone: "010-69007777", members: 726, departments: 70, projects: 2, manager: "李明", status: "启用" },
    { id: "I002", name: "北京北大医疗康复医院", short: "北大康复", region: "北京", city: "北京市", type: "康复医院", address: "昌平区中关村生命科学园生命园路8号", phone: "010-60849596", members: 168, departments: 18, projects: 1, manager: "赵宁", status: "启用" },
    { id: "I003", name: "方园中心", short: "方园", region: "北京", city: "北京市", type: "健康管理中心", address: "朝阳区方园西路", phone: "010-00000001", members: 32, departments: 6, projects: 0, manager: "陈静", status: "启用" },
    { id: "I004", name: "望京中心", short: "望京", region: "北京", city: "北京市", type: "健康管理中心", address: "朝阳区望京街", phone: "010-00000002", members: 28, departments: 5, projects: 1, manager: "王倩", status: "启用" },
    { id: "I005", name: "北三环中心", short: "北三环", region: "北京", city: "北京市", type: "健康管理中心", address: "海淀区北三环西路", phone: "010-00000003", members: 26, departments: 4, projects: 0, manager: "王倩", status: "启用" },
    { id: "I006", name: "金融街中心", short: "金融街", region: "北京", city: "北京市", type: "健康管理中心", address: "西城区金融大街", phone: "010-00000004", members: 30, departments: 5, projects: 1, manager: "王倩", status: "启用" },
    { id: "I007", name: "北大医疗海洋石油医院", short: "海洋石油", region: "天津", city: "天津市", type: "综合医院", address: "滨海新区渤海石油路", phone: "022-00000001", members: 210, departments: 24, projects: 0, manager: "刘洋", status: "启用" },
    { id: "I008", name: "北大医疗鲁中医院", short: "鲁中", region: "山东", city: "淄博市", type: "综合医院", address: "临淄区太公路", phone: "0533-0000001", members: 320, departments: 30, projects: 0, manager: "孙敏", status: "启用" },
    { id: "I009", name: "北大医疗淄博医院", short: "淄博", region: "山东", city: "淄博市", type: "综合医院", address: "淄川区淄矿路", phone: "0533-0000002", members: 280, departments: 26, projects: 0, manager: "孙敏", status: "启用" },
    { id: "I010", name: "北大医疗潞安医院", short: "潞安", region: "山西", city: "长治市", type: "综合医院", address: "襄垣县侯堡镇", phone: "0355-0000001", members: 260, departments: 22, projects: 0, manager: "高成", status: "启用" },
    { id: "I011", name: "北大医疗恺德心血管病医院", short: "恺德", region: "湖南", city: "株洲市", type: "专科医院", address: "天元区长江南路", phone: "0731-0000001", members: 120, departments: 12, projects: 0, manager: "周岚", status: "启用" },
    { id: "I012", name: "深圳北医康复医院", short: "深圳康复", region: "广东", city: "深圳市", type: "康复医院", address: "南山区学苑大道", phone: "0755-0000001", members: 140, departments: 14, projects: 0, manager: "林珊", status: "启用" }
  ],

  departments: [
    { id: "D001", name: "心血管内科", institutionId: "I001", category: "科室中心", leader: "聂绍平", doctors: 33, features: 4, intro: "集临床诊疗、学术研究、人才培养与学科建设于一体的现代化心脏疾病诊治中心。", featureList: ["心力衰竭与心血管重症监护病房", "复杂高危冠脉介入治疗", "复杂心律失常一站式诊疗", "心血管疾病高端体检"], team: ["聂绍平", "刘小慧", "陈晖", "康俊萍"] },
    { id: "D002", name: "肾内科", institutionId: "I001", category: "科室中心", leader: "丁嘉祥", doctors: 18, features: 3, intro: "在原发性与继发性肾小球疾病、血液透析、腹膜透析通路建立与长期维护领域造诣深厚。", featureList: ["慢性肾脏病一体化管理", "血液透析通路建立", "腹膜透析随访体系"], team: ["丁嘉祥", "于峰", "王亮"] },
    { id: "D003", name: "消化内科", institutionId: "I001", category: "科室中心", leader: "张伟", doctors: 21, features: 4, intro: "国家重点学科，覆盖病房、门诊及内镜中心，全面开展消化道疾病内镜诊断及微创治疗。", featureList: ["消化道早癌筛查", "ERCP 微创治疗", "炎症性肠病 MDT"], team: ["张伟", "李静", "周明"] },
    { id: "D004", name: "康复医学科", institutionId: "I002", category: "科室中心", leader: "刘洋", doctors: 26, features: 3, intro: "以运动康复、骨科康复和心肺康复为特色，提供全周期功能恢复服务。", featureList: ["骨科术后康复", "运动损伤康复", "心肺功能康复"], team: ["刘洋", "高远", "宋宁"] },
    { id: "D005", name: "健康管理中心", institutionId: "I003", category: "科室中心", leader: "王琳", doctors: 12, features: 3, intro: "面向企业客户提供健康评估、慢病风险筛查和个性化健康管理方案。", featureList: ["企业健康评估", "慢病风险筛查", "健康档案管理"], team: ["王琳", "赵倩", "许安"] },
    { id: "D006", name: "内分泌科", institutionId: "I001", category: "科室中心", leader: "陈晓", doctors: 16, features: 2, intro: "覆盖糖尿病、肥胖、甲状腺疾病等内分泌代谢疾病诊疗。", featureList: ["肥胖代谢门诊", "糖尿病全程管理"], team: ["陈晓", "罗雯"] },
    { id: "D007", name: "营养门诊", institutionId: "I001", category: "特色门诊", leader: "陈晓", doctors: 8, features: 2, intro: "提供医学营养评估、体重管理和慢病营养干预。", featureList: ["医学营养减重", "慢病膳食管理"], team: ["陈晓", "罗雯"] },
    { id: "D008", name: "运动康复中心", institutionId: "I002", category: "特色中心", leader: "刘洋", doctors: 15, features: 3, intro: "围绕运动功能评估、损伤预防和术后功能恢复提供一体化服务。", featureList: ["运动功能评估", "损伤康复", "体能训练"], team: ["刘洋", "高远"] },
    { id: "D009", name: "体重管理中心", institutionId: "I003", category: "特色中心", leader: "王琳", doctors: 10, features: 4, intro: "以多学科协作方式提供体重评估、营养、运动和健康管理服务。", featureList: ["多学科减重评估", "营养处方", "运动处方", "长期随访"], team: ["王琳", "陈晓", "刘洋"] },
    { id: "D010", name: "心血管康复中心", institutionId: "I012", category: "特色中心", leader: "高远", doctors: 12, features: 2, intro: "为心血管疾病患者提供运动康复、风险管理和生活方式干预。", featureList: ["心肺运动评估", "心血管康复训练"], team: ["高远", "宋宁"] }
  ],

  members: [
    { id: "M001", name: "聂绍平", gender: "男", photo: "./assets/team/9100.webp", institutionId: "I001", dept: "心血管内科", role: "医师", title: "教授、主任医师", qualification: "心血管病学 · 复杂冠脉介入", projects: ["P001"], phone: "138****1021", intro: "长期从事冠心病精准诊疗及复杂高危冠脉介入治疗，推动心脑联合 MDT 与心血管急危重症体系建设。", specialty: "冠心病精准诊疗、复杂高危冠脉介入治疗" },
    { id: "M002", name: "丁嘉祥", gender: "男", photo: "./assets/team/1180.webp", institutionId: "I001", dept: "肾内科", role: "医师", title: "主任医师", qualification: "肾脏病学 · 血液净化", projects: ["P001", "P002"], phone: "138****1022", intro: "北京大学医学部肾脏内科博士，长期从事肾内科临床工作，擅长原发和继发性肾小球疾病诊治。", specialty: "肾小球疾病、血液透析、腹膜透析通路建立" },
    { id: "M003", name: "陈晖", gender: "男", photo: "./assets/team/96994.webp", institutionId: "I001", dept: "心血管内科", role: "医师", title: "教授、主任医师", qualification: "心血管病学 · 结构心脏病", projects: ["P001"], phone: "138****1023", intro: "擅长复杂冠心病、瓣膜性心脏病及先天性心脏病等心血管疾病的介入治疗。", specialty: "复杂冠心病、瓣膜病、先心病介入" },
    { id: "M004", name: "刘小慧", gender: "女", photo: "./assets/team/1025.webp", institutionId: "I001", dept: "心血管内科", role: "医师", title: "主任医师", qualification: "心血管病学 · 心力衰竭", projects: ["P001"], phone: "138****1024", intro: "心内科主任，专注心力衰竭、高血压和心血管慢病管理。", specialty: "高血压、心力衰竭、心血管慢病管理" },
    { id: "M005", name: "张伟", gender: "男", photo: "", institutionId: "I001", dept: "健康管理中心", role: "运营督导", title: "项目督导", qualification: "医院管理 · 项目督导", projects: ["P001", "P002", "P003"], phone: "138****1025", intro: "负责跨营期运营督导与质量把控，跟进各营期服务流程、人员协同和客户反馈。", specialty: "项目运营督导、质量管理" },
    { id: "M006", name: "孙敏", gender: "女", photo: "", institutionId: "I001", dept: "健康管理中心", role: "运营管家", title: "营期运营负责人", qualification: "健康管理师 · 营期运营", projects: ["P001"], phone: "138****1026", intro: "负责营期计划制定、服务团队协同和客户沟通，跟进营期进度与服务体验。", specialty: "营期运营、客户服务" },
    { id: "M007", name: "王琳", gender: "女", photo: "./assets/team/1180.webp", institutionId: "I003", dept: "健康管理中心", role: "健管师", title: "健康管理师", qualification: "健康管理 · 慢病管理", projects: ["P001", "P002"], phone: "138****1027", intro: "负责客户健康评估、健康档案建立和营期健康计划执行，跟踪健康指标变化。", specialty: "健康评估、慢病随访" },
    { id: "M008", name: "陈晓", gender: "女", photo: "", institutionId: "I001", dept: "营养门诊", role: "营养师", title: "注册营养师", qualification: "临床营养 · 体重管理", projects: ["P001", "P002"], phone: "138****1028", intro: "负责营期营养评估、膳食方案制定和营养咨询，提供个体化饮食建议。", specialty: "临床营养、体重管理" },
    { id: "M009", name: "刘洋", gender: "男", photo: "", institutionId: "I002", dept: "运动康复中心", role: "康复师", title: "康复治疗师", qualification: "运动康复 · 骨科康复", projects: ["P001"], phone: "138****1029", intro: "负责运动功能评估、康复训练计划和营期运动康复指导。", specialty: "运动康复、骨科康复" },
    { id: "M010", name: "王倩", gender: "女", photo: "", institutionId: "I006", dept: "健康管理中心", role: "运营管理", title: "项目运营经理", qualification: "健康管理 · 项目运营", projects: ["P001", "P002", "P003"], phone: "138****1030", intro: "负责企康项目运营管理、营期排期、服务团队协调和项目数据复盘。", specialty: "项目运营管理" },
    { id: "M011", name: "赵敏", gender: "女", photo: "", institutionId: "I001", dept: "营养门诊", role: "营养师", title: "注册营养师", qualification: "临床营养 · 膳食管理", projects: ["P001"], phone: "138****1031", intro: "负责营期膳食管理、营养宣教和体重管理随访。", specialty: "膳食管理、营养宣教" },
    { id: "M012", name: "周明", gender: "男", photo: "", institutionId: "I001", dept: "内分泌科", role: "医师", title: "主治医师", qualification: "内分泌代谢 · 肥胖症", projects: ["P001"], phone: "138****1032", intro: "负责营期医学评估、肥胖相关代谢疾病诊疗和健康风险把控。", specialty: "肥胖症、内分泌代谢疾病" },
    { id: "M013", name: "康俊萍", gender: "女", photo: "", institutionId: "I001", dept: "心血管内科", role: "医师", title: "副主任医师", qualification: "心血管病学 · 心脏康复", projects: ["P001"], phone: "138****1033", intro: "从事心血管内科临床工作，关注冠心病、高血压及心脏康复管理。", specialty: "冠心病、高血压、心脏康复" }
  ],

  projects: [
    { id: "P001", name: "中石油华北员工减重健康营", enterprise: "中石油华北分公司", institutionId: "I001", status: "进行中", start: "2026-09-01", end: "2026-11-30", enrolled: 120, target: 120, completion: 78.6, manager: "李明", campId: "C001", weightLoss: 4.8, checkinUsers: 108 },
    { id: "P002", name: "金融街企业减重健康营", enterprise: "金融街控股", institutionId: "I006", status: "进行中", start: "2026-09-15", end: "2026-12-15", enrolled: 45, target: 50, completion: 82.2, manager: "王倩", campId: "C002", weightLoss: 4.1, checkinUsers: 40 },
    { id: "P003", name: "望京科技园减重健康营", enterprise: "望京科技园", institutionId: "I004", status: "报名中", start: "2026-11-20", end: "2027-02-20", enrolled: 36, target: 60, completion: 0, manager: "王倩", campId: "C003", weightLoss: 0, checkinUsers: 0 },
    { id: "P004", name: "康复医院员工减重营", enterprise: "北京北大医疗康复医院", institutionId: "I002", status: "已结营", start: "2026-05-01", end: "2026-08-01", enrolled: 32, target: 32, completion: 86.4, manager: "赵宁", campId: "C004", weightLoss: 5.3, checkinUsers: 29 }
  ],

  camps: [
    { id: "C001", projectId: "P001", name: "中石油华北员工减重营", start: "2026-09-01", end: "2026-11-30", capacity: 120, status: "进行中", manager: "孙敏", team: ["M005", "M010", "M006", "M012", "M007", "M008", "M009"] },
    { id: "C002", projectId: "P002", name: "金融街企业减重营", start: "2026-09-15", end: "2026-12-15", capacity: 50, status: "进行中", manager: "王倩", team: ["M005", "M010", "M001", "M007", "M008"] },
    { id: "C003", projectId: "P003", name: "望京科技园减重营", start: "2026-11-20", end: "2027-02-20", capacity: 60, status: "报名中", manager: "王倩", team: ["M005", "M010", "M012", "M007", "M008"] },
    { id: "C004", projectId: "P004", name: "康复医院员工减重营", start: "2026-05-01", end: "2026-08-01", capacity: 32, status: "已结营", manager: "赵宁", team: ["M005", "M009", "M007", "M008"] }
  ],

  students: [
    { id: "S001", name: "张晨", gender: "男", phone: "138****2210", projectId: "P001", campId: "C001", sourceDoctor: "聂绍平", status: "在营", completion: 92, weight: "76.8", startWeight: "82.4", weightChange: "-5.6", bodyFat: "24.8", startBodyFat: "28.6", lastCheckin: "2026-10-21 08:12", risk: "低", age: 38, height: 176, target: "74.0", team: "王琳 / 陈晓", tags: ["高血脂", "久坐"] },
    { id: "S002", name: "李雪", gender: "女", phone: "139****3301", projectId: "P001", campId: "C001", sourceDoctor: "丁嘉祥", status: "在营", completion: 86, weight: "63.2", startWeight: "67.5", weightChange: "-4.3", bodyFat: "27.1", startBodyFat: "31.4", lastCheckin: "2026-10-21 07:48", risk: "低", age: 34, height: 163, target: "60.0", team: "王琳 / 赵敏", tags: ["产后体重管理"] },
    { id: "S003", name: "王凯", gender: "男", phone: "137****4402", projectId: "P001", campId: "C001", sourceDoctor: "陈晖", status: "在营", completion: 64, weight: "91.5", startWeight: "94.2", weightChange: "-2.7", bodyFat: "31.8", startBodyFat: "33.2", lastCheckin: "2026-10-20 21:06", risk: "中", age: 42, height: 178, target: "86.0", team: "王琳 / 陈晓", tags: ["高血压", "应酬多"] },
    { id: "S004", name: "赵倩", gender: "女", phone: "136****5503", projectId: "P001", campId: "C001", sourceDoctor: "刘小慧", status: "在营", completion: 100, weight: "58.6", startWeight: "62.0", weightChange: "-3.4", bodyFat: "22.4", startBodyFat: "26.8", lastCheckin: "2026-10-21 08:35", risk: "低", age: 31, height: 165, target: "57.0", team: "王琳 / 赵敏", tags: ["规律运动"] },
    { id: "S005", name: "陈浩", gender: "男", phone: "135****6604", projectId: "P001", campId: "C001", sourceDoctor: "周明", status: "在营", completion: 41, weight: "98.2", startWeight: "99.0", weightChange: "-0.8", bodyFat: "35.6", startBodyFat: "36.0", lastCheckin: "2026-10-18 19:22", risk: "高", age: 45, height: 175, target: "88.0", team: "王琳 / 陈晓", tags: ["血糖偏高", "连续未打卡"] },
    { id: "S006", name: "周婷", gender: "女", phone: "134****7705", projectId: "P002", campId: "C002", sourceDoctor: "丁嘉祥", status: "在营", completion: 88, weight: "61.8", startWeight: "65.2", weightChange: "-3.4", bodyFat: "26.2", startBodyFat: "29.1", lastCheckin: "2026-10-21 07:50", risk: "低", age: 36, height: 162, target: "60.0", team: "王琳 / 赵敏", tags: ["轻断食"] },
    { id: "S007", name: "刘洋", gender: "男", phone: "133****8806", projectId: "P002", campId: "C002", sourceDoctor: "聂绍平", status: "在营", completion: 72, weight: "84.1", startWeight: "87.6", weightChange: "-3.5", bodyFat: "28.0", startBodyFat: "30.2", lastCheckin: "2026-10-20 18:11", risk: "中", age: 40, height: 177, target: "80.0", team: "王琳 / 陈晓", tags: ["脂肪肝"] },
    { id: "S008", name: "孙悦", gender: "女", phone: "132****9907", projectId: "P002", campId: "C002", sourceDoctor: "刘小慧", status: "已完成", completion: 95, weight: "56.9", startWeight: "61.1", weightChange: "-4.2", bodyFat: "23.8", startBodyFat: "28.2", lastCheckin: "2026-10-19 20:03", risk: "低", age: 29, height: 160, target: "56.0", team: "王琳 / 赵敏", tags: ["已结营"] },
    { id: "S009", name: "何佳", gender: "女", phone: "131****1108", projectId: "P001", campId: "C001", sourceDoctor: "陈晖", status: "在营", completion: 57, weight: "70.4", startWeight: "72.0", weightChange: "-1.6", bodyFat: "30.2", startBodyFat: "31.5", lastCheckin: "2026-10-19 12:40", risk: "中", age: 33, height: 166, target: "65.0", team: "王琳 / 陈晓", tags: ["饮食不规律"] },
    { id: "S010", name: "高远", gender: "男", phone: "130****2209", projectId: "P003", campId: "C003", sourceDoctor: "周明", status: "待入营", completion: 0, weight: "86.0", startWeight: "86.0", weightChange: "0", bodyFat: "27.9", startBodyFat: "27.9", lastCheckin: "—", risk: "低", age: 37, height: 180, target: "80.0", team: "待分配", tags: ["新入营"] }
  ],

  checkins: [
    { id: "K001", studentId: "S001", date: "2026-10-21", time: "08:12", weight: 76.8, meals: 3, snacks: 1, exercise: 45, exerciseType: "快走 + 拉伸", complete: true, healthComment: "有氧完成度好，建议下周增加一次下肢力量训练。", healthScore: 8.5, nutritionComment: "早餐蛋白质充足，晚餐主食略多，可减少半份。", nutritionScore: 8.0 },
    { id: "K002", studentId: "S001", date: "2026-10-20", time: "07:58", weight: 77.0, meals: 3, snacks: 1, exercise: 38, exerciseType: "慢跑", complete: true, healthComment: "配速稳定，注意跑后补水。", healthScore: 8.0, nutritionComment: "三餐结构均衡，加餐选择无糖酸奶较好。", nutritionScore: 8.5 },
    { id: "K003", studentId: "S001", date: "2026-10-19", time: "08:30", weight: 77.2, meals: 3, snacks: 2, exercise: 30, exerciseType: "骑行", complete: true, healthComment: "运动时长略短，建议增加到 40 分钟。", healthScore: 7.5, nutritionComment: "午餐油脂偏高，建议清蒸替代红烧。", nutritionScore: 7.0 },
    { id: "K004", studentId: "S001", date: "2026-10-18", time: "08:06", weight: 77.4, meals: 3, snacks: 0, exercise: 50, exerciseType: "力量训练", complete: true, healthComment: "力量训练动作标准，注意训练后拉伸。", healthScore: 9.0, nutritionComment: "训练日蛋白质补充及时。", nutritionScore: 8.5 },
    { id: "K005", studentId: "S003", date: "2026-10-20", time: "21:06", weight: 91.5, meals: 2, snacks: 1, exercise: 20, exerciseType: "散步", complete: false, healthComment: "运动时长不足，建议从每天 30 分钟快走开始。", healthScore: 6.0, nutritionComment: "晚餐缺失，建议规律三餐。", nutritionScore: 5.5 },
    { id: "K006", studentId: "S003", date: "2026-10-19", time: "20:41", weight: 91.8, meals: 3, snacks: 2, exercise: 25, exerciseType: "快走", complete: true, healthComment: "完成基础运动，注意保持。", healthScore: 7.0, nutritionComment: "加餐频次偏高，建议固定加餐时间。", nutritionScore: 6.5 },
    { id: "K007", studentId: "S004", date: "2026-10-21", time: "08:35", weight: 58.6, meals: 3, snacks: 1, exercise: 60, exerciseType: "普拉提", complete: true, healthComment: "核心训练完成优秀。", healthScore: 9.5, nutritionComment: "三餐记录完整，蔬菜摄入充足。", nutritionScore: 9.0 },
    { id: "K008", studentId: "S005", date: "2026-10-18", time: "19:22", weight: 98.2, meals: 2, snacks: 1, exercise: 15, exerciseType: "散步", complete: false, healthComment: "连续 3 天未完整打卡，建议健管师电话跟进。", healthScore: 5.0, nutritionComment: "晚餐未记录，建议补充饮食记录。", nutritionScore: 5.0 },
    { id: "K009", studentId: "S002", date: "2026-10-21", time: "07:48", weight: 63.2, meals: 3, snacks: 1, exercise: 40, exerciseType: "瑜伽", complete: true, healthComment: "柔韧性训练良好。", healthScore: 8.5, nutritionComment: "早餐搭配合理，午餐注意少油。", nutritionScore: 8.0 },
    { id: "K010", studentId: "S007", date: "2026-10-20", time: "18:11", weight: 84.1, meals: 3, snacks: 1, exercise: 32, exerciseType: "游泳", complete: true, healthComment: "游泳对关节友好，适合当前体重。", healthScore: 8.0, nutritionComment: "运动后补充蛋白质合理。", nutritionScore: 8.0 }
  ],

  indicators: [
    { id: "B01", category: "体成分", name: "体重", unit: "kg", reference: "根据身高与目标设定", inputRole: "营养师", status: "启用" },
    { id: "B02", category: "体成分", name: "体脂率", unit: "%", reference: "男 15–20，女 20–28", inputRole: "营养师", status: "启用" },
    { id: "B03", category: "体成分", name: "内脏脂肪等级", unit: "级", reference: "1–9", inputRole: "营养师", status: "启用" },
    { id: "B04", category: "体成分", name: "肌肉量", unit: "kg", reference: "根据身高与性别评估", inputRole: "营养师", status: "启用" },
    { id: "G01", category: "血糖相关", name: "空腹血糖", unit: "mmol/L", reference: "3.9 – 6.1", inputRole: "营养师", status: "启用" },
    { id: "L01", category: "血脂相关", name: "总胆固醇", unit: "mmol/L", reference: "< 5.2", inputRole: "营养师", status: "启用" },
    { id: "L02", category: "血脂相关", name: "甘油三酯", unit: "mmol/L", reference: "< 1.7", inputRole: "营养师", status: "启用" },
    { id: "L03", category: "血脂相关", name: "高密度脂蛋白胆固醇", unit: "mmol/L", reference: "> 1.04", inputRole: "营养师", status: "启用" },
    { id: "L04", category: "血脂相关", name: "低密度脂蛋白胆固醇", unit: "mmol/L", reference: "< 3.4", inputRole: "营养师", status: "启用" },
    { id: "F01", category: "肝功能相关", name: "丙氨酸氨基转移酶", unit: "U/L", reference: "0 – 40", inputRole: "营养师", status: "启用" },
    { id: "F02", category: "肝功能相关", name: "天门冬氨酸氨基转移酶", unit: "U/L", reference: "0 – 40", inputRole: "营养师", status: "启用" },
    { id: "F03", category: "肝功能相关", name: "总蛋白", unit: "g/L", reference: "60 – 80", inputRole: "营养师", status: "启用" },
    { id: "F04", category: "肝功能相关", name: "白蛋白", unit: "g/L", reference: "35 – 55", inputRole: "营养师", status: "启用" },
    { id: "F05", category: "肝功能相关", name: "前白蛋白", unit: "mg/L", reference: "200 – 400", inputRole: "营养师", status: "启用" },
    { id: "F06", category: "肝功能相关", name: "总胆红素", unit: "μmol/L", reference: "3.4 – 17.1", inputRole: "营养师", status: "启用" },
    { id: "F07", category: "肝功能相关", name: "直接胆红素", unit: "μmol/L", reference: "0 – 6.8", inputRole: "营养师", status: "启用" },
    { id: "F08", category: "肝功能相关", name: "碱性磷酸酶", unit: "U/L", reference: "45 – 125（成人）", inputRole: "营养师", status: "启用" },
    { id: "F09", category: "肝功能相关", name: "γ-谷氨酰基转移酶", unit: "U/L", reference: "10 – 60", inputRole: "营养师", status: "启用" },
    { id: "R01", category: "肾功能相关", name: "尿素氮", unit: "mmol/L", reference: "2.9 – 8.2", inputRole: "营养师", status: "启用" },
    { id: "R02", category: "肾功能相关", name: "肌酐", unit: "μmol/L", reference: "男 44 – 104；女 44 – 97", inputRole: "营养师", status: "启用" },
    { id: "R03", category: "肾功能相关", name: "尿酸", unit: "μmol/L", reference: "男 < 420；女 < 360", inputRole: "营养师", status: "启用" }
  ],

  bodyValues: {
    S001: [
      { name: "体重", category: "体成分", unit: "kg", pre: "82.4", post: "76.8", reference: "目标 74.0", status: "改善" },
      { name: "体脂率", category: "体成分", unit: "%", pre: "28.6", post: "24.8", reference: "15–20", status: "改善" },
      { name: "内脏脂肪等级", category: "体成分", unit: "级", pre: "12", post: "9", reference: "1–9", status: "改善" },
      { name: "肌肉量", category: "体成分", unit: "kg", pre: "52.1", post: "51.8", reference: "维持", status: "稳定" },
      { name: "空腹血糖", category: "血糖相关", unit: "mmol/L", pre: "5.8", post: "5.2", reference: "3.9–6.1", status: "正常" },
      { name: "总胆固醇", category: "血脂相关", unit: "mmol/L", pre: "5.6", post: "4.8", reference: "< 5.2", status: "改善" },
      { name: "甘油三酯", category: "血脂相关", unit: "mmol/L", pre: "2.1", post: "1.5", reference: "< 1.7", status: "改善" },
      { name: "尿酸", category: "肾功能相关", unit: "μmol/L", pre: "430", post: "380", reference: "男 < 420", status: "改善" }
    ]
  },

  accounts: [
    { id: "A001", name: "李明", phone: "138****0001", role: "运营督导", scope: "全部企康项目", projects: ["P001", "P002", "P003", "P004"], status: "启用", lastLogin: "2026-10-21 08:42" },
    { id: "A002", name: "王倩", phone: "138****0002", role: "运营管理", scope: "负责项目", projects: ["P001", "P002", "P003"], status: "启用", lastLogin: "2026-10-21 08:15" },
    { id: "A003", name: "陈静", phone: "138****0003", role: "健管师", scope: "负责营期", projects: ["P001"], status: "启用", lastLogin: "2026-10-20 19:30" },
    { id: "A004", name: "赵敏", phone: "138****0004", role: "营养师", scope: "负责营期", projects: ["P001"], status: "启用", lastLogin: "2026-10-21 07:55" },
    { id: "A005", name: "周明", phone: "138****0005", role: "医师", scope: "负责营期", projects: ["P001"], status: "启用", lastLogin: "2026-10-20 16:20" },
    { id: "A006", name: "刘洋", phone: "138****0006", role: "康复师", scope: "负责营期", projects: ["P001"], status: "启用", lastLogin: "2026-10-19 18:10" },
    { id: "A007", name: "系统管理员", phone: "138****0000", role: "超级管理员", scope: "全部数据", projects: [], status: "启用", lastLogin: "2026-10-21 09:01" }
  ],

  roles: [
    { key: "super", name: "超级管理员", scope: "全部数据", color: "navy", desc: "管理账号、角色、机构、项目与全部健康数据。", permissions: ["账号管理", "角色权限", "全部机构", "全部项目", "数据导出", "指标维护"] },
    { key: "supervisor", name: "运营督导", scope: "全部企康项目", color: "blue", desc: "跨项目查看运营与健康数据，负责质量督导。", permissions: ["全部项目数据", "服务团队查看", "学员数据查看", "报表导出"] },
    { key: "operation", name: "运营管理", scope: "负责项目", color: "cyan", desc: "负责所分配项目的营期、团队、学员与运营数据。", permissions: ["项目维护", "服务团队", "学员分配", "项目报表"] },
    { key: "doctor", name: "医师", scope: "负责营期", color: "indigo", desc: "查看负责营期学员，录入医学评估与健康建议。", permissions: ["学员档案", "体成分指标维护", "医学建议"] },
    { key: "health", name: "健管师", scope: "负责营期", color: "green", desc: "负责学员健康管理、运动打卡批注与随访。", permissions: ["学员档案", "运动打卡批注", "评分", "随访记录"] },
    { key: "nutrition", name: "营养师", scope: "负责营期", color: "gold", desc: "负责营养评估、体重与饮食打卡批注、营前营后指标录入。", permissions: ["学员档案", "体重/饮食批注", "营前营后指标", "评分"] },
    { key: "rehab", name: "康复师", scope: "负责营期", color: "slate", desc: "查看运动风险与康复建议，参与运动方案。", permissions: ["学员档案", "运动风险查看", "康复建议"] }
  ],

  checkinBoards: {
    C001: {
      total: 120,
      today: { date: "10-21", checked: 108, completed: 94, rate: 78.3 },
      yesterday: { date: "10-20", checked: 105, completed: 90, rate: 75.0 },
      trend: [66, 68, 67, 70, 72, 71, 74, 75, 73, 76, 77, 75, 78.3, 78.3]
    },
    C002: {
      total: 45,
      today: { date: "10-21", checked: 40, completed: 37, rate: 82.2 },
      yesterday: { date: "10-20", checked: 39, completed: 35, rate: 77.8 },
      trend: [70, 71, 73, 72, 75, 76, 74, 77, 78, 76, 79, 80, 82.2, 82.2]
    },
    C003: {
      total: 36,
      today: { date: "10-21", checked: 0, completed: 0, rate: 0 },
      yesterday: { date: "10-20", checked: 0, completed: 0, rate: 0 },
      trend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    C004: {
      total: 32,
      today: { date: "10-21", checked: 0, completed: 0, rate: 0 },
      yesterday: { date: "10-20", checked: 0, completed: 0, rate: 0 },
      trend: [80, 81, 79, 82, 83, 84, 82, 85, 86, 84, 86, 86.4, 86.4, 86.4]
    }
  },

  chart: {
    labels: ["10-08", "10-09", "10-10", "10-11", "10-12", "10-13", "10-14", "10-15", "10-16", "10-17", "10-18", "10-19", "10-20", "10-21"],
    completion: [72, 74, 71, 76, 78, 75, 79, 80, 77, 81, 83, 80, 82, 78.6],
    checkinUsers: [82, 86, 80, 89, 92, 88, 94, 96, 91, 98, 101, 96, 99, 94]
  }
};
