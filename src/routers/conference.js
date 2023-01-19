const express = require('express');
const Conference = require('../models/conference');
// const User = require('../models/user')
const router = new express.Router()


//add a lecture to a conference, There is no need of validation checking because we enter just a lecture that already in the collection.
    router.put('/conferences/:id/lectures/:lectureId', (req, res) => {
     const conferenceId = req.params['id'];
    const lecture =  req.params['lectureId'];
    
    Conference.findOne({ _id: conferenceId }).exec().then(conference => {
        if (!conference) {
            res.status(404).send("conference doesnt exist");
        }  
        else {
            conference.lectures.push(lecture);
            conference.save((err) => {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.status(201).send("saved succesfully");
                }
            });
        }
    }).catch(e => res.status(400).send(e));
   })

//get conference by id
router.get('/conferences/:id', (req, res) => {
    Conference.findById(req.params.id).then(conference => {
        if (!conference) {
             res.status(404).send()
             return false;
        } 
        else {
            res.send(conference)
        }
    }).catch(e => res.status(400).send(e))
})


router.delete('/conferences/:id/lectures', (req, res) => {
    const conferenceId = req.params['id'];
    // const lecture = req.params['letureId']; 
        Conference.findById(conferenceId, (err, conference) => {
            if (!conference) {
                res.status(404).send("conference does not exist")
                return false;
           } 
            if (err) {
                res.status(500).send(err);
            } else {
                // const lectureIndex = conference.lectures.findIndex(lecture => lecture._id == lecture);
                // if (lectureIndex < 0) {
                //     res.status(404).send("Lecture not found");
                //     return false;
                // }
                 conference.lectures=[];
                isExist = true;
                conference.save((err, updatedConference) => {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.send({ message: 'Lecture deleted from conference' });
                    }
                });
            }
        });

})

router.delete('/conferences/:id', (req, res) => {
    Conference.findOneAndRemove(req.params.id).then(conference => {
        if (!conference) {
             res.status(404).send("conference does not exist")
             return false;
        } 
        else {
            res.status(200).send("conference deleted");
        }
    }).catch(e => res.status(400).send(e))
})

router.post('/conferences', (req, res) => {
      let check = validateFields(req,res);
      if(check)
    {
        console.log(req.body);
        const conference = new Conference(req.body)
        console.log(conference);
        conference.save().then(conference => {
            console.log("in then - save");
            res.status(201).send(conference)
        }).catch(e => {
            res.status(400).send(e)
        });
    }
});

router.get('/conferences', (req, res) => {
    Conference.find().then(conference =>
        res.send(conference)
    ).catch(e => res.status(500).send())
})

//update a conference
router.put('/conferences/:id', async (req, res) => {
    // const updates = Object.keys(req.body)
    // const allowedUpdates = ['name', 'imageUrl', 'director', 'date','isSeries','series_number']
    // const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    // if (!isValidOperation) {
    //      res.status(400).send({ error: 'Invalid updates!' })
    //      return false;
    // }
    let valid = putValidation(req, res);
    if(!valid)

    {
        return;
    }
    Conference.findByIdAndUpdate(req.params.id, req.body, { new: true}).then(conference => {
        if (!conference) {
             res.status(404).send()
             return false;
        } 
        else {
            res.send(conference)
        }
    }).catch(e => res.status(400).send(e))
})




module.exports = router

function validateFields(req,res){
    console.log(req.body.id);
        let all_fields_array = [
            "id",
            "name",
            "imageUrl",
            "director",
            "date",
            "isSeries",
            "series_number",
        ];
        let fields_enterd = Object.keys(req.body);
        for (let i = 0; i < all_fields_array.length; i++) {
            if (all_fields_array[i] != fields_enterd[i]) {
                if (!req.body.isSeries && i == 6) {
                    console.log("bhubufr");
                    break;
                } 
                else {
                    console.log("else");
                    console.log(req.body.isSeries);
                     res.status(400).send("missing field");
                     return false;
                }
            }
        }
        
        if (req.body.isSeries == "true" ) {
            if (!req.body.series_number) {
                 res.status(400).send("missing field");
                 return false;
            }
        }

        //check if there is no unnecessary parameters
        if(req.body.isSeries == "true") {
            if (Object.keys(req.body).length > 7) {
                 res
                    .status(400)
                    .send("There is unnecessary parameters");
                    return false;
            }
        } 
        // else {
        //     if(Object.keys(req.body).length>6)
        //     {
        //         req.body.series_number=1;
        //     }
        // }
        return true;
}

