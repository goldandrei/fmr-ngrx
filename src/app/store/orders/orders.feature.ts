import { createFeature } from '@ngrx/store';
import { ordersReducer } from './orders.reducer';

export const ordersFeature = createFeature({
    name: 'orders',
    reducer: ordersReducer,
});