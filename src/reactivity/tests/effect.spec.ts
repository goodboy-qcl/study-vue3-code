import { reactive } from "../reactive";
import { effect } from "../effect";
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
})