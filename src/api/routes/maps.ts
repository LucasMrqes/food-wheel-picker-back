import bodyParser from 'body-parser';
import mapsController from '../controllers/maps'
import { Router } from 'express';
import { check, param, validationResult } from "express-validator";

const router = Router();

router.get("/",
    check('lat').exists().isFloat(),
    check('lng').exists().isFloat(),
    check('keyword').exists().isString(),
    check('maxprice').optional().isInt({min: 0, max: 4}),
    check('minprice').optional().isInt({min: 0, max: 4}),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        mapsController.searchPlaces(req,res)
    });

export default router;
