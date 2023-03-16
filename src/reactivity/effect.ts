import { extend } from "../shared";

class ReactiveEffect {
  private _fn: any;
  deps = []; // 获取要清除的 effect
  active = true; // 控制是否清除过 stop
  onStop?: () => void;
  public scheduler: Function | undefined;
  constructor (fn, scheduler?: Function) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run () {
    activeEffect = this
    return this._fn();
  }
  stop () {
    if (this.active) {
      clearupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function clearupEffect (effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
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

  if (!activeEffect) return;
  // 添加
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
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
  // _effect.onStop = options.onStop;
  // 通过将 options 的值给到 _effect
  // Object.assign(_effect, options);
  extend(_effect, options);

  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;

  return runner;

}

export function stop (runner) {
  runner.effect.stop();
}