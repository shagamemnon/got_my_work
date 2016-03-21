var express = require('express');
var router = express.Router();
var Parse = require('parse').Parse

router.get('/:id',  (req, res) => {
    var queryUser = new Parse.Query("User");
    var queryTarget = new Parse.Query("Target");
    var queryCompany = new Parse.Query("Company");
    var queryProject = new Parse.Query("Project");
    var querySalesTargets = new Parse.Query("SalesTargets");
    var querySalesCompanies = new Parse.Query("SalesCompanies");
    var querySalesProjects = new Parse.Query("SalesProjects");
    var querySalesFreelancers = new Parse.Query("SalesFreelancers");
    querySalesTargets.equalTo("SalesManagerID", req.params.id);
    querySalesCompanies.equalTo("SalesManagerID", req.params.id);
    querySalesProjects.equalTo("SalesManagerID", req.params.id);
    querySalesFreelancers.equalTo("SalesManagerID", req.params.id);
    var arrGetTargets = [];
    var arrGetCompanies = [];
    var arrGetFreelancers = [];
    var arrGetProjects = [];
    var counter = 0;
    function checker() {
        counter++;
        if (counter == 4) {
            res.render("../pages/manager/sales_manager", {"targets": arrGetTargets, "companies": arrGetCompanies, "users" : arrGetFreelancers, "projects": arrGetProjects});
        }
    };
    querySalesTargets.find({
        success:  (foundTargets) => {
            "use strict";
            let check = 0;
            if(foundTargets.length == 0){
                checker();
            }
            else{
                for(var i=0; i<foundTargets.length ;i++){
                    queryTarget.get(foundTargets[i]._serverData.TargetId, {
                        success: (getTargets) => {
                            check++;
                            arrGetTargets = arrGetTargets.concat(getTargets)
                            if(check==foundTargets.length) checker();
                        },
                        error: (error) => {
                            res.send(500, 'record delete failed -- ' + error.status);
                            console.log("error", error);
                        }
                    });
                }
            }
        },
        error: (error) => {
            res.send(500, 'record delete failed -- ' + error.status);
            console.log("error", error);
        }
    });
    querySalesCompanies.find({
        success: (foundCompanies) => {
            "use strict";
            let check = 0;
            if(foundCompanies.length == 0){
                checker();
            }
            else{
                for(var i=0; i<foundCompanies.length ;i++){
                    queryCompany.get(foundCompanies[i]._serverData.CompanyId,{
                        success: (getCompanies) => {
                            check++;
                            arrGetCompanies = arrGetCompanies.concat(getCompanies)
                            if(check==foundCompanies.length) checker();
                        },
                        error: (error) => {
                            res.send(500, 'record delete failed -- ' + error.status);
                            console.log("error", error);
                        }
                    });
                }
            }
        },
        error: (error) => {
            res.send(500, 'record delete failed -- ' + error.status);
            console.log("error", error);
        }
    });
    querySalesFreelancers.find({
        success: (foundFreelancers) => {
            "use strict";
            let check = 0;
            if(foundFreelancers.length == 0){
                checker();
            }
            else{
                for(var i=0; i<foundFreelancers.length ;i++){
                    queryUser.get(foundFreelancers[i]._serverData.FreelancerId,{
                        success: (getFreelancers) => {
                            check++;
                            arrGetFreelancers = arrGetFreelancers.concat(getFreelancers)
                            if(check==foundFreelancers.length) checker();

                        },
                        error: (error) => {
                            res.send(500, 'record delete failed -- ' + error.status);
                            console.log("error", error);
                        }
                    });
                }
            }
        },
        error: (error) => {
            res.send(500, 'record delete failed -- ' + error.status);
            console.log("error", error);
        }
    });
    querySalesProjects.find({
        success: (foundProjects) => {
            "use strict";
            let check = 0;
            if(foundProjects.length == 0){
                checker();
            }
            else{
                for(var i=0; i<foundProjects.length ;i++){
                    queryProject.get(foundProjects[i]._serverData.ProjectId, {
                        success: (getProjects) => {
                            check++;
                            arrGetProjects = arrGetProjects.concat(getProjects)
                            if(check==foundProjects.length) checker();
                        },
                        error: (error) => {
                            res.send(500, 'record delete failed -- ' + error.status);
                            console.log("error", error);
                        }
                    });
                }
            }
        },
        error: (error) => {
            res.send(500, 'record delete failed -- ' + error.status);
            console.log("error", error);
        }
    });
});

module.exports = router;