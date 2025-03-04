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
class BaseController {
    constructor(model) {
        this.model = model;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ownerFilter = req.query.owner;
            try {
                if (ownerFilter) {
                    const data = yield this.model.find({ owner: ownerFilter });
                    res.status(200).send(data);
                }
                else {
                    const data = yield this.model.find();
                    return res.send(data);
                }
            }
            catch (error) {
                return res.status(400).send(error);
            }
        });
    }
    ;
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (id) {
                try {
                    const data = yield this.model.findById(id);
                    if (data) {
                        return res.send(data);
                    }
                    else {
                        return res.status(404).send("item not found");
                    }
                }
                catch (error) {
                    return res.status(400).send(error);
                }
            }
            return res.status(400).send("invalid id");
        });
    }
    ;
    createItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.model.create(req.body);
                res.status(201).send(data);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    ;
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                yield this.model.findByIdAndDelete(id);
                return res.send("item deleted");
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    ;
}
;
const createController = (model) => {
    return new BaseController(model);
};
exports.default = createController;
//# sourceMappingURL=base_controllers.js.map