const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', (req, res) => {
    const task = new Task(req.body);

    task.save().then(task=>
        res.status(201).send(task)
    ).catch(e=>res.status(400).send(e))
})

router.get('/tasks', (req, res) => {
    Task.find().populate('author').then(tasks => res.send(tasks)
    ).catch (e=> res.status(500).send())
})


module.exports = router