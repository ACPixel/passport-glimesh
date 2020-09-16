"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
/**
 * Module dependencies.
 */
var oauth2_1 = __importDefault(require("./oauth2"));
exports.Strategy = oauth2_1.default;
/**
 * Framework version.
 */
require("pkginfo")(module, "version");
