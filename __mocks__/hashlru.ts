const HLRUConstructorSpy = jest.fn();
const getSpy = jest.fn();
const setSpy = jest.fn();
const clearCache = function () { mockCache = {} }
let mockCache = {};

function HLRU (size: number) {
  HLRUConstructorSpy(size);
  return {
    get (key) {
      getSpy(key);
      return mockCache[key];
    },
    set (key, value) {
      mockCache[key] = value;
      setSpy(key, value);
    }
  }
}

export {
  setSpy,
  getSpy,
  HLRUConstructorSpy,
  clearCache
};

export default HLRU;
