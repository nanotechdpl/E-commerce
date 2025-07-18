import instance from "./axios";

export interface FooterOfficeAddress {
  _id?: string;
  address: string;
  phone: string;
  email: string;
  flex: string;
}

export interface FooterOfficeAddressResponse {
  success: boolean;
  message: string;
  error?: string;
  officeAddress: FooterOfficeAddress[];
}
export interface SocialLink {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
}

export interface FooterBranch {
  name: string;
  call: string;
  email: string;
  officeAddress: string;
  photo: string;
  socialLink: SocialLink;
}

export const footer_office_address_create = async (
    data: FooterOfficeAddress
  ): Promise<FooterOfficeAddressResponse | undefined> => {
    try {
      const response = await instance.post(`/admin/office-address/add`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating footer office address:", error);
      throw error;
    }
  };
export const footer_branch_create = async (
  data: FooterBranch
): Promise<FooterBranch> => {
  try {
    const response = await instance.post(`/admin/global-location`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating footer branch:", error);
    throw error;
  }
};

export const footer_branch_get = async (): Promise<FooterBranch[]> => {
  try {
    const response = await instance.get(`/admin/global-location`);
    return response.data;
  } catch (error) {
    console.error("Error fetching footer branches:", error);
    throw error;
  }
};

export const footer_branch_edit = async (
  id: string,
  data: FooterBranch
): Promise<FooterBranch> => {
  try {
    const response = await instance.put(`/admin/global-location/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error editing footer branch with id ${id}:`, error);
    throw error;
  }
};
