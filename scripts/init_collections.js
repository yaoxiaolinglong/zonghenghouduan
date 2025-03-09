// 创建玩家集合
const players = db.createCollection('players', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'level', 'spirit', 'physique', 'comprehension', 'stones', 'total_cultivations', 'inventory_capacity'],
            properties: {
                name: { bsonType: 'string', description: '玩家名称' },
                level: { bsonType: 'int', minimum: 1, description: '玩家等级' },
                spirit: { bsonType: 'int', minimum: 0, description: '灵力' },
                physique: { bsonType: 'int', minimum: 0, description: '体质' },
                comprehension: { bsonType: 'int', minimum: 0, description: '悟性' },
                stones: { bsonType: 'int', minimum: 0, description: '灵石数量' },
                total_cultivations: { bsonType: 'int', minimum: 0, description: '总修炼次数' },
                inventory_capacity: { bsonType: 'int', minimum: 0, description: '背包容量' },
                equipped_artifact: { bsonType: 'string', description: '装备的法器' },
                sound_enabled: { bsonType: 'bool', description: '音效开关' },
                auto_save_enabled: { bsonType: 'bool', description: '自动保存开关' },
                created_at: { bsonType: 'date', description: '创建时间' },
                updated_at: { bsonType: 'date', description: '更新时间' }
            }
        }
    }
});

// 创建物品集合
const items = db.createCollection('items', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['item_id', 'name', 'type', 'rarity', 'price'],
            properties: {
                item_id: { bsonType: 'string', description: '物品唯一标识' },
                name: { bsonType: 'string', description: '物品名称' },
                description: { bsonType: 'string', description: '物品描述' },
                type: { enum: ['pill', 'artifact', 'stone'], description: '物品类型' },
                rarity: { enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'], description: '物品稀有度' },
                spirit_effect: { bsonType: 'int', description: '灵力效果' },
                physique_effect: { bsonType: 'int', description: '体质效果' },
                comprehension_effect: { bsonType: 'int', description: '悟性效果' },
                spirit_bonus: { bsonType: 'int', description: '灵力加成' },
                physique_bonus: { bsonType: 'int', description: '体质加成' },
                comprehension_bonus: { bsonType: 'int', description: '悟性加成' },
                value: { bsonType: 'int', description: '物品价值' },
                price: { bsonType: 'int', description: '物品价格' },
                stackable: { bsonType: 'bool', description: '是否可堆叠' },
                created_at: { bsonType: 'date', description: '创建时间' },
                updated_at: { bsonType: 'date', description: '更新时间' }
            }
        }
    }
});

// 创建玩家物品关联集合
const player_items = db.createCollection('player_items', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['player_id', 'item_id', 'quantity'],
            properties: {
                player_id: { bsonType: 'objectId', description: '玩家ID' },
                item_id: { bsonType: 'string', description: '物品ID' },
                quantity: { bsonType: 'int', minimum: 1, description: '物品数量' },
                created_at: { bsonType: 'date', description: '创建时间' },
                updated_at: { bsonType: 'date', description: '更新时间' }
            }
        }
    }
});

// 创建功法集合
const skills = db.createCollection('skills', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['skill_id', 'name', 'type', 'level_required', 'price'],
            properties: {
                skill_id: { bsonType: 'string', description: '功法唯一标识' },
                name: { bsonType: 'string', description: '功法名称' },
                description: { bsonType: 'string', description: '功法描述' },
                type: { enum: ['basic', 'advanced', 'special'], description: '功法类型' },
                level_required: { bsonType: 'int', minimum: 1, description: '所需等级' },
                spirit_required: { bsonType: 'int', description: '所需灵力' },
                physique_required: { bsonType: 'int', description: '所需体质' },
                comprehension_required: { bsonType: 'int', description: '所需悟性' },
                spirit_bonus: { bsonType: 'int', description: '灵力加成' },
                physique_bonus: { bsonType: 'int', description: '体质加成' },
                comprehension_bonus: { bsonType: 'int', description: '悟性加成' },
                cultivation_bonus: { bsonType: 'double', description: '修炼加成' },
                price: { bsonType: 'int', description: '功法价格' },
                created_at: { bsonType: 'date', description: '创建时间' },
                updated_at: { bsonType: 'date', description: '更新时间' }
            }
        }
    }
});

