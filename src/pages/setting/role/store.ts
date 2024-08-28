import { create } from 'zustand';
// immer
import { immer } from 'zustand/middleware/immer';

type Store = {
  addVisible: boolean;
  record: any;
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setAddVisible: (visible: boolean) => void;
    setRecord: (record: any) => void;
  };
};
const useStore = create<Store>()(
  immer((set) => ({
    addVisible: false,
    record: null,
    actions: {
      setRecord: (record) => {
        set((state) => {
          state.record = record;
        });
      },
      setAddVisible: (visible) => {
        set((state) => {
          state.addVisible = visible;
        });
      },
    },
  })),
);

export default useStore;
