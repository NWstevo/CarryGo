import { api } from "./axios";

export const itemCategoriesApi = {
  async list() {
    const { data } = await api.get("/item-categories");
    return { categories: data.filter((category) => !category.is_blocked) };
  },
};
