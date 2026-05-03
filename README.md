# EasyLoad Mini Truck Booking

Minimal logistics booking system for a single mini truck driver in UAE.

The app keeps the workflow deliberately simple:

1. Customer submits pickup, drop, time, phone, and optional expected price.
2. System calculates `estimated_price` and saves the request as `pending`.
3. Customer contacts the driver by phone or WhatsApp.
4. Driver negotiates externally, records `final_price`, and marks the booking as `booked`.
5. Driver marks the job as `completed` after delivery.

## Features

### For Customers

- **Simple Booking Form**: Easy-to-use form with location suggestions and date/time validation
- **Real-time Price Estimation**: Automatic fare calculation based on distance and base rates
- **Private Booking Access**: Secure token-based access to view and track bookings
- **Contact Integration**: Direct phone and WhatsApp links to driver
- **Responsive Design**: Mobile-first design that works on all devices

### For Drivers

- **Dashboard Overview**: Clean interface showing all booking requests
- **Search Functionality**: Find bookings by ID or customer mobile number
- **Status Management**: Update booking status through the workflow
- **Price Negotiation**: Record final agreed prices and notes
- **Multi-language Support**: English and Malayalam language options
- **Real-time Updates**: Live booking status and customer information

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: CSS Variables with light/dark theme support
- **Backend**: Next.js API routes
- **Database**: Supabase/PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth for driver dashboard
- **Maps Integration**: Google Maps API for distance calculation
- **Deployment Ready**: Optimized for Vercel/Netlify deployment

The data access code is isolated in `lib/bookings/repository.ts`, so it can be replaced later with direct PostgreSQL or a Django API.

## Pricing Model

The system stores three prices:

- `estimated_price`: calculated by the system
- `expected_price`: optional customer input
- `final_price`: actual agreed transaction value, set by the driver

`final_price` is required before a booking can be marked as `booked`.

## API Endpoints

- `POST /api/bookings`: create booking and calculate estimate
- `GET /api/bookings`: list bookings for driver dashboard
- `GET /api/bookings/:id`: get one booking
- `PATCH /api/bookings/:id`: update `status`, `final_price`, and `notes`
- `GET /api/estimate?pickup_location=...&drop_location=...`: return estimated fare

## Local Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for database)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd easylaod

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open:

- **Customer booking**: `http://127.0.0.1:3000`
- **Driver dashboard**: `http://127.0.0.1:3000/driver`

## Driver Configuration

Copy `.env.example` to `.env.local` and change the values for the real driver and fare rules:

```bash
NEXT_PUBLIC_DRIVER_NAME="EasyLoad Driver"
NEXT_PUBLIC_DRIVER_PHONE="971500000000"
NEXT_PUBLIC_DRIVER_LOCATION="Dubai, UAE"
NEXT_PUBLIC_DRIVER_VEHICLE="1 ton mini truck"
NEXT_PUBLIC_DRIVER_HOURS="Available daily"
NEXT_PUBLIC_LOCATION_SUGGESTIONS="Dubai Marina|JLT Dubai|Downtown Dubai|Business Bay|Sharjah Industrial Area|Ajman Corniche"

SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY=""
SUPABASE_ANON_KEY=""
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
DRIVER_AUTH_EMAIL="driver@example.com"

NEXT_PUBLIC_CURRENCY="AED"
FARE_BASE_AED=45
FARE_PER_KM_AED=4.5
FARE_MIN_DISTANCE_KM=5
FARE_MAX_DISTANCE_KM=65

GOOGLE_MAPS_API_KEY=""
GOOGLE_MAPS_REGION="ae"
```

Use the UAE international phone format without `+` for WhatsApp links.

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run the SQL in `supabase/schema.sql`.
4. Put your project URL and service role key in `.env.local`.
5. Create one driver user in Supabase Auth using email/password.
6. Set `DRIVER_AUTH_EMAIL` to that driver email.
7. Restart the Next.js dev server.

The service role key is server-only and must never be exposed in browser code.

Driver dashboard access uses Supabase Auth. Customers do not log in; they receive a private `/booking/{access_token}` link after creating a booking.

RLS is enabled on `public.bookings`. Direct browser reads/writes are denied for both `anon` and `authenticated` roles. The app intentionally uses Next.js API routes for all booking access:

- Driver APIs verify the Supabase Auth session, then use the server-only service role key.
- Customer access only works through the private token endpoint.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── booking/           # Customer booking pages
│   ├── driver/            # Driver dashboard
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── AppFooter.tsx      # Footer component
│   ├── AppHeader.tsx      # Header component
│   ├── BookingForm.tsx    # Main booking form
│   ├── CustomerBookingView.tsx  # Customer booking status
│   ├── DriverAuthGate.tsx # Driver authentication
│   └── DriverDashboard.tsx # Driver dashboard
├── lib/                   # Utility libraries
│   ├── auth/              # Authentication helpers
│   ├── bookings/          # Booking logic
│   ├── driver.ts          # Driver configuration
│   ├── format.ts          # Formatting utilities
│   └── supabase/          # Database client
├── supabase/              # Database schema
└── data/                  # Static data files
```

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- CSS Variables for theming
- Responsive design principles

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform supporting Node.js:

- Netlify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please contact the development team or create an issue in the repository.

The old `data/bookings.json` file is no longer used by the app. Keep it only as a temporary export if you need to manually migrate existing test bookings.

## Data Schema

Each booking has:

- `id`
- `pickup_location`
- `drop_location`
- `pickup_time`
- `drop_time`
- `phone_number`
- `estimated_price`
- `expected_price`
- `final_price`
- `status`: `pending`, `contacted`, `booked`, `completed`, or `rejected`
- `notes`
- `created_at`
- `updated_at`

## Notes

The current estimate function is deterministic and does not call paid map APIs. For production fare accuracy, replace `lib/bookings/pricing.ts` with a distance provider such as Google Maps, Mapbox, or a UAE-specific route API.
