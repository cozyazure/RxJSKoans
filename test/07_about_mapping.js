var Rx = require('rx'),
    Observable = Rx.Observable;

QUnit.module('Mapping');

var __ = 'Fill in the blank';

test('flatMap can be a cartesian product', () => {
    var results = [];
    Observable.range(1, 3)
        .flatMap(function(x, i) {
            return Observable.range(__, __);
        })
        .subscribe(results.push.bind(results));

    equal('234', results.join(''));
});

test('flatMapLatest only gets us the latest value', () => {
    var results = [];
    Observable.range(1, 3)
        .flatMapLatest(x => {
            return Observable.range(x, ___);
        })
        .subscribe(results.push.bind(results));

    equal('12345', results.join(''));
});
