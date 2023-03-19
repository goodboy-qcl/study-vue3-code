import { readonly } from "../reactive";

describe('readonly', () => {
  it('happy path', () => {
    // readonly => 只读
    const original = { foo: 1, bar: { baz: 2 } };
    const warpped = readonly(original);
    expect(warpped).not.toBe(original);
    expect(warpped.foo).toBe(1);
  })
})