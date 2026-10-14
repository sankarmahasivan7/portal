"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentProgress = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CompletedLevelRecordSchema = new mongoose_1.Schema({
    levelNumber: { type: Number, required: true },
    passedAt: { type: Date, default: Date.now },
    percentage: { type: Number, required: true },
    obtainedMarks: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    examinationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Examination', required: true },
    resultId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ExaminationResult', required: true }
}, { _id: false });
const StudentProgressSchema = new mongoose_1.Schema({
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    languageId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ProgrammingLanguage', required: true, index: true },
    highestUnlockedLevel: { type: Number, default: 1, min: 1 },
    completedLevels: [CompletedLevelRecordSchema]
}, { timestamps: true });
// Compound unique index: one progress document per student per language
StudentProgressSchema.index({ studentId: 1, languageId: 1 }, { unique: true });
exports.StudentProgress = mongoose_1.default.model('StudentProgress', StudentProgressSchema);
