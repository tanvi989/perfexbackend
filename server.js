const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const FROM_NUMBER = process.env.FROM_NUMBER;


const templateMap = {
  option1: {
    name: 'welcome_message_v2_en_replacement_of_hi',
    data: {
      header: { type: 'TEXT', placeholder: 'Welcome to Tripstars Holidays!' },
      body: { placeholders: ['Tanvi', 'Thanks for reaching out!'] },
      buttons: [
        { type: 'URL', parameter: 'https://tripstarsholidays.com' },
        { type: 'URL', parameter: 'https://wa.me/919969953445' }
      ]
    }
  },
  option2: {
    name: 'booking_confirmation_template',
    data: {
      header: { type: 'TEXT', placeholder: 'Your Booking Details' },
      body: { placeholders: ['Tanvi', 'Booking ID: #12345'] },
      buttons: []
    }
  },
  option3: {
    name: 'travel_itinerary_template',
    data: {
      header: { type: 'TEXT', placeholder: 'Itinerary Ready!' },
      body: { placeholders: ['Tanvi', 'Check your itinerary below'] },
      buttons: [{ type: 'URL', parameter: 'https://tripstarsholidays.com/itinerary' }]
    }
  },
  option4: {
    name: 'farewell_template',
    data: {
      header: { type: 'TEXT', placeholder: 'Bon Voyage!' },
      body: { placeholders: ['Tanvi', 'We hope to see you again!'] },
      buttons: []
    }
  }
};

app.post('/send-message', async (req, res) => {
  const { selectedOption, toNumber } = req.body;

  const template = templateMap[selectedOption];
  if (!template) return res.status(400).send({ error: 'Invalid template option' });

  const payload = {
    messages: [
      {
        to: toNumber,
        from: FROM_NUMBER,
        messageId: uuidv4(),
        content: {
          templateName: template.name,
          language: 'en',
          templateData: template.data
        }
      }
    ]
  };

  try {
    const response = await axios.post('https://public.doubletick.io/whatsapp/message/template', payload, {
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      }
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.response?.data || error.message);
  }
});

app.listen(9009, () => console.log('🚀 Server running on http://localhost:9009'));
