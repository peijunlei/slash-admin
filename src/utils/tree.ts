import { chain } from 'ramda';

import { Permission } from '#/entity';

/**
 * Flatten an array containing a tree structure
 * @param {T[]} trees - An array containing a tree structure
 * @returns {T[]} - Flattened array
 */
export function flattenTrees<T extends { children?: T[] }>(trees: T[] = []): T[] {
  return chain((node) => {
    const children = node.children || [];
    return [node, ...flattenTrees(children)];
  }, trees);
}

// array to tree by parentId
export function arrayToTree<T extends Permission>(
  list: T[],
  parentId: string | null = null,
  route?: string,
): T[] {
  return list
    .filter((item) => item.parentId === parentId) // 过滤出父级
    .map((item) => {
      const children = arrayToTree(list, item.id, item.route);
      if (route) {
        item.component = `/${route}/${item.route}/index.tsx`;
      }
      if (children.length > 0) {
        return { ...item, children };
      }
      return item;
    });
}
