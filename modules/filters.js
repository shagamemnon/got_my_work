"use strict";

let setFilters = (obj) => {
    let request = JSON.parse(obj),
        filters = [];
    (Object.keys(request)).forEach((item)=>{
        if(item == "languages") {
            filters.push({key: "skills", value: request[item], condition: "containsAll"});
            return;
        }
        (request[item]).forEach((it)=>{
            if(item == "duration" || item == "rate") {
                switch (it) {
                    case "short":
                        filters.push({key: item, value: 1, condition: "<="});
                        break;
                    case "medium":
                        filters.push({key: item, value: 1, condition: ">"});
                        filters.push({key: item, value: 4, condition: "<="});
                        break;
                    case "long":
                        filters.push({key: item, value: 4, condition: ">"});
                        filters.push({key: item, value: 8, condition: "<="});
                        break;
                    case "longest":
                        filters.push({key: item, value: 8, condition: ">"});
                        break;
                }
            } else {
                filters.push({key: item, value: it, condition: "="});
            }
        });
    });
    return filters;
};

exports.setFilters = setFilters;