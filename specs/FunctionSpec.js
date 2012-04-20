describe('commonUtils:Function', function() {

    var cuFunc;

    beforeEach(function() {
        cuFunc = require('commonUtilsModule')['function'];
    });

    describe('bounceProtect()', function() {
        var spy;
        var func;

        beforeEach(function() {
            spy = jasmine.createSpy();
            func = cuFunc.bounceProtect(spy, 100);
        });

        it('should not call a method within set milliseconds', function() {
            func();
            func();
            func();
            waits(50);
            runs(function() {
                expect(spy.callCount).toBe(1);
            });
        });

        it('should call a method after the set milliseconds if it was called more than once', function() {
            func();
            func();
            func();
            func();
            waits(200);
            runs(function() {
                expect(spy.callCount).toBe(2);
            });

        });
    });

    describe('functionQueue', function() {
        var spy, queue;

        beforeEach(function() {
            spy = jasmine.createSpy();
            queue = cuFunc.functionQueue(100);
        });

        it('should call the function immediately with only a small delay', function() {
            queue.add(spy);
            waits(10);
            runs(function() {
                expect(spy).toHaveBeenCalled();
            });
        });

        it('should not call the function more than once every Xms', function() {
            queue.add(spy);
            queue.add(spy);
            queue.add(spy);
            waits(50);
            runs(function() {
                expect(spy.callCount).toBe(1);
            });
            waits(150);
            runs(function() {
                expect(spy.callCount).toBe(2);
            });
            waits(300);
            runs(function() {
                expect(spy.callCount).toBe(3);
            });
        });
    });
});