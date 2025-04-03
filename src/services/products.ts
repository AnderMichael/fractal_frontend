import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
    reducerPath: 'products',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api/v1' }),
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
