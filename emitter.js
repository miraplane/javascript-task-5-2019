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
        students: [],
        events: [],
        severalTimes: [],

        checkHandler: function (handler) {
            if (handler.hasOwnProperty('timer')) {
                if (handler.timer === 0) {
                    return false;
                }
                handler.timer -= 1;
            }
            if (handler.hasOwnProperty('every')) {
                if (handler.count !== handler.every) {
                    handler.count += 1;

                    return false;
                }

                handler.count = 1;
            }

            return true;
        },

        callAllHandlers: function (student, part) {
            for (let handler of student[part].handlers) {
                if (this.checkHandler(handler)) {
                    handler.call(student);
                }
            }
        },

        callHandler: function (part) {
            for (let student of this.students) {
                if (student.hasOwnProperty(part)) {
                    this.callAllHandlers(student, part);
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
            if (this.students.indexOf(context) === -1) {
                this.students.push(context);
            }
            if (this.events.indexOf(event) === -1) {
                this.events.push(event);
            }
            if (context.hasOwnProperty(event)) {
                context[event].handlers.push(handler);
            } else {
                context[event] = { handlers: [handler] };
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
            for (let e of this.events) {
                if (e.indexOf(event) !== -1 && context.hasOwnProperty(e)) {
                    delete context[e];
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
            if (times > 0) {
                handler.timer = times;
            }
            this.on(event, context, handler);

            return this;
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
            if (frequency > 0) {
                handler.count = frequency;
                handler.every = frequency;
            }
            this.on(event, context, handler);

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
