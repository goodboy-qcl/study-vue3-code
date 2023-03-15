class ReactiveEffect {
  private _fn: any;
  constructor (fn, public scheduler?) {
    this._fn = fn
  }
  run () {
    activeEffect = this
    return this._fn();
  }
}

const targetMap = new Map();
// 收集依赖项（即被观察者）
export function track (target, key) {
  // target -> key -> dep 相互对应的关系
  let depsMap = targetMap.get(target);
  // 初始化 没有depsMap 创建一个
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  // 添加
  dep.add(activeEffect);
}
// 触发依赖
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  // 遍历执行 dep 
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

let activeEffect;
// 副作用函数
export function effect (fn, options: any = {}) {

  // const scheduler = options.scheduler;
  // 执行fn
  const _effect = new ReactiveEffect(fn, options.scheduler);

  _effect.run();

  return _effect.run.bind(_effect);

}