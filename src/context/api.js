import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000"
}); 

const baseQuery = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions)
    return result;
};

export const api = createApi({
    reducerPath: "splitApi",
    baseQuery,
    tagTypes: [],
    endpoints: () => ({})
})