// 由 scripts/build-data.mjs 自动生成，请勿手动编辑
// 数据源: DST 游戏本体脚本（.cache\game\scripts）
// 生成时间: 2026-10-28

/** 食物值标签（数值为该物品提供的对应"度数"） */
export type FoodTag =
  | "meat" // 肉度
  | "fish" // 鱼度
  | "egg" // 蛋度
  | "fruit" // 水果度
  | "veggie" // 蔬菜度
  | "dairy" // 乳制品度
  | "sweetener" // 甜味剂度
  | "fat" // 油脂度
  | "monster" // 怪物度
  | "inedible" // 不可食用度（填充）
  | "magic" // 魔法度
  | "seed" // 种子度
  | "decoration" // 装饰度
  | "frozen" // 冰度
  | "precook" // 预处理度（下锅前已烤熟）
  | "dried"; // 干货度（下锅前已晒干）

export type FoodValues = Partial<Record<FoodTag, number>>;

export type IngredientCategory =
  | "meat"
  | "fish"
  | "egg"
  | "fruit"
  | "veggie"
  | "dairy"
  | "sweetener"
  | "fat"
  | "magic"
  | "seed"
  | "decoration"
  | "frozen"
  | "inedible";

export interface Ingredient {
  /** 游戏 prefab id（即放入锅中时的名字） */
  id: string;
  /** 中文名（官方简体汉化） */
  name: string;
  /** 英文名 */
  nameEn: string;
  /** 归类（按主要食物值标签判定） */
  category: IngredientCategory;
  /** 食物值 */
  values: FoodValues;
}

