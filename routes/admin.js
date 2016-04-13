"use strict";
let express = require('express');
let router = express.Router();
let Parse = require('parse').Parse;
let parseQuery = require('../modules/parseQuery');
let auth = require('../modules/auth');

let checker = (counter, length) => {
    return ++counter.val == length;
};

router.get('/', (req, res) => {

    let queryUsers = new Parse.Query("User");
    let queryTarget = new Parse.Query("Target");
    let queryCompany = new Parse.Query("Company");
    let queryProject = new Parse.Query("Project");
    let arrGetTargets = [];
    let arrGetCompanies = [];
    let arrGetFreelancers = [];
    let arrGetProjects = [];
    let linkedCompanies;
    let linkedProjects;
    let linkedFreelancers;
    let linkedTargets;
    let managers;
    let salesTargetsClass = "SalesTargets";
    let salesCompaniesClass = "SalesCompanies";
    let salesFreelancersClass = "SalesFreelancers";
    let salesProjectsClass = "SalesProjects";
    let counter = 0;
    let parseQueries = [{queryType:queryTarget, arrGetType:arrGetTargets, queryClass:salesTargetsClass, linkedType:linkedTargets}
        ,{queryType:queryCompany, arrGetType:arrGetCompanies, queryClass:salesCompaniesClass, linkedType:linkedCompanies}
        ,{queryType:queryUsers, arrGetType:arrGetFreelancers, queryClass:salesFreelancersClass, linkedType:linkedFreelancers}
        ,{queryType:queryProject, arrGetType:arrGetProjects, queryClass:salesProjectsClass, linkedType:linkedProjects}
    ];
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
        if (counter == 5) {

            DeleteRepeatingElements(arrGetTargets);
            res.render("../pages/super_admin",
                {  "targets": arrGetTargets
                    , "companies":arrGetCompanies
                    , "freelancers" : arrGetFreelancers
                    , "projects": arrGetProjects
                    , "managers": managers
                    , "linkedCompanies": linkedCompanies
                    , "linkedProjects": linkedProjects
                    , "linkedFreelancers": linkedFreelancers
                    , "linkedTargets": linkedTargets
                }
            );
        }
    }
    function queryFormation(queryType, arrGetType, queryClass, linkedType){
        parseQuery.getObjects({class: queryClass, limit: 50}, (answer) => {
            let check = 0;
            linkedType = answer.object;
            if(answer.object.length == 0){
                checker();
            }
            else{
                for(let i=0; i<answer.object.length ;i++){
                    if(queryType==queryCompany) {
                        linkTypeId = answer.object[i]._serverData.CompanyId;
                    }else if(queryType==queryTarget){
                        linkTypeId = answer.object[i]._serverData.TargetId;
                    }else if(queryType==queryProject){
                        linkTypeId = answer.object[i]._serverData.ProjectId;
                    }
                    else if(queryType==queryUsers){
                        linkTypeId = answer.object[i]._serverData.FreelancerId;
                    }
                    queryType.get(linkTypeId, {
                        success: (getData) => {
                            check++;
                            arrGetType = arrGetType.concat(getData);
                            if(check==answer.object.length){
                                if(queryType==queryCompany) {
                                    arrGetCompanies = arrGetType;
                                    linkedCompanies = linkedType;
                                }else if(queryType==queryTarget){
                                    arrGetTargets = arrGetType;
                                    linkedTargets = linkedType;
                                }else if(queryType==queryUsers){
                                    arrGetFreelancers = arrGetType;
                                    linkedFreelancers = linkedType;
                                }else if(queryType==queryProject){
                                    arrGetProjects = arrGetType;
                                    linkedProjects = linkedType;
                                }
                                checker();}
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

    if(req.session && req.session.user !== undefined  && req.session.user.attributes.accountType == 'admin') {
        for (let i = 0; i < parseQueries.length; i++) {
            queryFormation(parseQueries[i].queryType, parseQueries[i].arrGetType, parseQueries[i].queryClass, parseQueries[i].linkedType);
        }

        parseQuery.getObjects({
            class: "User",
            limit: 100,
            equals: {column: undefined, objectId: undefined}
        }, function (answer) {
            if (answer.result == 'ok') {
                managers = answer.object;
                checker();
            } else {
                console.log("getting projects error", answer.error);
                res.json("error");
            }
        });
    } else res.redirect('/');
});

router.post('/', (req, res) => {
    let counter = {val: 0};
    let userIds = req.body.ids;
    let Target = Parse.Object.extend("Target"),
        queryTarget = new Target();

    let strTitle =  req.body.target == "Ensure" ?  req.body.target + " that " + req.body.amount + " " + req.body.type + " are " +req.body.operation :
    req.body.target + " " + req.body.amount + " " + req.body.type;
    let strTimeline = req.body.period + " " + req.body.units;
    queryTarget.set("Title", strTitle);
    queryTarget.set("Amount", parseInt(req.body.amount, 10));
    queryTarget.set("Period", parseInt(req.body.period, 10));
    queryTarget.set("Timeline", strTimeline);
    queryTarget.set("Status", "Active");

    parseQuery.addObject({class: "Target", data:{Title:strTitle, Amount:parseInt(req.body.amount, 10), Period:parseInt(req.body.period, 10), Timeline:strTimeline, Status:"Active"}},function(answer){
        userIds.forEach( (id, index) => {
            parseQuery.addObject({class: "SalesTargets", data:{SalesManagerID:id, TargetId:answer.object.id}}, (answer) => {
                if(checker(counter,userIds.length))
                    res.json('ok');
            }, (error) => {
                res.json('error');
            });
        });
    }, (error) => {
        res.json('error');
    });
});

router.delete('/', (req, res) => {
    let resultsData;
    let counter = 0;
    let counterSalesManagers = 0;
    let userIds = req.body;
    let queryTargetsLinks = "SalesTargets";
    let queryFreelancersLinks = "SalesFreelancers";
    let queryCompaniesLinks = "SalesCompanies";
    let queryProjectsLinks = "SalesProjects";
    let targetLinksForDelete = new Parse.Object("SalesTargets");
    let companyLinksForDelete = new Parse.Object("SalesCompanies");
    let projectLinksForDelete = new Parse.Object("SalesProjects");
    let freelancerLinksForDelete = new Parse.Object("SalesFreelancers");
    let parseQueries = [{1:queryTargetsLinks, 2:targetLinksForDelete}
        ,{1:queryCompaniesLinks, 2:companyLinksForDelete}
        ,{1:queryFreelancersLinks, 2:freelancerLinksForDelete}
        ,{1:queryProjectsLinks, 2:projectLinksForDelete}
    ];
    userIds.forEach( (id, userIdsForDeleteLinks) => {
        function checker() {
            counter++;
            if(counter == parseQueries.length*req.body.length){
                userIds.forEach( (id, userIdsForDeleteSM) => {
                    auth.userDelete({id: id},
                        (answer) => {
                            counterSalesManagers++;
                            if(counterSalesManagers==userIds.length){
                                res.json("ok");
                            }
                        }
                        ,(error) => {
                            res.json("error");
                            console.log("sm-delete error", answer.error);
                        }
                    );
                });
            }
        }

        for(let i = 0; i<parseQueries.length; i++){
            queryForDeleteFormation(parseQueries[i][1], parseQueries[i][2]);
        }


        function queryForDeleteFormation(queryTypeLinks, typeLinksForDelete){
            parseQuery.filterObjects(
                {class: queryTypeLinks, filters:[{key:"SalesManagerID", value:id, condition:"="}]},
                function(answer){
                    resultsData = answer.object;
                    if(resultsData != 0){
                        resultsData.forEach((deletingLinks, arrForDelete) => {
                            parseQuery.deleteObject({class: queryTypeLinks, id: deletingLinks.id}, function(answer){
                                checker();
                            }, (error)=>{
                                checker();
                            });
                        });
                    } else checker();

                }, (error) =>{
                    res.json("error");
                });
        }
    });
});

router.put('/target', (req, res) => {
    let counter = 0;

    function checker() {
        counter++;
        if(counter == req.body.ids.length){
            res.json("got");
        }
    }

    let targetIds = req.body.ids;
    targetIds.forEach( (id, targetIds) => {
        parseQuery.updateObject({class: "Target", id: id, data: req.body}, (answer) => {
            console.log("target", answer.object);
            checker();
        }, (error) =>{
            console.log("target", error.error);
            checker();
        });
    });
});

router.delete('/target', (req, res) => {
    let counetTargets = 0;
    let counter = 0;
    let countTargets = 0;
    let allTargetsLinksCountForDelete = 0;
    let targetIds = req.body;
    targetIds.forEach( (id, targetIdsForDeleteLinks) => {
        countTargets++;
        function checker() {
            counter++;
            if(counter == allTargetsLinksCountForDelete){
                targetIds.forEach( (id, targetIdsForDeleteTargets) => {
                    parseQuery.deleteObject({class: "Target", id: id}, (answer) => {
                        counetTargets++;
                        if(counetTargets == targetIds.length){
                            res.json("ok");
                        }
                    }, (error) => {
                        res.json("error");
                    });
                });
            }
        }

        let foundLinkedTargetsForDelete;
        parseQuery.filterObjects(
            {class: 'SalesTargets', filters: [{key: 'TargetId', value: id, condition: "="}]},
            function (answer) {
                allTargetsLinksCountForDelete = allTargetsLinksCountForDelete + answer.object.length;
                foundLinkedTargetsForDelete = answer.object;
                foundLinkedTargetsForDelete.forEach((idTargetLink, foundLinkedTargetsForDelete) => {
                    parseQuery.deleteObject({class: "SalesTargets", id: idTargetLink.id}, (answer) => {
                        checker();
                    }, (error) => {
                        checker();
                    });
                });
            }, (error) => {
                res.json("error");
            });
    });
});

router.put('/manager_signup', (req, res) => {
    parseQuery.filterObjects(
        {class: "Token", filters: [{key: "SalesManagerID", value: req.params.id, condition: "="}]},
        function (answer) {
            var managersTypes = answer.object;
            managersTypes.forEach((manager, managersTypes) => {
                if (manager.attributes.ManagerType == req.body.ManagerType) {
                    parseQuery.updateObject({class: "Token", id: manager.id, data: req.body}, function (answer) {
                        if (answer.result == 'ok') {
                            res.json("got");
                            console.log("target", answer.object);
                        } else {
                            console.log("target", answer.error)
                        }
                    });
                }
            });
        }, (error) => {
            res.json("error");
        });
});

router.get('/manager_signup/:type', (req, res) => {
    let counter = 0;
    parseQuery.filterObjects(
        {class: "Token", filters: [{key: "SalesManagerID", value: req.params.id, condition: "="}]},
        function (answer) {
            var managersTypes = answer.object;
            managersTypes.forEach((manager, managersTypes1) => {
                if (manager.attributes.ManagerType == req.params.type && manager.attributes.ManagerToken == req.query.qs1) {
                    res.render('../pages/login/manager_signup', {managerType: req.params.type})
                } else {
                    counter++;
                    if (counter == managersTypes.length) {
                        res.redirect('/');
                    }
                }
            });
        }, (error) => {
            res.json("error");
        });
});


router.post('/manager_signup/:type', (req, res) => {
    auth.userSignUp(req.body,(signUpRes) => {
            console.log('1', signUpRes);
            req.session.user = {id: signUpRes.answer.id, attributes: signUpRes.answer.attributes};
            res.status(200).json({result: 'ok'});

        },
        (signUpError) => {
            console.log("Error: " + signUpError.error.code + " " + signUpError.error.message);
            res.status(400).send({code: signUpError.error.code, error: signUpError.error.message});
        }
    );
});

module.exports = router;
