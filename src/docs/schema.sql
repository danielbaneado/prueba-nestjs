CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  roles VARCHAR[] NOT NULL DEFAULT ARRAY['technician'],
  failed_attempts INT DEFAULT 0,
  locked_until TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  plate VARCHAR UNIQUE NOT NULL,
  brand VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  year INT NOT NULL,
  mileage INT DEFAULT 0,
  state VARCHAR NOT NULL DEFAULT 'available',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE mechanics (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  specialty VARCHAR NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE workshops (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE maintenances (
  id UUID PRIMARY KEY,
  type VARCHAR NOT NULL,
  description TEXT NOT NULL,
  mileage INT NOT NULL,
  scheduled_date TIMESTAMP NOT NULL,
  state VARCHAR NOT NULL DEFAULT 'scheduled',
  vehicle_id UUID REFERENCES vehicles(id),
  mechanic_id UUID REFERENCES mechanics(id),
  workshop_id UUID REFERENCES workshops(id),
  work_performed TEXT NULL,
  final_cost NUMERIC NULL,
  completion_date TIMESTAMP NULL,
  final_mileage INT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
