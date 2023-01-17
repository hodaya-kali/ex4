const express = require('express')
const Lecture = require('../models/lecture')
const router = new express.Router()

router.post('/lectures', (req, res) => {
    const lecture = new Task(req.body);
    lecture.save().then(task=>
        res.status(201).send(task)
    ).catch(e=>res.status(400).send(e))
})

router.get('/lectures', (req, res) => {
    Task.find().populate('author').then(lectures => res.send(lectures)
    ).catch (e=> res.status(500).send())
})


module.exports = router