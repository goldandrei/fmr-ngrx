import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Order } from '../../models';
import { OrdersActions } from './orders.action';

export interface OrdersState extends EntityState<Order> { }
export const ordersAdapter = createEntityAdapter<Order>();

const initialState: OrdersState = ordersAdapter.getInitialState();

export const ordersReducer = createReducer(
    initialState,
    on(OrdersActions.addOrder, (state, { order }) => ordersAdapter.addOne(order, state)),
    on(OrdersActions.updateOrder, (state, { order }) => ordersAdapter.upsertOne(order, state)),
    on(OrdersActions.deleteOrder, (state, { orderId }) => ordersAdapter.removeOne(orderId, state)),
);