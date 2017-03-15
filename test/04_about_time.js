var Rx = require('rx'),
    Observable = Rx.Observable,
    Subject = Rx.Subject,
    Scheduler = Rx.Scheduler;

QUnit.module('Time');

var __ = 'Fill in the blank';

asyncTest('launching an event via a scheduler', () => {
    var state = null;
    var received = '';
    var delay = 500; // Fix this value
    Scheduler.default.scheduleFuture(state, delay, function(scheduler, state) {
        received = 'Finished';
    });

    setTimeout(() => {
        start();
        equal('Finished', received);
    }, 500);
});

asyncTest('launching an event in the future', () => {
    var received = null;
    var time = 500;

    var people = new Subject();
    people.delay(time).subscribe(x => { received = x; });
    people.onNext('Godot');

    setTimeout(() => {
        equal('Godot', received);
        start();
    }, 800) // as long as it is greater than the delay stated up, then is okay
});

asyncTest('a watched pot', () => {
    var received = '';
    var delay = 500;
    var timeout = 502;
    var timeoutEvent = Observable.just('Tepid');

    Observable
        .just('Boiling')
        .delay(delay)
        .timeout(timeout, timeoutEvent)
        .subscribe(function(x) { received = x; });

    setTimeout(function() {
        equal(received, 'Boiling');
        start();
    }, 500);
});

asyncTest('you can place a time limit on how long an event should take', () => {
    var received = [];
    var timeout = 2000;
    var timeoutEvent = Observable.just('Tepid');
    var temperatures = new Subject();

    temperatures.timeout(timeout, timeoutEvent).subscribe(received.push.bind(received));

    temperatures.onNext('Started');

    setTimeout(() => {
        temperatures.onNext('Boiling');
    }, 3000);

    setTimeout(() => {
        equal('Started, Tepid', received.join(', '));
        start();
    }, 4000);
});

asyncTest('debouncing', () => {
    expect(1);

    var received = [];
    var events = new Subject();
    events.debounce(100).subscribe(received.push.bind(received));

    events.onNext('f');
    events.onNext('fr');
    events.onNext('fro');
    events.onNext('from');

    setTimeout(() => {
        events.onNext('r');
        events.onNext('rx');
        events.onNext('rxj');
        events.onNext('rxjs');

        setTimeout(() => {
            equal('from rxjs', received.join(' '));
            start();
        }, 120);
    }, 120);
});

asyncTest('buffering', () => {
    var received = [];
    var events = new Subject();
    events.bufferWithTime(100)
        .map(function(c) { return c.join(''); })
        .subscribe(received.push.bind(received));

    events.onNext('R');
    events.onNext('x');
    events.onNext('J');
    events.onNext('S');

    setTimeout(() => {
        events.onNext('R');
        events.onNext('o');
        events.onNext('c');
        events.onNext('k');
        events.onNext('s');

        setTimeout(() => {
            equal('RxJS Rocks', received.join(' '));
            start();
        }, 120);
    }, 120);
});

asyncTest('time between calls', () => {
    var received = [];
    var events = new Subject();

    events.timeInterval()
        .filter(function(t) { return t.interval > 100; })
        .subscribe(function(t) { received.push(t.value); });

    events.onNext('too');
    events.onNext('fast');

    setTimeout(() => {
        events.onNext('slow');

        setTimeout(() => {
            events.onNext('down');

            equal('slow down', received.join(' '));
            start();
        }, 120);
    }, 120);
});

asyncTest('results can be ambiguous timing', () => {
    var results = 0;
    var fst = Observable.timer(400).map(-1);
    var snd = Observable.timer(500).map(1);

    fst.amb(snd).subscribe(x => { results = x; });

    setTimeout(() => {
        equal(results, -1);
        start();
    }, 600);
});
