"use server";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFoodLog = saveFoodLog;
exports.getFoodLogs = getFoodLogs;
exports.getTotalCaloriesByDate = getTotalCaloriesByDate;
exports.getStreak = getStreak;
exports.getTotalProteinByDate = getTotalProteinByDate;
exports.getTotalCarbsByDate = getTotalCarbsByDate;
exports.getTotalFatsByDate = getTotalFatsByDate;
exports.getGoalData = getGoalData;
exports.updateMacrosAndCaloriesGoal = updateMacrosAndCaloriesGoal;
exports.getTodaysFoodLog = getTodaysFoodLog;
exports.getFoodLogbyDate = getFoodLogbyDate;
exports.deleteMealById = deleteMealById;
exports.getLatestFoodLogs = getLatestFoodLogs;
exports.getWeightLogs = getWeightLogs;
exports.upsertWeight = upsertWeight;
exports.deleteWeightById = deleteWeightById;
exports.getCombinedWeightAndCals = getCombinedWeightAndCals;
exports.getRecentFoods = getRecentFoods;
exports.getFavoriteFoods = getFavoriteFoods;
exports.toggleFavorite = toggleFavorite;
exports.claimExistingData = claimExistingData;
var mongodb_1 = require("mongodb");
var mongodb_2 = require("./lib/mongodb");
var session_1 = require("./lib/session");
var cache_1 = require("next/cache");
function saveFoodLog(foodLog) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, per100g, docToSave, result, insertedDocument, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        throw new Error("Not authenticated");
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("foodlog");
                    per100g = foodLog.per100g;
                    if (!per100g && foodLog.servingSize > 0 && foodLog.calories > 0) {
                        per100g = {
                            calories: (foodLog.calories / foodLog.servingSize) * 100,
                            carbs: (foodLog.carbs / foodLog.servingSize) * 100,
                            protein: (foodLog.protein / foodLog.servingSize) * 100,
                            fats: (foodLog.fats / foodLog.servingSize) * 100,
                        };
                    }
                    docToSave = __assign(__assign({}, foodLog), { userId: userId, per100g: per100g });
                    return [4 /*yield*/, collection.insertOne(docToSave)];
                case 3:
                    result = _a.sent();
                    return [4 /*yield*/, collection.findOne({
                            _id: result.insertedId,
                        })];
                case 4:
                    insertedDocument = _a.sent();
                    return [2 /*return*/, JSON.parse(JSON.stringify(insertedDocument))];
                case 5:
                    error_1 = _a.sent();
                    console.error("Failed to save food log", error_1);
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
//get food logs
function getFoodLogs() {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, foodLogs, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("foodlog");
                    return [4 /*yield*/, collection.find({ userId: userId }).toArray()];
                case 3:
                    foodLogs = _a.sent();
                    return [2 /*return*/, JSON.parse(JSON.stringify(foodLogs))];
                case 4:
                    error_2 = _a.sent();
                    console.error("Failed to get food logs", error_2);
                    throw error_2;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// get total calories by date
function getTotalCaloriesByDate(date) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, totalCalories, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, [{ _id: date, totalCalories: 0 }]];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("foodlog");
                    return [4 /*yield*/, collection
                            .aggregate([
                            { $match: { date: date, userId: userId } },
                            { $group: { _id: "$date", totalCalories: { $sum: "$calories" } } },
                        ])
                            .toArray()];
                case 3:
                    totalCalories = _a.sent();
                    return [2 /*return*/, JSON.parse(JSON.stringify(totalCalories))];
                case 4:
                    error_3 = _a.sent();
                    return [2 /*return*/, [{ _id: "takde", totalCalories: 1, status: "none" }]];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// calculate streak (consecutive days with food logs)
