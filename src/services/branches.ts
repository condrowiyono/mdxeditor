import instance from "./instance";

export async function getBranches() {
  try {
    const response = await instance.get<string[]>("/branches");

    return response.data;
  } catch (error) {
    console.error(error);

    return [];
  }
}
