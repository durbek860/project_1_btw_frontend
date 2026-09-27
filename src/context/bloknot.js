import { api } from "./api";

export const TransactionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTransactions: builder.query({
            query: () => `/transactions/all`,
            providesTags: ["TRANSACTIONS"]
        }),

        getFilteredTransactions: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();  

                if (params?.type) queryParams.append('type', params.type);
                if (params?.startDate) queryParams.append('startDate', params.startDate);
                if (params?.endDate) queryParams.append('endDate', params.endDate);

                const queryString = queryParams.toString();
                return {    
                    url: `/transactions/filtered${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ["TRANSACTIONS"]
        }),

        addTransactions: builder.mutation({
            query: ({ id, body }) => ({
                url: `/transactions/create`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ["TRANSACTIONS"]
        }),

        changeTransactions: builder.mutation({
            query: ({ id, body }) => ({
                url: `/transactions/update/${id}`,
                method: "PUT",
                body: body  
            }),
            invalidatesTags: ["TRANSACTIONS"]       
        }),

        deleteTransactions: builder.mutation({
            query: ({ id, body }) => ({
                url: `/transactions/delete/${id}`,
                method: "DELETE",
                body: body
            }),
            invalidatesTags: ["TRANSACTIONS"]
        }),
    })
})

export const {
    useGetTransactionsQuery,
    useGetFilteredTransactionsQuery, 
    useAddTransactionsMutation,
    useChangeTransactionsMutation,
    useDeleteTransactionsMutation
} = TransactionApi