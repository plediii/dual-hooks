/*jslint node: true */
"use strict";

var _ = require('lodash');
var assert = require('assert');

var dualproto = require('dual-protocol');

describe('dual-hooks broadcaster', function () {
    
    var d, h;
    beforeEach(function () {
        // d = (dualproto.use(require('../index')))()
        d = (dualproto.use(require('../index')))();
        h = d.hooks();
    });

    describe('subscribe', function () {
        it('should call the database subscribe method', function (done) {
            var b = h.broadcaster({
                data: {
                    subscribe: function () {
                        done();
                    }
                }
            });
            b.subscribe(['id', 'topic'], ['subscribe', 'er']);
        });

        it('should return a then-able, catch-able promise', function (done) {
            var b = h.broadcaster({
                data: {
                    subscribe: function () {
                        done();
                    }
                }
            });
            var result = b.subscribe(['id', 'topic'], ['subscribe', 'er']);
            assert(_.isFunction(result.then));
            assert(_.isFunction(result.catch));
        });

        it('should call subscribe with subscription point', function () {
            var b = h.broadcaster({
                data: {
                    subscribe: function (subscription) {
                        assert.deepEqual(subscription, ['id', 'topic']);
                    }
                }
            });
            b.subscribe(['id', 'topic'], ['subscribe', 'er']);
        });

        it('should call subscribe with subscriber point', function () {
            var b = h.broadcaster({
                data: {
                    subscribe: function (subscription, subscriber) {
                        assert.deepEqual(subscriber, ['subscribe', 'er']);
                    }
                }
            });
            b.subscribe(['id', 'topic'], ['subscribe', 'er']);
        });
    });

    describe('unusbscribe', function () {
        it('should call the database unsubscribe method', function (done) {
            var b = h.broadcaster({
                data: {
                    unsubscribe: function () {
                        done();
                    }
                }
            });
            b.unsubscribe(['id', 'topic'], ['subscribe', 'er']);
        });

        it('should return a then-able, catch-able promise', function (done) {
            var b = h.broadcaster({
                data: {
                    unsubscribe: function () {
                        done();
                    }
                }
            });
            var result = b.unsubscribe(['id', 'topic'], ['subscribe', 'er']);
            assert(_.isFunction(result.then));
            assert(_.isFunction(result.catch));
        });

        it('should call unsubscribe with subscription point', function () {
            var b = h.broadcaster({
                data: {
                    unsubscribe: function (subscription) {
                        assert.deepEqual(subscription, ['id', 'topic']);
                    }
                }
            });
            b.unsubscribe(['id', 'topic'], ['subscribe', 'er']);
        });

        it('should call unsubscribe with subscriber point', function () {
            var b = h.broadcaster({
                data: {
                    unsubscribe: function (subscription, subscriber) {
                        assert.deepEqual(subscriber, ['subscribe', 'er']);
                    }
                }
            });
            b.unsubscribe(['id', 'topic'], ['subscribe', 'er']);
        });
    });

    describe('send', function () {
        it('should request subscription list', function (done) {
            var b = h.broadcaster({
                data: {
                    subscribers: function (cb) {
                        done();
                    }
                }
            });
            b.send(['id', 'topic'], { message: 'body'}, { optional: 'hello'});
        });

        it('should return a then-able, catch-able promise', function () {
            var b = h.broadcaster({
                data: {
                    subscribers: function () {}
                }
            });
            var result = b.send(['id', 'topic'], { message: 'body'}, { optional: 'hello'});
            assert(_.isFunction(result.then));
            assert(_.isFunction(result.catch));
        });

        it('should request subscribers with subscription point', function () {
            var b = h.broadcaster({
                data: {
                    subscribers: function (subscription) {
                        assert(_.isEqual(subscription, ['id', 'topic']));
                    }
                }
            });
            b.send(['id', 'topic'], { message: 'body'}, { optional: 'hello'});
        });

        it('should send messages to each returned subscriber', function (done) {
            d.mount(['destination'], function () {
                done();
            });
            var b = h.broadcaster({
                data: {
                    send: function (subscription) {
                        return ['destination', 'destination2'];
                    }
                }
            });
            b.send(['id', 'topic'], { message: 'body'}, { optional: 'hello'});
        });

        it('should send messages to each returned subscriber (2)', function (done) {
            d.mount(['destination2'], function () {
                done();
            });
            var b = h.broadcaster({
                data: {
                    send: function (subscription) {
                        return ['destination', 'destination2'];  
                    }
                }
            });
            b.send(['id', 'topic'], { message: 'body'}, { optional: 'hello'});
        });

        it('should send message body to returned subscribers', function () {
            d.mount(['destination'], function (body) {
                assert.equal(body.message, 'body');
            });
            var b = h.broadcaster({
                data: {
                    send: function (subscription) {
                        return ['destination'];
                    }
                }
            });
            b.send(['id', 'topic'], { message: 'body'}, { optional: 'hello'});
        });

        it('should send message options to returned subscribers', function () {
            d.mount(['destination'], function (body, ctxt) {
                assert.equal(ctxt.options.optional, 'hello');
            });
            var b = h.broadcaster({
                data: {
                    send: function (subscription) {
                        return ['destination'];
                    }
                }
            });
            b.send(['id', 'topic'], { message: 'body'}, { optional: 'hello'});
        });
    });

    describe('disconnect', function () {
        it('should call disconnect', function (done) {
            var b = h.broadcaster({
                data: {
                    disconnect: function () {
                        done();
                    }
                }
            });
            b.disconnect(['id', 'topic'], ['subscrib', 'er']);
        });

        it('should return a then-able, catch-able promise', function () {
            var b = h.broadcaster({
                data: {
                    disconnect: function () {}
                }
            });
            var result = b.disconnect(['id', 'topic'], ['subscrib', 'er']);
            assert(_.isFunction(result.then));
            assert(_.isFunction(result.catch));
        });

        it('should call disconnect with subscription root', function () {
            var b = h.broadcaster({
                data: {
                    disconnect: function (subscription) {
                        assert.deepEqual(subscription, ['id', 'topic']);
                    }
                }
            });
            b.disconnect(['id', 'topic'], ['subscrib', 'er']);
        });

        it('should call disconnect with subscriber root', function () {
            var b = h.broadcaster({
                data: {
                    disconnect: function (subscription, subscriber) {
                        assert.deepEqual(subscriber, ['subscrib', 'er']);
                    }
                }
            });
            b.disconnect(['id', 'topic'], ['subscrib', 'er']);
        });
    });
});
