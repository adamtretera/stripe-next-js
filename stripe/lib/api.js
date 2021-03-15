"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const payments_1 = require("./payments");
exports.app = express_1.default();
exports.app.use(express_1.default.json());
const cors_1 = __importDefault(require("cors"));
exports.app.use(cors_1.default({ origin: true }));
exports.app.post('/test', (req, res) => {
    const amount = req.body.amount;
    res.status(200).send({ with_tax: amount * 7 });
});
const checkout_1 = require("./checkout");
const webhooks_1 = require("./webhooks");
exports.app.post("/checkouts/", runAsync(async ({ body }, res) => {
    res.send(await checkout_1.createStripeCheckoutSession(body.line_items));
}));
exports.app.post("/payments", runAsync(async ({ body }, res) => {
    res.send(await payments_1.createPaymentIntent(body.amount));
}));
function runAsync(callback) {
    return (req, res, next) => {
        callback(req, res, next).catch(next);
    };
}
exports.app.use(cors_1.default({ origin: true }));
exports.app.use(express_1.default.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
}));
exports.app.post("/hooks", runAsync(webhooks_1.handleStripeWebhook));
//# sourceMappingURL=api.js.map