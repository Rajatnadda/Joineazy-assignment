import { students, assignments } from "../data/seedData";

export const loadData = () => {
  const data = localStorage.getItem("joineazy_data");
  return data ? JSON.parse(data) : { students: [], assignments: [] };
};

export const saveData = (data) => {
  localStorage.setItem("joineazy_data", JSON.stringify(data));
};

export const seedIfEmpty = () => {
  const existing = localStorage.getItem("joineazy_data");

  if (!existing) {
    const seed = { students, assignments };
    localStorage.setItem("joineazy_data", JSON.stringify(seed));
    console.log(" Seed data added to localStorage!");
  }
};
