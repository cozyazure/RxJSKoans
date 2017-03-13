var Rx = require('rx'),
    Observable = Rx.Observable,
    Subject = Rx.Subject,
    Range = require('../util/range');

QUnit.module('Composable Observations');

var __ = 'Fill in the blank';

test('composable add', () => {
    var received = 0,
        numbers = [10, 100, 1000];

    Observable.from(numbers).sum().subscribe(x => received = x);

    equal(1110, received);
});

test('composable before and after', () => {
    var names = Range.create(1, 6),
        a = '',
        b = '';

    Observable.from(names)
        .tap(n => a += n)
        .filter(n => n % 2 === 0)
        .tap(n => b += n)
        .subscribe();

    equal('123456', a);
    equal('246', b);
});

test('we wrote this', () => {
    var received = [],
        names = ["Bart", "Marge", "Wes", "Linus", "Erik", "Matt"];

    Observable.from(names)
        .filter(n => n.length <= 4)
        .subscribe(received.push.bind(received));

    equal('Bart,Wes,Erik,Matt', received);
});

test('converting events', () => {
    var received = '',
        names = ["wE", "hOpE", "yOU", "aRe", "eNJoyIng", "tHiS"];

    Observable.from(names)
        .map(x => x.toLowerCase())
        .subscribe(x => received += x + ' ');

    equal('we hope you are enjoying this ', received);
});

test('create a more relevant stream', () => {
    var received = '',
        mouseXMovements = [100, 200, 150],
        relativemouse = Observable.from(mouseXMovements).map(x => x - 50);

    relativemouse.subscribe(x => received += x + ', ');

    equal('50, 150, 100, ', received);
});

test('checking everything', () => {
    var received = null,
        names = [2, 4, 6, 8];

    Observable.from(names)
        .every(x => x % 2 === 0)
        .subscribe(x => received = x);

    equal(true, received);
});

test('composition means the sum is greater than the parts', () => {
    var received = 0,
        numbers = Observable.range(1, 10);

    numbers.filter(x => x > 8)
        .sum()
        .subscribe(x => received = x);

    equal(19, received);
});
