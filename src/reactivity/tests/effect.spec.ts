import { reactive } from "../reactive";
import { effect, stop } from "../effect";
describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);

    // update
    user.age++;
    expect(nextAge).toBe(12);
  });

  // effect 测试
  it('should return runner when call effect', () => {
    // 1. effect(fn) 执行的时候 需要返回一个function函数（称之为 runner）
    // 2. 调用这个 runner 的时候回去执行 effect 内部接收到的 fn
    // 3. 执行完这个 fn 之后， 他会把 fn 的返回值 return 出去
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return 'foo'
    })
    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe('foo');
  });

  // scheduler 测试
  it('scheduler', () => {
    // 1. 通过 effect 的第二个参数给定的 一个 scheduler 的函数
    // 2. effect 第一次执行的时候还是会执行 fn
    // 3. 当相应是对象 set 的时候， update 不会执行 fn， 而是执行 scheduler
    // 4. 如果说当执行到 runner 的时候， 会再次执行 fn
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({foo: 1});
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // 应在第一个触发器上调用 （should be called on first trigger）
    obj.foo++
    // 应该执行 scheduler
    expect(scheduler).toHaveBeenCalledTimes(1);
    // 还不应该运行 ( should not run yet )
    expect(dummy).toBe(1);
    // 手动执行 ( manually run )
    run();
    // 应该执行fn ( should have run )
    expect(dummy).toBe(2);

  });

  // stop 测试
  it('stop', () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.prop = 3;
    expect(dummy).toBe(2);
    // 停止的效果应该仍然可以手动调用
    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });

  // onStop 测试
  it('onStop', () => {
    const obj = reactive({
      foo: 1
    });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop
      }
    )
    stop(runner);
    expect(onStop).toHaveBeenCalledTimes(1);
  });
})