function getStreak() {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, logs, uniqueDates, today, yesterday, formatDate, streak, checkDate, todayStr, yesterdayStr, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, 0];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("foodlog");
                    return [4 /*yield*/, collection
                            .find({ userId: userId })
                            .sort({ date: -1 })
                            .limit(100)
                            .project({ date: 1, _id: 0 })
                            .toArray()];
                case 3:
                    logs = (_a.sent());
                    if (!logs || logs.length === 0)
                        return [2 /*return*/, 0];
                    uniqueDates = new Set(logs.map(function (l) { return l.date; }));
                    today = new Date();
                    today.setHours(0, 0, 0, 0);
                    yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    formatDate = function (d) {
                        return "".concat(d.getFullYear(), "-").concat((d.getMonth() + 1).toString().padStart(2, "0"), "-").concat(d.getDate().toString().padStart(2, "0"));
                    };
                    streak = 0;
                    checkDate = new Date(today);
                    todayStr = formatDate(today);
                    yesterdayStr = formatDate(yesterday);
                    if (!uniqueDates.has(todayStr) && !uniqueDates.has(yesterdayStr)) {
                        return [2 /*return*/, 0];
                    }
                    if (!uniqueDates.has(todayStr)) {
                        checkDate = yesterday;
                    }
                    while (uniqueDates.has(formatDate(checkDate))) {
                        streak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    }
                    return [2 /*return*/, streak];
                case 4:
                    error_4 = _a.sent();
                    console.error("Failed to get streak", error_4);
                    return [2 /*return*/, 0];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// get total protein by date
function getTotalProteinByDate(date) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, totalProtein, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, [{ _id: date, totalProtein: 0 }]];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("foodlog");
                    return [4 /*yield*/, collection
                            .aggregate([
                            { $match: { date: date, userId: userId } },
                            { $group: { _id: "$date", totalProtein: { $sum: "$protein" } } },
                        ])
                            .toArray()];
                case 3:
                    totalProtein = _a.sent();
                    return [2 /*return*/, JSON.parse(JSON.stringify(totalProtein))];
                case 4:
                    error_5 = _a.sent();
                    console.error("Failed to get total protein by date", error_5);
                    return [2 /*return*/, [{ _id: "takde", totalProtein: 1, status: "none" }]];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// get total carbs by date
function getTotalCarbsByDate(date) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, totalCarbs, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, [{ _id: date, totalCarbs: 0 }]];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("foodlog");
                    return [4 /*yield*/, collection
                            .aggregate([
                            { $match: { date: date, userId: userId } },
                            { $group: { _id: "$date", totalCarbs: { $sum: "$carbs" } } },
                        ])
                            .toArray()];
                case 3:
                    totalCarbs = _a.sent();
                    return [2 /*return*/, JSON.parse(JSON.stringify(totalCarbs))];
                case 4:
                    error_6 = _a.sent();
                    console.error("Failed to get total carbs by date", error_6);
                    return [2 /*return*/, [{ _id: "takde", totalCarbs: 1, status: "none" }]];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// get total fats by date
function getTotalFatsByDate(date) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, totalFats, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, [{ _id: date, totalFats: 0 }]];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("foodlog");
                    return [4 /*yield*/, collection
                            .aggregate([
                            { $match: { date: date, userId: userId } },
                            { $group: { _id: "$date", totalFats: { $sum: "$fats" } } },
                        ])
                            .toArray()];
                case 3:
                    totalFats = _a.sent();
                    return [2 /*return*/, JSON.parse(JSON.stringify(totalFats))];
                case 4:
                    error_7 = _a.sent();
                    console.error("Failed to get total fats by date", error_7);
                    return [2 /*return*/, [{ _id: "takde", totalFats: 1, status: "none" }]];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// get goal data
