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
Object.defineProperty(exports, "__esModule", { value: true });
const validateYup = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        yield schema.validate(body, { abortEarly: false });
        return next();
    }
    catch (error) {
        let errors = [];
        error.inner.forEach((err) => {
            errors = [...errors, { field: err.path, message: err.message }];
        });
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Yêu cầu bị từ chối!',
            errors,
        });
    }
});
exports.default = validateYup;
//# sourceMappingURL=validateYup.js.map