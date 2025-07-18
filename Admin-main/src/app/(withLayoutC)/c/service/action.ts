import instance from "@/api/axios";


export const getAllTechnical = async () => {
  const res = await instance.get(`/menu-services/technical`);
  console.log(res.data);
  return res.data.technicals;
};
export const getAllConstructions = async () => {
  const res = await instance.get(`/factory-app/construction`);
  console.log(res.data);
  return res.data.constructions;
};

export const getAllExports = async () => {
  const res = await instance.get(`/factory-app/export`);
  console.log(res.data);
  return res.data.exports;
};
export const getAllVisas = async () => {
  const res = await instance.get(`/factory-app/visa`);
  console.log(res.data);
  return res.data.visas;
};
export const getAllTravellings = async () => {
  const res = await instance.get(`/factory-app/travelling`);
  console.log(res.data);
  return res.data.travellings;
};
