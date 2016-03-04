"use strict";
var express = require('express');
var router = express.Router();
var Parse = require('parse').Parse;

let checker = (counter, length) => {
    return ++counter.val == length;
}

router.get('/', (req, res) => {

    var queryUsers = new Parse.Query("User");
    var queryTarget = new Parse.Query("Target");
    var queryCompany = new Parse.Query("Company");
    var queryProject = new Parse.Query("Project");
    var querySalesTargets = new Parse.Query("SalesTargets");
    var querySalesCompanies = new Parse.Query("SalesCompanies");
    var querySalesProjects = new Parse.Query("SalesProjects");
    var querySalesFreelancers = new Parse.Query("SalesFreelancers");
    var arrGetTargets = [];
    var arrGetCompanies = [];
    var arrGetFreelancers = [];
    var arrGetProjects = [];
    var linkedCompanies;
    var linkedProjects;
    var linkedFreelancers;
    var linkedTargets;
    var managers;
    var counter = 0;
    var errors = {};

    function DeleteRepeatingElements(loadedArray) {
        for (var i = 0; i < loadedArray.length; i++) {
            for (var j = i + 1; j < loadedArray.length;) {
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
                        , "companies": arrGetCompanies
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
    querySalesTargets.find({
        success: (foundTargets) => {
            "use strict";
            let check = 0;
            linkedTargets = foundTargets;
            if(foundTargets.length == 0){
                checker();
            }
            else{
                for(var i=0; i<foundTargets.length ;i++){
                    queryTarget.get(foundTargets[i]._serverData.TargetId, {
                        success: (getTargets) => {
                            check++;
                            arrGetTargets = arrGetTargets.concat(getTargets);
                            if(check==foundTargets.length) checker();
                        },
                        error: (error) => {
                            //res.send(500, 'record delete failed -- ' + error);
                            errors.queryTarget = error;
                            console.log(error);
                        }
                    });
                }
            }
        },
        error: (error) => {
            //res.send(500, 'record delete failed -- ' + error.status);
            errors.SalesTargets = error;
            console.log(error);
        }
    });
    querySalesCompanies.find({
        success: (foundCompanies) => {
            "use strict";
            let check = 0;
            linkedCompanies = foundCompanies;
            if(foundCompanies.length == 0){
                checker();
            }
            else{
                for(var i=0; i<foundCompanies.length ;i++){
                    queryCompany.get(foundCompanies[i]._serverData.CompanyId,{
                        success: (getCompanies) => {
                            check++;
                            arrGetCompanies = arrGetCompanies.concat(getCompanies);
                            if(check==foundCompanies.length) checker();
                        },
                        error: (error) => {
                            //res.send(500, 'record delete failed -- ' + error.status);
                            errors.queryCompany = error;
                            console.log(error);
                        }
                    });
                }
            }
        },
        error: (error) => {
            errors.SalesCompanies = error;
            //res.send(500, 'record delete failed -- ' + error.status);
            console.log(error);
        }
    });
    querySalesFreelancers.find({
        success: (foundFreelancers) => {
            "use strict";
            let check = 0;
            linkedFreelancers = foundFreelancers;
            if(foundFreelancers.length == 0){
                checker();
            }
            else{
                for(var i=0; i<foundFreelancers.length ;i++){
                    queryUsers.get(foundFreelancers[i]._serverData.FreelancerId,{
                        success: (getFreelancers) => {
                            check++;
                            arrGetFreelancers = arrGetFreelancers.concat(getFreelancers);
                            if(check==foundFreelancers.length) checker();

                        },
                        error: (error) => {
                            errors.queryUser = error;
                            //res.send(500, 'record delete failed -- ' + error.status);
                            console.log(error);
                        }
                    });
                }
            }
        },
        error: (error) => {
            errors.SalesFreelancers = error;
            //res.send(500, 'record delete failed -- ' + error.status);
            console.log(error);
        }
    });
    querySalesProjects.find({
        success: (foundProjects) => {
            "use strict";
            let check = 0;
            linkedProjects = foundProjects;
            if(foundProjects.length == 0){
                checker();
            }
            else{
                for(var i=0; i<foundProjects.length ;i++){
                    queryProject.get(foundProjects[i]._serverData.ProjectId, {
                        success: (getProjects) => {
                            check++;
                            arrGetProjects = arrGetProjects.concat(getProjects);
                            if(check==foundProjects.length) checker();
                        },
                        error: (error) => {
                            errors.queryProject = error;
                            //res.send(500, 'record delete failed -- ' + error.status);
                            console.log(error);
                        }
                    });
                }
            }
        },
        error: (error) => {
            errors.SalesProjects = error;
            //res.send(500, 'record delete failed -- ' + error.status);
            console.log(error);
        }
    });

    queryUsers.find({
        success: (foundManagers) => {
            managers = foundManagers;
            checker();
        },
        error: (error) => {
            errors.queryUsers = error;
            //res.send(500, 'record delete failed -- ' + error.status);
            console.log(error);
        }
    });
});

router.post('/', (req, res) => {
    var counter = {val: 0};
    var userIds = req.body.ids;
    var Target = Parse.Object.extend("Target"),
        queryTarget = new Target();

    var strTitle =  req.body.target == "Ensure" ?  req.body.target + " that " + req.body.amount + " " + req.body.type + " are complited" :
        req.body.target + " " + req.body.amount + " " + req.body.type;
    var strTimeline = req.body.period + " " + req.body.units;

    queryTarget.set("Title", strTitle);
    queryTarget.set("Amount", parseInt(req.body.amount, 10));
    queryTarget.set("Period", parseInt(req.body.period, 10));
    queryTarget.set("Timeline", strTimeline);
    queryTarget.set("Status", "Active");

    queryTarget.save(null, {
        success: (target) => {
            userIds.forEach( (id, index) => {
                var targetLink = Parse.Object.extend("SalesTargets"),
                    queryTargetLink = new targetLink();
                queryTargetLink.set("SalesManagerID", id);
                queryTargetLink.set("TargetId", target.id);
                queryTargetLink.save(null, {
                    success: () => {
                        if(checker(counter,userIds.length-1))
                            res.json('ok');
                    },
                    error: (error) => {
                        //res.send(500, 'record delete failed -- ' + error.status);
                        console.log(error);
                    }
                });
            });
        },
        error: (error) => {
            res.send(500, 'target save error -- ' + error.status);
            console.log(error);
        }
    });
});

router.delete('/', (req, res) => {
    var countManagers = 0;
    var counter = 0;
    var allCountManagersLinks = false;
    var targetsCountForDelete = false;
    var companiesCountForDelete = false;
    var projectsCountForDelete = false;
    var freelancersCountForDelete = false;
    var userIds = req.body;
    var accessToDeleteLinks = true;
    var queryTargetsLinks = new Parse.Query("SalesTargets");
    var queryFreelancersLinks = new Parse.Query("SalesFreelancers");
    var queryCompaniesLinks = new Parse.Query("SalesCompanies");
    var queryProjectsLinks = new Parse.Query("SalesProjects");
    userIds.forEach( (id, userIds) => {
        countManagers++;
        function checker() {
            if( targetsCountForDelete == true && companiesCountForDelete == true && projectsCountForDelete == true && freelancersCountForDelete == true){
            counter++;
            if(countManagers == req.body.length){
                if(allCountManagersLinks == 0){
                    if(counter == req.body.length){
                        res.json("ok");
                    }
                } else{
                    if(counter == allCountManagersLinks){
                        res.json("ok");
                    }
                }
            }

           }
        }
      var salesManagersForDelete = new Parse.User();
        salesManagersForDelete.id = id;
        Parse.Cloud.useMasterKey();
        salesManagersForDelete.destroy({
            success: () => {
                queryTargetsLinks.equalTo("SalesManagerID", id);
                queryFreelancersLinks.equalTo("SalesManagerID", id);
                queryCompaniesLinks.equalTo("SalesManagerID", id);
                queryProjectsLinks.equalTo("SalesManagerID", id);
                queryTargetsLinks.find({
                    success: (resultsTarget) => {
                        allCountManagersLinks =  allCountManagersLinks + resultsTarget.length;
                        if(resultsTarget == 0){
                            targetsCountForDelete = accessToDeleteLinks;
                            checker();
                        } else{
                            targetsCountForDelete = accessToDeleteLinks;
                            resultsTarget.forEach( (idTarget, resultsTarget) => {
                                var targetLinksForDelete = new Parse.Object("SalesTargets");
                                targetLinksForDelete.id = idTarget.id;
                                Parse.Cloud.useMasterKey();
                                targetLinksForDelete.destroy({
                                    success: () => {
                                        checker();
                                    },
                                    error: function (error) {
                                        res.send(500, 'record delete failed -- ' + error.status);
                                        console.log(error);
                                    }
                                });
                            });
                        }
                        },
                        error: (error) => {
                            res.send(500, 'record delete failed -- ' + error.status);
                            console.log(error);
                        }


                });

                queryCompaniesLinks.find({
                    success: (resultsCompany) => {
                        allCountManagersLinks =  allCountManagersLinks + resultsCompany.length;
                        if(resultsCompany == 0){
                            companiesCountForDelete = accessToDeleteLinks;
                            checker();
                        } else{
                            companiesCountForDelete = accessToDeleteLinks;
                            resultsCompany.forEach( (idCompany, resultsCompany) => {
                                var companyLinksForDelete = new Parse.Object("SalesCompanies");
                                companyLinksForDelete.id = idCompany.id;
                                Parse.Cloud.useMasterKey();
                                companyLinksForDelete.destroy({
                                    success: () => {
                                        checker();
                                    },
                                    error: (error) => {
                                        res.send(500, 'record delete failed -- ' + error.status);
                                        console.log(error);
                                    }
                                });
                            });
                        }

                    },
                    error: (error) => {
                        res.send(500, 'record delete failed -- ' + error.status);
                        console.log(error);
                    }
                });

                queryProjectsLinks.find({
                    success: (resultsProject) => {
                        allCountManagersLinks =  allCountManagersLinks + resultsProject.length;
                        if(resultsProject == 0){
                            projectsCountForDelete = accessToDeleteLinks;
                            checker();
                        } else {
                            projectsCountForDelete = accessToDeleteLinks;
                            resultsProject.forEach((idProject, resultsProject) => {
                                var projectLinksForDelete = new Parse.Object("SalesProjects");
                                projectLinksForDelete.id = idProject.id;
                                Parse.Cloud.useMasterKey();
                                projectLinksForDelete.destroy({
                                    success: () => {
                                        checker();
                                    }, error: (error) => {
                                        res.send(500, 'record delete failed -- ' + error.status);
                                        console.log(error);
                                    }
                                });
                            });
                        }
                    },
                    error: (error) => {
                        res.send(500, 'record delete failed -- ' + error.status);
                        console.log(error);
                    }
                });

                queryFreelancersLinks.find({
                    success: (resultsFreelancer) => {
                        allCountManagersLinks =  allCountManagersLinks + resultsFreelancer.length;
                        if(resultsFreelancer == 0){
                            freelancersCountForDelete = accessToDeleteLinks;
                            checker();
                        } else {
                            freelancersCountForDelete = accessToDeleteLinks;
                            resultsFreelancer.forEach((idFreelancer, resultsFreelancer) => {
                                var freelancerLinksForDelete = new Parse.Object("SalesFreelancers");
                                freelancerLinksForDelete.id = idFreelancer.id;
                                Parse.Cloud.useMasterKey();
                                freelancerLinksForDelete.destroy({
                                    success: () => {
                                        checker();
                                    },
                                    error: (error) => {
                                        res.send(500, 'record delete failed -- ' + error.status);
                                        console.log(error);
                                    }
                                });
                            });
                        }
                    },
                    error: (error) => {
                        res.send(500, 'record delete failed -- ' + error.status);
                        console.log(error);
                    }
                });
            },
            error: (error) => {
                res.send(500, 'record delete failed -- ' + error.status);
                console.log(error);
            }
        });
    });

});

router.put('/target', (req, res) => {
    var targetIds = req.body.ids;
    targetIds.forEach( (id, targetIds) => {
        var query = new Parse.Query("Target");
        query.get(id, {
            success: (target) => {
                target.set("Status", req.body.status);
                target.save({
                    success: (item) => {
                    },
                    error: function (item, error) {
                        console.log("error", error);
                    }
                });
            },
            error: (error) => {
                res.send(500, 'record delete failed -- ' + error.status);
                console.log(error);
            }
        });
    });
    res.json("got");
});

router.delete('/target', (req, res) => {
    var counter = 0;
    var countTargets = 0;
    var allTargetsLinksCountForDelete = 0;
    var targetIds = req.body;
    targetIds.forEach( (id, targetIds) => {
        countTargets++;
        function checker() {
                counter++;
                if(countTargets == req.body.length){
                        if(counter == allTargetsLinksCountForDelete){
                            res.json("ok");
                        }
                }
        }
        var targetsForDelete = new Parse.Object('Target');
        var targetsLinksForDelete = new Parse.Query('SalesTargets');
        targetsForDelete.id = id;
        Parse.Cloud.useMasterKey();
        targetsForDelete.destroy({
            success: () => {
                targetsLinksForDelete.equalTo("TargetId", id);
                targetsLinksForDelete.find({
                    success: (foundLinkedTargetsForDelete) => {
                        allTargetsLinksCountForDelete = allTargetsLinksCountForDelete + foundLinkedTargetsForDelete.length;
                        foundLinkedTargetsForDelete.forEach((idTargetLink, foundLinkedTargetsForDelete) => {
                                    var targetLinksForDelete = new Parse.Object("SalesTargets");
                                    targetLinksForDelete.id = idTargetLink.id;
                                    Parse.Cloud.useMasterKey();
                                    targetLinksForDelete.destroy({
                                        success: () => {
                                            checker();
                                        }, error: (error) => {
                                            res.send(500, 'record delete failed -- ' + error.status);
                                            console.log(error);
                                        }
                                    });
                                });
                    },
                    error: (error) => {
                        res.send(500, 'record delete failed -- ' + error.status);
                        console.log("error", error);
                    }
                });
            },
            error: (error) => {
                res.send(500, 'record delete failed -- ' + error.status);
                console.log("error", error);
            }
        });
    });
});

router.get('/signup-slmanager', (req, res) => {
    res.render('../pages/login/sales_manager')
});

router.post('/signup-slmanager', (req, res) => {
    var user = new Parse.User();
    user.set('username', req.body.name);
    user.set('password', req.body.pass);
    user.set('email', req.body.email);
    user.set('Phone', req.body.phone);
    user.set('userRole', 'sales-manager');

    user.signUp(null, {
        success: (user) => {
            res.json('ok');
        },
        error: (error) => {
            res.send(500, 'record delete failed -- ' + error.status);
            console.log("error", error);
        }
    });
});

module.exports = router;
