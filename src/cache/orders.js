/**
 * =====================================================
 * Discord Delivery Notifier
 * orders.js
 * =====================================================
 * Order Cache
 * =====================================================
 */

"use strict";

const orders = new Map();

/**
 * 注文保存
 *
 * @param {object} order
 */
export function saveOrder(order) {

    orders.set(

        order.orderId,

        {

            ...order,

            createdAt: Date.now()

        }

    );

}

/**
 * 注文取得
 *
 * @param {string} orderId
 * @returns {object|null}
 */
export function getOrder(orderId) {

    return orders.get(orderId) ?? null;

}

/**
 * 注文削除
 *
 * @param {string} orderId
 */
export function deleteOrder(orderId) {

    orders.delete(orderId);

}

/**
 * 期限切れ削除
 */
export function cleanupOrders() {

    const now = Date.now();

    const expire = 7 * 24 * 60 * 60 * 1000;

    for (const [orderId, order] of orders) {

        if (

            now - order.createdAt > expire

        ) {

            orders.delete(orderId);

        }

    }

}

/**
 * キャッシュ一覧取得
 *
 * @returns {Array}
 */
export function getOrders() {

    return Array.from(

        orders.values()

    );

}