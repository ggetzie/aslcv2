import {SpatialAreaQuery} from "./SpatialAreaInterfaces";

export interface Context {
    spatial_area: SpatialAreaQuery | string;
    context_number: number
    id: string;
    type: string;
    opening_date: string;
    closing_date: string;
    description: string;
    director_notes: string;
    contextphoto_set: PhotoDetails[];
    bagphoto_set: PhotoDetails[];
}

export interface PhotoDetails {
    thumbnail_url: string;
    photo_url: string;
}

