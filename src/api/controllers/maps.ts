import { MapsSearchResponse } from "../../models/maps";
import { Request, Response } from "express";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

type placeSearchRequest = {
    keyword: string,
    maxprice: number,
    minprice: number,
    opennow: boolean,
    // radius: number,
    rankby: string,
}

const defaultSearchParams: placeSearchRequest = {
    keyword: 'restaurant',
    maxprice: 4,
    minprice: 0,
    opennow: false,
    // radius: 50,
    rankby: "distance"
}

async function searchPlaces(req: Request, res: Response) {
    const limit = 20;
    // TODO: add open now + catch wrong/empty params
    const searchParams: placeSearchRequest = {...defaultSearchParams, keyword: req.query.keyword as string, maxprice: parseFloat(req.query.maxprice as string), minprice: parseFloat(req.query.minprice as string)};
    const locationParams: string = req.query.lat as string + '%2C' + req.query.lng as string;
    const searchResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+locationParams, { params: {...searchParams, key: process.env.MAPS_API_KEY }});

    // TODO: Catch error if data.status != OK
    const searchData : MapsSearchResponse = searchResponse.data;
    let nextPageToken : string = searchData.next_page_token;
    // TODO: What if there are no results?
    const results = []
    results.push(...searchData.results)
    while (nextPageToken && results.length < limit) {
        await new Promise(r => setTimeout(r, 2000)).then(async () => {
            const nextSearchReponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken='+nextPageToken, { params: {key: process.env.MAPS_API_KEY }});
            // TODO: Catch error if data.status != OK
            const nextSearchData = nextSearchReponse.data;
            nextPageToken = nextSearchData.next_page_token;
            results.push(...nextSearchData.results);
        })
    }
    const mappedResults = results.map((result) => {
        return {name: result.name, lat: result.geometry.location.lat, lng: result.geometry.location.lng}
    })
    res.status(200).json(mappedResults);
};



export default {
    searchPlaces
}
