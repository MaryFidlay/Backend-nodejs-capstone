const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Define the upload directory path
const directoryPath = 'public/images';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });


// Get all secondChanceItems
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        //Step 2: task 1 - insert code here
        const db = await connectToDatabase();

        //Step 2: task 2 - insert code here
        const collection = db.collection(process.env.MONGO_COLLECTION);

        //Step 2: task 3 - insert code here
        const secondChanceItems = await collection.find({}).toArray();

        //Step 2: task 4 - insert code here
        res.json(secondChanceItems);

        // const collection = db.collection("secondChanceItems");
        // const secondChanceItems = await collection.find({}).toArray();
        // res.json(secondChanceItems);
    } catch (e) {
        logger.console.error('oops something went wrong', e)
        next(e);
    }
});

// Add a new item
router.post('/', upload.single('file'), async(req, res,next) => {
    try {

        //Step 3: task 1 - insert code here
        const db = await connectToDatabase();

        //Step 3: task 2 - insert code here
        const collection = db.collection(process.env.MONGO_COLLECTION);

        //Step 3: task 3 - insert code here
        let secondChanceItem =  { ...req.body };

        //Step 3: task 4 - insert code here
        const lastItem = await collection.find({}).sort({ id: -1 }).limit(1).toArray();
        secondChanceItem.id = lastItem.length > 0 ? lastItem[0].id + 1 : 1;
    

        //Step 3: task 5 - insert code here
        // const date_added = Math.floor(new Date().getTime() / 1000);
        // secondChanceItem.date_added = date_added

        secondChanceItem.date_added = Math.floor(Date.now() / 1000);

        const result = await collection.insertOne(secondChanceItem);
        res.status(201).json({ ...secondChanceItem, _id: result.insertedId });


    } catch (e) {
        next(e);
    }
});

// Get a single secondChanceItem by ID
// router.get('/:id', async (req, res, next) => {
//     try {
//         //Step 4: task 1 - insert code here
//         const db = await connectToDatabase();

//         //Step 4: task 2 - insert code here
//         const collection = db.collection("secondChanceItems");

//         //Step 4: task 3 - insert code 
//         const itemId = req.params.id;
//         console.log("ID recebido:", itemId);  // debug
//         console.log("Coleção usada:", collection.collectionName);

//         const secondChanceItem = await collection.findOne({ id: itemId });
//         // const secondChanceItem = await collection.findOne({ id: { $regex: `^${itemId}$`, $options: 'i' } });

//         console.log("Resultado da query:", secondChanceItem);

    
//         //Step 4: task 4 - insert code here
//         if (!secondChanceItem) {
//             return res.status(404).send("secondChanceItem not found");
//           }
      
//           res.json(secondChanceItem);

//     } catch (e) {
//         next(e);
//     }
// });


router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");

        const itemId = req.params.id.trim(); // remove espaços extras
        console.log("ID recebido:", itemId);
        console.log("Coleção usada:", collection.collectionName);

        const secondChanceItem = await collection.findOne({ id: { $regex: `^${itemId}$`, $options: 'i' } });
        console.log("Resultado da query:", secondChanceItem);

        if (!secondChanceItem) {
            return res.status(404).send("secondChanceItem not found");
        }

        res.json(secondChanceItem);

    } catch (e) {
        next(e);
    }
});


// Update and existing item
router.put('/:id', async(req, res,next) => {
    try {
        //Step 5: task 1 - insert code here
        const db = await connectToDatabase();

        //Step 5: task 2 - insert code here
        const collection = db.collection(process.env.MONGO_COLLECTION);

        //Step 5: task 3 - insert code here
        const itemId = parseInt(req.params.id);
        const secondChanceItem = await collection.findOne({ id: itemId });

        if (!secondChanceItem) {
        // logger.error('secondChanceItem not found');
        return res.status(404).json({ error: "secondChanceItem not found" });
    }
        //Step 5: task 4 - insert code here
        secondChanceItem.category = req.body.category;
        secondChanceItem.condition = req.body.condition;
        secondChanceItem.age_days = req.body.age_days;
        secondChanceItem.description = req.body.description;
        secondChanceItem.age_years = Number((secondChanceItem.age_days/365).toFixed(1));
        secondChanceItem.updatedAt = new Date();

        const result = await collection.findOneAndUpdate(
            { id: itemId },
            { $set: secondChanceItem },
            { returnDocument: 'after' }
        );

        //Step 5: task 5 - insert code here
        if(result.value) {
            res.json({"uploaded":"success"});
        } else {
            res.status(500).json({"uploaded":"failed"});
        }

    } catch (e) {
        next(e);
    }
});

// Delete an existing item
router.delete('/:id', async(req, res,next) => {
    try {
        //Step 6: task 1 - insert code here
        const db = await connectToDatabase();

        //Step 6: task 2 - insert code here
        const collection = db.collection(process.env.MONGO_COLLECTION);

        //Step 6: task 3 - insert code here
        const itemId = parseInt(req.params.id);
        const secondChanceItem = await collection.findOne({ id: itemId });
       

        if (!secondChanceItem) {
        logger.error('secondChanceItem not found');
        return res.status(404).json({ error: "secondChanceItem not found" });
    }

        //Step 6: task 4 - insert code here
        await collection.deleteOne({  id: itemId  });
        res.json({"deleted":"success"});

    } catch (e) {
        next(e);
    }
});

module.exports = router;