// 创建玩家功法关联集合
const player_skills = db.createCollection('player_skills', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['player_id', 'skill_id'],
            properties: {
                player_id: { bsonType: 'objectId', description: '玩家ID' },
                skill_id: { bsonType: 'string', description: '功法ID' },
                learned_at: { bsonType: 'date', description: '学习时间' }
            }
        }
    }
});

// 创建成就集合
const achievements = db.createCollection('achievements', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['achievement_id', 'name', 'type'],
            properties: {
                achievement_id: { bsonType: 'string', description: '成就唯一标识' },
                name: { bsonType: 'string', description: '成就名称' },
                description: { bsonType: 'string', description: '成就描述' },
                type: { enum: ['cultivation', 'collection', 'skill', 'special'], description: '成就类型' },
                level_required: { bsonType: 'int', description: '所需等级' },
                cultivations_required: { bsonType: 'int', description: '所需修炼次数' },
                spirit_reward: { bsonType: 'int', description: '灵力奖励' },
                physique_reward: { bsonType: 'int', description: '体质奖励' },
                comprehension_reward: { bsonType: 'int', description: '悟性奖励' },
                stones_reward: { bsonType: 'int', description: '灵石奖励' },
                created_at: { bsonType: 'date', description: '创建时间' },
                updated_at: { bsonType: 'date', description: '更新时间' }
            }
        }
    }
});

// 创建玩家成就关联集合
const player_achievements = db.createCollection('player_achievements', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['player_id', 'achievement_id'],
            properties: {
                player_id: { bsonType: 'objectId', description: '玩家ID' },
                achievement_id: { bsonType: 'string', description: '成就ID' },
                unlocked_at: { bsonType: 'date', description: '解锁时间' }
            }
        }
    }
});

// 创建商店集合
const shops = db.createCollection('shops', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['item_id', 'type', 'price'],
            properties: {
                item_id: { bsonType: 'string', description: '物品ID' },
                type: { enum: ['item', 'skill'], description: '商店类型' },
                quantity: { bsonType: 'int', description: '物品数量' },
                price: { bsonType: 'int', description: '物品价格' },
                discount: { bsonType: 'int', description: '折扣' },
                level_required: { bsonType: 'int', description: '所需等级' },
                start_time: { bsonType: 'date', description: '开始时间' },
                end_time: { bsonType: 'date', description: '结束时间' },
                is_special: { bsonType: 'bool', description: '是否为特殊商店' },
                created_at: { bsonType: 'date', description: '创建时间' },
                updated_at: { bsonType: 'date', description: '更新时间' }
            }
        }
    }
});

// 创建交易记录集合
const trades = db.createCollection('trades', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['player_id', 'type', 'item_id', 'quantity', 'price', 'total_price', 'balance_before', 'balance_after'],
            properties: {
                player_id: { bsonType: 'objectId', description: '玩家ID' },
                type: { enum: ['buy', 'sell', 'use'], description: '交易类型' },
                item_id: { bsonType: 'string', description: '物品ID' },
                quantity: { bsonType: 'int', description: '交易数量' },
                price: { bsonType: 'int', description: '单价' },
                total_price: { bsonType: 'int', description: '总价' },
                balance_before: { bsonType: 'int', description: '交易前余额' },
                balance_after: { bsonType: 'int', description: '交易后余额' },
                created_at: { bsonType: 'date', description: '交易时间' }
            }
        }
    }
});

