/**
 *  数组转树形结构
 * @param data
 * @param parentId
 * @param id
 * @param parentIdKey
 * @returns
 */
export function arryToTree(
  data: any[],
  parentId = null,
  id = 'id',
  parentIdKey = 'parentId',
  grade = 1,
) {
  const arr: any[] = [];
  data.forEach((item) => {
    if (item[parentIdKey] === parentId) {
      // 为当前节点设置 grade
      item.grade = grade;
      const children = arryToTree(data, item[id], id, parentIdKey, grade + 1);
      if (children.length) {
        item.children = children;
      }
      arr.push(item);
    }
  });
  return arr;
}

/**
 *  树形结构转数组
 * @param data
 * @param childrenKey
 * @returns
 */
export function treeToArry(data: any[] = [], childrenKey = 'children') {
  const arr: any[] = [];
  data.forEach((item) => {
    const { [childrenKey]: children, ...rest } = item;
    arr.push(rest);
    if (children) {
      arr.push(...treeToArry(children, childrenKey));
    }
  });
  return arr;
}

/**
 * 获取随机 HSL 颜色
 * @returns
 */
export function getRandomHslColor() {
  const h = Math.floor(Math.random() * 360);
  return `hsl(${h}, 100%, 50%)`;
}