function getGoalData() {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, goalData, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("goal");
                    return [4 /*yield*/, collection.find({ userId: userId }).toArray()];
                case 3:
                    goalData = _a.sent();
                    return [2 /*return*/, JSON.parse(JSON.stringify(goalData))];
                case 4:
                    error_8 = _a.sent();
                    console.error("Failed to get goal data", error_8);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// update macros and calories goal
function updateMacrosAndCaloriesGoal(calories, protein, carbs, fats) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, result, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        throw new Error("Not authenticated");
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("goal");
                    return [4 /*yield*/, collection.updateOne({ userId: userId }, { $set: { calories: calories, protein: protein, carbs: carbs, fats: fats, userId: userId } }, { upsert: true })];
                case 3:
                    result = _a.sent();
                    return [2 /*return*/, result.modifiedCount];
                case 4:
                    error_9 = _a.sent();
                    console.error("Failed to update macros and calories goal", error_9);
                    throw error_9;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// get today's food log
function getTodaysFoodLog() {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, today, foodLog, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("foodlog");
                    today = new Date().toISOString().split("T")[0];
                    return [4 /*yield*/, collection.find({ date: today, userId: userId }).toArray()];
                case 3:
                    foodLog = _a.sent();
                    return [2 /*return*/, JSON.parse(JSON.stringify(foodLog))];
                case 4:
                    error_10 = _a.sent();
                    console.error("Failed to get today's food log", error_10);
                    throw error_10;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getFoodLogbyDate(date) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, foodLog, totals, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, { logs: [], totalCalories: 0, totalCarbs: 0, totalProtein: 0, totalFats: 0 }];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("foodlog");
                    return [4 /*yield*/, collection.find({ date: date, userId: userId }).toArray()];
                case 3:
                    foodLog = _a.sent();
                    totals = foodLog.reduce(function (acc, item) {
                        acc.totalCalories += item.calories || 0;
                        acc.totalCarbs += item.carbs || 0;
                        acc.totalProtein += item.protein || 0;
                        acc.totalFats += item.fats || 0;
                        return acc;
                    }, {
                        totalCalories: 0,
                        totalCarbs: 0,
                        totalProtein: 0,
                        totalFats: 0,
                    });
                    return [2 /*return*/, __assign({ logs: JSON.parse(JSON.stringify(foodLog)) }, totals)];
                case 4:
                    error_11 = _a.sent();
                    console.error("Failed to get food log by date", error_11);
                    throw error_11;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// delete meal by ID
function deleteMealById(mealId) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, result, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        throw new Error("Not authenticated");
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("foodlog");
                    return [4 /*yield*/, collection.deleteOne({ _id: new mongodb_1.ObjectId(mealId), userId: userId })];
                case 3:
                    result = _a.sent();
                    (0, cache_1.revalidatePath)("/foodlogs/[date]", "page");
                    return [2 /*return*/, result.deletedCount];
                case 4:
                    error_12 = _a.sent();
                    console.error("Failed to delete meal by ID", error_12);
                    throw error_12;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// last x number of food logs
function getLatestFoodLogs(days) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, startDate, startDateString, stats, error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, { success: true, data: [] }];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    startDate = new Date();
                    startDate.setDate(startDate.getDate() - (days - 1));
                    startDateString = startDate.toISOString().split("T")[0];
                    return [4 /*yield*/, db
                            .collection("foodlog")
                            .aggregate([
                            {
                                $match: {
                                    date: { $gte: startDateString },
                                    userId: userId,
                                },
                            },
                            {
                                $group: {
                                    _id: "$date",
                                    totalCalories: { $sum: "$calories" },
                                    totalCarbs: { $sum: "$carbs" },
                                    totalProtein: { $sum: "$protein" },
                                    totalFats: { $sum: "$fats" },
                                    logCount: { $sum: 1 },
                                },
                            },
                            {
                                $sort: { _id: -1 },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    date: "$_id",
                                    totalCalories: 1,
                                    totalCarbs: 1,
                                    totalProtein: 1,
                                    totalFats: 1,
                                    logCount: 1,
                                },
                            },
                        ])
                            .toArray()];
                case 3:
                    stats = _a.sent();
                    return [2 /*return*/, {
                            success: true,
                            data: stats,
                        }];
                case 4:
                    error_13 = _a.sent();
                    console.error("Error in getLatestFoodLogs:", error_13);
                    return [2 /*return*/, {
                            success: false,
                            error: "Internal Server Error: Could not fetch logs.",
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 1. Fetch all weight logs (sorted by date for the graph)
function getWeightLogs() {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, logs, error_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    return [4 /*yield*/, db
                            .collection("weightlog")
                            .find({ userId: userId })
                            .sort({ date: 1 })
                            .toArray()];
                case 3:
                    logs = _a.sent();
                    return [2 /*return*/, logs.map(function (log) { return (__assign(__assign({}, log), { _id: log._id.toString() })); })];
                case 4:
                    error_14 = _a.sent();
                    console.error("Failed to fetch weight logs:", error_14);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 2. Add or Update weight for a specific date
function upsertWeight(weight, date) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, error_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        throw new Error("Not authenticated");
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("weightlog");
                    return [4 /*yield*/, collection.updateOne({ date: date, userId: userId }, { $set: { weight: weight, date: date, userId: userId } }, { upsert: true })];
                case 3:
                    _a.sent();
                    (0, cache_1.revalidatePath)("/weight");
                    return [2 /*return*/, { success: true }];
                case 4:
                    error_15 = _a.sent();
                    console.error("Failed to log weight:", error_15);
                    throw new Error("Failed to save weight entry.");
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 3. Delete a weight log
function deleteWeightById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, result, error_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        throw new Error("Not authenticated");
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    return [4 /*yield*/, db
                            .collection("weightlog")
                            .deleteOne({ _id: new mongodb_1.ObjectId(id), userId: userId })];
                case 3:
                    result = _a.sent();
                    (0, cache_1.revalidatePath)("/weight");
                    return [2 /*return*/, result.deletedCount];
                case 4:
                    error_16 = _a.sent();
                    console.error("Failed to delete weight log:", error_16);
                    throw error_16;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getCombinedWeightAndCals() {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, weightLogs, foodLogs, dailyCalories, dailyWeights, allDates, sortedDates, lastKnownWeight, combined;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    return [4 /*yield*/, db.collection("weightlog").find({ userId: userId }).toArray()];
                case 3:
                    weightLogs = _a.sent();
                    return [4 /*yield*/, db.collection("foodlog").find({ userId: userId }).toArray()];
                case 4:
                    foodLogs = _a.sent();
                    dailyCalories = {};
                    foodLogs.forEach(function (log) {
                        var p = Number(log.protein) || 0;
                        var c = Number(log.carbs) || 0;
                        var f = Number(log.fats) || 0;
                        var totalCals = p * 4 + c * 4 + f * 9;
                        // Convert YYYY-MM-DD to DD-MM-YYYY to match weightlog
                        var dateKey = log.date;
                        if (log.date.includes("-") && log.date.split("-")[0].length === 4) {
                            var _a = log.date.split("-"), y = _a[0], m = _a[1], d = _a[2];
                            dateKey = "".concat(d, "-").concat(m, "-").concat(y);
                        }
                        // Normalize (remove leading zeros) to be safe
                        var normalizedKey = dateKey.split("-").map(Number).join("-");
                        dailyCalories[normalizedKey] =
                            (dailyCalories[normalizedKey] || 0) + totalCals;
                    });
                    dailyWeights = {};
                    weightLogs.forEach(function (w) {
                        var normalizedWeightDate = w.date.split("-").map(Number).join("-");
                        dailyWeights[normalizedWeightDate] = w.weight;
                    });
                    allDates = new Set();
                    Object.keys(dailyCalories).forEach(function (d) { return allDates.add(d); });
                    Object.keys(dailyWeights).forEach(function (d) { return allDates.add(d); });
                    sortedDates = Array.from(allDates).sort(function (a, b) {
                        var _a = a.split("-").map(Number), d1 = _a[0], m1 = _a[1], y1 = _a[2];
                        var _b = b.split("-").map(Number), d2 = _b[0], m2 = _b[1], y2 = _b[2];
                        return (new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime());
                    });
                    lastKnownWeight = null;
                    combined = sortedDates.map(function (date) {
                        var _a;
                        var calories = Math.round(dailyCalories[date] || 0);
                        var weight = (_a = dailyWeights[date]) !== null && _a !== void 0 ? _a : null;
                        // Forward-fill weight: use last known weight if current is null
                        if (weight !== null) {
                            lastKnownWeight = weight;
                        }
                        // For display, use the date string as-is
                        var displayDate = date.split("-").map(Number).join("-");
                        return {
                            date: displayDate,
                            weight: lastKnownWeight,
                            calories: calories,
                        };
                    });
                    return [2 /*return*/, combined];
            }
        });
    });
}
function getRecentFoods() {
    return __awaiter(this, arguments, void 0, function (limit) {
        var userId, db, collection, foods, error_17;
        if (limit === void 0) { limit = 20; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("foodlog");
                    return [4 /*yield*/, collection
                            .find({ userId: userId })
                            .sort({ _id: -1 })
                            .limit(limit)
                            .toArray()];
                case 3:
                    foods = _a.sent();
                    return [2 /*return*/, JSON.parse(JSON.stringify(foods))];
                case 4:
                    error_17 = _a.sent();
                    console.error("Failed to get recent foods", error_17);
                    throw error_17;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getFavoriteFoods() {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, foods, error_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("foodlog");
                    return [4 /*yield*/, collection.find({ isFavorite: true, userId: userId }).toArray()];
                case 3:
                    foods = _a.sent();
                    return [2 /*return*/, JSON.parse(JSON.stringify(foods))];
                case 4:
                    error_18 = _a.sent();
                    console.error("Failed to get favorite foods", error_18);
                    throw error_18;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function toggleFavorite(foodId) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, collection, food, newFavorite, error_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        throw new Error("Not authenticated");
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    collection = db.collection("foodlog");
                    return [4 /*yield*/, collection.findOne({ _id: new mongodb_1.ObjectId(foodId), userId: userId })];
                case 3:
                    food = _a.sent();
                    if (!food)
                        throw new Error("Food not found");
                    newFavorite = !food.isFavorite;
                    return [4 /*yield*/, collection.updateOne({ _id: new mongodb_1.ObjectId(foodId), userId: userId }, { $set: { isFavorite: newFavorite } })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, newFavorite];
                case 5:
                    error_19 = _a.sent();
                    console.error("Failed to toggle favorite", error_19);
                    throw error_19;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function claimExistingData() {
    return __awaiter(this, void 0, void 0, function () {
        var userId, db, foodlogCollection, weightlogCollection, goalCollection, foodlogResult, weightlogResult, goalResult, error_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, (0, session_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        throw new Error("Not authenticated");
                    return [4 /*yield*/, (0, mongodb_2.connectToDatabase)("meorfitnesspal")];
                case 2:
                    db = _a.sent();
                    foodlogCollection = db.collection("foodlog");
                    weightlogCollection = db.collection("weightlog");
                    goalCollection = db.collection("goal");
                    return [4 /*yield*/, foodlogCollection.updateMany({ userId: { $exists: false } }, { $set: { userId: userId } })];
                case 3:
                    foodlogResult = _a.sent();
                    return [4 /*yield*/, weightlogCollection.updateMany({ userId: { $exists: false } }, { $set: { userId: userId } })];
                case 4:
                    weightlogResult = _a.sent();
                    return [4 /*yield*/, goalCollection.updateMany({ userId: { $exists: false } }, { $set: { userId: userId } })];
                case 5:
                    goalResult = _a.sent();
                    console.log("Claimed ".concat(foodlogResult.modifiedCount, " foodlog, ").concat(weightlogResult.modifiedCount, " weightlog, ").concat(goalResult.modifiedCount, " goal entries"));
                    return [2 /*return*/, {
                            success: true,
                            foodlogClaimed: foodlogResult.modifiedCount,
                            weightlogClaimed: weightlogResult.modifiedCount,
                            goalClaimed: goalResult.modifiedCount,
                        }];
                case 6:
                    error_20 = _a.sent();
                    console.error("Failed to claim existing data", error_20);
                    throw error_20;
                case 7: return [2 /*return*/];
            }
        });
    });
}
