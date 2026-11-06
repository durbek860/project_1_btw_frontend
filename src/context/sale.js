import { api } from "./api";

export const SaleApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSales: builder.query({
            query: () => `/sales`,
            providesTags: ["SALES"]
        }),

        addSale: builder.mutation({
            query: (body) => ({
                url: `/sales/add`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ["SALES", "CUSTOMERS", "FINISHED_PRODUCTS"]
        }),

        getCustomers: builder.query({
            query: () => `/sales/customers`,
            providesTags: ["CUSTOMERS"]
        }),

        payDebt: builder.mutation({
            query: ({ saleId, amountPaid }) => ({
                url: `/sales/pay-debt/${saleId}`,
                method: "PUT",
                body: { amountPaid }
            }),
            invalidatesTags: ["SALES", "CUSTOMERS"]
        })
    })
});

export const {
    useGetSalesQuery,
    useAddSaleMutation,
    useGetCustomersQuery,
    usePayDebtMutation
} = SaleApi;