describe('commonUtils:Collection', function() {

    var c, commonUtils;

    beforeEach(function() {
        commonUtils = require('commonUtilsModule');
        c = commonUtils.Collection([{id:1},{id:2},{id:3}]);
    });

    describe('find()', function() {
        it('should find element based on a passed function', function() {
            expect(c.find(function(it) {return it.id === 2}).id).toBe(2);
        });

        it('should find element based on a passed object', function() {
            expect(c.find({id:3}).id).toBe(3);
        });

        it('should return undefined if not found', function() {
            expect(c.find({id:5})).not.toBeDefined();
        });
    });
});