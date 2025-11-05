import { createActionGroup, props } from '@ngrx/store';
import { Order } from '../../models';

export const OrdersActions = createActionGroup({
    source: 'Orders',
    events: {
        'Add Order': props<{ order: Order }>(),
        'Update Order': props<{ order: Order }>(),
        'Delete Order': props<{ orderId: number }>(),
    },
});