import Employee from "@/types/employee";

const employeeData: Employee[] = [
    {
        photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
        name: 'John Doe',
        title: "Software Engineer",
        socialLinks: [
            { icon: "facebook", url: "https://facebook.com/johndoe" },
            { icon: "twitter", url: "https://twitter.com/johndoe" },
        ],
    },
    {
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
        name: 'Janes Smith',
        title: "UI/UX Designer",
        socialLinks: [
            { icon: "linkedin", url: "https://linkedin.com/in/janesmith" },
            { icon: "instagram", url: "https://instagram.com/janesmith" },
        ],
    },
    {
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
        name: 'Mike Ross',
        title: "Project Manager",
        socialLinks: [
            { icon: "facebook", url: "https://facebook.com/mikeross" },
            { icon: "instagram", url: "https://instagram.com/mikeross" },
        ],
    },
    {
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
        name: 'Sara Connor',
        title: "Data Scientist",
        socialLinks: [
            { icon: "twitter", url: "https://twitter.com/saraconnor" },
            { icon: "linkedin", url: "https://linkedin.com/in/saraconnor" },
        ],
    },
    {
        photo: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?q=80&w=1974&auto=format&fit=crop",
        name: 'Amy Wong',
        title: "Marketing Specialist",
        socialLinks: [
            { icon: "facebook", url: "https://facebook.com/amywong" },
            { icon: "instagram", url: "https://instagram.com/amywong" },
        ],
    },
];

export default employeeData