interface Location {
    lat: number;
    lng: number;
}

interface Northeast {
    lat: number;
    lng: number;
}

interface Southwest {
    lat: number;
    lng: number;
}

interface Viewport {
    northeast: Northeast;
    southwest: Southwest;
}

interface Geometry {
    location: Location;
    viewport: Viewport;
}

interface OpeningHours {
    open_now: boolean;
}

interface PlusCode {
    compound_code: string;
    global_code: string;
}

export interface Result {
    business_status: string;
    geometry: Geometry;
    icon: string;
    icon_background_color: string;
    icon_mask_base_uri: string;
    name: string;
    opening_hours: OpeningHours;
    place_id: string;
    plus_code: PlusCode;
    price_level: number;
    rating: number;
    reference: string;
    scope: string;
    types: string[];
    user_ratings_total: number;
    vicinity: string;
}

export interface MapsSearchResponse {
    html_attributions: any[];
    next_page_token: string;
    results: Result[];
    status: string;
}
