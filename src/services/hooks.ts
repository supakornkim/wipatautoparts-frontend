// react
import {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// third-party
import type { UseFormRegister, UseFormReturn } from 'react-hook-form';
// application
import { IListOptions, INavigableList } from '~/interfaces/list';
import { INavigationEvent } from '~/components/shared/Navigation';
import { IProduct } from '~/interfaces/product';
import { useIsUnmountedRef } from '~/store/hooks';

export function useGlobalMousedown(callback: (event: MouseEvent) => void, deps?: DependencyList) {
  const memoCallback = useCallback(callback, deps || []);

  useEffect(() => {
    document.addEventListener('mousedown', memoCallback);
    return () => document.removeEventListener('mousedown', memoCallback);
  }, [memoCallback]);
}

export type IDeferredDataSource<T> = () => Promise<T>;
export type IDeferredDataState<T> = { isLoading: boolean; data: T };

export function useDeferredData<T>(
  source: IDeferredDataSource<T>,
  defaultData: T,
  initialData?: T,
  deps: any[] = [],
): IDeferredDataState<T> {
  const [state, setState] = useState(() => ({
    isLoading: initialData === undefined,
    data: initialData || defaultData,
  }));
  const memoizedSource = useCallback(source, deps);
  const skipNextRef = useRef(initialData !== undefined);

  useEffect(() => {
    if (skipNextRef.current) {
      skipNextRef.current = false;
      return () => {};
    }

    let canceled = false;

    setState((cur) => (cur.isLoading ? cur : { ...cur, isLoading: true }));

    memoizedSource().then((data) => {
      if (canceled) return;
      setState({ isLoading: false, data });
    });

    return () => {
      canceled = true;
    };
  }, [memoizedSource]);

  return state;
}

export type IProductTab = { id: number; name: string };
export type IWithCurrent<T> = T & { current: boolean };
export type IProductTabSource<T extends IProductTab> = (tab: T) => Promise<IProduct[]>;
export type IProductTabsState<T extends IProductTab> = {
  tabs: IWithCurrent<T>[];
  handleTabChange: (tab: IWithCurrent<T>) => void;
} & IDeferredDataState<IProduct[]>;

export function useProductTabs<T extends IProductTab>(
  tabs: T[],
  productsSource: IProductTabSource<T>,
  initialData?: IProduct[],
): IProductTabsState<T> {
  const [currentTabId, setCurrentTabId] = useState(1);
  const memoizedTabs = useMemo(
    () =>
      tabs.map((tab) => ({
        ...tab,
        current: currentTabId === tab.id,
      })),
    [tabs, currentTabId],
  );
  const currentTab = memoizedTabs.find((x) => x.current);
  const products = useDeferredData(
    () => (currentTab ? productsSource(currentTab) : Promise.resolve([])),
    [],
    initialData,
    [currentTab],
  );
  const handleTabChange = useCallback((tab: IWithCurrent<T>) => {
    setCurrentTabId(tab.id);
  }, []);

  return useMemo(
    () => ({
      tabs: memoizedTabs,
      handleTabChange,
      ...products,
    }),
    [memoizedTabs, handleTabChange, products],
  );
}

export type IProductColumn = {
  title: string;
  source: IDeferredDataSource<IProduct[]>;
};

export function useProductColumns(columns: IProductColumn[]) {
  const products = useDeferredData(
    () => Promise.all(columns.map((column) => column.source())),
    [],
    undefined,
    [columns],
  );

  return useMemo(
    () =>
      columns.map((column, index) => ({
        ...column,
        products: products.data[index] || [],
      })),
    [columns, products],
  );
}

/**
 * ปรับให้:
 * - import ประเภทจาก 'react-hook-form' ตรง ๆ
 * - เก็บชื่อฟิลด์เป็น string (รองรับ dot-path/namespace) แทน FieldPath
 */
export function useDetachableForm<T extends Record<string, any>>(
  formMethods: UseFormReturn<T>,
  detached: boolean,
): UseFormRegister<T> {
  const { register: originalRegister, unregister, trigger } = formMethods;

  // ใช้ string[] แทน FieldPath<T>[]
  const fieldNamesRef = useRef<string[]>([]);

  useEffect(() => {
    if (detached && fieldNamesRef.current.length > 0) {
      unregister(fieldNamesRef.current as any);
      fieldNamesRef.current = [];
      // trigger ฟิลด์ทั้งหมดใหม่ (ไม่ระบุฟิลด์ให้ TS เงียบ)
      trigger().then();
    }
  }, [detached, unregister, trigger]);

  // ชนิดของ UseFormRegister<T> อนุญาต any สำหรับ name ได้อยู่แล้ว
  return ((name: any, options?: any) => {
    if (!detached) {
      if (!fieldNamesRef.current.includes(name)) {
        fieldNamesRef.current.push(name);
      }
      return originalRegister(name as any, options);
    }

    // โหมด detached: คืน handler เปล่า ๆ เพื่อไม่ให้ลงทะเบียนจริง
    return {
      name,
      ref: () => {},
      onChange: () => Promise.resolve(),
      onBlur: () => Promise.resolve(),
    };
  }) as UseFormRegister<T>;
}

export function useList<T extends INavigableList<any>>(
  loader: (options: IListOptions) => Promise<T>,
  reloadingDeps: any[] = [],
): {
  list: T | null;
  options: IListOptions;
  load: (options?: IListOptions) => Promise<any>;
  onNavigate: (event: INavigationEvent) => void;
} {
  const [, rerender] = useState<boolean>(false);
  const [list, setList] = useState<T | null>(null);
  const optionsRef = useRef<IListOptions>({});
  const cancelRequestRef = useRef<() => void>(() => {});
  const isUnmountedRef = useIsUnmountedRef();

  const load = async (options: IListOptions = optionsRef.current) => {
    cancelRequestRef.current();

    const canceledRef = { current: false };
    cancelRequestRef.current = () => {
      canceledRef.current = true;
    };

    loader(options).then((result) => {
      if (isUnmountedRef.current || canceledRef.current) return;

      setList(result);

      if (result.navigation.type === 'page') {
        const { page } = result.navigation;
        optionsRef.current = { ...optionsRef.current, page };
        rerender((s) => !s);
      }
    });
  };

  const onNavigate = useCallback((event: INavigationEvent) => {
    if (event.type === 'page') {
      optionsRef.current = { ...optionsRef.current, page: event.page };
    } else if (event.type === 'before') {
      optionsRef.current = { ...optionsRef.current, before: event.before };
    } else if (event.type === 'after') {
      optionsRef.current = { ...optionsRef.current, after: event.after };
    }

    rerender((s) => !s);
    load().then();
  }, []);

  // Initial load + reload when deps change
  useEffect(() => {
    load().then();
  }, reloadingDeps);

  return {
    list,
    options: optionsRef.current,
    load,
    onNavigate,
  };
}
