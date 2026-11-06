import { api } from "./api";

export const finishedProductsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getFinishedProducts: builder.query({
            query: () => `/finished-products`,
            providesTags: ["FINISHED_PRODUCTS"]
        }),

        getFinishedProductById: builder.query({
            query: (id) => `/finished-products/${id}`,
            providesTags: ["FINISHED_PRODUCTS"]
        }),

        addFinishedProduct: builder.mutation({
            query: (body) => ({
                url: `/finished-products`,  
                method: "POST",
                body: body
            }),
            invalidatesTags: ["FINISHED_PRODUCTS"]
        }),

        updateFinishedProduct: builder.mutation({
            query: ({ id, body }) => ({
                url: `/finished-products/${id}`,
                method: "PUT",
                body: body
            }),
            invalidatesTags: ["FINISHED_PRODUCTS"]
        }),

        deleteFinishedProduct: builder.mutation({
            query: (id) => ({
                url: `/finished-products/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["FINISHED_PRODUCTS"]
        })
    })
});

export const {
    useGetFinishedProductsQuery,
    useGetFinishedProductByIdQuery,
    useAddFinishedProductMutation,
    useUpdateFinishedProductMutation,
    useDeleteFinishedProductMutation
} = finishedProductsApi;