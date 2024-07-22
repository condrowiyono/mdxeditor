import instance from "./instance";

interface TreeParams {
  path?: string;
  ref?: string;
}

interface Tree {
  id: string;
  name: string;
  type: string;
  path: string;
}

export async function getTree(params?: TreeParams) {
  try {
    const { path, ref } = params || {};

    const response = await instance.get<Tree[]>("/tree", {
      params: { path, ref },
    });

    return response.data.filter((d) => d.type === "blob");
  } catch (error) {
    console.error(error);

    return [];
  }
}
