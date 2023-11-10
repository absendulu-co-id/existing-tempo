/**
 * https://stackoverflow.com/a/72263097/5989987
 */
export function dotToObject(data: any): any {
  function index(parent, key, value) {
    const [mainKey, ...children] = key.split(".");
    parent[mainKey] = parent[mainKey] || {};

    if (children.length === 1) {
      parent[mainKey][children[0]] = value;
    } else {
      index(parent[mainKey], children.join("."), value);
    }
  }

  const result = Object.entries(data).reduce((acc, [key, value]) => {
    if (key.includes(".")) {
      index(acc, key, value);
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});
  return result;
}
