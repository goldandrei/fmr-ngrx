import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ordersAdapter, OrdersState } from './orders.reducer';
import { selectSelectedUserId } from '../users/users.selectors';
import * as UsersSelectors from '../users/users.selectors';

export const selectOrdersState = createFeatureSelector<OrdersState>('orders');
const { selectAll, selectEntities } = ordersAdapter.getSelectors(selectOrdersState);

export const selectAllOrders = selectAll;
export const selectOrdersEntities = selectEntities;

export const selectOrdersForSelectedUser = createSelector(
    selectAllOrders,
    selectSelectedUserId,
    (orders, id) => (id == null ? [] : orders.filter(o => o.userId === id))
);

export const selectUserOrdersTotal = createSelector(
    selectOrdersForSelectedUser,
    orders => orders.reduce((s, o) => s + o.total, 0)
);

export const selectUserSummary = createSelector(
    UsersSelectors.selectSelectedUser,
    selectUserOrdersTotal,
    (user, total) => ({ name: user?.name ?? '', total })
);