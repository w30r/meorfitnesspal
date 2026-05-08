"use client";
"use strict";
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
exports.formatShortDate = formatShortDate;
exports.default = Home;
var link_1 = require("next/link");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var actions_1 = require("./actions");
var kadutama_1 = require("@/components/kadutama");
var utils_1 = require("@/lib/utils");
var bs_1 = require("react-icons/bs");
function formatDate(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return "".concat(year, "-").concat(month, "-").concat(day);
}
function formatShortDate(dateStr) {
    var _a = dateStr.split("-"), year = _a[0], month = _a[1], day = _a[2];
    var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return "".concat(day, " ").concat(months[parseInt(month) - 1], " ").concat(year);
}
function Home() {
    var _this = this;
    var _a, _b;
    var _c = (0, react_1.useState)(new Date()), today = _c[0], setToday = _c[1];
    var _d = (0, react_1.useState)(null), goal = _d[0], setGoal = _d[1];
    var _e = (0, react_1.useState)(null), foodLog = _e[0], setFoodLog = _e[1];
    var _f = (0, react_1.useState)(true), isGoalLoading = _f[0], setIsGoalLoading = _f[1];
    var _g = (0, react_1.useState)(null), weeklyWeightAvg = _g[0], setWeeklyWeightAvg = _g[1];
    var _h = (0, react_1.useState)(null), prevWeekWeightAvg = _h[0], setPrevWeekWeightAvg = _h[1];
    var _j = (0, react_1.useState)(0), streak = _j[0], setStreak = _j[1];
    var _k = (0, react_1.useState)(true), loading = _k[0], setLoading = _k[1];
    var _l = (0, react_1.useState)(false), dateLoading = _l[0], setDateLoading = _l[1];
    var isToday = formatDate(today) === formatDate(new Date());
    (0, react_1.useEffect)(function () {
        var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
            var data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        setDateLoading(true);
                        return [4 /*yield*/, (0, actions_1.getFoodLogbyDate)(formatDate(today))];
                    case 1:
                        data = _b.sent();
                        setFoodLog(data);
                        setLoading(false);
                        return [3 /*break*/, 4];
                    case 2:
                        _a = _b.sent();
                        console.error("Failed to get food log");
                        setLoading(false);
                        return [3 /*break*/, 4];
                    case 3:
                        setDateLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [today]);
    (0, react_1.useEffect)(function () {
        var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
            var data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, actions_1.getGoalData)()];
                    case 1:
                        data = _b.sent();
                        setGoal(data[0]);
                        setIsGoalLoading(false);
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        console.error("Failed to get goal data");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, []);
    (0, react_1.useEffect)(function () {
        var fetchWeightData = function () { return __awaiter(_this, void 0, void 0, function () {
            var weightData, now_1, oneWeekAgo_1, twoWeeksAgo_1, thisWeekEntries, lastWeekEntries, avg, avg, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, actions_1.getWeightLogs)()];
                    case 1:
                        weightData = (_b.sent());
                        if (weightData && weightData.length > 0) {
                            now_1 = new Date();
                            oneWeekAgo_1 = new Date(now_1);
                            oneWeekAgo_1.setDate(oneWeekAgo_1.getDate() - 7);
                            twoWeeksAgo_1 = new Date(now_1);
                            twoWeeksAgo_1.setDate(twoWeeksAgo_1.getDate() - 14);
                            thisWeekEntries = weightData.filter(function (w) {
                                var parts = w.date.split("-");
                                var d = new Date("".concat(parts[2], "-").concat(parts[1], "-").concat(parts[0]));
                                return d >= oneWeekAgo_1 && d <= now_1;
                            });
                            lastWeekEntries = weightData.filter(function (w) {
                                var parts = w.date.split("-");
                                var d = new Date("".concat(parts[2], "-").concat(parts[1], "-").concat(parts[0]));
                                return d >= twoWeeksAgo_1 && d < oneWeekAgo_1;
                            });
                            if (thisWeekEntries.length > 0) {
                                avg = thisWeekEntries.reduce(function (sum, w) { return sum + (w.weight || 0); }, 0) /
                                    thisWeekEntries.length;
                                setWeeklyWeightAvg(avg);
                            }
                            if (lastWeekEntries.length > 0) {
                                avg = lastWeekEntries.reduce(function (sum, w) { return sum + (w.weight || 0); }, 0) /
                                    lastWeekEntries.length;
                                setPrevWeekWeightAvg(avg);
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        console.error("Failed to get weight data");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchWeightData();
    }, []);
    (0, react_1.useEffect)(function () {
        var fetchStreak = function () { return __awaiter(_this, void 0, void 0, function () {
            var streakCount, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, actions_1.getStreak)()];
                    case 1:
                        streakCount = _b.sent();
                        console.log("🚀 ~ fetchStreak ~ streakCount:", streakCount);
                        setStreak(streakCount);
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        console.error("Failed to get streak");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchStreak();
    }, []);
    var handlePrevDay = function () {
        var prevDate = new Date(today);
        prevDate.setDate(prevDate.getDate() - 1);
        setToday(prevDate);
    };
    var handleNextDay = function () {
        var nextDate = new Date(today);
        nextDate.setDate(nextDate.getDate() + 1);
        setToday(nextDate); // Fixed: was prevDate
    };
    var handleGoToToday = function () {
        setToday(new Date());
    };
    var caloriePercentage = goal
        ? Math.round((((foodLog === null || foodLog === void 0 ? void 0 : foodLog.totalCalories) || 0) / goal.calories) * 100)
        : 0;
    if (loading) {
        return (<div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"/>
      </div>);
    }
    return (<div className="min-h-screen bg-background text-foreground">
      {/* Date Navigation Header */}
      <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-sm border-b border-border supports-backdrop-filter:bg-background/30">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button_1.Button variant="ghost" size="icon" onClick={handlePrevDay} className="hover:bg-accent rounded-full">
            <lucide_react_1.ChevronLeft className="h-5 w-5"/>
          </button_1.Button>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <lucide_react_1.Calendar className="h-3.5 w-3.5 text-primary"/>
              <h1 className="text-sm font-bold uppercase tracking-wider">
                {isToday ? "Today" : formatShortDate(formatDate(today))}
              </h1>
              {!isToday && (<button_1.Button variant="outline" size="sm" onClick={handleGoToToday} className="text-[10px] h-6 px-2 font-medium">
                  Today
                </button_1.Button>)}
            </div>
            {isToday && (<span className="text-[10px] text-muted-foreground font-medium">
                {formatShortDate(formatDate(today))}
              </span>)}
          </div>

          <button_1.Button variant="ghost" size="icon" onClick={handleNextDay} className="hover:bg-accent rounded-full">
            <lucide_react_1.ChevronRight className="h-5 w-5"/>
          </button_1.Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-3">
        {/* Mini Stats Column - This Week's Avg + Streak */}
        <div className="space-y-8">
          {/* Weekly Weight Average - Mini */}
          {weeklyWeightAvg && (<link_1.default href="/weight">
              <div className="bg-card border border-border rounded-[2.5rem] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <lucide_react_1.Weight className="h-4 w-4 text-primary"/>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      This Week&apos;s Avg
                    </span>
                  </div>
                  {prevWeekWeightAvg && (<p className={(0, utils_1.cn)("text-xs font-medium", weeklyWeightAvg < prevWeekWeightAvg
                    ? "text-green-500"
                    : "text-red-500")}>
                      {weeklyWeightAvg < prevWeekWeightAvg ? "↓" : "↑"}{" "}
                      {Math.abs(weeklyWeightAvg - prevWeekWeightAvg).toFixed(1)}
                      kg
                    </p>)}
                </div>
                <p className="text-2xl font-black mt-1">
                  {weeklyWeightAvg.toFixed(1)}
                  <span className="text-sm font-medium text-muted-foreground ml-1">
                    kg
                  </span>
                </p>
              </div>
            </link_1.default>)}

          {/* Streak - Mini */}
          {streak > 0 && (<div className="bg-card border border-border rounded-[2.5rem] p-4 shadow-sm mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <lucide_react_1.Flame className="h-4 w-4 text-orange-500"/>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Current Streak
                  </span>
                </div>
              </div>
              <p className="text-2xl font-black mt-1">
                {streak}
                <span className="text-sm font-medium text-muted-foreground ml-1">
                  day{streak !== 1 ? "s" : ""}
                </span>
              </p>
            </div>)}
        </div>

        {/* Main Calorie Ring/Progress Card */}
        <section className="relative overflow-hidden bg-card border border-border rounded-[2.5rem] p-4 shadow-sm">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Energy Balance
            </h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black tracking-tighter text-foreground">
                {((_a = foodLog === null || foodLog === void 0 ? void 0 : foodLog.totalCalories) === null || _a === void 0 ? void 0 : _a.toFixed(0)) || 0}
              </span>
              <span className="text-xl font-medium text-muted-foreground italic">
                / {(goal === null || goal === void 0 ? void 0 : goal.calories) || 0}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0">kcal consumed</p>

            <div className="w-full mt-4 space-y-2">
              <div className="flex justify-between text-xs font-bold px-1">
                <span className="text-primary">
                  {caloriePercentage}% of daily goal
                </span>
                <span className="text-muted-foreground">
                  {Math.max(0, ((goal === null || goal === void 0 ? void 0 : goal.calories) || 0) - ((foodLog === null || foodLog === void 0 ? void 0 : foodLog.totalCalories) || 0)).toFixed(0)}{" "}
                  left
                </span>
              </div>
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                <div className={(0, utils_1.cn)("h-full transition-all duration-700 ease-out", "bg-primary", caloriePercentage > 50 &&
            "bg-linear-to-r from-primary to-orange-500", caloriePercentage > 80 && "from-primary to-red-500", caloriePercentage >= 100 && "bg-red-500")} style={{ width: "".concat(Math.min(caloriePercentage, 100), "%") }}/>
              </div>
              <div className="mt-4">
                {foodLog && (<button_1.Button variant="outline" size="sm" asChild className="flex-1 text-xs">
                    <a href={"https://www.google.com/search?q=give+me+suggestion+on+what+to+eat.+i+have+".concat((1500 - foodLog.totalCalories).toFixed(0), "+kcal+left+to+eat+and+i+have+eaten+").concat((foodLog === null || foodLog === void 0 ? void 0 : foodLog.totalProtein).toFixed(0), "+g+out+of+").concat((_b = goal === null || goal === void 0 ? void 0 : goal.protein) === null || _b === void 0 ? void 0 : _b.toFixed(0), "+g+of+protein+as+of+now+for+today.")} target="_blank">
                      <bs_1.BsQuestion className="mr-2"/> Suggestion
                    </a>
                  </button_1.Button>)}
              </div>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"/>
        </section>

        {/* Macros Section */}
        <section className="w-full">
          {isGoalLoading ? (<div className="h-48 w-full animate-pulse bg-muted rounded-[2.5rem]"/>) : (<kadutama_1.default date={formatDate(today)} p={(foodLog === null || foodLog === void 0 ? void 0 : foodLog.totalProtein) || 0} pgoal={(goal === null || goal === void 0 ? void 0 : goal.protein) || 0} c={(foodLog === null || foodLog === void 0 ? void 0 : foodLog.totalCarbs) || 0} cgoal={goal === null || goal === void 0 ? void 0 : goal.carbs} f={(foodLog === null || foodLog === void 0 ? void 0 : foodLog.totalFats) || 0} fgoal={goal === null || goal === void 0 ? void 0 : goal.fats}/>)}
        </section>

        {dateLoading && (<div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"/>
          </div>)}

        {/* Spacer for bottom nav */}
        <div className="h-20"/>
      </main>
    </div>);
}
