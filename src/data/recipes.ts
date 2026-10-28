// 由 scripts/build-data.mjs 自动生成，请勿手动编辑
// 数据源: DST 游戏本体脚本（.cache\game\scripts）
// 生成时间: 2026-10-28

/** 锅类型(与游戏 AddCookerRecipe 的 cooker 参数一致) */
export type CookerId = "cookpot" | "portablecookpot" | "archive_cookpot";

export type BinOp =
  | "and"
  | "or"
  | "=="
  | "~="
  | "<"
  | "<="
  | ">"
  | ">="
  | "+"
  | "-"
  | "*"
  | "/";

/** test 判定表达式的 AST(游戏源函数解析而来,Lua 语义求值) */
export type Expr =
  | { t: "num"; v: number }
  | { t: "bool"; v: boolean }
  | { t: "nil" }
  | { t: "member"; src: "names" | "tags"; key: string }
  | { t: "unop"; op: "not" | "-"; e: Expr }
  | { t: "binop"; op: BinOp; l: Expr; r: Expr };

export interface PotRecipe {
  /** 菜品 prefab id */
  id: string;
  /** 中文名(官方简体汉化) */
  name: string;
  /** 英文名 */
  nameEn: string;
  /** 注册到的锅 */
  cookers: CookerId[];
  /** 优先级(仅最高一档参与结果) */
  priority: number;
  /** 同档随机权重 */
  weight: number;
  /** 烹饪时长倍率 */
  cooktime: number;
  /** 食用三维变化(生命/饥饿/理智),按菜谱字段原样提取 */
  stats: { health: number | null; hunger: number | null; sanity: number | null };
  /** 保质期(游戏秒,480 秒 = 1 游戏天);null 为不腐坏 */
  perishtime: number | null;
  /** 食物类型(FOODTYPE 枚举名) */
  foodtype: string | null;
  /** 判定表达式 */
  test: Expr;
}