function putValidation(req,res){
    console.log(req.body);
    //rence id cannot be update 
    if(req.body.id)
    {
       
         res.status(404).send("conference id cannot be update");
         return false;
    }
 
    // check if conferenceId exists in params
    const conferenceId = req.params.id;
    if (!conferenceId) {
         res.status(404).send("no conference id provided");
         return false;
    }
    // TODO check if conferenceId exits
  //   const exsistingIds = Object.keys(data);
  //   if (!exsistingIds.includes(conferenceId)) {
  //       console.log("conference id not exist", conferenceId);
  //       return res.status(400).send("conference id not exist");
  //   }
    // if isSeries changed from fals to true series_number is required
    //TODO if isseries is strings
    if (
        req.body.isSeries &&
        !req.body.series_number&& 
        req.body.isSeries!=false
    ) 
    {
         res
            .status(400)
            .send(" a series conference must include a serial number");
            return false;
    }
    if(req.body.isSeries && req.body.series_numbe < 2){
        console.log("a series conference must be a number bigger than 1");

         res
            .status(400)
            .send(
                " a series conference must be a number bigger than 1"
            );
            return false;
    }
    if (
        req.body.isSeries &&
        typeof req.body.series_number === "number" &&
        req.body.series_numbe < 2
    ) {
        console.log("a series conference must be a number bigger than 1");

         res
            .status(400)
            .send(
                " a series conference must be a number bigger than 1"
            );
            return false;
    }

    const fieldsEntered = Object.keys(req.body);
    const legalFields = {
        name: "string",
        imageUrl: "string",
        director: "string",
        date: "string",
        isSeries: "boolean",
        series_number: "number",
    };

    const isReqValid = fieldsEntered.every((enteredKey) => {
        // if(enteredKey === 'id'){
        //     console.log(enteredKey)
        //     return false;
        // }
        if (!Object.keys(legalFields).includes(enteredKey)) {
            console.log(`the field ${enteredKey} is not legal`);
           res.status(400)
                .send(`the field ${enteredKey} is not legal`);
                return false;
        }
        if (typeof req.body[enteredKey] != legalFields[enteredKey]) {
             res
            .status(400)
            .send(`the type of field ${enteredKey} is not legal`);
            return false;
        }
        const urlRegex =
            /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
        if (
            enteredKey === "imageUrl" &&
            req.body.imageUrl &&
            !urlRegex.test(req.body.imageUrl)
        ) {
            console.log(enteredKey, urlRegex.test(req.body.imageUrl));
            res
            .status(400)
            .send(`the field ${enteredKey} must be a valid URL`);
            return false
        }
           // if isSeries update to false 
    if(req.body.isSeries===false||req.body.isSeries==="false")
    {
        updateSeriesNumber(req,res);
    }
    if((req.body.isSeries===false||req.body.isSeries==="false")&&req.body.series_number)
    {
        res
        .status(400)
        .send("series number cannot be sent if isseries field is false");
        return false
    }
        //check if entered date is valid
        if (
            enteredKey === "date" &&
            req.body.date &&
            isNaN(new Date(req.body[enteredKey]))
        ) {
            console.log(enteredKey, isNaN(new Date(req.body[enteredKey])));
            res
            .status(400)
            .send(`the field ${enteredKey} must be a valid Date`);
            return false;
        }
        //req.body[enteredKey] 
        if ( req.body[enteredKey]!==undefined &&  req.body[enteredKey]!== "") {
            console.log(`${enteredKey} assigned to ${req.body[enteredKey]}`);
          //   data[conferenceId][enteredKey] = req.body[enteredKey];
            return true;
        }
        else{
            return false;
        }
    });
    if(!isReqValid){
        console.log('res with error');
        return;
    }
    return true;
}

function updateSeriesNumber(req,res)
{
    Conference.updateMany({}, { $set: { series_number: 1 } }, (err, raw) => {
        if (err) {
            return handleError(err);
        }
        console.log('The series_number field was updated.');
    });
}