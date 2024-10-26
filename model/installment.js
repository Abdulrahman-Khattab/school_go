const mongoose = require('mongoose');

const installment_schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    prcentageDisscount: {
      type: Number,
      default: 0,
    },
    constantDisscount: {
      type: Number,
      default: 0,
    },

    totalPayment: {
      type: String,
      required: true,
    },

    totalPaymentAfterDisscount: {
      type: String,
      required: true,
    },
    currentPayment: {
      type: [
        {
          paymentValue: {
            type: Number,
            required: true,
          },
          paymentDateFront_end: {
            type: Date,
            required: true,
          },
          paymentDateBack_end: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Installment', installment_schema);
