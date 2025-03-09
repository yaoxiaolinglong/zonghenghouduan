/**
 * 境界系统数据模型
 * Realm System Data Model
 * 
 * 这个模型用于定义修仙境界及其属性
 * This model defines cultivation realms and their attributes
 */

const mongoose = require('mongoose');

const RealmSchema = new mongoose.Schema({
  realmId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  level: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String 
  },
  requirements: {
    playerLevel: { type: Number, required: true },
    spirit: { type: Number, required: true },
    intelligence: { type: Number, required: true },
    comprehension: { type: Number, default: 0 }
  },
  bonuses: {
    spiritMultiplier: { type: Number, default: 1.0 },
    strengthMultiplier: { type: Number, default: 1.0 },
    agilityMultiplier: { type: Number, default: 1.0 },
    intelligenceMultiplier: { type: Number, default: 1.0 },
    cultivationSpeed: { type: Number, default: 1.0 }
  },
  abilities: [{
    name: { type: String },
    description: { type: String },
    effect: { type: Object }
  }],
  nextRealm: { 
    type: String,
    ref: 'Realm'
  }
});

module.exports = mongoose.model('Realm', RealmSchema); 