export const INGREDIENTS: Ingredient[] = [
  {
    "id": "pomegranate",
    "name": "石榴",
    "nameEn": "Pomegranate",
    "category": "fruit",
    "values": {
      "fruit": 1
    }
  },
  {
    "id": "pomegranate_cooked",
    "name": "切片熟石榴",
    "nameEn": "Sliced Pomegranate",
    "category": "fruit",
    "values": {
      "fruit": 1,
      "precook": 1
    }
  },
  {
    "id": "dragonfruit",
    "name": "火龙果",
    "nameEn": "Dragon Fruit",
    "category": "fruit",
    "values": {
      "fruit": 1
    }
  },
  {
    "id": "dragonfruit_cooked",
    "name": "熟火龙果",
    "nameEn": "Prepared Dragon Fruit",
    "category": "fruit",
    "values": {
      "fruit": 1,
      "precook": 1
    }
  },
  {
    "id": "cave_banana",
    "name": "香蕉",
    "nameEn": "Banana",
    "category": "fruit",
    "values": {
      "fruit": 1
    }
  },
  {
    "id": "cave_banana_cooked",
    "name": "熟香蕉",
    "nameEn": "Cooked Banana",
    "category": "fruit",
    "values": {
      "fruit": 1,
      "precook": 1
    }
  },
  {
    "id": "wormlight",
    "name": "发光浆果",
    "nameEn": "Glow Berry",
    "category": "fruit",
    "values": {
      "fruit": 1
    }
  },
  {
    "id": "wormlight_lesser",
    "name": "小发光浆果",
    "nameEn": "Lesser Glow Berry",
    "category": "fruit",
    "values": {
      "fruit": 0.5
    }
  },
  {
    "id": "berries",
    "name": "浆果",
    "nameEn": "Berries",
    "category": "fruit",
    "values": {
      "fruit": 0.5
    }
  },
  {
    "id": "berries_cooked",
    "name": "烤浆果",
    "nameEn": "Roasted Berries",
    "category": "fruit",
    "values": {
      "fruit": 0.5,
      "precook": 1
    }
  },
  {
    "id": "berries_juicy",
    "name": "多汁浆果",
    "nameEn": "Juicy Berries",
    "category": "fruit",
    "values": {
      "fruit": 0.5
    }
  },
  {
    "id": "berries_juicy_cooked",
    "name": "烤多汁浆果",
    "nameEn": "Roasted Juicy Berries",
    "category": "fruit",
    "values": {
      "fruit": 0.5,
      "precook": 1
    }
  },
  {
    "id": "fig",
    "name": "无花果",
    "nameEn": "Fig",
    "category": "fruit",
    "values": {
      "fruit": 0.5
    }
  },
  {
    "id": "fig_cooked",
    "name": "熟无花果",
    "nameEn": "Cooked Fig",
    "category": "fruit",
    "values": {
      "fruit": 0.5,
      "precook": 1
    }
  },
  {
    "id": "durian",
    "name": "榴莲",
    "nameEn": "Durian",
    "category": "fruit",
    "values": {
      "fruit": 1,
      "monster": 1
    }
  },
  {
    "id": "durian_cooked",
    "name": "超臭榴莲",
    "nameEn": "Extra Smelly Durian",
    "category": "fruit",
    "values": {
      "fruit": 1,
      "monster": 1,
      "precook": 1
    }
  },
  {
    "id": "honey",
    "name": "蜂蜜",
    "nameEn": "Honey",
    "category": "sweetener",
    "values": {
      "sweetener": 1
    }
  },
  {
    "id": "honeycomb",
    "name": "蜜脾",
    "nameEn": "Honeycomb",
    "category": "sweetener",
    "values": {
      "sweetener": 1
    }
  },
  {
    "id": "royal_jelly",
    "name": "蜂王浆",
    "nameEn": "Royal Jelly",
    "category": "sweetener",
    "values": {
      "sweetener": 3
    }
  },
  {
    "id": "carrot",
    "name": "胡萝卜",
    "nameEn": "Carrot",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "carrot_cooked",
    "name": "烤胡萝卜",
    "nameEn": "Roasted Carrot",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 1
    }
  },
  {
    "id": "corn",
    "name": "玉米",
    "nameEn": "Corn",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "corn_cooked",
    "name": "爆米花",
    "nameEn": "Popcorn",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 1
    }
  },
  {
    "id": "pumpkin",
    "name": "南瓜",
    "nameEn": "Pumpkin",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "pumpkin_cooked",
    "name": "烤南瓜",
    "nameEn": "Hot Pumpkin",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 1
    }
  },
  {
    "id": "eggplant",
    "name": "茄子",
    "nameEn": "Eggplant",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "eggplant_cooked",
    "name": "烤茄子",
    "nameEn": "Braised Eggplant",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 1
    }
  },
  {
    "id": "cutlichen",
    "name": "苔藓",
    "nameEn": "Lichen",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "asparagus",
    "name": "芦笋",
    "nameEn": "Asparagus",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "asparagus_cooked",
    "name": "烤芦笋",
    "nameEn": "Roasted Asparagus",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 1
    }
  },
  {
    "id": "onion",
    "name": "洋葱",
    "nameEn": "Onion",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "onion_cooked",
    "name": "烤洋葱",
    "nameEn": "Roasted Onion",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 1
    }
  },
  {
    "id": "garlic",
    "name": "大蒜",
    "nameEn": "Garlic",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "garlic_cooked",
    "name": "烤大蒜",
    "nameEn": "Roasted Garlic",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 1
    }
  },
  {
    "id": "tomato",
    "name": "番茄",
    "nameEn": "Toma Root",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "tomato_cooked",
    "name": "烤番茄",
    "nameEn": "Roasted Toma Root",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 1
    }
  },
  {
    "id": "potato",
    "name": "土豆",
    "nameEn": "Potato",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "potato_cooked",
    "name": "烤土豆",
    "nameEn": "Roasted Potato",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 1
    }
  },
  {
    "id": "pepper",
    "name": "辣椒",
    "nameEn": "Pepper",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "pepper_cooked",
    "name": "烤辣椒",
    "nameEn": "Roasted Pepper",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 1
    }
  },
  {
    "id": "red_cap",
    "name": "采摘的红蘑菇",
    "nameEn": "Red Cap",
    "category": "veggie",
    "values": {
      "veggie": 0.5
    }
  },
  {
    "id": "red_cap_cooked",
    "name": "熟红蘑菇",
    "nameEn": "Cooked Red Cap",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 0.5
    }
  },
  {
    "id": "green_cap",
    "name": "采摘的绿蘑菇",
    "nameEn": "Green Cap",
    "category": "veggie",
    "values": {
      "veggie": 0.5
    }
  },
  {
    "id": "green_cap_cooked",
    "name": "熟绿蘑菇",
    "nameEn": "Cooked Green Cap",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 0.5
    }
  },
  {
    "id": "blue_cap",
    "name": "采摘的蓝蘑菇",
    "nameEn": "Blue Cap",
    "category": "veggie",
    "values": {
      "veggie": 0.5
    }
  },
  {
    "id": "blue_cap_cooked",
    "name": "熟蓝蘑菇",
    "nameEn": "Cooked Blue Cap",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 0.5
    }
  },
  {
    "id": "moon_cap",
    "name": "月亮蘑菇",
    "nameEn": "Moon Shroom",
    "category": "veggie",
    "values": {
      "veggie": 0.5
    }
  },
  {
    "id": "moon_cap_cooked",
    "name": "熟月亮蘑菇",
    "nameEn": "Cooked Moon Shroom",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 0.5
    }
  },
  {
    "id": "meat",
    "name": "肉",
    "nameEn": "Meat",
    "category": "meat",
    "values": {
      "meat": 1
    }
  },
  {
    "id": "cookedmeat",
    "name": "熟肉",
    "nameEn": "Cooked Meat",
    "category": "meat",
    "values": {
      "meat": 1,
      "precook": 1
    }
  },
  {
    "id": "meat_dried",
    "name": "肉干",
    "nameEn": "Jerky",
    "category": "meat",
    "values": {
      "dried": 1,
      "meat": 1
    }
  },
  {
    "id": "monstermeat",
    "name": "怪物肉",
    "nameEn": "Monster Meat",
    "category": "meat",
    "values": {
      "meat": 1,
      "monster": 1
    }
  },
  {
    "id": "cookedmonstermeat",
    "name": "熟怪物肉",
    "nameEn": "Cooked Monster Meat",
    "category": "meat",
    "values": {
      "meat": 1,
      "monster": 1,
      "precook": 1
    }
  },
  {
    "id": "monstermeat_dried",
    "name": "怪物肉干",
    "nameEn": "Monster Jerky",
    "category": "meat",
    "values": {
      "dried": 1,
      "meat": 1,
      "monster": 1
    }
  },
  {
    "id": "froglegs",
    "name": "蛙腿",
    "nameEn": "Frog Legs",
    "category": "meat",
    "values": {
      "meat": 0.5
    }
  },
  {
    "id": "froglegs_cooked",
    "name": "熟蛙腿",
    "nameEn": "Cooked Frog Legs",
    "category": "meat",
    "values": {
      "meat": 0.5,
      "precook": 1
    }
  },
  {
    "id": "drumstick",
    "name": "鸟腿",
    "nameEn": "Drumstick",
    "category": "meat",
    "values": {
      "meat": 0.5
    }
  },
  {
    "id": "drumstick_cooked",
    "name": "炸鸟腿",
    "nameEn": "Fried Drumstick",
    "category": "meat",
    "values": {
      "meat": 0.5,
      "precook": 1
    }
  },
  {
    "id": "batwing",
    "name": "洞穴蝙蝠翅膀",
    "nameEn": "Batilisk Wing",
    "category": "meat",
    "values": {
      "meat": 0.5
    }
  },
  {
    "id": "batwing_cooked",
    "name": "熟蝙蝠翅膀",
    "nameEn": "Cooked Batilisk Wing",
    "category": "meat",
    "values": {
      "meat": 0.5,
      "precook": 1
    }
  },
  {
    "id": "smallmeat",
    "name": "小肉",
    "nameEn": "Morsel",
    "category": "meat",
    "values": {
      "meat": 0.5
    }
  },
  {
    "id": "cookedsmallmeat",
    "name": "熟小肉",
    "nameEn": "Cooked Morsel",
    "category": "meat",
    "values": {
      "meat": 0.5,
      "precook": 1
    }
  },
  {
    "id": "smallmeat_dried",
    "name": "小肉干",
    "nameEn": "Small Jerky",
    "category": "meat",
    "values": {
      "dried": 1,
      "meat": 0.5
    }
  },
  {
    "id": "batnose",
    "name": "裸露鼻孔",
    "nameEn": "Naked Nostrils",
    "category": "meat",
    "values": {
      "meat": 0.5
    }
  },
  {
    "id": "batnose_cooked",
    "name": "炭烤鼻孔",
    "nameEn": "Charred Nostrils",
    "category": "meat",
    "values": {
      "meat": 0.5,
      "precook": 1
    }
  },
  {
    "id": "eel",
    "name": "鳗鱼",
    "nameEn": "Eel",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 0.5
    }
  },
  {
    "id": "eel_cooked",
    "name": "熟鳗鱼",
    "nameEn": "Cooked Eel",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 0.5,
      "precook": 1
    }
  },
  {
    "id": "fish",
    "name": "鱼",
    "nameEn": "Fish",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 1
    }
  },
  {
    "id": "fish_cooked",
    "name": "熟鱼",
    "nameEn": "Cooked Fish",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 1,
      "precook": 1
    }
  },
  {
    "id": "pondeel",
    "name": "活鳗鱼",
    "nameEn": "Live Eel",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 0.5
    }
  },
  {
    "id": "pondfish",
    "name": "淡水鱼",
    "nameEn": "Freshwater Fish",
    "category": "fish",
    "values": {
      "fish": 0.5,
      "meat": 0.5
    }
  },
  {
    "id": "fishmeat_small",
    "name": "小鱼块",
    "nameEn": "Fish Morsel",
    "category": "fish",
    "values": {
      "fish": 0.5,
      "meat": 0.5
    }
  },
  {
    "id": "fishmeat_small_cooked",
    "name": "熟小鱼块",
    "nameEn": "Cooked Fish Morsel",
    "category": "fish",
    "values": {
      "fish": 0.5,
      "meat": 0.5,
      "precook": 1
    }
  },
  {
    "id": "fishmeat_small_dried",
    "name": "小鱼干",
    "nameEn": "Small Fishy Jerky",
    "category": "fish",
    "values": {
      "dried": 1,
      "fish": 0.5,
      "meat": 0.5
    }
  },
  {
    "id": "fishmeat",
    "name": "生鱼肉",
    "nameEn": "Raw Fish",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 1
    }
  },
  {
    "id": "fishmeat_cooked",
    "name": "鱼排",
    "nameEn": "Fish Steak",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 1,
      "precook": 1
    }
  },
  {
    "id": "fishmeat_dried",
    "name": "鱼肉干",
    "nameEn": "Fishy Jerky",
    "category": "fish",
    "values": {
      "dried": 1,
      "fish": 1,
      "meat": 1
    }
  },
  {
    "id": "kelp",
    "name": "海带叶",
    "nameEn": "Kelp Fronds",
    "category": "veggie",
    "values": {
      "veggie": 0.5
    }
  },
  {
    "id": "kelp_cooked",
    "name": "熟海带叶",
    "nameEn": "Cooked Kelp Fronds",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 0.5
    }
  },
  {
    "id": "kelp_dried",
    "name": "干海带叶",
    "nameEn": "Dried Kelp Fronds",
    "category": "veggie",
    "values": {
      "dried": 1,
      "veggie": 0.5
    }
  },
  {
    "id": "mandrake",
    "name": "曼德拉草",
    "nameEn": "Mandrake",
    "category": "veggie",
    "values": {
      "magic": 1,
      "veggie": 1
    }
  },
  {
    "id": "tallbirdegg",
    "name": "高脚鸟蛋",
    "nameEn": "Tallbird Egg",
    "category": "egg",
    "values": {
      "egg": 4
    }
  },
  {
    "id": "tallbirdegg_cooked",
    "name": "煎高脚鸟蛋",
    "nameEn": "Fried Tallbird Egg",
    "category": "egg",
    "values": {
      "egg": 4,
      "precook": 1
    }
  },
  {
    "id": "bird_egg",
    "name": "鸟蛋",
    "nameEn": "Egg",
    "category": "egg",
    "values": {
      "egg": 1
    }
  },
  {
    "id": "bird_egg_cooked",
    "name": "熟鸟蛋",
    "nameEn": "Cooked Egg",
    "category": "egg",
    "values": {
      "egg": 1,
      "precook": 1
    }
  },
  {
    "id": "butterflywings",
    "name": "蝴蝶翅膀",
    "nameEn": "Butterfly Wings",
    "category": "decoration",
    "values": {
      "decoration": 2
    }
  },
  {
    "id": "moonbutterflywings",
    "name": "月蛾翅膀",
    "nameEn": "Moon Moth Wings",
    "category": "decoration",
    "values": {
      "decoration": 2
    }
  },
  {
    "id": "butter",
    "name": "黄油",
    "nameEn": "Butter",
    "category": "dairy",
    "values": {
      "dairy": 1,
      "fat": 1
    }
  },
  {
    "id": "twigs",
    "name": "树枝",
    "nameEn": "Twigs",
    "category": "inedible",
    "values": {
      "inedible": 1
    }
  },
  {
    "id": "lightninggoathorn",
    "name": "伏特羊角",
    "nameEn": "Volt Goat Horn",
    "category": "inedible",
    "values": {
      "inedible": 1
    }
  },
  {
    "id": "ice",
    "name": "冰",
    "nameEn": "Ice",
    "category": "frozen",
    "values": {
      "frozen": 1
    }
  },
  {
    "id": "mole",
    "name": "鼹鼠",
    "nameEn": "Moleworm",
    "category": "meat",
    "values": {
      "meat": 0.5
    }
  },
  {
    "id": "cactus_meat",
    "name": "仙人掌肉",
    "nameEn": "Cactus Flesh",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "cactus_meat_cooked",
    "name": "熟仙人掌肉",
    "nameEn": "Cooked Cactus Flesh",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 1
    }
  },
  {
    "id": "rock_avocado_fruit_ripe",
    "name": "成熟石果",
    "nameEn": "Ripe Stone Fruit",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "rock_avocado_fruit_ripe_cooked",
    "name": "熟石果",
    "nameEn": "Cooked Stone Fruit",
    "category": "veggie",
    "values": {
      "precook": 1,
      "veggie": 1
    }
  },
  {
    "id": "watermelon",
    "name": "西瓜",
    "nameEn": "Watermelon",
    "category": "fruit",
    "values": {
      "fruit": 1
    }
  },
  {
    "id": "watermelon_cooked",
    "name": "烤西瓜",
    "nameEn": "Grilled Watermelon",
    "category": "fruit",
    "values": {
      "fruit": 1,
      "precook": 1
    }
  },
  {
    "id": "cactus_flower",
    "name": "仙人掌花",
    "nameEn": "Cactus Flower",
    "category": "veggie",
    "values": {
      "veggie": 0.5
    }
  },
  {
    "id": "acorn",
    "name": "桦栗果",
    "nameEn": "Birchnut",
    "category": "seed",
    "values": {
      "seed": 1
    }
  },
  {
    "id": "acorn_cooked",
    "name": "烤桦栗果",
    "nameEn": "Roasted Birchnut",
    "category": "seed",
    "values": {
      "seed": 1
    }
  },
  {
    "id": "goatmilk",
    "name": "带电的羊奶",
    "nameEn": "Electric Milk",
    "category": "dairy",
    "values": {
      "dairy": 1
    }
  },
  {
    "id": "seeds",
    "name": "种子",
    "nameEn": "Seeds",
    "category": "seed",
    "values": {
      "seed": 1
    }
  },
  {
    "id": "seeds_cooked",
    "name": "烤种子",
    "nameEn": "Toasted Seeds",
    "category": "seed",
    "values": {
      "precook": 1,
      "seed": 1
    }
  },
  {
    "id": "milkywhites",
    "name": "乳白物",
    "nameEn": "Milky Whites",
    "category": "dairy",
    "values": {
      "dairy": 1
    }
  },
  {
    "id": "nightmarefuel",
    "name": "噩梦燃料",
    "nameEn": "Nightmare Fuel",
    "category": "magic",
    "values": {
      "inedible": 1,
      "magic": 1
    }
  },
  {
    "id": "boneshard",
    "name": "骨头碎片",
    "nameEn": "Bone Shards",
    "category": "inedible",
    "values": {
      "inedible": 1
    }
  },
  {
    "id": "wobster_sheller_land",
    "name": "龙虾",
    "nameEn": "Wobster",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 1
    }
  },
  {
    "id": "barnacle",
    "name": "藤壶",
    "nameEn": "Barnacles",
    "category": "fish",
    "values": {
      "fish": 0.25,
      "meat": 0.25
    }
  },
  {
    "id": "barnacle_cooked",
    "name": "熟藤壶",
    "nameEn": "Cooked Barnacles",
    "category": "fish",
    "values": {
      "fish": 0.25,
      "meat": 0.25
    }
  },
  {
    "id": "plantmeat",
    "name": "叶肉",
    "nameEn": "Leafy Meat",
    "category": "meat",
    "values": {
      "meat": 1
    }
  },
  {
    "id": "plantmeat_cooked",
    "name": "熟叶肉",
    "nameEn": "Cooked Leafy Meat",
    "category": "meat",
    "values": {
      "meat": 1
    }
  },
  {
    "id": "refined_dust",
    "name": "尘土块",
    "nameEn": "Collected Dust",
    "category": "decoration",
    "values": {
      "decoration": 2
    }
  },
  {
    "id": "forgetmelots",
    "name": "必忘我",
    "nameEn": "Forget-Me-Lots",
    "category": "decoration",
    "values": {
      "decoration": 1
    }
  },
  {
    "id": "trunk_summer",
    "name": "象鼻",
    "nameEn": "Koalefant Trunk",
    "category": "meat",
    "values": {
      "meat": 1
    }
  },
  {
    "id": "trunk_winter",
    "name": "冬象鼻",
    "nameEn": "Winter Koalefant Trunk",
    "category": "meat",
    "values": {
      "meat": 1
    }
  },
  {
    "id": "trunk_cooked",
    "name": "象鼻排",
    "nameEn": "Koalefant Trunk Steak",
    "category": "meat",
    "values": {
      "meat": 1
    }
  },
  {
    "id": "ancientfruit_nightvision",
    "name": "夜莓",
    "nameEn": "Nightberry",
    "category": "fruit",
    "values": {
      "fruit": 1
    }
  },
  {
    "id": "ancientfruit_nightvision_cooked",
    "name": "熟夜莓",
    "nameEn": "Cooked Nightberry",
    "category": "fruit",
    "values": {
      "fruit": 1,
      "precook": 1
    }
  },
  {
    "id": "petals_dried",
    "name": "干花瓣",
    "nameEn": "Dried Petals",
    "category": "decoration",
    "values": {
      "decoration": 1,
      "dried": 1
    }
  },
  {
    "id": "foliage_dried",
    "name": "干蕨叶",
    "nameEn": "Dried Foliage",
    "category": "decoration",
    "values": {
      "decoration": 1,
      "dried": 1
    }
  },
  {
    "id": "succulent_picked_dried",
    "name": "干多肉",
    "nameEn": "Dried Succulent",
    "category": "decoration",
    "values": {
      "decoration": 1,
      "dried": 1
    }
  },
  {
    "id": "firenettles_dried",
    "name": "干火荨麻叶",
    "nameEn": "Dried Fire Nettle Frond",
    "category": "decoration",
    "values": {
      "decoration": 1,
      "dried": 1
    }
  },
  {
    "id": "tillweed_dried",
    "name": "干犁地草",
    "nameEn": "Dried Tillweed",
    "category": "decoration",
    "values": {
      "decoration": 1,
      "dried": 1
    }
  },
  {
    "id": "moon_tree_blossom_dried",
    "name": "干月树花",
    "nameEn": "Dried Lune Tree Blossom",
    "category": "decoration",
    "values": {
      "decoration": 1,
      "dried": 1
    }
  },
  {
    "id": "forgetmelots_dried",
    "name": "干必忘我",
    "nameEn": "Dried Forget-Me-Lots",
    "category": "decoration",
    "values": {
      "decoration": 1,
      "dried": 1
    }
  },
  {
    "id": "petals_evil_dried",
    "name": "干深色花瓣",
    "nameEn": "Dried Dark Petals",
    "category": "magic",
    "values": {
      "decoration": 1,
      "dried": 1,
      "magic": 0.5
    }
  },
  {
    "id": "wx78_foodbrick",
    "name": "营养砖",
    "nameEn": "Nutribrick",
    "category": "inedible",
    "values": {
      "inedible": 1
    }
  },
  {
    "id": "mitegland",
    "name": "火腺",
    "nameEn": "Heat Gland",
    "category": "meat",
    "values": {
      "meat": 0.5,
      "monster": 0.5
    }
  },
  {
    "id": "mitegland_cooked",
    "name": "熟火腺",
    "nameEn": "Cooked Heat Gland",
    "category": "meat",
    "values": {
      "meat": 0.5,
      "monster": 0.5,
      "precook": 1
    }
  },
  {
    "id": "oceanfish_small_1_inv",
    "name": "小孔雀鱼",
    "nameEn": "Runty Guppy",
    "category": "fish",
    "values": {
      "fish": 0.5,
      "meat": 0.5
    }
  },
  {
    "id": "oceanfish_small_2_inv",
    "name": "针鼻喷墨鱼",
    "nameEn": "Needlenosed Squirt",
    "category": "fish",
    "values": {
      "fish": 0.5,
      "meat": 0.5
    }
  },
  {
    "id": "oceanfish_small_3_inv",
    "name": "小饵鱼",
    "nameEn": "Bitty Baitfish",
    "category": "fish",
    "values": {
      "fish": 0.5,
      "meat": 0.5
    }
  },
  {
    "id": "oceanfish_small_4_inv",
    "name": "三文鱼苗",
    "nameEn": "Smolt Fry",
    "category": "fish",
    "values": {
      "fish": 0.5,
      "meat": 0.5
    }
  },
  {
    "id": "oceanfish_small_5_inv",
    "name": "爆米花鱼",
    "nameEn": "Popperfish",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "oceanfish_small_6_inv",
    "name": "落叶比目鱼",
    "nameEn": "Fallounder",
    "category": "fish",
    "values": {
      "fish": 0.5,
      "meat": 0.5
    }
  },
  {
    "id": "oceanfish_small_7_inv",
    "name": "花朵金枪鱼",
    "nameEn": "Bloomfin Tuna",
    "category": "fish",
    "values": {
      "fish": 0.5,
      "meat": 0.5
    }
  },
  {
    "id": "oceanfish_small_8_inv",
    "name": "炽热太阳鱼",
    "nameEn": "Scorching Sunfish",
    "category": "fish",
    "values": {
      "fish": 0.5,
      "meat": 0.5
    }
  },
  {
    "id": "oceanfish_small_9_inv",
    "name": "口水鱼",
    "nameEn": "Spittlefish",
    "category": "fish",
    "values": {
      "fish": 0.5,
      "meat": 0.5
    }
  },
  {
    "id": "oceanfish_medium_1_inv",
    "name": "泥鱼",
    "nameEn": "Mudfish",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 1
    }
  },
  {
    "id": "oceanfish_medium_2_inv",
    "name": "斑鱼",
    "nameEn": "Deep Bass",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 1
    }
  },
  {
    "id": "oceanfish_medium_3_inv",
    "name": "浮夸狮子鱼",
    "nameEn": "Dandy Lionfish",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 1
    }
  },
  {
    "id": "oceanfish_medium_4_inv",
    "name": "黑鲶鱼",
    "nameEn": "Black Catfish",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 1
    }
  },
  {
    "id": "oceanfish_medium_5_inv",
    "name": "玉米鳕鱼",
    "nameEn": "Corn Cod",
    "category": "veggie",
    "values": {
      "veggie": 1
    }
  },
  {
    "id": "oceanfish_medium_6_inv",
    "name": "花锦鲤",
    "nameEn": "Dappled Koi",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 1
    }
  },
  {
    "id": "oceanfish_medium_7_inv",
    "name": "金锦鲤",
    "nameEn": "Golden Koi",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 1
    }
  },
  {
    "id": "oceanfish_medium_8_inv",
    "name": "冰鲷鱼",
    "nameEn": "Ice Bream",
    "category": "fish",
    "values": {
      "fish": 1,
      "frozen": 1,
      "meat": 1
    }
  },
  {
    "id": "oceanfish_medium_9_inv",
    "name": "甜味鱼",
    "nameEn": "Sweetish Fish",
    "category": "fish",
    "values": {
      "fish": 1,
      "meat": 1
    }
  }
];

/** 食材属性中文名（与游戏官方简体汉化一致） */
export const FOOD_TAG_LABELS: Record<FoodTag, string> = {
  meat: "肉度",
  fish: "鱼度",
  egg: "蛋度",
  fruit: "水果度",
  veggie: "蔬菜度",
  dairy: "乳制品度",
  sweetener: "甜味剂度",
  fat: "油脂度",
  monster: "怪物度",
  inedible: "不可食用度",
  magic: "魔法度",
  seed: "种子度",
  decoration: "装饰度",
  frozen: "冰度",
  precook: "预处理度",
  dried: "干货度",
};

/** 分类中文名（UI 用） */
export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  meat: "肉类",
  fish: "鱼类",
  egg: "蛋类",
  fruit: "水果",
  veggie: "蔬菜",
  dairy: "乳制品",
  sweetener: "甜味剂",
  fat: "油脂",
  magic: "魔法",
  seed: "种子",
  decoration: "装饰",
  frozen: "冰",
  inedible: "不可食用",
};
