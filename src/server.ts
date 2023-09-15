import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { userModel } from './models/user.schema';
import { sendMail } from './email';

import mongoose from 'mongoose';
dotenv.config();

mongoose.set('strictQuery', true);

const app = express();
const port = process.env.PORT || 3500;
const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req: Request, res: Response) => {
  res.send('Server is Running...');
});

app.get('/test', (req: Request, res: Response) => {
  res.send('Test API is Running...');
});

app.post('/userlabel', async (req, res) => {
  try {
    const newUser = new userModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userType: req.body.userType,
      companyName: req.body.companyName,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      province: req.body.province,
      postalCode: req.body.postalCode.replace(/ /g, ''),
      phone: req.body.phone,
      numberOfItemPerBag: req.body.numberOfItemPerBag,
      boxWeight: req.body.boxWeight,
      boxDimensions: req.body.boxDimensions,
      isLabelSent: false,
    });
    await newUser.save();
    await sendMail({
      to: `ling.zhang@valordistributions.com`,
      subject: 'test email',
      body: `
      <html>
      <head></head>
      <body>
        <h2>Label Information:</h2>
        <ul>
          ${req.body.companyName ? `<li><strong>Company Name:</strong> ${req.body.companyName}</li>` : ''}
          ${req.body.firstName ? `<li><strong>First Name:</strong> ${req.body.firstName}</li>` : ''}
          ${req.body.lastName ? `<li><strong>Last Name:</strong> ${req.body.lastName}</li>` : ''}
          <li><strong>Email:</strong> ${req.body.email}</li>
          <li><strong>City:</strong> ${req.body.city}</li>
          <li><strong>Province:</strong> ${req.body.province}</li>
          <li><strong>Postal Code:</strong> ${req.body.postalCode}</li>
          ${req.body.phone ? `<li><strong>Phone:</strong> ${req.body.phone}</li>` : ''}
          ${req.body.numberOfItemPerBag ? `<li><strong>Item per Bag:</strong> ${req.body.numberOfItemPerBag}</li>` : ''}
          ${req.body.boxWeight ? `<li><strong>Box Weight:</strong> ${req.body.boxWeight}</li>` : ''}
          ${req.body.boxDimensions ? `<li><strong>Box Dimensions:</strong> ${req.body.boxDimensions}</li>` : ''}
        </ul>
      </body>
    </html>
      `,
    });
    res.status(200).send('User created successfully');
  } catch (error) {
    console.error('Fail to save: ' + error);
    res.status(500).send('Internal Server Error' + error);
  }
});
app.get('/userlabel', async (req, res) => {
  try {
    const userWithoutLabels = await userModel.find({ isLabelSent: false }).exec();
    res.status(200).send(userWithoutLabels);
  } catch (error) {
    console.log('Error happened during finding records' + error);
    res.status(500).send('fail finding records');
  }
});
app.get('/userlabel/:id', async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id }).exec();
    res.status(200).send(user);
  } catch (error) {
    console.log('Error happened during finding records' + error);
    res.status(500).send('fail finding records');
  }
});
app.put('/userlabel/:id', async (req, res) => {
  try {
    const updatedUser = await userModel.findOneAndUpdate({ _id: req.params.id }, { isLabelSent: true });
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

const connection = async () => {
  try {
    if (!process.env.MONGO_CONNECTION_STRING) {
      throw new Error('MONGO_CONNECTION_STRING environment variable is not defined.');
    }

    await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
      ignoreUndefined: true,
    });
    console.log('MongoDB Connected...');

    app.listen(port, () => {
      console.log(`Server Connected: ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connection();

app.use((req: Request, res: Response) => {
  const error = new Error('Not found');
  res.status(404).json({
    message: error.message,
  });
});
