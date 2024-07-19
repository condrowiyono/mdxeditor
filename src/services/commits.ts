import instance from "./instance";

export interface Commit {
  branch: string;
  start_branch?: string;
  commit_message: string;
  actions: Action[];
}

export interface Action {
  action: string;
  file_path: string;
  content?: string;
  previous_path?: string;
  execute_filemode?: boolean;
}

export async function commits(body: Commit) {
  try {
    const response = await instance.post("/commits", body);

    return response.data;
  } catch (error) {
    console.error(error);

    return {};
  }
}
