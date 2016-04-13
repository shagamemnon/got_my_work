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
        queryBuild(params,query);
        /*if(params.limit)
            query.limit(params.limit);
        if(params.from)
            query.skip(params.from);*/
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
    if (params.class == "User")
        Parse.Cloud.useMasterKey();
    if(params.id)
        query.set("objectId", params.id);
    query.save(params.data, {
        success: (object) => {
            //console.log('true save', object);
            done({result: 'ok', object: object})
        },
        error: (object, error) => {
            //console.log('err save', object);
            reject({result: 'error', error: error})
        }
    });
};

let saveObjects = (params, done, reject) => {
    let Query = Parse.Object.extend(params.class),
        data = [];
    let query = new Query();

    if (params.class == "User")
        Parse.Cloud.useMasterKey();
    (params.data).forEach((item, index)=>{
        let query = new Query();
        Object.keys(item).forEach((ind)=>{
            query.set(ind, item[ind]);
        });
        data.push(query);
        if(index == params.data.length-1) {
            Parse.Object.saveAll(data, {
                success: (object) => {
                    //console.log('true save', object);
                    done({result: 'ok', object: object})
                },
                error: (object, error) => {
                    //console.log('err save', object);
                    reject({result: 'error', error: error})
                }
            });
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

let queryBuild = (params, query) => {
    if(params.limit) /* set limit of result */
        query.limit(params.limit);

    if(params.from) /* skip result */
        query.skip(params.from);

    if(params.sort){ /* set result ordering */
        switch(params.sort.order){
            case 'asc':
                query.ascending(params.sort.key);
                break;
            case 'desc':
                query.descending(params.sort.key);
                break;
        }
    }

    if(params.filters) { /* setting filters */
        let filters = params.filters;
        filters.forEach((filter) => {
            filter.value = filter.isInt ? parseInt(filter.value) : filter.value;
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
                    break;
                case "!=":
                    query.notEqualTo(filter.key, filter.value);
                    break;
                case "contains":
                    query.contains(filter.key, filter.value);
                    break;
                case "containsAll":
                    query.containsAll(filter.key, filter.value);
                    break;
                case "matches":
                    let exprRegEx = filter.exac ? new RegExp("\\b" + filter.value + "\\b", 'ig') : new RegExp(filter.value, 'ig');
                    query.matches(filter.key, exprRegEx);
                    break;
                case "between":
                    break;
                default:
                    break;
            }

        });
    }
    return query;
};

let filterObjects = (params, done, reject) => {
    if (params) {
        let query = new Parse.Query(params.class == "User" ? Parse.User : params.class);
        queryBuild(params, query);
        query.find(
            (object) => {
                console.log('true filters', object);
                done({result: 'ok', object: object})
            },
            (error) => {
                console.log('filters error', error);
                reject({result: 'error', error: error})
            }
        )
    } else
        reject({result: 'error', error: 'missing data'});
};

let orGetObject = (params, done, reject) => {
    if (params) {
        let queries = [],
            counter = 0,
            filters = params.filters;

        (params.search).forEach((obj) => { /* creating queries via number of params */
            queries.push(new Parse.Query(obj.class == "User" ? Parse.User : obj.class));
        });

        queries.forEach((query) =>{ /* building conditions for queries */
            queryBuild(params.search[counter], query);
            counter++;
        });

        if(counter == params.search.length) {
            let mainQuery = Parse.Query.or.apply(Parse.Query, queries); /* main query wich will contains results */
            queryBuild(params, mainQuery); /* building conditions for main query */
            mainQuery.find({
                success: (object) => {
                    console.log('true filter!', object);
                    done({result: 'ok', object: object});
                },
                error: (object, error) => {
                    console.log('filters error', object, error);
                    reject({result: 'error', error: error});
                }
            });
        }
    } else
        reject({result: 'error', error: 'missing data'});
};

exports.addObject = addObject;
exports.getObject = getObject;
exports.getObjects = getObjects;
exports.saveObjects = saveObjects;
exports.updateObject = updateObject;
exports.deleteObject = deleteObject;
exports.filterObjects = filterObjects;
exports.orGetObject = orGetObject;