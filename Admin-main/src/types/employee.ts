export interface SocialLink {
    icon: string
    url: string
}


interface Employee {
    photo: string
    name: string
    title: string
    socialLinks: SocialLink[]

}

export default Employee