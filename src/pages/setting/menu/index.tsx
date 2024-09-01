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

import menuService from '@/api/services/menuService';
import TableActions from '@/components/table-actions';
import { arryToTree } from '@/utils';

import AddModal from './add-modal';

import { Menu } from '#/entity';
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
  const [dataSource, setDataSource] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<Menu>();
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  async function getTableData() {
    setLoading(true);
    const res = await menuService.fetchAllMenus();
    const orderedList = res.list.sort((a, b) => a.order - b.order);
    const list = arryToTree(orderedList);
    setDataSource(list);
    setLoading(false);
  }
  const columns: TableColumnsType<Menu> = [
    {
      key: 'sort',
      width: 100,
      render: (record) => {
        return record.type === 0 ? <DragHandle /> : null;
      },
    },
    {
      title: '菜单名称',
      dataIndex: 'label',
    },
    {
      title: '路由',
      dataIndex: 'route',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      render: (icon: string) => icon || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (record) => (
        <TableActions>
          {record.type !== 0 ? null : (
            <Button
              type="link"
              onClick={() => {
                setParentId(record.id);
                setAddVisible(true);
              }}
            >
              新增菜单
            </Button>
          )}
          <Button
            type="link"
            onClick={() => {
              setRecord(record);
              setAddVisible(true);
            }}
          >
            {t('编辑')}
          </Button>
          <Button type="link" danger onClick={() => handleDel(record.id)}>
            {t('删除')}
          </Button>
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
  async function handleDel(id) {
    Modal.confirm({
      title: t('删除'),
      content: t('确定删除吗？'),
      onOk: async () => {
        await menuService.delMenu(id);
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
    </div>
  );
}
