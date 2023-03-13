export function reactive (raw) {
  return new Proxy(raw, {
    // target: 当前的对象， key：用户访问的key
    get (target, key) {
      const res = Reflect.get(target, key);

      // 依赖收集
      // do things...
      // 返回访问的对象
      return res;
    },
    // target: 当前的对象， key：用户访问的key, value: 设置的值
    set (target, key, value) {
      const res = Reflect.set(target, key, value);
      // 依赖收集
      // do things...

      // 返回设置的新对象
      return res;
    },
  })
}