// 创建境界集合
const realms = db.createCollection('realms', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['realm_id', 'name', 'level', 'player_level_required', 'spirit_required', 'physique_required', 'comprehension_required'],
            properties: {
                realm_id: { bsonType: 'string', description: '境界唯一标识' },
                name: { bsonType: 'string', description: '境界名称' },
                description: { bsonType: 'string', description: '境界描述' },
                level: { bsonType: 'int', description: '境界等级' },
                player_level_required: { bsonType: 'int', description: '所需玩家等级' },
                spirit_required: { bsonType: 'int', description: '所需灵力' },
                physique_required: { bsonType: 'int', description: '所需体质' },
                comprehension_required: { bsonType: 'int', description: '所需悟性' },
                spirit_multiplier: { bsonType: 'double', description: '灵力倍数' },
                physique_multiplier: { bsonType: 'double', description: '体质倍数' },
                comprehension_multiplier: { bsonType: 'double', description: '悟性倍数' },
                cultivation_multiplier: { bsonType: 'double', description: '修炼倍数' },
                created_at: { bsonType: 'date', description: '创建时间' },
                updated_at: { bsonType: 'date', description: '更新时间' }
            }
        }
    }
});

// 创建区域集合
const areas = db.createCollection('areas', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['area_id', 'name', 'type', 'level', 'player_level_required'],
            properties: {
                area_id: { bsonType: 'string', description: '区域唯一标识' },
                name: { bsonType: 'string', description: '区域名称' },
                description: { bsonType: 'string', description: '区域描述' },
                type: { enum: ['city', 'sect', 'wilderness', 'dungeon', 'secret'], description: '区域类型' },
                level: { bsonType: 'int', description: '区域等级' },
                player_level_required: { bsonType: 'int', description: '所需玩家等级' },
                realm_id: { bsonType: 'string', description: '所需境界' },
                created_at: { bsonType: 'date', description: '创建时间' },
                updated_at: { bsonType: 'date', description: '更新时间' }
            }
        }
    }
});

// 创建区域资源集合
const area_resources = db.createCollection('area_resources', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['area_id', 'item_id', 'respawn_time', 'max_quantity', 'current_quantity'],
            properties: {
                area_id: { bsonType: 'string', description: '区域ID' },
                item_id: { bsonType: 'string', description: '物品ID' },
                respawn_time: { bsonType: 'int', description: '重生时间' },
                max_quantity: { bsonType: 'int', description: '最大数量' },
                current_quantity: { bsonType: 'int', description: '当前数量' },
                last_respawn: { bsonType: 'date', description: '上次重生时间' }
            }
        }
    }
});

// 创建怪物集合
const monsters = db.createCollection('monsters', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['monster_id', 'name', 'level', 'type', 'health', 'attack', 'defense', 'speed', 'experience', 'stones'],
            properties: {
                monster_id: { bsonType: 'string', description: '怪物唯一标识' },
                name: { bsonType: 'string', description: '怪物名称' },
                description: { bsonType: 'string', description: '怪物描述' },
                level: { bsonType: 'int', description: '怪物等级' },
                type: { enum: ['normal', 'elite', 'boss'], description: '怪物类型' },
                health: { bsonType: 'int', description: '生命值' },
                attack: { bsonType: 'int', description: '攻击力' },
                defense: { bsonType: 'int', description: '防御力' },
                speed: { bsonType: 'int', description: '速度' },
                experience: { bsonType: 'int', description: '经验值' },
                stones: { bsonType: 'int', description: '掉落灵石' },
                created_at: { bsonType: 'date', description: '创建时间' },
                updated_at: { bsonType: 'date', description: '更新时间' }
            }
        }
    }
});

// 创建区域怪物集合
const area_monsters = db.createCollection('area_monsters', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['area_id', 'monster_id', 'level', 'respawn_time', 'max_quantity', 'current_quantity'],
            properties: {
                area_id: { bsonType: 'string', description: '区域ID' },
                monster_id: { bsonType: 'string', description: '怪物ID' },
                level: { bsonType: 'int', description: '怪物等级' },
                respawn_time: { bsonType: 'int', description: '重生时间' },
                max_quantity: { bsonType: 'int', description: '最大数量' },
                current_quantity: { bsonType: 'int', description: '当前数量' },
                last_respawn: { bsonType: 'date', description: '上次重生时间' }
            }
        }
    }
});

