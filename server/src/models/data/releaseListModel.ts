import { ReleaseList } from "../../mongo/releaseList";

export interface ReleaseListModel {
    createdAt: Date;
    updatedAt: Date;
    versions: {
        name: string;
        startDate: Date;
    }[];
}

export async function getReleaseList() {
    const entity = await ReleaseList.findOne();
    return entity as ReleaseListModel;
}

export async function saveReleaseList(model: ReleaseListModel) {
    await ReleaseList.findOneAndUpdate(undefined, model, { upsert: true });
}