"use strict"
let express = require('express');
let router = express.Router();
let Parse = require('parse').Parse;
let parseQuery = require('../modules/parseQuery');
let auth = require('../modules/auth');

router.get('/:id', (req, res) => {
    parseQuery.getObject({class: "Project", id: req.params.id},
        (project) => {
            parseQuery.getObject({class: "User", id: project.object.attributes.developerId},
                 (projectDeveloper) => {
                     parseQuery.getObject({class: "Company", id: project.object.attributes.companyId},
                         (projectCompany) => {
                             res.render('../pages/project_dashboard', {"projectTitle": project.object, "projectDeveloper": projectDeveloper.object, "projectCompany": projectCompany.object});
                 }, (error) =>{
                             res.json("error");
                         });
                 }, (error) =>{
                     res.json("error");
                 });
        }, (error) => {
            res.json("error");
        });
});

router.put('/:id', (req, res) => {
    let requestToProjectClass;
    let projectStatuses = ["waiting", "running", "testing", "complete", "delivered"];

    function whichStatusRequested(statusesForUpdate){
        requestToProjectClass = statusesForUpdate;
        updateProjectData(requestToProjectClass);
    }
    function updateProjectData(dataForUpdate){
        parseQuery.updateObject({class: "Project", id: req.body.id, data: requestToProjectClass},
            (answer) => {
                res.json("ok");
            }, (error) => {
                res.json("error");
            });
    }

    parseQuery.filterObjects({class: "ProjectStatusStages", filters: [{key: "projectId", value: req.body.id, condition: "="}]},
        (answer) => {
            parseQuery.updateObject({class: "ProjectStatusStages", id: answer.object[0].id, data: req.body.data},
                (answer) => {

                    if(req.body.status == "waiting") whichStatusRequested({statusWaiting: "active"});
                    else if(req.body.status == "running") whichStatusRequested({statusRunning: "active" ,statusWaiting: "complete"});
                    else if(req.body.status == "testing") whichStatusRequested({statusTesting: "active", statusRunning: "complete"});
                    else if(req.body.status == "complete") whichStatusRequested({statusComplete: "active", statusTesting: "complete"});
                    else if(req.body.status == "delivered") whichStatusRequested({statusDelivered: "complete"});

                }, (error) => {
                    res.json("error");
                });
        }, (error) => {
            res.json("error");
        });


});
module.exports = router;
