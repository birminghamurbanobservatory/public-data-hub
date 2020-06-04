export interface Deployment {
    '@id': string;
    '@type': string;
    id?: string;
    label: string;
    description?: string;
    public: boolean;
    createdAt: string;
    updatedAt: string;
    colour?: string;
}