'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        students: {},

        checkHandler: function (handler) {
            if (handler.hasOwnProperty('timer')) {
                if (handler.timer <= 0) {
                    return false;
                }
                handler.timer -= 1;
            }
            if (handler.hasOwnProperty('every')) {
                if (handler.count < handler.every) {
                    handler.count += 1;

                    return false;
                }

                handler.count = 1;
            }

            return true;
        },

        callHandler: function (part) {
            if (!this.students.hasOwnProperty(part)) {
                return;
            }
            for (let event of this.students[part]) {
                if (this.checkHandler(event.handler)) {
                    event.handler.call(event.context);
                }
            }
        },

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!this.students.hasOwnProperty(event)) {
                this.students[event] = [{ context: context, handler: handler }];

            } else {
                this.students[event].push({ context: context, handler: handler });
            }

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            for (let e of Object.getOwnPropertyNames(this.students)) {
                if (event === e || e.indexOf(event + '.') === 0) {
                    this.students[e] = this.students[e].filter(
                        handler => handler.context !== context
                    );
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let handler = event.split('.');
            for (let i = handler.length; i > 0; i--) {
                let part = handler.slice(0, i).join('.');
                this.callHandler(part);
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            let bindHandler = handler.bind(context);
            if (times > 0) {
                bindHandler.timer = times;
            }

            return this.on(event, context, bindHandler);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            let bindHandler = handler.bind(context);
            if (frequency > 0) {
                bindHandler.count = frequency;
                bindHandler.every = frequency;
            }

            return this.on(event, context, bindHandler);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
