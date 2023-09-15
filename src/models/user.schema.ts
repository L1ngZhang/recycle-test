import * as mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  companyName: {
    type: String,
  },
  userType: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // Define a regular expression for Canadian postal codes
        const postalCodeRegex = /^[A-Za-z][0-9][A-Za-z][0-9][A-Za-z][0-9]$/;

        // Test the value against the regular expression
        return postalCodeRegex.test(value);
      },
      message: 'Invalid postal code format. Please use a valid Canadian postal code (e.g., "A1A 1A1").',
    },
  },
  phone: {
    type: String,
  },
  numberOfItemPerBag: {
    type: Number,
  },
  boxWeight: {
    type: String,
  },
  boxDimensions: {
    type: String,
  },
  isLabelSent: {
    type: Boolean,
    require: true,
  },
});

export const userModel = mongoose.model('users', userSchema);
