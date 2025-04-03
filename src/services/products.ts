import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const API_URL = import.meta.env.VITE_API_URL;

export const productsApi = createApi({
    reducerPath: 'products',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        getProducts: builder.query<any[], void>({
            query: () => '/products',
            providesTags: ['Products'],
            transformResponse: (response: { data: any[] }) => response.data,
        }),

        deleteProducts: builder.mutation<any, number>({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
            transformResponse: (response: { data: any }) => response.data,
        }),
    }),
});

export const { useGetProductsQuery, useDeleteProductsMutation } = productsApi;
