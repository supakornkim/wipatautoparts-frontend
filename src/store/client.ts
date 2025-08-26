// third-party
import { Action } from 'redux';
// application
import { AppReducer } from '~/store/types';
import { useAppAction } from '~/store/hooks';

const APPLY_CLIENT_STATE = 'APPLY_CLIENT_STATE';

type ApplyClientStateAction<T> = {
  type: typeof APPLY_CLIENT_STATE;
  state: T;
};

// ✅ เจาะจงให้เป็น Record<string, any> เพื่อให้ index ได้
function isApplyClientStateAction(
  action: Action | ApplyClientStateAction<any>
): action is ApplyClientStateAction<Record<string, any>> {
  return action.type === APPLY_CLIENT_STATE;
}

export function applyClientState<T extends object>(state: T): ApplyClientStateAction<T> {
  return {
    type: APPLY_CLIENT_STATE,
    state,
  };
}

export const useApplyClientState = () => useAppAction(applyClientState);

export type IStateFromServer = 'server';
export type IStateFromClient = 'client';
export type IStateFrom = IStateFromServer | IStateFromClient;

export function withClientState<
  T extends AppReducer<any, any>,
  S extends ReturnType<T>,
  R extends S & { stateFrom: IStateFrom }
>(
  reducer: T extends AppReducer<ReturnType<T> & { stateFrom: any }, any>
    ? AppReducer<ReturnType<T> & { stateFrom: never }, any>
    : T,
  namespace: string,
): AppReducer<R> {
  // ให้ action เป็น union ที่รวมชนิดที่ index ได้
  return (state: S, action: Action | ApplyClientStateAction<Record<string, any>>): R => {
    const childState = reducer(state, action);

    if (isApplyClientStateAction(action)) {
      // ตอนนี้ action.state เป็น Record<string, any> แล้ว จึง index ได้
      return {
        ...(action.state[namespace] ?? childState),
        stateFrom: 'client',
      } as R;
    }

    if ('stateFrom' in (childState as any)) {
      return childState as R;
    }

    return {
      ...(childState as object),
      stateFrom: 'server',
    } as R;
  };
}
