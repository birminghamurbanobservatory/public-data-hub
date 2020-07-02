export interface Deployment {
    id: string;
    type: string;
    label: string;
    description?: string;
    public: boolean;
    createdAt: string;
    updatedAt: string;
    colour?: string;
}