// 创建战斗记录集合
const combats = db.createCollection('combats', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['combat_id', 'type', 'area_id', 'status'],
            properties: {
                combat_id: { bsonType: 'string', description: '战斗唯一标识' },
                type: { enum: ['pve', 'pvp', 'boss'], description: '战斗类型' },
                area_id: { bsonType: 'string', description: '区域ID' },
                status: { enum: ['ongoing', 'victory', 'defeat', 'draw'], description: '战斗状态' },
                start_time: { bsonType: 'date', description: '开始时间' },
                end_time: { bsonType: 'date', description: '结束时间' },
                duration: { bsonType: 'int', description: '持续时间' },
                created_at: { bsonType: 'date', description: '创建时间' },
                updated_at: { bsonType: 'date', description: '更新时间' }
            }
        }
    }
});

// 创建战斗参与者集合
const combat_participants = db.createCollection('combat_participants', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['combat_id', 'player_id', 'team', 'initial_health', 'initial_spirit', 'initial_physique', 'initial_comprehension', 'current_health', 'current_spirit', 'current_physique', 'current_comprehension'],
            properties: {
                combat_id: { bsonType: 'string', description: '战斗ID' },
                player_id: { bsonType: 'objectId', description: '玩家ID' },
                team: { enum: ['attacker', 'defender'], description: '队伍' },
                initial_health: { bsonType: 'int', description: '初始生命值' },
                initial_spirit: { bsonType: 'int', description: '初始灵力' },
                initial_physique: { bsonType: 'int', description: '初始体质' },
                initial_comprehension: { bsonType: 'int', description: '初始悟性' },
                current_health: { bsonType: 'int', description: '当前生命值' },
                current_spirit: { bsonType: 'int', description: '当前灵力' },
                current_physique: { bsonType: 'int', description: '当前体质' },
                current_comprehension: { bsonType: 'int', description: '当前悟性' }
            }
        }
    }
});

// 创建战斗回合集合
const combat_rounds = db.createCollection('combat_rounds', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['combat_id', 'round_number', 'actor_id', 'target_id', 'action_type'],
            properties: {
                combat_id: { bsonType: 'string', description: '战斗ID' },
                round_number: { bsonType: 'int', description: '回合数' },
                actor_id: { bsonType: 'string', description: '行动者ID' },
                target_id: { bsonType: 'string', description: '目标ID' },
                action_type: { enum: ['attack', 'skill', 'item'], description: '行动类型' },
                action_id: { bsonType: 'string', description: '行动ID' },
                damage: { bsonType: 'int', description: '伤害值' },
                healing: { bsonType: 'int', description: '治疗值' },
                timestamp: { bsonType: 'date', description: '时间戳' }
            }
        }
    }
});

// 创建任务集合
const quests = db.createCollection('quests', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['quest_id', 'name', 'type', 'category', 'level', 'player_level_required', 'npc_id', 'area_id'],
            properties: {
                quest_id: { bsonType: 'string', description: '任务唯一标识' },
                name: { bsonType: 'string', description: '任务名称' },
                description: { bsonType: 'string', description: '任务描述' },
                type: { enum: ['main', 'side', 'daily', 'weekly', 'achievement'], description: '任务类型' },
                category: { enum: ['combat', 'collection', 'exploration', 'cultivation'], description: '任务类别' },
                level: { bsonType: 'int', description: '任务等级' },
                player_level_required: { bsonType: 'int', description: '所需玩家等级' },
                realm_id: { bsonType: 'string', description: '所需境界' },
                time_limit: { bsonType: 'int', description: '时间限制' },
                cooldown: { bsonType: 'int', description: '冷却时间' },
                is_repeatable: { bsonType: 'bool', description: '是否可重复' },
                npc_id: { bsonType: 'string', description: '任务发布NPC' },
                area_id: { bsonType: 'string', description: '任务所在区域' },
                created_at: { bsonType: 'date', description: '创建时间' },
                updated_at: { bsonType: 'date', description: '更新时间' }
            }
        }
    }
});

