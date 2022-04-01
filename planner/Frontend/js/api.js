const BASE_URL = "http://localhost:3000/api/pools";

const baseRequest = async({ urlPath = "", method = "GET", body = null }) => {
    try {
        const reqParams = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (body) {
            reqParams.body = JSON.stringify(body);
        }

        return await fetch(`${BASE_URL}${urlPath}`, reqParams);
    } catch (error) {
        console.error("HTTP ERROR: ", error);
    }
};

const getAllPools = async() => {
    const rawResponse = await baseRequest({ method: "GET" });
    return await rawResponse.json();
};

const getPoolsById = async(id) => {
    const rawResponse = await baseRequest({ urlPath: `/${id}`, method: "GET" });
    return await rawResponse.json();
};

const searchPools = async(key) => {
    const rawResponse = await baseRequest({
        urlPath: `?searchKey=${key}`,
        method: "GET",
    });
    return await rawResponse.json();
};

const postPools = (body) => baseRequest({ method: "POST", body });

const deletePools = (id) => baseRequest({ urlPath: `/${id}`, method: "DELETE" });

const editPools = (id, body) => baseRequest({ urlPath: `/${id}`, method: "PUT", body });

export {
    getAllPools,
    searchPools,
    postPools,
    deletePools,
    editPools,
    getPoolsById,
};