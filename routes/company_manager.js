"use strict"
let express = require('express');
let router = express.Router();
let Parse = require('parse').Parse;
let parseQuery = require('../modules/parseQuery');

    router.get('/:id', (req, res) => {
        let projectsDevelopers = [];
        let checker = 0;
        let companyInfo;
        let projectsInfo = [];
        let projects;

        function check(){
            checker++;
            if (checker == projects.length) {
                res.render('../pages/manager/company_manager',{"companyInfo": companyInfo, "projectsInfo": projectsInfo, "projectsDevelopers": projectsDevelopers});
            }
        }

        parseQuery.filterObjects({class: "Company", filters:[{key: "companyManagerId", value: req.params.id, condition: "="}]},
            (answer) => {
                companyInfo = answer.object[0];
                parseQuery.filterObjects({class: "Project", filters:[{key: "companyId", value: answer.object[0].id, condition: "="}]},
                    (answer) => {
                        projects = answer.object;
                        projects.forEach((project) => {
                            projectsInfo.push(project);
                            if(project.attributes.developerId != undefined){
                                parseQuery.getObject({class: "User", id: project.attributes.developerId},
                                    (answer) => {
                                        projectsDevelopers.push(answer.object);
                                        check();
                                    }, (error) => {
                                        res.json('error');
                                    });
                            } else{
                                check();
                            }
                        });
                    }, (error) => {
                    res.json('error');
                });
            }, (error) => {
                res.json('error');
            });
    });

   router.put('/', (req, res) => {
       parseQuery.updateObject({class: "Project", id:req.body.developerId, data:{statusComplete:"complete", statusDelivered:"active"}},
           (answer) => {
               res.json("ok");
       }, (error) => {
               res.json('error');
           });
   });

module.exports = router;
