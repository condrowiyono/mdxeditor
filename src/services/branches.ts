import instance from "./instance";

interface Branch {
  name: string;
}

export async function getBranches() {
  try {
    const response = await instance.get<Branch[]>("/branches");

    return response.data;
  } catch (error) {
    console.error(error);

    return [];
  }
}
