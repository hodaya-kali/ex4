const express = require('express')
const Lecture = require('../models/lecture')
const router = new express.Router()

router.post('/lectures', (req, res) => {
    let valid = putValidation(req, res);
    if(!valid)
    {
        res.status(404).send()
        return false;
    }
    const lecture = new Lecture(req.body);
    lecture.save().then(lecture=>
        res.status(201).send(lecture)
    ).catch(e=>res.status(400).send(e))
})

// router.get('/lectures', (req, res) => {
//     Task.find().populate('author').then(lectures => res.send(lectures)
//     ).catch (e=> res.status(500).send())
// })

function putValidation(req, res) {
    // add the new conference
    // const userName = req.params["name"];
    const userName = req.body.name;
    // const userName = req.params["name"];
    //check if all field is not empty
    let all_fields_array = ["name", "imageUrl", "site"];
    let fields_enterd = Object.keys(req.body);
    for (let i = 0; i < all_fields_array.length; i++) {
        if (all_fields_array[i] != fields_enterd[i]) {
            if (i === 2 && Object.keys(req.body).length === 2) {
                if (Object.keys(req.body).length > 2) {
                    console.log("There is unnecessary parameters");
                    res
                        .status(400)
                        .send("There is unnecessary parameters");
                        return false;
                }
                break;
            }
            if (Object.keys(req.body).length >3) {
                console.log("2");
                 res
                    .status(400)
                    .send("There is unnecessary parameters");
                    return false;
            }
        }
    }
    if (!req.body.name || !req.body.imageUrl) {
        console.log("3");
        console.log(req.body.name);
         res.status(400).send("missing field");
         return false;
    }

    if (Object.keys(req.body).length > 3) {
        console.log("4");
         res.status(400).send("There is unnecessary parameters");
         return false;
    }
    return true;

}

module.exports = router