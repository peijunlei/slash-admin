import { HolderOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Modal, Table, TableColumnsType, message } from 'antd';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import funcService from '@/api/services/funcService';
import menuService from '@/api/services/menuService';
import ApiSelectModal from '@/biz/api-select-modal';
import TableActions from '@/components/table-actions';
import { arryToTree } from '@/utils';

import AddFuncModal from './add-func-modal';
import AddModal from './add-modal';

import { Menu, MenuFunc } from '#/entity';
import type { DragEndEvent } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}
interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}
const RowContext = createContext<RowContextProps>({});
function DragHandle() {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
}
function Row(props: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });
  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
}
export default function IndexPage() {
  const { t } = useTranslation();
  const [addVisible, setAddVisible] = useState(false);
  const [funcVisible, setFuncVisible] = useState(false);
  const [apiVisible, setApiVisible] = useState(false);
  const [dataSource, setDataSource] = useState<MenuFunc[]>([]);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<MenuFunc>();
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const [menuId, setMenuId] = useState<string>('');
  async function getTableData() {
    setLoading(true);
    const res = await menuService.fetchMenuAuthList();
    const funcs = res.funcs.map((v) => ({
      ...v,
      parentId: v.menuId,
      type: 2,
      children: v.apiIds.length > 0 ? v.apiIds : undefined,
    })) as unknown as Menu[];
    const list = arryToTree(res.menus.concat(funcs));
    setDataSource(list);
    setLoading(false);
  }
  const columns: TableColumnsType<MenuFunc> = [
    // {
    //   key: 'sort',
    //   width: 100,
    //   render: (record) => {
    //     return record.type === 0 ? <DragHandle /> : null;
    //   },
    // },
    {
      title: '菜单名称',
      dataIndex: 'label',
      render: (value, row) => {
        if (row.apiName) {
          return `${row.apiName}- ${row.method} - (${row.apiUrl})`;
        }
        return value || row.functionName || row.apiName;
      },
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (v, row) => (
        <TableActions>
          {row.type === 0 && (
            <Button
              type="link"
              onClick={() => {
                setParentId(row.id);
                setAddVisible(true);
              }}
            >
              新增菜单
            </Button>
          )}
          {row.type === 1 && (
            <Button
              type="link"
              onClick={() => {
                setMenuId(row.id);
                setFuncVisible(true);
              }}
            >
              新增功能
            </Button>
          )}
          {row.type === 2 && (
            <Button
              type="link"
              onClick={() => {
                setRecord(row);
                setApiVisible(true);
              }}
            >
              关联接口
            </Button>
          )}
          {[0, 1, 2].includes(row.type) && (
            <>
              <Button
                type="link"
                onClick={() => {
                  setRecord(row);
                  if (row.type === 2) {
                    setFuncVisible(true);
                  } else {
                    setAddVisible(true);
                  }
                }}
              >
                {t('编辑')}
              </Button>
              <Button type="link" danger onClick={() => handleDel(row.id, row.type)}>
                {t('删除')}
              </Button>
            </>
          )}
        </TableActions>
      ),
    },
  ];
  function refresh() {
    getTableData();
  }
  async function handleOK(values: any) {
    values.id ? await menuService.updateMenu(values.id, values) : await menuService.addMenu(values);
    refresh();
  }
  /**
   * handleFuncOK
   */
  async function handleFuncOK(values: any) {
    values.id ? await funcService.updateFunc(values.id, values) : await funcService.addFunc(values);
    refresh();
  }
  async function handleDel(id, type) {
    Modal.confirm({
      title: t('删除'),
      content: t('确定删除吗？'),
      onOk: async () => {
        switch (type) {
          case 0:
          case 1:
            await menuService.delMenu(id);
            break;
          case 2:
            await funcService.delFunc(id);
            break;
          default:
            break;
        }
        refresh();
      },
    });
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    // 交换 active 和 over 的位置 order 字段
    if (!over || active.id === over.id) return;
    const activeIndex = dataSource.findIndex((i) => i.id === active.id);
    const overIndex = dataSource.findIndex((i) => i.id === over.id);
    setDataSource((prevState) => {
      return arrayMove(prevState, activeIndex, overIndex);
    });
    menuService
      .exchangeOrder({
        id: active.id as string,
        targetId: over.id as string,
      })
      .then(() => {
        message.success('操作成功');
      });
  };
  useEffect(() => {
    getTableData();
  }, []);
  return (
    <div>
      <TableActions>
        <Button type="primary" onClick={() => setAddVisible(true)}>
          {t('新增')}
        </Button>
        <Button type="primary" onClick={() => refresh()}>
          {t('刷新')}
        </Button>
      </TableActions>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext items={dataSource.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <Table
            rowKey="id"
            components={{ body: { row: Row } }}
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            expandable={{
              indentSize: 20,
            }}
          />
        </SortableContext>
      </DndContext>

      <AddModal
        parentId={parentId}
        record={record}
        visible={addVisible}
        onOk={(values) => handleOK(values)}
        onCancel={() => {
          setAddVisible(false);
          setRecord(undefined);
        }}
      />
      <AddFuncModal
        menuId={menuId}
        record={record}
        visible={funcVisible}
        onOk={(values) => handleFuncOK(values)}
        onCancel={() => {
          setFuncVisible(false);
          setMenuId('');
        }}
      />
      <ApiSelectModal
        visible={apiVisible}
        onCancel={() => {
          setApiVisible(false);
        }}
        onOk={async (keys) => {
          await funcService.updateFunc(record?.id, { apiIds: keys });
          message.success('操作成功');
          refresh();
        }}
        selectKeys={record?.apiIds.map((i) => i.id)}
      />
    </div>
  );
}
