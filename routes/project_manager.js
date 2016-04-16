"use strict";
let express = require('express');
let router = express.Router();
let Parse = require('parse').Parse;
let parseQuery = require('../modules/parseQuery');
let auth = require('../modules/auth');


    router.get('/', (req, res) => {
        let queryProject = new Parse.Query("Project");
        let arrGetProjects = [];
        let linkedProjects;
        let developers;
        let projectRequest = "ProjectRequest";
        let counter = 0;
        let linkTypeId;
        function DeleteRepeatingElements(loadedArray) {
            for (let i = 0; i < loadedArray.length; i++) {
                for (let j = i + 1; j < loadedArray.length;) {
                    if (loadedArray[i].id == loadedArray[j].id) loadedArray.splice(j, 1);
                    else j++;
                }
            }
        }
        function checker() {
            counter++;
            if (counter == 2) {

                DeleteRepeatingElements(arrGetProjects);
                res.render("../pages/manager/project_manager",
                    {
                         "projects": arrGetProjects
                        , "linkedProjects": linkedProjects
                        , "developers": developers

                    }
                );
            }
        }
        function queryFormation(queryType, arrGetType, queryClass, linkedType){
            parseQuery.getObjects({class: queryClass}, (answer) => {
                let check = 0;
                linkedType = answer.object;
                if(answer.object.length == 0){
                    checker();
                }
                else{
                    for(let i=0; i<answer.object.length ;i++){
                            linkTypeId = answer.object[i]._serverData.projectId;
                        queryType.get(linkTypeId, {
                            success: (getData) => {
                                check++;
                                arrGetType = arrGetType.concat(getData)
                                if(check==answer.object.length){
                                    arrGetProjects = arrGetType;
                                    linkedProjects = linkedType;
                                    checker();
                                }
                            },
                            error: (error) => {
                                console.log("error", error);
                            }
                        });
                    }
                }
            }, (error) => {
                console.log("error", error);
            });
        }
                queryFormation(queryProject, arrGetProjects, projectRequest, linkedProjects);


        parseQuery.getObjects({
            class: "User"
        }, function (answer) {
            if (answer.result == 'ok') {
                developers = answer.object;
                checker();
            } else {
                console.log("getting projects error", answer.error);
                res.json("error");
            }
        });
        });

    router.put('/', (req, res) => {
        let signupDeveloperId = req.body.developerBody;
        let projectId = req.body.projectId;
            parseQuery.updateObject({class: "Project", id: projectId, data: signupDeveloperId}, (answer) => {
                parseQuery.addObject({class: "ProjectStatusStages", data: {projectId: req.body.projectId}},
                    (answer) => {
                        parseQuery.filterObjects(
                            {class: 'ProjectRequest', filters: [{key: 'projectId', value: projectId, condition: "="}]},
                            function (answer) {
                                let counter = 0;
                                let projectRequestsForDelete = answer.object;
                                projectRequestsForDelete.forEach((deletedProject) => {
                                    parseQuery.deleteObject({class: 'ProjectRequest', id: deletedProject.id},
                                        (answer) => {
                                            counter++;
                                            if(counter == projectRequestsForDelete.length){
                                                res.json("ok");
                                            }
                                        }, (error) => {
                                            res.json("error");
                                        });
                                });
                            }, (error) => {
                                res.json("error");
                            });
                    },
                    (error) => {
                        //console.log("inserting projects error", answer);
                        res.json('error');
                    }
                );

            }, (error) =>{
                console.log("target", error.error)
            });
    });

module.exports = router;
