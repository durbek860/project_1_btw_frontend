import { api } from "./api";

export const NormApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getNorms: builder.query({
            query: () => `/norms`,
            providesTags: ["NORMS"]
        }),

        getNormById: builder.query({
            query: (id) => `/norms/${id}`,
            providesTags: ["NORMS"]
        }),

        addNorm: builder.mutation({
            query: (body) => ({
                url: `/norms`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ["NORMS"]
        }),

        updateNorm: builder.mutation({
            query: ({ id, body }) => ({
                url: `/norms/${id}`,
                method: "PUT",
                body: body
            }),
            invalidatesTags: ["NORMS"]
        }),

        deleteNorm: builder.mutation({
            query: (id) => ({
                url: `/norms/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["NORMS"]
        })
    })
});

export const {
    useGetNormsQuery,
    useGetNormByIdQuery,
    useAddNormMutation,
    useUpdateNormMutation,
    useDeleteNormMutation,
} = NormApi;