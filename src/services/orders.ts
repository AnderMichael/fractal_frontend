import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ordersApi = createApi({
    reducerPath: 'orders',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api/v1' }),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        getOrders: builder.query<any[], void>({
            query: () => '/orders',
            providesTags: ['Orders'],
            transformResponse: (response: { data: any[] }) => response.data,
        }),
        getOrder: builder.query<any, number>({
            query: (id) => `/orders/${id}`,
            providesTags: ['Orders'],
            transformResponse: (response: { data: any }) => response.data,
        }),
        createOrder: builder.mutation<any, Partial<any>>({
            query: (newOrder) => ({
                url: '/orders',
                method: 'POST',
                body: newOrder,
            }),
            invalidatesTags: ['Orders'],
            transformResponse: (response: { data: any }) => response.data,
        }),
        updateOrder: builder.mutation<any, { id: number; data: Partial<any> }>({
            query: ({ id, data }) => ({
                url: `/orders/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Orders'],
            transformResponse: (response: { data: any }) => response.data,
        }),
        deleteOrder: builder.mutation<any, number>({
            query: (id) => ({
                url: `/orders/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Orders'],
            transformResponse: (response: { data: any }) => response.data,
        }),
    }),
});

export const { useGetOrdersQuery, useDeleteOrderMutation, useCreateOrderMutation, useGetOrderQuery, useUpdateOrderMutation } = ordersApi;
