import { api } from "./api";

export const EmployeeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getEmployees: builder.query({
            query: () => `/employees`,
            providesTags: ["EMPLOYEES"]
        }),

        getEmployeeById: builder.query({
            query: (id) => `/employees/${id}`,
            providesTags: ["EMPLOYEES"]
        }),

        addEmployee: builder.mutation({
            query: (body) => ({
                url: `/employees`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ["EMPLOYEES"]
        }),

        updateEmployee: builder.mutation({
            query: ({ id, body }) => ({
                url: `/employees/${id}`,
                method: "PUT",
                body: body
            }),
            invalidatesTags: ["EMPLOYEES"]
        }),

        deleteEmployee: builder.mutation({
            query: (id) => ({
                url: `/employees/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["EMPLOYEES"]
        }),

        employeeLogin: builder.mutation({
            query: (body) => ({
                url: `/employees/login`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ["EMPLOYEES"]
        })
    })
});

export const {
    useGetEmployeesQuery,
    useGetEmployeeByIdQuery,
    useAddEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
    useEmployeeLoginMutation
} = EmployeeApi;