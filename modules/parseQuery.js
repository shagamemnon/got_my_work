'use strict';

var config = require('../config')
    , Parse = require('parse').Parse;

Parse.initialize(config.parse.appId, config.parse.JSKey, config.parse.MsKey);

var addObject = (params, done, reject) =>
    params
        ? saveObject(params,
            (answer) =>
                done(answer),
            (answer) =>
                reject(answer)
        )
        : reject({result: 'error', answer: "missing data"});

var getObject = (params, done, reject) => {
    if ( params ) {
        let query = new Parse.Query(params.class == "User" ? Parse.User : params.class);
        query.get(params.id, {
            success: (object) => {
                //console.log('true get', object);
                done({result: 'ok', object: object})
            },
            error: (object, error) => {
                //console.log('err get', error);
                reject({result: 'error', error: error})
            }
        });
    }  else
        reject({result: 'error', answer: "missing data"});
};

var getObjects = (params, done, reject) => { /* getting several objects */
    if ( params ) {
        let query = new Parse.Query(params.class);
        query.limit(params.limit);
        query.find({
            success: (objects) => {
                let projects = [];
                objects.map( project => projects.push(project));
                done({result: 'ok', object: projects});
            },
            error: (object, error) => reject({result: 'error', error: error})
        });
    }  else
        reject({result: 'error', answer: "missing data"});
};

let saveObject = (params, done, reject) => {
    //let query = new Parse.Query(params.class == "User" ? Parse.User : params.class);
    let Query = Parse.Object.extend(params.class),
        query = new Query();
    query.set("objectId", params.id);
    //for (let item in params.data)
    //    query.set(item, params.data[item]);
    query.save(params.data,{
        success: (object) => {
            //console.log('true save', object);
            done({result: 'ok', object: object})
        },
        error: (error) => {
            //console.log('err save', object);
            reject({result: 'error', error: error})
        }
    });
};

var updateObject = (params, done, reject) =>
     params
         ? getObject({class: params.class, id: params.id},
            (answer) =>
                saveObject(params,
                    (ans) => {
                        //console.log('true up',ans);
                        done(ans)
                    },
                    (err) => {
                        //console.log('true up',ans);
                        reject(err)
                    }
                ),
            (answer) =>
                reject(answer)
         )
         : reject({result: 'error', error: 'missing data'});

var deleteObject = (params, done, reject) =>
    params
        ? getObject({class: params.class, id: params.id},
            (answer) =>
                answer.object.destroy({
                    success: (object) =>
                        done({result: 'ok', object: object})
                    ,
                    error: (item, error) =>
                        reject({result: 'error', error: error})
                }),
            (answer) =>
                reject(answer)
        )
        : reject({result: 'error', error: 'missing data'});

exports.addObject = addObject;
exports.getObject = getObject;
exports.getObjects = getObjects;
exports.updateObject = updateObject;
exports.deleteObject = deleteObject;