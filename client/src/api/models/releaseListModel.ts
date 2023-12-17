export interface ReleaseListModel {
    createdAt: string;
    updatedAt: string;
    versions: {
        name: string;
        startDate: string;
    }[];
}