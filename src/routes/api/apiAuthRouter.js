import express from 'express';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { User } from '../../../db/models';
import messageByStatus from '../../utils/messageByStatus';

require('dotenv').config();

const apiAuthRouter = express.Router();

apiAuthRouter.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        phone,
        name,
        hashpass: await bcrypt.hash(password, 10),
      },
    });
    if (!created) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    req.session.user = { id: user.id, name: user.name, email: user.email };

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

apiAuthRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'no user full data' });
  }
  const currentUser = await User.findOne({
    where: { email },
  });
  if (!currentUser || !(await bcrypt.compare(password, currentUser.password))) {
    return res.status(401).json({ message: 'email not exists' });
  }
  req.session.user = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
  };
  res.sendStatus(200);
});

apiAuthRouter.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie(process.env.COOKIE_NAME);
  // res.sendStatus(200);
  res.redirect('/');
});

apiAuthRouter.post('/sms', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(500).json({ message: 'No phone provided' });
    const response = await axios.post(
      'https://direct.i-dgtl.ru/api/v1/verifier/send',
      {
        channelType: 'SMS',
        destination: phone,
        gatewayId: process.env.API_KEY_GATEWAY_ID,
      },
      {
        headers: {
          Authorization: `Basic ${process.env.API_KEY_AUTH}`,
          'Content-Type': 'application/json',
        },
      },
    );
    // setTimeout(() => {
    // const response = { data: { uuid: 'uuid', phone } };
    res.json(response.data);
    // }, 2000);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

apiAuthRouter.post('/code', async (req, res) => {
  try {
    const { uuid, code, phone } = req.body;
    const response = await axios.post(
      'https://direct.i-dgtl.ru/api/v1/verifier/check',
      {
        uuid,
        code,
      },
      {
        headers: {
          Authorization: `Basic ${process.env.API_KEY_AUTH}`,
          'Content-Type': 'application/json',
        },
      },
    );
    // setTimeout(async () => {
    //   const response = { data: { status: 'CONFIRMED' } }; // 'CONFIRMED' | 'WRONG_CODE' | 'EXPIRED' | 'NOT_FOUND'
    if (response.data.status === 'CONFIRMED') {
      const [user, created] = await User.findOrCreate({
        where: { phone },
      });
      req.session.user = { id: user.id, phone: user.phone, name: user.name, email: user.email };
      return res.status(200).json({ user, created });
    }
    return res.status(400).json({ message: messageByStatus(response.data.status) });
    // }, 2000);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

export default apiAuthRouter;
