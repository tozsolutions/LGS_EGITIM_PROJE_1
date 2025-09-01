"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialType = exports.Difficulty = exports.Subject = exports.AdminPermission = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["TEACHER"] = "teacher";
    UserRole["STUDENT"] = "student";
})(UserRole || (exports.UserRole = UserRole = {}));
var AdminPermission;
(function (AdminPermission) {
    AdminPermission["MANAGE_USERS"] = "manage_users";
    AdminPermission["MANAGE_QUESTIONS"] = "manage_questions";
    AdminPermission["MANAGE_EXAMS"] = "manage_exams";
    AdminPermission["VIEW_ANALYTICS"] = "view_analytics";
    AdminPermission["MANAGE_CONTENT"] = "manage_content";
})(AdminPermission || (exports.AdminPermission = AdminPermission = {}));
var Subject;
(function (Subject) {
    Subject["TURKCE"] = "turkce";
    Subject["MATEMATIK"] = "matematik";
    Subject["FEN_BILIMLERI"] = "fen_bilimleri";
    Subject["SOSYAL_BILGILER"] = "sosyal_bilgiler";
    Subject["INGILIZCE"] = "ingilizce";
    Subject["DIN_KULTURU"] = "din_kulturu";
})(Subject || (exports.Subject = Subject = {}));
var Difficulty;
(function (Difficulty) {
    Difficulty["EASY"] = "easy";
    Difficulty["MEDIUM"] = "medium";
    Difficulty["HARD"] = "hard";
})(Difficulty || (exports.Difficulty = Difficulty = {}));
var MaterialType;
(function (MaterialType) {
    MaterialType["TEXT"] = "text";
    MaterialType["PDF"] = "pdf";
    MaterialType["VIDEO"] = "video";
    MaterialType["AUDIO"] = "audio";
    MaterialType["IMAGE"] = "image";
})(MaterialType || (exports.MaterialType = MaterialType = {}));
//# sourceMappingURL=index.js.map