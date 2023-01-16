const express = require('express'),
    conferenceRoutes = require('./conference');

var router = express.Router();

// router.get('/conferences/:id', conferenceRoutes.get_conferences_by_id);
router.get('/conferences', conferenceRoutes.get_conferences);
router.post('/conferences', conferenceRoutes.create_conference );
router.put('/conferences/:id', conferenceRoutes.update_conference);
// router.put('/conferences/lecture/:id', conferenceRoutes.add_lecture_to_conference );
// router.delete('/conferences/:id/lectures/:name', conferenceRoutes.delete_lecturer_from_conference );
// router.delete('/conferences/:id', conferenceRoutes.delete_conference );
module.exports = router;


