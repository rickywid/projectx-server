import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/:name', function (req, res, next) {

    const name = req.params.name;
   
    if(name === 'popular') {
        db.query(``, [name], (err: any, result: { rows: any; }) => {})
    }

    if(name === 'frontend') {
        db.query(``, [name], (err: any, result: { rows: any; }) => {})
    }

    if(name === 'fullstack') {
        db.query(``, [name], (err: any, result: { rows: any; }) => {})
    }

    if(name === 'collaboration') {
        db.query(``, [name], (err: any, result: { rows: any; }) => {})
    }
});

export default router;

