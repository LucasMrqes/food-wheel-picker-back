import { MapsSearchResponse, Result } from "../../models/maps";
import { Request, Response } from "express";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

type placeSearchRequest = {
    keyword: string,
    maxprice: number,
    minprice: number,
    opennow: boolean,
    radius: number,
}

const defaultSearchParams: placeSearchRequest = {
    keyword: 'restaurant',
    maxprice: null,
    minprice: null,
    opennow: false,
    radius: 300,
}


async function searchPlaces(req: Request, res: Response) {
    const searchParams: placeSearchRequest = {...defaultSearchParams,radius: parseInt(req.query.radius as string, 10), keyword: req.query.keyword as string, maxprice: parseFloat(req.query.maxprice as string), minprice: parseFloat(req.query.minprice as string)};

    let results: Result[];
    try {
        results = await fetchPlaces(req.query.lat as string, req.query.lng as string, 20, searchParams);
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message})
    }
    const mappedResults = results.map((result) => {
        return {name: result.name, lat: result.geometry.location.lat, lng: result.geometry.location.lng}
    })
    console.log(mappedResults)
    res.status(200).json(mappedResults);
};

async function fetchPlaces(lat: string, lng:string, limit: number, searchParams: placeSearchRequest): Promise<Result[]> {
    const locationParams: string = lat as string + '%2C' + lng as string;
    let searchResponse;
    try {
        searchResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+locationParams, { params: {...searchParams, key: process.env.MAPS_API_KEY }});
    } catch (error) {
        throw new Error('An error occured while reaching google maps nearby search API')
    }

    if (searchResponse.status !== 200) {
        throw new Error('An error occured while reaching google maps nearby search API')
    }

    const searchData : MapsSearchResponse = searchResponse.data;
    let nextPageToken : string = searchData.next_page_token;
    const results: Result[] = []
    results.push(...searchData.results)
    if (results.length >= limit) {
        return results.slice(0, limit);
    }
    while (nextPageToken && results.length < limit) {
        await new Promise(r => setTimeout(r, 2000)).then(async () => {
            let nextSearchReponse;
            try {
                nextSearchReponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken='+nextPageToken, { params: {key: process.env.MAPS_API_KEY }});
            } catch (error) {
                throw new Error('An error occured while reaching google maps nearby search API')
            }
            if (nextSearchReponse.status !== 200) {
                throw new Error('An error occured while reaching google maps nearby search API')
            }
            nextPageToken = nextSearchReponse.data.next_page_token;
            results.push(...nextSearchReponse.data.results);
        })
    }
    return results
}



export default {
    searchPlaces
}
