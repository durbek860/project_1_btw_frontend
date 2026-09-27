import { api } from "./api";

export const ProductApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => `/products`,
            providesTags: ["PRODUCTS"]
        }),

        getProductById: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: ["PRODUCTS"]
        }),

        addProduct: builder.mutation({
            query: (body) => ({
                url: `/products`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ["PRODUCTS"]
        }),

        updateProduct: builder.mutation({
            query: ({ id, body }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: body
            }),
            invalidatesTags: ["PRODUCTS"]
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["PRODUCTS"]
        })
    })
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = ProductApi;