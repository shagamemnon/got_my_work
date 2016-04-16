"use strict";
let express = require('express');
let router = express.Router();
let Parse = require('parse').Parse;
let parseQuery = require('../modules/parseQuery');

router.get('/:id',  (req, res) => {
    let queryUsers = new Parse.Query("User");
    let queryTarget = new Parse.Query("Target");
    let queryCompany = new Parse.Query("Company");
    let queryProject = new Parse.Query("Project");
    let arrGetTargets = [];
    let arrGetCompanies = [];
    let arrGetFreelancers = [];
    let arrGetProjects = [];
    let counter = 0;
    let linkTypeId;
    let salesTargetsClass = "SalesTargets";
    let salesCompaniesClass = "SalesCompanies";
    let salesFreelancersClass = "SalesFreelancers";
    let salesProjectsClass = "SalesProjects";
    let parseQueries = [{queryType:queryTarget, arrGetType:arrGetTargets, queryClass:salesTargetsClass}
        ,{queryType:queryCompany, arrGetType:arrGetCompanies, queryClass:salesCompaniesClass}
        ,{queryType:queryUsers, arrGetType:arrGetFreelancers, queryClass:salesFreelancersClass}
        ,{queryType:queryProject, arrGetType:arrGetProjects, queryClass:salesProjectsClass}
    ];

    function checker() {
        counter++;
        if (counter == 4) {
            res.render("../pages/manager/sales_manager", {"targets": arrGetTargets, "companies": arrGetCompanies, "users" : arrGetFreelancers, "projects": arrGetProjects});
        }
    };
    function queryFormation(queryType, arrGetType, queryClass){

        parseQuery.filterObjects(
            {class: queryClass, filters: [{key: "SalesManagerID", value: req.params.id, condition: "="}]},
            function (answer) {
                let check = 0;
                if (answer.object.length == 0) {
                    checker();
                }
                else {
                    for (let i = 0; i < answer.object.length; i++) {
                        if (queryType == queryCompany) {
                            linkTypeId = answer.object[i]._serverData.CompanyId;
                        } else if (queryType == queryTarget) {
                            linkTypeId = answer.object[i]._serverData.TargetId;
                        } else if (queryType == queryProject) {
                            linkTypeId = answer.object[i]._serverData.ProjectId;
                        }
                        else if (queryType == queryUsers) {
                            linkTypeId = answer.object[i]._serverData.FreelancerId;
                        }
                        queryType.get(linkTypeId, {
                            success: (getData) => {
                                check++;
                                arrGetType = arrGetType.concat(getData)
                                if (check == answer.object.length) {
                                    if (queryType == queryCompany) {
                                        arrGetCompanies = arrGetType;
                                    } else if (queryType == queryTarget) {
                                        arrGetTargets = arrGetType;
                                    } else if (queryType == queryUsers) {
                                        arrGetFreelancers = arrGetType;
                                    } else if (queryType == queryProject) {
                                        arrGetProjects = arrGetType;
                                    }
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
                res.json("error");
            });
    }
    if(req.session && req.session.user !== undefined  && ((req.session.user.attributes.accountType == 'admin') || (req.session.user.attributes.accountType == 'sales-manager' && req.session.user.id == req.params.id))) {
        for (let i = 0; i < parseQueries.length; i++) {
            queryFormation(parseQueries[i].queryType, parseQueries[i].arrGetType, parseQueries[i].queryClass);
        }
    } else res.redirect('/');
});

module.exports = router;