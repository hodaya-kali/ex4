const express = require('express');
const Conference = require('../models/conference');
// const User = require('../models/user')
const router = new express.Router()

router.post('/conference', (req, res) => {
    if(validateFields(req,res))
    {
        const conference = new Conference(req.body)
        conference.save().then(conference => {
            console.log("in then - save");
            res.status(201).send(conference)
        }).catch(e => {
            res.status(400).send(e)
        });
    }
});

router.get('/conference', (req, res) => {
    Conference.find().then(conference =>
        res.send(conference)
    ).catch(e => res.status(500).send())
})

router.put('/conferences/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'imageUrl', 'director', 'date','isSeries','series_number']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
         res.status(400).send({ error: 'Invalid updates!' })
         return false;
    }

    Conference.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).then(conference => {
        if (!conference) {
             res.status(404).send()
             return false;
        }
        else {
            console.log(conference)
            res.send(conference)
        }
    }).catch(e => res.status(400).send(e))
})

module.exports = router

function validateFields(req,res){
    let all_fields_array = [
        "name",
        "imageUrl",
        "director",
        "date",
        "isSeries",
        "series_number",
    ];
    let fields_enterd = Object.keys(req.body);

    //check if all field is not empty
    if (
        !req.body.name ||
        !req.body.imageUrl ||
        !req.body.director ||
        !req.body.date ||
        req.body.isSeries === ""
    ) {
        console.log("missing field")
         res.status(400).send("missing field");
         return false
    }
    if (req.body.isSeries === true||req.body.isSeries ==="true") {
        if (!req.body.series_number) {
         res.status(400).send("missing field");
         return false;
        }
    }

    //check if there is no unnecessary parameters
    if(req.body.isSeries === "true"||req.body.isSeries ===true) {
        console.log(Object.keys(req.body));
        if (Object.keys(req.body).length > 6) {
            res
                .status(400)
                .send("There is unnecessary parameters");
                return false;
        }
    }  
    //if isSeries is false cant insert series number greather then one
    else{
        if(req.body.series_number!=null)
        {
            if(req.body.series_number>1)
            {
               res
               .status(400)
               .send("The series number cannot be bigger then one");
               return false;
            }
        }
       
    }
    //TODO check if the conference is already exist
    // Conference.countDocuments({ id: req.body.id })
    //         .then(count => {
    //             if (count > 0) {
    //                  res.status(400).send("Conference already exists");
    //                  return false;
    //             } 
    // else {
    //              return true;
    //             }
    //         }).catch(e => res.status(400).send(e))
 
                     return true
}

function putValidation(req,res){
      // check if conferenceId exists in params
      const conferenceId = req.params.id;
      if (!conferenceId) {
          return res.status(404).send("no conference id provided");
      }
      // TODO check if conferenceId exits
    //   const exsistingIds = Object.keys(data);
    //   if (!exsistingIds.includes(conferenceId)) {
    //       console.log("conference id not exist", conferenceId);
    //       return res.status(400).send("conference id not exist");
    //   }
      // if isSeries changed from fals to true series_number is required
    //   if (
    //       !data[conferenceId].isSeries &&
    //       req.body.isSeries &&
    //       !req.body.series_number
    //   ) 
    //   {
    //       console.log();

    //       return res
    //           .status(400)
    //           .send(" a series conference must include a serial number");
    //   }
      if(req.body.isSeries && req.body.series_numbe < 2){
          console.log("a series conference must be a number bigger than 1");

          return res
              .status(400)
              .send(
                  " a series conference must be a number bigger than 1"
              );
      }
    //   if (
    //       req.body.isSeries &&
    //       typeof req.body.series_number === "number" &&
    //       req.body.series_numbe < 2
    //   ) {
    //       console.log("a series conference must be a number bigger than 1");

    //       return res
    //           .status(400)
    //           .send(
    //               " a series conference must be a number bigger than 1"
    //           );
    //   }

    //   const fieldsEntered = Object.keys(req.body);
    //   const legalFields = {
    //       id: "string",
    //       name: "string",
    //       logo_picture: "string",
    //       director: "string",
    //       date: "string",
    //       isSeries: "boolean",
    //       series_number: "number",
    //   };

      const isReqValid = fieldsEntered.every((enteredKey) => {
    //       if(enteredKey === 'id'){
    //           console.log(enteredKey)
    //           return true;
    //       }
          if (!Object.keys(legalFields).includes(enteredKey)) {
              console.log(`the field ${enteredKey} is not legal`);
             res.status(400)
                  .send(`the field ${enteredKey} is not legal`);
                  return false;
          }
        //   if (typeof req.body[enteredKey] != legalFields[enteredKey]) {
        //        res
        //       .status(400)
        //       .send(`the type of field ${enteredKey} is not legal`);
        //       return false;
        //   }
        //   const urlRegex =
        //       /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
        //   if (
        //       enteredKey === "logo_picture" &&
        //       req.body.logo_picture &&
        //       !urlRegex.test(req.body.logo_picture)
        //   ) {
        //       console.log(enteredKey, urlRegex.test(req.body.logo_picture));
        //       res
        //       .status(400)
        //       .send(`the field ${enteredKey} must be a valid URL`);
        //       return false
        //   }
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
              data[conferenceId][enteredKey] = req.body[enteredKey];
              return true;
          }else{
              return true;
          }
      });
      if(!isReqValid){
          console.log('res with error');
          return;
      }
      writeFile(JSON.stringify(data, null, 2), () => {
          console.log('res 200');
          res.status(200).send(`users id:${conferenceId} updated`);
      });
}