// 创建玩家任务集合
const player_quests = db.createCollection('player_quests', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['player_id', 'quest_id', 'status'],
            properties: {
                player_id: { bsonType: 'objectId', description: '玩家ID' },
                quest_id: { bsonType: 'string', description: '任务ID' },
                status: { enum: ['accepted', 'completed', 'failed'], description: '任务状态' },
                progress: { bsonType: 'object', description: '任务进度' },
                start_time: { bsonType: 'date', description: '开始时间' },
                complete_time: { bsonType: 'date', description: '完成时间' }
            }
        }
    }
});

// 创建宗门集合
const sects = db.createCollection('sects', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['sect_id', 'name', 'type', 'level', 'player_level_required'],
            properties: {
                sect_id: { bsonType: 'string', description: '宗门唯一标识' },
                name: { bsonType: 'string', description: '宗门名称' },
                description: { bsonType: 'string', description: '宗门描述' },
                type: { enum: ['righteous', 'evil', 'neutral'], description: '宗门类型' },
                level: { bsonType: 'int', description: '宗门等级' },
                reputation: { bsonType: 'int', description: '声望' },
                player_level_required: { bsonType: 'int', description: '所需玩家等级' },
                spirit_required: { bsonType: 'int', description: '所需灵力' },
                physique_required: { bsonType: 'int', description: '所需体质' },
                comprehension_required: { bsonType: 'int', description: '所需悟性' },
                cultivation_bonus: { bsonType: 'double', description: '修炼加成' },
                skill_discount: { bsonType: 'int', description: '功法折扣' },
                item_discount: { bsonType: 'int', description: '物品折扣' },
                created_at: { bsonType: 'date', description: '创建时间' },
                updated_at: { bsonType: 'date', description: '更新时间' }
            }
        }
    }
});

// 创建宗门成员集合
const sect_members = db.createCollection('sect_members', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['sect_id', 'player_id', 'rank'],
            properties: {
                sect_id: { bsonType: 'string', description: '宗门ID' },
                player_id: { bsonType: 'objectId', description: '玩家ID' },
                rank: { bsonType: 'int', description: '成员等级' },
                reputation: { bsonType: 'int', description: '成员声望' },
                join_time: { bsonType: 'date', description: '加入时间' },
                stones_contributed: { bsonType: 'int', description: '贡献灵石' }
            }
        }
    }
});

// 创建宗门设施集合
const sect_facilities = db.createCollection('sect_facilities', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['sect_id', 'type', 'level', 'capacity'],
            properties: {
                sect_id: { bsonType: 'string', description: '宗门ID' },
                type: { enum: ['cultivation', 'forge', 'alchemy', 'library', 'trade'], description: '设施类型' },
                level: { bsonType: 'int', description: '设施等级' },
                capacity: { bsonType: 'int', description: '设施容量' },
                bonus: { bsonType: 'double', description: '设施加成' }
            }
        }
    }
});

// 创建消息集合
const messages = db.createCollection('messages', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['player_id', 'type', 'title', 'content'],
            properties: {
                player_id: { bsonType: 'objectId', description: '玩家ID' },
                type: { enum: ['system', 'achievement', 'event', 'trade'], description: '消息类型' },
                title: { bsonType: 'string', description: '消息标题' },
                content: { bsonType: 'string', description: '消息内容' },
                data: { bsonType: 'object', description: '附加数据' },
                is_read: { bsonType: 'bool', description: '是否已读' },
                expire_at: { bsonType: 'date', description: '过期时间' },
                created_at: { bsonType: 'date', description: '创建时间' }
            }
        }
    }
}); 