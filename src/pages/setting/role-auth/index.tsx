import { Alert, Button, Spin, Tree, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import menuService from '@/api/services/menuService';
import roleService from '@/api/services/roleService';
import { useRouter } from '@/router/hooks';
import { arryToTree } from '@/utils';

function transformData(data: string[]) {
  const menuIds = [];
  const funcIds = [];
  data.forEach((v) => {
    if (v.startsWith('menu_')) {
      menuIds.push(v.replace('menu_', ''));
    } else if (v.startsWith('func_')) {
      funcIds.push(v.replace('func_', ''));
    }
  });
  return {
    menuIds,
    funcIds,
  };
}

export default function Index() {
  const params = useParams();
  const { back } = useRouter();
  const [loading, setLoading] = useState(false);
  const [allMenus, setAllMenus] = useState([]);
  const [allFuncs, setAllFuncs] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);

  async function getRole() {
    const res = await roleService.fetchRole(params.id);
    res.menus = res.menus.map((v) => `menu_${v}`);
    res.funcs = res.funcs.map((v) => `func_${v}`);
    setCheckedKeys(res.menus.concat(res.funcs));
  }
  async function getTreeData() {
    setLoading(true);
    const res = await menuService.fetchMenuAuthList();
    const menus = res.menus.map((v) => ({
      ...v,
      _id: `menu_${v.id}`,
    }));
    const funcs = res.funcs.map((v) => ({
      ...v,
      _id: `func_${v.id}`,
      label: v.functionName,
      parentId: v.menuId,
      type: 2,
    })) as any[];
    setAllMenus(menus);
    setAllFuncs(funcs);
    setLoading(false);
  }

  async function handleSave() {
    const id = params.id!;
    if (checkedKeys.length === 0) {
      message.error('请选择菜单权限');
      return;
    }
    const data = transformData(checkedKeys);
    await roleService.updateRole(id, {
      menus: data.menuIds,
      funcs: data.funcIds,
    });
    message.success('操作成功');
    back();
  }
  const treeData = useMemo(() => {
    const list = arryToTree(allMenus.concat(allFuncs));
    return list;
  }, [allMenus, allFuncs]);
  useEffect(() => {
    getTreeData();
    getRole();
  }, []);
  return (
    <Spin spinning={loading}>
      <Alert
        message={
          <>
            <h3>菜单权限</h3>
            <p>1.菜单只有2级</p>
            <p>2.功能位于第3级，挂在2级菜单下</p>
            <p>3.请默认勾选仪表</p>
          </>
        }
        type="warning"
      />
      {treeData.length > 0 && (
        <Tree
          checkable
          defaultExpandAll
          checkStrictly
          onCheck={(_, e) => {
            const { node, checked } = e;
            const { _id, id, parentId, grade } = node;
            let keys = [];
            if (grade === 3) {
              // 找到同级的节点
              const siblings = allFuncs.filter((v) => v.parentId === parentId);
              // 判断同级的节点是否已经有选中的
              const hasChecked = siblings.some((v) => checkedKeys.includes(v._id) && v._id !== _id);
              if (hasChecked) {
                // 如果有选中的，就不再选中父节点,只添加当前节点
                keys = [_id];
              } else {
                // 如果没有选中的，就选中父节点及 父父节点
                const firstKey = allMenus.find((v) => v.id === parentId)?.parentId;
                keys = [`menu_${firstKey}`, `menu_${parentId}`, _id];
              }
            } else if (grade === 2) {
              // 找到所有的子节点
              const children = allFuncs.filter((v) => v.parentId === id).map((v) => v._id);
              // 找到同级的节点
              const siblings = allMenus.filter((v) => v.parentId === parentId);
              // 判断同级的节点是否已经有选中的
              const hasChecked = siblings.some((v) => checkedKeys.includes(v._id) && v._id !== _id);
              if (hasChecked) {
                // 如果有选中的，就不再选中父节点,只添加当前节点
                keys = [_id].concat(children);
              } else {
                // 如果没有选中的，就选中父节点及 父父节点
                keys = [`menu_${parentId}`, _id].concat(children);
              }
            } else {
              // 找到所有的子节点 包括子节点的子节点
              const children1 = allMenus.filter((v) => v.parentId === id);
              const children2 = children1
                .map((v1) => allFuncs.filter((v2) => v2.parentId === v1.id).map((v2) => v2._id))
                .flat();
              keys = [_id].concat(children1.map((v) => v._id)).concat(children2);
            }
            setCheckedKeys((state) => {
              if (checked) {
                return state.concat(keys);
              }
              const arr = state.filter((v) => !keys.includes(v));
              return arr;
            });
          }}
          checkedKeys={checkedKeys}
          treeData={treeData}
          fieldNames={{
            key: '_id',
            children: 'children',
            title: 'label',
          }}
        />
      )}

      <Button type="primary" onClick={handleSave}>
        保存
      </Button>
    </Spin>
  );
}
