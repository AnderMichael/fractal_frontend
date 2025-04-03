import { configureStore } from '@reduxjs/toolkit';
import { ordersApi } from '../services/orders';
import { productsApi } from '../services/products';


export const store = configureStore({
    reducer: {
        [ordersApi.reducerPath]: ordersApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,

    },
    middleware: (getDefault) =>
        getDefault().concat(ordersApi.middleware).concat(productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
