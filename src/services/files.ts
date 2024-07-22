import instance from "./instance";

interface FileParams {
  path?: string;
  ref?: string;
}

export async function getFiles(params?: FileParams) {
  try {
    const { path, ref } = params || {};

    const response = await instance.get<string>("/files", {
      params: { path, ref },
    });

    return response.data;
  } catch (error) {
    console.error(error);

    return "";
  }
}
