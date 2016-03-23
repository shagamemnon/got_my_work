'use strict';

var config = require('../config')
    , Parse = require('parse').Parse;

Parse.initialize(config.parse.appId, config.parse.JSKey, config.parse.MsKey);

let addObject = (params, done, reject) =>
    params
        ? saveObject(params,
            (answer) =>
                done(answer),
            (answer) =>
                reject(answer)
        )
        : reject({result: 'error', answer: "missing data"});

let getObject = (params, done, reject) => {
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

let getObjects = (params, done, reject) => { /* getting several objects */
    if ( params ) {
        let query = new Parse.Query(params.class);
        if(params.limit)
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
    let Query = Parse.Object.extend(params.class),
        query = new Query();
    if(params.id)
        query.set("objectId", params.id);
    query.save(params.data, {
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

let updateObject = (params, done, reject) =>
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

let deleteObject = (params, done, reject) =>
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

let filterObjects = (params, done, reject) => {
    if (params) {
        let result;
        let query = new Parse.Query(params.class == "User" ? Parse.User : params.class);
        let counter = 0;
        if(params.limit)
            query.limit(params.limit);
        if(params.sort){
            switch(params.sort.order){
                case 'asc':
                    query.ascending(params.sort.key);
                    break;
                case 'desc':
                    query.descending(params.sort.key);
                    break;
            }
        }
        let checker = () => {
            if(counter == 0)
                result = query.find();
            else if(counter == params.filters.length)
                result.then(
                    (object) => {
                        console.log('true filters', object);
                        done({result: 'ok', object: object})
                    },
                    (error) => {
                        console.log('filters error', object, error);
                        reject({result: 'error', error: error})
                    }
                );
            else
                result.then(
                    (object) => {
                        result = object
                    },
                    (error) => {
                        console.log('filters error', object, error);
                    }
                );
            counter++;
        };
        if(params.filters) {
            let filters = params.filters;
            filters.forEach((filter) => {
                //filter.value = filter.isInt ? parseInt(filter.value) : filter.value;
                switch (filter.condition) {
                    case ">=":
                        query.greaterThanOrEqualTo(filter.key, filter.value);
                        break;
                    case "<=":
                        query.lessThanOrEqualTo(filter.key, filter.value);
                        break;
                    case ">":
                        query.greaterThan(filter.key, filter.value);
                        break;
                    case "<":
                        query.lessThan(filter.key, filter.value);
                        break;
                    case "=":
                        query.equalTo(filter.key, filter.value);
                        checker();
                        break;
                    case "!=":
                        query.notEqualTo(filter.key, filter.value);
                        break;
                    case "between":
                        break;
                    default:
                        break;
                }
                checker();
            });
        } else
            checker();
    } else
        reject({result: 'error', error: 'missing data'});
};


let orGetObject = (params, done, reject) => {
    let queries = [
        new Parse.Query(params.class == "User" ? Parse.User : params.class),
        new Parse.Query(params.class == "User" ? Parse.User : params.class)
    ],
        counter = 0,
        filters = params.filters;

    filters.forEach((filter) => {
        switch (filter.condition) {
            case ">=":
                queries[counter].greaterThanOrEqualTo(filter.key, filter.value);
                break;
            case "<=":
                queries[counter].lessThanOrEqualTo(filter.key, filter.value);
                break;
            case ">":
                queries[counter].greaterThan(filter.key, filter.value);
                break;
            case "<":
                queries[counter].lessThan(filter.key, filter.value);
                break;
            case "=":
                queries[counter].equalTo(filter.key, filter.value);
                break;
            case "!=":
                queries[counter].notEqualTo(filter.key, filter.value);
                break;
            case "between":
                break;
            default:
                break;
        }
        counter++;
        if(counter == 2) {
            var mainQuery = Parse.Query.or(queries[0], queries[1]);
            if(params.limit)
                mainQuery.limit(params.limit);
            if(params.sort){
                switch(params.sort.order){
                    case 'asc':
                        mainQuery.ascending(params.sort.key);
                        break;
                    case 'desc':
                        mainQuery.descending(params.sort.key);
                        break;
                }
            }
            if(params.from)
                mainQuery.skip(params.from);
            mainQuery.find({
                success: (object) => {
                    console.log('true filter!', object);
                    done({result: 'ok', object: object});
                },
                error: (error) => {
                    console.log('filters error', object, error);
                    reject({result: 'error', error: error});
                }
            });
        }
    });
};

exports.addObject = addObject;
exports.getObject = getObject;
exports.getObjects = getObjects;
exports.updateObject = updateObject;
exports.deleteObject = deleteObject;
exports.filterObjects = filterObjects;
exports.orGetObject = orGetObject;