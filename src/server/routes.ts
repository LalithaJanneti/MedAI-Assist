// Server API routes registration
// This file wires up all API endpoints to the h3 server
import { createRouter } from 'h3';
import {
  createPatient,
  getPatient,
  updatePatient,
  initiateAICall,
  generateTwiML,
  createAppointment,
  getAvailableSlots,
} from './api/patient';

export const router = createRouter();

// Patient management routes
router.post('/api/patients', createPatient);
router.get('/api/patients/:id', getPatient);
router.patch('/api/patients/:id', updatePatient);

// AI call routes
router.post('/api/ai-call/initiate', initiateAICall);
router.post('/api/ai-call/twiml', generateTwiML);

// Appointment routes
router.post('/api/appointments', createAppointment);
router.get('/api/appointments/available-slots', getAvailableSlots);

export default router;

