/**
 * =====================================================
 * Discord Delivery Notifier
 * amazon-rules.js
 * =====================================================
 * Amazon Parser Rules
 * =====================================================
 */

"use strict";

/**
 * 配送通知系キーワード
 */
export const DELIVERY_KEYWORDS = [

    "発送",

    "配達",

    "お届け",

    "配送",

    "注文",

    "更新"

];

/**
 * 通知しないメール
 */
export const IGNORE_KEYWORDS = [

    "Prime",

    "プライム",

    "レビュー",

    "おすすめ",

    "タイムセール",

    "セール",

    "キャンペーン",

    "Kindle",

    "Audible",

    "Music",

    "Video",

    "Prime Video",

    "Prime Reading",

    "ほしい物リスト"

];