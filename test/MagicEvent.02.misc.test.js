describe('Event Handler misc', function() {


    let testVal = [];
    let testFunc = function (ev) {
        testVal.push({this: this, target: ev.target, type: ev.type, data: ev.detail});
    }

    let testFuncCancel = function (ev) {
        ev.stopPropagation();
        testVal.push({this: this});
    }

    beforeEach(function() {
        var fixture = '<div id="fixture">' +
                            '<div class="test">' +
                                '<span class="text">this is text</span>' +
                                '<span class="text">this is text2</span>' +
                            '</div>' +
                        '</div>';

        testVal = [];
        count = 0;

        document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {
        document.body.removeChild(document.getElementById('fixture'));
        MagicEvent.offAll();
    });

    it('all method could take html element', function() {
        let div = document.querySelector(".test");
        let span1 = document.querySelector(".text");
        MagicEvent.on("click", div, testFunc)
            .one("click", span1, testFunc)
            .emit("click", span1);

        expect(testVal.length).toBe(2);
        expect(div.id).not.toBe(null)
        expect(span1.id).not.toBe(null)

        MagicEvent.off("click", div, testFunc)
            .emit("click", span1);

        expect(testVal.length).toBe(2);
    });

    it('scroll event could take html element', function() {
        let div = document.querySelector(".test");
        MagicEvent.on("scroll", div, testFunc)
            .emit("scroll", div);

        expect(testVal.length).toBe(1);
        expect(div.id).not.toBe(null)

        MagicEvent.emit("scroll", div);

        expect(testVal.length).toBe(2); 
    });

    it('on method should take multiple events', function() {
        let div = document.querySelector(".test");
        MagicEvent.on("click hover", div, testFunc)
            .emit("hover", div)
            .emit("click", div);

        expect(testVal.length).toBe(2);
    });

    it('one method should take multiple events', function() {
        let div = document.querySelector(".test");
        MagicEvent.one("click hover", div, testFunc)
            .emit("hover", div)
            .emit("click", div);

        expect(testVal.length).toBe(2);

        MagicEvent.emit("hover", div)
            .emit("click", div);

        expect(testVal.length).toBe(2);
    });

    it('off method should take multiple events', function() {
        let div = document.querySelector(".test");
        MagicEvent.on("click hover", div, testFunc)
            .off("click hover", div, testFunc)
            .emit("hover", div)
            .emit("click", div);

        expect(testVal.length).toBe(0);
    });

    it('all method shoud send event handler if call with missing arguments', function (){
        expect(MagicEvent.on()).toBe(MagicEvent);
        expect(MagicEvent.emit()).toBe(MagicEvent);
        expect(MagicEvent.one()).toBe(MagicEvent);
        expect(MagicEvent.off()).toBe(MagicEvent);
    });

    it('off method should not fail on remove unexisting events', function (){
        let div = document.querySelector(".test");
        expect(MagicEvent.off("tighdfghdn", div, testFunc)).toBe(MagicEvent);
    });

    it('this should refer at currentTarget object (currentTarget is alway document due to delegate)', function (){
        let div = document.querySelector(".test");

        MagicEvent.on("click", div, testFunc)
            .emit("click", div);

       expect(testVal.length).toBe(1);
       expect(testVal[0].this).toBe(div);
    });

    it('stopPropagation should work', function (){
        let div = document.querySelector(".test");
        let span1 = document.querySelector(".text");

        MagicEvent.on("click", div, testFunc)
            .on("click", span1, testFuncCancel)
            .emit("click", span1);

       expect(testVal.length).toBe(1);
       expect(testVal[0].this).toBe(span1);
    });

    it('custom event should work', function (){
        let div = document.querySelector(".test");

        MagicEvent.on("customizeEvent", div, testFunc)
            .emit("customizeEvent", div);

       expect(testVal.length).toBe(1);
       expect(testVal[0].type).toBe("customizeEvent");
    });

    it('custom event should work with data', function (){
        let div = document.querySelector(".test");

        MagicEvent.on("customizeEvent", div, testFunc)
            .emit("customizeEvent", div, {test: "yeah"});

       expect(testVal.length).toBe(1);
       expect(testVal[0].data.test).toBe("yeah");
    });

    

});