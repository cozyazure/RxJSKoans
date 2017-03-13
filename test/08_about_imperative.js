var Rx = require('rx'),
    Observable = Rx.Observable;

QUnit.module('Imperative');

var __ = 'Fill in the blank';

test('can make a decision with an if with no else', () => {
    var results = [];
    Observable.range(1, 10)
        .flatMap(x => {
            return Rx.Observable.if(
                () => { return x % 2 === 0; },
                Observable.just(x)
            );
        })
        .subscribe(results.push.bind(results));

    equal(__, results.join(''));
});

test('can make a decision with an if with an else', () => {
    var results = [];
    Observable.range(1, 5)
        .flatMap(function(x, i) {
            return Rx.Observable.if(
                () => { return x % 2 === 0; },
                Observable.just(x),
                Observable.range(x, i)
            );
        })
        .subscribe(results.push.bind(results));

    equal(__, results.join(''));
});

test('we can make test cases', () => {
    var result = '';

    var cases = {
        'matt': Observable.just(1),
        'erik': Observable.just(2),
        'bart': Observable.just(3),
        'wes': Observable.just(4)
    };

    Observable.just(__)
        .flatMap(x => {
            return Observable.case(
                () => { return x; },
                cases
            );
        })
        .subscribe(x => { result = x; });

    equal(4, result);
});

test('we can also have a default case', () => {
    var result = '';

    var cases = {
        'matt': Observable.just(1),
        'erik': Observable.just(2),
        'bart': Observable.just(3),
        'wes': Observable.just(4)
    };

    Observable.just('RxJS')
        .flatMap(x => {
            return Observable.case(
                () => { return x; },
                cases,
                Observable.just(__)
            );
        })
        .subscribe(x => { result = x; });

    equal(5, result);
});

test('while does something until proven false', () => {
    var i = 0;
    var result = [];

    var source = Rx.Observable
        .while(
            () => { return ++i < 3 },
            Rx.Observable.just(__)
        )
        .subscribe(result.push.bind(result));

    equal('4242', result.join(''));
});
