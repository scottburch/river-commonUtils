defineModule(function (that) {

    that.Array = that.array = ArrayUtils();
    that.Function = that['function'] = FunctionUtils();
    that.Object = that.object = ObjectUtils();
    that.File = FileUtils();


    that.Collection = (function(commonUtils) {
        return function(that) {
            that = that || [];
            that.find = function(opt) {
                return commonUtils.array.find(that, opt);
            }
            return that;
        }
    }(that));

    that.jasmineSpecs = [
        'specs/CollectionSpec.js',
        'specs/FunctionSpec.js'
    ];

    function FileUtils() {

        var kb = 1024;
        var mb = kb * 1024;
        var gb = mb * 1024;
        var tb = gb * 1024;


        var that = {};

        that.fileSize = function(bytes) {
                if (bytes > tb) {
                    return round(bytes / tb) + ' TB';
                }
                if (bytes > gb) {
                    return round(bytes / gb) + ' GB';
                }
                if (bytes > mb) {
                    return round(bytes / mb) + ' MB';
                }
                return round(bytes / kb) + ' KB';

                function round(num) {
                    return Math.round(num * 10) / 10;
                }
        };

        return that;
    }






    function ObjectUtils() {
        "use strict";
        var that = {};

        that.forEach = function (obj, func) {
            Object.keys(obj).forEach(function (key) {
                func(key, obj[key]);
            });
        };

        that.values = function (obj) {
            return Object.keys(obj).map(function (key) {
                return obj[key];
            });
        };

        that.isObject = function (obj) {
            return typeof obj === 'object' && Array.isArray(obj) === false;
        }

        that.clone = function (obj) {

            return cloneObject(obj, {});

            function cloneObject(source, dest) {
                that.forEach(source, function (key, value) {
                    if (that.isObject(value)) {
                        return cloneObject(value, dest[key] = {});
                    }
                    if (Array.isArray(value)) {
                        return cloneArray(value, dest[key] = []);
                    }
                    ;
                    dest[key] = value;
                });
                return dest;
            }

            function cloneArray(source, dest) {
                source.forEach(function (it) {
                    if (that.isObject(it)) {
                        var o = {};
                        dest.push(o);
                        return cloneObject(it, o);
                    }
                    if (Array.isArray(it)) {
                        var arr = [];
                        dest.push(arr);
                        return cloneArray(it, arr);
                    }
                    dest.push(it);
                });
            }
        }

        return that;
    }

    function FunctionUtils() {
        "use strict";
        var that = {};

        /**
         * Queues functions and ensures they are run no more frequently than delay milliseconds
         * @type {*}
         */
        that.functionQueue = function (delay) {
            var queue = [];
            queue.add = function (func) {
                queue.push(function () {
                    func();
                    setTimeout(queue.next, delay);
                });
                queue.length === 1 && setTimeout(queue.next,0);
            };
            queue.next = function () {
                queue.length && queue.shift()();
            }
            return queue;
        };



        /**
         * ensure that target is not called more often than milli milliseconds after optional delay
         * @param target
         * @param milli
         * @param delay
         * @return {Function}
         */
        that.bounceProtect = function (target, milli, delay) {
            target.bounceProtect = {};
            return function () {
                var bounceProtect = target.bounceProtect;
                bounceProtect.called = true;
                if (!bounceProtect.alreadyCalled) {
                    bounceProtect.alreadyCalled = true;
                    !delay && target();
                    setTimeout(function () {
                        delay && target();
                        bounceProtect.alreadyCalled = false;
                        bounceProtect.called && target();
                        bounceProtect.called = false;
                    }, milli);
                }
            }
        };

        that.aopAround = function (target, advice) {
            return function () {
                var args = [target].concat(Array.prototype.slice.call(arguments, 0));
                advice.apply(advice, args);
            }
        };

        that.aopBefore = function (target, advice) {
            return that.aopAround(target, function () {
                var args = Array.prototype.slice.call(arguments, 1);
                args = advice.apply(advice, args) || args;
                target.apply(target, args);
            });
        };

        that.aopAfter = function (target, advice) {
            return that.aopAround(target, function () {
                var args = Array.prototype.slice.call(arguments, 1);
                var ret = target.apply(target, args);
                args = [ret].concat(args);
                advice.apply(advice, args);
            });
        };

        that.memoize = function (target) {
            var memoizer = function() {
                if (memoizer.result) {
                    return memoizer.result
                } else {
                    return memoizer.result = target.apply(target, arguments);
                }
            };
            return memoizer;
        };

        return that;
    }


    function ArrayUtils() {
        "use strict";
        var that = {};

        that.find = function (arr, opt) {
            var func;
            if(typeof opt === 'object') {
                func = function(it) {
                    return Object.keys(opt).every(function(key) {
                        return it[key] === opt[key];
                    });
                }
            } else {
                func = opt;
            }
            for (var i = arr.length; i--;) {
                if (func(arr[i])) {
                    return arr[i];
                }
            }
        };

        that.findIndexBy = function (arr, test) {
            var l = arr.length;
            for (var i = 0; i < l; i++) {
                if (test(arr[i])) {
                    return i;
                }
            }
            return -1;
        }


        that.findAll = function (arr, test) {
            return arr.reduce(function (ret, it) {
                test(it) && ret.push(it);
                return ret;
            }, []);
        };

        that.remove = function (arr, el) {
            var idx = arr.indexOf(el);
            idx > -1 && arr.splice(arr.indexOf(el), 1);
        };

        that.forceArray = function (v) {
            return Array.isArray(v) ? v : [v];
        };


        return that;
    }
});