export const POT_RECIPES: PotRecipe[] = [
  {
    "id": "butterflymuffin",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 1,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "butterflywings"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "moonbutterflywings"
            }
          },
          "r": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "meat"
            }
          }
        },
        "r": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        }
      },
      "r": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        },
        "r": {
          "t": "num",
          "v": 0.5
        }
      }
    },
    "name": "蝴蝶松饼",
    "nameEn": "Butter Muffin"
  },
  {
    "id": "frogglebunwich",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 1,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "froglegs"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "froglegs_cooked"
          }
        },
        "r": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        }
      },
      "r": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        },
        "r": {
          "t": "num",
          "v": 0.5
        }
      }
    },
    "name": "蛙腿三明治",
    "nameEn": "Froggle Bunwich"
  },
  {
    "id": "taffy",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": -3,
      "hunger": 25,
      "sanity": 15
    },
    "perishtime": 7200,
    "foodtype": "GOODIES",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "sweetener"
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "sweetener"
          },
          "r": {
            "t": "num",
            "v": 3
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "meat"
        }
      }
    },
    "name": "太妃糖",
    "nameEn": "Taffy"
  },
  {
    "id": "pumpkincookie",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 0,
      "hunger": 37.5,
      "sanity": 15
    },
    "perishtime": 4800,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "pumpkin"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "pumpkin_cooked"
          }
        },
        "r": {
          "t": "member",
          "src": "tags",
          "key": "sweetener"
        }
      },
      "r": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "sweetener"
        },
        "r": {
          "t": "num",
          "v": 2
        }
      }
    },
    "name": "南瓜饼干",
    "nameEn": "Pumpkin Cookies"
  },
  {
    "id": "stuffedeggplant",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 1,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 3,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "eggplant"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "eggplant_cooked"
          }
        },
        "r": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        }
      },
      "r": {
        "t": "binop",
        "op": ">",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        },
        "r": {
          "t": "num",
          "v": 1
        }
      }
    },
    "name": "酿茄子",
    "nameEn": "Stuffed Eggplant"
  },
  {
    "id": "fishsticks",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 40,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "fish"
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "twigs"
        }
      },
      "r": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        },
        "r": {
          "t": "binop",
          "op": "<=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "inedible"
          },
          "r": {
            "t": "num",
            "v": 1
          }
        }
      }
    },
    "name": "炸鱼排",
    "nameEn": "Fishsticks"
  },
  {
    "id": "honeynuggets",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 2,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "names",
            "key": "honey"
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        },
        "r": {
          "t": "binop",
          "op": "<=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          },
          "r": {
            "t": "num",
            "v": 1.5
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "蜜汁卤肉",
    "nameEn": "Honey Nuggets"
  },
  {
    "id": "honeyham",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 2,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 30,
      "hunger": 75,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "names",
            "key": "honey"
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        },
        "r": {
          "t": "binop",
          "op": ">",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          },
          "r": {
            "t": "num",
            "v": 1.5
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "蜜汁火腿",
    "nameEn": "Honey Ham"
  },
  {
    "id": "dragonpie",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 1,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 40,
      "hunger": 75,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "or",
        "l": {
          "t": "member",
          "src": "names",
          "key": "dragonfruit"
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "dragonfruit_cooked"
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "meat"
        }
      }
    },
    "name": "火龙果派",
    "nameEn": "Dragonpie"
  },
  {
    "id": "kabobs",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 5,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 3,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "twigs"
          }
        },
        "r": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "monster"
            }
          },
          "r": {
            "t": "binop",
            "op": "<=",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "monster"
            },
            "r": {
              "t": "num",
              "v": 1
            }
          }
        }
      },
      "r": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        },
        "r": {
          "t": "binop",
          "op": "<=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "inedible"
          },
          "r": {
            "t": "num",
            "v": 1
          }
        }
      }
    },
    "name": "肉串",
    "nameEn": "Kabobs"
  },
  {
    "id": "mandrakesoup",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 3,
    "stats": {
      "health": 100,
      "hunger": 150,
      "sanity": 5
    },
    "perishtime": 2880,
    "foodtype": "VEGGIE",
    "test": {
      "t": "member",
      "src": "names",
      "key": "mandrake"
    },
    "name": "曼德拉草汤",
    "nameEn": "Mandrake Soup"
  },
  {
    "id": "baconeggs",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 20,
      "hunger": 75,
      "sanity": 5
    },
    "perishtime": 9600,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "egg"
            },
            "r": {
              "t": "binop",
              "op": ">",
              "l": {
                "t": "member",
                "src": "tags",
                "key": "egg"
              },
              "r": {
                "t": "num",
                "v": 1
              }
            }
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        },
        "r": {
          "t": "binop",
          "op": ">",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          },
          "r": {
            "t": "num",
            "v": 1
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        }
      }
    },
    "name": "培根煎蛋",
    "nameEn": "Bacon and Eggs"
  },
  {
    "id": "meatballs",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": -1,
    "weight": 1,
    "cooktime": 0.75,
    "stats": {
      "health": 3,
      "hunger": 62.5,
      "sanity": 5
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "member",
        "src": "tags",
        "key": "meat"
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "肉丸",
    "nameEn": "Meatballs"
  },
  {
    "id": "bonestew",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 0,
    "weight": 1,
    "cooktime": 0.75,
    "stats": {
      "health": 12,
      "hunger": 150,
      "sanity": 5
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "meat"
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          },
          "r": {
            "t": "num",
            "v": 3
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "炖肉汤",
    "nameEn": "Meaty Stew"
  },
  {
    "id": "perogies",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 5,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": 40,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 9600,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "egg"
            },
            "r": {
              "t": "member",
              "src": "tags",
              "key": "meat"
            }
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "veggie"
          }
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "veggie"
          },
          "r": {
            "t": "num",
            "v": 0.5
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "波兰水饺",
    "nameEn": "Pierogi"
  },
  {
    "id": "turkeydinner",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 3,
    "stats": {
      "health": 20,
      "hunger": 75,
      "sanity": 5
    },
    "perishtime": 2880,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "member",
              "src": "names",
              "key": "drumstick"
            },
            "r": {
              "t": "binop",
              "op": ">",
              "l": {
                "t": "member",
                "src": "names",
                "key": "drumstick"
              },
              "r": {
                "t": "num",
                "v": 1
              }
            }
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        },
        "r": {
          "t": "binop",
          "op": ">",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          },
          "r": {
            "t": "num",
            "v": 1
          }
        }
      },
      "r": {
        "t": "binop",
        "op": "or",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "veggie"
          },
          "r": {
            "t": "binop",
            "op": ">=",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "veggie"
            },
            "r": {
              "t": "num",
              "v": 0.5
            }
          }
        },
        "r": {
          "t": "member",
          "src": "tags",
          "key": "fruit"
        }
      }
    },
    "name": "火鸡正餐",
    "nameEn": "Turkey Dinner"
  },
  {
    "id": "ratatouille",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 0,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": 3,
      "hunger": 25,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "meat"
            }
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "veggie"
          }
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "veggie"
          },
          "r": {
            "t": "num",
            "v": 0.5
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "蔬菜杂烩",
    "nameEn": "Ratatouille"
  },
  {
    "id": "jammypreserves",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 0,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 3,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "fruit"
          },
          "r": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "meat"
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "veggie"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "果酱",
    "nameEn": "Fist Full of Jam"
  },
  {
    "id": "fruitmedley",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 0,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 20,
      "hunger": 25,
      "sanity": 5
    },
    "perishtime": 2880,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "fruit"
          },
          "r": {
            "t": "binop",
            "op": ">=",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "fruit"
            },
            "r": {
              "t": "num",
              "v": 3
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        }
      }
    },
    "name": "水果圣代",
    "nameEn": "Fruit Medley"
  },
  {
    "id": "fishtacos",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 2880,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "member",
        "src": "tags",
        "key": "fish"
      },
      "r": {
        "t": "binop",
        "op": "or",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "corn"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "corn_cooked"
            }
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "oceanfish_small_5_inv"
          }
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "oceanfish_medium_5_inv"
        }
      }
    },
    "name": "鱼肉玉米卷",
    "nameEn": "Fish Tacos"
  },
  {
    "id": "waffles",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 60,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 2880,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "names",
          "key": "butter"
        },
        "r": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "berries"
              },
              "r": {
                "t": "member",
                "src": "names",
                "key": "berries_cooked"
              }
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "berries_juicy"
            }
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "berries_juicy_cooked"
          }
        }
      },
      "r": {
        "t": "member",
        "src": "tags",
        "key": "egg"
      }
    },
    "name": "华夫饼",
    "nameEn": "Waffles"
  },
  {
    "id": "monsterlasagna",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": -20,
      "hunger": 37.5,
      "sanity": -20
    },
    "perishtime": 2880,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "monster"
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "monster"
          },
          "r": {
            "t": "num",
            "v": 2
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "怪物千层饼",
    "nameEn": "Monster Lasagna"
  },
  {
    "id": "powcake",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": -3,
      "hunger": 0,
      "sanity": 0
    },
    "perishtime": 9000000,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "names",
          "key": "twigs"
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "honey"
        }
      },
      "r": {
        "t": "binop",
        "op": "or",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "corn"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "corn_cooked"
            }
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "oceanfish_small_5_inv"
          }
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "oceanfish_medium_5_inv"
        }
      }
    },
    "name": "粉末蛋糕",
    "nameEn": "Powdercake"
  },
  {
    "id": "unagi",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 20,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "or",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "cutlichen"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "kelp"
            }
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "kelp_cooked"
          }
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "kelp_dried"
        }
      },
      "r": {
        "t": "binop",
        "op": "or",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "eel"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "eel_cooked"
          }
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "pondeel"
        }
      }
    },
    "name": "鳗鱼料理",
    "nameEn": "Unagi"
  },
  {
    "id": "wetgoop",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": -10,
    "weight": 1,
    "cooktime": 0.25,
    "stats": {
      "health": 0,
      "hunger": 0,
      "sanity": 0
    },
    "perishtime": 2880,
    "foodtype": null,
    "test": {
      "t": "bool",
      "v": true
    },
    "name": "潮湿黏糊",
    "nameEn": "Wet Goop"
  },
  {
    "id": "flowersalad",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 40,
      "hunger": 12.5,
      "sanity": 5
    },
    "perishtime": 2880,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "and",
              "l": {
                "t": "binop",
                "op": "and",
                "l": {
                  "t": "binop",
                  "op": "and",
                  "l": {
                    "t": "member",
                    "src": "names",
                    "key": "cactus_flower"
                  },
                  "r": {
                    "t": "member",
                    "src": "tags",
                    "key": "veggie"
                  }
                },
                "r": {
                  "t": "binop",
                  "op": ">=",
                  "l": {
                    "t": "member",
                    "src": "tags",
                    "key": "veggie"
                  },
                  "r": {
                    "t": "num",
                    "v": 2
                  }
                }
              },
              "r": {
                "t": "unop",
                "op": "not",
                "e": {
                  "t": "member",
                  "src": "tags",
                  "key": "meat"
                }
              }
            },
            "r": {
              "t": "unop",
              "op": "not",
              "e": {
                "t": "member",
                "src": "tags",
                "key": "inedible"
              }
            }
          },
          "r": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "egg"
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "sweetener"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "fruit"
        }
      }
    },
    "name": "花沙拉",
    "nameEn": "Flower Salad"
  },
  {
    "id": "icecream",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 0,
      "hunger": 25,
      "sanity": 50
    },
    "perishtime": 1440,
    "foodtype": "GOODIES",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "and",
              "l": {
                "t": "binop",
                "op": "and",
                "l": {
                  "t": "member",
                  "src": "tags",
                  "key": "frozen"
                },
                "r": {
                  "t": "member",
                  "src": "tags",
                  "key": "dairy"
                }
              },
              "r": {
                "t": "member",
                "src": "tags",
                "key": "sweetener"
              }
            },
            "r": {
              "t": "unop",
              "op": "not",
              "e": {
                "t": "member",
                "src": "tags",
                "key": "meat"
              }
            }
          },
          "r": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "veggie"
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "inedible"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "egg"
        }
      }
    },
    "name": "冰淇淋",
    "nameEn": "Ice Cream"
  },
  {
    "id": "watermelonicle",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 3,
      "hunger": 12.5,
      "sanity": 20
    },
    "perishtime": 1440,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "and",
              "l": {
                "t": "member",
                "src": "names",
                "key": "watermelon"
              },
              "r": {
                "t": "member",
                "src": "tags",
                "key": "frozen"
              }
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "twigs"
            }
          },
          "r": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "meat"
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "veggie"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "egg"
        }
      }
    },
    "name": "西瓜冰棍",
    "nameEn": "Melonsicle"
  },
  {
    "id": "trailmix",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 30,
      "hunger": 12.5,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "and",
              "l": {
                "t": "binop",
                "op": "and",
                "l": {
                  "t": "binop",
                  "op": "and",
                  "l": {
                    "t": "binop",
                    "op": "and",
                    "l": {
                      "t": "binop",
                      "op": "and",
                      "l": {
                        "t": "binop",
                        "op": "or",
                        "l": {
                          "t": "member",
                          "src": "names",
                          "key": "acorn"
                        },
                        "r": {
                          "t": "member",
                          "src": "names",
                          "key": "acorn_cooked"
                        }
                      },
                      "r": {
                        "t": "member",
                        "src": "tags",
                        "key": "seed"
                      }
                    },
                    "r": {
                      "t": "binop",
                      "op": ">=",
                      "l": {
                        "t": "member",
                        "src": "tags",
                        "key": "seed"
                      },
                      "r": {
                        "t": "num",
                        "v": 1
                      }
                    }
                  },
                  "r": {
                    "t": "binop",
                    "op": "or",
                    "l": {
                      "t": "binop",
                      "op": "or",
                      "l": {
                        "t": "binop",
                        "op": "or",
                        "l": {
                          "t": "member",
                          "src": "names",
                          "key": "berries"
                        },
                        "r": {
                          "t": "member",
                          "src": "names",
                          "key": "berries_cooked"
                        }
                      },
                      "r": {
                        "t": "member",
                        "src": "names",
                        "key": "berries_juicy"
                      }
                    },
                    "r": {
                      "t": "member",
                      "src": "names",
                      "key": "berries_juicy_cooked"
                    }
                  }
                },
                "r": {
                  "t": "member",
                  "src": "tags",
                  "key": "fruit"
                }
              },
              "r": {
                "t": "binop",
                "op": ">=",
                "l": {
                  "t": "member",
                  "src": "tags",
                  "key": "fruit"
                },
                "r": {
                  "t": "num",
                  "v": 1
                }
              }
            },
            "r": {
              "t": "unop",
              "op": "not",
              "e": {
                "t": "member",
                "src": "tags",
                "key": "meat"
              }
            }
          },
          "r": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "veggie"
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "egg"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "dairy"
        }
      }
    },
    "name": "什锦干果",
    "nameEn": "Trail Mix"
  },
  {
    "id": "hotchili",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 0
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "veggie"
          }
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          },
          "r": {
            "t": "num",
            "v": 1.5
          }
        }
      },
      "r": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        },
        "r": {
          "t": "num",
          "v": 1.5
        }
      }
    },
    "name": "辣椒炖肉",
    "nameEn": "Spicy Chili"
  },
  {
    "id": "guacamole",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 0
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "names",
          "key": "mole"
        },
        "r": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "rock_avocado_fruit_ripe"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "cactus_meat"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "fruit"
        }
      }
    },
    "name": "鳄梨酱",
    "nameEn": "Guacamole"
  },
  {
    "id": "jellybean",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 12,
    "weight": 1,
    "cooktime": 2.5,
    "stats": {
      "health": 2,
      "hunger": 0,
      "sanity": 5
    },
    "perishtime": null,
    "foodtype": "GOODIES",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "names",
          "key": "royal_jelly"
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "inedible"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "monster"
        }
      }
    },
    "name": "彩虹糖豆",
    "nameEn": "Jellybeans"
  },
  {
    "id": "potatotornado",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 0.75,
    "stats": {
      "health": 3,
      "hunger": 37.5,
      "sanity": 15
    },
    "perishtime": 4800,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "potato"
              },
              "r": {
                "t": "member",
                "src": "names",
                "key": "potato_cooked"
              }
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "twigs"
            }
          },
          "r": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "unop",
              "op": "not",
              "e": {
                "t": "member",
                "src": "tags",
                "key": "monster"
              }
            },
            "r": {
              "t": "binop",
              "op": "<=",
              "l": {
                "t": "member",
                "src": "tags",
                "key": "monster"
              },
              "r": {
                "t": "num",
                "v": 1
              }
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        }
      },
      "r": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        },
        "r": {
          "t": "binop",
          "op": "<=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "inedible"
          },
          "r": {
            "t": "num",
            "v": 2
          }
        }
      }
    },
    "name": "花式回旋块茎",
    "nameEn": "Fancy Spiralled Tubers"
  },
  {
    "id": "mashedpotatoes",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 20,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 33
    },
    "perishtime": 7200,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "binop",
                "op": "and",
                "l": {
                  "t": "member",
                  "src": "names",
                  "key": "potato"
                },
                "r": {
                  "t": "binop",
                  "op": ">",
                  "l": {
                    "t": "member",
                    "src": "names",
                    "key": "potato"
                  },
                  "r": {
                    "t": "num",
                    "v": 1
                  }
                }
              },
              "r": {
                "t": "binop",
                "op": "and",
                "l": {
                  "t": "member",
                  "src": "names",
                  "key": "potato_cooked"
                },
                "r": {
                  "t": "binop",
                  "op": ">",
                  "l": {
                    "t": "member",
                    "src": "names",
                    "key": "potato_cooked"
                  },
                  "r": {
                    "t": "num",
                    "v": 1
                  }
                }
              }
            },
            "r": {
              "t": "binop",
              "op": "and",
              "l": {
                "t": "member",
                "src": "names",
                "key": "potato"
              },
              "r": {
                "t": "member",
                "src": "names",
                "key": "potato_cooked"
              }
            }
          },
          "r": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "garlic"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "garlic_cooked"
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "奶油土豆泥",
    "nameEn": "Creamy Potato Purée"
  },
  {
    "id": "asparagussoup",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 20,
      "hunger": 18.75,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "asparagus"
              },
              "r": {
                "t": "member",
                "src": "names",
                "key": "asparagus_cooked"
              }
            },
            "r": {
              "t": "member",
              "src": "tags",
              "key": "veggie"
            }
          },
          "r": {
            "t": "binop",
            "op": ">",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "veggie"
            },
            "r": {
              "t": "num",
              "v": 2
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "芦笋汤",
    "nameEn": "Asparagus Soup"
  },
  {
    "id": "vegstinger",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 15,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 3,
      "hunger": 25,
      "sanity": 33
    },
    "perishtime": 7200,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "and",
              "l": {
                "t": "binop",
                "op": "and",
                "l": {
                  "t": "binop",
                  "op": "or",
                  "l": {
                    "t": "binop",
                    "op": "or",
                    "l": {
                      "t": "binop",
                      "op": "or",
                      "l": {
                        "t": "member",
                        "src": "names",
                        "key": "asparagus"
                      },
                      "r": {
                        "t": "member",
                        "src": "names",
                        "key": "asparagus_cooked"
                      }
                    },
                    "r": {
                      "t": "member",
                      "src": "names",
                      "key": "tomato"
                    }
                  },
                  "r": {
                    "t": "member",
                    "src": "names",
                    "key": "tomato_cooked"
                  }
                },
                "r": {
                  "t": "member",
                  "src": "tags",
                  "key": "veggie"
                }
              },
              "r": {
                "t": "binop",
                "op": ">",
                "l": {
                  "t": "member",
                  "src": "tags",
                  "key": "veggie"
                },
                "r": {
                  "t": "num",
                  "v": 2
                }
              }
            },
            "r": {
              "t": "member",
              "src": "tags",
              "key": "frozen"
            }
          },
          "r": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "meat"
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "inedible"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "egg"
        }
      }
    },
    "name": "蔬菜鸡尾酒",
    "nameEn": "Vegetable Stinger"
  },
  {
    "id": "bananapop",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 20,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 20,
      "hunger": 12.5,
      "sanity": 33
    },
    "perishtime": 1440,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "cave_banana"
              },
              "r": {
                "t": "member",
                "src": "names",
                "key": "cave_banana_cooked"
              }
            },
            "r": {
              "t": "member",
              "src": "tags",
              "key": "frozen"
            }
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "twigs"
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "fish"
        }
      }
    },
    "name": "香蕉冻",
    "nameEn": "Banana Pop"
  },
  {
    "id": "frozenbananadaiquiri",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 2,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": 30,
      "hunger": 18.75,
      "sanity": 15
    },
    "perishtime": 7200,
    "foodtype": "GOODIES",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "cave_banana"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "cave_banana_cooked"
            }
          },
          "r": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "frozen"
            },
            "r": {
              "t": "binop",
              "op": ">=",
              "l": {
                "t": "member",
                "src": "tags",
                "key": "frozen"
              },
              "r": {
                "t": "num",
                "v": 1
              }
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "fish"
        }
      }
    },
    "name": "冰香蕉冻唇蜜",
    "nameEn": "Frozen Banana Daiquiri"
  },
  {
    "id": "bananajuice",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 1,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 8,
      "hunger": 25,
      "sanity": 33
    },
    "perishtime": 7200,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": ">=",
            "l": {
              "t": "binop",
              "op": "+",
              "l": {
                "t": "binop",
                "op": "or",
                "l": {
                  "t": "member",
                  "src": "names",
                  "key": "cave_banana"
                },
                "r": {
                  "t": "num",
                  "v": 0
                }
              },
              "r": {
                "t": "binop",
                "op": "or",
                "l": {
                  "t": "member",
                  "src": "names",
                  "key": "cave_banana_cooked"
                },
                "r": {
                  "t": "num",
                  "v": 0
                }
              }
            },
            "r": {
              "t": "num",
              "v": 2
            }
          },
          "r": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "meat"
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "fish"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "monster"
        }
      }
    },
    "name": "香蕉奶昔",
    "nameEn": "Banana Shake"
  },
  {
    "id": "ceviche",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 20,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 20,
      "hunger": 25,
      "sanity": 5
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "fish"
            },
            "r": {
              "t": "binop",
              "op": ">=",
              "l": {
                "t": "member",
                "src": "tags",
                "key": "fish"
              },
              "r": {
                "t": "num",
                "v": 2
              }
            }
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "frozen"
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "inedible"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "egg"
        }
      }
    },
    "name": "酸橘汁腌鱼",
    "nameEn": "Ceviche"
  },
  {
    "id": "salsa",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 20,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 3,
      "hunger": 25,
      "sanity": 33
    },
    "perishtime": 7200,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "tomato"
              },
              "r": {
                "t": "member",
                "src": "names",
                "key": "tomato_cooked"
              }
            },
            "r": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "onion"
              },
              "r": {
                "t": "member",
                "src": "names",
                "key": "onion_cooked"
              }
            }
          },
          "r": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "meat"
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "inedible"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "egg"
        }
      }
    },
    "name": "生鲜萨尔萨酱",
    "nameEn": "Salsa Fresca"
  },
  {
    "id": "pepperpopper",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 20,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 30,
      "hunger": 25,
      "sanity": -5
    },
    "perishtime": 7200,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "pepper"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "pepper_cooked"
            }
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        },
        "r": {
          "t": "binop",
          "op": "<=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          },
          "r": {
            "t": "num",
            "v": 1.5
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "爆炒填馅辣椒",
    "nameEn": "Stuffed Pepper Poppers"
  },
  {
    "id": "californiaroll",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 20,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 10
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "==",
        "l": {
          "t": "binop",
          "op": "+",
          "l": {
            "t": "binop",
            "op": "+",
            "l": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "kelp"
              },
              "r": {
                "t": "num",
                "v": 0
              }
            },
            "r": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "kelp_cooked"
              },
              "r": {
                "t": "num",
                "v": 0
              }
            }
          },
          "r": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "kelp_dried"
            },
            "r": {
              "t": "num",
              "v": 0
            }
          }
        },
        "r": {
          "t": "num",
          "v": 2
        }
      },
      "r": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "fish"
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "fish"
          },
          "r": {
            "t": "num",
            "v": 1
          }
        }
      }
    },
    "name": "加州卷",
    "nameEn": "California Roll"
  },
  {
    "id": "seafoodgumbo",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": 40,
      "hunger": 37.5,
      "sanity": 20
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "member",
        "src": "tags",
        "key": "fish"
      },
      "r": {
        "t": "binop",
        "op": ">",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "fish"
        },
        "r": {
          "t": "num",
          "v": 2
        }
      }
    },
    "name": "海鲜浓汤",
    "nameEn": "Seafood Gumbo"
  },
  {
    "id": "surfnturf",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": 60,
      "hunger": 37.5,
      "sanity": 33
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "meat"
            },
            "r": {
              "t": "binop",
              "op": ">=",
              "l": {
                "t": "member",
                "src": "tags",
                "key": "meat"
              },
              "r": {
                "t": "num",
                "v": 2.5
              }
            }
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "fish"
          }
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "fish"
          },
          "r": {
            "t": "num",
            "v": 1.5
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "frozen"
        }
      }
    },
    "name": "海鲜牛排",
    "nameEn": "Surf 'n' Turf"
  },
  {
    "id": "lobsterbisque",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 60,
      "hunger": 25,
      "sanity": 10
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "member",
        "src": "names",
        "key": "wobster_sheller_land"
      },
      "r": {
        "t": "member",
        "src": "tags",
        "key": "frozen"
      }
    },
    "name": "龙虾汤",
    "nameEn": "Lobster Bisque"
  },
  {
    "id": "lobsterdinner",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 25,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": 60,
      "hunger": 37.5,
      "sanity": 50
    },
    "perishtime": 7200,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "member",
              "src": "names",
              "key": "wobster_sheller_land"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "butter"
            }
          },
          "r": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "meat"
            },
            "r": {
              "t": "binop",
              "op": ">=",
              "l": {
                "t": "member",
                "src": "tags",
                "key": "meat"
              },
              "r": {
                "t": "num",
                "v": 1
              }
            }
          }
        },
        "r": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "fish"
          },
          "r": {
            "t": "binop",
            "op": ">=",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "fish"
            },
            "r": {
              "t": "num",
              "v": 1
            }
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "frozen"
        }
      }
    },
    "name": "龙虾正餐",
    "nameEn": "Lobster Dinner"
  },
  {
    "id": "barnaclepita",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 25,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "barnacle"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "barnacle_cooked"
          }
        },
        "r": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        }
      },
      "r": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        },
        "r": {
          "t": "num",
          "v": 0.5
        }
      }
    },
    "name": "藤壶皮塔饼",
    "nameEn": "Barnacle Pita"
  },
  {
    "id": "barnaclesushi",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 40,
      "hunger": 37.5,
      "sanity": 15
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "barnacle"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "barnacle_cooked"
            }
          },
          "r": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "kelp"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "kelp_cooked"
            }
          }
        },
        "r": {
          "t": "member",
          "src": "tags",
          "key": "egg"
        }
      },
      "r": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "egg"
        },
        "r": {
          "t": "num",
          "v": 1
        }
      }
    },
    "name": "藤壶握寿司",
    "nameEn": "Barnacle Nigiri"
  },
  {
    "id": "barnaclinguine",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 30,
      "hunger": 75,
      "sanity": 20
    },
    "perishtime": 2880,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "binop",
            "op": "+",
            "l": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "barnacle"
              },
              "r": {
                "t": "num",
                "v": 0
              }
            },
            "r": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "barnacle_cooked"
              },
              "r": {
                "t": "num",
                "v": 0
              }
            }
          },
          "r": {
            "t": "num",
            "v": 2
          }
        },
        "r": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        }
      },
      "r": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        },
        "r": {
          "t": "num",
          "v": 2
        }
      }
    },
    "name": "藤壶中细面",
    "nameEn": "Barnacle Linguine"
  },
  {
    "id": "barnaclestuffedfishhead",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 26,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 20,
      "hunger": 75,
      "sanity": 0
    },
    "perishtime": 1440,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "barnacle"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "barnacle_cooked"
          }
        },
        "r": {
          "t": "member",
          "src": "tags",
          "key": "fish"
        }
      },
      "r": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "fish"
        },
        "r": {
          "t": "num",
          "v": 1.25
        }
      }
    },
    "name": "酿鱼头",
    "nameEn": "Stuffed Fish Heads"
  },
  {
    "id": "leafloaf",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 25,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 8,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 9600,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": ">=",
      "l": {
        "t": "binop",
        "op": "+",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "plantmeat"
          },
          "r": {
            "t": "num",
            "v": 0
          }
        },
        "r": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "plantmeat_cooked"
          },
          "r": {
            "t": "num",
            "v": 0
          }
        }
      },
      "r": {
        "t": "num",
        "v": 2
      }
    },
    "name": "叶肉糕",
    "nameEn": "Leafy Meatloaf"
  },
  {
    "id": "leafymeatburger",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 26,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 30,
      "hunger": 37.5,
      "sanity": 33
    },
    "perishtime": 2880,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "plantmeat"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "plantmeat_cooked"
            }
          },
          "r": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "onion"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "onion_cooked"
            }
          }
        },
        "r": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        }
      },
      "r": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        },
        "r": {
          "t": "num",
          "v": 2
        }
      }
    },
    "name": "素食堡",
    "nameEn": "Veggie Burger"
  },
  {
    "id": "leafymeatsouffle",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 50,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 0,
      "hunger": 37.5,
      "sanity": 50
    },
    "perishtime": 2880,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "binop",
            "op": "+",
            "l": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "plantmeat"
              },
              "r": {
                "t": "num",
                "v": 0
              }
            },
            "r": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "plantmeat_cooked"
              },
              "r": {
                "t": "num",
                "v": 0
              }
            }
          },
          "r": {
            "t": "num",
            "v": 2
          }
        },
        "r": {
          "t": "member",
          "src": "tags",
          "key": "sweetener"
        }
      },
      "r": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "sweetener"
        },
        "r": {
          "t": "num",
          "v": 2
        }
      }
    },
    "name": "果冻沙拉",
    "nameEn": "Jelly Salad"
  },
  {
    "id": "meatysalad",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 25,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 40,
      "hunger": 75,
      "sanity": 5
    },
    "perishtime": 2880,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "plantmeat"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "plantmeat_cooked"
          }
        },
        "r": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        }
      },
      "r": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        },
        "r": {
          "t": "num",
          "v": 3
        }
      }
    },
    "name": "牛肉绿叶菜",
    "nameEn": "Beefy Greens"
  },
  {
    "id": "shroomcake",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": 0,
      "hunger": 25,
      "sanity": 10
    },
    "perishtime": 7200,
    "foodtype": "GOODIES",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "names",
            "key": "moon_cap"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "red_cap"
          }
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "blue_cap"
        }
      },
      "r": {
        "t": "member",
        "src": "names",
        "key": "green_cap"
      }
    },
    "name": "蘑菇蛋糕",
    "nameEn": "Mushy Cake"
  },
  {
    "id": "sweettea",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 1,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": 3,
      "hunger": 0,
      "sanity": 15
    },
    "perishtime": 1440,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "and",
              "l": {
                "t": "binop",
                "op": "and",
                "l": {
                  "t": "binop",
                  "op": "and",
                  "l": {
                    "t": "binop",
                    "op": "and",
                    "l": {
                      "t": "binop",
                      "op": "and",
                      "l": {
                        "t": "binop",
                        "op": "and",
                        "l": {
                          "t": "binop",
                          "op": "or",
                          "l": {
                            "t": "member",
                            "src": "names",
                            "key": "forgetmelots"
                          },
                          "r": {
                            "t": "member",
                            "src": "names",
                            "key": "forgetmelots_dried"
                          }
                        },
                        "r": {
                          "t": "member",
                          "src": "tags",
                          "key": "sweetener"
                        }
                      },
                      "r": {
                        "t": "member",
                        "src": "tags",
                        "key": "frozen"
                      }
                    },
                    "r": {
                      "t": "unop",
                      "op": "not",
                      "e": {
                        "t": "member",
                        "src": "tags",
                        "key": "monster"
                      }
                    }
                  },
                  "r": {
                    "t": "unop",
                    "op": "not",
                    "e": {
                      "t": "member",
                      "src": "tags",
                      "key": "veggie"
                    }
                  }
                },
                "r": {
                  "t": "unop",
                  "op": "not",
                  "e": {
                    "t": "member",
                    "src": "tags",
                    "key": "meat"
                  }
                }
              },
              "r": {
                "t": "unop",
                "op": "not",
                "e": {
                  "t": "member",
                  "src": "tags",
                  "key": "fish"
                }
              }
            },
            "r": {
              "t": "unop",
              "op": "not",
              "e": {
                "t": "member",
                "src": "tags",
                "key": "egg"
              }
            }
          },
          "r": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "fat"
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "dairy"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "舒缓茶",
    "nameEn": "Soothing Tea"
  },
  {
    "id": "koalefig_trunk",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 40,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 60,
      "hunger": 150,
      "sanity": 15
    },
    "perishtime": 7200,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "or",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "trunk_summer"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "trunk_cooked"
          }
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "trunk_winter"
        }
      },
      "r": {
        "t": "binop",
        "op": "or",
        "l": {
          "t": "member",
          "src": "names",
          "key": "fig"
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "fig_cooked"
        }
      }
    },
    "name": "无花果酿象鼻",
    "nameEn": "Fig-Stuffed Trunk"
  },
  {
    "id": "figatoni",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 30,
      "hunger": 56.25,
      "sanity": 15
    },
    "perishtime": 2880,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "fig"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "fig_cooked"
            }
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "veggie"
          }
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "veggie"
          },
          "r": {
            "t": "num",
            "v": 2
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "meat"
        }
      }
    },
    "name": "无花果意面",
    "nameEn": "Figatoni"
  },
  {
    "id": "figkabab",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 10
    },
    "perishtime": 7200,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "fig"
              },
              "r": {
                "t": "member",
                "src": "names",
                "key": "fig_cooked"
              }
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "twigs"
            }
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          },
          "r": {
            "t": "num",
            "v": 1
          }
        }
      },
      "r": {
        "t": "binop",
        "op": "or",
        "l": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "monster"
          }
        },
        "r": {
          "t": "binop",
          "op": "<=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "monster"
          },
          "r": {
            "t": "num",
            "v": 1
          }
        }
      }
    },
    "name": "无花果烤串",
    "nameEn": "Figkabab"
  },
  {
    "id": "frognewton",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 1,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": 20,
      "hunger": 25,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "or",
        "l": {
          "t": "member",
          "src": "names",
          "key": "fig"
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "fig_cooked"
        }
      },
      "r": {
        "t": "binop",
        "op": "or",
        "l": {
          "t": "member",
          "src": "names",
          "key": "froglegs"
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "froglegs_cooked"
        }
      }
    },
    "name": "无花果蛙腿三明治",
    "nameEn": "Figgy Frogwich"
  },
  {
    "id": "bunnystew",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 1,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          },
          "r": {
            "t": "binop",
            "op": "<",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "meat"
            },
            "r": {
              "t": "num",
              "v": 1
            }
          }
        },
        "r": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "frozen"
          },
          "r": {
            "t": "binop",
            "op": ">=",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "frozen"
            },
            "r": {
              "t": "num",
              "v": 2
            }
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "炖兔子",
    "nameEn": "Bunny Stew"
  },
  {
    "id": "justeggs",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 0,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 3,
      "hunger": 50,
      "sanity": 5
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "member",
        "src": "tags",
        "key": "egg"
      },
      "r": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "egg"
        },
        "r": {
          "t": "num",
          "v": 3
        }
      }
    },
    "name": "普通煎蛋",
    "nameEn": "Plain Omelette"
  },
  {
    "id": "veggieomlet",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 1,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 5
    },
    "perishtime": 9600,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "and",
              "l": {
                "t": "member",
                "src": "tags",
                "key": "egg"
              },
              "r": {
                "t": "binop",
                "op": ">=",
                "l": {
                  "t": "member",
                  "src": "tags",
                  "key": "egg"
                },
                "r": {
                  "t": "num",
                  "v": 1
                }
              }
            },
            "r": {
              "t": "member",
              "src": "tags",
              "key": "veggie"
            }
          },
          "r": {
            "t": "binop",
            "op": ">=",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "veggie"
            },
            "r": {
              "t": "num",
              "v": 1
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "dairy"
        }
      }
    },
    "name": "早餐锅",
    "nameEn": "Breakfast Skillet"
  },
  {
    "id": "talleggs",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 10,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 60,
      "hunger": 150,
      "sanity": 5
    },
    "perishtime": 7200,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "names",
          "key": "tallbirdegg"
        },
        "r": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        }
      },
      "r": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "veggie"
        },
        "r": {
          "t": "num",
          "v": 1
        }
      }
    },
    "name": "苏格兰高鸟蛋",
    "nameEn": "Tall Scotch Eggs"
  },
  {
    "id": "beefalofeed",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": -5,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 15,
      "hunger": 100,
      "sanity": 0
    },
    "perishtime": 9600,
    "foodtype": "ROUGHAGE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "and",
              "l": {
                "t": "binop",
                "op": "and",
                "l": {
                  "t": "binop",
                  "op": "and",
                  "l": {
                    "t": "member",
                    "src": "tags",
                    "key": "inedible"
                  },
                  "r": {
                    "t": "unop",
                    "op": "not",
                    "e": {
                      "t": "member",
                      "src": "tags",
                      "key": "monster"
                    }
                  }
                },
                "r": {
                  "t": "unop",
                  "op": "not",
                  "e": {
                    "t": "member",
                    "src": "tags",
                    "key": "meat"
                  }
                }
              },
              "r": {
                "t": "unop",
                "op": "not",
                "e": {
                  "t": "member",
                  "src": "tags",
                  "key": "fish"
                }
              }
            },
            "r": {
              "t": "unop",
              "op": "not",
              "e": {
                "t": "member",
                "src": "tags",
                "key": "egg"
              }
            }
          },
          "r": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "fat"
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "dairy"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "magic"
        }
      }
    },
    "name": "蒸树枝",
    "nameEn": "Steamed Twigs"
  },
  {
    "id": "beefalotreat",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": -4,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 75,
      "hunger": 25,
      "sanity": 0
    },
    "perishtime": 9600,
    "foodtype": "ROUGHAGE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "and",
              "l": {
                "t": "binop",
                "op": "and",
                "l": {
                  "t": "binop",
                  "op": "and",
                  "l": {
                    "t": "binop",
                    "op": "and",
                    "l": {
                      "t": "binop",
                      "op": "and",
                      "l": {
                        "t": "member",
                        "src": "tags",
                        "key": "inedible"
                      },
                      "r": {
                        "t": "member",
                        "src": "tags",
                        "key": "seed"
                      }
                    },
                    "r": {
                      "t": "binop",
                      "op": "or",
                      "l": {
                        "t": "member",
                        "src": "names",
                        "key": "forgetmelots"
                      },
                      "r": {
                        "t": "member",
                        "src": "names",
                        "key": "forgetmelots_dried"
                      }
                    }
                  },
                  "r": {
                    "t": "unop",
                    "op": "not",
                    "e": {
                      "t": "member",
                      "src": "tags",
                      "key": "monster"
                    }
                  }
                },
                "r": {
                  "t": "unop",
                  "op": "not",
                  "e": {
                    "t": "member",
                    "src": "tags",
                    "key": "meat"
                  }
                }
              },
              "r": {
                "t": "unop",
                "op": "not",
                "e": {
                  "t": "member",
                  "src": "tags",
                  "key": "fish"
                }
              }
            },
            "r": {
              "t": "unop",
              "op": "not",
              "e": {
                "t": "member",
                "src": "tags",
                "key": "egg"
              }
            }
          },
          "r": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "fat"
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "dairy"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "magic"
        }
      }
    },
    "name": "皮弗娄牛零食",
    "nameEn": "Beefalo Treats"
  },
  {
    "id": "shroombait",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": -20,
      "hunger": 18.75,
      "sanity": -15
    },
    "perishtime": 7200,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": ">=",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "moon_cap"
          },
          "r": {
            "t": "num",
            "v": 0
          }
        },
        "r": {
          "t": "num",
          "v": 2
        }
      },
      "r": {
        "t": "member",
        "src": "names",
        "key": "monstermeat"
      }
    },
    "name": "酿夜帽",
    "nameEn": "Stuffed Night Cap"
  },
  {
    "id": "nightmarepie",
    "cookers": [
      "portablecookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 1,
      "hunger": 25,
      "sanity": 5
    },
    "perishtime": 4800,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "names",
            "key": "nightmarefuel"
          },
          "r": {
            "t": "binop",
            "op": "==",
            "l": {
              "t": "member",
              "src": "names",
              "key": "nightmarefuel"
            },
            "r": {
              "t": "num",
              "v": 2
            }
          }
        },
        "r": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "potato"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "potato_cooked"
          }
        }
      },
      "r": {
        "t": "binop",
        "op": "or",
        "l": {
          "t": "member",
          "src": "names",
          "key": "onion"
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "onion_cooked"
        }
      }
    },
    "name": "恐怖国王饼",
    "nameEn": "Grim Galette"
  },
  {
    "id": "voltgoatjelly",
    "cookers": [
      "portablecookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 3,
      "hunger": 37.5,
      "sanity": 10
    },
    "perishtime": 4800,
    "foodtype": "GOODIES",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "names",
          "key": "lightninggoathorn"
        },
        "r": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "sweetener"
          },
          "r": {
            "t": "binop",
            "op": ">=",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "sweetener"
            },
            "r": {
              "t": "num",
              "v": 2
            }
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "meat"
        }
      }
    },
    "name": "伏特羊肉冻",
    "nameEn": "Volt Goat Chaud-Froid"
  },
  {
    "id": "glowberrymousse",
    "cookers": [
      "portablecookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 1,
    "stats": {
      "health": 3,
      "hunger": 37.5,
      "sanity": 10
    },
    "perishtime": 3840,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "wormlight"
            },
            "r": {
              "t": "binop",
              "op": "and",
              "l": {
                "t": "member",
                "src": "names",
                "key": "wormlight_lesser"
              },
              "r": {
                "t": "binop",
                "op": ">=",
                "l": {
                  "t": "member",
                  "src": "names",
                  "key": "wormlight_lesser"
                },
                "r": {
                  "t": "num",
                  "v": 2
                }
              }
            }
          },
          "r": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "fruit"
            },
            "r": {
              "t": "binop",
              "op": ">=",
              "l": {
                "t": "member",
                "src": "tags",
                "key": "fruit"
              },
              "r": {
                "t": "num",
                "v": 2
              }
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "发光浆果慕斯",
    "nameEn": "Glow Berry Mousse"
  },
  {
    "id": "frogfishbowl",
    "cookers": [
      "portablecookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": -10
    },
    "perishtime": 3840,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "binop",
                "op": "and",
                "l": {
                  "t": "member",
                  "src": "names",
                  "key": "froglegs"
                },
                "r": {
                  "t": "binop",
                  "op": ">=",
                  "l": {
                    "t": "member",
                    "src": "names",
                    "key": "froglegs"
                  },
                  "r": {
                    "t": "num",
                    "v": 2
                  }
                }
              },
              "r": {
                "t": "binop",
                "op": "and",
                "l": {
                  "t": "member",
                  "src": "names",
                  "key": "froglegs_cooked"
                },
                "r": {
                  "t": "binop",
                  "op": ">=",
                  "l": {
                    "t": "member",
                    "src": "names",
                    "key": "froglegs_cooked"
                  },
                  "r": {
                    "t": "num",
                    "v": 2
                  }
                }
              }
            },
            "r": {
              "t": "binop",
              "op": "and",
              "l": {
                "t": "member",
                "src": "names",
                "key": "froglegs"
              },
              "r": {
                "t": "member",
                "src": "names",
                "key": "froglegs_cooked"
              }
            }
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "fish"
          }
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "fish"
          },
          "r": {
            "t": "num",
            "v": 1
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "蓝带鱼排",
    "nameEn": "Fish Cordon Bleu"
  },
  {
    "id": "dragonchilisalad",
    "cookers": [
      "portablecookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 0.75,
    "stats": {
      "health": -3,
      "hunger": 25,
      "sanity": 10
    },
    "perishtime": 7200,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "dragonfruit"
              },
              "r": {
                "t": "member",
                "src": "names",
                "key": "dragonfruit_cooked"
              }
            },
            "r": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "member",
                "src": "names",
                "key": "pepper"
              },
              "r": {
                "t": "member",
                "src": "names",
                "key": "pepper_cooked"
              }
            }
          },
          "r": {
            "t": "unop",
            "op": "not",
            "e": {
              "t": "member",
              "src": "tags",
              "key": "meat"
            }
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "inedible"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "egg"
        }
      }
    },
    "name": "辣龙椒沙拉",
    "nameEn": "Hot Dragon Chili Salad"
  },
  {
    "id": "gazpacho",
    "cookers": [
      "portablecookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": 3,
      "hunger": 25,
      "sanity": 10
    },
    "perishtime": 7200,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "or",
        "l": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "member",
              "src": "names",
              "key": "asparagus"
            },
            "r": {
              "t": "binop",
              "op": ">=",
              "l": {
                "t": "member",
                "src": "names",
                "key": "asparagus"
              },
              "r": {
                "t": "num",
                "v": 2
              }
            }
          },
          "r": {
            "t": "binop",
            "op": "and",
            "l": {
              "t": "member",
              "src": "names",
              "key": "asparagus_cooked"
            },
            "r": {
              "t": "binop",
              "op": ">=",
              "l": {
                "t": "member",
                "src": "names",
                "key": "asparagus_cooked"
              },
              "r": {
                "t": "num",
                "v": 2
              }
            }
          }
        },
        "r": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "names",
            "key": "asparagus"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "asparagus_cooked"
          }
        }
      },
      "r": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "frozen"
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "frozen"
          },
          "r": {
            "t": "num",
            "v": 2
          }
        }
      }
    },
    "name": "芦笋冷汤",
    "nameEn": "Asparagazpacho"
  },
  {
    "id": "potatosouffle",
    "cookers": [
      "portablecookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 20,
      "hunger": 37.5,
      "sanity": 15
    },
    "perishtime": 4800,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "binop",
              "op": "or",
              "l": {
                "t": "binop",
                "op": "and",
                "l": {
                  "t": "member",
                  "src": "names",
                  "key": "potato"
                },
                "r": {
                  "t": "binop",
                  "op": ">=",
                  "l": {
                    "t": "member",
                    "src": "names",
                    "key": "potato"
                  },
                  "r": {
                    "t": "num",
                    "v": 2
                  }
                }
              },
              "r": {
                "t": "binop",
                "op": "and",
                "l": {
                  "t": "member",
                  "src": "names",
                  "key": "potato_cooked"
                },
                "r": {
                  "t": "binop",
                  "op": ">=",
                  "l": {
                    "t": "member",
                    "src": "names",
                    "key": "potato_cooked"
                  },
                  "r": {
                    "t": "num",
                    "v": 2
                  }
                }
              }
            },
            "r": {
              "t": "binop",
              "op": "and",
              "l": {
                "t": "member",
                "src": "names",
                "key": "potato"
              },
              "r": {
                "t": "member",
                "src": "names",
                "key": "potato_cooked"
              }
            }
          },
          "r": {
            "t": "member",
            "src": "tags",
            "key": "egg"
          }
        },
        "r": {
          "t": "unop",
          "op": "not",
          "e": {
            "t": "member",
            "src": "tags",
            "key": "meat"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "蓬松土豆蛋奶酥",
    "nameEn": "Puffed Potato Soufflé"
  },
  {
    "id": "monstertartare",
    "cookers": [
      "portablecookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 0.5,
    "stats": {
      "health": -20,
      "hunger": 62.5,
      "sanity": -20
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "monster"
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "monster"
          },
          "r": {
            "t": "num",
            "v": 2
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "怪物鞑靼",
    "nameEn": "Monster Tartare"
  },
  {
    "id": "freshfruitcrepes",
    "cookers": [
      "portablecookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 60,
      "hunger": 150,
      "sanity": 15
    },
    "perishtime": 4800,
    "foodtype": "VEGGIE",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "fruit"
          },
          "r": {
            "t": "binop",
            "op": ">=",
            "l": {
              "t": "member",
              "src": "tags",
              "key": "fruit"
            },
            "r": {
              "t": "num",
              "v": 1.5
            }
          }
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "butter"
        }
      },
      "r": {
        "t": "member",
        "src": "names",
        "key": "honey"
      }
    },
    "name": "鲜果可丽饼",
    "nameEn": "Fresh Fruit Crepes"
  },
  {
    "id": "bonesoup",
    "cookers": [
      "portablecookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 32,
      "hunger": 150,
      "sanity": 5
    },
    "perishtime": 4800,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "names",
            "key": "boneshard"
          },
          "r": {
            "t": "binop",
            "op": "==",
            "l": {
              "t": "member",
              "src": "names",
              "key": "boneshard"
            },
            "r": {
              "t": "num",
              "v": 2
            }
          }
        },
        "r": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "onion"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "onion_cooked"
          }
        }
      },
      "r": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        },
        "r": {
          "t": "binop",
          "op": "<",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "inedible"
          },
          "r": {
            "t": "num",
            "v": 3
          }
        }
      }
    },
    "name": "骨头汤",
    "nameEn": "Bone Bouillon"
  },
  {
    "id": "moqueca",
    "cookers": [
      "portablecookpot"
    ],
    "priority": 30,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 60,
      "hunger": 112.5,
      "sanity": 33
    },
    "perishtime": 3840,
    "foodtype": "MEAT",
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "binop",
          "op": "and",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "fish"
          },
          "r": {
            "t": "binop",
            "op": "or",
            "l": {
              "t": "member",
              "src": "names",
              "key": "onion"
            },
            "r": {
              "t": "member",
              "src": "names",
              "key": "onion_cooked"
            }
          }
        },
        "r": {
          "t": "binop",
          "op": "or",
          "l": {
            "t": "member",
            "src": "names",
            "key": "tomato"
          },
          "r": {
            "t": "member",
            "src": "names",
            "key": "tomato_cooked"
          }
        }
      },
      "r": {
        "t": "unop",
        "op": "not",
        "e": {
          "t": "member",
          "src": "tags",
          "key": "inedible"
        }
      }
    },
    "name": "海鲜杂烩",
    "nameEn": "Moqueca"
  },
  {
    "id": "batnosehat",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 55,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 0,
      "hunger": 3.90625,
      "sanity": 0
    },
    "perishtime": 0,
    "foodtype": null,
    "test": {
      "t": "binop",
      "op": "and",
      "l": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "names",
          "key": "batnose"
        },
        "r": {
          "t": "member",
          "src": "names",
          "key": "kelp"
        }
      },
      "r": {
        "t": "binop",
        "op": "and",
        "l": {
          "t": "member",
          "src": "tags",
          "key": "dairy"
        },
        "r": {
          "t": "binop",
          "op": ">=",
          "l": {
            "t": "member",
            "src": "tags",
            "key": "dairy"
          },
          "r": {
            "t": "num",
            "v": 1
          }
        }
      }
    },
    "name": "牛奶帽",
    "nameEn": "Milkmade Hat"
  },
  {
    "id": "dustmeringue",
    "cookers": [
      "cookpot",
      "portablecookpot",
      "archive_cookpot"
    ],
    "priority": 100,
    "weight": 1,
    "cooktime": 2,
    "stats": {
      "health": 0,
      "hunger": 12.5,
      "sanity": 0
    },
    "perishtime": null,
    "foodtype": "ELEMENTAL",
    "test": {
      "t": "member",
      "src": "names",
      "key": "refined_dust"
    },
    "name": "琥珀美食",
    "nameEn": "Amberosia"
  }
];
