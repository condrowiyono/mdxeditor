import instance from "./instance";

interface TreeParams {
  path?: string;
  ref?: string;
}

export async function getTree(params?: TreeParams) {
  try {
    const { path, ref } = params || {};

    const response = await instance.get<Record<string, string>>("/tree", {
      params: { path, ref },
    });

    return response.data;
  } catch (error) {
    console.error(error);

    return {};
  }
}
