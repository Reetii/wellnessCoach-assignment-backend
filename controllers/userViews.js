const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const UserView = require('../models/UserView');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;



exports.getViews = asyncHandler(async (req, res, next) => {
    const productId = req.params.productId;
    const params = {sort:{}, searchParams:{productId: ObjectId(productId)}};
    const type = req.query.type; //monthly|weekly|daily
    let query = [];
    if (!type) {
        return next(
            new ErrorResponse(`Please provide a type`, 400)
        );
    }
    if(type=== 'daily') {
        query = [
            {$match: params.searchParams},
            {
                $project: {
                    "viewDate": 1,
                    "userId": 1,
                    "year": {
                        "$year": "$viewDate"
                    },
                    "month": {
                        "$month": "$viewDate"
                    },
                    "day": {
                        "$dayOfMonth": "$viewDate"
                    }
                }
            },
            {
                "$match": {
                    "year": new Date().getFullYear(),
                    "month": new Date().getMonth() + 1, //because January starts with 0
                    "day": new Date().getDate()
                }
            },

            {
                $group: {
                    _id: null,
                    users: {$addToSet: "$userId"},
                    totalViews: {$sum: 1},
                }
            },
            {
                $project: {
                    date: "$viewDate",
                    totalViews: 1,
                    numberOfDistinctUsers: {$cond: {if: {$isArray: "$users"}, then: {$size: "$users"}, else: "NA"}},
                    _id: 0
                }
            }];
        const userView = await UserView.aggregate(query);
        res.status(200).json({success: true, data: userView});
    }
    if(type=== 'weekly'){
        const today = new Date();
        const first = today.getDate() - today.getDay();
        const firstDayWeek = new Date(today.setDate(first));
        const lastDayWeek = new Date(today.setDate(first + 6));
        params.searchParams['viewDate'] = {
            $lt: lastDayWeek,
            $gt: firstDayWeek
        };
        query = [
            {$match: params.searchParams},
            {
                $group: {
                    _id: null,
                    users: {$addToSet: "$userId"},
                    totalViews: {$sum: 1},
                }
            },
            {
                $project: {
                    date: "$viewDate",
                    totalViews: 1,
                    numberOfDistinctUsers: {$cond: {if: {$isArray: "$users"}, then: {$size: "$users"}, else: "NA"}},
                    _id: 0
                }
            }

          /*  {
                "$group": {
                    "_id": "$createdAtWeek",
                    "average": { "$avg": "$rating" },
                    "month": { "$first": "$createdAtMonth" }
                }
            }*/

        ];
        const userView = await UserView.aggregate(query);
        res.status(200).json({success: true, data: userView});

    }
    if(type=== 'monthly') {
        query = [
            {$match: params.searchParams},
            {
                $project: {
                    "viewDate": 1,
                    "userId": 1,
                    "month": {
                        "$month": "$viewDate"
                    }
                }
            },
            {
                "$match": {
                    "month": new Date().getMonth() + 1, //because January starts with 0
                }
            },

            {
                $group: {
                    _id: null,
                    users: {$addToSet: "$userId"},
                    totalViews: {$sum: 1},
                }
            },
            {
                $project: {
                    date: "$viewDate",
                    totalViews: 1,
                    numberOfDistinctUsers: {$cond: {if: {$isArray: "$users"}, then: {$size: "$users"}, else: "NA"}},
                    _id: 0
                }
            }];
        const userView = await UserView.aggregate(query);
        res.status(200).json({success: true, data: userView});
    }
    if(type=== 'custom'){
        const {to, from} = req.query;
        if(!to || !from){
            return next(
                new ErrorResponse(`Please provide a date range for custom type`, 400)
            );
        }
        const startDay = new Date(+from.split("/")[2], from.split("/")[1] - 1, +from.split("/")[0]);
        const endDay = new Date(+to.split("/")[2], to.split("/")[1] - 1, +to.split("/")[0]);
        console.log("startDay====>", startDay, endDay);
        params.searchParams['viewDate'] = {
            $lte: endDay,
            $gte: startDay
        };
        query = [
            {$match: params.searchParams},
           /* {
                $group: {
                    _id: null,
                    users: {$addToSet: "$userId"},
                    totalViews: {$sum: 1},
                }
            },
            {
                $project: {
                    date: "$viewDate",
                    totalViews: 1,
                    numberOfDistinctUsers: {$cond: {if: {$isArray: "$users"}, then: {$size: "$users"}, else: "NA"}},
                    _id: 0
                }
            }*/

            /*  {
                  "$group": {
                      "_id": "$createdAtWeek",
                      "average": { "$avg": "$rating" },
                      "month": { "$first": "$createdAtMonth" }
                  }
              }*/

        ];
        const userView = await UserView.aggregate(query);
        res.status(200).json({success: true, data: userView});

    }


});

exports.createViews = asyncHandler(async (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.user._id;
   let viewObj = {productId: productId, userId: userId};

    const view = await UserView.create(viewObj);

    res.status(201).json({
        success: true,
        data: view
    });
});


