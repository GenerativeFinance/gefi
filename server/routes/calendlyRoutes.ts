import type { Express } from "express";

// Calendly API integration for demo booking
export function registerCalendlyRoutes(app: Express) {
  // Get available time slots
  app.post('/api/calendly/availability', async (req, res) => {
    try {
      const { eventType, startDate, endDate } = req.body;
      
      // Mock availability data for now - in production, integrate with real Calendly API
      const mockAvailability = [
        {
          displayTime: 'Today at 2:00 PM',
          datetime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          timezone: 'EST',
          available: true,
          eventType: eventType
        },
        {
          displayTime: 'Today at 4:30 PM',
          datetime: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
          timezone: 'EST',
          available: true,
          eventType: eventType
        },
        {
          displayTime: 'Tomorrow at 10:00 AM',
          datetime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(),
          timezone: 'EST',
          available: true,
          eventType: eventType
        },
        {
          displayTime: 'Tomorrow at 3:00 PM',
          datetime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000).toISOString(),
          timezone: 'EST',
          available: true,
          eventType: eventType
        },
        {
          displayTime: 'Monday at 11:00 AM',
          datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString(),
          timezone: 'EST',
          available: true,
          eventType: eventType
        }
      ];

      res.json({ availableSlots: mockAvailability });
    } catch (error) {
      console.error('Error fetching Calendly availability:', error);
      res.status(500).json({ message: 'Failed to fetch availability' });
    }
  });

  // Book a demo appointment
  app.post('/api/calendly/book', async (req, res) => {
    try {
      const { datetime, eventType, userInfo } = req.body;
      
      // Mock booking confirmation - in production, integrate with real Calendly API
      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`Demo booking confirmed:`, {
        bookingId,
        datetime,
        eventType,
        userInfo
      });

      res.json({
        success: true,
        bookingId,
        message: 'Demo booked successfully!',
        meetingLink: `https://calendly.com/gefi-demo/${bookingId}`,
        datetime,
        eventType
      });
    } catch (error) {
      console.error('Error booking demo:', error);
      res.status(500).json({ message: 'Failed to book demo' });
    }
  });
}