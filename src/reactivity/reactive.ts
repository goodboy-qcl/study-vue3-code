import { track, trigger } from "./effect";

// 抽离getter
function createGetter (isReadonly = false) {
  return function get (target, key) {
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  }
}

export function reactive (raw) {
  return new Proxy(raw, {
    // target: 当前的对象， key：用户访问的key
    // get (target, key) {
    //   const res = Reflect.get(target, key);

    //   // 依赖收集
    //   track(target, key);
    //   // 返回访问的对象
    //   return res;
    // },
    // 使用抽离的get
    get: createGetter(),
    // target: 当前的对象， key：用户访问的key, value: 设置的值
    set (target, key, value) {
      const res = Reflect.set(target, key, value);
      // 依赖收集
      trigger(target, key);
      // 返回设置的新对象
      return res;
    },
  })
}

// readonly 
export function readonly (raw) {
  return new Proxy(raw, {
    // get (target, key) {
    //   const res = Reflect.get(target, key);

    //   return res;
    // },
    get: createGetter(true),
    set (target, key, value) {
      return true;
    }
  })
}