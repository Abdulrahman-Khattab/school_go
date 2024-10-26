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
      type: Number,
      required: true,
    },

    totalPaymentAfterDisscount: {
      type: Number,
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

// Post middleware for findOneAndUpdate
installment_schema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    // Apply discount
    const PaymentAfterDisscount =
      doc.totalPayment -
      doc.constantDisscount -
      doc.totalPayment * (doc.prcentageDisscount / 100);

    // Update the document with the new total payment values
    await this.model.updateOne(
      { _id: doc._id },
      {
        totalPaymentAfterDisscount: PaymentAfterDisscount,
      }
    );
  }
});

module.exports = mongoose.model('Installment', installment_schema);
