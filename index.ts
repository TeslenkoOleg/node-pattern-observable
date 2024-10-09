export class Observable {
    private observers: any[] = [];
    private operators: any[] = [];
    private duplicateObservable: Observable;
    constructor() {

    }
    pipe(...args: any[]) {
        this.operators.push(...args);
        this.duplicateObservable = new Observable();
        this.subscribe((data: any)=> {
            this.duplicateObservable.notify(data);
        });
        return this.duplicateObservable;
    }

    subscribe(f: any) {
        this.observers.push(f);
        return this;
    }

    notify(data: any) {
        if (!this.observers.length) return;
        for (const operator of this.operators){
            if (operator.name === 'filter'){
                const result = operator.fn(data);
                if (!result) return;
            }
            if (operator.name === 'map'){
                data = operator.fn(data);
            }
            if (operator.name === 'tap'){
                operator.fn(data);
            }
        }
        this.observers.forEach(observer => observer(data));
    }
    complete () {
        throw new Error('This method should be overwritten');
    }
}
// Usage
export class Observable1 extends Observable {
    private timer: any;
    constructor() {
        super();
       this.timer = setInterval(() => {
            const randomString = Math.random().toFixed(2);
            this.notify(randomString);
        }, 1000);
    }
    complete () {
        console.log('completed - ');
        clearInterval(this.timer);
    }
}
const observable1 = new Observable1();
const filter = (filter: (data: any) => boolean) => ({ name: 'filter', fn: filter});
const map = (map: (data: any) => number) => ({ name: 'map', fn: map});
const tap = (tap: (data: any) => void) => ({name: 'tap', fn: tap});
let count = 0;
observable1
    .pipe(
        filter((data) => +data > 0.5),
        map((data)=> +data + 10),
        tap((data) => console.log(data))
    )
    .subscribe((data: any) => {
    count++;
    if (count === 5){
        observable1.complete();
    }
});
